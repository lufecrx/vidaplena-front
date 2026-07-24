export type TipoUsuario =
  | 'ADMINISTRADOR'
  | 'GESTOR'
  | 'FINANCEIRO'
  | 'MEDICO'
  | 'PROFISSIONAL'
  | 'RECEPCIONISTA'
  | 'PACIENTE'
  | 'RESPONSAVEL'
  | 'FARMACIA'
  | 'REPRESENTANTE_EMPRESA'

export interface UsuarioResponse {
  id: string
  nome: string
  email: string
  cpf: string
  telefone?: string
  fotoPerfil?: string
  status: 'ATIVO' | 'INATIVO'
  tipos: TipoUsuario[]
  dataCriacao: string
}

export interface LoginRequest {
  email: string
  senha: string
}

export interface AuthResponse {
  token: string
  refreshToken: string
  expiresIn: number
  tipoUsuario: TipoUsuario
  usuarioId: string
}

export interface AuthState {
  usuario: UsuarioResponse | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}