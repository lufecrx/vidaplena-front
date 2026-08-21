"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatarCPF, limparCPF } from "@/app/lib/Formatters";
import { cpfValido, emailValido, dataValida, crmValido, crnValido, senhaValida } from "@/app/lib/Validation";
import { CriarUsuarioRequest, TipoUsuario } from "@/app/types/admin";
import { adminService } from "@/app/services/adminService";
import Button from "@/app/components/Button";

export default function CadastroUsuarios() {
   const router = useRouter();
   const [cpf, setCpf] = useState("");
   const [campoInvalido, showCampoInvalido] = useState({
      cpf: false,
      email: false,
      data: false,
      telefone: false,
      senha: false,
      crm: false,
      crn:false,
   });
   const [campoExtra, showCampoExtra] = useState({
      crm: false,
      crn: false,
   });

   const [erroCadastro, setErroCadastro] = useState<string | null>(null);
   const [isSubmitting, setIsSubmitting] = useState(false);

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
      const senhaInvalida = !senhaValida(String(dados.senha), String(dados.repetirSenha));
      const dataInvalida = !dataValida(dataNascimento);

      const crmInvalido = campoExtra.crm ? !crmValido(String(dados.crm)) : false;
      const crnInvalido = campoExtra.crn ? !crnValido(String(dados.crn)) : false;

      // TODO: Campo Telefone
      showCampoInvalido({
         email: emailInvalido,
         cpf: cpfInvalido,
         data: dataInvalida,
         senha: senhaInvalida,
         telefone: false,
         crm: crmInvalido,
         crn: crnInvalido,
      });

      if (emailInvalido || cpfInvalido || dataInvalida || senhaInvalida || crmInvalido || crnInvalido) {
         return;
      }

      enviarCadastro(dados);
   }

   async function enviarCadastro(dados: Record<string, FormDataEntryValue>) {

      const perfilSelecionado = String(dados.perfil) as TipoUsuario;

      const dadosUsuario: CriarUsuarioRequest = {
        nome: String(dados.nome),
        cpf: String(dados.cpf),
        email: String(dados.email),
        senha: String(dados.senha),
        telefone: String(dados.telefone),
        dataNascimento: String(dados.dataNascimento),
        tipos: [perfilSelecionado],
      }

      setIsSubmitting(true);
      setErroCadastro(null);

      try {
         await adminService.cadastrarUsuario(dadosUsuario);
         router.push("/admin/usuarios");
      } catch (error) {
         console.error("Erro ao cadastrar usuário:", error);
         setErroCadastro("Erro ao cadastrar usuário. Verifique os dados e se o CPF ou e-mail já estão cadastrados.");
      } finally {
         setIsSubmitting(false);
      }
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
               <label>Telefone:</label>
               <input name="telefone" type="text" placeholder="(99) 00000-0000"/>
               { campoInvalido.telefone && <span style={{ color: "red" }}>Telefone inválido.</span>}
            </div>
            <div className="cadastro-usuarios-campo-basico">
               <label>Senha:</label>
               <input name="senha" type="password" required />
               { campoInvalido.senha && <span style={{ color: "red" }}>Senha inválida.</span>}
            </div>
            <div className="cadastro-usuarios-campo-basico">
               <label>Repetir senha:</label>
               <input name="repetirSenha" type="password" required />
            </div>

            <div className="container-atribuir-perfil" style={{ display:"flex", flexDirection:"row", gap:"15px", flexWrap:"wrap" }}>
               <div className="campo-atribuir-perfil">
                  <input type="radio" name="perfil" id="paciente" value={"PACIENTE"} onChange={() => {showCampoExtra({ crm:false, crn:false,})}} required/>
                  <label htmlFor="paciente">paciente</label>
               </div>
               <div className="campo-atribuir-perfil">
                  <input type="radio" name="perfil" id="responsavel" value={"RESPONSAVEL"} onChange={() => {showCampoExtra({ crm:false, crn:false,})}} required/>
                  <label htmlFor="responsavel">responsavel</label>
               </div>
               <div className="campo-atribuir-perfil">
                  <input type="radio" name="perfil" id="medico" value={"MEDICO"} onChange={() => {showCampoExtra({ crm:true, crn:false,})}} required/>
                  <label htmlFor="medico">médico</label>
               </div>
               <div className="campo-atribuir-perfil">
                  <input type="radio" name="perfil" id="nutricionista" value={"NUTRICIONISTA"} onChange={() => {showCampoExtra({ crm:false, crn:true,})}} required/>
                  <label htmlFor="nutricionista">nutricionista</label>
               </div>
               <div className="campo-atribuir-perfil">
                  <input type="radio" name="perfil" id="administrador" value={"ADMINISTRADOR"} onChange={() => {showCampoExtra({ crm:false, crn:false,})}} required/>
                  <label htmlFor="administrador">administrador</label>
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

            {erroCadastro && (
               <div style={{ color: "red", textAlign: "center" }}>
                  {erroCadastro}
               </div>
            )}

            <div
               className="container-botoes-formulario-atribuir-perfil"
               style={{ display:"flex", justifyContent:"center", gap:"30px" }}
            >
               <Button
                  type="button"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
               >
                  Cancelar</Button>
               <Button
                  type="submit"
                  disabled={isSubmitting}
               >
                  {isSubmitting ? "Cadastrando..." : "Cadastrar"}
               </Button>
            </div>
         </form>
      </div>
   )
}
