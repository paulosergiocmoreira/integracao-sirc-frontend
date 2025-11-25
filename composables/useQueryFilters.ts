// composables/useQueryFilters.ts
// Gestão de filtros para consultas de resultados

import type { QueryFilters, HitTypeValue } from '~/types/api'
import { useQueriesStore } from '~/stores/queries'
import { storeToRefs } from 'pinia'

// ✅ Type definitions
interface FilterOption {
  label: string
  value: HitTypeValue
}

interface ActiveFilter {
  key: keyof QueryFilters
  label: string
  value: string
}

interface UseQueryFiltersReturn {
  filters: Ref<QueryFilters>
  hasActiveFilters: Ref<boolean>
  hitTypeOptions: FilterOption[]
  applyFilters: (newFilters: Partial<QueryFilters>) => Promise<void>
  clearFilters: () => Promise<void>
  updateFilter: <K extends keyof QueryFilters>(key: K, value: QueryFilters[K]) => void
  validateCPFInput: (cpf: string) => boolean
  formatCPFInput: (cpf: string) => string
  validateReferencePeriod: (start?: string, end?: string) => string | null
  getFilterLabel: (key: keyof QueryFilters) => string
  getFilterValue: (key: keyof QueryFilters, value: any) => string
  activeFiltersList: ComputedRef<ActiveFilter[]>
}

// ✅ External helpers (created once, reused)
const formatCPFInput = (cpf: string): string => {
  const numbers = cpf.replace(/\D/g, '').slice(0, 11)
  
  if (numbers.length <= 3) return numbers
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`
  if (numbers.length <= 9) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`
  }
  
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9)}`
}

const validateCPFInput = (cpf: string): boolean => {
  const numbers = cpf.replace(/\D/g, '')
  
  // Permite vazio ou até 11 dígitos
  if (numbers.length === 0) return true
  if (numbers.length > 11) return false
  
  return true
}

const validateReferencePeriod = (start?: string, end?: string): string | null => {
  if (!start && !end) return null
  
  if (start && end && start > end) {
    return 'A data inicial deve ser anterior à data final'
  }
  
  return null
}

const getFilterLabel = (key: keyof QueryFilters): string => {
  const labels: Record<string, string> = {
    cpf: 'CPF',
    name: 'Nome',
    crossingId: 'Cruzamento',
    referenceStart: 'Período Inicial',
    referenceEnd: 'Período Final',
    hitTypes: 'Tipos de Hit',
    includeNoHits: 'Incluir Sem Hits'
  }
  
  return labels[key] || key
}

const getFilterValue = (key: keyof QueryFilters, value: any): string => {
  if (key === 'hitTypes' && Array.isArray(value)) {
    return `${value.length} tipo(s)`
  }
  
  if (key === 'includeNoHits' && typeof value === 'boolean') {
    return value ? 'Sim' : 'Não'
  }
  
  return String(value)
}

/**
 * Composable para gerenciar filtros de consultas
 * 
 * @description Fornece interface reativa para gerenciar filtros de consultas,
 * delegando lógica de negócio para o store e fornecendo helpers para UI
 * 
 * @returns {UseQueryFiltersReturn} Interface completa para gerenciamento de filtros
 * 
 * @example
 * ```vue
 * <script setup>
 * const { filters, applyFilters, clearFilters, hasActiveFilters } = useQueryFilters()
 * 
 * // Aplicar filtros
 * await applyFilters({ cpf: '123.456.789-00' })
 * 
 * // Limpar todos os filtros
 * await clearFilters()
 * 
 * // Verificar se há filtros ativos
 * console.log(hasActiveFilters.value) // boolean
 * </script>
 * ```
 */
export const useQueryFilters = (): UseQueryFiltersReturn => {
  const store = useQueriesStore()
  
  // ✅ Use storeToRefs for reactive state
  const { filters, hasActiveFilters } = storeToRefs(store)

  /**
   * Opções para tipos de hit
   */
  const hitTypeOptions: FilterOption[] = [
    { label: 'Hit Perfeito', value: 'hit-perfeito' },
    { label: 'CPF Completo', value: 'cpf-completo' },
    { label: 'CPF Incompleto', value: 'cpf-incompleto' },
    { label: 'Data de Nascimento', value: 'data-nascimento' },
    { label: 'Hit com Falecido', value: 'hit-com-falecido' }
  ]

  /**
   * Aplica filtros e busca resultados
   * 
   * @param newFilters - Filtros a serem aplicados
   * @description Reseta página para 1 e executa busca com novos filtros
   */
  const applyFilters = async (newFilters: Partial<QueryFilters>) => {
    // Reseta para página 1 quando filtros mudam
    const filtersWithReset = { ...newFilters, page: 1 }
    
    store.updateFilters(filtersWithReset)
    await store.searchResults()
  }

  /**
   * Limpa todos os filtros
   * 
   * @description Reseta filtros para valores padrão e executa nova busca
   */
  const clearFilters = async () => {
    store.resetFilters()
    await store.searchResults()
  }

  /**
   * Atualiza um filtro específico
   * 
   * @param key - Chave do filtro a ser atualizado
   * @param value - Novo valor para o filtro
   * @description Atualiza apenas um filtro específico sem executar busca
   */
  const updateFilter = <K extends keyof QueryFilters>(
    key: K,
    value: QueryFilters[K]
  ) => {
    store.updateFilters({ [key]: value })
  }


  /**
   * Lista de filtros ativos formatados
   * 
   * @description Retorna lista formatada de filtros ativos para exibição em badges
   * @returns {ComputedRef<ActiveFilter[]>} Lista reativa de filtros ativos
   */
  const activeFiltersList = computed((): ActiveFilter[] => {
    const result: ActiveFilter[] = []
    const f = filters.value
    
    // Only add filters that have values
    Object.entries(f).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && value !== false) {
        // Skip pagination fields
        if (key === 'page' || key === 'limit') return
        
        result.push({
          key: key as keyof QueryFilters,
          label: getFilterLabel(key as keyof QueryFilters),
          value: getFilterValue(key as keyof QueryFilters, value)
        })
      }
    })
    
    return result
  })

  return {
    // ✅ Return reactive state from store
    filters,
    hasActiveFilters,
    hitTypeOptions,
    applyFilters,
    clearFilters,
    updateFilter,
    validateCPFInput,
    formatCPFInput,
    validateReferencePeriod,
    getFilterLabel,
    getFilterValue,
    activeFiltersList
  }
}