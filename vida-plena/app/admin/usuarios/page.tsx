"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { formatarCPF, limparCPF } from "@/app/lib/Formatters";
import Button from "@/app/components/Button";
import { adminService } from "@/app/services/adminService";
import { requisitarUsuario } from "@/app/types/admin";

export default function Usuarios() {
   const [busca, setBusca] = useState("");
   const [usuarioEncontrado, setUsuarioEncontrado] = useState(false);
   const [usuario, setUsuario] = useState<requisitarUsuario | null>(null);
   const [resultados, setResultados] = useState<string[]>([]);

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

      //TODO
      // setUsuario() Envia para o backend aqui e recebe os dados do usuário. Chamar pelo ID?
      //let usuarioTeste: requisitarUsuario | null = null;


      //setUsuario(adminService.buscarConta(cpf));
      //setUsuarioEncontrado(true);
   }

   return (
      <div className="gerenciar-usuarios-container"
         style={{
            border: "1px solid black", padding: "10px", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "20px",
            backgroundColor:"white", color:"black"
         }}>
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
                  backgroundColor:"", color:"black"
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
                     src={"/images/DefaultUserImage.png"}
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
                           <label>Data de Nascimento: </label>
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
                           <label>Senha: </label>
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
                        <Button onClick={() => adminService.desativarConta(usuario.cpf)}>Desativar</Button>
                     }
                     {usuario?.status === "INATIVO" &&
                        <Button onClick={() => adminService.ativarConta(usuario.cpf)}>Ativar</Button>
                     }
                     <Button variant="danger" onClick={() => adminService.bloquearConta(usuario.cpf)}>Bloquear</Button>
                     <Button variant="danger" onClick={() => adminService.excluirConta(usuario.cpf)}>Excluir</Button>
                  </div>
               </div>
            </div>}

      </div>
   )
}
