'use client'

import { usePathname } from 'next/navigation'
import { useAuth } from '../auth/Authcontext'
import { getCurrentNavLabel } from '../lib/Navegation'

interface HeaderProps {
  isCollapsed: boolean
}

export function Header({ isCollapsed }: HeaderProps) {
  const { usuario } = useAuth()
  const pathname = usePathname()
  const label = getCurrentNavLabel(
    pathname,
    usuario?.tipos ?? []
  )

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 transition-all duration-300 ${
        isCollapsed ? 'left-20' : 'left-68'
      }`}
    >
      <div className="flex items-center gap-2 text-2xl text-gray-500">
        <span className="font-bold text-gray-800">{label}</span>
      </div>
    </header>
  )
}
