'use client'

import { useRouteGuard } from '@/app/hooks/Userouteguard'
import { Header } from '@/app/components/Header'
import { Sidebar } from '@/app/components/SideBar'

export default function AdminLayout({
   children,
}: {
   children: React.ReactNode
   }) {
   const { isLoading } = useRouteGuard('PACIENTE', 'ADMINISTRADOR')

   if (isLoading) {
      return <div>Carregando... </div>
   }

   return (
      <main className="PacienteLayout">
         <Sidebar collapsed={false}/>
         <Header sidebarCollapsed={false}/>
         {children}
      </main>
   )
}
