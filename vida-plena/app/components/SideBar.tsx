'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronDown, Settings, UserRound } from 'lucide-react'
import { useAuth } from '../auth/Authcontext'
import { getNavForUser } from '../lib/Navegation'
import Button from './Button'
import { IconPlaceholder, Logo } from './Icons'

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const { usuario } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function closeProfileMenu(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', closeProfileMenu)
    return () => document.removeEventListener('mousedown', closeProfileMenu)
  }, [])

  const navGroups = usuario ? getNavForUser(usuario.tipos) : []

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-brand-primary transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-68'
      }`}
    >
      {/* BOTÃO DE TOGGLE */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-6 z-50 flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-brand-primary text-white shadow-md hover:bg-slate-800 transition-transform"
        title={isCollapsed ? "Expandir menu" : "Recolher menu"}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      {/* ÁREA DA LOGO */}
      <div className="flex h-20 items-center justify-center px-4 py-5 overflow-hidden">
        {isCollapsed ? (
          // Versão apenas com o Ícone da Logo
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
            <IconPlaceholder name="Activity" className="h-5 w-5" />
          </div>
        ) : (
          <Logo />
        )}
      </div>

      <div className="mx-4 h-px bg-white/10 mb-4" />

      {/* BOTÕES DE NAVEGAÇÃO */}
      <nav className="flex flex-col items-center overflow-y-auto py-2 scrollbar-thin gap-3">
        {navGroups
          .flatMap((group) => group.items)
          .map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + '/')

            return (
              <Button
                key={item.href}
                variant={isActive ? 'outline' : 'transparent'}
                size="md"
                className={`transition-all duration-200 ${
                  isCollapsed ? 'w-12 px-0 justify-center' : 'w-54'
                } ${
                  isActive
                    ? 'text-vp-verde-500 bg-vp-verde-500/10 hover:bg-vp-verde-500/10'
                    : 'text-white/60 border border-transparent hover:text-white hover:bg-transparent hover:border hover:border-white'
                }`}
              >
                <Link
                  href={item.href}
                  title={item.label}
                  className={`relative flex items-center ${
                    isCollapsed ? 'justify-center w-full' : 'w-full px-4 gap-2.5'
                  }`}
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center text-base">
                    <IconPlaceholder name={item.icon} />
                  </span>

                  {/* Esconde o texto quando recolhido */}
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </Link>
              </Button>
            )
          })}
      </nav>

      {/* ÁREA DO USUÁRIO */}
      {usuario && (
        <>
          <div className="mx-4 h-px bg-white/10 mt-auto" />

          <div className="relative p-3 flex justify-center" ref={profileMenuRef}>
            <button
              type="button"
              className="flex max-w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-vp-verde-500/70"
              onClick={() => setProfileMenuOpen((open) => !open)}
              aria-expanded={profileMenuOpen}
              aria-haspopup="menu"
              title="Abrir menu do usuário"
            >
              <div
                className="h-8 w-8 shrink-0 rounded-full bg-[#4DBFA8] flex items-center justify-center text-[#1A3A5C] text-xs font-bold"
                title={usuario.nome}
              >
                {usuario.nome.charAt(0).toUpperCase()}
              </div>

              {/* Esconde dados do usuário quando recolhido */}
              {!isCollapsed && (
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{usuario.nome}</p>
                  <p className="truncate text-xs text-white/50">{usuario.tipos[0]}</p>
                </div>
              )}
              {!isCollapsed && <ChevronDown className={`h-4 w-4 shrink-0 text-white/60 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />}
            </button>

            {profileMenuOpen && (
              <div className={`absolute bottom-16 z-50 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg ${isCollapsed ? 'left-16' : 'left-3'}`} role="menu">
                <button type="button" role="menuitem" onClick={() => { setProfileMenuOpen(false); router.push('/configuracoes/dados-pessoais') }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50">
                  <UserRound className="h-4 w-4 text-vp-azul-700" />
                  Atualizar dados
                </button>
                <button type="button" role="menuitem" onClick={() => { setProfileMenuOpen(false); router.push('/configuracoes') }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50">
                  <Settings className="h-4 w-4 text-vp-azul-700" />
                  Configurações
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </aside>
  )
}
