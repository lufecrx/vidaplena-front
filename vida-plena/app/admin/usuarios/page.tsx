"use client";

import Link from "next/link";
import { useState } from "react";
import { formatarCPF, limparCPF } from "@/app/lib/Formatters";

export default function Usuarios() {
   const [busca, setBusca] = useState("");
   // TO DO: Enviar o cpfLimpo para o backend e receber uma lista de cpfs para mostrar na tela
   // ao clicar o admin pode "acessar" aquele perfil de usuário e gerenciar (inativar, ativa, excluir).
   function buscarUsuarios(cpf: string) {

      const cpfFormatado = formatarCPF(cpf);
      const cpfLimpo = limparCPF(cpf);

      setBusca(cpfFormatado);
      console.log("Buscando no lado do cliente:", cpfFormatado);

      console.log("Buscando no Banco de dados:", cpfLimpo);
   }

   return (
      <div>
         <Link href={"/admin/usuarios/novo"}>
            Cadastrar novo usuario
         </Link>
         <div className="container-busca-usuarios">
            <label>Digite o cpf de um usuário:</label>
            <input
               type="search"
               placeholder="Digite o CPF do usuário..."
               value={busca}
               onChange={(event) => buscarUsuarios(event.target.value)}
               maxLength={14}
            />
         </div>

      </div>
   )
}
