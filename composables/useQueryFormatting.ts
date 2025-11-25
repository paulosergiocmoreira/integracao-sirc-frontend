// composables/useQueryFormatting.ts
// Funções de formatação para componentes de consultas

import type { HitTypeValue } from '~/types/api'

// ✅ External helpers (created once, reused)
const getHitTypeLabel = (hitType: HitTypeValue): string => {
  const labels: Record<HitTypeValue, string> = {
    'hit-perfeito': 'Perfeito',
    'cpf-completo': 'CPF Completo',
    'cpf-incompleto': 'CPF Parcial',
    'data-nascimento': 'Data Nasc.',
    'hit-com-falecido': 'Falecido'
  }
  
  return labels[hitType]
}

const getHitTypeSeverity = (hitType: HitTypeValue): 'success' | 'info' | 'warn' | 'danger' => {
  const severities: Record<HitTypeValue, 'success' | 'info' | 'warn' | 'danger'> = {
    'hit-perfeito': 'success',
    'cpf-completo': 'info',
    'cpf-incompleto': 'warn',
    'data-nascimento': 'info',
    'hit-com-falecido': 'danger'
  }
  
  return severities[hitType]
}

const getScoreLabel = (score: number): string => {
  if (score >= 90) return 'Excelente'
  if (score >= 75) return 'Bom'
  if (score >= 50) return 'Médio'
  return 'Baixo'
}

const getScoreColor = (score: number): string => {
  if (score >= 90) return 'linear-gradient(to right, #10b981, #059669)'
  if (score >= 75) return 'linear-gradient(to right, #3b82f6, #2563eb)'
  if (score >= 50) return 'linear-gradient(to right, #f59e0b, #d97706)'
  return 'linear-gradient(to right, #ef4444, #dc2626)'
}

/**
 * Composable para formatação de dados de consultas
 * 
 * @description Fornece funções de formatação otimizadas para componentes de consultas,
 * com helpers memoizados para melhor performance
 * 
 * @returns {UseQueryFormattingReturn} Interface completa para formatação
 * 
 * @example
 * ```vue
 * <script setup>
 * const { getHitTypeLabel, getScoreLabel, getScoreColor } = useQueryFormatting()
 * 
 * // Uso em template
 * <Badge :value="getHitTypeLabel(hitType)" :severity="getHitTypeSeverity(hitType)" />
 * </script>
 * ```
 */
export const useQueryFormatting = () => {
  /**
   * Retorna label formatado para tipo de hit
   * 
   * @param hitType - Tipo de hit
   * @returns {string} Label formatado
   */
  const formatHitTypeLabel = (hitType: HitTypeValue): string => {
    return getHitTypeLabel(hitType)
  }

  /**
   * Retorna severidade para tipo de hit
   * 
   * @param hitType - Tipo de hit
   * @returns {string} Severidade do badge
   */
  const formatHitTypeSeverity = (hitType: HitTypeValue): 'success' | 'info' | 'warn' | 'danger' => {
    return getHitTypeSeverity(hitType)
  }

  /**
   * Retorna label do score de correspondência
   * 
   * @param score - Score de 0 a 100
   * @returns {string} Label descritivo
   */
  const formatScoreLabel = (score: number): string => {
    return getScoreLabel(score)
  }

  /**
   * Retorna cor da barra de progresso baseada no score
   * 
   * @param score - Score de 0 a 100
   * @returns {string} Gradiente CSS
   */
  const formatScoreColor = (score: number): string => {
    return getScoreColor(score)
  }

  return {
    formatHitTypeLabel,
    formatHitTypeSeverity,
    formatScoreLabel,
    formatScoreColor
  }
}
