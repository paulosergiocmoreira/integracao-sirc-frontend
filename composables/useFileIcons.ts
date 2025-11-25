/**
 * Composable para gerenciar ícones de arquivos
 * Centraliza a lógica de determinação de ícones baseados na extensão do arquivo
 */

// ✅ Type definitions
interface UseFileIconsReturn {
  getFileIcon: (filename: string) => string
  getFileIconColor: (filename: string) => string
  getFileTypeDescription: (filename: string) => string
}

/**
 * Composable para gerenciar ícones de arquivos
 * 
 * @description Centraliza a lógica de determinação de ícones, cores e descrições
 * baseados na extensão do arquivo, fornecendo helpers para UI
 * 
 * @returns {UseFileIconsReturn} Interface completa para gerenciamento de ícones
 * 
 * @example
 * ```vue
 * <script setup>
 * const { getFileIcon, getFileIconColor, getFileTypeDescription } = useFileIcons()
 * 
 * // Obter ícone
 * const icon = getFileIcon('documento.pdf') // 'pi pi-file-pdf'
 * 
 * // Obter cor
 * const color = getFileIconColor('planilha.xlsx') // 'text-green-600'
 * 
 * // Obter descrição
 * const description = getFileTypeDescription('arquivo.csv') // 'Arquivo CSV'
 * </script>
 * ```
 */
export const useFileIcons = (): UseFileIconsReturn => {
  /**
   * Retorna ícone baseado na extensão do arquivo
   * 
   * @param filename - Nome do arquivo com extensão
   * @returns {string} Classe CSS do ícone PrimeIcons
   */
  const getFileIcon = (filename: string): string => {
    if (!filename) return 'pi pi-file'
    
    const ext = filename.split('.').pop()?.toLowerCase()
    
    switch (ext) {
      case 'csv':
        return 'pi pi-file'
      case 'xlsx':
      case 'xls':
        return 'pi pi-file-excel'
      case 'txt':
        return 'pi pi-file-edit'
      case 'pdf':
        return 'pi pi-file-pdf'
      case 'doc':
      case 'docx':
        return 'pi pi-file-word'
      case 'zip':
      case 'rar':
      return 'pi pi-file-archive'
      default:
        return 'pi pi-file'
    }
  }

  /**
   * Retorna cor do ícone baseado na extensão
   * 
   * @param filename - Nome do arquivo com extensão
   * @returns {string} Classe CSS de cor Tailwind
   */
  const getFileIconColor = (filename: string): string => {
    if (!filename) return 'text-surface-500 dark:text-surface-400'
    
    const ext = filename.split('.').pop()?.toLowerCase()
    
    switch (ext) {
      case 'csv':
        return 'text-green-500'
      case 'xlsx':
      case 'xls':
        return 'text-green-600'
      case 'txt':
        return 'text-blue-500'
      case 'pdf':
        return 'text-red-500'
      case 'doc':
      case 'docx':
        return 'text-blue-600'
      case 'zip':
      case 'rar':
        return 'text-orange-500'
      default:
        return 'text-surface-500 dark:text-surface-400'
    }
  }

  /**
   * Retorna descrição do tipo de arquivo
   * 
   * @param filename - Nome do arquivo com extensão
   * @returns {string} Descrição legível do tipo de arquivo
   */
  const getFileTypeDescription = (filename: string): string => {
    if (!filename) return 'Arquivo'
    
    const ext = filename.split('.').pop()?.toLowerCase()
    
    switch (ext) {
      case 'csv':
        return 'Arquivo CSV'
      case 'xlsx':
        return 'Planilha Excel'
      case 'xls':
        return 'Planilha Excel (legado)'
      case 'txt':
        return 'Arquivo de texto'
      case 'pdf':
        return 'Documento PDF'
      case 'doc':
        return 'Documento Word (legado)'
      case 'docx':
        return 'Documento Word'
      case 'zip':
        return 'Arquivo ZIP'
      case 'rar':
        return 'Arquivo RAR'
      default:
        return 'Arquivo'
    }
  }

  return {
    getFileIcon,
    getFileIconColor,
    getFileTypeDescription
  }
}
