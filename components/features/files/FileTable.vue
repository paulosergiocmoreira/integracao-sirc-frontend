<template>
    <div class="bg-surface-0 dark:bg-surface-900 rounded-lg border border-surface-200 dark:border-surface-700">
      <!-- DataTable -->
      <DataTable
        :value="files"
        :loading="loading"
        striped-rows
        responsive-layout="scroll"
        :pt="{
          root: { class: 'rounded-lg overflow-hidden' },
          header: { class: 'bg-surface-50 dark:bg-surface-800' },
          loadingIcon: { class: 'text-primary' }
        }"
      >
        <!-- Loading State -->
        <template #loading>
          <div class="flex items-center justify-center py-8">
            <i class="pi pi-spin pi-spinner text-4xl text-primary" />
          </div>
        </template>
  
        <!-- Empty State -->
        <template #empty>
          <div class="flex flex-col items-center justify-center py-12 text-center">
            <i class="pi pi-inbox text-6xl text-surface-400 dark:text-surface-500 mb-4" />
            <h3 class="text-lg font-semibold text-surface-700 dark:text-surface-300 mb-2">
              Nenhum arquivo encontrado
            </h3>
            <p class="text-sm text-surface-500 dark:text-surface-400">
              {{ hasFilters ? 'Tente ajustar os filtros' : 'Faça upload do primeiro arquivo' }}
            </p>
          </div>
        </template>
  
        <!-- Nome do Arquivo -->
        <Column field="name" header="Nome do Arquivo" :sortable="true">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <i 
                :class="getFileIcon(data.name)" 
                class="text-lg text-surface-500 dark:text-surface-400"
              />
              <span class="font-medium text-surface-900 dark:text-surface-0">
                {{ data.name }}
              </span>
            </div>
          </template>
        </Column>
  
        <!-- Tipo -->
        <Column field="type" header="Tipo" :sortable="true">
          <template #body="{ data }">
            <Badge 
              :value="formatFileType(data.type)" 
              :severity="data.type === 'mensal' ? 'info' : 'secondary'"
            />
          </template>
        </Column>
  
        <!-- Referência -->
        <Column field="reference" header="Referência" :sortable="true">
          <template #body="{ data }">
            <span class="text-surface-700 dark:text-surface-300">
              {{ data.reference }}
            </span>
          </template>
        </Column>
  
        <!-- Data de Upload -->
        <Column field="uploadDate" header="Upload" :sortable="true">
          <template #body="{ data }">
            <div class="flex flex-col gap-1">
              <span class="text-sm text-surface-900 dark:text-surface-0">
                {{ formatUploadData(data.uploadDate).date }}
              </span>
              <span class="text-xs text-surface-500 dark:text-surface-400">
                {{ formatUploadData(data.uploadDate).time }}
              </span>
            </div>
          </template>
        </Column>
  
        <!-- Status -->
        <Column field="status" header="Status" :sortable="true">
          <template #body="{ data }">
            <Badge 
              :value="formatFileStatus(data.status)" 
              :severity="getStatusSeverity(data.status)"
            />
          </template>
        </Column>
  
        <!-- Último Cruzamento -->
        <Column field="lastCrossing" header="Último Cruzamento">
          <template #body="{ data }">
            <span 
              v-if="data.lastCrossing" 
              class="text-sm text-surface-700 dark:text-surface-300"
            >
              {{ formatRelativeDate(data.lastCrossing) }}
            </span>
            <span v-else class="text-sm text-surface-400 dark:text-surface-500">
              Nunca
            </span>
          </template>
        </Column>
  
        <!-- Ações -->
        <Column header="Ações" :frozen="true" align-frozen="right">
          <template #body="{ data }">
            <div class="flex gap-2">
              <!-- Agendar -->
              <Button
                v-tooltip.top="'Agendar cruzamento'"
                icon="pi pi-calendar-plus"
                severity="info"
                text
                rounded
                @click="handleSchedule(data)"
                :disabled="data.status === 'em-execucao'"
                aria-label="Agendar cruzamento"
              />
  
              <!-- Executar -->
              <Button
                v-tooltip.top="'Executar agora'"
                icon="pi pi-play"
                severity="success"
                text
                rounded
                @click="handleExecute(data)"
                :disabled="data.status === 'em-execucao'"
                aria-label="Executar cruzamento"
              />
  
              <!-- Excluir -->
              <Button
                v-tooltip.top="'Excluir arquivo'"
                icon="pi pi-trash"
                severity="danger"
                text
                rounded
                @click="handleDelete(data)"
                :disabled="data.status === 'em-execucao'"
                aria-label="Excluir arquivo"
              />
            </div>
          </template>
        </Column>
      </DataTable>
  
      <!-- Paginação -->
      <div 
        v-if="totalFiles > 0"
        class="flex items-center justify-between px-4 py-3 border-t border-surface-200 dark:border-surface-700"
      >
        <div class="flex items-center gap-2">
          <span class="text-sm text-surface-600 dark:text-surface-400">
            Itens por página:
          </span>
          <Dropdown
            :model-value="filters.limit"
            :options="[10, 20, 50]"
            @update:model-value="handleLimitChange"
            :pt="{
              root: { class: 'w-20' }
            }"
          />
        </div>
  
        <div class="flex items-center gap-4">
          <span class="text-sm text-surface-600 dark:text-surface-400">
            {{ paginationText }}
          </span>
          
          <Paginator
            :rows="filters.limit || 10"
            :total-records="totalFiles"
            :first="((filters.page || 1) - 1) * (filters.limit || 10)"
            @page="handlePageChange"
            :pt="{
              root: { class: 'bg-transparent border-0' }
            }"
          />
        </div>
      </div>
  
      <!-- Dialog de Confirmação de Exclusão -->
      <ConfirmDialog />
    </div>
  </template>
  
<script setup lang="ts">
import { computed } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import Dropdown from 'primevue/dropdown'
import Paginator from 'primevue/paginator'
import ConfirmDialog from 'primevue/confirmdialog'
import Tooltip from 'primevue/tooltip'
import { useConfirm } from 'primevue/useconfirm'
import type { File } from '~/types/api'
import { useFilesStore } from '~/stores/files'
import { useToastMessages } from '~/composables/useToastMessages'
import { useFileIcons } from '~/composables/useFileIcons'
import { useFileFormatting } from '~/composables/useFileFormatting'

// Diretiva tooltip
const vTooltip = Tooltip

const store = useFilesStore()
const confirm = useConfirm()
const toast = useToastMessages()
const { getFileIcon } = useFileIcons()
const { 
  getStatusSeverity, 
  formatUploadData, 
  formatRelativeDate, 
  formatFileType, 
  formatFileStatus 
} = useFileFormatting()
  
  // Emits
  const emit = defineEmits<{
    schedule: [file: File]
  }>()

  // Computed - usando dados da store
  const files = computed(() => store.paginatedFiles)
  const loading = computed(() => store.loading)
  const totalFiles = computed(() => store.totalFiles)
  const filters = computed(() => store.filters)

  // Busca dados iniciais
  await store.fetchFiles()
  
  const hasFilters = computed(() => {
    const f = filters.value
    return !!(f.name || f.type || f.status?.length || f.referenceStart || f.referenceEnd)
  })
  
  const paginationText = computed(() => {
    const page = filters.value.page || 1
    const limit = filters.value.limit || 10
    const start = (page - 1) * limit + 1
    const end = Math.min(page * limit, totalFiles.value)
    return `${start}-${end} de ${totalFiles.value}`
  })
  
  
  /**
   * Handler para mudança de página
   */
  const handlePageChange = (event: any) => {
    const page = Math.floor(event.first / event.rows) + 1
    store.changePage(page)
  }
  
  /**
   * Handler para mudança de itens por página
   */
  const handleLimitChange = (limit: number) => {
    store.changeLimit(limit)
  }
  
  /**
   * Handler para agendar cruzamento
   */
  const handleSchedule = (file: File) => {
    emit('schedule', file)
  }
  
  /**
   * Handler para executar cruzamento
   */
  const handleExecute = (file: File) => {
    confirm.require({
      message: `Deseja executar o cruzamento para o arquivo "${file.name}"?`,
      header: 'Confirmar Execução',
      icon: 'pi pi-play',
      acceptLabel: 'Executar',
      rejectLabel: 'Cancelar',
      accept: async () => {
        try {
          await store.executeFile(file.id)
        } catch (error) {
          console.error('Erro ao executar cruzamento:', error)
          toast.error('Erro', 'Erro ao executar cruzamento')
        }
      }
    })
  }
  
  /**
   * Handler para excluir arquivo
   */
  const handleDelete = (file: File) => {
    confirm.require({
      message: `Tem certeza que deseja excluir o arquivo "${file.name}"? Esta ação não pode ser desfeita.`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptClass: 'p-button-danger',
      accept: async () => {
        try {
          await store.deleteFile(file.id)
        } catch (error) {
          console.error('Erro ao excluir arquivo:', error)
          toast.error('Erro', 'Erro ao excluir arquivo')
        }
      }
    })
  }
  </script>