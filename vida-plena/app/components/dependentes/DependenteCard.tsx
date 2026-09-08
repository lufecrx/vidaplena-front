'use client'

import React from 'react'
import {
  Baby,
  Heart,
  Accessibility,
  FileText,
  UserX,
  Droplet,
  AlertTriangle,
  Pill,
  Calendar,
  CreditCard,
} from 'lucide-react'
import {
  DependenteResponseDTO,
  TIPO_DEPENDENCIA_LABELS,
  TIPO_SANGUINEO_REVERSE_MAP,
} from '../../types/dependente'
import { formatarCPF, formatarData } from '../../lib/Formatters'
import { formatarIdadeTexto } from '../../lib/dependenteValidator'
import Button from '../Button'

interface DependenteCardProps {
  dependente: DependenteResponseDTO
  onVerProntuario: (dependente: DependenteResponseDTO) => void
  onDesvincular: (dependente: DependenteResponseDTO) => void
}

export function DependenteCard({
  dependente,
  onVerProntuario,
  onDesvincular,
}: DependenteCardProps) {
  const isAtivo = !dependente.dataFim
  const tipoSanguineoFormatado = dependente.tipoSanguineo
    ? TIPO_SANGUINEO_REVERSE_MAP[dependente.tipoSanguineo] || dependente.tipoSanguineo
    : null

  // Configurações visuais por tipo de dependência
  const configPorTipo = {
    CRIANCA: {
      label: TIPO_DEPENDENCIA_LABELS.CRIANCA,
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      avatarBg: 'bg-rose-100 text-rose-600',
      icon: Baby,
    },
    IDOSO: {
      label: TIPO_DEPENDENCIA_LABELS.IDOSO,
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      avatarBg: 'bg-amber-100 text-amber-600',
      icon: Heart,
    },
    NECESSIDADE_ESPECIAL: {
      label: TIPO_DEPENDENCIA_LABELS.NECESSIDADE_ESPECIAL,
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
      avatarBg: 'bg-purple-100 text-purple-600',
      icon: Accessibility,
    },
  }

  const tipoVisual = configPorTipo[dependente.tipo] || configPorTipo.CRIANCA
  const TipoIcon = tipoVisual.icon
  const idadeTexto = formatarIdadeTexto(dependente.dataNascimento)

  const temAlergias = Array.isArray(dependente.alergias) && dependente.alergias.length > 0
  const temMedicamentos =
    Array.isArray(dependente.medicamentosContinuos) && dependente.medicamentosContinuos.length > 0

  return (
    <div className="flex flex-col justify-between bg-white rounded-2xl p-6 shadow-sm border border-slate-100 transition-all hover:shadow-md hover:border-slate-200">
      <div>
        {/* Topo: Avatar, Categoria e Status */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${tipoVisual.avatarBg}`}
            >
              <TipoIcon className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base leading-snug line-clamp-1" title={dependente.nome}>
                {dependente.nome}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-semibold text-slate-500">
                  {idadeTexto}
                </span>
                <span className="text-slate-300">•</span>
                <span
                  className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md border ${tipoVisual.badgeBg}`}
                >
                  {tipoVisual.label}
                </span>
              </div>
            </div>
          </div>

          {/* Status Ativo / Inativo */}
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${
              isAtivo
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            {isAtivo ? 'Ativo' : 'Inativo'}
          </span>
        </div>

        {/* Informações Cadastrais */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
          <div className="flex items-center gap-1.5 truncate">
            <CreditCard className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{formatarCPF(dependente.cpf)}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{formatarData(dependente.dataNascimento)}</span>
          </div>
        </div>

        {/* Resumo Clínico (Badges) */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {/* Tipo Sanguíneo */}
          {tipoSanguineoFormatado && (
            <span
              className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-100"
              title="Tipo Sanguíneo"
            >
              <Droplet className="w-3 h-3 fill-rose-500 stroke-rose-600" />
              {tipoSanguineoFormatado}
            </span>
          )}

          {/* Alergias */}
          {temAlergias ? (
            <span
              className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200"
              title={`Alergias: ${dependente.alergias.join(', ')}`}
            >
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              {dependente.alergias.length} {dependente.alergias.length === 1 ? 'alergia' : 'alergias'}
            </span>
          ) : (
            <span className="inline-flex items-center text-[11px] font-normal px-2 py-0.5 rounded text-slate-400">
              Sem alergias
            </span>
          )}

          {/* Medicamentos */}
          {temMedicamentos && (
            <span
              className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100"
              title={`Medicamentos: ${dependente.medicamentosContinuos.join(', ')}`}
            >
              <Pill className="w-3 h-3 text-blue-500" />
              {dependente.medicamentosContinuos.length}{' '}
              {dependente.medicamentosContinuos.length === 1 ? 'medicamento' : 'medicamentos'}
            </span>
          )}
        </div>
      </div>

      {/* Ações */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onVerProntuario(dependente)}
          className="flex-1 gap-1.5 text-xs font-semibold"
        >
          <FileText className="w-3.5 h-3.5" />
          Ver Prontuário
        </Button>

        {isAtivo && (
          <Button
            variant="transparent"
            size="sm"
            onClick={() => onDesvincular(dependente)}
            title="Desvincular dependente"
            className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 px-2.5"
          >
            <UserX className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
