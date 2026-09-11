'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { authService } from '../services/authService'
import { pacienteService } from '../services/pacienteService'
import { profissionalService } from '../services/profissionalService'
import { empresaService } from '../services/empresaService'
import type { AtualizarMeuPerfilRequest, UsuarioResponse, TipoUsuario, LoginRequest } from '../types/auth'
import axios from 'axios'

interface AuthContextData {
  usuario: UsuarioResponse | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  atualizarUsuario: (dados: AtualizarMeuPerfilRequest) => Promise<void>
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
    await authService.login(credentials)
    const perfil = await authService.getMeuPerfil()
    setUsuario(perfil)
    router.replace(await getHomeAfterRegistrationCheck(perfil))
  }, [router])

  const logout = useCallback(async () => {
    await authService.logout()
    setUsuario(null)
    router.replace('/login')
  }, [router])

  const atualizarUsuario = useCallback(async (dados: AtualizarMeuPerfilRequest) => {
    const perfil = await authService.atualizarMeuPerfil(dados)
    setUsuario(perfil)
  }, [])

  const hasRole = useCallback(
    (...roles: TipoUsuario[]) => {
      if (!usuario) return false
      return roles.some((role) => usuario.tipos.includes(role))
    },
    [usuario],
  )

  return (
    <AuthContext.Provider
      value={{ usuario, isAuthenticated: !!usuario, isLoading, login, logout, atualizarUsuario, hasRole }}
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
  if (tipos.some((tipo) => ['MEDICO', 'PROFISSIONAL', 'NUTRICIONISTA', 'PERSONAL_TRAINER'].includes(tipo))) {
    return '/profissionais/dashboard'
  }
  if (tipos.includes('RECEPCIONISTA')) return '/recepcionista/agendamentos'
  if (tipos.includes('FARMACIA')) return '/farmacia/receitas'
  if (tipos.includes('REPRESENTANTE_EMPRESA')) return '/empresa/dashboard'
  return '/paciente/dashboard'
}

async function getHomeAfterRegistrationCheck(perfil: UsuarioResponse): Promise<string> {
  if (perfil.tipos.some((tipo) => ['MEDICO', 'PROFISSIONAL', 'NUTRICIONISTA', 'PERSONAL_TRAINER'].includes(tipo))) {
    try {
      const profissional = await profissionalService.obterProfissionalPorUsuarioId(perfil.id)
      if (!profissional) return '/cadastro-especifico'
    } catch (error) {
      throw error
    }
  }

  if (perfil.tipos.includes('PACIENTE')) {
    try {
      const paciente = await pacienteService.getPacientePorUsuarioId(perfil.id)
      if (!paciente) return '/cadastro-especifico'
    } catch (error) {
      if (isMissingRegistrationError(error)) return '/cadastro-especifico'
      throw error
    }
  }

  if (perfil.tipos.includes('REPRESENTANTE_EMPRESA')) {
    const empresa = await empresaService.obterEmpresaPorUsuarioId(perfil.id)
    if (!empresa) return '/cadastro-especifico'
  }

  return getHomeByRole(perfil.tipos)
}

function isMissingRegistrationError(error: unknown): boolean {
  return axios.isAxiosError(error) && [404, 422].includes(error.response?.status ?? 0)
}