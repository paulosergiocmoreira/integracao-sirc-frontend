<template>
    <ErrorBoundary 
      error-message="Erro ao carregar filtros de consulta"
      :on-retry="handleRetry"
      :retry-config="{ maxRetries: 3, retryDelay: 1500, exponentialBackoff: true }"
    >
      <div class="space-y-4">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-surface-900 dark:text-surface-50">
          Filtros de Busca
        </h2>
        
        <Button
          v-if="hasActiveFilters"
          label="Limpar Filtros"
          icon="pi pi-filter-slash"
          severity="secondary"
          size="small"
          @click="handleClearFilters"
        />
      </div>
  
      <!-- Active Filters Badges -->
      <div 
        v-if="activeFiltersList.length > 0" 
        class="flex flex-wrap gap-2"
      >
        <Badge
          v-for="filter in activeFiltersList"
          :key="filter.key"
          :value="`${filter.label}: ${filter.value}`"
          severity="info"
        />
      </div>
  
      <!-- Formulário de Filtros -->
      <form @submit.prevent="handleSearch" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- CPF -->
        <div class="flex flex-col gap-2">
          <label 
            for="filter-cpf" 
            class="text-sm font-medium text-surface-700 dark:text-surface-300"
          >
            CPF
          </label>
          <InputText
            id="filter-cpf"
            v-model="formData.cpf"
            placeholder="000.000.000-00"
            :class="{ 'p-invalid': cpfError }"
            :aria-invalid="!!cpfError"
            :aria-describedby="cpfError ? 'cpf-error' : undefined"
            @input="handleCPFInput"
          />
          <small 
            v-if="cpfError" 
            id="cpf-error"
            class="text-red-500"
            role="alert"
            aria-live="polite"
          >
            {{ cpfError }}
          </small>
        </div>
  
        <!-- Nome -->
        <div class="flex flex-col gap-2">
          <label 
            for="filter-name" 
            class="text-sm font-medium text-surface-700 dark:text-surface-300"
          >
            Nome ou Nome da Mãe
          </label>
          <InputText
            id="filter-name"
            v-model="formData.name"
            placeholder="Digite o nome"
          />
        </div>
  
        <!-- Cruzamento -->
        <div class="flex flex-col gap-2">
          <label 
            for="filter-crossing" 
            class="text-sm font-medium text-surface-700 dark:text-surface-300"
          >
            Cruzamento
          </label>
          <InputText
            id="filter-crossing"
            v-model="formData.crossingId"
            placeholder="ID do cruzamento"
          />
        </div>
  
        <!-- Período Inicial -->
        <div class="flex flex-col gap-2">
          <label 
            for="filter-ref-start" 
            class="text-sm font-medium text-surface-700 dark:text-surface-300"
          >
            Período Inicial (MM/YYYY)
          </label>
          <InputMask
            id="filter-ref-start"
            v-model="formData.referenceStart"
            mask="99/9999"
            placeholder="01/2024"
          />
        </div>
  
        <!-- Período Final -->
        <div class="flex flex-col gap-2">
          <label 
            for="filter-ref-end" 
            class="text-sm font-medium text-surface-700 dark:text-surface-300"
          >
            Período Final (MM/YYYY)
          </label>
          <InputMask
            id="filter-ref-end"
            v-model="formData.referenceEnd"
            mask="99/9999"
            placeholder="12/2024"
            :class="{ 'p-invalid': periodError }"
            :aria-invalid="!!periodError"
            :aria-describedby="periodError ? 'period-error' : undefined"
          />
          <small 
            v-if="periodError" 
            id="period-error"
            class="text-red-500"
            role="alert"
            aria-live="polite"
          >
            {{ periodError }}
          </small>
        </div>
  
        <!-- Tipos de Hit -->
        <div class="flex flex-col gap-2">
          <label 
            for="filter-hit-types" 
            class="text-sm font-medium text-surface-700 dark:text-surface-300"
          >
            Tipos de Hit
          </label>
          <MultiSelect
            id="filter-hit-types"
            v-model="formData.hitTypes"
            :options="hitTypeOptions"
            option-label="label"
            option-value="value"
            placeholder="Selecione os tipos"
            :max-selected-labels="2"
            class="w-full"
          />
        </div>
  
        <!-- Incluir Sem Hits -->
        <div class="flex items-center gap-2 pt-6">
          <Checkbox
            id="filter-include-no-hits"
            v-model="formData.includeNoHits"
            :binary="true"
            aria-describedby="include-no-hits-help"
          />
          <label 
            for="filter-include-no-hits" 
            class="text-sm font-medium text-surface-700 dark:text-surface-300 cursor-pointer"
          >
            Incluir resultados sem hits
          </label>
        </div>
        <small 
          id="include-no-hits-help"
          class="text-xs text-surface-500 dark:text-surface-400 -mt-2"
        >
          Inclui registros que não tiveram correspondências nos cruzamentos
        </small>
  
        <!-- Botões de Ação -->
        <div class="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end gap-2 pt-4">
          <Button
            label="Limpar"
            icon="pi pi-times"
            severity="secondary"
            @click="handleClearFilters"
            :disabled="!hasActiveFilters"
            aria-label="Limpar todos os filtros"
          />
          <Button
            type="submit"
            label="Buscar"
            icon="pi pi-search"
            :loading="loading"
            aria-label="Buscar resultados com os filtros aplicados"
          />
        </div>
      </form>
      </div>
    </ErrorBoundary>
  </template>
  
  <script setup lang="ts">
  import Button from 'primevue/button'
  import InputText from 'primevue/inputtext'
  import InputMask from 'primevue/inputmask'
  import MultiSelect from 'primevue/multiselect'
  import Checkbox from 'primevue/checkbox'
  import Badge from 'primevue/badge'
  import type { HitTypeValue } from '~/types/api'
  import { useQueryFilters } from '~/composables/useQueryFilters'
  import { useQueriesStore } from '~/stores/queries'
  import { isValidCPFInput, validateReferencePeriod as validatePeriod } from '~/utils/validators'
  import ErrorBoundary from '~/components/ui/ErrorBoundary.vue'
  
  const store = useQueriesStore()
  const {
    filters,
    hasActiveFilters,
    hitTypeOptions,
    applyFilters,
    clearFilters,
    validateCPFInput,
    formatCPFInput,
    validateReferencePeriod,
    activeFiltersList
  } = useQueryFilters()
  
  // State do formulário
  const formData = reactive({
    cpf: filters.value.cpf || '',
    name: filters.value.name || '',
    crossingId: filters.value.crossingId || '',
    referenceStart: filters.value.referenceStart || '',
    referenceEnd: filters.value.referenceEnd || '',
    hitTypes: filters.value.hitTypes || [],
    includeNoHits: filters.value.includeNoHits || false
  })
  
  // Erros de validação
  const cpfError = ref('')
  const periodError = ref('')
  
  // Loading state
  const loading = computed(() => store.loading)
  
  /**
   * Valida e formata CPF conforme digitação
   */
  const handleCPFInput = (event: Event) => {
    const input = event.target as HTMLInputElement
    const value = input.value
    
    // Valida entrada usando validators.ts
    if (!isValidCPFInput(value)) {
      cpfError.value = 'CPF inválido'
      return
    }
    
    cpfError.value = ''
    
    // Formata CPF
    formData.cpf = formatCPFInput(value)
  }
  
  /**
   * Valida formulário antes de buscar
   */
  const validateForm = (): boolean => {
    let isValid = true
    
    // Valida período usando validators.ts
    const periodValidation = validatePeriod(
      formData.referenceStart || undefined,
      formData.referenceEnd || undefined
    )
    
    if (!periodValidation.valid) {
      periodError.value = periodValidation.message || 'Período inválido'
      isValid = false
    } else {
      periodError.value = ''
    }
    
    return isValid
  }
  
  /**
   * Busca resultados com filtros
   */
  const handleSearch = async () => {
    if (!validateForm()) return
    
    await applyFilters({
      cpf: formData.cpf || undefined,
      name: formData.name || undefined,
      crossingId: formData.crossingId || undefined,
      referenceStart: formData.referenceStart || undefined,
      referenceEnd: formData.referenceEnd || undefined,
      hitTypes: formData.hitTypes.length > 0 ? formData.hitTypes : undefined,
      includeNoHits: formData.includeNoHits
    })
  }
  
  /**
   * Limpa filtros
   */
  const handleClearFilters = async () => {
    formData.cpf = ''
    formData.name = ''
    formData.crossingId = ''
    formData.referenceStart = ''
    formData.referenceEnd = ''
    formData.hitTypes = []
    formData.includeNoHits = false
    
    cpfError.value = ''
    periodError.value = ''
    
    await clearFilters()
  }
  
  /**
   * Handler para retry do ErrorBoundary
   * Recarrega dados de consulta se necessário
   */
  const handleRetry = async () => {
    try {
      // Se há filtros ativos, recarrega resultados
      if (store.hasActiveFilters) {
        await store.searchResults()
      }
    } catch (error) {
      // Erro será capturado pelo ErrorBoundary
      console.error('Erro no retry de filtros:', error)
    }
  }

  // Sincroniza formData com filtros da store quando mudam externamente
  watch(filters, (newFilters) => {
    formData.cpf = newFilters.cpf || ''
    formData.name = newFilters.name || ''
    formData.crossingId = newFilters.crossingId || ''
    formData.referenceStart = newFilters.referenceStart || ''
    formData.referenceEnd = newFilters.referenceEnd || ''
    formData.hitTypes = newFilters.hitTypes || []
    formData.includeNoHits = newFilters.includeNoHits || false
  }, { deep: true })
  </script>