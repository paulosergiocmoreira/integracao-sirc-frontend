// stores/crossings.ts
// Pinia store para gerenciamento de cruzamentos

import { defineStore } from 'pinia'
import type { Crossing, CrossingFilters } from '~/types/api'
import { MOCK_CROSSINGS, simulateDelay } from '~/stores/mocks'
import { useToastMessages } from '~/composables/useToastMessages'

interface CrossingsState {
  crossings: Crossing[]
  loading: boolean
  selectedCrossing: Crossing | null
  filters: CrossingFilters
}

/**
 * Store de cruzamentos
 * 
 * Gerencia:
 * - Listagem de cruzamentos com filtros
 * - Execução de novos cruzamentos
 * - Estatísticas e sumários
 */
export const useCrossingsStore = defineStore('crossings', {
  state: (): CrossingsState => ({
    crossings: [],
    loading: false,
    selectedCrossing: null,
    filters: {
      fileId: undefined,
      referenceStart: undefined,
      referenceEnd: undefined,
      hitPercentageMin: undefined,
      hitPercentageMax: undefined,
      dateStart: undefined,
      dateEnd: undefined,
      page: 1,
      limit: 10
    }
  }),

  getters: {
    /**
     * Cruzamentos filtrados
     */
    filteredCrossings: (state): Crossing[] => {
      let result = [...state.crossings]

      // Filtro por arquivo
      if (state.filters.fileId) {
        result = result.filter(c => c.fileId === state.filters.fileId)
      }

      // Filtro por período de referência
      if (state.filters.referenceStart || state.filters.referenceEnd) {
        result = result.filter(c => {
          const ref = c.reference
          const start = state.filters.referenceStart
          const end = state.filters.referenceEnd

          if (start && ref < start) return false
          if (end && ref > end) return false

          return true
        })
      }

      // Filtro por percentual de hits
      if (state.filters.hitPercentageMin !== undefined) {
        result = result.filter(c => c.hitPercentage >= state.filters.hitPercentageMin!)
      }

      if (state.filters.hitPercentageMax !== undefined) {
        result = result.filter(c => c.hitPercentage <= state.filters.hitPercentageMax!)
      }

      // Filtro por data de execução
      if (state.filters.dateStart || state.filters.dateEnd) {
        result = result.filter(c => {
          const crossingDate = c.crossingDate
          const start = state.filters.dateStart
          const end = state.filters.dateEnd

          if (start && crossingDate < start) return false
          if (end && crossingDate > end) return false

          return true
        })
      }

      // Ordena por data de cruzamento (mais recente primeiro)
      return result.sort((a, b) => 
        new Date(b.crossingDate).getTime() - new Date(a.crossingDate).getTime()
      )
    },

    /**
     * Cruzamentos paginados
     */
    paginatedCrossings(state): Crossing[] {
      const filtered = this.filteredCrossings
      const page = state.filters.page || 1
      const limit = state.filters.limit || 10
      const start = (page - 1) * limit
      const end = start + limit

      return filtered.slice(start, end)
    },

    /**
     * Total de cruzamentos filtrados
     */
    totalCrossings(): number {
      return this.filteredCrossings.length
    },

    /**
     * Total de páginas
     */
    totalPages(state): number {
      const total = this.totalCrossings
      const limit = state.filters.limit || 10
      return Math.ceil(total / limit)
    },

    /**
     * Estatísticas gerais
     */
    summary(state): {
      totalCrossings: number
      totalHits: number
      totalDeaths: number
      averageHitPercentage: number
      lastCrossing: string | null
    } {
      const crossings = state.crossings

      if (crossings.length === 0) {
        return {
          totalCrossings: 0,
          totalHits: 0,
          totalDeaths: 0,
          averageHitPercentage: 0,
          lastCrossing: null
        }
      }

      const totalHits = crossings.reduce((sum, c) => sum + c.totalHits, 0)
      const totalDeaths = crossings.reduce((sum, c) => sum + c.totalDeaths, 0)
      const avgPercentage = crossings.reduce((sum, c) => sum + c.hitPercentage, 0) / crossings.length

      // Encontra o cruzamento mais recente
      const mostRecent = crossings.reduce((latest, current) => {
        return new Date(current.crossingDate) > new Date(latest.crossingDate) 
          ? current 
          : latest
      })

      return {
        totalCrossings: crossings.length,
        totalHits,
        totalDeaths,
        averageHitPercentage: Math.round(avgPercentage * 100) / 100,
        lastCrossing: mostRecent.crossingDate
      }
    },

    /**
     * Estatísticas dos cruzamentos filtrados (para cards)
     */
    filteredSummary(): {
      totalDeaths: number
      totalHits: number
      averageHitPercentage: number
    } {
      const filtered = this.filteredCrossings

      if (filtered.length === 0) {
        return {
          totalDeaths: 0,
          totalHits: 0,
          averageHitPercentage: 0
        }
      }

      const totalDeaths = filtered.reduce((sum, c) => sum + c.totalDeaths, 0)
      const totalHits = filtered.reduce((sum, c) => sum + c.totalHits, 0)
      const avgPercentage = filtered.reduce((sum, c) => sum + c.hitPercentage, 0) / filtered.length

      return {
        totalDeaths,
        totalHits,
        averageHitPercentage: Math.round(avgPercentage * 100) / 100
      }
    }
  },

  actions: {
    /**
     * Busca todos os cruzamentos
     * Com controle de concorrência
     */
    async fetchCrossings() {
      // Previne chamadas simultâneas
      if (this.loading) {
        console.warn('Busca de cruzamentos já em andamento, ignorando chamada duplicada')
        return
      }

      this.loading = true
      const toast = useToastMessages()

      try {
        await simulateDelay()
        
        // Simula chamada API
        this.crossings = [...MOCK_CROSSINGS]
      } catch (error) {
        console.error('Erro ao buscar cruzamentos:', error)
        toast.messages.networkError()
        throw error // Re-throw para ErrorBoundary capturar
      } finally {
        this.loading = false
      }
    },

    /**
     * Executa novo cruzamento para um arquivo
     */
    async executeCrossing(fileId: string, fileName: string, type: string, reference: string) {
      this.loading = true
      const toast = useToastMessages()

      try {
        await simulateDelay(1000, 2000)
        
        // Simula execução de cruzamento
        const newCrossing: Crossing = {
          id: `cross-${String(Date.now()).slice(-3)}`,
          fileId,
          fileName,
          type: type as 'mensal' | 'diario',
          reference,
          crossingDate: new Date().toISOString(),
          totalDeaths: Math.floor(Math.random() * 1000) + 500,
          totalHits: Math.floor(Math.random() * 800) + 400,
          hitPercentage: Math.round((Math.random() * 40 + 60) * 100) / 100,
          executionTime: Math.floor(Math.random() * 120) + 60,
          status: 'salvo'
        }

        // Adiciona no início da lista
        this.crossings.unshift(newCrossing)
        
        toast.messages.crossingCompleted()
        return true
      } catch (error) {
        console.error('Erro ao executar cruzamento:', error)
        toast.messages.networkError()
        return false
      } finally {
        this.loading = false
      }
    },

    /**
     * Seleciona um cruzamento
     */
    selectCrossing(crossing: Crossing | null) {
      this.selectedCrossing = crossing
    },

    /**
     * Atualiza filtros
     */
    updateFilters(newFilters: Partial<CrossingFilters>) {
      this.filters = {
        ...this.filters,
        ...newFilters
      }
    },

    /**
     * Reseta filtros para valores padrão
     */
    resetFilters() {
      this.filters = {
        fileId: undefined,
        referenceStart: undefined,
        referenceEnd: undefined,
        hitPercentageMin: undefined,
        hitPercentageMax: undefined,
        dateStart: undefined,
        dateEnd: undefined,
        page: 1,
        limit: 10
      }
    },

    /**
     * Muda página da paginação
     */
    changePage(page: number) {
      this.filters.page = page
    },

    /**
     * Muda itens por página
     */
    changeLimit(limit: number) {
      this.filters.limit = limit
      this.filters.page = 1 // Volta para primeira página
    }
  }
})