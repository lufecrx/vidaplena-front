import { api } from '../../api'
import { CriarPacienteRequest } from '../types/paciente';

export const pacienteService = {

   async cadastrarPaciente(dados: CriarPacienteRequest){
      const response = await api.post(`/api/pacientes`, dados);

      return response.data;
   },

   async getPacientePorUsuarioId(usuarioId: string) {
      const response = await api.get(`/api/v1/pacientes/usuario/${usuarioId}`);

      return response.data;
   },

   async getPaciente(pacienteId: string) {
      const response = await api.get(`/api/v1/pacientes/${pacienteId}`);

      return response.data;
   },

   async atualizarPaciente(pacienteId: string) {
      const response = await api.put(`/api/v1/pacientes/${pacienteId}`);

      return response.data;
   },

   async deletarPaciente(pacienteId: string) {
      const response = await api.delete(`/api/v1/pacientes/${pacienteId}`);

      return response.data;
   }
}
