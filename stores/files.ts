// stores/files.ts
// Pinia store para gerenciamento de arquivos

import { defineStore } from 'pinia'
import type { File, FileFilters, FileTypeValue, FileStatusValue } from '~/types/api'
import { MOCK_FILES, simulateDelay, simulateError } from '~/stores/mocks'
import { useToastMessages } from '~/composables/useToastMessages'

interface FilesState {
  files: File[]
  loading: boolean
  selectedFile: File | null
  filters: FileFilters
}

/**
 * Store de arquivos
 * 
 * Gerencia:
 * - Listagem de arquivos com filtros
 * - Upload de novos arquivos
 * - Exclusão de arquivos
 * - Agendamento de cruzamentos
 */
export const useFilesStore = defineStore('files', {
  state: (): FilesState => ({
    files: [],
    loading: false,
    selectedFile: null,
    filters: {
      name: undefined,
      type: undefined,
      referenceStart: undefined,
      referenceEnd: undefined,
      status: undefined,
      page: 1,
      limit: 10
    }
  }),

  getters: {
    /**
     * Arquivos filtrados
     */
    filteredFiles: (state): File[] => {
      let result = [...state.files]

      // Filtro por nome
      if (state.filters.name) {
        const searchTerm = state.filters.name.toLowerCase()
        result = result.filter(f => f.name.toLowerCase().includes(searchTerm))
      }

      // Filtro por tipo
      if (state.filters.type) {
        result = result.filter(f => f.type === state.filters.type)
      }

      // Filtro por status
      if (state.filters.status && state.filters.status.length > 0) {
        result = result.filter(f => state.filters.status?.includes(f.status))
      }

      // Filtro por período de referência
      if (state.filters.referenceStart || state.filters.referenceEnd) {
        result = result.filter(f => {
          const fileRef = f.reference
          const start = state.filters.referenceStart
          const end = state.filters.referenceEnd

          if (start && fileRef < start) return false
          if (end && fileRef > end) return false

          return true
        })
      }

      return result
    },

    /**
     * Arquivos paginados
     */
    paginatedFiles(state): File[] {
      // Aplica filtros diretamente aqui para evitar dependência circular
      let filtered = [...state.files]

      // Filtro por nome
      if (state.filters.name) {
        const searchTerm = state.filters.name.toLowerCase()
        filtered = filtered.filter(f => f.name.toLowerCase().includes(searchTerm))
      }

      // Filtro por tipo
      if (state.filters.type) {
        filtered = filtered.filter(f => f.type === state.filters.type)
      }

      // Filtro por status
      if (state.filters.status && state.filters.status.length > 0) {
        filtered = filtered.filter(f => state.filters.status?.includes(f.status))
      }

      // Filtro por período de referência
      if (state.filters.referenceStart || state.filters.referenceEnd) {
        filtered = filtered.filter(f => {
          const fileRef = f.reference
          const start = state.filters.referenceStart
          const end = state.filters.referenceEnd

          if (start && fileRef < start) return false
          if (end && fileRef > end) return false

          return true
        })
      }

      // Aplica paginação
      const page = state.filters.page || 1
      const limit = state.filters.limit || 10
      const start = (page - 1) * limit
      const end = start + limit

      return filtered.slice(start, end)
    },

    /**
     * Total de arquivos filtrados
     */
    totalFiles(state): number {
      // Aplica os mesmos filtros para contar
      let filtered = [...state.files]

      if (state.filters.name) {
        const searchTerm = state.filters.name.toLowerCase()
        filtered = filtered.filter(f => f.name.toLowerCase().includes(searchTerm))
      }

      if (state.filters.type) {
        filtered = filtered.filter(f => f.type === state.filters.type)
      }

      if (state.filters.status && state.filters.status.length > 0) {
        filtered = filtered.filter(f => state.filters.status?.includes(f.status))
      }

      if (state.filters.referenceStart || state.filters.referenceEnd) {
        filtered = filtered.filter(f => {
          const fileRef = f.reference
          const start = state.filters.referenceStart
          const end = state.filters.referenceEnd

          if (start && fileRef < start) return false
          if (end && fileRef > end) return false

          return true
        })
      }

      return filtered.length
    },

    /**
     * Total de páginas
     */
    totalPages(state): number {
      const total = this.totalFiles
      const limit = state.filters.limit || 10
      return Math.ceil(total / limit)
    },

    /**
     * Arquivos por status (para estatísticas)
     */
    filesByStatus: (state) => {
      const counts: Record<FileStatusValue, number> = {
        'salvo': 0,
        'em-execucao': 0,
        'erro': 0,
        'agendado': 0
      }

      state.files.forEach(f => {
        counts[f.status]++
      })

      return counts
    },

    /**
     * Arquivos por tipo (para estatísticas)
     */
    filesByType: (state) => {
      const counts: Record<FileTypeValue, number> = {
        'mensal': 0,
        'diario': 0
      }

      state.files.forEach(f => {
        counts[f.type]++
      })

      return counts
    }
  },

  actions: {
    /**
     * Busca todos os arquivos
     */
    async fetchFiles() {
      this.loading = true
      const toast = useToastMessages()

      try {
        await simulateDelay()
        // simulateError() // Descomente para testar erros
        
        // Simula chamada API
        this.files = [...MOCK_FILES]
      } catch (error) {
        console.error('Erro ao buscar arquivos:', error)
        toast.messages.networkError()
      } finally {
        this.loading = false
      }
    },

    /**
     * Faz upload de um novo arquivo
     */
    async uploadFile(file: globalThis.File, type: FileTypeValue, reference: string) {
      this.loading = true
      const toast = useToastMessages()

      try {
        await simulateDelay()
        
        // Cria novo arquivo
        const newFile: File = {
          id: `file-${Date.now()}`,
          name: file.name,
          type,
          reference,
          hash: Math.random().toString(36).substring(7),
          uploadDate: new Date().toISOString(),
          user: 'admin@sirc.gov.br',
          status: 'salvo'
        }

        // Adiciona no início da lista
        this.files.unshift(newFile)
        
        toast.messages.fileUploaded()
        return true
      } catch (error) {
        console.error('Erro ao fazer upload:', error)
        toast.messages.networkError()
        return false
      } finally {
        this.loading = false
      }
    },

    /**
     * Exclui um arquivo
     */
    async deleteFile(fileId: string) {
      this.loading = true
      const toast = useToastMessages()

      try {
        await simulateDelay()
        
        this.files = this.files.filter(f => f.id !== fileId)
        
        toast.messages.fileDeleted()
        return true
      } catch (error) {
        console.error('Erro ao excluir arquivo:', error)
        toast.messages.networkError()
        return false
      } finally {
        this.loading = false
      }
    },

    /**
     * Agenda cruzamento para um arquivo
     */
    async scheduleFile(fileId: string, scheduledDate: Date, frequency: string) {
      this.loading = true
      const toast = useToastMessages()

      try {
        await simulateDelay()
        
        // Atualiza arquivo
        const file = this.files.find(f => f.id === fileId)
        if (file) {
          file.status = 'agendado'
          file.scheduling = scheduledDate.toISOString()
        }
        
        toast.messages.fileScheduled()
        return true
      } catch (error) {
        console.error('Erro ao agendar cruzamento:', error)
        toast.messages.networkError()
        return false
      } finally {
        this.loading = false
      }
    },

    /**
     * Executa cruzamento imediatamente
     */
    async executeFile(fileId: string) {
      this.loading = true
      const toast = useToastMessages()

      try {
        await simulateDelay(1000, 2000) // Demora mais para simular processamento
        
        // Atualiza arquivo
        const file = this.files.find(f => f.id === fileId)
        if (file) {
          file.status = 'em-execucao'
          
          // Simula processamento e depois marca como salvo
          setTimeout(() => {
            file.status = 'salvo'
            file.lastCrossing = new Date().toISOString()
            toast.messages.crossingCompleted()
          }, 3000)
        }
        
        toast.messages.crossingStarted()
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
     * Seleciona um arquivo
     */
    selectFile(file: File | null) {
      this.selectedFile = file
    },

    /**
     * Atualiza filtros
     */
    updateFilters(newFilters: Partial<FileFilters>) {
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
        name: undefined,
        type: undefined,
        referenceStart: undefined,
        referenceEnd: undefined,
        status: undefined,
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