'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
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

// Rotas que não exigem sessão — evita bater em /me e /refresh à toa
const PUBLIC_ROUTES = ['/login']

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (PUBLIC_ROUTES.includes(pathname)) {
      setIsLoading(false)
      return
    }

    let active = true

    async function hydrateSession() {
      const token = getAccessToken()
      if (!token) {
        setUsuario(null)
        setIsLoading(false)
        return
      }

      try {
        const perfil = await authService.getMeuPerfil()
        if (active) setUsuario(perfil)
      } catch {
        if (active) setUsuario(null)
      } finally {
        if (active) setIsLoading(false)
      }
    }

    hydrateSession()

    return () => {
      active = false
    }
  }, [pathname])

  const login = useCallback(async (credentials: LoginRequest) => {
    const authData = await authService.login(credentials)
    const perfil = authData.usuario || (await authService.getMeuPerfil())
    setUsuario(perfil)
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

function getHomeByRole(tipos: TipoUsuario[]): string {
  if (tipos.includes('ADMINISTRADOR')) return '/admin/dashboard'
  if (tipos.includes('GESTOR')) return '/gestor/dashboard'
  if (tipos.includes('FINANCEIRO')) return '/financeiro/dashboard'
  if (tipos.includes('MEDICO') || tipos.includes('PROFISSIONAL')) return '/profissionais/dashboard'
  if (tipos.includes('RECEPCIONISTA')) return '/recepcionista/agendamentos'
  if (tipos.includes('FARMACIA')) return '/farmacia/receitas'
  if (tipos.includes('REPRESENTANTE_EMPRESA')) return '/empresa/dashboard'
  return '/paciente/dashboard'
}