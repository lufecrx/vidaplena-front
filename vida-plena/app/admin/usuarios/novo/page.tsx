"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatarCPF, limparCPF } from "@/app/lib/Formatters";
import { cpfValido, emailValido, dataValida, crmValido, crnValido } from "@/app/lib/Validation";

import Button from "@/app/components/Button";
// TO DO: Cuidador precisa de que campo?
export default function CadastroUsuarios() {
   const router = useRouter();
   const [cpf, setCpf] = useState("");
   const [campoInvalido, showCampoInvalido] = useState({
      cpf: false,
      email: false,
      data: false,
      senha: false,
      crm: false,
      crn:false,
   });
   const [campoExtra, showCampoExtra] = useState({
      crm: false,
      crn: false,
   });

   function modificaCPF(cpf: string) {

      cpf = formatarCPF(cpf);

      setCpf(cpf);
   }

   function validaFormulario(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);
      const dados = Object.fromEntries(formData.entries())

      const cpf = limparCPF(String(dados.cpf))
      const dataNascimento = String(dados.dataNascimento)

      const emailInvalido = !emailValido(String(dados.email));
      const cpfInvalido = !cpfValido(cpf);
      const senhaInvalida = dados.senha !== dados.repetirSenha;
      const dataInvalida = !dataValida(dataNascimento);

      const crmInvalido = campoExtra.crm ? !crmValido(String(dados.crm)) : false;
      const crnInvalido = campoExtra.crn ? !crnValido(String(dados.crn)) : false;

      showCampoInvalido({
         email: emailInvalido,
         cpf: cpfInvalido,
         data: dataInvalida,
         senha: senhaInvalida,
         crm: crmInvalido,
         crn: crnInvalido,
      });

      if (emailInvalido || cpfInvalido || dataInvalida || senhaInvalida || crmInvalido || crnInvalido) {
         return;
      }

      cadastrarUsuario(dados);
   }

   return (
      <div>
         <form
            className="formulario-cadastro-usuarios" onSubmit={validaFormulario}
            style={{
               padding: "10px", border: "2px solid black", borderRadius: "10px", backgroundColor: "white",
               display:"flex", flexDirection:"column", gap:"20px"
            }}
         >
            <div className="cadastro-usuarios-campo-basico">
               <label>Nome:</label>
               <input name="nome" type="text" placeholder="Insira o nome" required/>
            </div>
            <div className="cadastro-usuarios-campo-basico">
               <label>E-mail:</label>
               <input name="email" type="email" placeholder="Insira o email" required />
               { campoInvalido.email && <span style={{ color: "red" }}>E-mail inválido.</span>}
            </div>
            <div className="cadastro-usuarios-campo-basico">
               <label>CPF:</label>
               <input name="cpf" type="text" placeholder="000.000.000-00" maxLength={14} value={cpf} onChange={(event) => modificaCPF(event.target.value)} required />
               { campoInvalido.cpf && <span style={{ color: "red" }}>Cpf inválido.</span>}
            </div>
            <div className="cadastro-usuarios-campo-basico">
               <label>Data de Nascimento:</label>
               <input name="dataNascimento" type="date" required />
               { campoInvalido.data && <span style={{ color: "red" }}>Data inválida.</span>}
            </div>
            <div className="cadastro-usuarios-campo-basico">
               <label>Senha:</label>
               <input name="senha" type="password" required />
               { campoInvalido.senha && <span style={{ color: "red" }}>Senhas diferentes.</span>}
            </div>
            <div className="cadastro-usuarios-campo-basico">
               <label>Repetir senha:</label>
               <input name="repetirSenha" type="password" required />
            </div>

            <div className="container-atribuir-perfil" style={{ display:"flex", flexDirection:"row", gap:"15px" }}>
               <div className="campo-atribuir-perfil">
                  <input type="radio" name="perfil" id="paciente" value={1} onChange={() => {showCampoExtra({ crm:false, crn:false,})}} required/>
                  <label htmlFor="paciente">paciente</label>
               </div>
               <div className="campo-atribuir-perfil">
                  <input type="radio" name="perfil" id="cuidador" value={2} onChange={() => {showCampoExtra({ crm:false, crn:false,})}} />
                  <label htmlFor="cuidador">cuidador</label>
               </div>
               <div className="campo-atribuir-perfil">
                  <input type="radio" name="perfil" id="medico" value={3} onChange={() => {showCampoExtra({ crm:true, crn:false,})}} />
                  <label htmlFor="medico">médico</label>
               </div>
               <div className="campo-atribuir-perfil">
                  <input type="radio" name="perfil" id="nutricionista" value={4} onChange={() => {showCampoExtra({ crm:false, crn:true,})}} />
                  <label htmlFor="nutricionista">nutricionista</label>
               </div>
            </div>

            {campoExtra.crm &&
               <div className="campo-extra-perfil">
                  <label htmlFor="crm">CRM:</label>
                  <input type="text" name="crm" id="crm" required/>
                  { campoInvalido.crm && <span style={{ color: "red" }}>CRM inválida.</span>}
               </div>
            }
            {campoExtra.crn &&
               <div className="campo-extra-perfil">
                  <label htmlFor="crn">CRN:</label>
                  <input type="text" name="crn" id="crn" required/>
                  { campoInvalido.crn && <span style={{ color: "red" }}>CRN inválida.</span>}
               </div>
            }

            <div
               className="container-botoes-formulario-atribuir-perfil"
               style={{ display:"flex", justifyContent:"center", gap:"30px" }}
            >
               <Button
                  type="button"
                  onClick={() => router.back()}
               >
                  Cancelar</Button>
               <Button
                  type="submit"
               >
                  Cadastrar
               </Button>
            </div>
         </form>
      </div>
   )
}

// TO DO: Testar o fetch e saber se ele fica aqui ou se deve ser movido.
async function cadastrarUsuario(dados: Record<string, FormDataEntryValue>) {

   console.log("sucesso");

   await fetch("/api/v1/usuarios", {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
   });
}
