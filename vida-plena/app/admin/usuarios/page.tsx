"use client";

import Link from "next/link";
import { useState } from "react";
import { formatarCPF, limparCPF } from "@/app/lib/Formatters";

import Button from "@/app/components/Button";
import { UsuarioResponse } from "@/app/types/auth";
import Image from "next/image";

export default function Usuarios() {
   const [busca, setBusca] = useState("");
   const [usuarioEncontrado, setUsuarioEncontrado] = useState(false);
   const [usuario, setUsuario] = useState<UsuarioResponse | null>(null);
   const [resultados, setResultados] = useState<string[]>([]);

   // Objetos para teste
   // QUAIS SÃO AS CLASSES DO BANCO DE DADOS?
   // COMO PERFIL DEVE SER ENVIADO? STRING? INT?
   const CpfsParaTeste = [
      "12345678910",
      "11111111111",
      "12354312355",
      "34565487623",
      "98077857355",
      "44566674580",
      "78932455512",
      "65423312344",
   ];

   function pesquisarUsuarios(cpf: string) {

      const cpfLimpo = limparCPF(cpf);

      setBusca(cpfLimpo);

      const CpfsBuscados = CpfsParaTeste.filter((cpf) =>
         cpf.startsWith(cpfLimpo)
      );
      setResultados(CpfsBuscados);
   }

   function buscarUsuario(cpf: string) {

      setBusca(cpf);
      setResultados([]);

      // setUsuario() Envia para o backend aqui e recebe os dados do usuário. Chamar pelo ID?
      let usuarioTeste: UsuarioResponse | null = null;
      switch (cpf){
         case "12345678910":
            usuarioTeste = {
               id: "1",
               nome: "João da Silva",
               email: "joao@email.com",
               cpf: "12345678910",
               senha: 123,
               telefone: "75999999999",
               status: "ATIVO",
               tipos: ["MEDICO"],
               dataNascimento: "1985-06-15",
               dataCriacao: "2026-08-01",
            };
            break;

         case "11111111111":
            usuarioTeste = {
               id: "2",
               nome: "Maria Oliveira",
               email: "maria@email.com",
               cpf: "11111111111",
               telefone: "75988888888",
               senha: 123,
               status: "INATIVO",
               tipos: ["PACIENTE"],
               dataNascimento: "1992-03-22",
               dataCriacao: "2026-08-02",
            };
            break;

         case "12354312355":
            usuarioTeste = {
               id: "3",
               nome: "Carlos Santos",
               email: "carlos@email.com",
               cpf: "12354312355",
               telefone: "75977777777",
               senha: 123,
               status: "ATIVO",
               tipos: ["RECEPCIONISTA"],
               dataNascimento: "1978-11-10",
               dataCriacao: "2026-08-03",
            };
            break;

         case "34565487623":
            usuarioTeste = {
               id: "4",
               nome: "Ana Costa",
               email: "ana@email.com",
               cpf: "34565487623",
               telefone: "75966666666",
               senha: 123,
               status: "INATIVO",
               tipos: ["PACIENTE"],
               dataNascimento: "1988-07-05",
               dataCriacao: "2026-08-04",
            };
            break;

         default:
            console.log("Usuario não encontrado!");
            setUsuario(null);
            break;
      }

      setUsuario(usuarioTeste);
      setUsuarioEncontrado(true);
   }

   return (
      <div className="gerenciar-usuarios-container" style={{ border:"1px solid black", padding:"10px", borderRadius:"10px", display:"flex", flexDirection:"column", gap:"20px" }}>
         <Button>
            <Link href={"/admin/usuarios/novo"}>
               Cadastrar novo usuario
            </Link>
         </Button>
         <div className="container-busca-usuarios">
            <label>Digite o cpf de um usuário:</label>
            <input
               type="search"
               placeholder="Digite aqui..."
               value={formatarCPF(busca)}
               onChange={(event) => pesquisarUsuarios(event.target.value)}
               maxLength={14}
               style={{ border:"1px solid black", borderRadius:"4px", marginLeft:"4px" }}
            />
            {busca.length > 0 && (
               <div className="lista-resultados">
                  {resultados.map((busca) => (
                     <Button onClick={() => buscarUsuario(busca)} key={busca}>
                        {formatarCPF(busca)}
                     </Button>
                  ))}
               </div>
            )}
         </div>


         { usuarioEncontrado &&
            <div
               className="container-card-usuario"
               style={{
                  display: "flex", flexDirection: "row",
                  gap: "20px", border: "1.5px solid black",
                  borderRadius: "10px", padding: "10px",
                  backgroundColor:"", color:"white"
               }}
            >
               <div
                  className="profile-image-portrait"
                  style={{
                     width:"100px", height:"200px",
                     overflow:"hidden"
                  }}
               >
                  <Image
                     src={usuario?.fotoPerfil || "/images/DefaultUserImage.png"}
                     alt="User not found"
                     width={200}
                     height={200}
                     style={{
                        objectFit:"cover"
                     }}
                  />
               </div>
               <div className="card-usuario-info-container">
                  <div
                     className="user-profile-info-container"
                     style={{ display:"flex", justifyContent:"space-between", gap:"50px" }}
                  >
                     <div className="Principal user-info">
                        <div className="campo-container">
                           <label>Nome: {usuario?.nome}</label>
                        </div>
                        <div className="campo-container">
                           <label>E-mail: {usuario?.email}</label>
                        </div>
                        <div className="campo-container">
                           <label>CPF: {usuario?.cpf}</label>
                        </div>
                        <div className="campo-container">
                           <label>Data de Nascimento: {usuario?.dataNascimento}</label>
                        </div>
                     </div>
                     <div className="Secondary user-info">
                        <div className="campo-container">
                           <label>Perfil: </label>
                        </div>
                        {usuario?.tipos.includes("MEDICO") &&
                           <div className="campo-container">
                              <label>CRM: usuario?.crm</label>
                           </div>
                        }

                        {/* IMPORTANTE: não existe usuario nutricionista
                           usuario?.tipos.includes("NUTRICIONISTA") &&
                           <div className="campo-container">
                              <label>CRN: usuario?.crn</label>
                           </div>
                        */}

                        <div className="campo-container">
                           <label>Senha: {usuario?.senha}</label>
                        </div>

                        <div className="campo-container">
                           <label>Telefone: {usuario?.telefone}</label>
                        </div>
                        <div className="campo-container">
                           <label>Status: {usuario?.status}</label>
                        </div>
                     </div>
                  </div>
                  <div className="Admin-buttons" style={{ display:"flex", flexDirection:"row", gap:"20px" }}>
                     {usuario?.status === "ATIVO" &&
                        <Button>Inativar</Button>
                     }
                     {usuario?.status === "INATIVO" &&
                        <Button>Ativar</Button>
                     }
                     <Button variant="danger" >Excluir</Button>
                  </div>
               </div>
            </div>}

      </div>
   )
}
