// composables/__tests__/useRetryControl.test.ts
// Testes unitários para o composable useRetryControl

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useRetryControl } from '../useRetryControl'

describe('useRetryControl', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Configuração padrão', () => {
    it('deve usar configurações padrão quando não fornecidas', () => {
      const { state } = useRetryControl()

      expect(state.value.retryCount).toBe(0)
      expect(state.value.isRetrying).toBe(false)
      expect(state.value.canRetry).toBe(true)
    })

    it('deve permitir retry inicialmente', () => {
      const { canExecuteRetry } = useRetryControl()

      expect(canExecuteRetry()).toBe(true)
    })
  })

  describe('Execução de retry', () => {
    it('deve executar retry com sucesso', async () => {
      const { executeRetry, state } = useRetryControl()
      const mockFn = vi.fn().mockResolvedValue(undefined)

      const result = await executeRetry(mockFn)

      expect(result).toBe(true)
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(state.value.retryCount).toBe(0) // Reset após sucesso
    })

    it('deve incrementar contador em caso de erro', async () => {
      const { executeRetry, state } = useRetryControl()
      const mockFn = vi.fn().mockRejectedValue(new Error('Test error'))

      const result = await executeRetry(mockFn)

      expect(result).toBe(false)
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(state.value.retryCount).toBe(1)
    })

    it('deve bloquear retry após máximo de tentativas', async () => {
      const { executeRetry, canExecuteRetry } = useRetryControl({ maxRetries: 2 })
      const mockFn = vi.fn().mockRejectedValue(new Error('Test error'))

      // Primeira tentativa
      await executeRetry(mockFn)
      expect(canExecuteRetry()).toBe(true)

      // Segunda tentativa
      await executeRetry(mockFn)
      expect(canExecuteRetry()).toBe(false)

      // Terceira tentativa deve ser bloqueada
      const result = await executeRetry(mockFn)
      expect(result).toBe(false)
      expect(mockFn).toHaveBeenCalledTimes(2)
    })
  })

  describe('Rate limiting', () => {
    it('deve respeitar delay entre tentativas', async () => {
      const { executeRetry, canExecuteRetry } = useRetryControl({ 
        retryDelay: 1000,
        maxRetries: 3
      })
      const mockFn = vi.fn().mockRejectedValue(new Error('Test error'))

      // Primeira tentativa
      await executeRetry(mockFn)
      expect(canExecuteRetry()).toBe(false) // Deve estar em cooldown

      // Avança tempo
      vi.advanceTimersByTime(1000)
      expect(canExecuteRetry()).toBe(true)
    })

    it('deve aplicar backoff exponencial', async () => {
      const { executeRetry, state } = useRetryControl({ 
        retryDelay: 1000,
        exponentialBackoff: true,
        maxRetries: 3
      })
      const mockFn = vi.fn().mockRejectedValue(new Error('Test error'))

      // Primeira tentativa
      await executeRetry(mockFn)
      expect(state.value.currentDelay).toBe(1000)

      // Segunda tentativa
      vi.advanceTimersByTime(1000)
      await executeRetry(mockFn)
      expect(state.value.currentDelay).toBe(2000)

      // Terceira tentativa
      vi.advanceTimersByTime(2000)
      await executeRetry(mockFn)
      expect(state.value.currentDelay).toBe(4000)
    })

    it('deve respeitar delay máximo', async () => {
      const { executeRetry, state } = useRetryControl({ 
        retryDelay: 1000,
        exponentialBackoff: true,
        maxDelay: 3000,
        maxRetries: 5
      })
      const mockFn = vi.fn().mockRejectedValue(new Error('Test error'))

      // Múltiplas tentativas
      for (let i = 0; i < 4; i++) {
        await executeRetry(mockFn)
        vi.advanceTimersByTime(state.value.currentDelay)
      }

      expect(state.value.currentDelay).toBe(3000) // Não deve exceder maxDelay
    })
  })

  describe('Controle de concorrência', () => {
    it('deve bloquear retry simultâneo', async () => {
      const { executeRetry } = useRetryControl()
      const mockFn = vi.fn().mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 1000))
      )

      // Inicia primeira tentativa
      const promise1 = executeRetry(mockFn)
      
      // Segunda tentativa deve ser bloqueada
      const promise2 = executeRetry(mockFn)
      
      const [result1, result2] = await Promise.all([promise1, promise2])

      expect(result1).toBe(true)
      expect(result2).toBe(false)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })

  describe('Reset de retry', () => {
    it('deve resetar contador corretamente', async () => {
      const { executeRetry, resetRetry, state } = useRetryControl()
      const mockFn = vi.fn().mockRejectedValue(new Error('Test error'))

      // Executa algumas tentativas
      await executeRetry(mockFn)
      await executeRetry(mockFn)
      
      expect(state.value.retryCount).toBe(2)

      // Reset
      resetRetry()
      
      expect(state.value.retryCount).toBe(0)
      expect(state.value.isRetrying).toBe(false)
      expect(state.value.canRetry).toBe(true)
    })
  })

  describe('Estado reativo', () => {
    it('deve atualizar estado reativo corretamente', async () => {
      const { executeRetry, state } = useRetryControl()
      const mockFn = vi.fn().mockRejectedValue(new Error('Test error'))

      // Estado inicial
      expect(state.value.retryCount).toBe(0)
      expect(state.value.isRetrying).toBe(false)
      expect(state.value.canRetry).toBe(true)

      // Durante execução
      const promise = executeRetry(mockFn)
      expect(state.value.isRetrying).toBe(true)

      await promise

      // Após execução
      expect(state.value.isRetrying).toBe(false)
      expect(state.value.retryCount).toBe(1)
    })

    it('deve calcular remainingRetries corretamente', async () => {
      const { executeRetry, state } = useRetryControl({ maxRetries: 3 })
      const mockFn = vi.fn().mockRejectedValue(new Error('Test error'))

      expect(state.value.remainingRetries).toBe(3)

      await executeRetry(mockFn)
      expect(state.value.remainingRetries).toBe(2)

      await executeRetry(mockFn)
      expect(state.value.remainingRetries).toBe(1)

      await executeRetry(mockFn)
      expect(state.value.remainingRetries).toBe(0)
    })
  })
})
