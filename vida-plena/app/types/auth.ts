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
  senha: number
  telefone?: string
  fotoPerfil?: string
  status: 'ATIVO' | 'INATIVO'
  tipos: TipoUsuario[]
  dataNascimento: string
  dataCriacao: string
}

/* O número define qual tipo de usuario. Começando de 1, 2, 3, e assim por diante.
export interface Paciente extends UsuarioResponse {
   perfil: number
}

export interface Cuidador extends UsuarioResponse {
   perfil: number
}

export interface Medico extends UsuarioResponse {
   perfil: number
   crm: string
}

export interface Nutricionista extends UsuarioResponse {
   perfil: number
   crn: string
}
*/

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
