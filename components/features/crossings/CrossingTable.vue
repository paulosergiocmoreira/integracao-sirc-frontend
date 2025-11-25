<template>
    <div class="bg-surface-0 dark:bg-surface-900 rounded-lg border border-surface-200 dark:border-surface-700">
      <!-- DataTable -->
      <DataTable
        :value="crossings"
        :loading="loading"
        striped-rows
        responsive-layout="scroll"
        :pt="{
          root: { class: 'rounded-lg overflow-hidden' },
          header: { class: 'bg-surface-50 dark:bg-surface-800' },
          loadingIcon: { class: 'text-primary' }
        }"
      >
        <!-- Loading State -->
        <template #loading>
          <div class="flex items-center justify-center py-8">
            <i class="pi pi-spin pi-spinner text-4xl text-primary" />
          </div>
        </template>
  
        <!-- Empty State -->
        <template #empty>
          <div class="flex flex-col items-center justify-center py-12 text-center">
            <i class="pi pi-inbox text-6xl text-surface-400 dark:text-surface-500 mb-4" />
            <h3 class="text-lg font-semibold text-surface-700 dark:text-surface-300 mb-2">
              Nenhum cruzamento encontrado
            </h3>
            <p class="text-sm text-surface-500 dark:text-surface-400">
              {{ hasFilters ? 'Tente ajustar os filtros' : 'Execute o primeiro cruzamento' }}
            </p>
          </div>
        </template>
  
        <!-- Nome do Arquivo -->
        <Column field="fileName" header="Arquivo" :sortable="true">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <i 
                :class="getFileIcon(data.fileName)" 
                class="text-lg text-surface-500 dark:text-surface-400"
              />
              <span class="font-medium text-surface-900 dark:text-surface-0">
                {{ data.fileName }}
              </span>
            </div>
          </template>
        </Column>
  
        <!-- Tipo -->
        <Column field="type" header="Tipo" :sortable="true">
          <template #body="{ data }">
            <Badge 
              :value="formatFileType(data.type)" 
              :severity="data.type === 'mensal' ? 'info' : 'secondary'"
            />
          </template>
        </Column>
  
        <!-- Referência -->
        <Column field="reference" header="Referência" :sortable="true">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <i class="pi pi-calendar text-surface-500 dark:text-surface-400" />
              <span class="text-sm font-mono">
                {{ data.reference }}
              </span>
            </div>
          </template>
        </Column>
  
        <!-- Data de Execução -->
        <Column field="crossingDate" header="Data Execução" :sortable="true">
          <template #body="{ data }">
            <div class="flex flex-col gap-1">
              <span class="text-sm font-medium text-surface-900 dark:text-surface-0">
                {{ formatAbsoluteDate(data.crossingDate) }}
              </span>
              <span class="text-xs text-surface-500 dark:text-surface-400">
                {{ formatRelativeDate(data.crossingDate) }}
              </span>
            </div>
          </template>
        </Column>
  
        <!-- Total de Óbitos -->
        <Column field="totalDeaths" header="Óbitos" :sortable="true">
          <template #body="{ data }">
            <span class="font-semibold text-surface-900 dark:text-surface-0">
              {{ formatNumber(data.totalDeaths) }}
            </span>
          </template>
        </Column>
  
        <!-- Total de Hits -->
        <Column field="totalHits" header="Hits" :sortable="true">
          <template #body="{ data }">
            <span class="font-semibold text-green-600 dark:text-green-400">
              {{ formatNumber(data.totalHits) }}
            </span>
          </template>
        </Column>
  
        <!-- Percentual de Hits -->
        <Column field="hitPercentage" header="% Hits" :sortable="true">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <span 
                class="font-semibold"
                :class="getPercentageColor(data.hitPercentage)"
              >
                {{ formatPercentage(data.hitPercentage) }}
              </span>
              <i 
                v-if="data.hitPercentage >= 90"
                class="pi pi-check-circle text-green-600 dark:text-green-400"
                v-tooltip.top="'Alta taxa de correspondência'"
              />
            </div>
          </template>
        </Column>
  
        <!-- Tempo de Execução -->
        <Column field="executionTime" header="Tempo" :sortable="true">
          <template #body="{ data }">
            <span class="text-sm font-mono text-surface-600 dark:text-surface-400">
              {{ formatExecutionTime(data.executionTime) }}
            </span>
          </template>
        </Column>
  
        <!-- Ações -->
        <Column v-if="props.showActions" header="Ações" style="width: 100px">
          <template #body="{ data }">
            <Button
              label="Ver Resultados"
              icon="pi pi-search"
              size="small"
              outlined
              @click="handleViewResults(data)"
              v-tooltip.top="'Ver resultados detalhados'"
              aria-label="Ver resultados do cruzamento"
            />
          </template>
        </Column>
      </DataTable>
  
      <!-- Paginação -->
      <div 
        v-if="totalCrossings > 0"
        class="flex items-center justify-between px-4 py-3 border-t border-surface-200 dark:border-surface-700"
      >
        <div class="flex items-center gap-2">
          <span class="text-sm text-surface-600 dark:text-surface-400">
            Itens por página:
          </span>
          <Dropdown
            :model-value="filters.limit"
            :options="[10, 20, 50]"
            @update:model-value="handleLimitChange"
            :pt="{
              root: { class: 'w-20' }
            }"
          />
        </div>

        <div class="flex items-center gap-4">
          <span class="text-sm text-surface-600 dark:text-surface-400">
            {{ paginationText }}
          </span>
          
          <Paginator
            :rows="filters.limit || 10"
            :total-records="totalCrossings"
            :first="((filters.page || 1) - 1) * (filters.limit || 10)"
            @page="handlePageChange"
            :pt="{
              root: { class: 'bg-transparent border-0' }
            }"
          />
        </div>
      </div>
    </div>
  </template>
  
<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import Paginator from 'primevue/paginator'
import Dropdown from 'primevue/dropdown'
import type { Crossing } from '~/types/api'
import { 
  formatAbsoluteDate, 
  formatRelativeDate, 
  formatNumber, 
  formatPercentage,
  formatFileType,
  getFileIcon,
  getPercentageColor,
  formatExecutionTime
} from '~/utils/formatters'
  
/**
 * Props do componente
 */
interface Props {
  /**
   * Mostrar coluna de ações
   */
  showActions?: boolean
  /**
   * Auto-refresh da tabela
   */
  autoRefresh?: boolean
  /**
   * Callback para ver resultados
   */
  onViewResults?: (crossing: Crossing) => void
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true,
  autoRefresh: false
})

/**
 * Emits do componente
 */
const emit = defineEmits<{
  viewResults: [crossing: Crossing]
  refresh: []
}>()

const router = useRouter()
const store = useCrossingsStore()
const toast = useToastMessages()

/**
 * Dados computados
 */
const crossings = computed(() => store.paginatedCrossings)
const loading = computed(() => store.loading)
const totalCrossings = computed(() => store.totalCrossings)
const filters = computed(() => store.filters)

// Busca dados iniciais
await store.fetchCrossings()
  
  /**
   * Verifica se há filtros ativos
   */
  const hasFilters = computed(() => {
    const f = filters.value
    return !!(f.fileId || f.referenceStart || f.referenceEnd || 
              f.hitPercentageMin !== undefined || f.hitPercentageMax !== undefined ||
              f.dateStart || f.dateEnd)
  })
  
  /**
   * Texto de paginação
   */
  const paginationText = computed(() => {
    const page = filters.value.page || 1
    const limit = filters.value.limit || 10
    const start = (page - 1) * limit + 1
    const end = Math.min(page * limit, totalCrossings.value)
    return `${start}-${end} de ${totalCrossings.value}`
  })
  
  
  /**
   * Handler para mudança de página
   */
  const handlePageChange = (event: any) => {
    const page = Math.floor(event.first / event.rows) + 1
    store.changePage(page)
  }
  
  /**
   * Handler para mudança de itens por página
   */
  const handleLimitChange = (limit: number) => {
    store.changeLimit(limit)
  }
  
  /**
   * Handler para ver resultados
   */
  const handleViewResults = async (crossing: Crossing) => {
    try {
      if (props.onViewResults) {
        props.onViewResults(crossing)
      } else {
        emit('viewResults', crossing)
        router.push(`/consultas?crossingId=${crossing.id}`)
      }
    } catch (error) {
      console.error('Erro ao navegar para resultados:', error)
      toast.messages.networkError()
    }
  }
  </script>