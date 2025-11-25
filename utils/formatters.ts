// utils/formatters.ts
// Funções de formatação de dados

/**
 * Formata data ISO para formato brasileiro (DD/MM/YYYY HH:mm)
 * 
 * @param isoDate - Data no formato ISO 8601
 * @param includeTime - Se true, inclui hora e minuto
 * @returns Data formatada
 * 
 * @example
 * formatDate('2025-01-15T10:30:00Z') // '15/01/2025 10:30'
 * formatDate('2025-01-15T10:30:00Z', false) // '15/01/2025'
 */
export const formatDate = (isoDate: string, includeTime = true): string => {
    try {
      const date = new Date(isoDate)
      
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      
      const dateStr = `${day}/${month}/${year}`
      
      if (!includeTime) return dateStr
      
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      
      return `${dateStr} ${hours}:${minutes}`
    } catch {
      return 'Data inválida'
    }
  }
  
  /**
   * Formata data para formato relativo (ex: "há 2 dias", "ontem")
   * 
   * @param isoDate - Data no formato ISO 8601
   * @returns Data formatada de forma relativa
   * 
   * @example
   * formatRelativeDate('2025-01-14T10:00:00Z') // 'há 1 dia'
   */
  export const formatRelativeDate = (isoDate: string): string => {
    try {
      const date = new Date(isoDate)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) return 'Hoje'
      if (diffDays === 1) return 'Ontem'
      if (diffDays < 7) return `Há ${diffDays} dias`
      if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7)
        return `Há ${weeks} semana${weeks > 1 ? 's' : ''}`
      }
      if (diffDays < 365) {
        const months = Math.floor(diffDays / 30)
        return `Há ${months} ${months > 1 ? 'meses' : 'mês'}`
      }
      
      const years = Math.floor(diffDays / 365)
      return `Há ${years} ano${years > 1 ? 's' : ''}`
    } catch {
      return 'Data inválida'
    }
  }
  
  /**
   * Formata CPF (remove formatação ou adiciona)
   * 
   * @param cpf - CPF com ou sem formatação
   * @param formatted - Se true, retorna formatado; se false, apenas números
   * @returns CPF formatado
   * 
   * @example
   * formatCPF('12345678900') // '123.456.789-00'
   * formatCPF('123.456.789-00', false) // '12345678900'
   */
  export const formatCPF = (cpf: string, formatted = true): string => {
    // Remove tudo que não é dígito
    const numbers = cpf.replace(/\D/g, '')
    
    if (!formatted) return numbers
    
    // Adiciona formatação
    if (numbers.length !== 11) return cpf // Retorna original se inválido
    
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }
  
  /**
   * Formata porcentagem
   * 
   * @param value - Valor numérico da porcentagem
   * @param decimals - Número de casas decimais
   * @returns Porcentagem formatada
   * 
   * @example
   * formatPercentage(85.678) // '85.7%'
   * formatPercentage(100, 0) // '100%'
   */
  export const formatPercentage = (value: number, decimals = 1): string => {
    return `${value.toFixed(decimals)}%`
  }
  
  /**
   * Formata número com separadores de milhar
   * 
   * @param value - Valor numérico
   * @returns Número formatado
   * 
   * @example
   * formatNumber(1234567) // '1.234.567'
   */
  export const formatNumber = (value: number): string => {
    return value.toLocaleString('pt-BR')
  }
  
  /**
   * Formata tempo de execução em segundos para formato legível
   * 
   * @param seconds - Tempo em segundos
   * @returns Tempo formatado
   * 
   * @example
   * formatExecutionTime(245) // '4m 5s'
   * formatExecutionTime(45) // '45s'
   * formatExecutionTime(3665) // '1h 1m 5s'
   */
  export const formatExecutionTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`
    
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    const parts: string[] = []
    
    if (hours > 0) parts.push(`${hours}h`)
    if (minutes > 0) parts.push(`${minutes}m`)
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`)
    
    return parts.join(' ')
  }
  
  /**
   * Formata tamanho de arquivo
   * 
   * @param bytes - Tamanho em bytes
   * @returns Tamanho formatado
   * 
   * @example
   * formatFileSize(1024) // '1 KB'
   * formatFileSize(1048576) // '1 MB'
   */
  export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  }
  
  /**
   * Formata tipo de arquivo para label legível
   * 
   * @param type - Tipo do arquivo ('mensal' ou 'diario')
   * @returns Label formatado
   * 
   * @example
   * formatFileType('mensal') // 'Mensal'
   * formatFileType('diario') // 'Diário'
   */
  export const formatFileType = (type: string): string => {
    const types: Record<string, string> = {
      mensal: 'Mensal',
      diario: 'Diário'
    }
    return types[type] || type
  }
  
  /**
   * Formata status para label legível
   * 
   * @param status - Status do arquivo
   * @returns Label formatado
   * 
   * @example
   * formatFileStatus('em-execucao') // 'Em Execução'
   */
  export const formatFileStatus = (status: string): string => {
    const statuses: Record<string, string> = {
      salvo: 'Salvo',
      'em-execucao': 'Em Execução',
      erro: 'Erro',
      agendado: 'Agendado'
    }
    return statuses[status] || status
  }
  
  /**
   * Formata tipo de hit para label legível
   * 
   * @param hitType - Tipo de hit
   * @returns Label formatado
   * 
   * @example
   * formatHitType('hit-perfeito') // 'Hit Perfeito'
   */
  export const formatHitType = (hitType: string): string => {
    const types: Record<string, string> = {
      'hit-perfeito': 'Hit Perfeito',
      'cpf-completo': 'CPF Completo',
      'cpf-incompleto': 'CPF Incompleto',
      'data-nascimento': 'Data Nascimento',
      'hit-com-falecido': 'Com Falecido'
    }
    return types[hitType] || hitType
  }
  
  /**
   * Trunca texto longo
   * 
   * @param text - Texto a ser truncado
   * @param maxLength - Comprimento máximo
   * @returns Texto truncado com reticências
   * 
   * @example
   * truncateText('arquivo_muito_longo_com_nome_grande.csv', 20) // 'arquivo_muito_lon...'
   */
  export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength - 3) + '...'
  }

  /**
   * Retorna ícone baseado na extensão do arquivo
   * 
   * @param filename - Nome do arquivo
   * @returns Classe do ícone PrimeIcons
   * 
   * @example
   * getFileIcon('arquivo.csv') // 'pi pi-file'
   * getFileIcon('planilha.xlsx') // 'pi pi-file-excel'
   */
  export const getFileIcon = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase()
    
    switch (ext) {
      case 'csv':
        return 'pi pi-file'
      case 'xlsx':
      case 'xls':
        return 'pi pi-file-excel'
      case 'txt':
        return 'pi pi-file-edit'
      default:
        return 'pi pi-file'
    }
  }

  /**
   * Retorna classe de cor baseada no percentual de hits
   * 
   * @param percentage - Percentual de hits (0-100)
   * @returns Classe CSS para cor
   * 
   * @example
   * getPercentageColor(95) // 'text-green-600 dark:text-green-400'
   * getPercentageColor(60) // 'text-amber-600 dark:text-amber-400'
   */
  export const getPercentageColor = (percentage: number): string => {
    if (percentage >= 90) return 'text-green-600 dark:text-green-400'
    if (percentage >= 70) return 'text-blue-600 dark:text-blue-400'
    if (percentage >= 50) return 'text-amber-600 dark:text-amber-400'
    return 'text-red-600 dark:text-red-400'
  }

  /**
   * Retorna severity para badge de status
   * 
   * @param status - Status do arquivo/cruzamento
   * @returns Severity do PrimeVue Badge
   * 
   * @example
   * getStatusSeverity('salvo') // 'success'
   * getStatusSeverity('erro') // 'danger'
   */
  export const getStatusSeverity = (status: string): string => {
    switch (status) {
      case 'salvo':
        return 'success'
      case 'agendado':
        return 'warn'
      case 'em-execucao':
        return 'info'
      case 'erro':
        return 'danger'
      default:
        return 'secondary'
    }
  }

  /**
   * Formata data absoluta para exibição
   * 
   * @param isoDate - Data no formato ISO 8601
   * @returns Data formatada sem hora
   * 
   * @example
   * formatAbsoluteDate('2025-01-15T10:30:00Z') // '15/01/2025'
   */
  export const formatAbsoluteDate = (isoDate: string): string => {
    return formatDate(isoDate, false)
  }