import { NextRequest, NextResponse } from 'next/server'

// Rotas públicas — qualquer um acessa
const PUBLIC_ROUTES = ['/login', '/recuperar-senha', '/redefinir-senha']

// Mapa de prefixo de rota → tipos de usuário permitidos
const ROUTE_PERMISSIONS: Record<string, string[]> = {
  '/admin':        ['ADMINISTRADOR'],
  '/gestor':       ['ADMINISTRADOR', 'GESTOR'],
  '/financeiro':   ['ADMINISTRADOR', 'FINANCEIRO'],
  '/profissional': ['MEDICO', 'PROFISSIONAL'],
  '/recepcionista':['ADMINISTRADOR', 'RECEPCIONISTA'],
  '/farmacia':     ['FARMACIA'],
  '/empresa':      ['REPRESENTANTE_EMPRESA'],
  '/paciente':     ['PACIENTE', 'RESPONSAVEL'],
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Permite rotas públicas
  if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next()
  }

  // Lê o token do cookie (o backend deve setar um cookie "session" ou similar
  // com informações mínimas do usuário para o middleware poder verificar sem
  // chamar a API — em produção considere um JWT assinado no cookie)
  const sessionCookie = request.cookies.get('vidaplena_session')

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  let session: { tipos?: string[] }
  try {
    session = JSON.parse(atob(sessionCookie.value))
  } catch {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const userTipos = session.tipos ?? []

  // Verifica permissão para o prefixo da rota
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
