// stores/queries.ts
// Pinia store para gerenciamento de consultas e resultados

import { defineStore } from 'pinia'
import type { QueryResult, QueryFilters, HitTypeValue, ComparisonResult } from '~/types/api'
import { MOCK_QUERY_RESULTS, simulateDelay, simulateError } from '~/stores/mocks'
import { useToastMessages } from '~/composables/useToastMessages'

interface QueriesState {
  results: QueryResult[]
  loading: boolean
  selectedResult: QueryResult | null
  comparisonResult: ComparisonResult | null
  filters: QueryFilters
}

/**
 * Store de consultas
 * 
 * Gerencia:
 * - Busca de resultados de cruzamentos
 * - Filtros avançados
 * - Comparação com sistema pessoal
 * - Exportação de dados
 */
export const useQueriesStore = defineStore('queries', {
  state: (): QueriesState => ({
    results: [],
    loading: false,
    selectedResult: null,
    comparisonResult: null,
    filters: {
      cpf: undefined,
      name: undefined,
      crossingId: undefined,
      referenceStart: undefined,
      referenceEnd: undefined,
      hitTypes: undefined,
      includeNoHits: false,
      page: 1,
      limit: 10
    }
  }),

  getters: {
    /**
     * Resultados filtrados
     */
    filteredResults: (state): QueryResult[] => {
      let result = [...state.results]

      // Filtro por CPF
      if (state.filters.cpf) {
        const searchCPF = state.filters.cpf.replace(/\D/g, '')
        result = result.filter(r => r.cpf.replace(/\D/g, '').includes(searchCPF))
      }

      // Filtro por nome
      if (state.filters.name) {
        const searchTerm = state.filters.name.toLowerCase()
        result = result.filter(r => 
          r.name.toLowerCase().includes(searchTerm) ||
          r.motherName.toLowerCase().includes(searchTerm)
        )
      }

      // Filtro por cruzamento
      if (state.filters.crossingId) {
        result = result.filter(r => r.crossingId === state.filters.crossingId)
      }

      // Filtro por período de referência
      if (state.filters.referenceStart || state.filters.referenceEnd) {
        result = result.filter(r => {
          const ref = r.fileReference
          const start = state.filters.referenceStart
          const end = state.filters.referenceEnd

          if (start && ref < start) return false
          if (end && ref > end) return false

          return true
        })
      }

      // Filtro por tipos de hit
      if (state.filters.hitTypes && state.filters.hitTypes.length > 0) {
        result = result.filter(r => 
          r.hitTypes.some(hit => state.filters.hitTypes?.includes(hit))
        )
      }

      // Filtro: incluir/excluir sem hits
      if (!state.filters.includeNoHits) {
        result = result.filter(r => r.hitTypes.length > 0)
      }

      return result
    },

    /**
     * Resultados paginados
     */
    paginatedResults: (state): QueryResult[] => {
      const filtered = (this as any).filteredResults
      const page = state.filters.page || 1
      const limit = state.filters.limit || 10
      const start = (page - 1) * limit
      const end = start + limit

      return filtered.slice(start, end)
    },

    /**
     * Total de resultados filtrados
     */
    totalResults: (state): number => {
      return (this as any).filteredResults.length
    },

    /**
     * Total de páginas
     */
    totalPages: (state): number => {
      const total = (this as any).totalResults
      const limit = state.filters.limit || 10
      return Math.ceil(total / limit)
    },

    /**
     * Estatísticas gerais dos resultados
     */
    statistics: (state): {
      total: number
      withHits: number
      withoutHits: number
      averageMatchScore: number
      hitTypeDistribution: Record<HitTypeValue, number>
    } => {
      const filtered = (this as any).filteredResults as QueryResult[]

      const withHits = filtered.filter(r => r.hitTypes.length > 0)
      const withoutHits = filtered.filter(r => r.hitTypes.length === 0)

      const avgScore = withHits.length > 0
        ? withHits.reduce((sum, r) => sum + r.matchScore, 0) / withHits.length
        : 0

      // Distribuição de tipos de hit
      const hitTypeDistribution: Record<HitTypeValue, number> = {
        'hit-perfeito': 0,
        'cpf-completo': 0,
        'cpf-incompleto': 0,
        'data-nascimento': 0,
        'hit-com-falecido': 0
      }

      filtered.forEach(r => {
        r.hitTypes.forEach(hitType => {
          hitTypeDistribution[hitType]++
        })
      })

      return {
        total: filtered.length,
        withHits: withHits.length,
        withoutHits: withoutHits.length,
        averageMatchScore: Math.round(avgScore * 10) / 10,
        hitTypeDistribution
      }
    },

    /**
     * Verifica se há filtros ativos
     */
    hasActiveFilters: (state): boolean => {
      const f = state.filters
      return !!(
        f.cpf ||
        f.name ||
        f.crossingId ||
        f.referenceStart ||
        f.referenceEnd ||
        (f.hitTypes && f.hitTypes.length > 0) ||
        f.includeNoHits
      )
    }
  },

  actions: {
    /**
     * Busca resultados (simulação com dados mockados)
     * Com controle de concorrência e debounce
     */
    async searchResults() {
      // Previne chamadas simultâneas
      if (this.loading) {
        console.warn('Busca de resultados já em andamento, ignorando chamada duplicada')
        return
      }

      this.loading = true

      try {
        await simulateDelay()
        simulateError()

        // Em produção, seria:
        // const response = await $fetch('/api/queries/results', {
        //   method: 'GET',
        //   query: this.filters
        // })

        // Simula dados mockados
        this.results = MOCK_QUERY_RESULTS

        const toast = useToastMessages()
        const total = this.filteredResults.length
        
        if (total > 0) {
          toast.messages.resultsFound(total)
        } else {
          toast.messages.noResults()
        }
      } catch (error) {
        console.error('Erro ao buscar resultados:', error)
        const toast = useToastMessages()
        toast.messages.genericError()
        this.results = []
        throw error // Re-throw para ErrorBoundary capturar
      } finally {
        this.loading = false
      }
    },

    /**
     * Compara resultado com sistema pessoal
     * Com controle de concorrência
     */
    async compareWithPersonalSystem(resultId: string) {
      // Previne chamadas simultâneas
      if (this.loading) {
        console.warn('Comparação já em andamento, ignorando chamada duplicada')
        return this.comparisonResult
      }

      this.loading = true

      try {
        await simulateDelay(800, 1200)
        simulateError(0.05) // 5% de chance de erro

        // Em produção, seria:
        // const response = await $fetch('/api/queries/compare', {
        //   method: 'POST',
        //   body: { resultId }
        // })

        // Simula dados mockados
        const result = this.results.find(r => r.id === resultId)
        if (!result) throw new Error('Resultado não encontrado')

        this.comparisonResult = {
          resultId,
          sircData: {
            cpf: result.cpf,
            name: result.name,
            motherName: result.motherName,
            birthDate: result.birthDate,
            deathDate: result.deathDate
          },
          personalSystemData: {
            cpf: result.cpf,
            name: result.name,
            motherName: result.motherName.replace('Silva', 'Santos'), // Simula diferença
            birthDate: result.birthDate,
            status: 'Ativo'
          },
          differences: [
            {
              field: 'Nome da Mãe',
              sircValue: result.motherName,
              personalSystemValue: result.motherName.replace('Silva', 'Santos')
            }
          ]
        }

        const toast = useToastMessages()
        toast.success('Comparação realizada', 'Dados comparados com sucesso')

        return this.comparisonResult
      } catch (error) {
        console.error('Erro ao comparar dados:', error)
        const toast = useToastMessages()
        toast.messages.genericError()
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Exporta resultados para CSV
     */
    async exportResults() {
      try {
        await simulateDelay(500, 800)

        const results = this.filteredResults

        if (results.length === 0) {
          const toast = useToastMessages()
          toast.warning('Nenhum resultado', 'Não há resultados para exportar')
          return
        }

        // Gera CSV
        const headers = [
          'CPF',
          'Nome',
          'Nome da Mãe',
          'Data Nascimento',
          'Data Óbito',
          'Tipos de Hit',
          'Score de Correspondência (%)'
        ]

        const rows = results.map(r => [
          r.cpf,
          r.name,
          r.motherName,
          r.birthDate,
          r.deathDate || '-',
          r.hitTypes.join(', '),
          r.matchScore.toString()
        ])

        const csvContent = [
          headers.join(','),
          ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n')

        // Download do arquivo
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        
        link.setAttribute('href', url)
        link.setAttribute('download', `resultados_sirc_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        const toast = useToastMessages()
        toast.success('Exportação concluída', `${results.length} resultado(s) exportado(s)`)
      } catch (error) {
        console.error('Erro ao exportar resultados:', error)
        const toast = useToastMessages()
        toast.messages.genericError()
      }
    },

    /**
     * Atualiza filtros
     */
    updateFilters(newFilters: Partial<QueryFilters>) {
      this.filters = { ...this.filters, ...newFilters }
    },

    /**
     * Reseta filtros para valores padrão
     */
    resetFilters() {
      this.filters = {
        cpf: undefined,
        name: undefined,
        crossingId: undefined,
        referenceStart: undefined,
        referenceEnd: undefined,
        hitTypes: undefined,
        includeNoHits: false,
        page: 1,
        limit: 10
      }
    },

    /**
     * Seleciona um resultado
     */
    selectResult(result: QueryResult | null) {
      this.selectedResult = result
    },

    /**
     * Limpa resultado de comparação
     */
    clearComparison() {
      this.comparisonResult = null
    }
  }
})