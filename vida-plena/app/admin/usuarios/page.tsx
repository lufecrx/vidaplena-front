"use client";


import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatarCPF, limparCPF } from "@/app/lib/Formatters";
import Button from "@/app/components/Button";
import { adminService } from "@/app/services/adminService";
import { Usuario } from "@/app/types/admin";

export default function Usuarios() {
   const router = useRouter();
   const [busca, setBusca] = useState("");
   const [usuario, setUsuario] = useState<Usuario | null>(null);
   const [resultados, setResultados] = useState<string[]>([]);

   async function pesquisarUsuarios(cpfDigitado: string) {
      const cpfLimpo = limparCPF(cpfDigitado);
      setBusca(cpfLimpo);

      if (!cpfLimpo) {
         setResultados([]);
         return;
      }

      try {
         const respostaPaginada = await adminService.listarUsuarios(0, 50);

         const cpfsFiltrados = respostaPaginada.content
            .map((usuario) => usuario.cpf)
            .filter((cpf) => cpf.startsWith(cpfLimpo));

         setResultados(cpfsFiltrados);
      } catch (error) {
         console.error("Erro ao pesquisar CPFs na API:", error);
         setResultados([]);
      }
   }

   async function buscarUsuario(cpf: string) {
      setBusca(cpf);
      setResultados([]);

      try {
         const usuarioTeste = await adminService.buscarConta(cpf);

         if (usuarioTeste) {
            setUsuario(usuarioTeste);
         }
      } catch (error) {
         console.error("Erro ao buscar usuário:", error);
      }
   }

   return (
      <div className="gerenciar-usuarios-container"
         style={{
            border: "1px solid black", padding: "10px", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "20px",
            backgroundColor:"white", color:"black"
         }}>
         <Button
            type="button"
            onClick={() => router.back()}
         >
            Cancelar</Button>
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
            {busca.length > 0 && resultados.length > 0 && (
               <ul style={{ listStyleType: "none", padding: 0 }}>
                  {resultados.map((busca) => (
                     <li key={busca} style={{ marginBottom: "8px" }}>
                        <Button onClick={() => buscarUsuario(busca)}>
                           {formatarCPF(busca)}
                        </Button>
                     </li>
                  ))}
               </ul>
            )}
         </div>


         { usuario &&
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
                           <label>Data de Nascimento:{ usuario?.dataNascimento } </label>
                        </div>
                     </div>
                     <div className="Secondary user-info">
                        <div className="campo-container">
                           <label>Perfil: { usuario?.tipos }</label>
                        </div>

                        {/*usuario?.tipo.includes("MEDICO") &&
                           <div className="campo-container">
                              <label>CRM: usuario?.crm</label>
                           </div>
                        */}

                        {/* IMPORTANTE: não existe usuario nutricionista
                           usuario?.tipos.includes("NUTRICIONISTA") &&
                           <div className="campo-container">
                              <label>CRN: usuario?.crn</label>
                           </div>
                        */}

                        <div className="campo-container">
                           <label>Id: { usuario?.id }</label>
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
                        <Button onClick={async () => {
                           await adminService.desativarConta(usuario.id);
                           await buscarUsuario(usuario.cpf);
                        }}>Desativar</Button>
                     }
                     {usuario?.status === "INATIVO" &&
                        <Button onClick={async () => {
                           await adminService.ativarConta(usuario.id);
                           await buscarUsuario(usuario.cpf);
                        }}>Ativar</Button>
                     }
                     <Button variant="danger" onClick={async () => {
                        await adminService.bloquearConta(usuario.id);
                        await buscarUsuario(usuario.cpf)
                     }}>Bloquear</Button>
                     <Button variant="danger" onClick={async () => {
                        await adminService.excluirConta(usuario.id);
                        // TODO: Confirmação após apertar botão.
                        setUsuario(null);
                     }}>Excluir</Button>
                  </div>
               </div>
            </div>}

      </div>
   )
}
