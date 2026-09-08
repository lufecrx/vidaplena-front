"use client";

import { useState, useEffect, useCallback } from "react";
import { formatarCPF, formatarData, formatarTelefone, limparCPF } from "@/app/lib/Formatters";
import { UsuariosCadastradosCard, TextCard } from "@/app/components/Card";
import { usuarioService } from "@/app/services/usuarioService";
import { PaginaUsuariosResponse, Usuario } from "@/app/types/usuario";
import Button from "@/app/components/Button";
import CadastroUsuarioModal from "@/app/components/CadastroUsuarioModal";

const PAGE_SIZE = 5;

export default function Usuarios() {
  const [busca, setBusca] = useState("");
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [paginaUsuarios, setPaginaUsuarios] = useState<PaginaUsuariosResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const carregarUsuarios = useCallback(async () => {
    try {
      setLoading(true);

      if (busca.trim() !== "") {
        const res = await usuarioService.listarUsuarios(0, 100);

        const listaFiltrada = res.content.filter((u) =>
          limparCPF(u.cpf).startsWith(busca)
        );

        const totalElements = listaFiltrada.length;
        const totalPages = Math.ceil(totalElements / PAGE_SIZE) || 1;

        const inicio = page * PAGE_SIZE;
        const conteudoPaginado = listaFiltrada.slice(inicio, inicio + PAGE_SIZE);

        setPaginaUsuarios({
          ...res,
          content: conteudoPaginado,
          totalElements,
          totalPages,
        });
      } else {
        const res = await usuarioService.listarUsuarios(page, PAGE_SIZE);
        setPaginaUsuarios(res);
      }
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
    } finally {
      setLoading(false);
    }
  }, [page, busca]);

  useEffect(() => {
    carregarUsuarios();                                // Minha IDE aponta um erro aqui, mas tem um useCallback que impede que ocorra na função
  }, [carregarUsuarios]);

  function handleBuscaChange(valorInput: string) {
    const cpfLimpo = limparCPF(valorInput);
    setBusca(cpfLimpo);
    setPage(0);
  }

  async function buscarDetalhesUsuario(cpf: string) {
    try {
      const usuarioEncontrado = await usuarioService.buscarConta(cpf);
      if (usuarioEncontrado) {
        setUsuario(usuarioEncontrado);
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes do usuário:", error);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">

      {/* 1. Busca por CPF */}
      <div className="col-span-1">
        <TextCard
          title="Buscar Usuário"
          text={
            <div className="flex flex-col gap-4 w-full mt-2">
              <div className="relative flex flex-col gap-1.5 w-full">
                <label className="text-xs font-medium text-slate-500">
                  Digite o CPF do usuário
                </label>

                <div className="relative w-full">
                  <input
                    type="search"
                    placeholder="000.000.000-00"
                    value={formatarCPF(busca)}
                    onChange={(event) => handleBuscaChange(event.target.value)}
                    maxLength={14}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div className="relative flex items-center my-1">
                <div className="grow border-t border-slate-100"></div>
              </div>

              {/* Botão para abrir o Modal */}
              <Button
                className="w-full justify-center gap-2"
                onClick={() => setIsModalOpen(true)}
              >
                Cadastrar novo usuário
              </Button>
            </div>
          }
        />
      </div>

      {/* 2. Detalhes do Usuário Selecionado */}
      <div className="col-span-1 lg:col-span-3">
        <TextCard
          image={usuario ? "/images/DefaultUserImage.png" : undefined}
          title={usuario ? usuario.nome : "Nenhum usuário selecionado"}
          text={
            <div className="flex flex-col justify-between w-full h-auto lg:h-[190px] transition-all">
              {!usuario ? (
                <div className="flex-1 flex items-center justify-center text-slate-400 font-normal italic text-sm">
                  Clique em um usuário na lista abaixo para ver os detalhes.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 gap-x-6 w-full text-sm pt-1">
                  <div className="flex flex-col">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                      E-mail
                    </span>
                    <span className="font-semibold text-slate-700 truncate">
                      {usuario.email || "-"}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                      Telefone
                    </span>
                    <span className="font-semibold text-slate-700">
                      {formatarTelefone(usuario.telefone) || "-"}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                      CPF
                    </span>
                    <span className="font-semibold text-slate-700">
                      {formatarCPF(usuario.cpf) || "-"}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                      Data de Nascimento
                    </span>
                    <span className="font-semibold text-slate-700">
                      {formatarData(usuario.dataNascimento) || "-"}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                      Perfil
                    </span>
                    <span className="font-semibold text-slate-700">
                      {Array.isArray(usuario.tipos)
                        ? usuario.tipos.join(", ")
                        : usuario.tipos || "-"}
                    </span>
                  </div>

                  <div className="flex flex-col items-start">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium mb-1">
                      Status
                    </span>
                    <span
                      className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                        usuario.status === "ATIVO"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {usuario.status}
                    </span>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3 w-full mt-auto">
                {usuario?.status === "ATIVO" && (
                  <Button
                    variant="outline"
                    onClick={async () => {
                      await usuarioService.desativarConta(usuario.id);
                      await buscarDetalhesUsuario(usuario.cpf);
                      await carregarUsuarios();
                    }}
                  >
                    Desativar
                  </Button>
                )}

                {usuario?.status === "INATIVO" && (
                  <Button
                    onClick={async () => {
                      await usuarioService.ativarConta(usuario.id);
                      await buscarDetalhesUsuario(usuario.cpf);
                      await carregarUsuarios();
                    }}
                  >
                    Ativar
                  </Button>
                )}

                {usuario && (
                  <Button
                    variant="danger"
                    onClick={async () => {
                      if (
                        confirm(
                          `Tem certeza que deseja excluir o usuário ${usuario.nome}?`
                        )
                      ) {
                        await usuarioService.excluirConta(usuario.id);
                        setUsuario(null);
                        await carregarUsuarios();
                      }
                    }}
                  >
                    Excluir
                  </Button>
                )}
              </div>
            </div>
          }
        />
      </div>

      {/* 3. Tabela de Usuários */}
      <div className="col-span-1 lg:col-span-4">
        <UsuariosCadastradosCard
          data={paginaUsuarios}
          loading={loading}
          currentPage={page}
          pageSize={PAGE_SIZE}
          onPageChange={(newPage) => setPage(newPage)}
          onSelectUser={(u) => setUsuario(u)}
        />
      </div>

      {/* Modal de Cadastro */}
      <CadastroUsuarioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => carregarUsuarios()}
      />
    </div>
  );
}
