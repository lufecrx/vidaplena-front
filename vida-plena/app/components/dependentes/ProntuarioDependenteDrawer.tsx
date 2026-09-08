'use client'

import React from 'react'
import {
  X,
  User,
  Heart,
  Baby,
  Accessibility,
  Droplet,
  AlertTriangle,
  Pill,
  FileText,
  Calendar,
  Mail,
  Phone,
  ShieldCheck,
} from 'lucide-react'
import {
  DependenteResponseDTO,
  TIPO_DEPENDENCIA_LABELS,
  TIPO_SANGUINEO_REVERSE_MAP,
} from '../../types/dependente'
import { formatarCPF, formatarData, formatarTelefone } from '../../lib/Formatters'
import { formatarIdadeTexto } from '../../lib/dependenteValidator'
import Button from '../Button'

interface ProntuarioDependenteDrawerProps {
  isOpen: boolean
  dependente: DependenteResponseDTO | null
  onClose: () => void
}

export function ProntuarioDependenteDrawer({
  isOpen,
  dependente,
  onClose,
}: ProntuarioDependenteDrawerProps) {
  if (!isOpen || !dependente) return null

  const isAtivo = !dependente.dataFim
  const tipoSanguineoFormatado = dependente.tipoSanguineo
    ? TIPO_SANGUINEO_REVERSE_MAP[dependente.tipoSanguineo] || dependente.tipoSanguineo
    : 'Não informado'

  const configPorTipo = {
    CRIANCA: {
      label: TIPO_DEPENDENCIA_LABELS.CRIANCA,
      avatarBg: 'bg-rose-100 text-rose-600',
      icon: Baby,
    },
    IDOSO: {
      label: TIPO_DEPENDENCIA_LABELS.IDOSO,
      avatarBg: 'bg-amber-100 text-amber-600',
      icon: Heart,
    },
    NECESSIDADE_ESPECIAL: {
      label: TIPO_DEPENDENCIA_LABELS.NECESSIDADE_ESPECIAL,
      avatarBg: 'bg-purple-100 text-purple-600',
      icon: Accessibility,
    },
  }

  const tipoVisual = configPorTipo[dependente.tipo] || configPorTipo.CRIANCA
  const TipoIcon = tipoVisual.icon
  const idadeTexto = formatarIdadeTexto(dependente.dataNascimento)

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-sm transition-opacity">
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl flex flex-col">
          {/* Topo do Drawer */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${tipoVisual.avatarBg}`}
              >
                <TipoIcon className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Prontuário do Dependente
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-semibold text-slate-500">
                    {tipoVisual.label}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span
                    className={`inline-block text-[11px] font-bold px-2 py-0.2 rounded-md ${
                      isAtivo
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isAtivo ? 'Vínculo Ativo' : 'Vínculo Inativo'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 rounded-lg p-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conteúdo rolável */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Cartão de Identificação */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Dados Cadastrais
              </h3>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Nome Completo</span>
                  <span className="font-semibold text-slate-800">{dependente.nome}</span>
                </div>

                <div>
                  <span className="text-xs text-slate-400 block font-medium">CPF</span>
                  <span className="font-semibold text-slate-800">{formatarCPF(dependente.cpf)}</span>
                </div>

                <div>
                  <span className="text-xs text-slate-400 block font-medium">Data de Nascimento</span>
                  <span className="font-semibold text-slate-800">
                    {formatarData(dependente.dataNascimento)} ({idadeTexto})
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-400 block font-medium">Responsável Legal</span>
                  <span className="font-semibold text-slate-800">{dependente.responsavelNome}</span>
                </div>

                <div>
                  <span className="text-xs text-slate-400 block font-medium">Início do Vínculo</span>
                  <span className="font-semibold text-slate-800">
                    {dependente.dataInicio ? formatarData(dependente.dataInicio) : '-'}
                  </span>
                </div>

                {dependente.dataFim && (
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Término do Vínculo</span>
                    <span className="font-semibold text-rose-600">
                      {formatarData(dependente.dataFim)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Perfil Clínico */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Informações Clínicas
              </h3>

              {/* Tipo Sanguíneo */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <Droplet className="w-5 h-5 fill-rose-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">Tipo Sanguíneo</h4>
                    <p className="text-xs text-slate-400">Classificação ABO e fator Rh</p>
                  </div>
                </div>
                <span className="text-base font-bold text-rose-600 px-3 py-1 bg-rose-50 rounded-lg border border-rose-100">
                  {tipoSanguineoFormatado}
                </span>
              </div>

              {/* Alergias Conhecidas */}
              <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                <div className="flex items-center gap-2 mb-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <h4 className="text-sm font-semibold text-slate-800">Alergias Clínicas</h4>
                </div>

                {dependente.alergias && dependente.alergias.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {dependente.alergias.map((alergia, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200"
                      >
                        {alergia}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    Nenhuma alergia relatada ou registrada.
                  </p>
                )}
              </div>

              {/* Medicamentos de Uso Contínuo */}
              <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                <div className="flex items-center gap-2 mb-2.5">
                  <Pill className="w-4 h-4 text-blue-500" />
                  <h4 className="text-sm font-semibold text-slate-800">
                    Medicamentos de Uso Contínuo
                  </h4>
                </div>

                {dependente.medicamentosContinuos && dependente.medicamentosContinuos.length > 0 ? (
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {dependente.medicamentosContinuos.map((med, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 p-2 rounded-lg bg-blue-50/60 border border-blue-100 font-medium"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                        <span>{med}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    Nenhum medicamento contínuo em uso registrado.
                  </p>
                )}
              </div>

              {/* Histórico Clínico Familiar */}
              <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-slate-500" />
                  <h4 className="text-sm font-semibold text-slate-800">
                    Histórico Clínico e Familiar
                  </h4>
                </div>
                <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">
                  {dependente.historicoFamiliar ||
                    'Nenhum histórico familiar ou observação relevante foi cadastrado.'}
                </p>
              </div>
            </div>

            {/* Contato e Acesso */}
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 text-xs">
              <h3 className="font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                Contato Registrado
              </h3>
              <div className="space-y-1.5 text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{dependente.email || 'Credencial técnica interna'}</span>
                </div>
                {dependente.telefone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatarTelefone(dependente.telefone)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Rodapé do Drawer */}
          <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-white">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
