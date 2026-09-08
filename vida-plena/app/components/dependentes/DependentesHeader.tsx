'use client'

import React from 'react'
import { UserPlus, Search, CheckCircle2, ListFilter } from 'lucide-react'
import Button from '../Button'

interface DependentesHeaderProps {
  totalCount: number
  termoBusca: string
  onBuscaChange: (termo: string) => void
  apenasAtivos: boolean
  onToggleApenasAtivos: (apenasAtivos: boolean) => void
  onNovoDependente: () => void
}

export function DependentesHeader({
  totalCount,
  termoBusca,
  onBuscaChange,
  apenasAtivos,
  onToggleApenasAtivos,
  onNovoDependente,
}: DependentesHeaderProps) {
  return (
    <div className="flex flex-col gap-5 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      {/* Topo: Título, contagem e Botão Principal */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Meus Dependentes
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              {totalCount} {totalCount === 1 ? 'cadastrado' : 'cadastrados'}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Gerencie o prontuário, perfil clínico e consultas de seus familiares e dependentes.
          </p>
        </div>

        <Button onClick={onNovoDependente} className="gap-2 shrink-0">
          <UserPlus className="w-4 h-4" />
          <span>+ Novo Dependente</span>
        </Button>
      </div>

      {/* Linha inferior: Busca e Filtros */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
        {/* Input de Busca */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            placeholder="Buscar por nome ou CPF..."
            value={termoBusca}
            onChange={(e) => onBuscaChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
        </div>

        {/* Filtro de Ativos / Inativos */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer select-none bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 transition-colors">
            <input
              type="checkbox"
              checked={apenasAtivos}
              onChange={(e) => onToggleApenasAtivos(e.target.checked)}
              className="accent-emerald-600 h-4 w-4 rounded"
            />
            <span>Apenas vínculos ativos</span>
          </label>
        </div>
      </div>
    </div>
  )
}
