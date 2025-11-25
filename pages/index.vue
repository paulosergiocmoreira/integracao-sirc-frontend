<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0">
          Arquivos
        </h1>
        <p class="mt-2 text-surface-600 dark:text-surface-400">
          Gerencie os arquivos de óbitos do SIRC
        </p>
      </div>
      
      <Button
        label="Novo Arquivo"
        icon="pi pi-plus"
        @click="showUploadDialog = true"
      />
    </div>

    <!-- Estatísticas -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total de Arquivos -->
      <div class="bg-surface-0 dark:bg-surface-900 rounded-lg border border-surface-200 dark:border-surface-700 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-surface-600 dark:text-surface-400">
              Total de Arquivos
            </p>
            <p class="mt-2 text-3xl font-bold text-surface-900 dark:text-surface-0">
              {{ stats.total }}
            </p>
          </div>
          <div class="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <i class="pi pi-file text-2xl text-primary" />
          </div>
        </div>
      </div>

      <!-- Arquivos Salvos -->
      <div class="bg-surface-0 dark:bg-surface-900 rounded-lg border border-surface-200 dark:border-surface-700 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-surface-600 dark:text-surface-400">
              Salvos
            </p>
            <p class="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
              {{ stats.saved }}
            </p>
          </div>
          <div class="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <i class="pi pi-check-circle text-2xl text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>

      <!-- Arquivos Agendados -->
      <div class="bg-surface-0 dark:bg-surface-900 rounded-lg border border-surface-200 dark:border-surface-700 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-surface-600 dark:text-surface-400">
              Agendados
            </p>
            <p class="mt-2 text-3xl font-bold text-amber-600 dark:text-amber-400">
              {{ stats.scheduled }}
            </p>
          </div>
          <div class="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <i class="pi pi-calendar text-2xl text-amber-600 dark:text-amber-400" />
          </div>
        </div>
      </div>

      <!-- Arquivos com Erro -->
      <div class="bg-surface-0 dark:bg-surface-900 rounded-lg border border-surface-200 dark:border-surface-700 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-surface-600 dark:text-surface-400">
              Com Erro
            </p>
            <p class="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">
              {{ stats.error }}
            </p>
          </div>
          <div class="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <i class="pi pi-times-circle text-2xl text-red-600 dark:text-red-400" />
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <FileFilters />

    <!-- Tabela de Arquivos -->
    <FileTable @schedule="handleSchedule" />

    <!-- Modais -->
    <FileUploadDialog
      v-model:visible="showUploadDialog"
      @success="handleUploadSuccess"
    />

    <ScheduleDialog
      v-model:visible="showScheduleDialog"
      :file="selectedFile"
      @success="handleScheduleSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import type { File } from '~/types/api'

// Meta tags
useHead({
  title: 'Arquivos - SIRC Dashboard',
  meta: [
    {
      name: 'description',
      content: 'Gerenciamento de arquivos de óbitos do SIRC'
    }
  ]
})

const store = useFilesStore()

// State
const showUploadDialog = ref(false)
const showScheduleDialog = ref(false)
const selectedFile = ref<File | null>(null)

/**
 * Estatísticas computadas
 */
const stats = computed(() => {
  const byStatus = store.filesByStatus
  return {
    total: store.files.length,
    saved: byStatus['salvo'],
    scheduled: byStatus['agendado'],
    error: byStatus['erro']
  }
})

/**
 * Handler para agendar arquivo
 */
const handleSchedule = (file: File) => {
  selectedFile.value = file
  showScheduleDialog.value = true
}

/**
 * Handler para sucesso no upload
 */
const handleUploadSuccess = () => {
  // Modal já foi fechado automaticamente
  // Toast de sucesso já foi exibido na store
}

/**
 * Handler para sucesso no agendamento
 */
const handleScheduleSuccess = () => {
  selectedFile.value = null
  // Modal já foi fechado automaticamente
  // Toast de sucesso já foi exibido na store
}

/**
 * Busca arquivos ao montar o componente
 */
onMounted(async () => {
  await store.fetchFiles()
})
</script>