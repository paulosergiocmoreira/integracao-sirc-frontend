// Based on openapi.yaml specification

// Enums
export const FileType = {
    Mensal: 'mensal',
    Diario: 'diario'
  } as const
  
  export type FileTypeValue = typeof FileType[keyof typeof FileType]
  
  export const FileStatus = {
    Salvo: 'salvo',
    EmExecucao: 'em-execucao',
    Erro: 'erro',
    Agendado: 'agendado'
  } as const
  
  export type FileStatusValue = typeof FileStatus[keyof typeof FileStatus]
  
  export const HitType = {
    Perfeito: 'hit-perfeito',
    CPFCompleto: 'cpf-completo',
    CPFIncompleto: 'cpf-incompleto',
    DataNascimento: 'data-nascimento',
    ComFalecido: 'hit-com-falecido'
  } as const
  
  export type HitTypeValue = typeof HitType[keyof typeof HitType]
  
  // Base interfaces
  export interface Pagination {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  
  export interface ApiResponse<T> {
    data: T
    pagination?: Pagination
    summary?: Record<string, number>
  }
  
  export interface ApiError {
    code: string
    message: string
    details?: Array<{
      field?: string
      message?: string
    }>
  }
  
  // File interfaces
  export interface File {
    id: string
    name: string
    type: FileTypeValue
    reference: string // Format: MM/YYYY or DD/MM/YYYY
    hash: string
    uploadDate: string // ISO date
    user: string
    status: FileStatusValue
    lastCrossing?: string // ISO date
    scheduling?: string // ISO date
  }
  
  export interface FileUpload {
    file: File
    type: FileTypeValue
    reference: string
  }
  
  // Crossing interfaces
  export interface Crossing {
    id: string
    fileId: string
    fileName: string
    type: FileTypeValue
    reference: string
    crossingDate: string // ISO date
    totalDeaths: number
    totalHits: number
    hitPercentage: number
    executionTime: number // seconds
    status: FileStatusValue
  }
  
  export interface CrossingSummary {
    totalCrossings: number
    totalHits: number
    averageHitPercentage: number
    lastCrossing?: string // ISO date
  }
  
  // Query/Result interfaces
  export interface QueryResult {
    id: string
    crossingId: string
    fileReference: string
    cpf: string
    name: string
    motherName: string
    birthDate: string // DD/MM/YYYY
    deathDate?: string // DD/MM/YYYY
    hitTypes: HitTypeValue[]
    matchScore: number // 0-100
  }
  
  export interface ComparisonResult {
    resultId: string
    sircData: {
      cpf: string
      name: string
      motherName: string
      birthDate: string
      deathDate?: string
    }
    personalSystemData: {
      cpf: string
      name: string
      motherName: string
      birthDate: string
      status: string
    }
    differences: Array<{
      field: string
      sircValue: string
      personalSystemValue: string
    }>
  }
  
  // Filter interfaces
  export interface FileFilters {
    name?: string
    type?: FileTypeValue
    referenceStart?: string
    referenceEnd?: string
    status?: FileStatusValue[]
    page?: number
    limit?: number
  }
  
  export interface CrossingFilters {
    fileId?: string
    referenceStart?: string
    referenceEnd?: string
    hitPercentageMin?: number
    hitPercentageMax?: number
    dateStart?: string
    dateEnd?: string
    page?: number
    limit?: number
  }
  
  export interface QueryFilters {
    cpf?: string
    name?: string
    crossingId?: string
    referenceStart?: string
    referenceEnd?: string
    hitTypes?: HitTypeValue[]
    includeNoHits?: boolean
    page?: number
    limit?: number
  }