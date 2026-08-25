'use client'

import { useEffect, useState } from "react";
import { prontuarioService } from "@/app/services/prontuarioService";
import { usuarioService } from "@/app/services/usuarioService";
import { CriarProntuarioRequest } from "@/app/types/prontuario";
import { Usuario } from "@/app/types/usuario";

export default function PacienteDashboard() {

   const [user, setUser] = useState<Usuario | null>(null);
   const [prontuario, setProntuario] = useState<CriarProntuarioRequest | null>(null);

   useEffect(() => {
      async function carregarDados() {
         try {
            const usuario = await usuarioService.getMeuPerfil();
            const prontuario = await prontuarioService.obterPorPaciente(usuario.id);

            setUser(usuario);
            setProntuario(prontuario);

         } catch (error) {
            console.error('Erro ao carregar dados:', error);
         }
      }

      carregarDados();
   }, []);


   if (!user || !prontuario) {
      console.log(user);
      console.log(prontuario);
      return <div>Carregando...</div>;
   }

   return (
      <div>
         <h1>Olá, {user.nome}</h1>

         {/* dados do prontuário */}
      </div>
   );
}
