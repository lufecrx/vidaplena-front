'use client'
import { useState } from 'react'
import { useProfissionais } from '../hooks/useProfissionais'
import BuscaProfissionais from '../components/BuscaProfissionais'
import TabelaProfissionais from '../components/TabelaProfissionais'
import type { FiltrosProfissional } from '../services/profissionalService'

export default function PaginaProfissionais() {
  const { profissionais, carregando, erro, buscar } = useProfissionais()

const [jaBuscou, setJaBuscou] = useState(false)

const handleBuscar = (filtros: FiltrosProfissional) => {
    setJaBuscou(true) 
    buscar(filtros)   
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Busca de Profissionais-Especialidade</h1>

     <BuscaProfissionais aoBuscar={handleBuscar} carregando={carregando} />

      {erro && <div className="text-red-500 mb-4" role="alert">{erro}</div>}

     {jaBuscou && (
        <TabelaProfissionais dados={profissionais} carregando={carregando} />
      )}
    </div>
  )
}