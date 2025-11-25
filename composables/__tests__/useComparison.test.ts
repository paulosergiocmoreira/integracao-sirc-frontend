// composables/__tests__/useComparison.test.ts
// Testes unitários para useComparison

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useComparison } from '../useComparison'
import type { ComparisonResult } from '~/types/api'

// Mock do store
vi.mock('~/stores/queries', () => ({
  useQueriesStore: () => ({
    compareWithPersonalSystem: vi.fn(),
    clearComparison: vi.fn()
  })
}))

describe('useComparison', () => {
  let mockStore: any

  beforeEach(() => {
    mockStore = {
      compareWithPersonalSystem: vi.fn(),
      clearComparison: vi.fn()
    }
    
    vi.mocked(require('~/stores/queries').useQueriesStore).mockReturnValue(mockStore)
  })

  it('should initialize with empty state', () => {
    const { comparison, loading } = useComparison()
    
    expect(comparison.value).toBeNull()
    expect(loading.value).toBe(false)
  })

  it('should load comparison data', async () => {
    const mockComparison: ComparisonResult = {
      resultId: 'test-id',
      sircData: {
        cpf: '123.456.789-00',
        name: 'Test User',
        motherName: 'Test Mother',
        birthDate: '01/01/1990',
        deathDate: null
      },
      personalSystemData: {
        cpf: '123.456.789-00',
        name: 'Test User',
        motherName: 'Test Mother',
        birthDate: '01/01/1990',
        status: 'Ativo'
      },
      differences: []
    }

    mockStore.compareWithPersonalSystem.mockResolvedValue(mockComparison)

    const { loadComparison, comparison, loading } = useComparison()
    
    await loadComparison('test-id')
    
    expect(loading.value).toBe(false)
    expect(comparison.value).toEqual(mockComparison)
    expect(mockStore.compareWithPersonalSystem).toHaveBeenCalledWith('test-id')
  })

  it('should handle comparison errors', async () => {
    const error = new Error('Comparison failed')
    mockStore.compareWithPersonalSystem.mockRejectedValue(error)

    const { loadComparison, loading } = useComparison()
    
    await expect(loadComparison('test-id')).rejects.toThrow('Comparison failed')
    expect(loading.value).toBe(false)
  })

  it('should clear comparison data', () => {
    const { clearComparison } = useComparison()
    
    clearComparison()
    
    expect(mockStore.clearComparison).toHaveBeenCalled()
  })

  it('should detect differences correctly', () => {
    const mockComparison: ComparisonResult = {
      resultId: 'test-id',
      sircData: {
        cpf: '123.456.789-00',
        name: 'Test User',
        motherName: 'Test Mother',
        birthDate: '01/01/1990',
        deathDate: null
      },
      personalSystemData: {
        cpf: '123.456.789-00',
        name: 'Test User',
        motherName: 'Different Mother',
        birthDate: '01/01/1990',
        status: 'Ativo'
      },
      differences: [
        {
          field: 'Nome da Mãe',
          sircValue: 'Test Mother',
          personalSystemValue: 'Different Mother'
        }
      ]
    }

    // Mock the comparison value
    const { hasDifference, getRowClass, getStatusLabel, getStatusSeverity } = useComparison()
    
    // Simulate having comparison data
    vi.spyOn(require('~/stores/queries').useQueriesStore(), 'compareWithPersonalSystem')
      .mockResolvedValue(mockComparison)
    
    expect(hasDifference('nome')).toBe(true)
    expect(getRowClass('nome')).toContain('bg-orange-50')
    expect(getStatusLabel('nome')).toBe('Divergente')
    expect(getStatusSeverity('nome')).toBe('warn')
  })
})
