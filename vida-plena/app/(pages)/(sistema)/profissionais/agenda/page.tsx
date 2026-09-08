'use client'

import { useState } from 'react'
import Button from '@/app/components/Button'

type Horario = {
  inicio: string
  fim: string
}

type DiaAgenda = {
  ativo: boolean
  horarios: Horario[]
}

type AgendaState = {
  [key: string]: DiaAgenda
}

const DIAS_SEMANA = [
  { id: 'SEGUNDA', label: 'Segunda-feira' },
  { id: 'TERCA', label: 'Terça-feira' },
  { id: 'QUARTA', label: 'Quarta-feira' },
  { id: 'QUINTA', label: 'Quinta-feira' },
  { id: 'SEXTA', label: 'Sexta-feira' },
  { id: 'SABADO', label: 'Sábado' },
  { id: 'DOMINGO', label: 'Domingo' },
]

export default function AgendaPage() {
  const [agenda, setAgenda] = useState<AgendaState>(
    DIAS_SEMANA.reduce((acc, dia) => {
      acc[dia.id] = { ativo: false, horarios: [{ inicio: '', fim: '' }] }
      return acc
    }, {} as AgendaState)
  )

  const [loading, setLoading] = useState(false)

  const toggleDia = (diaId: string) => {
    setAgenda((prev) => ({
      ...prev,
      [diaId]: { ...prev[diaId], ativo: !prev[diaId].ativo },
    }))
  }

  const updateHorario = (diaId: string, index: number, campo: 'inicio' | 'fim', valor: string) => {
    setAgenda((prev) => {
      const novosHorarios = [...prev[diaId].horarios]
      novosHorarios[index][campo] = valor
      return { ...prev, [diaId]: { ...prev[diaId], horarios: novosHorarios } }
    })
  }

  const addHorario = (diaId: string) => {
    setAgenda((prev) => ({
      ...prev,
      [diaId]: {
        ...prev[diaId],
        horarios: [...prev[diaId].horarios, { inicio: '', fim: '' }],
      },
    }))
  }

  const removerHorario = (diaId: string, index: number) => {
    setAgenda((prev) => {
      const novosHorarios = prev[diaId].horarios.filter((_, i) => i !== index)
      return { ...prev, [diaId]: { ...prev[diaId], horarios: novosHorarios } }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = Object.entries(agenda)
      .filter(([, data]) => data.ativo)
      .flatMap(([dia, data]) =>
        data.horarios.map(h => ({
          diaDaSemana: dia,
          horaInicio: h.inicio,
          horaFim: h.fim
        }))
      )

    console.log('Payload pronto para envio:', payload)

    setTimeout(() => {
      alert('Agenda salva com sucesso!')
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      {}
      <div className="bg-brand-wellness rounded-t-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold">Minha Agenda</h2>
        <p className="mt-1 opacity-90">Configure seus dias e horários de atendimento clínico.</p>
      </div>

      <div className="bg-white rounded-b-2xl shadow-lg border border-t-0 border-gray-100 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {DIAS_SEMANA.map((dia) => (
              <div
                key={dia.id}
                className={`border rounded-xl p-5 transition-all duration-200 ${
                  agenda[dia.id].ativo ? 'border-vp-bem-estar bg-slate-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={agenda[dia.id].ativo}
                        onChange={() => toggleDia(dia.id)}
                      />
                      {}
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vp-bem-estar"></div>
                    </label>
                    {}
                    <span className={`text-lg font-semibold ${agenda[dia.id].ativo ? 'text-vp-azul-900' : 'text-gray-500'}`}>
                      {dia.label}
                    </span>
                  </div>
                </div>

                {agenda[dia.id].ativo && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                    {agenda[dia.id].horarios.map((horario, index) => (
                      <div key={index} className="flex flex-wrap items-end gap-4">
                        <div className="flex flex-col">
                          <label className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Início</label>
                          {}
                          <input
                            type="time"
                            value={horario.inicio}
                            onChange={(e) => updateHorario(dia.id, index, 'inicio', e.target.value)}
                            className="border border-gray-300 text-gray-700 p-2.5 rounded-lg focus:ring-2 focus:ring-vp-bem-estar outline-none transition-all bg-white"
                            required
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Fim</label>
                          <input
                            type="time"
                            value={horario.fim}
                            onChange={(e) => updateHorario(dia.id, index, 'fim', e.target.value)}
                            className="border border-gray-300 text-gray-700 p-2.5 rounded-lg focus:ring-2 focus:ring-vp-bem-estar outline-none transition-all bg-white"
                            required
                          />
                        </div>

                        {agenda[dia.id].horarios.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removerHorario(dia.id, index)}
                            className="p-2.5 text-vp-coral-500 hover:bg-red-50 rounded-lg transition-colors font-medium cursor-pointer"
                            title="Remover horário"
                          >
                            Remover
                          </button>
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addHorario(dia.id)}
                      className="text-sm text-vp-teal-700 hover:text-vp-azul-900 font-semibold mt-2 flex items-center gap-1 cursor-pointer"
                    >
                      + Adicionar turno (ex: tarde)
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-6 mt-6 border-t border-gray-100">
            {}
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Agenda'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
