import { api } from '../../api';
export type Especialidade = 
  | 'CLINICO_GERAL'
  | 'CARDIOLOGIA'
  | 'DERMATOLOGIA'
  | 'GINECOLOGIA'
  | 'PEDIATRIA'
  | 'PSICOLOGIA'
  | 'NUTRICAO'
  | 'FISIOTERAPIA'
  | 'ENFERMAGEM'
  | 'ORTOPEDIA'
  | 'OTOLOGIA'
  | 'ODONTOLOGIA';

export interface FiltrosProfissional{
    especialidade?:Especialidade;
    data?: string;
    clinicaId?: string;
    nome?: string;
}

export interface RetornaProfissional {
   id: string;
   usuarioId: string;
   nome?: string;
   registroConselho: string;
   especialidade: Especialidade;
   clinicaId: string;
}

export interface CadastrarProfissional {
   usuarioId: string;
   registroConselho: string;
   especialidade: Especialidade;
   clinicaId: string;
}

export type AtualizarProfissional = CadastrarProfissional;

export const profissionalService = {
      async obterProfissionalPorUsuarioId(usuarioId: string): Promise<RetornaProfissional | null> {
         const profissionais = await this.listarProfissionais();
         return profissionais.find((item) => item.usuarioId === usuarioId) ?? null;
      },

    async listarProfissionais(filtros?:FiltrosProfissional) : Promise<RetornaProfissional[]>{
      await new Promise(resolve => setTimeout(resolve, 1000)); //so pra vizualizar
      const response = await api.get('/api/v1/profissionais', { params: filtros });
        let dados = response.data;
        if (filtros && filtros.especialidade) {
            dados = dados.filter(
                (profissional: RetornaProfissional) => profissional.especialidade === filtros.especialidade
            );
        }

        return dados;
    },
    async obterProfissional(id: string): Promise<RetornaProfissional> {
   const response = await api.get(`/api/v1/profissionais/${id}`);
     return response.data;
    },
    async cadastrarProfissional(dados: CadastrarProfissional) {
      const { data } = await api.post('/api/v1/profissionais', dados);
      return data;
   },
   async atualizarProfissional(id: string, dados: AtualizarProfissional) {
      const response = await api.put(`/api/v1/profissionais/${id}`, dados);
      return response.data;
   },
   async excluirProfissional(id: string) {
      const result = await api.delete(`/api/v1/profissionais/${id}`);
      return result.data;
   }
};

