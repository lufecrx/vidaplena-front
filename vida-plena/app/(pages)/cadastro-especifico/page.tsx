'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useAuth } from '@/app/auth/Authcontext'
import { clinicaService, type Clinica } from '@/app/services/clinicaService'
import { pacienteService } from '@/app/services/pacienteService'
import { profissionalService, type Especialidade } from '@/app/services/profissionalService'
import { empresaService } from '@/app/services/empresaService'
import Button from '@/app/components/Button'
import { AuthPageLayout } from '@/app/components/auth/AuthPageLayout'

const especialidades: Especialidade[] = ['CLINICO_GERAL', 'CARDIOLOGIA', 'DERMATOLOGIA', 'GINECOLOGIA', 'PEDIATRIA', 'PSICOLOGIA', 'NUTRICAO', 'FISIOTERAPIA', 'ENFERMAGEM', 'ORTOPEDIA', 'OTOLOGIA', 'ODONTOLOGIA']
const tiposSanguineos = [
  { value: 'A_POSITIVO', label: 'A Positivo' },
  { value: 'A_NEGATIVO', label: 'A Negativo' },
  { value: 'B_POSITIVO', label: 'B Positivo' },
  { value: 'B_NEGATIVO', label: 'B Negativo' },
  { value: 'AB_POSITIVO', label: 'AB Positivo' },
  { value: 'AB_NEGATIVO', label: 'AB Negativo' },
  { value: 'O_POSITIVO', label: 'O Positivo' },
  { value: 'O_NEGATIVO', label: 'O Negativo' },
]

function isProfessional(tipo: string) {
  return ['MEDICO', 'PROFISSIONAL', 'NUTRICIONISTA', 'PERSONAL_TRAINER'].includes(tipo)
}

function isMissingRegistration(error: unknown) {
  return axios.isAxiosError(error) && [404, 422].includes(error.response?.status ?? 0)
}

export default function CadastroEspecificoPage() {
  const { usuario, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [clinicas, setClinicas] = useState<Clinica[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [professional, setProfessional] = useState({ registroConselho: '', especialidade: 'CLINICO_GERAL' as Especialidade, clinicaId: '' })
  const [patient, setPatient] = useState({ tipoSanguineo: '', alergias: '', medicamentosContinuos: '', historicoFamiliar: '' })
  const isProfessionalUser = usuario?.tipos.some(isProfessional) ?? false
  const isCompanyUser = usuario?.tipos.includes('REPRESENTANTE_EMPRESA') ?? false
  const isPatientUser = usuario?.tipos.includes('PACIENTE') ?? false

  useEffect(() => {
    if (authLoading) return
    if (!usuario) {
      router.replace('/login')
      return
    }
    const currentUser = usuario
    async function loadClinics() {
      try {
        if (isProfessionalUser) {
          const existingProfessional = await profissionalService.obterProfissionalPorUsuarioId(currentUser.id)
          if (existingProfessional) {
            router.replace('/profissionais/dashboard')
            return
          }
          setClinicas(await clinicaService.listarClinicas())
        } else if (isCompanyUser) {
          const existingCompany = await empresaService.obterEmpresaPorUsuarioId(currentUser.id)
          if (existingCompany) {
            router.replace('/empresa/dashboard')
            return
          }
        } else if (isPatientUser) {
          try {
            const existingPatient = await pacienteService.getPacientePorUsuarioId(currentUser.id)
            if (existingPatient) {
              router.replace('/paciente/dashboard')
              return
            }
          } catch (error) {
            if (!isMissingRegistration(error)) throw error
          }
        }
      } catch {
        setError('Não foi possível carregar as clínicas. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }

    loadClinics()
  }, [authLoading, isCompanyUser, isPatientUser, isProfessionalUser, router, usuario])

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!usuario) return
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      if (isProfessionalUser) {
        await profissionalService.cadastrarProfissional({ usuarioId: usuario.id, ...professional })
      } else if (isPatientUser) {
        const data = {
          usuarioId: usuario.id,
          tipoSanguineo: patient.tipoSanguineo,
          alergias: patient.alergias.split(',').map((item) => item.trim()).filter(Boolean),
          medicamentosContinuos: patient.medicamentosContinuos.split(',').map((item) => item.trim()).filter(Boolean),
          historicoFamiliar: patient.historicoFamiliar,
        }
        await pacienteService.cadastrarPaciente(data)
      } else if (isCompanyUser) {
        setError('O cadastro da empresa deve ser concluído pelo administrador da organização.')
        return
      }
      router.replace(isProfessionalUser ? '/profissionais/dashboard' : isCompanyUser ? '/empresa/dashboard' : '/paciente/dashboard')
    } catch {
      setError('Não foi possível salvar seus dados. Verifique os campos e tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || loading) return <div className="flex min-h-screen items-center justify-center bg-[#F3F6F1]">Carregando...</div>
  if (!usuario) return null

  return (
    <AuthPageLayout>
      <div className="w-full py-4">
        <div className="mb-6 flex items-center justify-between">
          <Button type="button" variant="transparent" size="sm" onClick={() => router.back()}>
            Voltar
          </Button>
          <span className="vp-mono text-[11px] uppercase tracking-[0.18em] text-vp-azul-700/70">
            Cadastro
          </span>
        </div>
        <div className="border-b border-slate-100 pb-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-vp-azul-700">VidaPlena</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Complete seu cadastro</h1>
          <p className="mt-2 text-sm text-slate-500">Essas informações ajudam a personalizar seu atendimento.</p>
        </div>
        {error && <p className="mt-5 rounded-lg bg-rose-50 p-3 text-sm text-rose-700" role="alert">{error}</p>}
        {success && <p className="mt-5 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700" role="status">{success}</p>}
        <form className="mt-6 space-y-5" onSubmit={save}>
          {isProfessionalUser ? (
            <>
              <label className="block text-sm font-semibold text-slate-700">Registro do conselho<input required value={professional.registroConselho} onChange={(event) => setProfessional({ ...professional, registroConselho: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-200 bg-white p-3 text-slate-800 outline-none transition focus:border-vp-azul-700 focus:ring-2 focus:ring-vp-azul-700/10" placeholder="CRM/BA 123456" /></label>
              <label className="block text-sm font-semibold text-slate-700">Especialidade<select required value={professional.especialidade} onChange={(event) => setProfessional({ ...professional, especialidade: event.target.value as Especialidade })} className="mt-2 w-full rounded-lg border border-slate-200 bg-white p-3 text-slate-800 outline-none transition focus:border-vp-azul-700 focus:ring-2 focus:ring-vp-azul-700/10">{especialidades.map((item) => <option key={item} value={item}>{item.replaceAll('_', ' ')}</option>)}</select></label>
              <label className="block text-sm font-semibold text-slate-700">Clínica<select required value={professional.clinicaId} onChange={(event) => setProfessional({ ...professional, clinicaId: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-200 bg-white p-3 text-slate-800 outline-none transition focus:border-vp-azul-700 focus:ring-2 focus:ring-vp-azul-700/10"><option value="">Selecione uma clínica</option>{clinicas.map((clinica) => <option key={clinica.id} value={clinica.id}>{clinica.nome}</option>)}</select></label>
            </>
          ) : isPatientUser ? (
            <>
              <label className="block text-sm font-semibold text-slate-700">Tipo sanguíneo<select required value={patient.tipoSanguineo} onChange={(event) => setPatient({ ...patient, tipoSanguineo: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-200 bg-white p-3 text-slate-800 outline-none transition focus:border-vp-azul-700 focus:ring-2 focus:ring-vp-azul-700/10"><option value="">Selecione seu tipo sanguíneo</option>{tiposSanguineos.map((tipo) => <option key={tipo.value} value={tipo.value}>{tipo.label}</option>)}</select></label>
              <label className="block text-sm font-semibold text-slate-700">Alergias<span className="mt-1 block text-xs font-normal text-slate-400">Separe os itens por vírgula.</span><input value={patient.alergias} onChange={(event) => setPatient({ ...patient, alergias: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-200 bg-white p-3 text-slate-800 outline-none transition focus:border-vp-azul-700 focus:ring-2 focus:ring-vp-azul-700/10" /></label>
              <label className="block text-sm font-semibold text-slate-700">Medicamentos contínuos<span className="mt-1 block text-xs font-normal text-slate-400">Separe os itens por vírgula.</span><input value={patient.medicamentosContinuos} onChange={(event) => setPatient({ ...patient, medicamentosContinuos: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-200 bg-white p-3 text-slate-800 outline-none transition focus:border-vp-azul-700 focus:ring-2 focus:ring-vp-azul-700/10" /></label>
              <label className="block text-sm font-semibold text-slate-700">Histórico familiar<textarea value={patient.historicoFamiliar} onChange={(event) => setPatient({ ...patient, historicoFamiliar: event.target.value })} className="mt-2 min-h-28 w-full rounded-lg border border-slate-200 bg-white p-3 text-slate-800 outline-none transition focus:border-vp-azul-700 focus:ring-2 focus:ring-vp-azul-700/10" /></label>
            </>
          ) : (
            <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
              O cadastro específico deste tipo de usuário é gerenciado pela organização.
            </p>
          )}
          <div className="flex justify-end gap-3">
            <Button type="submit" variant="primary" loading={saving} disabled={saving}>{saving ? 'Salvando...' : 'Salvar dados'}</Button>
          </div>
        </form>
      </div>
    </AuthPageLayout>
  )
}