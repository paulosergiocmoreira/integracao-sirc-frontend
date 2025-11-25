// composables/useComparison.ts
// Lógica de comparação de dados entre sistemas

import type { QueryResult, ComparisonResult } from '~/types/api'
import { useQueriesStore } from '~/stores/queries'

// ✅ External helpers (created once, reused)
const hasDifference = (comparison: ComparisonResult | null, fieldName: string): boolean => {
  if (!comparison) return false
  return comparison.differences.some(d => 
    d.field.toLowerCase().includes(fieldName.toLowerCase())
  )
}

const getRowClass = (comparison: ComparisonResult | null, fieldName: string): string => {
  if (hasDifference(comparison, fieldName)) {
    return 'bg-orange-50 dark:bg-orange-950'
  }
  return ''
}

const getStatusLabel = (comparison: ComparisonResult | null, fieldName: string): string => {
  if (hasDifference(comparison, fieldName)) return 'Divergente'
  return 'Confere'
}

const getStatusSeverity = (comparison: ComparisonResult | null, fieldName: string): 'success' | 'warn' => {
  if (hasDifference(comparison, fieldName)) return 'warn'
  return 'success'
}

/**
 * Composable para gerenciar comparação de dados
 * 
 * @description Fornece interface reativa para comparação de dados entre sistemas,
 * delegando lógica de negócio para o store e fornecendo helpers para UI
 * 
 * @returns {UseComparisonReturn} Interface completa para comparação
 * 
 * @example
 * ```vue
 * <script setup>
 * const { comparison, loading, loadComparison, hasDifference, getRowClass } = useComparison()
 * 
 * // Carregar comparação
 * await loadComparison(resultId)
 * 
 * // Verificar diferenças
 * const hasDiff = hasDifference('nome')
 * </script>
 * ```
 */
export const useComparison = () => {
  const store = useQueriesStore()
  
  // State local
  const loading = ref(false)
  const comparison = ref<ComparisonResult | null>(null)

  /**
   * Carrega dados de comparação
   * 
   * @param resultId - ID do resultado a ser comparado
   * @description Busca dados de comparação com sistema pessoal
   */
  const loadComparison = async (resultId: string) => {
    loading.value = true
    try {
      comparison.value = await store.compareWithPersonalSystem(resultId)
    } catch (error) {
      console.error('Erro ao carregar comparação:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * Limpa dados de comparação
   * 
   * @description Reseta estado local e store
   */
  const clearComparison = () => {
    comparison.value = null
    store.clearComparison()
  }

  /**
   * Verifica se campo tem diferença
   * 
   * @param fieldName - Nome do campo
   * @returns {boolean} true se tem diferença
   */
  const checkDifference = (fieldName: string): boolean => {
    return hasDifference(comparison.value, fieldName)
  }

  /**
   * Retorna classe CSS da linha baseado em diferenças
   * 
   * @param fieldName - Nome do campo
   * @returns {string} Classe CSS
   */
  const getRowClassForField = (fieldName: string): string => {
    return getRowClass(comparison.value, fieldName)
  }

  /**
   * Retorna label de status
   * 
   * @param fieldName - Nome do campo
   * @returns {string} Label de status
   */
  const getStatusLabelForField = (fieldName: string): string => {
    return getStatusLabel(comparison.value, fieldName)
  }

  /**
   * Retorna severidade do badge de status
   * 
   * @param fieldName - Nome do campo
   * @returns {string} Severidade do badge
   */
  const getStatusSeverityForField = (fieldName: string): 'success' | 'warn' => {
    return getStatusSeverity(comparison.value, fieldName)
  }

  return {
    // State
    comparison: readonly(comparison),
    loading: readonly(loading),
    
    // Actions
    loadComparison,
    clearComparison,
    
    // Helpers
    hasDifference: checkDifference,
    getRowClass: getRowClassForField,
    getStatusLabel: getStatusLabelForField,
    getStatusSeverity: getStatusSeverityForField
  }
}
