import { api } from '../../api'
import { CriarProntuarioRequest } from '../types/prontuario';


export const prontuarioService = {

   async obterProntuario(id: string): Promise<CriarProntuarioRequest> {
      const response = await api.get(`/api/prontuarios/${id}`);

      return response.data;
   },

   async obterPorPaciente(pacienteId: string) {
      const response = await api.get(`/api/prontuarios/paciente/${pacienteId}`);

      return response.data;
   },

   // Único que retorna dado válido hoje — a rota sem /v1 acima ainda não
   // está confirmada no backend, mantida para quando estiver disponível.
   async obterPorPacienteV1(pacienteId: string) {
      const response = await api.get(`/api/v1/prontuarios/paciente/${pacienteId}`);

      return response.data;
   },

   async obterHistorico(pacienteId: string) {
      const response = await api.get(`/api/prontuarios/paciente/${pacienteId}/historico`);

      return response.data;
   },

   async criarProntuario(dados: CriarProntuarioRequest) {
      const response = await api.post(`/api/prontuarios`, dados);

      return response.data;
   }

}
