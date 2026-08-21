import { useState, useCallback } from 'react'
import { profissionalService } from '../services/profissionalService'
import type { FiltrosProfissional, RetornaProfissional } from '../services/profissionalService'

export function useProfissionais() {
  const [profissionais, setProfissionais] = useState<RetornaProfissional[]>([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const buscar = useCallback(async (filtros?: FiltrosProfissional) => {
    setCarregando(true)
    setErro(null)
    try {
      const dados = await profissionalService.listarProfissionais(filtros)
      setProfissionais(dados)
    } catch(err) {
      console.error('Falha ao buscar profissionais:', err)
      setErro('Erro ao carregar profissionais')
    } finally {
      setCarregando(false)
    }
  }, [])

  return { profissionais, carregando, erro, buscar }
}
  