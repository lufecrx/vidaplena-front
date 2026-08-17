export type TipoUsuario =
  | 'ADMINISTRADOR'
  | 'GESTOR'
  | 'FINANCEIRO'
  | 'MEDICO'
  | 'PROFISSIONAL'
  | 'RECEPCIONISTA'
  | 'PACIENTE'
  | 'RESPONSAVEL'
  | 'FARMACIA'
  | 'REPRESENTANTE_EMPRESA'

export interface CriarUsuarioRequest {
   nome: string
   cpf: string
   email: string
   senha: string
   telefone: string
   dataNascimento: string
}

export interface requisitarUsuario {
   id: string
   nome: string
   cpf: string
   email: string
   telefone: string
   dataNascimento: string
   status: string
   tipo: TipoUsuario[]
}
