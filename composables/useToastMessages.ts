// composables/useToastMessages.ts
// Wrapper para PrimeVue Toast - facilita exibição de notificações

import { useToast as usePrimeToast } from 'primevue/usetoast'

// ✅ Type definitions
interface ToastMessages {
  fileUploaded: () => void
  fileDeleted: () => void
  fileScheduled: () => void
  crossingStarted: () => void
  crossingCompleted: () => void
  resultsFound: (count: number) => void
  noResults: () => void
  networkError: () => void
  validationError: (field: string) => void
  permissionError: () => void
  genericError: () => void
}

interface ToastService {
  success: (message: string, detail?: string, life?: number) => void
  error: (message: string, detail?: string, life?: number) => void
  warning: (message: string, detail?: string, life?: number) => void
  info: (message: string, detail?: string, life?: number) => void
  clear: () => void
  messages: ToastMessages
}

/**
 * Composable para notificações toast
 * 
 * @description Wrapper para PrimeVue Toast que facilita exibição de notificações
 * com mensagens pré-definidas para operações comuns do sistema
 * 
 * @returns {ToastService} Interface completa para notificações toast
 * 
 * @example
 * ```vue
 * <script setup>
 * const toast = useToastMessages()
 * 
 * // Notificações básicas
 * toast.success('Operação realizada com sucesso!')
 * toast.error('Erro ao processar requisição')
 * toast.warning('Atenção: dados podem estar desatualizados')
 * toast.info('Processando...')
 * 
 * // Mensagens pré-definidas
 * toast.messages.fileUploaded()
 * toast.messages.resultsFound(25)
 * toast.messages.genericError()
 * 
 * // Limpar todas as notificações
 * toast.clear()
 * </script>
 * ```
 */
export const useToastMessages = (): ToastService => {
  const toast = usePrimeToast()

  /**
   * Exibe notificação de sucesso
   * 
   * @param message - Mensagem principal
   * @param detail - Detalhes opcionais
   * @param life - Duração em ms (padrão: 3000)
   */
  const success = (message: string, detail?: string, life = 3000): void => {
    toast.add({
      severity: 'success',
      summary: message,
      detail,
      life
    })
  }

  /**
   * Exibe notificação de erro
   * 
   * @param message - Mensagem principal
   * @param detail - Detalhes opcionais
   * @param life - Duração em ms (padrão: 5000)
   */
  const error = (message: string, detail?: string, life = 5000): void => {
    toast.add({
      severity: 'error',
      summary: message,
      detail,
      life
    })
  }

  /**
   * Exibe notificação de aviso
   * 
   * @param message - Mensagem principal
   * @param detail - Detalhes opcionais
   * @param life - Duração em ms (padrão: 4000)
   */
  const warning = (message: string, detail?: string, life = 4000): void => {
    toast.add({
      severity: 'warn',
      summary: message,
      detail,
      life
    })
  }

  /**
   * Exibe notificação informativa
   * 
   * @param message - Mensagem principal
   * @param detail - Detalhes opcionais
   * @param life - Duração em ms (padrão: 3000)
   */
  const info = (message: string, detail?: string, life = 3000): void => {
    toast.add({
      severity: 'info',
      summary: message,
      detail,
      life
    })
  }

  /**
   * Remove todas as notificações
   * 
   * @description Limpa todas as notificações toast ativas
   */
  const clear = (): void => {
    toast.removeAllGroups()
  }

  /**
   * Mensagens pré-definidas para operações comuns
   * 
   * @description Coleção de mensagens padronizadas para operações do sistema
   */
  const messages: ToastMessages = {
    // Arquivos
    fileUploaded: () => success('Arquivo enviado', 'O arquivo foi salvo com sucesso'),
    fileDeleted: () => success('Arquivo excluído', 'O arquivo foi removido do sistema'),
    fileScheduled: () => success('Cruzamento agendado', 'O cruzamento foi agendado com sucesso'),
    
    // Cruzamentos
    crossingStarted: () => info('Cruzamento iniciado', 'O processamento foi iniciado'),
    crossingCompleted: () => success('Cruzamento concluído', 'Os dados foram processados com sucesso'),
    
    // Consultas
    resultsFound: (count: number) => success('Resultados encontrados', `${count} registro(s) encontrado(s)`),
    noResults: () => info('Nenhum resultado', 'Não foram encontrados registros com os filtros aplicados'),
    
    // Erros comuns
    networkError: () => error('Erro de conexão', 'Não foi possível conectar ao servidor'),
    validationError: (field: string) => error('Erro de validação', `O campo ${field} é inválido`),
    permissionError: () => error('Sem permissão', 'Você não tem permissão para esta operação'),
    genericError: () => error('Erro', 'Ocorreu um erro ao processar sua requisição')
  }

  return {
    success,
    error,
    warning,
    info,
    clear,
    messages
  } as const
}