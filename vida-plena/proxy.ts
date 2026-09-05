import { NextRequest, NextResponse } from 'next/server'

// Rotas públicas — qualquer um acessa
const PUBLIC_ROUTES = ['/login', '/recuperar-senha', '/redefinir-senha']

// Mapa de prefixo de rota → tipos de usuário permitidos
const ROUTE_PERMISSIONS: Record<string, string[]> = {
  '/admin':        ['ADMINISTRADOR'],
  '/gestor':       ['ADMINISTRADOR', 'GESTOR'],
  '/financeiro':   ['ADMINISTRADOR', 'FINANCEIRO'],
  '/profissionais':['MEDICO', 'PROFISSIONAL'],
  '/recepcionista':['ADMINISTRADOR', 'RECEPCIONISTA'],
  '/farmacia':     ['FARMACIA'],
  '/empresa':      ['REPRESENTANTE_EMPRESA'],
  '/paciente':     ['PACIENTE', 'RESPONSAVEL'],
  '/chat':         ['PACIENTE', 'RESPONSAVEL', 'MEDICO', 'PROFISSIONAL', 'ADMINISTRADOR'],
}

// IMPORTANTE: o backend hoje NÃO emite nenhum cookie de sessão — o login
// (POST /api/v1/auth/login) devolve accessToken/refreshToken só no corpo
// JSON, guardado em memória no client (ver api.ts). Sem um cookie legível
// aqui no servidor, o proxy não tem como saber se a requisição está
// autenticada. A checagem por `vidaplena_session` abaixo ficava sempre
// falhando, então NÃO a religue enquanto o backend não passar a setar esse
// cookie — religar sem isso redireciona todo mundo pra /login em loop,
// mesmo logado. Até lá, quem garante autenticação/papel é o client, via
// useRouteGuard (app/hooks/Userouteguard.ts), que já funciona (consulta
// GET /api/v1/usuarios/me de verdade).
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next()
  }

  const sessionCookie = request.cookies.get('vidaplena_session')
  if (!sessionCookie) {
    // TODO(backend): reativar o bloqueio assim que existir esse cookie.
    return NextResponse.next()
  }

  let session: { tipos?: string[] }
  try {
    session = JSON.parse(atob(sessionCookie.value))
  } catch {
    return NextResponse.next()
  }

  const userTipos = session.tipos ?? []

  for (const [prefix, allowed] of Object.entries(ROUTE_PERMISSIONS)) {
    if (pathname.startsWith(prefix)) {
      const temPermissao = allowed.some((role) => userTipos.includes(role))
      if (!temPermissao) {
        return NextResponse.redirect(new URL('/sem-permissao', request.url))
      }
      break
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
