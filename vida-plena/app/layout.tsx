import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from './auth/Authcontext'
import './styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VidaPlena',
  description: 'Ecossistema Digital de Gestão de Saúde e Bem-Estar Familiar',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}