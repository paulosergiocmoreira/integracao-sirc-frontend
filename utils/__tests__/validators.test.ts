// utils/__tests__/validators.test.ts
// Testes unitários para funções de validação

import { describe, it, expect } from 'vitest'
import { 
  isValidCPFInput, 
  validateReferencePeriod,
  isValidCPF,
  isValidReference 
} from '../validators'

describe('validators', () => {
  describe('isValidCPFInput', () => {
    it('should allow empty input', () => {
      expect(isValidCPFInput('')).toBe(true)
    })

    it('should allow partial CPF input', () => {
      expect(isValidCPFInput('123')).toBe(true)
      expect(isValidCPFInput('123.456')).toBe(true)
      expect(isValidCPFInput('123.456.789')).toBe(true)
      expect(isValidCPFInput('123.456.789-0')).toBe(true)
    })

    it('should allow complete CPF input', () => {
      expect(isValidCPFInput('123.456.789-00')).toBe(true)
    })

    it('should reject input with more than 11 digits', () => {
      expect(isValidCPFInput('123.456.789-001')).toBe(false)
    })

    it('should handle input with special characters', () => {
      expect(isValidCPFInput('123.456.789-00')).toBe(true)
      expect(isValidCPFInput('12345678900')).toBe(true)
    })
  })

  describe('validateReferencePeriod', () => {
    it('should allow empty periods', () => {
      const result = validateReferencePeriod()
      expect(result.valid).toBe(true)
    })

    it('should validate correct period format', () => {
      const result = validateReferencePeriod('01/2024', '12/2024')
      expect(result.valid).toBe(true)
    })

    it('should reject invalid start period format', () => {
      const result = validateReferencePeriod('13/2024', '12/2024')
      expect(result.valid).toBe(false)
      expect(result.message).toContain('Período inicial inválido')
    })

    it('should reject invalid end period format', () => {
      const result = validateReferencePeriod('01/2024', '13/2024')
      expect(result.valid).toBe(false)
      expect(result.message).toContain('Período final inválido')
    })

    it('should reject when start is after end', () => {
      const result = validateReferencePeriod('12/2024', '01/2024')
      expect(result.valid).toBe(false)
      expect(result.message).toContain('A data inicial deve ser anterior')
    })

    it('should allow same start and end period', () => {
      const result = validateReferencePeriod('06/2024', '06/2024')
      expect(result.valid).toBe(true)
    })
  })

  describe('isValidCPF', () => {
    it('should validate correct CPF', () => {
      expect(isValidCPF('111.444.777-35')).toBe(true)
    })

    it('should reject invalid CPF', () => {
      expect(isValidCPF('123.456.789-00')).toBe(false)
    })

    it('should reject known invalid CPFs', () => {
      expect(isValidCPF('000.000.000-00')).toBe(false)
      expect(isValidCPF('111.111.111-11')).toBe(false)
    })

    it('should handle CPF without formatting', () => {
      expect(isValidCPF('11144477735')).toBe(true)
    })
  })

  describe('isValidReference', () => {
    it('should validate correct reference format', () => {
      expect(isValidReference('01/2024')).toBe(true)
      expect(isValidReference('12/2024')).toBe(true)
    })

    it('should reject invalid month', () => {
      expect(isValidReference('13/2024')).toBe(false)
      expect(isValidReference('00/2024')).toBe(false)
    })

    it('should reject invalid year range', () => {
      expect(isValidReference('01/1999')).toBe(false)
      expect(isValidReference('01/2101')).toBe(false)
    })

    it('should reject invalid format', () => {
      expect(isValidReference('1/2024')).toBe(false)
      expect(isValidReference('01/24')).toBe(false)
      expect(isValidReference('2024/01')).toBe(false)
    })
  })
})
