<template>
    <div class="bg-surface-0 dark:bg-surface-900 rounded-lg border border-surface-200 dark:border-surface-700 p-4">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <i class="pi pi-filter text-surface-500 dark:text-surface-400" />
          <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-0">
            Filtros
          </h3>
          <Badge 
            v-if="activeFiltersCount > 0"
            :value="activeFiltersCount"
            severity="info"
          />
        </div>
        
        <Button
          v-if="hasActiveFilters"
          label="Limpar"
          icon="pi pi-times"
          text
          size="small"
          severity="secondary"
          @click="handleReset"
        />
      </div>
  
      <!-- Formulário de Filtros -->
      <form @submit.prevent="handleApply" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Nome do Arquivo -->
        <div class="flex flex-col gap-2">
          <label for="filter-name" class="text-sm font-medium text-surface-700 dark:text-surface-300">
            Nome do Arquivo
          </label>
          <InputText
            id="filter-name"
            v-model="localFilters.name"
            placeholder="Buscar por nome..."
            :pt="{
              root: { class: 'w-full' }
            }"
          />
        </div>
  
        <!-- Tipo -->
        <div class="flex flex-col gap-2">
          <label for="filter-type" class="text-sm font-medium text-surface-700 dark:text-surface-300">
            Tipo
          </label>
          <Dropdown
            id="filter-type"
            v-model="localFilters.type"
            :options="typeOptions"
            option-label="label"
            option-value="value"
            placeholder="Todos os tipos"
            show-clear
            :pt="{
              root: { class: 'w-full' }
            }"
          />
        </div>
  
        <!-- Período Inicial -->
        <div class="flex flex-col gap-2">
          <label for="filter-start" class="text-sm font-medium text-surface-700 dark:text-surface-300">
            Período Inicial
          </label>
          <Calendar
            id="filter-start"
            v-model="localFilters.referenceStart"
            view="month"
            date-format="mm/yy"
            placeholder="MM/AAAA"
            show-icon
            show-button-bar
            :pt="{
              root: { class: 'w-full' }
            }"
          />
        </div>
  
        <!-- Período Final -->
        <div class="flex flex-col gap-2">
          <label for="filter-end" class="text-sm font-medium text-surface-700 dark:text-surface-300">
            Período Final
          </label>
          <Calendar
            id="filter-end"
            v-model="localFilters.referenceEnd"
            view="month"
            date-format="mm/yy"
            placeholder="MM/AAAA"
            show-icon
            show-button-bar
            :pt="{
              root: { class: 'w-full' }
            }"
          />
        </div>
  
        <!-- Status -->
        <div class="flex flex-col gap-2 sm:col-span-2">
          <label for="filter-status" class="text-sm font-medium text-surface-700 dark:text-surface-300">
            Status
          </label>
          <MultiSelect
            id="filter-status"
            v-model="localFilters.status"
            :options="statusOptions"
            option-label="label"
            option-value="value"
            placeholder="Todos os status"
            display="chip"
            :pt="{
              root: { class: 'w-full' }
            }"
          />
        </div>
  
        <!-- Botões de Ação -->
        <div class="flex items-end gap-2 sm:col-span-2 lg:col-span-2">
          <Button
            type="submit"
            label="Filtrar"
            icon="pi pi-search"
            :loading="loading"
            class="flex-1"
          />
          <Button
            type="button"
            label="Limpar"
            icon="pi pi-filter-slash"
            severity="secondary"
            outlined
            @click="handleReset"
            :disabled="!hasActiveFilters"
            class="flex-1"
          />
        </div>
      </form>
    </div>
  </template>
  
<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import MultiSelect from 'primevue/multiselect'
import Badge from 'primevue/badge'
import { useFilesStore } from '~/stores/files'
import { useFileFilters } from '~/composables/useFileFilters'

const store = useFilesStore()
const { 
  localFilters, 
  typeOptions, 
  statusOptions, 
  applyFilters, 
  resetFilters,
  hasActiveFilters,
  activeFiltersCount 
} = useFileFilters()

const loading = computed(() => store.loading)
  
  /**
   * Aplica filtros
   */
  const handleApply = () => {
    applyFilters()
  }
  
  /**
   * Reseta filtros
   */
  const handleReset = () => {
    resetFilters()
  }
  </script>