import { api } from '../../api'
import type { CriarUsuarioRequest, Usuario, PaginaUsuariosResponse } from '../types/admin'

export const adminService = {

   async buscarConta(cpf: string): Promise<Usuario> {
      const response = await api.get(`/api/v1/usuarios/cpf/${cpf}`);

      return response.data;
   },

   async listarUsuarios(page = 0, size = 50, sort = "nome,ASC"): Promise<PaginaUsuariosResponse> {
      const response = await api.get("/api/v1/usuarios", {
         params: {
            page,
            size,
            sort,
         },
      });
      return response.data;
   },

   async cadastrarUsuario(dados: CriarUsuarioRequest) {
      const { data } = await api.post('/api/v1/usuarios', dados)
      return data;
   },

   async excluirConta(usuarioId: string) {
      const result = await api.delete(`/api/v1/usuarios/${usuarioId}`)

      return result.data.message;
   },

   async ativarConta(usuarioId: string) {
      const response = await api.patch(`/api/v1/usuarios/${usuarioId}/status`,
         {
            status: "ATIVO",
         })

      return response.data;
   },

   async desativarConta(usuarioId: string) {
      const response = await api.patch(`/api/v1/usuarios/${usuarioId}/status`,
         {
            status: "INATIVO",
         })

      return response.data;
   },

   async bloquearConta(usuarioId: string) {
      const response = await api.patch(`/api/v1/usuarios/${usuarioId}/status`,
         {
            status: "BLOQUEADO",
         })

      return response.data;
   }

}
