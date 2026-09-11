import { api } from '../../api'

export interface EmpresaResponse {
  id: string
  usuarioId: string
  nome?: string
  cnpj?: string
}

export const empresaService = {
  async listarEmpresas(): Promise<EmpresaResponse[]> {
    const { data } = await api.get<EmpresaResponse[]>('/api/empresas')
    return data
  },

  async obterEmpresaPorUsuarioId(usuarioId: string): Promise<EmpresaResponse | null> {
    const empresas = await this.listarEmpresas()
    return empresas.find((empresa) => empresa.usuarioId === usuarioId) ?? null
  },
}
