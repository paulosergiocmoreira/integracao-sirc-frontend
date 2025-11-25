// composables/useRetryControl.ts
// Composable para controle de retry com rate limiting e prevenção de loops infinitos

/**
 * Interface para configuração do controle de retry
 */
interface RetryConfig {
  /** Número máximo de tentativas */
  maxRetries?: number
  /** Delay mínimo entre tentativas (ms) */
  retryDelay?: number
  /** Delay exponencial (multiplica o delay a cada tentativa) */
  exponentialBackoff?: boolean
  /** Delay máximo permitido (ms) */
  maxDelay?: number
}

/**
 * Interface para estado do retry
 */
interface RetryState {
  /** Número de tentativas realizadas */
  retryCount: number
  /** Última tentativa (timestamp) */
  lastRetryTime: number
  /** Se está executando retry no momento */
  isRetrying: boolean
  /** Se pode fazer nova tentativa */
  canRetry: boolean
  /** Delay atual para próxima tentativa */
  currentDelay: number
}

/**
 * Interface de retorno do composable
 */
interface UseRetryControlReturn {
  /** Estado reativo do retry */
  state: Readonly<Ref<RetryState>>
  /** Executa retry com controle de rate limiting */
  executeRetry: (retryFn: () => Promise<void>) => Promise<boolean>
  /** Reseta o contador de tentativas */
  resetRetry: () => void
  /** Verifica se pode executar retry */
  canExecuteRetry: () => boolean
}

/**
 * Composable para controle de retry com rate limiting
 * 
 * @description Gerencia tentativas de retry com controle de taxa, prevenção de loops infinitos
 * e backoff exponencial. Segue padrões de qualidade para evitar chamadas excessivas à API.
 * 
 * @param config - Configuração do controle de retry
 * @returns {UseRetryControlReturn} Interface completa para controle de retry
 * 
 * @example
 * ```vue
 * <script setup>
 * const { state, executeRetry, resetRetry } = useRetryControl({
 *   maxRetries: 3,
 *   retryDelay: 2000,
 *   exponentialBackoff: true
 * })
 * 
 * const handleRetry = async () => {
 *   const success = await executeRetry(async () => {
 *     await store.searchResults()
 *   })
 *   
 *   if (!success) {
 *     toast.error('Máximo de tentativas atingido')
 *   }
 * }
 * </script>
 * ```
 */
export const useRetryControl = (config: RetryConfig = {}): UseRetryControlReturn => {
  const {
    maxRetries = 3,
    retryDelay = 2000,
    exponentialBackoff = true,
    maxDelay = 10000
  } = config

  // Estado reativo do retry
  const state = ref<RetryState>({
    retryCount: 0,
    lastRetryTime: 0,
    isRetrying: false,
    canRetry: true,
    currentDelay: retryDelay
  })

  /**
   * Calcula delay para próxima tentativa
   * 
   * @param attempt - Número da tentativa
   * @returns {number} Delay em milissegundos
   */
  const calculateDelay = (attempt: number): number => {
    if (!exponentialBackoff) return retryDelay
    
    const delay = retryDelay * Math.pow(2, attempt - 1)
    return Math.min(delay, maxDelay)
  }

  /**
   * Verifica se pode executar retry
   * 
   * @returns {boolean} True se pode executar retry
   */
  const canExecuteRetry = (): boolean => {
    const now = Date.now()
    const timeSinceLastRetry = now - state.value.lastRetryTime
    const hasReachedMaxRetries = state.value.retryCount >= maxRetries
    const isInCooldown = timeSinceLastRetry < state.value.currentDelay
    
    return !hasReachedMaxRetries && !isInCooldown && !state.value.isRetrying
  }

  /**
   * Executa retry com controle de rate limiting
   * 
   * @param retryFn - Função a ser executada no retry
   * @returns {Promise<boolean>} True se retry foi executado com sucesso
   */
  const executeRetry = async (retryFn: () => Promise<void>): Promise<boolean> => {
    // Verifica se pode executar retry
    if (!canExecuteRetry()) {
      console.warn('Retry bloqueado:', {
        retryCount: state.value.retryCount,
        maxRetries,
        timeSinceLastRetry: Date.now() - state.value.lastRetryTime,
        currentDelay: state.value.currentDelay
      })
      return false
    }

    // Atualiza estado
    state.value.isRetrying = true
    state.value.retryCount++
    state.value.lastRetryTime = Date.now()
    state.value.currentDelay = calculateDelay(state.value.retryCount)

    try {
      await retryFn()
      
      // Sucesso: reseta contador
      state.value.retryCount = 0
      state.value.currentDelay = retryDelay
      
      return true
    } catch (error) {
      console.error(`Retry ${state.value.retryCount} falhou:`, error)
      
      // Atualiza estado para próxima tentativa
      state.value.canRetry = canExecuteRetry()
      
      return false
    } finally {
      state.value.isRetrying = false
    }
  }

  /**
   * Reseta o contador de tentativas
   */
  const resetRetry = (): void => {
    state.value = {
      retryCount: 0,
      lastRetryTime: 0,
      isRetrying: false,
      canRetry: true,
      currentDelay: retryDelay
    }
  }

  // Computed para estado derivado
  const computedState = computed(() => ({
    ...state.value,
    canRetry: canExecuteRetry(),
    remainingRetries: Math.max(0, maxRetries - state.value.retryCount),
    nextRetryIn: Math.max(0, state.value.currentDelay - (Date.now() - state.value.lastRetryTime))
  }))

  return {
    state: readonly(computedState),
    executeRetry,
    resetRetry,
    canExecuteRetry
  }
}
