// utils/validators.ts
// Funções de validação de dados

/**
 * Valida CPF (algoritmo oficial)
 * 
 * @param cpf - CPF com ou sem formatação
 * @returns true se válido, false caso contrário
 * 
 * @example
 * isValidCPF('123.456.789-00') // false (CPF inválido)
 * isValidCPF('000.000.000-00') // false (CPF conhecido como inválido)
 */
export const isValidCPF = (cpf: string): boolean => {
    // Remove formatação
    const numbers = cpf.replace(/\D/g, '')
    
    // Verifica se tem 11 dígitos
    if (numbers.length !== 11) return false
    
    // CPFs conhecidos como inválidos
    const invalidCPFs = [
      '00000000000',
      '11111111111',
      '22222222222',
      '33333333333',
      '44444444444',
      '55555555555',
      '66666666666',
      '77777777777',
      '88888888888',
      '99999999999'
    ]
    
    if (invalidCPFs.includes(numbers)) return false
    
    // Validação dos dígitos verificadores
    let sum = 0
    let remainder: number
    
    // Primeiro dígito verificador
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(numbers.substring(i - 1, i)) * (11 - i)
    }
    
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(numbers.substring(9, 10))) return false
    
    sum = 0
    
    // Segundo dígito verificador
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(numbers.substring(i - 1, i)) * (12 - i)
    }
    
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(numbers.substring(10, 11))) return false
    
    return true
  }
  
  /**
   * Valida formato de data DD/MM/YYYY
   * 
   * @param date - Data no formato DD/MM/YYYY
   * @returns true se válido, false caso contrário
   * 
   * @example
   * isValidDate('15/01/2025') // true
   * isValidDate('32/13/2025') // false
   */
  export const isValidDate = (date: string): boolean => {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/
    const match = date.match(regex)
    
    if (!match || match.length < 4) return false
    
    // Type guard: garantimos que match[1], match[2] e match[3] existem
    const dayStr = match[1]
    const monthStr = match[2]
    const yearStr = match[3]
    
    if (!dayStr || !monthStr || !yearStr) return false
    
    const day = parseInt(dayStr, 10)
    const month = parseInt(monthStr, 10)
    const year = parseInt(yearStr, 10)
    
    // Verifica limites básicos
    if (month < 1 || month > 12) return false
    if (day < 1 || day > 31) return false
    if (year < 1900 || year > 2100) return false
    
    // Verifica dias por mês
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    
    // Ano bissexto
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      daysInMonth[1] = 29
    }
    
    const maxDaysInMonth = daysInMonth[month - 1]
    if (maxDaysInMonth === undefined || day > maxDaysInMonth) return false
    
    return true
  }
  
  /**
   * Valida formato de referência MM/YYYY
   * 
   * @param reference - Referência no formato MM/YYYY
   * @returns true se válido, false caso contrário
   * 
   * @example
   * isValidReference('01/2025') // true
   * isValidReference('13/2025') // false
   */
  export const isValidReference = (reference: string): boolean => {
    const regex = /^(\d{2})\/(\d{4})$/
    const match = reference.match(regex)
    
    if (!match) return false

    const monthStr = match[1]
    const yearStr = match[2]

    if (!monthStr || !yearStr) return false

    const month = parseInt(monthStr, 10)
    const year = parseInt(yearStr, 10)  
    
    if (month < 1 || month > 12) return false
    if (year < 2000 || year > 2100) return false
    
    return true
  }
  
  /**
   * Valida tamanho de arquivo (em bytes)
   * 
   * @param sizeInBytes - Tamanho do arquivo em bytes
   * @param maxSizeInMB - Tamanho máximo permitido em MB
   * @returns true se válido, false caso contrário
   * 
   * @example
   * isValidFileSize(5242880, 10) // true (5MB é menor que 10MB)
   * isValidFileSize(11534336, 10) // false (11MB é maior que 10MB)
   */
  export const isValidFileSize = (sizeInBytes: number, maxSizeInMB = 10): boolean => {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024
    return sizeInBytes <= maxSizeInBytes
  }
  
  /**
   * Valida extensão de arquivo
   * 
   * @param filename - Nome do arquivo
   * @param allowedExtensions - Array de extensões permitidas
   * @returns true se válido, false caso contrário
   * 
   * @example
   * isValidFileExtension('dados.csv', ['csv', 'txt']) // true
   * isValidFileExtension('dados.pdf', ['csv', 'txt']) // false
   */
  export const isValidFileExtension = (
    filename: string,
    allowedExtensions: string[] = ['csv', 'txt', 'xls', 'xlsx']
  ): boolean => {
    const extension = filename.split('.').pop()?.toLowerCase()
    if (!extension) return false
    return allowedExtensions.includes(extension)
  }
  
  /**
   * Valida se string não está vazia
   * 
   * @param value - String a ser validada
   * @returns true se não vazio, false caso contrário
   */
  export const isNotEmpty = (value: string): boolean => {
    return value.trim().length > 0
  }
  
  /**
   * Valida email (básico)
   * 
   * @param email - Email a ser validado
   * @returns true se válido, false caso contrário
   * 
   * @example
   * isValidEmail('user@example.com') // true
   * isValidEmail('invalid-email') // false
   */
  export const isValidEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }
  
  /**
   * Valida range de porcentagem (0-100)
   * 
   * @param value - Valor a ser validado
   * @returns true se válido, false caso contrário
   */
  export const isValidPercentage = (value: number): boolean => {
    return value >= 0 && value <= 100
  }
  
  /**
   * Valida se data é futura
   * 
   * @param date - Data a ser validada (ISO ou Date)
   * @returns true se futura, false caso contrário
   */
  export const isFutureDate = (date: string | Date): boolean => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.getTime() > Date.now()
  }
  
  /**
   * Valida se data está dentro de um range
   * 
   * @param date - Data a ser validada
   * @param startDate - Data inicial do range
   * @param endDate - Data final do range
   * @returns true se dentro do range, false caso contrário
   */
  export const isDateInRange = (
    date: string | Date,
    startDate: string | Date,
    endDate: string | Date
  ): boolean => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const startObj = typeof startDate === 'string' ? new Date(startDate) : startDate
    const endObj = typeof endDate === 'string' ? new Date(endDate) : endDate
    
    return dateObj >= startObj && dateObj <= endObj
  }
  
  /**
   * Resultado de validação com mensagem de erro
   */
  export interface ValidationResult {
    valid: boolean
    message?: string
  }
  
  /**
   * Valida upload de arquivo completo
   * 
   * @param file - Arquivo a ser validado
   * @returns Objeto com resultado e mensagem de erro
   */
  export const validateFileUpload = (file: File): ValidationResult => {
    // Valida tamanho
    if (!isValidFileSize(file.size, 10)) {
      return {
        valid: false,
        message: 'Arquivo muito grande. Tamanho máximo: 10MB'
      }
    }
    
    // Valida extensão
    if (!isValidFileExtension(file.name)) {
      return {
        valid: false,
        message: 'Formato não suportado. Use: CSV, TXT, XLS ou XLSX'
      }
    }
    
    return { valid: true }
  }
  
  /**
   * Valida dados de agendamento
   * 
   * @param scheduledDate - Data agendada
   * @param frequency - Frequência do agendamento
   * @returns Objeto com resultado e mensagem de erro
   */
  export const validateScheduling = (
    scheduledDate: Date,
    frequency: string
  ): ValidationResult => {
    // Valida se data é futura
    if (!isFutureDate(scheduledDate)) {
      return {
        valid: false,
        message: 'A data do agendamento deve ser futura'
      }
    }
    
    // Valida frequência
    const validFrequencies = ['unico', 'diario', 'mensal']
    if (!validFrequencies.includes(frequency)) {
      return {
        valid: false,
        message: 'Frequência inválida'
      }
    }
    
    return { valid: true }
  }

  /**
   * Valida entrada de CPF durante digitação
   * 
   * @param cpf - CPF sendo digitado
   * @returns true se entrada válida (permite parcial), false se inválida
   */
  export const isValidCPFInput = (cpf: string): boolean => {
    const numbers = cpf.replace(/\D/g, '')
    
    // Permite vazio ou até 11 dígitos
    if (numbers.length === 0) return true
    if (numbers.length > 11) return false
    
    return true
  }

  /**
   * Valida período de referência (MM/YYYY)
   * 
   * @param start - Período inicial
   * @param end - Período final
   * @returns Objeto com resultado e mensagem de erro
   */
  export const validateReferencePeriod = (
    start?: string,
    end?: string
  ): ValidationResult => {
    if (!start && !end) {
      return { valid: true }
    }
    
    if (start && !isValidReference(start)) {
      return {
        valid: false,
        message: 'Período inicial inválido. Use o formato MM/YYYY'
      }
    }
    
    if (end && !isValidReference(end)) {
      return {
        valid: false,
        message: 'Período final inválido. Use o formato MM/YYYY'
      }
    }
    
    if (start && end && start > end) {
      return {
        valid: false,
        message: 'A data inicial deve ser anterior à data final'
      }
    }
    
    return { valid: true }
  }