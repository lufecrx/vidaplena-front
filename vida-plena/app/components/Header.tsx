'use client'

/*
import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../auth/Authcontext'
*/

interface HeaderProps {
  sidebarCollapsed: boolean
}

export function Header({ sidebarCollapsed }: HeaderProps) {
  //const { usuario, logout } = useAuth()
  //const [userMenuOpen, setUserMenuOpen] = useState(false)

  return (
    <header
      className={`
        fixed top-0 right-0 z-30 h-16 bg-white border-b border-gray-200
        flex items-center justify-between px-6 transition-all duration-300
        ${sidebarCollapsed ? 'left-16' : 'left-60'}
      `}
    >
      {/* Left — breadcrumb ou título da página pode entrar aqui via slot */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span className="font-medium text-gray-800">VidaPlena</span>
      </div>


      {/* Campo com nome de usuario e dropbox para sair da conta e acessar perfil.
      <div className="flex items-center gap-3">

        <Link
          href="/notificacoes"
          className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          aria-label="Notificações"
        >
          🔔

          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
        </Link>


        <div className="relative">
          <button
            onClick={() => setUserMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-[#1A3A5C] flex items-center justify-center text-white text-xs font-bold">
              {usuario?.nome.charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-800 leading-tight">{usuario?.nome}</p>
              <p className="text-xs text-gray-500 leading-tight">{usuario?.tipos[0]}</p>
            </div>
            <span className="text-gray-400 text-xs">▾</span>
          </button>

          {userMenuOpen && (
            <>

              <div
                className="fixed inset-0 z-10"
                onClick={() => setUserMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1 z-20 w-52 rounded-xl border border-gray-200 bg-white shadow-lg py-1">
                <Link
                  href="/perfil"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  👤 Meu Perfil
                </Link>
                <Link
                  href="/notificacoes/configurar"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  🔔 Notificações
                </Link>
                <div className="my-1 border-t border-gray-100" />
                <button
                  onClick={() => { setUserMenuOpen(false); logout() }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                >
                  🚪 Sair
                </button>
              </div>
            </>
          )}
        </div>

      </div> */}

    </header>
  )
}
