'use client'
import { useState } from 'react'
import type { FiltrosProfissional } from '../services/profissionalService'
import Button from '@/app/components/Button'

interface BuscaProfissionaisProps {
  aoBuscar: (filtros: FiltrosProfissional) => void
  carregando: boolean
}

export default function BuscaProfissionais({ aoBuscar, carregando }: BuscaProfissionaisProps) {
  const [especialidade, setEspecialidade] = useState('')

  function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault()
    aoBuscar({ especialidade: especialidade ? especialidade as FiltrosProfissional['especialidade'] : undefined })
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 items-center mb-6">
      <div>
        <label htmlFor="especialidade" className="sr-only">Especialidade</label>
        <select
          id="especialidade"
          value={especialidade}
          onChange={(evento) => setEspecialidade(evento.target.value)}
          disabled={carregando}
          className="border p-2 rounded bg-white w-56"
        >
          <option value="">Todas as Especialidades</option>
          <option value="CARDIOLOGIA">Cardiologia</option>
          <option value="CLINICO_GERAL">Clínico Geral</option>
          <option value="DERMATOLOGIA">Dermatologia</option>
          <option value="ENFERMAGEM">Enfermagem</option>
          <option value="FISIOTERAPIA">Fisioterapia</option>
          <option value="GINECOLOGIA">Ginecologia</option>
          <option value="NUTRICAO">Nutrição</option>
          <option value="ODONTOLOGIA">Odontologia</option>
          <option value="ORTOPEDIA">Ortopedia</option>
          <option value="OTOLOGIA">Otologia</option>
          <option value="PEDIATRIA">Pediatria</option>
          <option value="PSICOLOGIA">Psicologia</option>
        </select>
      </div>
      
      <Button 
      type="submit" 
      disabled={carregando} 
      loading={carregando}
      variant="primary"
      size="md"
    >
      Buscar
    </Button>
    </form>
  )
}