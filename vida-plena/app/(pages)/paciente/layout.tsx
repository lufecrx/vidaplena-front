'use client'

import { useState } from 'react'
import { useRouteGuard } from '@/app/hooks/Userouteguard'
import { Header } from '@/app/components/Header'
import { Sidebar } from '@/app/components/SideBar'

export default function PacienteLayout({
   children,
}: {
   children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { isLoading } = useRouteGuard('PACIENTE', 'ADMINISTRADOR')

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-[#F3F6F1]">Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-[#F3F6F1]">
      <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      <Header isCollapsed={isCollapsed} />
      <main
        className={`pt-16 p-6 transition-all duration-300 ${
          isCollapsed ? 'pl-20' : 'pl-68'
        }`}
      >
        {children}
      </main>
    </div>
  )
}
