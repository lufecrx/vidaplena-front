'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/auth/Authcontext'
import { clinicaService, type Clinica } from '@/app/services/clinicaService'
import { pacienteService } from '@/app/services/pacienteService'
import { profissionalService, type Especialidade, type RetornaProfissional } from '@/app/services/profissionalService'
import Button from '@/app/components/Button'
import type { PacienteResponse } from '@/app/types/paciente'

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
const professionalTypes = ['MEDICO', 'PROFISSIONAL', 'NUTRICIONISTA', 'PERSONAL_TRAINER']
const passwordMinimumLength = 8
const validPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

export default function DadosPessoaisPage() {
  const { usuario, isLoading: authLoading, atualizarUsuario } = useAuth()
  const router = useRouter()
  const isProfessional = usuario?.tipos.some((tipo) => professionalTypes.includes(tipo)) ?? false
  const [clinicas, setClinicas] = useState<Clinica[]>([])
  const [specific, setSpecific] = useState<RetornaProfissional | PacienteResponse | null>(null)
  const [basic, setBasic] = useState({ nome: '', cpf: '', email: '', senha: '', telefone: '', dataNascimento: '', tipos: usuario?.tipos ?? [] })
  const [professional, setProfessional] = useState({ registroConselho: '', especialidade: 'CLINICO_GERAL' as Especialidade, clinicaId: '' })
  const [patient, setPatient] = useState({ tipoSanguineo: '', alergias: '', medicamentosContinuos: '', historicoFamiliar: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!usuario) {
      router.replace('/login')
      return
    }
    const currentUser = usuario

    async function load() {
      try {
        const [registration, availableClinics] = await Promise.all([
          isProfessional ? profissionalService.obterProfissionalPorUsuarioId(currentUser.id) : pacienteService.getPacientePorUsuarioId(currentUser.id),
          isProfessional ? clinicaService.listarClinicas() : Promise.resolve([]),
        ])
        setBasic({
          nome: currentUser.nome,
          cpf: currentUser.cpf,
          email: currentUser.email,
          senha: currentUser.senha ?? '',
          telefone: currentUser.telefone ?? '',
          dataNascimento: currentUser.dataNascimento,
          tipos: currentUser.tipos,
        })
        if (!registration) {
          router.replace('/cadastro-especifico')
          return
        }
        setSpecific(registration)
        setClinicas(availableClinics)
        if (isProfessional) {
          const value = registration as RetornaProfissional
          setProfessional({ registroConselho: value.registroConselho ?? '', especialidade: value.especialidade, clinicaId: value.clinicaId ?? '' })
        } else {
          const value = registration as PacienteResponse
          setPatient({ tipoSanguineo: value.tipoSanguineo ?? '', alergias: value.alergias?.join(', ') ?? '', medicamentosContinuos: value.medicamentosContinuos?.join(', ') ?? '', historicoFamiliar: value.historicoFamiliar ?? '' })
        }
      } catch {
        setError('Não foi possível carregar seus dados. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [authLoading, isProfessional, router, usuario])

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!usuario || !specific) return
    setSaving(true)
    setMessage(null)
    setError(null)
    if (!validPasswordPattern.test(basic.senha)) {
      setError('A senha deve ter no mínimo 8 caracteres, incluindo letra maiúscula, minúscula, número e símbolo.')
      setSaving(false)
      return
    }
    try {
      await atualizarUsuario({ ...basic })
      if (isProfessional) {
        const value = specific as RetornaProfissional
        await profissionalService.atualizarProfissional(specific.id, {
          usuarioId: value.usuarioId,
          ...professional,
        })
      } else {
        const value = specific as PacienteResponse
        await pacienteService.atualizarPaciente(specific.id, {
          usuarioId: value.usuarioId,
          tipoSanguineo: patient.tipoSanguineo,
          alergias: patient.alergias.split(',').map((item) => item.trim()).filter(Boolean),
          medicamentosContinuos: patient.medicamentosContinuos.split(',').map((item) => item.trim()).filter(Boolean),
          historicoFamiliar: patient.historicoFamiliar,
        })
      }
      setMessage('Dados atualizados com sucesso.')
    } catch {
      setError('Não foi possível atualizar seus dados. Verifique os campos e tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || loading) return <div className="flex min-h-screen items-center justify-center bg-[#F3F6F1]">Carregando...</div>
  if (!usuario) return null

  return (
    <main className="min-h-screen w-full flex-1 bg-[#F3F6F1] px-4 pb-8 pt-12 sm:px-8 sm:pt-16 lg:px-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-4 border-b border-vp-azul-900/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-vp-teal-700">VidaPlena / Configurações</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-vp-azul-900 sm:text-4xl">Meu perfil</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-vp-slate-500">Mantenha suas informações pessoais e de atendimento sempre atualizadas.</p>
          </div>
          <Button type="button" variant="underline" size="sm" onClick={() => router.back()}>Voltar</Button>
        </header>

        {error && <p className="rounded-xl border border-vp-coral-500/20 bg-rose-50 px-4 py-3 text-sm text-vp-coral-700" role="alert">{error}</p>}
        {message && <p className="rounded-xl border border-vp-verde-500/20 bg-emerald-50 px-4 py-3 text-sm text-vp-verde-700" role="status">{message}</p>}

        <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl border border-vp-azul-900/10 bg-brand-primary p-6 text-white shadow-lg shadow-vp-azul-900/10">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-white/15 text-3xl font-bold text-white shadow-inner shadow-white/10">
              {basic.nome.charAt(0).toUpperCase()}
            </div>
            <h2 className="mt-5 text-xl font-bold">{basic.nome || 'Seu perfil'}</h2>
            <p className="mt-1 break-words text-sm text-white/70">{basic.email}</p>
            <div className="mt-8 border-t border-white/15 pt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-white/60">Acesso</p>
              <label className="mt-3 block text-xs font-medium text-white/70">Senha
                <input type="password" required minLength={passwordMinimumLength} value={basic.senha} onChange={(event) => setBasic({ ...basic, senha: event.target.value })} className="mt-2 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white outline-none focus:border-white focus:ring-2 focus:ring-white/20" />
              </label>
              <p className="mt-2 text-xs text-white/60">Use 8 caracteres com maiúscula, minúscula, número e símbolo.</p>
            </div>
          </aside>

          <form className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-8" onSubmit={save}>
            <section>
              <div className="border-b border-slate-100 pb-4">
                <p className="text-xs font-bold uppercase tracking-wider text-vp-teal-700">Informações principais</p>
                <h2 className="mt-1 text-xl font-bold text-vp-azul-900">Dados pessoais</h2>
              </div>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-vp-slate-700 sm:col-span-2">Nome completo<input required value={basic.nome} onChange={(event) => setBasic({ ...basic, nome: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50/60 p-3 text-slate-800 outline-none transition focus:border-vp-azul-700 focus:bg-white focus:ring-2 focus:ring-vp-azul-700/10" /></label>
                <label className="block text-sm font-semibold text-vp-slate-700">CPF<input required value={basic.cpf} onChange={(event) => setBasic({ ...basic, cpf: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50/60 p-3 text-slate-800 outline-none transition focus:border-vp-azul-700 focus:bg-white focus:ring-2 focus:ring-vp-azul-700/10" /></label>
                <label className="block text-sm font-semibold text-vp-slate-700">E-mail<input required type="email" value={basic.email} onChange={(event) => setBasic({ ...basic, email: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50/60 p-3 text-slate-800 outline-none transition focus:border-vp-azul-700 focus:bg-white focus:ring-2 focus:ring-vp-azul-700/10" /></label>
                <label className="block text-sm font-semibold text-vp-slate-700">Telefone<input value={basic.telefone} onChange={(event) => setBasic({ ...basic, telefone: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50/60 p-3 text-slate-800 outline-none transition focus:border-vp-azul-700 focus:bg-white focus:ring-2 focus:ring-vp-azul-700/10" /></label>
                <label className="block text-sm font-semibold text-vp-slate-700">Data de nascimento<input required type="date" value={basic.dataNascimento} onChange={(event) => setBasic({ ...basic, dataNascimento: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50/60 p-3 text-slate-800 outline-none transition focus:border-vp-azul-700 focus:bg-white focus:ring-2 focus:ring-vp-azul-700/10" /></label>
              </div>
            </section>

            <section className="mt-8 border-t border-slate-100 pt-8">
              <div className="border-b border-slate-100 pb-4">
                <p className="text-xs font-bold uppercase tracking-wider text-vp-teal-700">Informações complementares</p>
                <h2 className="mt-1 text-xl font-bold text-vp-azul-900">{isProfessional ? 'Dados profissionais' : 'Dados de saúde'}</h2>
              </div>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {isProfessional ? <>
                  <label className="block text-sm font-semibold text-vp-slate-700">Registro do conselho<input required value={professional.registroConselho} onChange={(event) => setProfessional({ ...professional, registroConselho: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50/60 p-3 text-slate-800 outline-none transition focus:border-vp-azul-700 focus:bg-white focus:ring-2 focus:ring-vp-azul-700/10" /></label>
                  <label className="block text-sm font-semibold text-vp-slate-700">Especialidade<select required value={professional.especialidade} onChange={(event) => setProfessional({ ...professional, especialidade: event.target.value as Especialidade })} className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50/60 p-3 text-slate-800 outline-none transition focus:border-vp-azul-700 focus:bg-white focus:ring-2 focus:ring-vp-azul-700/10">{especialidades.map((item) => <option key={item} value={item}>{item.replaceAll('_', ' ')}</option>)}</select></label>
                  <label className="block text-sm font-semibold text-vp-slate-700 sm:col-span-2">Clínica<select required value={professional.clinicaId} onChange={(event) => setProfessional({ ...professional, clinicaId: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50/60 p-3 text-slate-800 outline-none transition focus:border-vp-azul-700 focus:bg-white focus:ring-2 focus:ring-vp-azul-700/10">{clinicas.map((clinica) => <option key={clinica.id} value={clinica.id}>{clinica.nome}</option>)}</select></label>
                </> : <>
                  <label className="block text-sm font-semibold text-vp-slate-700">Tipo sanguíneo<select required value={patient.tipoSanguineo} onChange={(event) => setPatient({ ...patient, tipoSanguineo: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50/60 p-3 text-slate-800 outline-none transition focus:border-vp-azul-700 focus:bg-white focus:ring-2 focus:ring-vp-azul-700/10"><option value="">Selecione seu tipo sanguíneo</option>{tiposSanguineos.map((tipo) => <option key={tipo.value} value={tipo.value}>{tipo.label}</option>)}</select></label>
                  <label className="block text-sm font-semibold text-vp-slate-700">Alergias<input value={patient.alergias} onChange={(event) => setPatient({ ...patient, alergias: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50/60 p-3 text-slate-800 outline-none transition focus:border-vp-azul-700 focus:bg-white focus:ring-2 focus:ring-vp-azul-700/10" /></label>
                  <label className="block text-sm font-semibold text-vp-slate-700 sm:col-span-2">Medicamentos contínuos<input value={patient.medicamentosContinuos} onChange={(event) => setPatient({ ...patient, medicamentosContinuos: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50/60 p-3 text-slate-800 outline-none transition focus:border-vp-azul-700 focus:bg-white focus:ring-2 focus:ring-vp-azul-700/10" /></label>
                  <label className="block text-sm font-semibold text-vp-slate-700 sm:col-span-2">Histórico familiar<textarea value={patient.historicoFamiliar} onChange={(event) => setPatient({ ...patient, historicoFamiliar: event.target.value })} className="mt-2 min-h-32 w-full rounded-lg border border-slate-200 bg-slate-50/60 p-3 text-slate-800 outline-none transition focus:border-vp-azul-700 focus:bg-white focus:ring-2 focus:ring-vp-azul-700/10" /></label>
                </>}
              </div>
            </section>

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
              <Button type="submit" variant="primary" loading={saving} disabled={saving}>{saving ? 'Salvando...' : 'Salvar alterações'}</Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}