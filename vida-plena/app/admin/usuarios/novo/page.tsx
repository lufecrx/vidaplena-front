"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatarCPF, limparCPF } from "@/app/lib/Formatters";
import { cpfValido, emailValido } from "@/app/lib/Validation";
// TO DO: dar interação a respostas "erradas", mostrando ao usuario que errou.
// Adicionar um campo extra para opção como: cuidador, médico, nutricionista.
export default function CadastroUsuarios() {
   const router = useRouter();
   const [cpf, setCpf] = useState("");

   function modificaCPF(cpf: string) {

      cpf = formatarCPF(cpf);

      setCpf(cpf);
   }

   return (
      <div>
         <form className="formulario-cadastro-usuarios" onSubmit={validaFormulario}>
            <div className="cadastro-usuarios-campo-basico">
               <label>Nome:</label>
               <input name="nome" type="text" placeholder="Insira o nome" required/>
            </div>
            <div className="cadastro-usuarios-campo-basico">
               <label>E-mail:</label>
               <input name="email" type="email" placeholder="Insira o email" required/>
            </div>
            <div className="cadastro-usuarios-campo-basico">
               <label>CPF:</label>
               <input name="cpf" type="text" placeholder="000.000.000-00" maxLength={14} value={cpf} onChange={(event) => modificaCPF(event.target.value)} required/>
            </div>
            <div className="cadastro-usuarios-campo-basico">
               <label>Data de Nascimento:</label>
               <input name="dataNascimento" type="date" required />
            </div>
            <div className="cadastro-usuarios-campo-basico">
               <label>Senha:</label>
               <input name="senha" type="text" required />
            </div>
            <div className="cadastro-usuarios-campo-basico">
               <label>Repetir senha:</label>
               <input name="repetirSenha" type="text" required />
            </div>
            <div className="container-atribuir-perfil">
               <div className="campo-atribuir-perfil">
                  <input type="radio" name="perfil" id="paciente" value={1} required/>
                  <label htmlFor="paciente">paciente</label>
               </div>
               <div className="campo-atribuir-perfil">
                  <input type="radio" name="perfil" id="cuidador" value={2} />
                  <label htmlFor="cuidador">cuidador</label>
               </div>
               <div className="campo-atribuir-perfil">
                  <input type="radio" name="perfil" id="medico" value={3} />
                  <label htmlFor="medico">médico</label>
               </div>
               <div className="campo-atribuir-perfil">
                  <input type="radio" name="perfil" id="nutricionista" value={4} />
                  <label htmlFor="nutricionista">nutricionista</label>
               </div>
            </div>

            <div className="container-botoes-formulario-atribuir-perfil">
               <button
                  type="button"
                  onClick={() => router.back()}
               >
                  Cancelar</button>
               <button
                  type="submit"
               >
                  Cadastrar
               </button>
            </div>
         </form>
      </div>
   )
}


function validaFormulario(event: React.FormEvent<HTMLFormElement>) {
   event.preventDefault();

   const formData = new FormData(event.currentTarget);
   const dados = Object.fromEntries(formData.entries())

   const cpf = limparCPF(String(dados.cpf))

   if (!cpfValido(cpf)) {
      console.log("c");
      return;
   }

   if (!emailValido(String(dados.email))) {
      console.log("b");
      return;
   }

   if (dados.senha !== dados.repetirSenha) {
      console.log("a");
      return;
   }


   cadastrarUsuario(dados);
}
// TO DO: Testar o fetch e saber se ele fica aqui ou se deve ser movido.
async function cadastrarUsuario(dados: Record<string, FormDataEntryValue>) {
   await fetch("/api/v1/usuarios", {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
   });
}
