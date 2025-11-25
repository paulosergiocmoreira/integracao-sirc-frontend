<template>
    <div class="bg-surface-0 dark:bg-surface-900 rounded-lg border border-surface-200 dark:border-surface-700 p-6">
      <!-- Header com Badge -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-0">
          Filtros
        </h3>
        <Badge 
          v-if="hasActiveFilters" 
          :value="activeFiltersCount" 
          severity="info"
        />
      </div>
  
      <!-- Formulário de Filtros -->
      <form @submit.prevent="handleApply" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Arquivo -->
        <div class="flex flex-col gap-2">
          <label for="filter-file" class="text-sm font-medium text-surface-700 dark:text-surface-300">
            Arquivo
          </label>
          <Dropdown
            id="filter-file"
            v-model="localFilters.fileId"
            :options="fileOptions"
            option-label="label"
            option-value="value"
            placeholder="Selecione um arquivo"
            show-clear
            :pt="{
              root: { class: 'w-full' }
            }"
          />
        </div>
  
        <!-- Período de Referência (Início) -->
        <div class="flex flex-col gap-2">
          <label for="filter-ref-start" class="text-sm font-medium text-surface-700 dark:text-surface-300">
            Referência (De)
          </label>
          <Calendar
            id="filter-ref-start"
            v-model="localFilters.referenceStart"
            view="month"
            date-format="mm/yy"
            placeholder="MM/AAAA"
            show-icon
            icon-display="input"
            :pt="{
              root: { class: 'w-full' }
            }"
          />
        </div>
  
        <!-- Período de Referência (Fim) -->
        <div class="flex flex-col gap-2">
          <label for="filter-ref-end" class="text-sm font-medium text-surface-700 dark:text-surface-300">
            Referência (Até)
          </label>
          <Calendar
            id="filter-ref-end"
            v-model="localFilters.referenceEnd"
            view="month"
            date-format="mm/yy"
            placeholder="MM/AAAA"
            show-icon
            icon-display="input"
            :pt="{
              root: { class: 'w-full' }
            }"
          />
        </div>
  
        <!-- Percentual Mínimo -->
        <div class="flex flex-col gap-2">
          <label for="filter-perc-min" class="text-sm font-medium text-surface-700 dark:text-surface-300">
            % Hits (Mínimo)
          </label>
          <InputNumber
            id="filter-perc-min"
            v-model="localFilters.hitPercentageMin"
            placeholder="0"
            suffix="%"
            :min="0"
            :max="100"
            :pt="{
              root: { class: 'w-full' }
            }"
          />
        </div>
  
        <!-- Percentual Máximo -->
        <div class="flex flex-col gap-2">
          <label for="filter-perc-max" class="text-sm font-medium text-surface-700 dark:text-surface-300">
            % Hits (Máximo)
          </label>
          <InputNumber
            id="filter-perc-max"
            v-model="localFilters.hitPercentageMax"
            placeholder="100"
            suffix="%"
            :min="0"
            :max="100"
            :pt="{
              root: { class: 'w-full' }
            }"
          />
        </div>
  
        <!-- Data de Execução (Início) -->
        <div class="flex flex-col gap-2">
          <label for="filter-date-start" class="text-sm font-medium text-surface-700 dark:text-surface-300">
            Data Execução (De)
          </label>
          <Calendar
            id="filter-date-start"
            v-model="localFilters.dateStart"
            date-format="dd/mm/yy"
            placeholder="DD/MM/AAAA"
            show-icon
            icon-display="input"
            :pt="{
              root: { class: 'w-full' }
            }"
          />
        </div>
  
        <!-- Data de Execução (Fim) -->
        <div class="flex flex-col gap-2">
          <label for="filter-date-end" class="text-sm font-medium text-surface-700 dark:text-surface-300">
            Data Execução (Até)
          </label>
          <Calendar
            id="filter-date-end"
            v-model="localFilters.dateEnd"
            date-format="dd/mm/yy"
            placeholder="DD/MM/AAAA"
            show-icon
            icon-display="input"
            :pt="{
              root: { class: 'w-full' }
            }"
          />
        </div>
  
        <!-- Botões de Ação -->
        <div class="flex items-end gap-2 md:col-span-2 lg:col-span-1">
          <Button
            type="submit"
            label="Filtrar"
            icon="pi pi-search"
            :loading="loading"
            :disabled="loading"
            class="flex-1"
            aria-label="Aplicar filtros"
          />
          <Button
            type="button"
            label="Limpar"
            icon="pi pi-filter-slash"
            severity="secondary"
            outlined
            @click="handleReset"
            :disabled="!hasActiveFilters || loading"
            class="flex-1"
            aria-label="Limpar todos os filtros"
          />
        </div>
      </form>
    </div>
  </template>
  
<script setup lang="ts">
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import InputNumber from 'primevue/inputnumber'
import Badge from 'primevue/badge'

/**
 * Props do componente
 */
interface Props {
  /**
   * Aplicar filtros automaticamente ao mudar
   */
  autoApply?: boolean
  /**
   * Mostrar filtros avançados
   */
  showAdvanced?: boolean
  /**
   * Tempo de debounce para auto-apply (ms)
   */
  debounceMs?: number
}

const props = withDefaults(defineProps<Props>(), {
  autoApply: false,
  showAdvanced: true,
  debounceMs: 300
})

/**
 * Emits do componente
 */
const emit = defineEmits<{
  filtersApplied: []
  filtersReset: []
}>()

const store = useCrossingsStore()
const toast = useToastMessages()

const { 
  localFilters, 
  fileOptions,
  applyFilters, 
  resetFilters,
  hasActiveFilters,
  activeFiltersCount 
} = useCrossingFilters()

const loading = computed(() => store.loading)

/**
 * Função de debounce para auto-apply
 */
let debounceTimer: NodeJS.Timeout | null = null

const debouncedApply = async () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  
  debounceTimer = setTimeout(async () => {
    try {
      await applyFilters()
      emit('filtersApplied')
    } catch (error) {
      console.error('Erro ao aplicar filtros:', error)
      toast.messages.networkError()
    }
  }, props.debounceMs)
}

/**
 * Aplica filtros com error handling
 */
const handleApply = async () => {
  try {
    await applyFilters()
    emit('filtersApplied')
  } catch (error) {
    console.error('Erro ao aplicar filtros:', error)
    toast.messages.networkError()
  }
}

/**
 * Reseta filtros com error handling
 */
const handleReset = async () => {
  try {
    resetFilters()
    emit('filtersReset')
  } catch (error) {
    console.error('Erro ao resetar filtros:', error)
    toast.messages.networkError()
  }
}

/**
 * Watch para auto-apply quando habilitado
 */
watch(localFilters, () => {
  if (props.autoApply) {
    debouncedApply()
  }
}, { deep: true })
</script>