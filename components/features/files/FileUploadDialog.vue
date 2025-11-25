<template>
    <Dialog
      :visible="visible"
      modal
      :closable="!uploading"
      :close-on-escape="!uploading"
      header="Novo Arquivo"
      :style="{ width: '600px' }"
      @update:visible="handleClose"
    >
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-6">
        <!-- Upload de Arquivo -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-surface-700 dark:text-surface-300">
            Arquivo *
          </label>
          
          <FileUpload
            ref="fileUploadRef"
            mode="basic"
            :custom-upload="true"
            :auto="false"
            :max-file-size="10485760"
            accept=".csv,.txt,.xls,.xlsx"
            choose-label="Selecionar Arquivo"
            :disabled="uploading"
            @select="handleFileSelect"
            :pt="{
              root: { class: 'w-full' },
              chooseButton: { 
                class: selectedFile ? 'p-button-success' : 'p-button-outlined' 
              }
            }"
          />
          
          <small class="text-surface-500 dark:text-surface-400">
            Formatos aceitos: CSV, TXT, XLS, XLSX (máx. 10MB)
          </small>
  
          <!-- Preview do arquivo selecionado -->
          <div 
            v-if="selectedFile"
            class="flex items-center justify-between p-3 mt-2 bg-surface-50 dark:bg-surface-800 rounded border border-surface-200 dark:border-surface-700"
          >
            <div class="flex items-center gap-3">
              <i class="pi pi-file text-2xl text-primary" />
              <div>
                <p class="font-medium text-surface-900 dark:text-surface-0">
                  {{ selectedFile.name }}
                </p>
                <p class="text-sm text-surface-500 dark:text-surface-400">
                  {{ formatFileSize(selectedFile.size) }}
                </p>
              </div>
            </div>
            <Button
              icon="pi pi-times"
              text
              rounded
              severity="danger"
              @click="clearFile"
              :disabled="uploading"
              aria-label="Remover arquivo"
            />
          </div>
  
          <!-- Erro de validação -->
          <small 
            v-if="fileError" 
            class="text-red-500 dark:text-red-400"
          >
            {{ fileError }}
          </small>
        </div>
  
        <!-- Tipo de Arquivo -->
        <div class="flex flex-col gap-2">
          <label for="upload-type" class="text-sm font-medium text-surface-700 dark:text-surface-300">
            Tipo *
          </label>
          <Dropdown
            id="upload-type"
            v-model="formData.type"
            :options="typeOptions"
            option-label="label"
            option-value="value"
            placeholder="Selecione o tipo"
            :disabled="uploading"
            :class="{ 'p-invalid': errors.type }"
            :pt="{
              root: { class: 'w-full' }
            }"
          />
          <small 
            v-if="errors.type" 
            class="text-red-500 dark:text-red-400"
          >
            {{ errors.type }}
          </small>
        </div>
  
        <!-- Referência (Período) -->
        <div class="flex flex-col gap-2">
          <label for="upload-reference" class="text-sm font-medium text-surface-700 dark:text-surface-300">
            Referência (Período) *
          </label>
          <Calendar
            id="upload-reference"
            v-model="formData.referenceDate"
            view="month"
            date-format="mm/yy"
            placeholder="MM/AAAA"
            show-icon
            :disabled="uploading"
            :class="{ 'p-invalid': errors.reference }"
            :pt="{
              root: { class: 'w-full' }
            }"
          />
          <small class="text-surface-500 dark:text-surface-400">
            {{ formData.type === 'mensal' ? 'Mês/Ano de referência' : 'Data de referência' }}
          </small>
          <small 
            v-if="errors.reference" 
            class="text-red-500 dark:text-red-400"
          >
            {{ errors.reference }}
          </small>
        </div>
  
        <!-- Progress Bar (durante upload) -->
        <div v-if="uploading" class="flex flex-col gap-2">
          <div class="flex items-center justify-between text-sm">
            <span class="text-surface-700 dark:text-surface-300">Enviando arquivo...</span>
            <span class="font-medium text-primary">{{ uploadProgress }}%</span>
          </div>
          <ProgressBar :value="uploadProgress" :show-value="false" />
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
            :disabled="uploading"
          />
          <Button
            label="Enviar"
            icon="pi pi-upload"
            :loading="uploading"
            @click="handleSubmit"
            :disabled="!isFormValid"
          />
        </div>
      </template>
    </Dialog>
  </template>
  
<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import FileUpload from 'primevue/fileupload'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import ProgressBar from 'primevue/progressbar'
import type { FileUploadSelectEvent } from 'primevue/fileupload'
import { validateFileUpload, isValidReference } from '~/utils/validators'
import { useFilesStore } from '~/stores/files'
import { useToastMessages } from '~/composables/useToastMessages'
import { useFileFormatting } from '~/composables/useFileFormatting'

interface Props {
  visible: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  success: []
}>()

const store = useFilesStore()
const toast = useToastMessages()
const { formatFileSize } = useFileFormatting()
  
  // Refs
  const fileUploadRef = ref()
  const selectedFile = ref<globalThis.File | null>(null)
  const uploading = ref(false)
  const uploadProgress = ref(0)
  
  // Form data
  const formData = reactive({
    type: null as 'mensal' | 'diario' | null,
    referenceDate: null as Date | null
  })
  
  // Validation errors
  const errors = reactive({
    type: '',
    reference: ''
  })
  
  const fileError = ref('')
  
  // Options
  const typeOptions = [
    { label: 'Mensal', value: 'mensal' },
    { label: 'Diário', value: 'diario' }
  ]
  
  /**
   * Verifica se formulário é válido
   */
  const isFormValid = computed(() => {
    return !!(
      selectedFile.value &&
      formData.type &&
      formData.referenceDate &&
      !fileError.value
    )
  })
  
  /**
   * Handler para seleção de arquivo
   */
  const handleFileSelect = (event: FileUploadSelectEvent) => {
    const file = event.files[0]
    
    if (!file) return
    
    // Valida arquivo
    const validation = validateFileUpload(file)
    
    if (!validation.valid) {
      fileError.value = validation.message || 'Arquivo inválido'
      selectedFile.value = null
      return
    }
    
    fileError.value = ''
    selectedFile.value = file
  }
  
  /**
   * Limpa arquivo selecionado
   */
  const clearFile = () => {
    selectedFile.value = null
    fileError.value = ''
    if (fileUploadRef.value) {
      fileUploadRef.value.clear()
    }
  }
  
  /**
   * Valida formulário
   */
  const validateForm = (): boolean => {
    let isValid = true
    
    // Reset errors
    errors.type = ''
    errors.reference = ''
    
    // Valida tipo
    if (!formData.type) {
      errors.type = 'Selecione o tipo do arquivo'
      isValid = false
    }
    
    // Valida referência
    if (!formData.referenceDate) {
      errors.reference = 'Selecione a referência'
      isValid = false
    } else {
      const month = String(formData.referenceDate.getMonth() + 1).padStart(2, '0')
      const year = formData.referenceDate.getFullYear()
      const reference = `${month}/${year}`
      
      if (!isValidReference(reference)) {
        errors.reference = 'Referência inválida'
        isValid = false
      }
    }
    
    return isValid
  }
  
  /**
   * Simula progresso de upload
   */
  const simulateUploadProgress = () => {
    uploadProgress.value = 0
    
    const interval = setInterval(() => {
      uploadProgress.value += 10
      
      if (uploadProgress.value >= 100) {
        clearInterval(interval)
      }
    }, 200)
  }
  
  /**
   * Handler para submit do formulário
   */
  const handleSubmit = async () => {
    if (!validateForm() || !selectedFile.value) {
      return
    }
    
    uploading.value = true
    simulateUploadProgress()
    
    try {
      const month = String(formData.referenceDate!.getMonth() + 1).padStart(2, '0')
      const year = formData.referenceDate!.getFullYear()
      const reference = `${month}/${year}`
      
      // Create FormData for file upload
      const formDataToSend = new FormData()
      formDataToSend.append('file', selectedFile.value)
      formDataToSend.append('type', formData.type!)
      formDataToSend.append('reference', reference)
      
      await store.uploadFile(
        selectedFile.value,
        formData.type!,
        reference
      )
      
      emit('success')
      handleClose()
      resetForm()
      
    } catch (error) {
      console.error('Erro ao enviar arquivo:', error)
      toast.error('Erro', 'Erro ao enviar arquivo')
    } finally {
      uploading.value = false
      uploadProgress.value = 0
    }
  }
  
  /**
   * Reseta formulário
   */
  const resetForm = () => {
    selectedFile.value = null
    formData.type = null
    formData.referenceDate = null
    errors.type = ''
    errors.reference = ''
    fileError.value = ''
    uploadProgress.value = 0
    
    if (fileUploadRef.value) {
      fileUploadRef.value.clear()
    }
  }
  
  /**
   * Handler para fechar modal
   */
  const handleClose = () => {
    if (uploading.value) return
    
    emit('update:visible', false)
    
    // Reset após animação de fechamento
    setTimeout(resetForm, 300)
  }
  </script>