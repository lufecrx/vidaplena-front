'use client'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {


  return (
     <div className="min-h-screen bg-gray-50">
      {/* Main content area */}
      <main>
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
