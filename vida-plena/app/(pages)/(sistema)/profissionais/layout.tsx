'use client'

import { useRouteGuard } from '@/app/hooks/Userouteguard'

export default function ProfissionalLayout({
   children,
}: {
   children: React.ReactNode
   }) {
   const { isLoading } = useRouteGuard('PROFISSIONAL', 'ADMINISTRADOR')

   if (isLoading) {
      return <div>Carregando... </div>
   }

   return (
      <div>
         {children}
      </div>
   )
}
