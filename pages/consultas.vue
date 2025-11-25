<template>
  <div class="container mx-auto px-4 py-6 space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-50">
          Consultas de Resultados
        </h1>
        <p class="text-surface-600 dark:text-surface-400 mt-1">
          Busque e analise os resultados dos cruzamentos realizados
        </p>
      </div>
    </div>

    <!-- Filtros de Busca -->
    <Card>
      <template #content>
        <QueryFilters />
      </template>
    </Card>

    <!-- Tabela de Resultados -->
    <Card>
      <template #content>
        <ResultsTable @compare="handleCompare" />
      </template>
    </Card>

    <!-- Modal de Comparação -->
    <ComparisonDialog
      v-model:visible="showComparisonDialog"
      :result="selectedResult"
    />
  </div>
</template>

<script setup lang="ts">
// import Card from 'primevue/card' // Removido - usando auto-import
import QueryFilters from '~/components/features/queries/QueryFilters.vue'
import ResultsTable from '~/components/features/queries/ResultsTable.vue'
import ComparisonDialog from '~/components/features/queries/ComparisonDialog.vue'
import type { QueryResult } from '~/types/api'
import { useQueriesStore } from '~/stores/queries'

// Define metadata da página
definePageMeta({
  layout: 'default'
})

// Título da página
useHead({
  title: 'Consultas | SIRC Dashboard'
})

const store = useQueriesStore()
const route = useRoute()

// State
const showComparisonDialog = ref(false)
const selectedResult = ref<QueryResult | null>(null)

/**
 * Handler para abrir modal de comparação
 */
const handleCompare = async (result: QueryResult) => {
  selectedResult.value = result
  showComparisonDialog.value = true
}

/**
 * Busca inicial ou com filtro vindo da navegação
 */
onMounted(async () => {
  // Se vier da página de cruzamentos com filtro de crossingId
  const crossingId = route.query.crossingId as string | undefined
  
  if (crossingId) {
    store.updateFilters({ crossingId })
  }
  
  // Busca resultados
  await store.searchResults()
})
</script>