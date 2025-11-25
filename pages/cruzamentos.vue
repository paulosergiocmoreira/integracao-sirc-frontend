<template>
  <div class="flex flex-col gap-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0 mb-2">
          Cruzamentos
        </h1>
        <p class="text-surface-600 dark:text-surface-400">
          Visualize e analise os cruzamentos de dados realizados
        </p>
      </div>
    </div>

    <!-- Cards de Estatísticas -->
    <CrossingStats />

    <!-- Filtros -->
    <CrossingFilters />

    <!-- Tabela de Cruzamentos -->
    <CrossingTable />
  </div>
</template>

<script setup lang="ts">
// Meta tags
useHead({
  title: 'Cruzamentos - SIRC Dashboard',
  meta: [
    {
      name: 'description',
      content: 'Visualização e análise de cruzamentos de dados do SIRC'
    }
  ]
})

const crossingsStore = useCrossingsStore()
const filesStore = useFilesStore()

/**
 * Busca dados ao montar o componente
 */
onMounted(async () => {
  // Busca arquivos primeiro (necessário para dropdown de filtros)
  await filesStore.fetchFiles()
  
  // Busca cruzamentos
  await crossingsStore.fetchCrossings()
})
</script>