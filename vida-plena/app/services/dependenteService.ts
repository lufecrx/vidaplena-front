import { api } from '../../api'
import {
  CadastroDependenteRequestDTO,
  DependenteResponseDTO,
} from '../types/dependente'
import axios from 'axios'

export interface ApiErrorPayload {
  message?: string
  error?: string
  details?: string[]
  status?: number
}

export function extrairMensagemErro(error: unknown, fallback: string = 'Ocorreu um erro na requisição.'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorPayload | undefined
    if (data) {
      if (Array.isArray(data.details) && data.details.length > 0) {
        return data.details.join(' ')
      }
      if (data.message) {
        return data.message
      }
      if (data.error) {
        return data.error
      }
    }
    if (error.response?.status === 401) {
      return 'Sua sessão expirou. Faça login novamente para continuar.'
    }
    if (error.response?.status === 403) {
      return 'Você não possui permissão para executar esta ação.'
    }
    if (error.response?.status === 404) {
      const method = error.config?.method?.toUpperCase() || ''
      if (method === 'POST') {
        return 'Endpoint de cadastro não encontrado no servidor (HTTP 404).'
      }
      return 'Vínculo de dependência não encontrado.'
    }
    if (error.message) {
      return error.message
    }
  }
  if (error instanceof Error) {
    return error.message
  }
  return fallback
}

export const dependenteService = {
  /**
   * Lista todos os dependentes vinculados ao responsável autenticado.
   * Suporta filtro por apenas ativos (vigentes) ou histórico completo.
   */
  async listarDependentes(
    apenasAtivos: boolean = true,
    responsavelId?: string
  ): Promise<DependenteResponseDTO[]> {
    const params = new URLSearchParams()
    params.set('apenasAtivos', String(apenasAtivos))
    if (responsavelId) {
      params.set('responsavelId', responsavelId)
    }

    const response = await api.get<DependenteResponseDTO[]>(
      `/api/v1/dependentes?${params.toString()}`
    )
    return response.data
  },

  /**
   * Realiza o cadastro atômico e unificado do dependente e criação do vínculo.
   */
  async cadastrarDependente(
    dados: CadastroDependenteRequestDTO
  ): Promise<DependenteResponseDTO> {
    const response = await api.post<DependenteResponseDTO>(
      '/api/v1/dependentes',
      dados
    )
    return response.data
  },

  /**
   * Obtém os detalhes consolidados (vínculo, usuário e prontuário) pelo ID do vínculo.
   */
  async obterDependente(vinculoId: string): Promise<DependenteResponseDTO> {
    const response = await api.get<DependenteResponseDTO>(
      `/api/v1/dependentes/${vinculoId}`
    )
    return response.data
  },

  /**
   * Inativa o vínculo de dependência (marca data de término/soft delete).
   */
  async inativarDependente(vinculoId: string): Promise<void> {
    await api.delete(`/api/v1/dependentes/${vinculoId}`)
  },
}
