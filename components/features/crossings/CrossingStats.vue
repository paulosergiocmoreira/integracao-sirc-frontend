<template>
  <ErrorBoundary 
    :on-retry="handleRetry"
    :retry-config="{ maxRetries: 3, retryDelay: 2000, exponentialBackoff: true }"
  >
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-8">
      <i class="pi pi-spin pi-spinner text-4xl text-primary" />
    </div>
    
    <!-- Empty State -->
    <div v-else-if="!hasData" class="text-center py-12">
      <i class="pi pi-chart-bar text-6xl text-surface-400 dark:text-surface-500 mb-4" />
      <h3 class="text-lg font-semibold text-surface-700 dark:text-surface-300 mb-2">
        Nenhuma estatística disponível
      </h3>
      <p class="text-sm text-surface-500 dark:text-surface-400">
        Execute cruzamentos para ver as estatísticas
      </p>
    </div>
    
    <!-- Stats Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total de Cruzamentos -->
      <Card class="bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <div class="text-surface-500 dark:text-surface-400 text-sm font-medium mb-2">
                Total de Cruzamentos
              </div>
              <div class="text-3xl font-bold text-surface-900 dark:text-surface-0">
                {{ formatNumber(store.summary.totalCrossings) }}
              </div>
            </div>
            <div class="p-3 bg-primary/10 rounded-lg">
              <i class="pi pi-sync text-2xl text-primary" />
            </div>
          </div>
        </template>
      </Card>
  
      <!-- Total de Óbitos -->
      <Card class="bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <div class="text-surface-500 dark:text-surface-400 text-sm font-medium mb-2">
                Total de Óbitos
              </div>
              <div class="text-3xl font-bold text-surface-900 dark:text-surface-0">
                {{ formatNumber(stats.totalDeaths) }}
              </div>
            </div>
            <div class="p-3 bg-surface-100 dark:bg-surface-800 rounded-lg">
              <i class="pi pi-users text-2xl text-surface-600 dark:text-surface-400" />
            </div>
          </div>
        </template>
      </Card>
  
      <!-- Total de Hits -->
      <Card class="bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <div class="text-surface-500 dark:text-surface-400 text-sm font-medium mb-2">
                Total de Hits
              </div>
              <div class="text-3xl font-bold text-green-600 dark:text-green-400">
                {{ formatNumber(stats.totalHits) }}
              </div>
            </div>
            <div class="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <i class="pi pi-check-circle text-2xl text-green-600 dark:text-green-400" />
            </div>
          </div>
        </template>
      </Card>
  
      <!-- Percentual Médio -->
      <Card class="bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <div class="text-surface-500 dark:text-surface-400 text-sm font-medium mb-2">
                Percentual Médio
              </div>
              <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {{ formatPercentage(stats.averageHitPercentage) }}
              </div>
            </div>
            <div class="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <i class="pi pi-percentage text-2xl text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </template>
      </Card>
    </div>
  </ErrorBoundary>
</template>
  
<script setup lang="ts">
import Card from 'primevue/card'
import { formatNumber, formatPercentage } from '~/utils/formatters'

/**
 * Props do componente
 */
interface Props {
  /**
   * Mostrar detalhes adicionais
   */
  showDetails?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showDetails: true
})

const store = useCrossingsStore()

/**
 * Dados computados
 */
const stats = computed(() => store.filteredSummary)
const loading = computed(() => store.loading)
const hasData = computed(() => {
  // Usar summary geral em vez de filteredSummary para verificar se há dados
  const generalStats = store.summary
  return generalStats.totalCrossings > 0
})

// Busca dados iniciais
await store.fetchCrossings()

/**
 * Handler para retry do ErrorBoundary
 * Recarrega estatísticas com controle de retry
 */
const handleRetry = async () => {
  try {
    await store.fetchCrossings()
  } catch (error) {
    // Erro será capturado pelo ErrorBoundary
    console.error('Erro ao recarregar estatísticas:', error)
  }
}
</script>