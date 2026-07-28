'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../auth/Authcontext'
import type { TipoUsuario } from '../types/auth'

/**
 * Garante no client-side que o usuário tem os roles necessários.
 * Usar dentro de layouts ou páginas protegidas.
 *
 * @example
 * useRouteGuard('ADMINISTRADOR', 'GESTOR')
 */
export function useRouteGuard(...allowedRoles: TipoUsuario[]) {
  const { isAuthenticated, isLoading, hasRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      router.replace('/login')
      return
    }

    if (allowedRoles.length > 0 && !hasRole(...allowedRoles)) {
      router.replace('/sem-permissao')
    }
  }, [isAuthenticated, isLoading, hasRole, router, allowedRoles])

  return { isLoading }
}