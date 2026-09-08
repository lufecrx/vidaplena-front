'use client'

import type { ConversaChat } from '@/app/types/chat'

interface ConversaListProps {
  conversas: ConversaChat[]
  carregando: boolean
  conversaAtivaId: string | null
  onSelecionar: (conversaId: string) => void
}

function formatarHora(iso?: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export function ConversaList({ conversas, carregando, conversaAtivaId, onSelecionar }: ConversaListProps) {
  return (
    <aside className="flex w-full max-w-xs shrink-0 flex-col border-r border-slate-100 bg-white">
      <div className="border-b border-slate-100 px-4 py-4">
        <h2 className="text-lg font-bold text-slate-800">Conversas</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {carregando ? (
          <p className="p-4 text-sm text-slate-400">Carregando contatos...</p>
        ) : conversas.length === 0 ? (
          <p className="p-4 text-sm text-slate-400">Nenhum contato disponível ainda.</p>
        ) : (
          conversas.map((conversa) => (
            <button
              key={conversa.id}
              type="button"
              onClick={() => onSelecionar(conversa.id)}
              className={`flex w-full items-center gap-3 border-b border-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-50 ${
                conversaAtivaId === conversa.id ? 'bg-vp-verde-500/10' : ''
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-vp-azul-700 text-sm font-bold text-white">
                {conversa.contato.nome.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-semibold text-slate-800">{conversa.contato.nome}</span>
                  {conversa.ultimaMensagem && (
                    <span className="shrink-0 text-[11px] text-slate-400">
                      {formatarHora(conversa.ultimaMensagem.enviadaEm)}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm text-slate-500">
                    {conversa.ultimaMensagem?.texto ?? conversa.contato.subtitulo ?? 'Sem mensagens ainda'}
                  </span>
                  {conversa.naoLidas > 0 && (
                    <span className="shrink-0 rounded-full bg-vp-coral-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {conversa.naoLidas}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  )
}
