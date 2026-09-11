import { api, setAccessToken } from '../../api'
import type { AuthResponse, AtualizarMeuPerfilRequest, LoginRequest, UsuarioResponse } from '../types/auth'

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/api/v1/auth/login', credentials)
    setAccessToken(data.accessToken)
    return data
  },

  async getMeuPerfil(): Promise<UsuarioResponse> {
    const { data } = await api.get<UsuarioResponse>('/api/v1/usuarios/me')
    return data
  },

  async atualizarMeuPerfil(dados: AtualizarMeuPerfilRequest): Promise<UsuarioResponse> {
    const { data } = await api.patch<UsuarioResponse>('/api/v1/usuarios/me', dados)
    return data
  },

  async logout() {
    try {
      await api.post('/api/v1/auth/logout')
    } catch {
      // ignora erro de logout
    } finally {
      setAccessToken(null)
    }
  },

  async forgotPassword(email: string) {
    const { data } = await api.post('/api/v1/auth/forgot-password', { email })
    return data
  },

  async resetPassword(token: string, novaSenha: string, confirmacaoSenha: string) {
    const { data } = await api.post('/api/v1/auth/reset-password', {
      token,
      novaSenha,
      confirmacaoSenha,
    })
    return data
  },
}