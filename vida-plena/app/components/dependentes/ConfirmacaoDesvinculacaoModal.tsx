'use client'

import React from 'react'
import { AlertCircle, X } from 'lucide-react'
import { DependenteResponseDTO, TIPO_DEPENDENCIA_LABELS } from '../../types/dependente'
import { formatarCPF } from '../../lib/Formatters'
import Button from '../Button'

interface ConfirmacaoDesvinculacaoModalProps {
  isOpen: boolean
  dependente: DependenteResponseDTO | null
  loading?: boolean
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmacaoDesvinculacaoModal({
  isOpen,
  dependente,
  loading = false,
  onConfirm,
  onClose,
}: ConfirmacaoDesvinculacaoModalProps) {
  if (!isOpen || !dependente) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Ícone e Cabeçalho */}
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 shadow-inner">
            <AlertCircle className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-slate-900">
            Confirmar Desvinculação
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Deseja realmente desvincular o seguinte dependente?
          </p>
        </div>

        {/* Cartão de Identificação do Dependente */}
        <div className="my-5 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-sm">
          <div className="font-bold text-slate-800 text-base">{dependente.nome}</div>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
            <span>CPF: {formatarCPF(dependente.cpf)}</span>
            <span>•</span>
            <span>{TIPO_DEPENDENCIA_LABELS[dependente.tipo]}</span>
          </div>
        </div>

        {/* Aviso Explicativo */}
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/60 text-xs text-amber-800 leading-relaxed mb-6">
          <strong>Aviso:</strong> A desvinculação registrará o encerramento do vínculo a partir da data de hoje.
          O prontuário e as consultas anteriores permanecem salvos no sistema para conformidade médica.
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>

          <Button
            type="button"
            variant="danger"
            loading={loading}
            onClick={onConfirm}
          >
            Confirmar Desvinculação
          </Button>
        </div>
      </div>
    </div>
  )
}
