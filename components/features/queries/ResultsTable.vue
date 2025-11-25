<template>
    <ErrorBoundary 
      error-message="Erro ao carregar resultados da consulta"
      :on-retry="handleRetry"
      :retry-config="{ maxRetries: 3, retryDelay: 2000, exponentialBackoff: true }"
    >
      <div class="space-y-4">
      <!-- Estatísticas -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-surface-0 dark:bg-surface-800 rounded-lg p-4 border border-surface-200 dark:border-surface-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-surface-600 dark:text-surface-400">Total de Resultados</p>
              <p class="text-2xl font-bold text-surface-900 dark:text-surface-50">
                {{ formatNumber(statistics.total) }}
              </p>
            </div>
            <i class="pi pi-list text-3xl text-blue-500"></i>
          </div>
        </div>
  
        <div class="bg-surface-0 dark:bg-surface-800 rounded-lg p-4 border border-surface-200 dark:border-surface-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-surface-600 dark:text-surface-400">Com Hits</p>
              <p class="text-2xl font-bold text-green-600 dark:text-green-400">
                {{ formatNumber(statistics.withHits) }}
              </p>
            </div>
            <i class="pi pi-check-circle text-3xl text-green-500"></i>
          </div>
        </div>
  
        <div class="bg-surface-0 dark:bg-surface-800 rounded-lg p-4 border border-surface-200 dark:border-surface-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-surface-600 dark:text-surface-400">Sem Hits</p>
              <p class="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {{ formatNumber(statistics.withoutHits) }}
              </p>
            </div>
            <i class="pi pi-times-circle text-3xl text-orange-500"></i>
          </div>
        </div>
  
        <div class="bg-surface-0 dark:bg-surface-800 rounded-lg p-4 border border-surface-200 dark:border-surface-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-surface-600 dark:text-surface-400">Score Médio</p>
              <p class="text-2xl font-bold text-surface-900 dark:text-surface-50">
                {{ formatPercentage(statistics.averageMatchScore, 1) }}
              </p>
            </div>
            <i class="pi pi-chart-bar text-3xl text-purple-500"></i>
          </div>
        </div>
      </div>
  
      <!-- Toolbar -->
      <div class="flex items-center justify-between">
        <div class="text-sm text-surface-600 dark:text-surface-400">
          {{ paginationText }}
        </div>
        
        <Button
          label="Exportar CSV"
          icon="pi pi-download"
          severity="secondary"
          size="small"
          @click="handleExport"
          :disabled="results.length === 0"
          aria-label="Exportar resultados para arquivo CSV"
        />
      </div>
  
      <!-- Tabela -->
      <DataTable
        :value="results"
        :loading="loading"
        striped-rows
        responsive-layout="scroll"
        class="border border-surface-200 dark:border-surface-700 rounded-lg"
        aria-label="Tabela de resultados de consultas"
        role="table"
      >
        <!-- CPF -->
        <Column 
          field="cpf" 
          header="CPF" 
          :sortable="true"
          style="min-width: 150px"
        >
          <template #body="{ data }">
            <span class="font-mono text-sm">{{ data.cpf }}</span>
          </template>
        </Column>
  
        <!-- Nome -->
        <Column 
          field="name" 
          header="Nome" 
          :sortable="true"
          style="min-width: 200px"
        >
          <template #body="{ data }">
            <div class="flex flex-col gap-1">
              <span class="font-medium text-surface-900 dark:text-surface-50">
                {{ data.name }}
              </span>
              <span class="text-xs text-surface-600 dark:text-surface-400">
                Mãe: {{ data.motherName }}
              </span>
            </div>
          </template>
        </Column>
  
        <!-- Data Nascimento -->
        <Column 
          field="birthDate" 
          header="Nascimento" 
          :sortable="true"
          style="min-width: 120px"
        >
          <template #body="{ data }">
            <span class="text-sm">{{ data.birthDate }}</span>
          </template>
        </Column>
  
        <!-- Data Óbito -->
        <Column 
          field="deathDate" 
          header="Óbito" 
          :sortable="true"
          style="min-width: 120px"
        >
          <template #body="{ data }">
            <span v-if="data.deathDate" class="text-sm">
              {{ data.deathDate }}
            </span>
            <span v-else class="text-sm text-surface-400 dark:text-surface-500">
              -
            </span>
          </template>
        </Column>
  
        <!-- Referência -->
        <Column 
          field="fileReference" 
          header="Referência" 
          :sortable="true"
          style="min-width: 100px"
        >
          <template #body="{ data }">
            <Badge :value="data.fileReference" severity="info" />
          </template>
        </Column>
  
        <!-- Tipos de Hit -->
        <Column 
          header="Tipos de Hit" 
          style="min-width: 200px"
        >
          <template #body="{ data }">
            <div v-if="data.hitTypes.length > 0" class="flex flex-wrap gap-1">
              <Badge
                v-for="hitType in data.hitTypes"
                :key="hitType"
                :value="formatHitTypeLabel(hitType)"
                :severity="formatHitTypeSeverity(hitType)"
                size="small"
              />
            </div>
            <span v-else class="text-sm text-surface-400 dark:text-surface-500">
              Sem hits
            </span>
          </template>
        </Column>
  
        <!-- Match Score -->
        <Column 
          field="matchScore" 
          header="Match Score" 
          :sortable="true"
          style="min-width: 150px"
        >
          <template #body="{ data }">
            <div class="flex flex-col gap-2">
              <div class="flex items-center justify-between">
                <span class="text-sm font-semibold">
                  {{ formatPercentage(data.matchScore, 0) }}
                </span>
                <span class="text-xs text-surface-600 dark:text-surface-400">
                  {{ formatScoreLabel(data.matchScore) }}
                </span>
              </div>
              <ProgressBar 
                :value="data.matchScore" 
                :show-value="false"
                :pt="{
                  value: {
                    style: {
                      background: formatScoreColor(data.matchScore)
                    }
                  }
                }"
              />
            </div>
          </template>
        </Column>
  
        <!-- Ações -->
        <Column header="Ações" style="min-width: 120px">
          <template #body="{ data }">
            <div class="flex gap-2">
              <Button
                icon="pi pi-clone"
                severity="secondary"
                size="small"
                rounded
                v-tooltip.top="'Comparar'"
                @click="handleCompare(data)"
                :aria-label="`Comparar dados de ${data.name}`"
              />
            </div>
          </template>
        </Column>
  
        <!-- Empty State -->
        <template #empty>
          <div class="flex flex-col items-center justify-center py-12 text-center">
            <i class="pi pi-search text-6xl text-surface-300 dark:text-surface-600 mb-4"></i>
            <h3 class="text-lg font-semibold text-surface-700 dark:text-surface-300 mb-2">
              Nenhum resultado encontrado
            </h3>
            <p class="text-sm text-surface-600 dark:text-surface-400 mb-4">
              {{ hasFilters ? 'Tente ajustar os filtros de busca' : 'Use os filtros acima para buscar resultados' }}
            </p>
          </div>
        </template>
  
        <!-- Loading State -->
        <template #loading>
          <div class="flex items-center justify-center py-12">
            <ProgressSpinner style="width: 50px; height: 50px" />
          </div>
        </template>
      </DataTable>
  
      <!-- Paginação -->
      <div 
        v-if="results.length > 0"
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
            aria-label="Selecionar número de itens por página"
          />
        </div>
  
        <Paginator
          :rows="filters.limit || 10"
          :total-records="totalResults"
          :first="((filters.page || 1) - 1) * (filters.limit || 10)"
          @page="handlePageChange"
          :pt="{
            root: { class: 'bg-transparent border-0' }
          }"
          aria-label="Navegação de páginas"
        />
      </div>
      </div>
    </ErrorBoundary>
  </template>
  
  <script setup lang="ts">
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import Button from 'primevue/button'
  import Badge from 'primevue/badge'
  import Paginator from 'primevue/paginator'
  import Dropdown from 'primevue/dropdown'
  import ProgressBar from 'primevue/progressbar'
  import ProgressSpinner from 'primevue/progressspinner'
  import Tooltip from 'primevue/tooltip'
  import type { QueryResult, HitTypeValue } from '~/types/api'
  import { useQueriesStore } from '~/stores/queries'
  import { formatNumber, formatPercentage } from '~/utils/formatters'
  import { useQueryFormatting } from '~/composables/useQueryFormatting'
  import ErrorBoundary from '~/components/ui/ErrorBoundary.vue'
  
  // Diretiva tooltip
  const vTooltip = Tooltip
  
  /**
   * Props do componente
   */
  interface Props {
    showActions?: boolean
  }
  
  const props = withDefaults(defineProps<Props>(), {
    showActions: true
  })
  
  /**
   * Emits do componente
   */
  const emit = defineEmits<{
    compare: [result: QueryResult]
  }>()
  
  const store = useQueriesStore()
  const { formatHitTypeLabel, formatHitTypeSeverity, formatScoreLabel, formatScoreColor } = useQueryFormatting()
  
  /**
   * Dados computados
   */
  const results = computed(() => store.paginatedResults)
  const loading = computed(() => store.loading)
  const totalResults = computed(() => store.totalResults)
  const filters = computed(() => store.filters)
  const statistics = computed(() => store.statistics)
  const hasFilters = computed(() => store.hasActiveFilters)
  
  // ✅ Funções de formatação agora vêm do composable (otimizadas)
  
  /**
   * Texto de paginação
   */
  const paginationText = computed(() => {
    const page = filters.value.page || 1
    const limit = filters.value.limit || 10
    const start = (page - 1) * limit + 1
    const end = Math.min(page * limit, totalResults.value)
    
    return `Mostrando ${start}-${end} de ${totalResults.value} resultado(s)`
  })
  
  /**
   * Handlers de paginação
   */
  const handlePageChange = (event: { first: number; rows: number }) => {
    const newPage = Math.floor(event.first / event.rows) + 1
    store.updateFilters({ page: newPage })
  }
  
  const handleLimitChange = (newLimit: number) => {
    store.updateFilters({ limit: newLimit, page: 1 })
  }
  
  /**
   * Handler de comparação
   */
  const handleCompare = (result: QueryResult) => {
    emit('compare', result)
  }
  
  /**
   * Handler de exportação
   */
  const handleExport = async () => {
    await store.exportResults()
  }

  /**
   * Handler para retry do ErrorBoundary
   * Usa controle de retry inteligente
   */
  const handleRetry = async () => {
    try {
      await store.searchResults()
    } catch (error) {
      // Erro será capturado pelo ErrorBoundary
      console.error('Erro no retry de resultados:', error)
    }
  }
  </script>