<template>
  <div v-if="hasError" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
    <div class="flex items-start gap-3">
      <div class="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
        <i class="pi pi-exclamation-triangle text-red-600 dark:text-red-400" />
      </div>
      
      <div class="flex-1">
        <h3 class="font-semibold text-red-900 dark:text-red-400 mb-1">
          Erro ao carregar dados
        </h3>
        <p class="text-sm text-red-700 dark:text-red-300 mb-3">
          {{ errorMessage }}
        </p>
        
        <!-- Informações de retry -->
        <div v-if="retryState.retryCount > 0" class="text-xs text-red-600 dark:text-red-400 mb-3">
          Tentativa {{ retryState.retryCount }} de {{ maxRetries }}
          <span v-if="retryState.nextRetryIn > 0">
            • Próxima tentativa em {{ Math.ceil(retryState.nextRetryIn / 1000) }}s
          </span>
        </div>
        
        <div class="flex gap-2">
          <Button 
            :label="retryState.isRetrying ? 'Tentando...' : 'Tentar novamente'" 
            size="small" 
            outlined
            severity="danger"
            :icon="retryState.isRetrying ? 'pi pi-spin pi-spinner' : 'pi pi-refresh'"
            :loading="retryState.isRetrying"
            :disabled="!retryState.canRetry || retryState.isRetrying"
            @click="handleRetry"
          />
          <Button 
            v-if="showDetails"
            label="Ver detalhes" 
            size="small" 
            text
            severity="danger"
            icon="pi pi-info-circle"
            @click="toggleDetails"
          />
        </div>
        
        <!-- Detalhes do erro (desenvolvimento) -->
        <div v-if="showErrorDetails" class="mt-3 p-3 bg-red-100 dark:bg-red-900/20 rounded border text-xs font-mono text-red-800 dark:text-red-300">
          <div class="font-semibold mb-1">Detalhes técnicos:</div>
          <pre>{{ errorDetails }}</pre>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Conteúdo normal quando não há erro -->
  <slot v-else />
</template>

<script setup lang="ts">
import Button from 'primevue/button'

/**
 * Props do componente ErrorBoundary
 */
interface Props {
  /**
   * Mensagem de erro personalizada
   */
  errorMessage?: string
  /**
   * Mostrar botão de detalhes (apenas em desenvolvimento)
   */
  showDetails?: boolean
  /**
   * Callback para retry
   */
  onRetry?: () => void | Promise<void>
  /**
   * Configuração do controle de retry
   */
  retryConfig?: {
    maxRetries?: number
    retryDelay?: number
    exponentialBackoff?: boolean
  }
}

const props = withDefaults(defineProps<Props>(), {
  errorMessage: 'Ocorreu um erro inesperado. Tente novamente.',
  showDetails: false,
  retryConfig: () => ({
    maxRetries: 3,
    retryDelay: 2000,
    exponentialBackoff: true
  })
})

/**
 * Emits do componente
 */
const emit = defineEmits<{
  retry: []
}>()

/**
 * Estado do componente
 */
const hasError = ref(false)
const showErrorDetails = ref(false)
const errorDetails = ref('')

/**
 * Controle de retry usando composable
 */
const { state: retryState, executeRetry, resetRetry } = useRetryControl(props.retryConfig)

/**
 * Computed para maxRetries (para exibição)
 */
const maxRetries = computed(() => props.retryConfig.maxRetries || 3)

/**
 * Função para mostrar erro
 */
const showError = (error: Error) => {
  hasError.value = true
  errorDetails.value = error.stack || error.message
  console.error('ErrorBoundary capturou erro:', error)
}

/**
 * Função para tentar novamente com controle de retry
 */
const handleRetry = async () => {
  if (!props.onRetry) {
    // Se não há callback, apenas emite evento
    hasError.value = false
    showErrorDetails.value = false
    emit('retry')
    return
  }

  // Usa controle de retry para callback
  const success = await executeRetry(async () => {
    await props.onRetry!()
    hasError.value = false
    showErrorDetails.value = false
  })

  if (success) {
    resetRetry()
  }
}

/**
 * Toggle para mostrar detalhes do erro
 */
const toggleDetails = () => {
  showErrorDetails.value = !showErrorDetails.value
}

/**
 * Expor função para uso externo
 */
defineExpose({
  showError,
  retry: handleRetry,
  resetRetry
})
</script>
