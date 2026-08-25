'use client'

import { useRouteGuard } from '@/app/hooks/Userouteguard'

export default function AdminLayout({
   children,
}: {
   children: React.ReactNode
   }) {
   const { isLoading } = useRouteGuard('PROFISSIONAL', 'ADMINISTRADOR')

   if (isLoading) {
      return <div>Carregando... </div>
   }

   return (
      <main className="ProfissionalLayout">
         {children}
      </main>
   )
}
