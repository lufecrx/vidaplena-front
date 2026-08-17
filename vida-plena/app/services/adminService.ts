import { api } from '../../api'
import type { CriarUsuarioRequest } from '../types/admin'

export const adminService = {

   async buscarConta(usuarioId: string) {
      const result = await api.get(`/api/v1/usuarios/${ usuarioId }`);

      return result;
   },

   async cadastrarUsuario(dados: CriarUsuarioRequest) {
      const { data } = await api.post('/api/v1/usuarios', dados)
      return data;
   },

   /*    TODO: NÃO TEM UM ENDPOINT REFERENTE A ISSO
   async excluirConta(usuarioId: string) {
      const result = await api.delete(`/api/v1/usuarios/${ usuarioId }/status`)

      return result;
   },
   */

   async ativarConta(usuarioId: string) {
      const result = await api.patch(`/api/v1/usuarios/${ usuarioId }/status`,
         {
            status: "ATIVO",
         })

      return result.data;
   },

   async desativarConta(usuarioId: string) {
      const result = await api.patch(`/api/v1/usuarios/${ usuarioId }/status`,
         {
            status: "INATIVO",
         })

      return result.data;
   },

   async bloquearConta(usuarioId: string) {
      const result = await api.patch(`/api/v1/usuarios/${ usuarioId }/status`,
         {
            status: "BLOQUEADO",
         })

      return result.data;
   }

}
