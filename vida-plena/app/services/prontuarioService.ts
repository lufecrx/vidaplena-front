import { api } from '../../api'
import { CriarProntuarioRequest } from '../types/prontuario';


export const prontuarioService = {

   async obterProntuario(id:string) {
      const response = await api.get(`api/prontuario/${id}`);

      return response.data;
   },

   async obterPorPaciente(pacienteId:string) {
      const response = await api.get(`api/prontuarios/paciente/${pacienteId}`);

      return response.data;
   },

   async obterHistorico(pacienteId:string) {
      const response = await api.get(`api/prontuarios/paciente/${pacienteId}/historico`);

      return response.data;
   },

   async criarProntuario(dados: CriarProntuarioRequest){
      const response = await api.post(`/api/prontuarios`, dados);

      return response.data;
   }

}
