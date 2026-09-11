// TipoUsuario tem uma única definição em types/usuario.ts — reexportado aqui
// para não quebrar os imports existentes deste módulo.
import type { TipoUsuario } from './usuario'
export type { TipoUsuario } from './usuario'

export interface UsuarioResponse {
  id: string
  nome: string
  email: string
  cpf: string
  telefone?: string
  senha?: string
  dataNascimento: string
  fotoPerfil?: string
  status: 'ATIVO' | 'INATIVO'
  tipos: TipoUsuario[]
  dataCriacao: string
}

export interface AtualizarMeuPerfilRequest {
  nome: string
  cpf: string
  email: string
  senha: string
  telefone: string
  dataNascimento: string
  tipos: TipoUsuario[]
}

export interface LoginRequest {
  email: string
  senha: string
}

export interface AuthResponse {
  accessToken: string
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
