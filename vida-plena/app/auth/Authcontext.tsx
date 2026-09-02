'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '../services/authService'
import { getAccessToken, setAccessToken } from '../../api'
import type { UsuarioResponse, TipoUsuario, LoginRequest } from '../types/auth'

interface AuthContextData {
  usuario: UsuarioResponse | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  hasRole: (...roles: TipoUsuario[]) => boolean
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Ao montar, tenta recuperar sessão caso haja indicador de sessão salva
  useEffect(() => {
    async function hydrateSession() {
      const token = getAccessToken()
      if (!token) {
        setUsuario(null)
        setIsLoading(false)
        return
      }

      try {
        const perfil = await authService.getMeuPerfil()
        setUsuario(perfil)
      } catch {
        setUsuario(null)
        setAccessToken(null)
      } finally {
        setIsLoading(false)
      }
    }
    hydrateSession()
  }, [])

  const login = useCallback(async (credentials: LoginRequest) => {
    const authData = await authService.login(credentials)
    const perfil = authData.usuario || (await authService.getMeuPerfil())
    setUsuario(perfil)
    // Redireciona conforme o tipo principal do usuário
    router.replace(getHomeByRole(perfil.tipos))
  }, [router])

  const logout = useCallback(async () => {
    await authService.logout()
    setUsuario(null)
    router.replace('/login')
  }, [router])

  const hasRole = useCallback(
    (...roles: TipoUsuario[]) => {
      if (!usuario) return false
      return roles.some((role) => usuario.tipos.includes(role))
    },
    [usuario],
  )

  return (
    <AuthContext.Provider
      value={{ usuario, isAuthenticated: !!usuario, isLoading, login, logout, hasRole }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}

// ── Redireciona cada perfil para o dashboard correto ──────────────────────
function getHomeByRole(tipos: TipoUsuario[]): string {
  if (tipos.includes('ADMINISTRADOR')) return '/admin/dashboard'
  if (tipos.includes('GESTOR')) return '/gestor/dashboard'
  if (tipos.includes('FINANCEIRO')) return '/financeiro/dashboard'
  if (tipos.includes('MEDICO') || tipos.includes('PROFISSIONAL')) return '/profissional/dashboard'
  if (tipos.includes('RECEPCIONISTA')) return '/recepcionista/agendamentos'
  if (tipos.includes('FARMACIA')) return '/farmacia/receitas'
  if (tipos.includes('REPRESENTANTE_EMPRESA')) return '/empresa/dashboard'
  // Paciente e Responsável
  return '/paciente/dashboard'
}