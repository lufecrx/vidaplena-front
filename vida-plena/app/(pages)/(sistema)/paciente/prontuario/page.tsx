'use client'

import { useEffect, useState } from "react";
import { usuarioService } from "@/app/services/usuarioService";
//import { prontuarioService } from "@/app/services/prontuarioService";
//import { pacienteService } from "@/app/services/pacienteService";
import { Usuario } from "@/app/types/usuario";
import { CriarProntuarioRequest } from "@/app/types/prontuario";          // Seria interessante um tipo Prontuario
import { CriarPacienteRequest } from "@/app/types/paciente";              // Seria interessante um tipo Paciente
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

   const prontuarioTeste = {
      id: `${ user?.id }`,
      observacoesIniciais: "Olho vermelho, formigamento e fadiga. Fortes sinais de dor e caganeira. Suspeitas de Chikungunya"
   }

   const pacienteTeste = {
      id: "123456-0987-654KDSA-230000",
      bloodType: "O Positivo",
      Alergias: ["amendoim", "camarão", "poeira"]
   }

   if (!user) {
      return (
         <div>
            <TextCard title="Prontuário não encontrado." text="Ocorreu um erro no sistema. Por favor, tente novamente mais tarde." />
         </div>
      )
   }

   return (
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 p-6 sm:grid-cols-2">

         <TextCard
            title="Dados do Paciente"
            text={
            <>
               Data de Nascimento: {user.dataNascimento} <br />
               Tipo Sanguíneo: {pacienteTeste.bloodType} <br />
               Alergias: {pacienteTeste.Alergias.join(", ")}
            </>
            }
         />

         <TextCard
            title="Consultas Recentes"
            text={
            <>
               <b>Consulta 12/05/2026</b> - Dr. Felipe Arthur <br />
               <b>Exame de vista 03/07/2026</b> - Dr. Cristina Arquilera
            </>
            }
         />

         <TextCard
            title="Resumo Clínico"
            text={
            <>
               <b>Histórico familiar:</b> <br />
               Lorem ipsum assum Lorem ipsum assum Lorem ipsum assum Lorem ipsum
               assum Lorem ipsum assum Lorem ipsum assum
               <br />
               <br />
               <b>Condição:</b> <br />
               Lorem ipsum assum Lorem ipsum assum Lorem ipsum assum Lorem ipsum
               assum Lorem ipsum assum
            </>
            }
         />

         <TextCard
            title="Medicamentos e Prescrições"
            text={
            <>
               <table>
                  <thead>
                  <tr>
                     <th>Remédio</th>
                     <th>Dosagem</th>
                     <th>Frequência</th>
                  </tr>
                  </thead>

                  <tbody>
                  <tr>
                     <td>Dipirona</td>
                     <td>500mg</td>
                     <td>1x dia</td>
                  </tr>
                  <tr>
                     <td>Paracetamol</td>
                     <td>750mg</td>
                     <td>2x dia</td>
                  </tr>
                  </tbody>
               </table>
            </>
            }
         />

         <TextCard
            title="Exames Recentes"
            text={
               <>
                  <b>Hemograma:</b> Lorem ipsum
                  <br />
                  <br />
                  <b>Ressonância:</b> Lorem ipsum assum
               </>
            }
         />

         <TextCard
            title="Documentos"
            text={
               <>
                  <b>Laudo médico:</b> <span className="text-blue-600 underline cursor-pointer">Visualizar</span>
                  <br />
                  <br />
                  <b>Ressonância:</b> <span className="text-blue-600 underline cursor-pointer">Visualizar</span>
               </>
            }
         />
     </div>
   );
}
