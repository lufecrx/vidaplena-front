'use client'

import { useEffect, useState } from "react";
import { usuarioService } from "@/app/services/usuarioService";
//import { prontuarioService } from "@/app/services/prontuarioService";
//import { pacienteService } from "@/app/services/pacienteService";
import { Usuario } from "@/app/types/usuario";
//import { CriarProntuarioRequest } from "@/app/types/prontuario";          // Seria interessante um tipo Prontuario
//import { CriarPacienteRequest } from "@/app/types/paciente";              // Seria interessante um tipo Paciente
import { TextCard } from "@/app/components/Card";
import { TableCard } from '@/app/components/Card'

export default function PacienteDashboard() {

   const [user, setUser] = useState<Usuario | null>(null);
   //const [prontuario, setProntuario] = useState<CriarProntuarioRequest | null>(null);

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

   const pacienteTeste = {
      id: "123456-0987-654KDSA-230000",
      bloodType: "O Positivo",
      Alergias: ["amendoim", "camarão", "poeira"]
   }

   const colunasMedicamento = [
     { key: 'remedio', label: 'MEDICAMENTO' },
     { key: 'dosagem', label: 'DOSAGEM' },
     { key: 'frequencia', label: 'FREQUÊNCIA / VIA' },
     { key: 'duracao', label: 'DURAÇÃO' },
     { key: 'status', label: 'STATUS' },
   ]

   const dadosMedicamentos = [
     {
       remedio: 'Losartana Potássica',
       dosagem: '50mg',
       frequencia: '1x ao dia (Manhã) - Via Oral',
       duracao: 'Uso Contínuo',
       status: (
         <span className="inline-block rounded-md px-2.5 py-1 text-[11px] font-bold bg-emerald-100/80 text-emerald-800">
           Ativo
         </span>
       ),
     },
     {
       remedio: 'Metformina (Glucofage)',
       dosagem: '850mg',
       frequencia: '2x ao dia (Após refeições) - Via Oral',
       duracao: 'Uso Contínuo',
       status: (
         <span className="inline-block rounded-md px-2.5 py-1 text-[11px] font-bold bg-emerald-100/80 text-emerald-800">
           Ativo
         </span>
       ),
     },
     {
       remedio: 'Amoxicilina + Clavulanato',
       dosagem: '875mg + 125mg',
       frequencia: '8/8h (1 comprimido) - Via Oral',
       duracao: '7 dias (Finaliza em 12/05)',
       status: (
         <span className="inline-block rounded-md px-2.5 py-1 text-[11px] font-bold bg-blue-100/80 text-blue-800">
           Em curso
         </span>
       ),
     },
     {
       remedio: 'Dipirona Sódica',
       dosagem: '1g (500mg/ml - gotas)',
       frequencia: 'Se houver dor ou febre (Máx 6/6h)',
       duracao: 'Se necessário',
       status: (
         <span className="inline-block rounded-md px-2.5 py-1 text-[11px] font-bold bg-slate-100 text-slate-700">
           S.O.S.
         </span>
       ),
     },
     {
       remedio: 'Omeprazol',
       dosagem: '20mg',
       frequencia: '1x ao dia (Jejum) - Via Oral',
       duracao: 'Interrompido em 10/04',
       status: (
         <span className="inline-block rounded-md px-2.5 py-1 text-[11px] font-bold bg-rose-100/80 text-rose-800">
           Suspenso
         </span>
       ),
     },
   ]

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
            image={"/images/DefaultUserImage.png"}
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

         <div className="col-span-2">
            <TextCard
               title="Anamnese Médica. 12/05/2026 - Dr. Felipe Arthur"
               text={
                  <>


                     <div className="grid grid-cols-2 gap-6 mt-3">
                        <TextCard
                           title="Queixa Principal"
                           text={
                             <>
                               <p><strong>Sintoma:</strong> Cefaleia intensa (suspeita de enxaqueca).</p>
                               <p><strong>Duração:</strong> 3 dias.</p>
                               <p><strong>Padrão:</strong> Predomínio no período matutino.</p>
                             </>
                           }
                        />

                        <TableCard
                           title="Hábitos de Vida"
                           columns={[
                              { key: 'habito', label: 'HÁBITO' },
                              { key: 'descricao', label: 'DESCRIÇÃO / FREQUÊNCIA' },
                           ]}
                           data={[
                              { habito: 'Tabagismo', descricao: 'Ativo / Severo (20 cigarrinhos/dia)' },
                              { habito: 'Cafeína', descricao: 'Elevado (4 a 6 xícaras/dia)' },
                              { habito: 'Atividade Física', descricao: 'Sedentário' },
                              { habito: 'Etilismo', descricao: 'Social / Nega uso abusivo' },
                           ]}
                        />

                        <TextCard
                           title="Resumo Clínico"
                           text={
                             <>
                               <p className="font-semibold text-slate-700 mb-1">Histórico Familiar:</p>
                               <ul className="list-disc list-inside space-y-1 text-slate-600 mb-3">
                                 <li><strong>Pai (falecido, 62a):</strong> HAS, DM2 e DAC. Óbito por IAM.</li>
                                 <li><strong>Mãe (68a):</strong> Câncer de mama aos 54a (em remissão), dislipidemia.</li>
                                 <li><strong>Irmão (45a):</strong> Pré-diabetes e dislipidemia mista.</li>
                                 <li><strong>Avós Maternos:</strong> AVC Isquêmico (avô) e Alzheimer (avó).</li>
                               </ul>

                               <p className="font-semibold text-slate-700 mb-1">Síntese / Hipótese:</p>
                               <p className="text-slate-600">
                                 Risco cardiovascular aumentado (HAS/DM2/IAM em parente de 1º grau) e predisposição oncogenética (Ca de mama familiar).
                               </p>
                             </>
                           }
                        />

                        <TableCard
                           title="Medicamentos e Prescrições"
                           columns={colunasMedicamento}
                           data={dadosMedicamentos}
                        />
                     </div>
                  </>
               }
            />
         </div>

         <div className="col-span-2">
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
     </div>
   );
}
