'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/auth/Authcontext'
import Button from '@/app/components/Button'

export default function ConfiguracoesPage() {
  const { usuario, isLoading } = useAuth()
  const router = useRouter()

  if (isLoading) return <div className="flex min-h-screen items-center justify-center bg-[#F3F6F1]">Carregando...</div>
  if (!usuario) {
    router.replace('/login')
    return null
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F3F6F1] p-6">
      <section className="w-full max-w-2xl rounded-2xl border border-slate-100/80 bg-white p-6 shadow-sm sm:p-8">
        <div className="border-b border-slate-100 pb-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-vp-azul-700">VidaPlena</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Configurações</h1>
          <p className="mt-2 text-sm text-slate-500">Gerencie sua conta e suas preferências.</p>
        </div>
        <div className="mt-6 flex items-center justify-between rounded-xl border border-slate-100 p-4">
          <div>
            <h2 className="font-semibold text-slate-900">Dados pessoais</h2>
            <p className="mt-1 text-sm text-slate-500">Atualize seus dados básicos e informações de atendimento.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => router.push('/configuracoes/dados-pessoais')}>Atualizar</Button>
        </div>
      </section>
    </main>
  )
}