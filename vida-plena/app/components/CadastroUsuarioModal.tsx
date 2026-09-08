"use client";

import { useState, useRef } from "react";
import { X } from "lucide-react";
import { formatarCPF, limparCPF, formatarTelefone, limparTelefone } from "@/app/lib/Formatters";
import {
  cpfValido,
  emailValido,
  dataValida,
  crmValido,
  crnValido,
  senhaValida,
  telefoneValido,
} from "@/app/lib/Validation";
import { CriarUsuarioRequest, TipoUsuario } from "@/app/types/usuario";
import { usuarioService } from "@/app/services/usuarioService";
import Button from "@/app/components/Button";

interface CadastroUsuarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CadastroUsuarioModal({
  isOpen,
  onClose,
  onSuccess,
}: CadastroUsuarioModalProps) {
  // Ref para resetar os inputs HTML não-controlados (Nome, Email, Senha, etc.)
  const formRef = useRef<HTMLFormElement>(null);

  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [campoInvalido, showCampoInvalido] = useState({
    cpf: false,
    email: false,
    data: false,
    telefone: false,
    senha: false,
    crm: false,
    crn: false,
  });
  const [campoExtra, showCampoExtra] = useState({
    crm: false,
    crn: false,
  });

  const [erroCadastro, setErroCadastro] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Zera estados + inputs HTML + mensagens de erro
  function limparFormulario() {
    formRef.current?.reset();
    setCpf("");
    setTelefone("");
    setErroCadastro(null);
    showCampoExtra({ crm: false, crn: false });
    showCampoInvalido({
      cpf: false,
      email: false,
      data: false,
      telefone: false,
      senha: false,
      crm: false,
      crn: false,
    });
  }

  // Intercepta o fechamento para garantir a limpeza prévia
  function handleClose() {
    limparFormulario();
    onClose();
  }

  if (!isOpen) return null;

  function modificaCPF(valor: string) {
    setCpf(formatarCPF(valor));
  }

  function modificaTelefone(valor: string) {
    setTelefone(formatarTelefone(valor));
  }

  function validaFormulario(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const dados = Object.fromEntries(formData.entries());

    const cpfLimpo = limparCPF(String(dados.cpf));
    const dataNascimento = String(dados.dataNascimento);
    const telefoneLimpo = limparTelefone(String(dados.telefone));

    const emailInvalido = !emailValido(String(dados.email));
    const cpfInvalido = !cpfValido(cpfLimpo);
    const senhaInvalida = !senhaValida(
      String(dados.senha),
      String(dados.repetirSenha)
    );
    const dataInvalida = !dataValida(dataNascimento);
    const telefoneInvalido = !telefoneValido(telefoneLimpo);

    const crmInvalido = campoExtra.crm ? !crmValido(String(dados.crm)) : false;
    const crnInvalido = campoExtra.crn ? !crnValido(String(dados.crn)) : false;

    showCampoInvalido({
      email: emailInvalido,
      cpf: cpfInvalido,
      data: dataInvalida,
      senha: senhaInvalida,
      telefone: telefoneInvalido,
      crm: crmInvalido,
      crn: crnInvalido,
    });

    if (
      emailInvalido ||
      cpfInvalido ||
      dataInvalida ||
      senhaInvalida ||
      telefoneInvalido ||
      crmInvalido ||
      crnInvalido
    ) {
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
    };

    setIsSubmitting(true);
    setErroCadastro(null);

    try {
      await usuarioService.cadastrarUsuario(dadosUsuario);
      onSuccess();
      handleClose(); // Limpa os dados e fecha
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      setErroCadastro(
        "Erro ao cadastrar usuário. Verifique os dados e se o CPF ou e-mail já estão cadastrados."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-100 p-6 transition-all my-8">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">
            Cadastrar Novo Usuário
          </h2>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form ref={formRef} onSubmit={validaFormulario} className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600">
              Nome Completo:
            </label>
            <input
              name="nome"
              type="text"
              placeholder="Insira o nome"
              required
              className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600">
                E-mail:
              </label>
              <input
                name="email"
                type="email"
                placeholder="Insira o email"
                required
                className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
              {campoInvalido.email && (
                <span className="text-xs text-red-500">E-mail inválido.</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600">
                CPF:
              </label>
              <input
                name="cpf"
                type="text"
                placeholder="000.000.000-00"
                maxLength={14}
                value={cpf}
                onChange={(e) => modificaCPF(e.target.value)}
                required
                className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
              {campoInvalido.cpf && (
                <span className="text-xs text-red-500">CPF inválido.</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600">
                Data de Nascimento:
              </label>
              <input
                name="dataNascimento"
                type="date"
                required
                className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
              {campoInvalido.data && (
                <span className="text-xs text-red-500">Data inválida.</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600">
                Telefone:
              </label>
              <input
                name="telefone"
                type="text"
                placeholder="(99) 00000-0000"
                value={telefone}
                maxLength={15}
                onChange={(e) => modificaTelefone(e.target.value)}
                className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
              {campoInvalido.telefone && (
                <span className="text-xs text-red-500">Telefone inválido.</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600">
                Senha:
              </label>
              <input
                name="senha"
                type="password"
                required
                className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
              {campoInvalido.senha && (
                <span className="text-xs text-red-500">Senha inválida.</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600">
                Repetir senha:
              </label>
              <input
                name="repetirSenha"
                type="password"
                required
                className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {/* Atribuir Perfil */}
          <div className="flex flex-col gap-1.5 mt-2">
            <label className="text-xs font-semibold text-slate-600">
              Perfil do Usuário:
            </label>
            <div className="flex flex-wrap gap-3 text-xs text-slate-700">
              {[
                { id: "paciente", value: "PACIENTE", label: "Paciente" },
                { id: "responsavel", value: "RESPONSAVEL", label: "Responsável" },
                { id: "medico", value: "MEDICO", label: "Médico", crm: true },
                { id: "nutricionista", value: "NUTRICIONISTA", label: "Nutricionista", crn: true },
                { id: "administrador", value: "ADMINISTRADOR", label: "Admin" },
              ].map((perfil) => (
                <label key={perfil.id} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="perfil"
                    id={perfil.id}
                    value={perfil.value}
                    required
                    onChange={() =>
                      showCampoExtra({
                        crm: !!perfil.crm,
                        crn: !!perfil.crn,
                      })
                    }
                    className="accent-emerald-600"
                  />
                  {perfil.label}
                </label>
              ))}
            </div>
          </div>

          {/* Campos condicionais */}
          {campoExtra.crm && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600">CRM:</label>
              <input
                type="text"
                name="crm"
                id="crm"
                required
                className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800 outline-none focus:border-emerald-500"
              />
              {campoInvalido.crm && (
                <span className="text-xs text-red-500">CRM inválido.</span>
              )}
            </div>
          )}

          {campoExtra.crn && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600">CRN:</label>
              <input
                type="text"
                name="crn"
                id="crn"
                required
                className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800 outline-none focus:border-emerald-500"
              />
              {campoInvalido.crn && (
                <span className="text-xs text-red-500">CRN inválido.</span>
              )}
            </div>
          )}

          {erroCadastro && (
            <div className="text-xs text-red-500 text-center font-medium">
              {erroCadastro}
            </div>
          )}

          {/* Botões */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
