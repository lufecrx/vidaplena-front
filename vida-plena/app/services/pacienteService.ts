import { api } from '../../api'
import type { AtualizarPacienteRequest, CriarPacienteRequest, PacienteResponse } from '../types/paciente';

// Todas as rotas de paciente usam o mesmo prefixo (sem /v1), conforme
// documentado no paciente-controller.
export const pacienteService = {

   async listarPacientes(): Promise<PacienteResponse[]> {
      const response = await api.get<PacienteResponse[]>(`/api/v1/pacientes`);

      return response.data;
   },

   async cadastrarPaciente(dados: CriarPacienteRequest) {
      const response = await api.post<PacienteResponse>(`/api/v1/pacientes`, dados);

      return response.data;
   },

   async getPacientePorUsuarioId(usuarioId: string): Promise<PacienteResponse | null> {
      const pacientes = await this.listarPacientes();

      return pacientes.find((paciente) => paciente.usuarioId === usuarioId) ?? null;
   },

   async getPaciente(pacienteId: string) {
      const response = await api.get<PacienteResponse>(`/api/v1/pacientes/${pacienteId}`);

      return response.data;
   },

   async atualizarPaciente(pacienteId: string, dados: AtualizarPacienteRequest) {
      const response = await api.put<PacienteResponse>(`/api/v1/pacientes/${pacienteId}`, dados);

      return response.data;
   },

   async deletarPaciente(pacienteId: string) {
      const response = await api.delete(`/api/v1/pacientes/${pacienteId}`);

      return response.data;
   }
}
