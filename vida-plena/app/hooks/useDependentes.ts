'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  DependenteResponseDTO,
  CadastroDependenteRequestDTO,
} from '../types/dependente'
import {
  dependenteService,
  extrairMensagemErro,
} from '../services/dependenteService'
import { limparCPF } from '../lib/Formatters'

export function useDependentes(responsavelId?: string) {
  const [dependentes, setDependentes] = useState<DependenteResponseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apenasAtivos, setApenasAtivos] = useState(true)
  const [termoBusca, setTermoBusca] = useState('')

  const carregarDependentes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await dependenteService.listarDependentes(
        apenasAtivos,
        responsavelId
      )
      setDependentes(data)
    } catch (err) {
      const msg = extrairMensagemErro(err, 'Erro ao carregar lista de dependentes.')
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [apenasAtivos, responsavelId])

  useEffect(() => {
    let ativo = true
    async function init() {
      try {
        setLoading(true)
        setError(null)
        const data = await dependenteService.listarDependentes(
          apenasAtivos,
          responsavelId
        )
        if (ativo) {
          setDependentes(data)
        }
      } catch (err) {
        if (ativo) {
          setError(extrairMensagemErro(err, 'Erro ao carregar lista de dependentes.'))
        }
      } finally {
        if (ativo) {
          setLoading(false)
        }
      }
    }
    init()
    return () => {
      ativo = false
    }
  }, [apenasAtivos, responsavelId])

  const cadastrar = useCallback(
    async (dados: CadastroDependenteRequestDTO): Promise<DependenteResponseDTO> => {
      setSubmitting(true)
      setError(null)
      try {
        const novo = await dependenteService.cadastrarDependente(dados)
        // Atualiza a lista em memória imediatamente (reatividade)
        setDependentes((prev) => [novo, ...prev])
        return novo
      } catch (err) {
        const msg = extrairMensagemErro(err, 'Falha ao cadastrar dependente.')
        setError(msg)
        throw new Error(msg)
      } finally {
        setSubmitting(false)
      }
    },
    []
  )

  const inativar = useCallback(
    async (vinculoId: string): Promise<void> => {
      setSubmitting(true)
      try {
        await dependenteService.inativarDependente(vinculoId)
        // Atualiza estado em memória
        if (apenasAtivos) {
          setDependentes((prev) => prev.filter((d) => d.vinculoId !== vinculoId))
        } else {
          setDependentes((prev) =>
            prev.map((d) =>
              d.vinculoId === vinculoId
                ? { ...d, dataFim: new Date().toISOString().split('T')[0] }
                : d
            )
          )
        }
      } catch (err) {
        const msg = extrairMensagemErro(err, 'Falha ao desvincular dependente.')
        setError(msg)
        throw new Error(msg)
      } finally {
        setSubmitting(false)
      }
    },
    [apenasAtivos]
  )

  // Filtragem combinada em memória por nome e CPF
  const dependentesFiltrados = useMemo(() => {
    if (!termoBusca.trim()) return dependentes
    const termo = termoBusca.toLowerCase().trim()
    const cpfBusca = limparCPF(termoBusca)

    return dependentes.filter((dep) => {
      const nomeMatch = dep.nome.toLowerCase().includes(termo)
      const cpfMatch = cpfBusca ? limparCPF(dep.cpf).includes(cpfBusca) : false
      return nomeMatch || cpfMatch
    })
  }, [dependentes, termoBusca])

  return {
    dependentes: dependentesFiltrados,
    totalOriginal: dependentes.length,
    loading,
    submitting,
    error,
    apenasAtivos,
    setApenasAtivos,
    termoBusca,
    setTermoBusca,
    recarregar: carregarDependentes,
    cadastrarDependente: cadastrar,
    inativarDependente: inativar,
  }
}
