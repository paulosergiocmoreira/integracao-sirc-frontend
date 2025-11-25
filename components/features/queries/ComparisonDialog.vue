<template>
    <Dialog
      :visible="visible"
      :header="dialogTitle"
      :modal="true"
      :closable="true"
      :draggable="false"
      class="w-full max-w-4xl"
      @update:visible="emit('update:visible', $event)"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <i class="pi pi-clone text-2xl text-primary"></i>
          <div>
            <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-50">
              Comparação de Dados
            </h3>
            <p class="text-sm text-surface-600 dark:text-surface-400">
              SIRC vs Sistema Pessoal
            </p>
          </div>
        </div>
      </template>
  
      <ErrorBoundary 
        error-message="Erro ao carregar dados de comparação"
        :on-retry="handleRetry"
        :retry-config="{ maxRetries: 2, retryDelay: 1000, exponentialBackoff: true }"
      >
        <div v-if="loading" class="flex items-center justify-center py-12">
          <ProgressSpinner style="width: 50px; height: 50px" />
        </div>

        <div v-else-if="comparison" class="space-y-4">
        <!-- Alerta de diferenças -->
        <Message 
          v-if="comparison.differences.length > 0"
          severity="warn" 
          :closable="false"
        >
          <template #icon>
            <i class="pi pi-exclamation-triangle"></i>
          </template>
          {{ comparison.differences.length }} diferença(s) encontrada(s) entre os sistemas
        </Message>

        <Message 
          v-else
          severity="success" 
          :closable="false"
        >
          <template #icon>
            <i class="pi pi-check-circle"></i>
          </template>
          Todos os dados conferem entre os sistemas
        </Message>
  
        <!-- Tabela de Comparação -->
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-surface-100 dark:bg-surface-700">
                <th class="text-left p-3 border border-surface-200 dark:border-surface-600 font-semibold text-surface-900 dark:text-surface-50">
                  Campo
                </th>
                <th class="text-left p-3 border border-surface-200 dark:border-surface-600 font-semibold text-surface-900 dark:text-surface-50">
                  SIRC
                </th>
                <th class="text-left p-3 border border-surface-200 dark:border-surface-600 font-semibold text-surface-900 dark:text-surface-50">
                  Sistema Pessoal
                </th>
                <th class="text-center p-3 border border-surface-200 dark:border-surface-600 font-semibold text-surface-900 dark:text-surface-50 w-24">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              <!-- CPF -->
              <tr :class="getRowClass('cpf')">
                <td class="p-3 border border-surface-200 dark:border-surface-600 font-medium text-surface-700 dark:text-surface-300">
                  CPF
                </td>
                <td class="p-3 border border-surface-200 dark:border-surface-600 font-mono text-sm">
                  {{ comparison.sircData.cpf }}
                </td>
                <td class="p-3 border border-surface-200 dark:border-surface-600 font-mono text-sm">
                  {{ comparison.personalSystemData.cpf }}
                </td>
                <td class="p-3 border border-surface-200 dark:border-surface-600 text-center">
                  <Badge 
                    :value="getStatusLabel('cpf')" 
                    :severity="getStatusSeverity('cpf')"
                  />
                </td>
              </tr>
  
              <!-- Nome -->
              <tr :class="getRowClass('nome')">
                <td class="p-3 border border-surface-200 dark:border-surface-600 font-medium text-surface-700 dark:text-surface-300">
                  Nome
                </td>
                <td class="p-3 border border-surface-200 dark:border-surface-600">
                  {{ comparison.sircData.name }}
                </td>
                <td class="p-3 border border-surface-200 dark:border-surface-600">
                  {{ comparison.personalSystemData.name }}
                </td>
                <td class="p-3 border border-surface-200 dark:border-surface-600 text-center">
                  <Badge 
                    :value="getStatusLabel('nome')" 
                    :severity="getStatusSeverity('nome')"
                  />
                </td>
              </tr>
  
              <!-- Nome da Mãe -->
              <tr :class="getRowClass('Nome da Mãe')">
                <td class="p-3 border border-surface-200 dark:border-surface-600 font-medium text-surface-700 dark:text-surface-300">
                  Nome da Mãe
                </td>
                <td class="p-3 border border-surface-200 dark:border-surface-600">
                  {{ comparison.sircData.motherName }}
                </td>
                <td class="p-3 border border-surface-200 dark:border-surface-600">
                  {{ comparison.personalSystemData.motherName }}
                </td>
                <td class="p-3 border border-surface-200 dark:border-surface-600 text-center">
                  <Badge 
                    :value="getStatusLabel('Nome da Mãe')" 
                    :severity="getStatusSeverity('Nome da Mãe')"
                  />
                </td>
              </tr>
  
              <!-- Data de Nascimento -->
              <tr :class="getRowClass('Data de Nascimento')">
                <td class="p-3 border border-surface-200 dark:border-surface-600 font-medium text-surface-700 dark:text-surface-300">
                  Data de Nascimento
                </td>
                <td class="p-3 border border-surface-200 dark:border-surface-600">
                  {{ comparison.sircData.birthDate }}
                </td>
                <td class="p-3 border border-surface-200 dark:border-surface-600">
                  {{ comparison.personalSystemData.birthDate }}
                </td>
                <td class="p-3 border border-surface-200 dark:border-surface-600 text-center">
                  <Badge 
                    :value="getStatusLabel('Data de Nascimento')" 
                    :severity="getStatusSeverity('Data de Nascimento')"
                  />
                </td>
              </tr>
  
              <!-- Data de Óbito -->
              <tr :class="getRowClass('Data de Óbito')">
                <td class="p-3 border border-surface-200 dark:border-surface-600 font-medium text-surface-700 dark:text-surface-300">
                  Data de Óbito
                </td>
                <td class="p-3 border border-surface-200 dark:border-surface-600">
                  {{ comparison.sircData.deathDate || '-' }}
                </td>
                <td class="p-3 border border-surface-200 dark:border-surface-600">
                  -
                </td>
                <td class="p-3 border border-surface-200 dark:border-surface-600 text-center">
                  <Badge 
                    value="Info" 
                    severity="info"
                  />
                </td>
              </tr>
  
              <!-- Status (apenas no Sistema Pessoal) -->
              <tr>
                <td class="p-3 border border-surface-200 dark:border-surface-600 font-medium text-surface-700 dark:text-surface-300">
                  Status
                </td>
                <td class="p-3 border border-surface-200 dark:border-surface-600 text-surface-400 dark:text-surface-500">
                  -
                </td>
                <td class="p-3 border border-surface-200 dark:border-surface-600">
                  <Badge 
                    :value="comparison.personalSystemData.status" 
                    :severity="comparison.personalSystemData.status === 'Ativo' ? 'success' : 'danger'"
                  />
                </td>
                <td class="p-3 border border-surface-200 dark:border-surface-600 text-center">
                  <Badge 
                    value="Info" 
                    severity="info"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <!-- Detalhes das Diferenças -->
        <div 
          v-if="comparison.differences.length > 0"
          class="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-4"
        >
          <h4 class="text-sm font-semibold text-orange-900 dark:text-orange-200 mb-3">
            Detalhes das Diferenças
          </h4>
          <ul class="space-y-2">
            <li 
              v-for="(diff, index) in comparison.differences"
              :key="index"
              class="text-sm text-orange-800 dark:text-orange-300"
            >
              <strong>{{ diff.field }}:</strong>
              <span class="ml-2">SIRC: "{{ diff.sircValue }}"</span>
              <span class="mx-1">→</span>
              <span>Sistema Pessoal: "{{ diff.personalSystemValue }}"</span>
            </li>
          </ul>
        </div>
  
        <!-- Observações -->
        <div class="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 class="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
            Observações
          </h4>
          <ul class="space-y-1 text-sm text-blue-800 dark:text-blue-300">
            <li>• As diferenças encontradas podem indicar dados desatualizados ou inconsistências cadastrais</li>
            <li>• Recomenda-se verificar a origem dos dados e atualizar conforme necessário</li>
            <li>• Em caso de dúvidas, consulte a documentação do sistema</li>
          </ul>
        </div>
        </div>
      </ErrorBoundary>
  
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button
            label="Fechar"
            icon="pi pi-times"
            severity="secondary"
            @click="handleClose"
          />
        </div>
      </template>
    </Dialog>
  </template>
  
  <script setup lang="ts">
  import Dialog from 'primevue/dialog'
  import Button from 'primevue/button'
  import Badge from 'primevue/badge'
  import Message from 'primevue/message'
  import ProgressSpinner from 'primevue/progressspinner'
  import type { QueryResult } from '~/types/api'
  import { useComparison } from '~/composables/useComparison'
  import ErrorBoundary from '~/components/ui/ErrorBoundary.vue'
  
  /**
   * Props do componente ComparisonDialog
   */
  interface Props {
    /** Controla visibilidade do dialog */
    visible: boolean
    /** Resultado da consulta a ser comparado */
    result: QueryResult | null
  }
  
  const props = defineProps<Props>()
  
  /**
   * Emits do componente ComparisonDialog
   */
  const emit = defineEmits<{
    /** Emitido quando visibilidade do dialog muda */
    'update:visible': [value: boolean]
  }>()
  
  const {
    comparison,
    loading,
    loadComparison,
    clearComparison,
    hasDifference,
    getRowClass,
    getStatusLabel,
    getStatusSeverity
  } = useComparison()
  
  /**
   * Título do dialog
   */
  const dialogTitle = computed(() => {
    if (!props.result) return 'Comparação de Dados'
    return `Comparação - ${props.result.name}`
  })
  
  /**
   * Fecha dialog
   */
  const handleClose = () => {
    emit('update:visible', false)
    clearComparison()
  }

  /**
   * Handler para retry do ErrorBoundary
   * Recarrega comparação com controle de retry
   */
  const handleRetry = async () => {
    if (props.result) {
      try {
        await loadComparison(props.result.id)
      } catch (error) {
        // Erro será capturado pelo ErrorBoundary
        console.error('Erro no retry de comparação:', error)
      }
    }
  }
  
  // Carrega comparação quando dialog abre
  watch(() => props.visible, (newValue) => {
    if (newValue && props.result) {
      loadComparison(props.result.id)
    } else if (!newValue) {
      clearComparison()
    }
  })
  </script>