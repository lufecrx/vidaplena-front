'use client'

import React, { useState, useMemo } from 'react'
import { useAuth } from '@/app/auth/Authcontext'
import { useDependentes } from '@/app/hooks/useDependentes'
import { DependenteResponseDTO } from '@/app/types/dependente'
import { DependentesHeader } from '@/app/components/dependentes/DependentesHeader'
import { DependentesGrid } from '@/app/components/dependentes/DependentesGrid'
import { CadastroDependenteModal } from '@/app/components/dependentes/CadastroDependenteModal'
import { ConfirmacaoDesvinculacaoModal } from '@/app/components/dependentes/ConfirmacaoDesvinculacaoModal'
import { ProntuarioDependenteDrawer } from '@/app/components/dependentes/ProntuarioDependenteDrawer'
import {
  ToastNotification,
  ToastData,
} from '@/app/components/dependentes/ToastNotification'
import { Baby, Heart, Accessibility, Users } from 'lucide-react'

export default function DependentesPage() {
  const { usuario } = useAuth()
  const {
    dependentes,
    totalOriginal,
    loading,
    submitting,
    apenasAtivos,
    setApenasAtivos,
    termoBusca,
    setTermoBusca,
    cadastrarDependente,
    inativarDependente,
    recarregar,
  } = useDependentes()

  // Controle de Modais e Drawer
  const [modalCadastroAberto, setModalCadastroAberto] = useState(false)
  const [dependenteProntuario, setDependenteProntuario] =
    useState<DependenteResponseDTO | null>(null)
  const [dependenteDesvincular, setDependenteDesvincular] =
    useState<DependenteResponseDTO | null>(null)

  // Feedback Toast
  const [toast, setToast] = useState<ToastData | null>(null)

  // Contadores rápidos para resumo
  const estatisticas = useMemo(() => {
    let criancas = 0
    let idosos = 0
    let pcd = 0

    dependentes.forEach((d) => {
      if (d.tipo === 'CRIANCA') criancas++
      else if (d.tipo === 'IDOSO') idosos++
      else if (d.tipo === 'NECESSIDADE_ESPECIAL') pcd++
    })

    return { criancas, idosos, pcd, total: dependentes.length }
  }, [dependentes])

  // Callbacks de Ação
  function handleSucessoCadastro(novo: DependenteResponseDTO) {
    setToast({
      tipo: 'sucesso',
      mensagem: `Dependente ${novo.nome} cadastrado e vinculado com sucesso!`,
    })
  }

  async function handleConfirmarDesvinculacao() {
    if (!dependenteDesvincular) return

    try {
      const nomeDep = dependenteDesvincular.nome
      await inativarDependente(dependenteDesvincular.vinculoId)
      setDependenteDesvincular(null)
      setToast({
        tipo: 'sucesso',
        mensagem: `Vínculo com ${nomeDep} inativado com sucesso.`,
      })
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Não foi possível inativar o vínculo do dependente.'
      setToast({
        tipo: 'erro',
        mensagem: msg,
      })
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-12">
      {/* Cabeçalho de Gerenciamento */}
      <DependentesHeader
        totalCount={totalOriginal}
        termoBusca={termoBusca}
        onBuscaChange={setTermoBusca}
        apenasAtivos={apenasAtivos}
        onToggleApenasAtivos={setApenasAtivos}
        onNovoDependente={() => setModalCadastroAberto(true)}
      />

      {/* Mini Cards de Estatísticas por Categoria (quando houver dependentes) */}
      {!loading && dependentes.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400">Total Exibido</div>
              <div className="text-lg font-bold text-slate-800">{estatisticas.total}</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Baby className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400">Crianças</div>
              <div className="text-lg font-bold text-slate-800">{estatisticas.criancas}</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400">Idosos</div>
              <div className="text-lg font-bold text-slate-800">{estatisticas.idosos}</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Accessibility className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400">PcD / Especiais</div>
              <div className="text-lg font-bold text-slate-800">{estatisticas.pcd}</div>
            </div>
          </div>
        </div>
      )}

      {/* Grid de Cards ou Estado Vazio */}
      <DependentesGrid
        dependentes={dependentes}
        loading={loading}
        isBuscaAtiva={Boolean(termoBusca.trim())}
        onLimparBusca={() => setTermoBusca('')}
        onCadastrar={() => setModalCadastroAberto(true)}
        onVerProntuario={(dep) => setDependenteProntuario(dep)}
        onDesvincular={(dep) => setDependenteDesvincular(dep)}
      />

      {/* Modal de Cadastro Unificado */}
      <CadastroDependenteModal
        isOpen={modalCadastroAberto}
        cpfResponsavel={usuario?.cpf}
        onClose={() => setModalCadastroAberto(false)}
        onSuccess={handleSucessoCadastro}
        onCadastrar={cadastrarDependente}
      />

      {/* Modal de Confirmação de Desvinculação */}
      <ConfirmacaoDesvinculacaoModal
        isOpen={Boolean(dependenteDesvincular)}
        dependente={dependenteDesvincular}
        loading={submitting}
        onConfirm={handleConfirmarDesvinculacao}
        onClose={() => setDependenteDesvincular(null)}
      />

      {/* Drawer com Detalhes do Prontuário Clínico */}
      <ProntuarioDependenteDrawer
        isOpen={Boolean(dependenteProntuario)}
        dependente={dependenteProntuario}
        onClose={() => setDependenteProntuario(null)}
      />

      {/* Toast Notification */}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
