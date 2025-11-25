// composables/useFileFilters.ts
// Composable para gerenciar filtros de arquivos

import type { FileTypeValue, FileStatusValue } from '~/types/api'

// ✅ Type definitions
interface FilterOption {
  label: string
  value: string
}

interface LocalFilters {
  name: string
  type: FileTypeValue | null
  referenceStart: Date | null
  referenceEnd: Date | null
  status: FileStatusValue[]
}

interface UseFileFiltersReturn {
  localFilters: LocalFilters
  typeOptions: FilterOption[]
  statusOptions: FilterOption[]
  applyFilters: () => void
  resetFilters: () => void
  hasActiveFilters: ComputedRef<boolean>
  activeFiltersCount: ComputedRef<number>
}

/**
 * Composable para gerenciar filtros de arquivos
 * 
 * @description Fornece interface reativa para gerenciar filtros de arquivos,
 * com estado local para inputs e integração com store
 * 
 * @returns {UseFileFiltersReturn} Interface completa para gerenciamento de filtros
 * 
 * @example
 * ```vue
 * <script setup>
 * const { localFilters, applyFilters, resetFilters, hasActiveFilters } = useFileFilters()
 * 
 * // Aplicar filtros
 * applyFilters()
 * 
 * // Limpar todos os filtros
 * resetFilters()
 * 
 * // Verificar se há filtros ativos
 * console.log(hasActiveFilters.value) // boolean
 * </script>
 * ```
 */
export const useFileFilters = (): UseFileFiltersReturn => {
  const store = useFilesStore()

  // Estado local dos filtros (para inputs)
  const localFilters = reactive({
    name: '',
    type: null as FileTypeValue | null,
    referenceStart: null as Date | null,
    referenceEnd: null as Date | null,
    status: [] as FileStatusValue[]
  })

  /**
   * Opções para dropdown de tipos de arquivo
   */
  const typeOptions: FilterOption[] = [
    { label: 'Mensal', value: 'mensal' },
    { label: 'Diário', value: 'diario' }
  ]

  /**
   * Opções para dropdown de status de arquivo
   */
  const statusOptions: FilterOption[] = [
    { label: 'Salvo', value: 'salvo' },
    { label: 'Em Execução', value: 'em-execucao' },
    { label: 'Erro', value: 'erro' },
    { label: 'Agendado', value: 'agendado' }
  ]

  /**
   * Converte Date para formato MM/YYYY
   * 
   * @param date - Data a ser convertida
   * @returns String no formato MM/YYYY ou undefined se data for null
   */
  const dateToReference = (date: Date | null): string | undefined => {
    if (!date) return undefined
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${month}/${year}`
  }

  /**
   * Aplica filtros na store
   * 
   * @description Converte filtros locais para formato da store e aplica,
   * resetando página para 1
   */
  const applyFilters = (): void => {
    store.updateFilters({
      name: localFilters.name || undefined,
      type: localFilters.type || undefined,
      referenceStart: dateToReference(localFilters.referenceStart),
      referenceEnd: dateToReference(localFilters.referenceEnd),
      status: localFilters.status.length > 0 ? localFilters.status : undefined,
      page: 1 // Volta para primeira página ao filtrar
    })
  }

  /**
   * Reseta filtros
   * 
   * @description Limpa todos os filtros locais e reseta filtros na store
   */
  const resetFilters = (): void => {
    localFilters.name = ''
    localFilters.type = null
    localFilters.referenceStart = null
    localFilters.referenceEnd = null
    localFilters.status = []
    
    store.resetFilters()
  }

  /**
   * Verifica se há filtros ativos
   * 
   * @description Verifica se pelo menos um filtro local tem valor
   * @returns {ComputedRef<boolean>} True se há filtros ativos
   */
  const hasActiveFilters = computed((): boolean => {
    return !!(
      localFilters.name ||
      localFilters.type ||
      localFilters.referenceStart ||
      localFilters.referenceEnd ||
      localFilters.status.length > 0
    )
  })

  /**
   * Conta de filtros ativos
   * 
   * @description Conta quantos filtros locais estão preenchidos
   * @returns {ComputedRef<number>} Número de filtros ativos
   */
  const activeFiltersCount = computed((): number => {
    let count = 0
    if (localFilters.name) count++
    if (localFilters.type) count++
    if (localFilters.referenceStart) count++
    if (localFilters.referenceEnd) count++
    if (localFilters.status.length > 0) count++
    return count
  })

  return {
    localFilters,
    typeOptions,
    statusOptions,
    applyFilters,
    resetFilters,
    hasActiveFilters,
    activeFiltersCount
  }
}