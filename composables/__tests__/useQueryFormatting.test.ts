// composables/__tests__/useQueryFormatting.test.ts
// Testes unitários para useQueryFormatting

import { describe, it, expect } from 'vitest'
import { useQueryFormatting } from '../useQueryFormatting'
import type { HitTypeValue } from '~/types/api'

describe('useQueryFormatting', () => {
  it('should format hit type labels correctly', () => {
    const { formatHitTypeLabel } = useQueryFormatting()
    
    expect(formatHitTypeLabel('hit-perfeito')).toBe('Perfeito')
    expect(formatHitTypeLabel('cpf-completo')).toBe('CPF Completo')
    expect(formatHitTypeLabel('cpf-incompleto')).toBe('CPF Parcial')
    expect(formatHitTypeLabel('data-nascimento')).toBe('Data Nasc.')
    expect(formatHitTypeLabel('hit-com-falecido')).toBe('Falecido')
  })

  it('should format hit type severities correctly', () => {
    const { formatHitTypeSeverity } = useQueryFormatting()
    
    expect(formatHitTypeSeverity('hit-perfeito')).toBe('success')
    expect(formatHitTypeSeverity('cpf-completo')).toBe('info')
    expect(formatHitTypeSeverity('cpf-incompleto')).toBe('warn')
    expect(formatHitTypeSeverity('data-nascimento')).toBe('info')
    expect(formatHitTypeSeverity('hit-com-falecido')).toBe('danger')
  })

  it('should format score labels correctly', () => {
    const { formatScoreLabel } = useQueryFormatting()
    
    expect(formatScoreLabel(95)).toBe('Excelente')
    expect(formatScoreLabel(80)).toBe('Bom')
    expect(formatScoreLabel(60)).toBe('Médio')
    expect(formatScoreLabel(30)).toBe('Baixo')
  })

  it('should format score colors correctly', () => {
    const { formatScoreColor } = useQueryFormatting()
    
    expect(formatScoreColor(95)).toContain('linear-gradient')
    expect(formatScoreColor(80)).toContain('linear-gradient')
    expect(formatScoreColor(60)).toContain('linear-gradient')
    expect(formatScoreColor(30)).toContain('linear-gradient')
  })

  it('should return consistent results for same inputs', () => {
    const { formatHitTypeLabel, formatScoreLabel } = useQueryFormatting()
    
    const result1 = formatHitTypeLabel('hit-perfeito')
    const result2 = formatHitTypeLabel('hit-perfeito')
    expect(result1).toBe(result2)
    
    const score1 = formatScoreLabel(80)
    const score2 = formatScoreLabel(80)
    expect(score1).toBe(score2)
  })
})
