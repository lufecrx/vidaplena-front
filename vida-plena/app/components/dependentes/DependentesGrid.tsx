'use client'

import React from 'react'
import { DependenteResponseDTO } from '../../types/dependente'
import { DependenteCard } from './DependenteCard'
import { EmptyDependentesState } from './EmptyDependentesState'

interface DependentesGridProps {
  dependentes: DependenteResponseDTO[]
  loading: boolean
  isBuscaAtiva: boolean
  onLimparBusca: () => void
  onCadastrar: () => void
  onVerProntuario: (dependente: DependenteResponseDTO) => void
  onDesvincular: (dependente: DependenteResponseDTO) => void
}

export function DependentesGrid({
  dependentes,
  loading,
  isBuscaAtiva,
  onLimparBusca,
  onCadastrar,
  onVerProntuario,
  onDesvincular,
}: DependentesGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="h-64 bg-white rounded-2xl border border-slate-100 p-6 animate-pulse flex flex-col justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
            <div className="space-y-2 my-4">
              <div className="h-8 bg-slate-100 rounded-xl" />
              <div className="h-5 bg-slate-100 rounded w-1/3" />
            </div>
            <div className="h-9 bg-slate-200 rounded-lg" />
          </div>
        ))}
      </div>
    )
  }

  if (dependentes.length === 0) {
    return (
      <EmptyDependentesState
        isBuscaAtiva={isBuscaAtiva}
        onLimparBusca={onLimparBusca}
        onCadastrar={onCadastrar}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {dependentes.map((dep) => (
        <DependenteCard
          key={dep.vinculoId}
          dependente={dep}
          onVerProntuario={onVerProntuario}
          onDesvincular={onDesvincular}
        />
      ))}
    </div>
  )
}
