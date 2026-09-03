'use client'

import { useEffect, useState } from "react";
//import { prontuarioService } from "@/app/services/prontuarioService";
import { usuarioService } from "@/app/services/usuarioService";
import { CriarProntuarioRequest } from "@/app/types/prontuario";
//import { pacienteService } from "@/app/services/pacienteService";
import { Usuario } from "@/app/types/usuario";
import { TextCard } from "@/app/components/Card";

export default function PacienteDashboard() {

   const [user, setUser] = useState<Usuario | null>(null);
   const [prontuario, setProntuario] = useState<CriarProntuarioRequest | null>(null);

   /*
   *  ---------------------- TODO: Para carregar os dados do banco de dados, atualmente com problema interno no backend.
   * ----------------------- PROBLEMA: Faltam dados nos campos do Paciente no BD, o que da erro na montagem da response JSON.
   * ----------------------- PROBLEMA: LazyException na Chamada do Prontuario através do ID do Paciente.
   * ----------------------- PROBLEMA: Tem 4 endpoints de Request, o único que retorna é o obterPorPacienteV1, mas da o LazyException citado acima.
   useEffect(() => {
      async function carregarDados() {
         try {
            const usuario = await usuarioService.getMeuPerfil();
            setUser(usuario);

            try {
               const paciente = await pacienteService.getPacientePorUsuarioId(usuario.id);

               if (paciente) {
                  const prontuario = await prontuarioService.obterPorPacienteV1(paciente.id);
                  setProntuario(prontuario);
               }

            } catch (error) {
               console.error('Erro ao carregar dados:', error);
            }


         } catch (error) {
            console.error('Erro ao carregar dados:', error);
         }
      }

      carregarDados();
   }, []);
   */

   /* Por falta de dados do BD */
   useEffect(() => {
      async function carregarDados() {
         try {
            const usuario = await usuarioService.getMeuPerfil();
            setUser(usuario);

         } catch (error) {
            console.error('Erro ao carregar dados:', error);
         }
      }

      carregarDados();
   }, []);

   /*
   const prontuarioTeste = {
      id: {user.i}
   }
   */

   if (!user || !prontuario) {
      return (
         <div>
            <TextCard title="Prontuário não encontrado." text="Ocorreu um erro no sistema. Por favor, tente novamente mais tarde." />
         </div>
      )
   }

   return (
      <div>
         <h1>Olá, {user.nome}</h1>

         {/* dados do prontuário */}
      </div>
   );
}
