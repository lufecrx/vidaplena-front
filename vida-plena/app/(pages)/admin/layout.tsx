'use client'

import { useRouteGuard } from '@/app/hooks/Userouteguard'
import { Header } from '@/app/components/Header'
import { Sidebar } from '@/app/components/SideBar'

export default function AdminLayout({
   children,
}: {
   children: React.ReactNode
   }) {
   const { isLoading } = useRouteGuard('ADMINISTRADOR')

   if (isLoading) {
      return <div>Carregando... </div>
   }

   return (
      <main className="flex flex-col-reverse md:flex-row items-center justify-center h-screen w-full p-4 md:p-0 bg-[#F3F6F1]">
         <Sidebar/>
         <Header/>
         {children}
      </main>
   )
}
