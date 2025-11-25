/**
 * Composable para formatação de dados de arquivos
 * Centraliza funções de formatação e validação relacionadas a arquivos
 */

import { formatDate, formatRelativeDate, formatFileType, formatFileStatus } from '~/utils/formatters'

// ✅ Type definitions
interface UploadData {
  date: string
  time: string
}

interface FileSummary {
  name: string
  type: string
  reference: string
  uploadDate: string
  uploadTime: string
  status: string
  statusSeverity: string
  lastCrossing: string
}

interface UseFileFormattingReturn {
  getStatusSeverity: (status: string) => string
  formatUploadData: (uploadDate: string) => UploadData
  formatPeriodReference: (reference: string) => string
  formatFileSize: (sizeInBytes: number) => string
  formatUploadProgress: (loaded: number, total: number) => number
  isValidFileType: (filename: string, allowedTypes?: string[]) => boolean
  generateFileSummary: (file: any) => FileSummary
  formatDate: typeof formatDate
  formatRelativeDate: typeof formatRelativeDate
  formatFileType: typeof formatFileType
  formatFileStatus: typeof formatFileStatus
}

/**
 * Composable para formatação de dados de arquivos
 * 
 * @description Centraliza funções de formatação e validação relacionadas a arquivos,
 * fornecendo helpers para UI e re-exportando utilitários de formatação
 * 
 * @returns {UseFileFormattingReturn} Interface completa para formatação de arquivos
 * 
 * @example
 * ```vue
 * <script setup>
 * const { getStatusSeverity, formatFileSize, generateFileSummary } = useFileFormatting()
 * 
 * // Obter severity para badge
 * const severity = getStatusSeverity('salvo') // 'success'
 * 
 * // Formatar tamanho de arquivo
 * const size = formatFileSize(1024) // '1 KB'
 * 
 * // Gerar resumo completo
 * const summary = generateFileSummary(file)
 * </script>
 * ```
 */
export const useFileFormatting = (): UseFileFormattingReturn => {
  /**
   * Retorna severity para badge de status
   * @param status - Status do arquivo
   * @returns Severity do PrimeVue Badge
   */
  const getStatusSeverity = (status: string): string => {
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
   * Formata dados de upload para exibição
   * 
   * @param uploadDate - Data de upload
   * @returns {UploadData} Objeto com data formatada e hora
   */
  const formatUploadData = (uploadDate: string): UploadData => {
    const formattedDate = formatDate(uploadDate, false)
    const time = formatDate(uploadDate).split(' ')[1] || ''
    
    return {
      date: formattedDate,
      time
    }
  }

  /**
   * Formata referência de período
   * 
   * @param reference - Referência no formato MM/YYYY
   * @returns {string} Referência formatada com nome do mês
   */
  const formatPeriodReference = (reference: string): string => {
    if (!reference) return ''
    
    const [month, year] = reference.split('/')
    const monthNames = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ]
    
    if (!month || !year) return reference
    
    const monthIndex = parseInt(month) - 1
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${monthNames[monthIndex]}/${year}`
    }
    
    return reference
  }

  /**
   * Formata tamanho de arquivo
   * 
   * @param sizeInBytes - Tamanho em bytes
   * @returns {string} Tamanho formatado (KB, MB, GB)
   */
  const formatFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(sizeInBytes) / Math.log(k))
    
    return parseFloat((sizeInBytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  /**
   * Formata progresso de upload
   * 
   * @param loaded - Bytes carregados
   * @param total - Total de bytes
   * @returns {number} Porcentagem formatada (0-100)
   */
  const formatUploadProgress = (loaded: number, total: number): number => {
    if (total === 0) return 0
    return Math.round((loaded / total) * 100)
  }

  /**
   * Valida se arquivo é de tipo permitido
   * 
   * @param filename - Nome do arquivo
   * @param allowedTypes - Tipos permitidos (extensões)
   * @returns {boolean} Se arquivo é válido
   */
  const isValidFileType = (filename: string, allowedTypes: string[] = ['csv', 'txt', 'xls', 'xlsx']): boolean => {
    if (!filename) return false
    
    const ext = filename.split('.').pop()?.toLowerCase()
    return ext ? allowedTypes.includes(ext) : false
  }

  /**
   * Gera resumo de arquivo para exibição
   * 
   * @param file - Objeto do arquivo
   * @returns {FileSummary} Resumo formatado com todos os dados
   */
  const generateFileSummary = (file: any): FileSummary => {
    const uploadData = formatUploadData(file.uploadDate)
    const periodRef = formatPeriodReference(file.reference)
    
    return {
      name: file.name,
      type: formatFileType(file.type),
      reference: periodRef,
      uploadDate: uploadData.date,
      uploadTime: uploadData.time,
      status: formatFileStatus(file.status),
      statusSeverity: getStatusSeverity(file.status),
      lastCrossing: file.lastCrossing ? formatRelativeDate(file.lastCrossing) : 'Nunca'
    }
  }

  return {
    getStatusSeverity,
    formatUploadData,
    formatPeriodReference,
    formatFileSize,
    formatUploadProgress,
    isValidFileType,
    generateFileSummary,
    // Re-exporta funções dos utils para conveniência
    formatDate,
    formatRelativeDate,
    formatFileType,
    formatFileStatus
  }
}
