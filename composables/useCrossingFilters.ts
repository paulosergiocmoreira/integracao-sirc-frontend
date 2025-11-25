// composables/useCrossingFilters.ts
// Composable para gerenciar filtros de cruzamentos

import type { File } from '~/types/api'

// ✅ Type definitions
interface FileOption {
  label: string
  value: string
}

interface LocalFilters {
  fileId: string | null
  referenceStart: Date | null
  referenceEnd: Date | null
  hitPercentageMin: number | null
  hitPercentageMax: number | null
  dateStart: Date | null
  dateEnd: Date | null
}

interface UseCrossingFiltersReturn {
  localFilters: LocalFilters
  fileOptions: ComputedRef<FileOption[]>
  applyFilters: () => void
  resetFilters: () => void
  hasActiveFilters: ComputedRef<boolean>
  activeFiltersCount: ComputedRef<number>
}

/**
 * Composable para gerenciar filtros de cruzamentos
 * 
 * @description Fornece interface reativa para gerenciar filtros de cruzamentos,
 * com estado local para inputs e integração com store
 * 
 * @returns {UseCrossingFiltersReturn} Interface completa para gerenciamento de filtros
 * 
 * @example
 * ```vue
 * <script setup>
 * const { localFilters, applyFilters, resetFilters, hasActiveFilters } = useCrossingFilters()
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
export const useCrossingFilters = (): UseCrossingFiltersReturn => {
  const store = useCrossingsStore()
  const filesStore = useFilesStore()

  // Estado local dos filtros (para inputs)
  const localFilters = reactive({
    fileId: null as string | null,
    referenceStart: null as Date | null,
    referenceEnd: null as Date | null,
    hitPercentageMin: null as number | null,
    hitPercentageMax: null as number | null,
    dateStart: null as Date | null,
    dateEnd: null as Date | null
  })

  /**
   * Opções de arquivos para dropdown
   * 
   * @description Converte lista de arquivos em opções para dropdown
   * @returns {ComputedRef<FileOption[]>} Lista reativa de opções de arquivos
   */
  const fileOptions = computed((): FileOption[] => {
    return filesStore.files.map((file: File) => ({
      label: file.name,
      value: file.id
    }))
  })

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
   * Converte Date para string ISO (YYYY-MM-DD)
   * 
   * @param date - Data a ser convertida
   * @returns String no formato YYYY-MM-DD ou undefined se data for null
   */
  const dateToISO = (date: Date | null): string | undefined => {
    if (!date) return undefined
    return date.toISOString().split('T')[0]
  }

  /**
   * Aplica filtros na store
   * 
   * @description Converte filtros locais para formato da store e aplica,
   * resetando página para 1
   */
  const applyFilters = (): void => {
    store.updateFilters({
      fileId: localFilters.fileId || undefined,
      referenceStart: dateToReference(localFilters.referenceStart),
      referenceEnd: dateToReference(localFilters.referenceEnd),
      hitPercentageMin: localFilters.hitPercentageMin || undefined,
      hitPercentageMax: localFilters.hitPercentageMax || undefined,
      dateStart: dateToISO(localFilters.dateStart),
      dateEnd: dateToISO(localFilters.dateEnd),
      page: 1 // Volta para primeira página ao filtrar
    })
  }

  /**
   * Reseta filtros
   * 
   * @description Limpa todos os filtros locais e reseta filtros na store
   */
  const resetFilters = (): void => {
    localFilters.fileId = null
    localFilters.referenceStart = null
    localFilters.referenceEnd = null
    localFilters.hitPercentageMin = null
    localFilters.hitPercentageMax = null
    localFilters.dateStart = null
    localFilters.dateEnd = null
    
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
      localFilters.fileId ||
      localFilters.referenceStart ||
      localFilters.referenceEnd ||
      localFilters.hitPercentageMin !== null ||
      localFilters.hitPercentageMax !== null ||
      localFilters.dateStart ||
      localFilters.dateEnd
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
    if (localFilters.fileId) count++
    if (localFilters.referenceStart) count++
    if (localFilters.referenceEnd) count++
    if (localFilters.hitPercentageMin !== null) count++
    if (localFilters.hitPercentageMax !== null) count++
    if (localFilters.dateStart) count++
    if (localFilters.dateEnd) count++
    return count
  })

  return {
    localFilters,
    fileOptions,
    applyFilters,
    resetFilters,
    hasActiveFilters,
    activeFiltersCount
  }
}