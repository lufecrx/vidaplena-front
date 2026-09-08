'use client';

/*
*   ------------------------------  Card pequeno com texto ------------------------------
*/

import Image, { ImageProps } from 'next/image'
//import fotoDeUsuario from '@/public/images/DefaultUserImage.png'

interface TextCardProps {
   title?: string
   text: string | React.ReactElement
   image?: ImageProps["src"]
}

export function TextCard({
   title,
   text,
   image,
}: TextCardProps) {

   return (
      <div className="flex flex-row items-start rounded-2xl bg-white p-6 shadow-sm border border-slate-100/80 transition-all hover:shadow-md gap-6 w-full">

         {/* 1. Imagem na Esquerda */}
         {image && (
            <div className="shrink-0 overflow-hidden rounded-full border border-slate-100 shadow-sm">
               <Image
                  src={image}
                  alt={title || 'Foto do usuário'}
                  width={120}
                  height={120}
                  className="object-cover h-28 w-28"
               />
            </div>
         )}

         {/* 2. Coluna da Direita: Título no Topo + Dados Embaixo */}
         <div className="flex flex-col flex-1 gap-2 min-w-0">

            {/* Topo: Título */}
            {title && (
               <span className="text-2xl font-bold tracking-tight text-slate-900">
                  {title}
               </span>
            )}

            {/* Conteúdo Principal: Dados do Usuário */}
            <div className="text-sm font-medium text-slate-500 w-full mt-1">
               {text}
            </div>

         </div>

      </div>
   )
}



/*
*   ------------------------------  Card pequeno com dados de resumo ------------------------------
*/
import { TrendingUp, TrendingDown } from 'lucide-react'
import { IconPlaceholder } from './Icons'


interface StatCardProps {
  title: string
  value: string | number // O valor em Destaque é esse
  iconName: string // Nome do ícone para o IconPlaceholder
  trendValue?: string // ex: "+12%" ou "-5%"
  trendLabel?: string // ex: "vs. mês anterior"
  isPositive?: boolean // define se a seta e a porcentagem ficam verdes ou vermelhas
}

export function StatCard({
  title,
  value,
  iconName,
  trendValue,
  trendLabel = 'vs. mês anterior',
  isPositive = true,
}: StatCardProps) {
  const TrendIcon = isPositive ? TrendingUp : TrendingDown

  return (
    <div className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm border border-slate-100/80 transition-all hover:shadow-md">
      {/* Topo: Título e Ícone */}
      <div className="flex items-start justify-between gap-4">
        <span className="text-sm font-semibold text-slate-500">{title}</span>

        {/* Container do Ícone com tom esverdeado suave */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <IconPlaceholder name={iconName} className="h-5 w-5" />
        </div>
      </div>

      {/* Conteúdo Principal: Valor e Porcentagem */}
      <div className="mt-2 flex flex-col gap-1">
        <span className="text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </span>

        {/* Linha de Tendência */}
        {trendValue && (
          <div className="flex items-center gap-1.5 text-xs font-medium">
            <span
              className={`flex items-center gap-0.5 font-bold ${
                isPositive ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              <TrendIcon className="h-3.5 w-3.5 stroke-[2.5]" />
              {trendValue}
            </span>
            <span className="text-slate-400">{trendLabel}</span>
          </div>
        )}
      </div>
    </div>
  )
}



/*
*   ------------------------------  Card grande com páginação ------------------------------
*/

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PaginaUsuariosResponse, Usuario } from '../types/usuario'
import { Component } from 'react'

interface UsuariosCadastradosCardProps {
  data: PaginaUsuariosResponse | null
  loading?: boolean
  currentPage: number
  pageSize?: number
  onPageChange: (newPage: number) => void
  onSelectUser?: (usuario: Usuario) => void
}

export function UsuariosCadastradosCard({
  data,
  loading = false,
  currentPage,
  pageSize = 5,
  onPageChange,
  onSelectUser,
}: UsuariosCadastradosCardProps) {
  const usuarios = data?.content ?? []
  const totalPages = data?.totalPages ?? 0
  const totalElements = data?.totalElements ?? 0

  const inicio = totalElements === 0 ? 0 : currentPage * pageSize + 1
  const fim = Math.min((currentPage + 1) * pageSize, totalElements)

  return (
    <div className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm border border-slate-100 h-120">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between pb-6">
        <h3 className="text-lg font-bold text-slate-800">Usuários Cadastrados</h3>
      </div>

      {/* Tabela de Dados */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              <th className="py-3 px-4 rounded-l-lg">NOME</th>
              <th className="py-3 px-4">CPF</th>
              <th className="py-3 px-4">TIPO</th>
              <th className="py-3 px-4">DATA CADASTRO</th>
              <th className="py-3 px-4 rounded-r-lg">STATUS</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  Carregando...
                </td>
              </tr>
            ) : usuarios.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  Nenhum usuário encontrado.
                </td>
              </tr>
            ) : (
              usuarios.map((usuario) => {
                const tipoPrincipal = usuario.tipos?.[0] ?? '---'
                const isAtivo = usuario.status?.toUpperCase() === 'ATIVO'

                return (
                  <tr
                    key={usuario.id}
                    onClick={() => onSelectUser?.(usuario)}
                    /* Hover limpo: Apenas alteração de cor de fundo, sem sombras nem zoom */
                    className="cursor-pointer transition-colors duration-150 hover:bg-slate-100 active:bg-slate-200"
                  >
                    <td className="py-3.5 px-4 font-semibold text-slate-800 truncate max-w-45">
                      {usuario.nome}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{formatarCPF(usuario.cpf)}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700 capitalize">
                      {String(tipoPrincipal).toLowerCase()}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {formatarData(usuario.dataNascimento)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block rounded-md px-2.5 py-1 text-[11px] font-bold ${
                          isAtivo
                            ? 'bg-emerald-100/80 text-emerald-800'
                            : 'bg-amber-100/80 text-amber-800'
                        }`}
                      >
                        {usuario.status}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Rodapé e Paginação */}
      {data && (
        <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row pt-4 border-t border-slate-100">
          <span className="text-xs text-slate-500 font-medium">
            Mostrando <strong className="text-slate-700">{inicio}-{fim}</strong> de{' '}
            <strong className="text-slate-700">{totalElements}</strong> resultados
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 0 || loading}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                disabled={loading}
                className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                  currentPage === pageNum
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {pageNum + 1}
              </button>
            ))}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1 || loading}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}


/*
*   ------------------------------  Card grande com gráfico ------------------------------
*/

import {
  ResponsiveContainer,
  AreaChart,
  BarChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"
import { formatarCPF, formatarData } from '../lib/Formatters'

export interface ItemDadoGrafico {
  label: string;
  valor: number;
  [key: string]: string | number | boolean | undefined;
}

interface GraficoCardProps {
  title: string;
  subtitle?: string;
  dados: ItemDadoGrafico[];
  tipo?: "area" | "barras";
  cor?: string;
  altura?: number;
}

export function GraficoCard({
  title,
  subtitle,
  dados,
  tipo = "area",
  cor = "#10b981",
  altura = 260,
}: GraficoCardProps) {
  return (
    <TextCard
      title=""
      text={
        <div className="flex flex-col gap-4 w-full">
          <div>
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
            {subtitle && (
              <p className="text-xs text-slate-400 font-normal">{subtitle}</p>
            )}
          </div>

          <div style={{ height: `${altura}px` }} className="w-full">
            <ResponsiveContainer width="100%" height="100%">
              {tipo === "area" ? (
                <AreaChart data={dados} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#fff", borderRadius: "12px", borderColor: "#f1f5f9" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="valor"
                    stroke={cor}
                    fill={`${cor}20`}
                    strokeWidth={2}
                  />
                </AreaChart>
              ) : (
                <BarChart data={dados} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#fff", borderRadius: "12px", borderColor: "#f1f5f9" }}
                  />
                  <Bar dataKey="valor" fill={cor} radius={[6, 6, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      }
    />
  );
}