'use client'

import { useRouteGuard } from '@/app/hooks/Userouteguard'

export default function PacienteLayout({
   children,
}: {
   children: React.ReactNode
}) {
  const { isLoading } = useRouteGuard('PACIENTE', 'ADMINISTRADOR')

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-[#F3F6F1]">Carregando...</div>
  }

  return (
     <div>
        {children}
    </div>
  )
}
