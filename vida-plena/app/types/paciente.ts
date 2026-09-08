export interface CriarPacienteRequest {
   tipoSanguineo: string
   alergias: string[]
   medicamentosContinuos: string[]
   historicoFamiliar: string
}

export type AtualizarPacienteRequest = Partial<CriarPacienteRequest>
