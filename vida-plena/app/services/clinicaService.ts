import { api } from '../../api'

export interface Clinica {
  id: string
  nome: string
  cnpj: string
  tipo: string
}

export const clinicaService = {
  async listarClinicas(): Promise<Clinica[]> {
    const { data } = await api.get<Clinica[]>('/api/v1/clinicas')
    return data
  },
}