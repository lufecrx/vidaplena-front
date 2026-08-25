export type TipoUsuario =
  | 'ADMINISTRADOR'
  | 'GESTOR'
  | 'FINANCEIRO'
  | 'MEDICO'
  | 'NUTRICIONISTA'
  | 'PERSONAL_TRAINER'
  | 'FUNCIONARIO_ADMINISTRATIVO'
  | 'CUIDADOR'
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
   tipos: TipoUsuario[]
}

export interface Usuario {
   id: string
   nome: string
   cpf: string
   email: string
   telefone: string
   dataNascimento: string
   status: string
   tipos: TipoUsuario[]
}

export interface PaginaUsuariosResponse {
   content: Usuario[];
   pageable: {
      pageNumber: number;
      pageSize: number;
   };
   totalPages: number;
   totalElements: number;
}
