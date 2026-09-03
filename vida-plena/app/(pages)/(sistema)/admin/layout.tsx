'use client'

import { useRouteGuard } from '@/app/hooks/Userouteguard'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoading } = useRouteGuard('ADMINISTRADOR')

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-[#F3F6F1]">Carregando...</div>
  }

  return (
    <div>
        {children}
    </div>
  )
}
