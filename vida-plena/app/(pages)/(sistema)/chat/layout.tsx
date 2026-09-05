'use client'

import { useRouteGuard } from '@/app/hooks/Userouteguard'

export default function ChatLayout({
   children,
}: {
   children: React.ReactNode
}) {
   const { isLoading } = useRouteGuard(
      'PACIENTE',
      'RESPONSAVEL',
      'MEDICO',
      'PROFISSIONAL',
      'ADMINISTRADOR',
   )

   if (isLoading) {
      return <div className="flex h-screen items-center justify-center bg-[#F3F6F1]">Carregando...</div>
   }

   return (
      <div className="flex h-full w-full justify-center">
         {children}
      </div>
   )
}
