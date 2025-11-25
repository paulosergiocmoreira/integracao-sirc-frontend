// types/components.ts
// Interfaces TypeScript para componentes

import type { Crossing, File } from '~/types/api'

/**
 * Props base para componentes de tabela
 */
export interface BaseTableProps {
  /**
   * Mostrar coluna de ações
   */
  showActions?: boolean
  /**
   * Auto-refresh da tabela
   */
  autoRefresh?: boolean
  /**
   * Tamanho da página
   */
  pageSize?: number
}

/**
 * Props para componentes de filtros
 */
export interface BaseFiltersProps {
  /**
   * Aplicar filtros automaticamente ao mudar
   */
  autoApply?: boolean
  /**
   * Mostrar filtros avançados
   */
  showAdvanced?: boolean
  /**
   * Tempo de debounce para auto-apply (ms)
   */
  debounceMs?: number
}

/**
 * Props para componentes de estatísticas
 */
export interface BaseStatsProps {
  /**
   * Mostrar detalhes adicionais
   */
  showDetails?: boolean
  /**
   * Formato de exibição
   */
  displayFormat?: 'compact' | 'detailed'
}

/**
 * Props específicas para CrossingTable
 */
export interface CrossingTableProps extends BaseTableProps {
  /**
   * Callback para ver resultados
   */
  onViewResults?: (crossing: Crossing) => void
}

/**
 * Props específicas para CrossingFilters
 */
export interface CrossingFiltersProps extends BaseFiltersProps {
  /**
   * Filtros iniciais
   */
  initialFilters?: Record<string, any>
}

/**
 * Props específicas para CrossingStats
 */
export interface CrossingStatsProps extends BaseStatsProps {
  /**
   * Período para estatísticas
   */
  period?: 'all' | 'month' | 'year'
}

/**
 * Props para FileTable (referência)
 */
export interface FileTableProps extends BaseTableProps {
  /**
   * Callback para agendar cruzamento
   */
  onSchedule?: (file: File) => void
  /**
   * Callback para executar cruzamento
   */
  onExecute?: (file: File) => void
  /**
   * Callback para excluir arquivo
   */
  onDelete?: (file: File) => void
}

/**
 * Props para ErrorBoundary
 */
export interface ErrorBoundaryProps {
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
  onRetry?: () => void
}

/**
 * Eventos comuns para componentes de tabela
 */
export interface BaseTableEmits {
  /**
   * Evento de refresh
   */
  refresh: []
  /**
   * Evento de mudança de página
   */
  pageChange: [page: number]
  /**
   * Evento de mudança de tamanho da página
   */
  pageSizeChange: [size: number]
}

/**
 * Eventos para componentes de filtros
 */
export interface BaseFiltersEmits {
  /**
   * Filtros aplicados
   */
  filtersApplied: []
  /**
   * Filtros resetados
   */
  filtersReset: []
  /**
   * Filtros alterados
   */
  filtersChanged: [filters: Record<string, any>]
}

/**
 * Eventos específicos para CrossingTable
 */
export interface CrossingTableEmits extends BaseTableEmits {
  /**
   * Ver resultados de cruzamento
   */
  viewResults: [crossing: Crossing]
}

/**
 * Eventos específicos para CrossingFilters
 */
export interface CrossingFiltersEmits {
  /**
   * Filtros aplicados
   */
  filtersApplied: []
  /**
   * Filtros resetados
   */
  filtersReset: []
  /**
   * Filtros alterados
   */
  filtersChanged: [filters: Record<string, any>]
}

/**
 * Eventos para ErrorBoundary
 */
export interface ErrorBoundaryEmits {
  /**
   * Tentar novamente
   */
  retry: []
  /**
   * Erro capturado
   */
  error: [error: Error]
}

/**
 * Tipos para configuração de colunas de tabela
 */
export interface TableColumn {
  field: string
  header: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  frozen?: boolean
  alignFrozen?: 'left' | 'right'
}

/**
 * Tipos para configuração de filtros
 */
export interface FilterConfig {
  field: string
  label: string
  type: 'text' | 'select' | 'date' | 'number' | 'boolean'
  options?: Array<{ label: string; value: any }>
  placeholder?: string
  required?: boolean
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
}

/**
 * Tipos para configuração de estatísticas
 */
export interface StatCard {
  title: string
  value: number
  icon: string
  color: string
  format: 'number' | 'percentage' | 'currency' | 'text'
  trend?: {
    value: number
    direction: 'up' | 'down' | 'stable'
  }
}

/**
 * Utilitários de tipo para componentes
 */
export type ComponentSize = 'small' | 'medium' | 'large'
export type ComponentVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
export type ComponentSeverity = 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast'

/**
 * Props comuns para todos os componentes
 */
export interface BaseComponentProps {
  /**
   * Classe CSS personalizada
   */
  class?: string
  /**
   * ID do componente
   */
  id?: string
  /**
   * Título para acessibilidade
   */
  'aria-label'?: string
  /**
   * Descrição para acessibilidade
   */
  'aria-describedby'?: string
}
