'use client'

import { useState } from 'react'
import { Sidebar } from './components/SideBar'
import { Header } from './components/Header'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <Header sidebarCollapsed={collapsed} />

      {/* Main content area */}
      <main
        className={`
          pt-16 min-h-screen transition-all duration-300
          ${collapsed ? 'pl-16' : 'pl-60'}
        `}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}