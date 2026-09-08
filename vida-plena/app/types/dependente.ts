export type TipoDependencia = 'CRIANCA' | 'IDOSO' | 'NECESSIDADE_ESPECIAL'

export type TipoSanguineo =
  | 'A_POSITIVO'
  | 'A_NEGATIVO'
  | 'B_POSITIVO'
  | 'B_NEGATIVO'
  | 'AB_POSITIVO'
  | 'AB_NEGATIVO'
  | 'O_POSITIVO'
  | 'O_NEGATIVO'

export interface CadastroDependenteRequestDTO {
  responsavelId?: string
  nome: string
  cpf: string
  dataNascimento: string // AAAA-MM-DD
  tipo: TipoDependencia
  email?: string
  telefone?: string
  tipoSanguineo?: TipoSanguineo
  alergias?: string[]
  medicamentosContinuos?: string[]
  historicoFamiliar?: string
  dataInicio?: string // AAAA-MM-DD
  dataFim?: string // AAAA-MM-DD
}

export interface DependenteResponseDTO {
  vinculoId: string
  dependenteUsuarioId: string
  pacienteId: string | null
  responsavelId: string
  responsavelNome: string
  nome: string
  cpf: string
  email: string
  telefone: string
  dataNascimento: string
  idade: number
  tipo: TipoDependencia
  dataInicio: string
  dataFim: string | null
  tipoSanguineo: TipoSanguineo | null
  alergias: string[]
  medicamentosContinuos: string[]
  historicoFamiliar: string | null
}

export const TIPO_DEPENDENCIA_LABELS: Record<TipoDependencia, string> = {
  CRIANCA: 'Criança',
  IDOSO: 'Idoso',
  NECESSIDADE_ESPECIAL: 'PcD / Necessidade Especial',
}

export const TIPO_SANGUINEO_MAP: Record<string, TipoSanguineo> = {
  'A+': 'A_POSITIVO',
  'A-': 'A_NEGATIVO',
  'B+': 'B_POSITIVO',
  'B-': 'B_NEGATIVO',
  'AB+': 'AB_POSITIVO',
  'AB-': 'AB_NEGATIVO',
  'O+': 'O_POSITIVO',
  'O-': 'O_NEGATIVO',
}

export const TIPO_SANGUINEO_REVERSE_MAP: Record<TipoSanguineo, string> = {
  A_POSITIVO: 'A+',
  A_NEGATIVO: 'A-',
  B_POSITIVO: 'B+',
  B_NEGATIVO: 'B-',
  AB_POSITIVO: 'AB+',
  AB_NEGATIVO: 'AB-',
  O_POSITIVO: 'O+',
  O_NEGATIVO: 'O-',
}
