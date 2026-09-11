export interface CriarPacienteRequest {
   usuarioId: string
   tipoSanguineo: string
   alergias: string[]
   medicamentosContinuos: string[]
   historicoFamiliar: string
}

export type AtualizarPacienteRequest = CriarPacienteRequest

export interface PacienteResponse extends CriarPacienteRequest {
   id: string
}
