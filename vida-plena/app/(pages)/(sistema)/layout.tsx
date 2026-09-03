'use client'

import { useState } from 'react'
import { Header } from '@/app/components/Header'
import { Sidebar } from '@/app/components/SideBar'

export default function SistemaLayout({
   children,
}: {
   children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
     <div className="w-full min-h-screen bg-[#F3F6F1] overflow-y-hidden">
      <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      <Header isCollapsed={isCollapsed} />
      <main
        className={`flex justify-center items-center h-full pt-16 p-6 transition-all duration-300 ${
          isCollapsed ? 'ml-20' : 'ml-68'
        }`}
      >
        {children}
      </main>
    </div>
  )
}
