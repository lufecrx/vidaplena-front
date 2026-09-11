'use client'

import React from 'react'
import { Users, UserPlus } from 'lucide-react'
import Button from '../Button'

interface EmptyDependentesStateProps {
  onCadastrar: () => void
  isBuscaAtiva?: boolean
  onLimparBusca?: () => void
}

export function EmptyDependentesState({
  onCadastrar,
  isBuscaAtiva = false,
  onLimparBusca,
}: EmptyDependentesStateProps) {
  if (isBuscaAtiva) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
          <Users className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">
          Nenhum dependente encontrado
        </h3>
        <p className="text-sm text-slate-500 max-w-md mb-6">
          Não encontramos nenhum dependente com os critérios de busca informados.
        </p>
        {onLimparBusca && (
          <Button variant="outline" onClick={onLimparBusca}>
            Limpar Filtros de Busca
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
      <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 shadow-inner">
        <Users className="w-10 h-10 stroke-[1.75]" />
      </div>

      <h3 className="text-xl font-bold text-slate-800 mb-2">
        Nenhum dependente vinculado
      </h3>

      <p className="text-sm text-slate-500 max-w-lg mb-6 leading-relaxed">
        Cadastre seus familiares e dependentes (como filhos, idosos ou pessoas sob seus cuidados)
        para gerenciar consultas, histórico clínico e prontuários em um só lugar.
      </p>

      <Button onClick={onCadastrar} className="gap-2 shadow-sm">
        <UserPlus className="w-5 h-5" />
        Cadastrar Primeiro Dependente
      </Button>
    </div>
  )
}
