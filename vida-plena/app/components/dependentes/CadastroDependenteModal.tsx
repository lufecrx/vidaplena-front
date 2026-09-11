'use client'

import React, { useState, useEffect } from 'react'
import {
  X,
  Baby,
  Heart,
  Accessibility,
  Droplet,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Plus,
  ArrowRight,
  ArrowLeft,
  Check,
  User,
  Activity,
  KeyRound,
} from 'lucide-react'
import {
  TipoDependencia,
  TipoSanguineo,
  TIPO_SANGUINEO_MAP,
  CadastroDependenteRequestDTO,
  DependenteResponseDTO,
} from '../../types/dependente'
import {
  formatarCPF,
  formatarTelefone,
  limparCPF,
  limparTelefone,
} from '../../lib/Formatters'
import {
  calcularIdade,
  formatarIdadeTexto,
  sugerirTipoPorIdade,
  validarCompatibilidadeTipoIdade,
  validarFormularioDependente,
  ErrosValidacaoDependente,
} from '../../lib/dependenteValidator'
import Button from '../Button'

interface CadastroDependenteModalProps {
  isOpen: boolean
  cpfResponsavel?: string
  onClose: () => void
  onSuccess: (novo: DependenteResponseDTO) => void
  onCadastrar: (dados: CadastroDependenteRequestDTO) => Promise<DependenteResponseDTO>
}

type TabStep = 'basicos' | 'clinicos' | 'acesso'

export function CadastroDependenteModal({
  isOpen,
  cpfResponsavel,
  onClose,
  onSuccess,
  onCadastrar,
}: CadastroDependenteModalProps) {
  // Step de visualização
  const [currentStep, setCurrentStep] = useState<TabStep>('basicos')

  // Step 1: Dados Pessoais
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [tipo, setTipo] = useState<TipoDependencia>('CRIANCA')
  const [tipoAlteradoManualmente, setTipoAlteradoManualmente] = useState(false)
  const [dataInicio, setDataInicio] = useState(
    new Date().toISOString().split('T')[0]
  )

  // Step 2: Dados Clínicos
  const [tipoSanguineoSelecionado, setTipoSanguineoSelecionado] = useState<string>('')
  const [alergias, setAlergias] = useState<string[]>([])
  const [novaAlergia, setNovaAlergia] = useState('')
  const [medicamentosContinuos, setMedicamentosContinuos] = useState<string[]>([])
  const [novoMedicamento, setNovoMedicamento] = useState('')
  const [historicoFamiliar, setHistoricoFamiliar] = useState('')

  // Step 3 / Accordion: Opcionais de Acesso
  const [expandirAcesso, setExpandirAcesso] = useState(false)
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')

  // Estados de Controle
  const [erros, setErros] = useState<ErrosValidacaoDependente>({})
  const [erroApi, setErroApi] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Recalcula idade reativamente
  const idadeCalculada = dataNascimento ? calcularIdade(dataNascimento) : null
  const idadeTexto = dataNascimento ? formatarIdadeTexto(dataNascimento) : null
  const avisoCompatibilidade =
    idadeCalculada !== null
      ? validarCompatibilidadeTipoIdade(tipo, idadeCalculada)
      : { valido: true }

  function limparTudo() {
    setCurrentStep('basicos')
    setNome('')
    setCpf('')
    setDataNascimento('')
    setTipo('CRIANCA')
    setTipoAlteradoManualmente(false)
    setDataInicio(new Date().toISOString().split('T')[0])
    setTipoSanguineoSelecionado('')
    setAlergias([])
    setNovaAlergia('')
    setMedicamentosContinuos([])
    setNovoMedicamento('')
    setHistoricoFamiliar('')
    setExpandirAcesso(false)
    setEmail('')
    setTelefone('')
    setErros({})
    setErroApi(null)
    setIsSubmitting(false)
  }

  function handleClose() {
    limparTudo()
    onClose()
  }

  if (!isOpen) return null

  // Mudança da Data de Nascimento: Auto-sugestão reativa de tipo
  function handleDataNascimentoChange(valor: string) {
    setDataNascimento(valor)
    setErros((prev) => ({ ...prev, dataNascimento: undefined, tipo: undefined }))

    if (valor) {
      const idade = calcularIdade(valor)
      if (!tipoAlteradoManualmente) {
        const sugerido = sugerirTipoPorIdade(idade)
        setTipo(sugerido)
      }
    }
  }

  // Tags de Alergia
  function adicionarAlergia() {
    const item = novaAlergia.trim()
    if (!item) return
    // Suporta digitação separada por vírgula
    const partes = item.split(',').map((p) => p.trim()).filter(Boolean)
    const unicas = partes.filter((p) => !alergias.includes(p))
    if (unicas.length > 0) {
      setAlergias((prev) => [...prev, ...unicas])
    }
    setNovaAlergia('')
  }

  function removerAlergia(index: number) {
    setAlergias((prev) => prev.filter((_, i) => i !== index))
  }

  // Tags de Medicamento
  function adicionarMedicamento() {
    const item = novoMedicamento.trim()
    if (!item) return
    const partes = item.split(',').map((p) => p.trim()).filter(Boolean)
    const unicas = partes.filter((p) => !medicamentosContinuos.includes(p))
    if (unicas.length > 0) {
      setMedicamentosContinuos((prev) => [...prev, ...unicas])
    }
    setNovoMedicamento('')
  }

  function removerMedicamento(index: number) {
    setMedicamentosContinuos((prev) => prev.filter((_, i) => i !== index))
  }

  // Validação do Step 1 antes de avançar
  function validarStep1(): boolean {
    const res = validarFormularioDependente(
      {
        nome,
        cpf,
        dataNascimento,
        tipo,
        dataInicio,
      },
      cpfResponsavel
    )

    // Filtra apenas erros dos campos do Step 1
    const errosStep1: ErrosValidacaoDependente = {}
    if (res.erros.nome) errosStep1.nome = res.erros.nome
    if (res.erros.cpf) errosStep1.cpf = res.erros.cpf
    if (res.erros.dataNascimento) errosStep1.dataNascimento = res.erros.dataNascimento
    if (res.erros.tipo) errosStep1.tipo = res.erros.tipo
    if (res.erros.dataInicio) errosStep1.dataInicio = res.erros.dataInicio

    setErros(errosStep1)
    return Object.keys(errosStep1).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErroApi(null)

    // Validação completa
    const res = validarFormularioDependente(
      {
        nome,
        cpf,
        dataNascimento,
        tipo,
        email,
        telefone,
        dataInicio,
      },
      cpfResponsavel
    )

    if (!res.valido) {
      setErros(res.erros)
      // Se o erro for de campos do step 1 e estivermos no step 2, volta para o 1
      if (res.erros.nome || res.erros.cpf || res.erros.dataNascimento || res.erros.tipo) {
        setCurrentStep('basicos')
      }
      return
    }

    const payload: CadastroDependenteRequestDTO = {
      nome: nome.replace(/\s+/g, ' ').trim(),
      cpf: limparCPF(cpf),
      dataNascimento,
      tipo,
      email: email.trim() || undefined,
      telefone: limparTelefone(telefone) || undefined,
      tipoSanguineo: tipoSanguineoSelecionado
        ? TIPO_SANGUINEO_MAP[tipoSanguineoSelecionado]
        : undefined,
      alergias: alergias.length > 0 ? alergias : undefined,
      medicamentosContinuos:
        medicamentosContinuos.length > 0 ? medicamentosContinuos : undefined,
      historicoFamiliar: historicoFamiliar.trim() || undefined,
      dataInicio: dataInicio || undefined,
    }

    setIsSubmitting(true)

    try {
      const novoDependente = await onCadastrar(payload)
      onSuccess(novoDependente)
      handleClose()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErroApi(err.message)
      } else {
        setErroApi('Ocorreu uma falha ao cadastrar o dependente.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 my-8 transition-all">
        {/* Topo / Cabeçalho */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Cadastrar Novo Dependente
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Vincule um familiar (criança, idoso ou pessoa sob seus cuidados) ao seu perfil.
            </p>
          </div>

          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Progresso / Steps */}
        <div className="flex items-center justify-between mt-4 mb-6 px-4">
          <button
            type="button"
            onClick={() => setCurrentStep('basicos')}
            className={`flex items-center gap-2 text-xs font-bold transition-colors ${
              currentStep === 'basicos'
                ? 'text-emerald-700'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                currentStep === 'basicos'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              1
            </div>
            <span>Dados Pessoais</span>
          </button>

          <div className="flex-1 mx-4 h-0.5 bg-slate-100" />

          <button
            type="button"
            onClick={() => {
              if (validarStep1()) setCurrentStep('clinicos')
            }}
            className={`flex items-center gap-2 text-xs font-bold transition-colors ${
              currentStep === 'clinicos'
                ? 'text-emerald-700'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                currentStep === 'clinicos'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              2
            </div>
            <span>Dados Clínicos & Acesso</span>
          </button>
        </div>

        {/* Alerta de Erro da API */}
        {erroApi && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{erroApi}</div>
          </div>
        )}

        {/* Formulário Principal */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ================================================================
              ETAPA 1: DADOS BÁSICOS
             ================================================================ */}
          {currentStep === 'basicos' && (
            <div className="space-y-4">
              {/* Nome Completo */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">
                  Nome Completo do Dependente: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: Lucas Gabriel da Silva"
                  value={nome}
                  onChange={(e) => {
                    setNome(e.target.value)
                    setErros((prev) => ({ ...prev, nome: undefined }))
                  }}
                  className={`rounded-xl border px-3.5 py-2 text-sm text-slate-800 outline-none transition-all ${
                    erros.nome
                      ? 'border-rose-400 bg-rose-50/40 focus:ring-2 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  }`}
                />
                {erros.nome && (
                  <span className="text-xs text-rose-600 font-medium">{erros.nome}</span>
                )}
              </div>

              {/* Grid CPF e Data de Nascimento */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* CPF */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">
                    CPF do Dependente: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    maxLength={14}
                    value={cpf}
                    onChange={(e) => {
                      setCpf(formatarCPF(e.target.value))
                      setErros((prev) => ({ ...prev, cpf: undefined }))
                    }}
                    className={`rounded-xl border px-3.5 py-2 text-sm text-slate-800 outline-none transition-all ${
                      erros.cpf
                        ? 'border-rose-400 bg-rose-50/40 focus:ring-2 focus:ring-rose-200'
                        : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    }`}
                  />
                  {erros.cpf && (
                    <span className="text-xs text-rose-600 font-medium">{erros.cpf}</span>
                  )}
                </div>

                {/* Data de Nascimento */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700">
                      Data de Nascimento: <span className="text-rose-500">*</span>
                    </label>
                    {idadeTexto && (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Idade: {idadeTexto}
                      </span>
                    )}
                  </div>
                  <input
                    type="date"
                    max={new Date().toISOString().split('T')[0]}
                    value={dataNascimento}
                    onChange={(e) => handleDataNascimentoChange(e.target.value)}
                    className={`rounded-xl border px-3.5 py-2 text-sm text-slate-800 outline-none transition-all ${
                      erros.dataNascimento
                        ? 'border-rose-400 bg-rose-50/40 focus:ring-2 focus:ring-rose-200'
                        : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    }`}
                  />
                  {erros.dataNascimento && (
                    <span className="text-xs text-rose-600 font-medium">
                      {erros.dataNascimento}
                    </span>
                  )}
                </div>
              </div>

              {/* Classificação / Categoria da Dependência */}
              <div className="flex flex-col gap-1.5 pt-1">
                <label className="text-xs font-semibold text-slate-700">
                  Classificação da Dependência: <span className="text-rose-500">*</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Card Criança */}
                  <label
                    onClick={() => {
                      setTipo('CRIANCA')
                      setTipoAlteradoManualmente(true)
                      setErros((prev) => ({ ...prev, tipo: undefined }))
                    }}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      tipo === 'CRIANCA'
                        ? 'border-rose-500 bg-rose-50/60 ring-2 ring-rose-500/20 shadow-sm'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tipoDependencia"
                      value="CRIANCA"
                      checked={tipo === 'CRIANCA'}
                      onChange={() => {}}
                      className="sr-only"
                    />
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                      <Baby className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Criança</div>
                      <div className="text-[10px] text-slate-500">&lt; 18 anos</div>
                    </div>
                  </label>

                  {/* Card Idoso */}
                  <label
                    onClick={() => {
                      setTipo('IDOSO')
                      setTipoAlteradoManualmente(true)
                      setErros((prev) => ({ ...prev, tipo: undefined }))
                    }}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      tipo === 'IDOSO'
                        ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20 shadow-sm'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tipoDependencia"
                      value="IDOSO"
                      checked={tipo === 'IDOSO'}
                      onChange={() => {}}
                      className="sr-only"
                    />
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                      <Heart className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Idoso</div>
                      <div className="text-[10px] text-slate-500">&ge; 60 anos</div>
                    </div>
                  </label>

                  {/* Card PcD */}
                  <label
                    onClick={() => {
                      setTipo('NECESSIDADE_ESPECIAL')
                      setTipoAlteradoManualmente(true)
                      setErros((prev) => ({ ...prev, tipo: undefined }))
                    }}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      tipo === 'NECESSIDADE_ESPECIAL'
                        ? 'border-purple-500 bg-purple-50/60 ring-2 ring-purple-500/20 shadow-sm'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tipoDependencia"
                      value="NECESSIDADE_ESPECIAL"
                      checked={tipo === 'NECESSIDADE_ESPECIAL'}
                      onChange={() => {}}
                      className="sr-only"
                    />
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                      <Accessibility className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">PcD / Especial</div>
                      <div className="text-[10px] text-slate-500">Qualquer idade</div>
                    </div>
                  </label>
                </div>

                {/* Alerta de Incompatibilidade de Idade em Tempo Real */}
                {!avisoCompatibilidade.valido && (
                  <div className="mt-1 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{avisoCompatibilidade.mensagem}</span>
                  </div>
                )}
                {erros.tipo && (
                  <span className="text-xs text-rose-600 font-medium">{erros.tipo}</span>
                )}
              </div>

              {/* Data de Início do Vínculo */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">
                  Data de Início da Vigência:
                </label>
                <input
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
                <span className="text-[11px] text-slate-400">
                  Padrão: data atual. Não é permitido data futura.
                </span>
              </div>
            </div>
          )}

          {/* ================================================================
              ETAPA 2: DADOS CLÍNICOS E OPCIONAIS DE ACESSO
             ================================================================ */}
          {currentStep === 'clinicos' && (
            <div className="space-y-4">
              {/* Tipo Sanguíneo */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Droplet className="w-3.5 h-3.5 text-rose-500" />
                  Tipo Sanguíneo (Opcional):
                </label>
                <select
                  value={tipoSanguineoSelecionado}
                  onChange={(e) => setTipoSanguineoSelecionado(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="">Não informado</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              {/* TagInput de Alergias */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Alergias Conhecidas (Opcional):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ex: Dipirona, Penicilina, Amendoim"
                    value={novaAlergia}
                    onChange={(e) => setNovaAlergia(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        adicionarAlergia()
                      }
                    }}
                    className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={adicionarAlergia}
                    className="shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar
                  </Button>
                </div>

                {/* Lista de Tags de Alergias */}
                {alergias.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {alergias.map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200"
                      >
                        {item}
                        <button
                          type="button"
                          onClick={() => removerAlergia(idx)}
                          className="hover:text-rose-600 rounded p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* TagInput de Medicamentos Contínuos */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Medicamentos de Uso Contínuo (Opcional):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ex: Insulina NPH 20UI, Losartana 50mg"
                    value={novoMedicamento}
                    onChange={(e) => setNovoMedicamento(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        adicionarMedicamento()
                      }
                    }}
                    className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={adicionarMedicamento}
                    className="shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar
                  </Button>
                </div>

                {/* Lista de Medicamentos */}
                {medicamentosContinuos.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {medicamentosContinuos.map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200"
                      >
                        {item}
                        <button
                          type="button"
                          onClick={() => removerMedicamento(idx)}
                          className="hover:text-rose-600 rounded p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Histórico Clínico Familiar */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">
                  Histórico Familiar e Observações Médicas (Opcional):
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Histórico paterno de hipertensão e asma."
                  value={historicoFamiliar}
                  onChange={(e) => setHistoricoFamiliar(e.target.value)}
                  className="rounded-xl border border-slate-200 p-3 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* ================================================================
                  ACCORDION: DADOS DE CONTATO E ACESSO (OPCIONAIS)
                 ================================================================ */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setExpandirAcesso(!expandirAcesso)}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-slate-500" />
                    <span className="text-xs font-bold text-slate-700">
                      Credenciais de Acesso e Contato Próprio (Opcional)
                    </span>
                  </div>
                  {expandirAcesso ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {expandirAcesso && (
                  <div className="p-4 mt-2 rounded-xl border border-slate-200 bg-white space-y-3">
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      💡 <strong>Dica:</strong> Para bebês, crianças ou idosos sob seus cuidados, o
                      sistema gera automaticamente credenciais internas seguras. Preencha apenas se
                      o dependente tiver e-mail ou telefone próprios para acesso.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-600">
                          E-mail do Dependente:
                        </label>
                        <input
                          type="email"
                          placeholder="dependente@email.com"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value)
                            setErros((prev) => ({ ...prev, email: undefined }))
                          }}
                          className={`rounded-xl border px-3.5 py-2 text-sm text-slate-800 outline-none transition-all ${
                            erros.email
                              ? 'border-rose-400 bg-rose-50/40'
                              : 'border-slate-200 focus:border-emerald-500'
                          }`}
                        />
                        {erros.email && (
                          <span className="text-xs text-rose-600 font-medium">
                            {erros.email}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-600">
                          Telefone do Dependente:
                        </label>
                        <input
                          type="text"
                          placeholder="(71) 99999-9999"
                          maxLength={15}
                          value={telefone}
                          onChange={(e) => {
                            setTelefone(formatarTelefone(e.target.value))
                            setErros((prev) => ({ ...prev, telefone: undefined }))
                          }}
                          className={`rounded-xl border px-3.5 py-2 text-sm text-slate-800 outline-none transition-all ${
                            erros.telefone
                              ? 'border-rose-400 bg-rose-50/40'
                              : 'border-slate-200 focus:border-emerald-500'
                          }`}
                        />
                        {erros.telefone && (
                          <span className="text-xs text-rose-600 font-medium">
                            {erros.telefone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Botões do Rodapé */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-6">
            {currentStep === 'clinicos' ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep('basicos')}
                disabled={isSubmitting}
                className="gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            )}

            {currentStep === 'basicos' ? (
              <Button
                type="button"
                onClick={() => {
                  if (validarStep1()) {
                    setCurrentStep('clinicos')
                  }
                }}
                className="gap-1.5"
              >
                <span>Próximo: Dados Clínicos</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
                className="gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{isSubmitting ? 'Salvando...' : 'Salvar Dependente'}</span>
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
