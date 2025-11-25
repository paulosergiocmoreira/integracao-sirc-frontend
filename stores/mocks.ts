// stores/mocks.ts
// Dados mockados para desenvolvimento - seguem exatamente os tipos de types/api.ts

import type {
    File,
    Crossing,
    QueryResult,
    FileTypeValue,
    FileStatusValue,
    HitTypeValue
  } from '~/types/api'
  
  /**
   * Gera uma data aleatória dentro de um intervalo
   */
  const randomDate = (start: Date, end: Date): string => {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    return date.toISOString()
  }
  
  /**
   * Gera uma referência MM/YYYY aleatória
   */
  const randomReference = (): string => {
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')
    const year = 2024 + Math.floor(Math.random() * 2) // 2024 ou 2025
    return `${month}/${year}`
  }
  
  /**
   * Gera CPF mockado (formato válido, mas não real)
   */
  const randomCPF = (): string => {
    const n1 = Math.floor(Math.random() * 10)
    const n2 = Math.floor(Math.random() * 10)
    const n3 = Math.floor(Math.random() * 10)
    const n4 = Math.floor(Math.random() * 10)
    const n5 = Math.floor(Math.random() * 10)
    const n6 = Math.floor(Math.random() * 10)
    const n7 = Math.floor(Math.random() * 10)
    const n8 = Math.floor(Math.random() * 10)
    const n9 = Math.floor(Math.random() * 10)
    
    return `${n1}${n2}${n3}.${n4}${n5}${n6}.${n7}${n8}${n9}-XX`
  }
  
  /**
   * Lista de nomes para gerar dados realistas
   */
  const FIRST_NAMES = [
    'João', 'Maria', 'José', 'Ana', 'Carlos', 'Francisca', 'Paulo', 'Antônia',
    'Pedro', 'Luiza', 'Marcos', 'Juliana', 'Ricardo', 'Patricia', 'Fernando'
  ]
  
  const LAST_NAMES = [
    'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves',
    'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho'
  ]
  
  const randomName = (): string => {
    const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]
    const last1 = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]
    const last2 = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]
    return `${first} ${last1} ${last2}`
  }
  
  /**
   * ARQUIVOS MOCKADOS
   * Total: 20 arquivos com diferentes status e tipos
   */
  export const MOCK_FILES: File[] = [
    {
      id: 'file-001',
      name: 'obitos_janeiro_2025.csv',
      type: 'mensal',
      reference: '01/2025',
      hash: 'a1b2c3d4e5f6g7h8i9j0',
      uploadDate: '2025-01-15T10:30:00Z',
      user: 'admin@sirc.gov.br',
      status: 'salvo',
      lastCrossing: '2025-01-16T14:00:00Z'
    },
    {
      id: 'file-002',
      name: 'obitos_dezembro_2024.csv',
      type: 'mensal',
      reference: '12/2024',
      hash: 'b2c3d4e5f6g7h8i9j0k1',
      uploadDate: '2024-12-20T08:15:00Z',
      user: 'admin@sirc.gov.br',
      status: 'salvo',
      lastCrossing: '2024-12-21T16:30:00Z'
    },
    {
      id: 'file-003',
      name: 'obitos_diario_15_01_2025.xlsx',
      type: 'diario',
      reference: '15/01/2025',
      hash: 'c3d4e5f6g7h8i9j0k1l2',
      uploadDate: '2025-01-15T16:00:00Z',
      user: 'operador@sirc.gov.br',
      status: 'em-execucao',
      scheduling: '2025-01-16T08:00:00Z'
    },
    {
      id: 'file-004',
      name: 'obitos_novembro_2024.csv',
      type: 'mensal',
      reference: '11/2024',
      hash: 'd4e5f6g7h8i9j0k1l2m3',
      uploadDate: '2024-11-25T12:00:00Z',
      user: 'admin@sirc.gov.br',
      status: 'salvo',
      lastCrossing: '2024-11-26T10:00:00Z'
    },
    {
      id: 'file-005',
      name: 'obitos_outubro_2024.csv',
      type: 'mensal',
      reference: '10/2024',
      hash: 'e5f6g7h8i9j0k1l2m3n4',
      uploadDate: '2024-10-28T09:30:00Z',
      user: 'admin@sirc.gov.br',
      status: 'erro',
      lastCrossing: '2024-10-29T11:00:00Z'
    },
    {
      id: 'file-006',
      name: 'obitos_setembro_2024.csv',
      type: 'mensal',
      reference: '09/2024',
      hash: 'f6g7h8i9j0k1l2m3n4o5',
      uploadDate: '2024-09-22T14:20:00Z',
      user: 'operador@sirc.gov.br',
      status: 'salvo',
      lastCrossing: '2024-09-23T15:00:00Z'
    },
    {
      id: 'file-007',
      name: 'obitos_diario_14_01_2025.txt',
      type: 'diario',
      reference: '14/01/2025',
      hash: 'g7h8i9j0k1l2m3n4o5p6',
      uploadDate: '2025-01-14T17:00:00Z',
      user: 'operador@sirc.gov.br',
      status: 'agendado',
      scheduling: '2025-01-15T08:00:00Z'
    },
    {
      id: 'file-008',
      name: 'obitos_agosto_2024.csv',
      type: 'mensal',
      reference: '08/2024',
      hash: 'h8i9j0k1l2m3n4o5p6q7',
      uploadDate: '2024-08-25T11:00:00Z',
      user: 'admin@sirc.gov.br',
      status: 'salvo',
      lastCrossing: '2024-08-26T09:30:00Z'
    },
    {
      id: 'file-009',
      name: 'obitos_julho_2024.csv',
      type: 'mensal',
      reference: '07/2024',
      hash: 'i9j0k1l2m3n4o5p6q7r8',
      uploadDate: '2024-07-20T13:45:00Z',
      user: 'admin@sirc.gov.br',
      status: 'salvo',
      lastCrossing: '2024-07-21T10:00:00Z'
    },
    {
      id: 'file-010',
      name: 'obitos_junho_2024.csv',
      type: 'mensal',
      reference: '06/2024',
      hash: 'j0k1l2m3n4o5p6q7r8s9',
      uploadDate: '2024-06-28T15:30:00Z',
      user: 'operador@sirc.gov.br',
      status: 'salvo',
      lastCrossing: '2024-06-29T14:00:00Z'
    },
    {
      id: 'file-011',
      name: 'obitos_maio_2024.xlsx',
      type: 'mensal',
      reference: '05/2024',
      hash: 'k1l2m3n4o5p6q7r8s9t0',
      uploadDate: '2024-05-22T10:15:00Z',
      user: 'admin@sirc.gov.br',
      status: 'salvo',
      lastCrossing: '2024-05-23T11:30:00Z'
    },
    {
      id: 'file-012',
      name: 'obitos_diario_13_01_2025.csv',
      type: 'diario',
      reference: '13/01/2025',
      hash: 'l2m3n4o5p6q7r8s9t0u1',
      uploadDate: '2025-01-13T16:20:00Z',
      user: 'operador@sirc.gov.br',
      status: 'salvo',
      lastCrossing: '2025-01-14T08:30:00Z'
    },
    {
      id: 'file-013',
      name: 'obitos_abril_2024.csv',
      type: 'mensal',
      reference: '04/2024',
      hash: 'm3n4o5p6q7r8s9t0u1v2',
      uploadDate: '2024-04-25T12:00:00Z',
      user: 'admin@sirc.gov.br',
      status: 'agendado',
      scheduling: '2024-04-26T08:00:00Z'
    },
    {
      id: 'file-014',
      name: 'obitos_marco_2024.csv',
      type: 'mensal',
      reference: '03/2024',
      hash: 'n4o5p6q7r8s9t0u1v2w3',
      uploadDate: '2024-03-28T09:45:00Z',
      user: 'admin@sirc.gov.br',
      status: 'salvo',
      lastCrossing: '2024-03-29T10:00:00Z'
    },
    {
      id: 'file-015',
      name: 'obitos_fevereiro_2024.csv',
      type: 'mensal',
      reference: '02/2024',
      hash: 'o5p6q7r8s9t0u1v2w3x4',
      uploadDate: '2024-02-22T14:30:00Z',
      user: 'operador@sirc.gov.br',
      status: 'salvo',
      lastCrossing: '2024-02-23T11:00:00Z'
    },
    {
      id: 'file-016',
      name: 'obitos_janeiro_2024.csv',
      type: 'mensal',
      reference: '01/2024',
      hash: 'p6q7r8s9t0u1v2w3x4y5',
      uploadDate: '2024-01-25T11:20:00Z',
      user: 'admin@sirc.gov.br',
      status: 'salvo',
      lastCrossing: '2024-01-26T09:30:00Z'
    },
    {
      id: 'file-017',
      name: 'obitos_diario_12_01_2025.txt',
      type: 'diario',
      reference: '12/01/2025',
      hash: 'q7r8s9t0u1v2w3x4y5z6',
      uploadDate: '2025-01-12T15:00:00Z',
      user: 'operador@sirc.gov.br',
      status: 'erro',
      lastCrossing: '2025-01-13T08:00:00Z'
    },
    {
      id: 'file-018',
      name: 'obitos_dezembro_2023.csv',
      type: 'mensal',
      reference: '12/2023',
      hash: 'r8s9t0u1v2w3x4y5z6a7',
      uploadDate: '2023-12-28T13:00:00Z',
      user: 'admin@sirc.gov.br',
      status: 'salvo',
      lastCrossing: '2023-12-29T10:30:00Z'
    },
    {
      id: 'file-019',
      name: 'obitos_novembro_2023.xlsx',
      type: 'mensal',
      reference: '11/2023',
      hash: 's9t0u1v2w3x4y5z6a7b8',
      uploadDate: '2023-11-25T10:00:00Z',
      user: 'operador@sirc.gov.br',
      status: 'salvo',
      lastCrossing: '2023-11-26T11:00:00Z'
    },
    {
      id: 'file-020',
      name: 'obitos_diario_11_01_2025.csv',
      type: 'diario',
      reference: '11/01/2025',
      hash: 't0u1v2w3x4y5z6a7b8c9',
      uploadDate: '2025-01-11T16:45:00Z',
      user: 'operador@sirc.gov.br',
      status: 'agendado',
      scheduling: '2025-01-12T08:00:00Z'
    }
  ]
  
  /**
   * CRUZAMENTOS MOCKADOS
   * Total: 15 cruzamentos com estatísticas variadas
   */
  export const MOCK_CROSSINGS: Crossing[] = [
    {
      id: 'cross-001',
      fileId: 'file-001',
      fileName: 'obitos_janeiro_2025.csv',
      type: 'mensal',
      reference: '01/2025',
      crossingDate: '2025-01-16T14:00:00Z',
      totalDeaths: 12543,
      totalHits: 10876,
      hitPercentage: 86.7,
      executionTime: 245,
      status: 'salvo'
    },
    {
      id: 'cross-002',
      fileId: 'file-002',
      fileName: 'obitos_dezembro_2024.csv',
      type: 'mensal',
      reference: '12/2024',
      crossingDate: '2024-12-21T16:30:00Z',
      totalDeaths: 13876,
      totalHits: 12234,
      hitPercentage: 88.2,
      executionTime: 267,
      status: 'salvo'
    },
    {
      id: 'cross-003',
      fileId: 'file-004',
      fileName: 'obitos_novembro_2024.csv',
      type: 'mensal',
      reference: '11/2024',
      crossingDate: '2024-11-26T10:00:00Z',
      totalDeaths: 11234,
      totalHits: 9543,
      hitPercentage: 84.9,
      executionTime: 223,
      status: 'salvo'
    },
    {
      id: 'cross-004',
      fileId: 'file-006',
      fileName: 'obitos_setembro_2024.csv',
      type: 'mensal',
      reference: '09/2024',
      crossingDate: '2024-09-23T15:00:00Z',
      totalDeaths: 10987,
      totalHits: 9876,
      hitPercentage: 89.9,
      executionTime: 215,
      status: 'salvo'
    },
    {
      id: 'cross-005',
      fileId: 'file-008',
      fileName: 'obitos_agosto_2024.csv',
      type: 'mensal',
      reference: '08/2024',
      crossingDate: '2024-08-26T09:30:00Z',
      totalDeaths: 12456,
      totalHits: 11234,
      hitPercentage: 90.2,
      executionTime: 251,
      status: 'salvo'
    },
    {
      id: 'cross-006',
      fileId: 'file-009',
      fileName: 'obitos_julho_2024.csv',
      type: 'mensal',
      reference: '07/2024',
      crossingDate: '2024-07-21T10:00:00Z',
      totalDeaths: 11876,
      totalHits: 10123,
      hitPercentage: 85.2,
      executionTime: 238,
      status: 'salvo'
    },
    {
      id: 'cross-007',
      fileId: 'file-010',
      fileName: 'obitos_junho_2024.csv',
      type: 'mensal',
      reference: '06/2024',
      crossingDate: '2024-06-29T14:00:00Z',
      totalDeaths: 10543,
      totalHits: 8976,
      hitPercentage: 85.1,
      executionTime: 212,
      status: 'salvo'
    },
    {
      id: 'cross-008',
      fileId: 'file-011',
      fileName: 'obitos_maio_2024.xlsx',
      type: 'mensal',
      reference: '05/2024',
      crossingDate: '2024-05-23T11:30:00Z',
      totalDeaths: 11234,
      totalHits: 9654,
      hitPercentage: 85.9,
      executionTime: 227,
      status: 'salvo'
    },
    {
      id: 'cross-009',
      fileId: 'file-012',
      fileName: 'obitos_diario_13_01_2025.csv',
      type: 'diario',
      reference: '13/01/2025',
      crossingDate: '2025-01-14T08:30:00Z',
      totalDeaths: 456,
      totalHits: 398,
      hitPercentage: 87.3,
      executionTime: 45,
      status: 'salvo'
    },
    {
      id: 'cross-010',
      fileId: 'file-014',
      fileName: 'obitos_marco_2024.csv',
      type: 'mensal',
      reference: '03/2024',
      crossingDate: '2024-03-29T10:00:00Z',
      totalDeaths: 12678,
      totalHits: 11123,
      hitPercentage: 87.7,
      executionTime: 255,
      status: 'salvo'
    },
    {
      id: 'cross-011',
      fileId: 'file-015',
      fileName: 'obitos_fevereiro_2024.csv',
      type: 'mensal',
      reference: '02/2024',
      crossingDate: '2024-02-23T11:00:00Z',
      totalDeaths: 11543,
      totalHits: 9876,
      hitPercentage: 85.6,
      executionTime: 231,
      status: 'salvo'
    },
    {
      id: 'cross-012',
      fileId: 'file-016',
      fileName: 'obitos_janeiro_2024.csv',
      type: 'mensal',
      reference: '01/2024',
      crossingDate: '2024-01-26T09:30:00Z',
      totalDeaths: 13234,
      totalHits: 11654,
      hitPercentage: 88.1,
      executionTime: 268,
      status: 'salvo'
    },
    {
      id: 'cross-013',
      fileId: 'file-018',
      fileName: 'obitos_dezembro_2023.csv',
      type: 'mensal',
      reference: '12/2023',
      crossingDate: '2023-12-29T10:30:00Z',
      totalDeaths: 12987,
      totalHits: 11234,
      hitPercentage: 86.5,
      executionTime: 262,
      status: 'salvo'
    },
    {
      id: 'cross-014',
      fileId: 'file-019',
      fileName: 'obitos_novembro_2023.xlsx',
      type: 'mensal',
      reference: '11/2023',
      crossingDate: '2023-11-26T11:00:00Z',
      totalDeaths: 11876,
      totalHits: 10234,
      hitPercentage: 86.2,
      executionTime: 239,
      status: 'salvo'
    },
    {
      id: 'cross-015',
      fileId: 'file-005',
      fileName: 'obitos_outubro_2024.csv',
      type: 'mensal',
      reference: '10/2024',
      crossingDate: '2024-10-29T11:00:00Z',
      totalDeaths: 10876,
      totalHits: 7234,
      hitPercentage: 66.5,
      executionTime: 218,
      status: 'erro'
    }
  ]
  
  /**
   * RESULTADOS DE CONSULTAS MOCKADOS
   * Total: 30 resultados com diferentes tipos de hit
   */
  export const MOCK_QUERY_RESULTS: QueryResult[] = Array.from({ length: 30 }, (_, i) => {
    const hitTypes: HitTypeValue[] = []
    const random = Math.random()
    
    // Determina tipos de hit baseado em probabilidade
    if (random > 0.8) {
      hitTypes.push('hit-perfeito')
    } else if (random > 0.6) {
      hitTypes.push('cpf-completo')
    } else if (random > 0.4) {
      hitTypes.push('cpf-incompleto', 'data-nascimento')
    } else if (random > 0.2) {
      hitTypes.push('data-nascimento')
    } else {
      hitTypes.push('hit-com-falecido')
    }
    
    const matchScore = hitTypes.includes('hit-perfeito') 
      ? 95 + Math.floor(Math.random() * 5)
      : hitTypes.includes('cpf-completo')
      ? 80 + Math.floor(Math.random() * 15)
      : hitTypes.includes('cpf-incompleto')
      ? 60 + Math.floor(Math.random() * 20)
      : 40 + Math.floor(Math.random() * 20)
    
    const birthYear = 1940 + Math.floor(Math.random() * 60)
    const birthMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')
    const birthDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')
    
    const hasDeathDate = Math.random() > 0.3
    const deathYear = hasDeathDate ? 2020 + Math.floor(Math.random() * 5) : null
    const deathMonth = hasDeathDate ? String(Math.floor(Math.random() * 12) + 1).padStart(2, '0') : null
    const deathDay = hasDeathDate ? String(Math.floor(Math.random() * 28) + 1).padStart(2, '0') : null
    
    // Seleciona crossing aleatório com validação
    const randomCrossing = MOCK_CROSSINGS[Math.floor(Math.random() * MOCK_CROSSINGS.length)]
    const crossingId = randomCrossing ? randomCrossing.id : 'cross-001' // fallback
    
    return {
      id: `result-${String(i + 1).padStart(3, '0')}`,
      crossingId,
      fileReference: randomReference(),
      cpf: randomCPF(),
      name: randomName(),
      motherName: randomName(),
      birthDate: `${birthDay}/${birthMonth}/${birthYear}`,
      deathDate: hasDeathDate ? `${deathDay}/${deathMonth}/${deathYear}` : undefined,
      hitTypes,
      matchScore
    }
  })
  
  /**
   * Simula delay de rede (500-1500ms)
   */
  export const simulateDelay = (min = 500, max = 1500): Promise<void> => {
    const delay = min + Math.random() * (max - min)
    return new Promise(resolve => setTimeout(resolve, delay))
  }
  
  /**
   * Simula erro aleatório (10% de chance)
   */
  export const simulateError = (errorRate = 0.1): void => {
    if (Math.random() < errorRate) {
      throw new Error('Erro simulado de rede')
    }
  }