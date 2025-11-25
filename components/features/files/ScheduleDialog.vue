<template>
    <Dialog
      :visible="visible"
      modal
      :closable="!scheduling"
      :close-on-escape="!scheduling"
      header="Agendar Cruzamento"
      :style="{ width: '500px' }"
      @update:visible="handleClose"
    >
      <!-- Informações do Arquivo -->
      <div 
        v-if="file"
        class="mb-6 p-4 bg-surface-50 dark:bg-surface-800 rounded border border-surface-200 dark:border-surface-700"
      >
        <div class="flex items-center gap-3">
          <i class="pi pi-file text-2xl text-primary" />
          <div>
            <p class="font-semibold text-surface-900 dark:text-surface-0">
              {{ file.name }}
            </p>
            <div class="flex items-center gap-3 mt-1">
              <Badge :value="formatFileType(file.type)" severity="info" />
              <span class="text-sm text-surface-500 dark:text-surface-400">
                Ref: {{ file.reference }}
              </span>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Formulário -->
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-6">
        <!-- Data e Hora do Agendamento -->
        <div class="flex flex-col gap-2">
          <label for="schedule-date" class="text-sm font-medium text-surface-700 dark:text-surface-300">
            Data e Hora *
          </label>
          <Calendar
            id="schedule-date"
            v-model="formData.scheduledDate"
            show-time
            hour-format="24"
            show-icon
            :min-date="minDate"
            placeholder="Selecione data e hora"
            date-format="dd/mm/yy"
            :disabled="scheduling"
            :class="{ 'p-invalid': errors.scheduledDate }"
            :pt="{
              root: { class: 'w-full' }
            }"
          />
          <small class="text-surface-500 dark:text-surface-400">
            O cruzamento deve ser agendado para uma data futura
          </small>
          <small 
            v-if="errors.scheduledDate" 
            class="text-red-500 dark:text-red-400"
          >
            {{ errors.scheduledDate }}
          </small>
        </div>
  
        <!-- Frequência -->
        <div class="flex flex-col gap-2">
          <label for="schedule-frequency" class="text-sm font-medium text-surface-700 dark:text-surface-300">
            Frequência *
          </label>
          <Dropdown
            id="schedule-frequency"
            v-model="formData.frequency"
            :options="frequencyOptions"
            option-label="label"
            option-value="value"
            placeholder="Selecione a frequência"
            :disabled="scheduling"
            :class="{ 'p-invalid': errors.frequency }"
            :pt="{
              root: { class: 'w-full' }
            }"
          />
          <small class="text-surface-500 dark:text-surface-400">
            {{ getFrequencyDescription(formData.frequency) }}
          </small>
          <small 
            v-if="errors.frequency" 
            class="text-red-500 dark:text-red-400"
          >
            {{ errors.frequency }}
          </small>
        </div>
  
        <!-- Resumo do Agendamento -->
        <div 
          v-if="isFormValid"
          class="p-4 bg-primary-50 dark:bg-primary-900/20 rounded border border-primary-200 dark:border-primary-800"
        >
          <div class="flex items-start gap-3">
            <i class="pi pi-info-circle text-primary mt-0.5" />
            <div class="flex-1">
              <p class="font-medium text-surface-900 dark:text-surface-0 mb-2">
                Resumo do Agendamento
              </p>
              <ul class="text-sm text-surface-700 dark:text-surface-300 space-y-1">
                <li>
                  <strong>Arquivo:</strong> {{ file?.name }}
                </li>
                <li>
                  <strong>Data/Hora:</strong> {{ formatDate(formData.scheduledDate?.toISOString() || '') }}
                </li>
                <li>
                  <strong>Frequência:</strong> {{ getFrequencyLabel(formData.frequency) }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </form>
  
      <!-- Footer com Botões -->
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button
            label="Cancelar"
            severity="secondary"
            outlined
            @click="handleClose"
            :disabled="scheduling"
          />
          <Button
            label="Agendar"
            icon="pi pi-calendar-plus"
            :loading="scheduling"
            @click="handleSubmit"
            :disabled="!isFormValid"
          />
        </div>
      </template>
    </Dialog>
  </template>
  
<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'
import Dropdown from 'primevue/dropdown'
import Badge from 'primevue/badge'
import type { File } from '~/types/api'
import { validateScheduling } from '~/utils/validators'
import { formatDate, formatFileType } from '~/utils/formatters'
import { useFilesStore } from '~/stores/files'
import { useToastMessages } from '~/composables/useToastMessages'

interface Props {
  visible: boolean
  file: File | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  success: []
}>()

const store = useFilesStore()
const toast = useToastMessages()
  
  // State
  const scheduling = ref(false)
  const minDate = ref(new Date())
  
  // Form data
  const formData = reactive({
    scheduledDate: null as Date | null,
    frequency: null as string | null
  })
  
  // Validation errors
  const errors = reactive({
    scheduledDate: '',
    frequency: ''
  })
  
  // Options
  const frequencyOptions = [
    { label: 'Único', value: 'unico' },
    { label: 'Diário', value: 'diario' },
    { label: 'Mensal', value: 'mensal' }
  ]
  
  /**
   * Verifica se formulário é válido
   */
  const isFormValid = computed(() => {
    return !!(
      formData.scheduledDate &&
      formData.frequency &&
      !errors.scheduledDate &&
      !errors.frequency
    )
  })
  
  /**
   * Retorna descrição da frequência
   */
  const getFrequencyDescription = (frequency: string | null): string => {
    switch (frequency) {
      case 'unico':
        return 'Executar apenas uma vez na data selecionada'
      case 'diario':
        return 'Executar diariamente a partir da data selecionada'
      case 'mensal':
        return 'Executar mensalmente a partir da data selecionada'
      default:
        return 'Selecione uma frequência'
    }
  }
  
  /**
   * Retorna label da frequência
   */
  const getFrequencyLabel = (frequency: string | null): string => {
    const option = frequencyOptions.find(opt => opt.value === frequency)
    return option?.label || ''
  }
  
  /**
   * Valida formulário
   */
  const validateForm = (): boolean => {
    let isValid = true
    
    // Reset errors
    errors.scheduledDate = ''
    errors.frequency = ''
    
    // Valida data
    if (!formData.scheduledDate) {
      errors.scheduledDate = 'Selecione a data e hora'
      isValid = false
    }
    
    // Valida frequência
    if (!formData.frequency) {
      errors.frequency = 'Selecione a frequência'
      isValid = false
    }
    
    // Valida com helper
    if (formData.scheduledDate && formData.frequency) {
      const validation = validateScheduling(formData.scheduledDate, formData.frequency)
      
      if (!validation.valid) {
        errors.scheduledDate = validation.message || 'Data inválida'
        isValid = false
      }
    }
    
    return isValid
  }
  
  /**
   * Handler para submit do formulário
   */
  const handleSubmit = async () => {
    if (!validateForm() || !props.file) {
      return
    }
    
    scheduling.value = true
    
    try {
      await store.scheduleFile(
        props.file.id,
        formData.scheduledDate!,
        formData.frequency!
      )
      
      emit('success')
      handleClose()
      resetForm()
      
    } catch (error) {
      console.error('Erro ao agendar cruzamento:', error)
      toast.error('Erro', 'Erro ao agendar cruzamento')
    } finally {
      scheduling.value = false
    }
  }
  
  /**
   * Reseta formulário
   */
  const resetForm = () => {
    formData.scheduledDate = null
    formData.frequency = null
    errors.scheduledDate = ''
    errors.frequency = ''
  }
  
  /**
   * Handler para fechar modal
   */
  const handleClose = () => {
    if (scheduling.value) return
    
    emit('update:visible', false)
    
    // Reset após animação de fechamento
    setTimeout(resetForm, 300)
  }
  
  /**
   * Watch para resetar quando modal abre
   */
  watch(() => props.visible, (newVal) => {
    if (newVal) {
      resetForm()
      // Define data mínima como agora
      minDate.value = new Date()
    }
  })
  </script>