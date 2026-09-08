import { api } from '../../api'
import { AtualizarPacienteRequest, CriarPacienteRequest } from '../types/paciente';

// Todas as rotas de paciente usam o mesmo prefixo (sem /v1), conforme
// documentado no paciente-controller.
export const pacienteService = {

   async cadastrarPaciente(dados: CriarPacienteRequest) {
      const response = await api.post(`/api/pacientes`, dados);

      return response.data;
   },

   async getPacientePorUsuarioId(usuarioId: string) {
      const response = await api.get(`/api/pacientes/usuario/${usuarioId}`);

      return response.data;
   },

   async getPaciente(pacienteId: string) {
      const response = await api.get(`/api/pacientes/${pacienteId}`);

      return response.data;
   },

   async atualizarPaciente(pacienteId: string, dados: AtualizarPacienteRequest) {
      const response = await api.put(`/api/pacientes/${pacienteId}`, dados);

      return response.data;
   },

   async deletarPaciente(pacienteId: string) {
      const response = await api.delete(`/api/pacientes/${pacienteId}`);

      return response.data;
   }
}
