import { TrendingUp, TrendingDown } from 'lucide-react'
import { IconPlaceholder } from './Icons'

/*
*   Card pequeno com dados de resumo.
*/
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
*   Card grande com páginação
*/

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PaginaUsuariosResponse } from '../types/usuario'

interface RecentUsersCardProps {
  data: PaginaUsuariosResponse | null
  loading?: boolean
  currentPage: number
  onPageChange: (newPage: number) => void
}

function formatarCPF(cpf: string) {
  if (!cpf) return '---'
  const limpo = cpf.replace(/\D/g, '')
  if (limpo.length !== 11) return cpf
  return `${limpo.slice(0, 3)}.***.***-${limpo.slice(9)}`
}

function formatarData(dataIso: string) {
  if (!dataIso) return '---'
  return new Date(dataIso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function RecentUsersCard({
  data,
  loading = false,
  currentPage,
  onPageChange,
}: RecentUsersCardProps) {
  const usuarios = data?.content ?? []
  const totalPages = data?.totalPages ?? 0
  const totalElements = data?.totalElements ?? 0

  return (
    <div className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm border border-slate-100 min-h-105">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between pb-6">
        <h3 className="text-lg font-bold text-slate-800">Últimos Usuários Cadastrados</h3>
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
                  <tr key={usuario.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-700 truncate max-w-45">
                      {usuario.nome}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{formatarCPF(usuario.cpf)}</td>
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
                            ? 'bg-emerald-100/70 text-emerald-700'
                            : 'bg-amber-100/70 text-amber-700'
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
        <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row pt-4 border-t border-slate-50">
          <span className="text-xs text-slate-400 font-medium">
            Mostrando {usuarios.length} de {totalElements} cadastros
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 0 || loading}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
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
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
