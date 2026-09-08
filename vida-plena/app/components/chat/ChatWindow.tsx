'use client'

import { useEffect, useRef, useState } from 'react'
import { Paperclip, Send } from 'lucide-react'
import Button from '@/app/components/Button'
import type { ConversaChat, MensagemChat, StatusConexao } from '@/app/types/chat'

interface ChatWindowProps {
  conversa: ConversaChat | null
  mensagens: MensagemChat[]
  meuUsuarioId: string
  status: StatusConexao
  onEnviar: (texto: string) => void
}

const STATUS_LABEL: Record<StatusConexao, string> = {
  conectando: 'Conectando...',
  conectado: 'Conectado',
  desconectado: 'Desconectado',
}

const STATUS_COR: Record<StatusConexao, string> = {
  conectando: 'bg-vp-ambar-500',
  conectado: 'bg-vp-verde-500',
  desconectado: 'bg-vp-coral-500',
}

function formatarHora(iso: string) {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export function ChatWindow({ conversa, mensagens, meuUsuarioId, status, onEnviar }: ChatWindowProps) {
  const [texto, setTexto] = useState('')
  const fimDaListaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fimDaListaRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens.length])

  if (!conversa) {
    return (
      <div className="flex flex-1 items-center justify-center text-slate-400">
        Selecione uma conversa para começar
      </div>
    )
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!texto.trim()) return
    onEnviar(texto)
    setTexto('')
  }

  return (
    <div className="flex flex-1 flex-col bg-[#F3F6F1]">
      <header className="flex items-center gap-3 border-b border-slate-100 bg-white px-6 py-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-vp-azul-700 text-sm font-bold text-white">
          {conversa.contato.nome.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-slate-800">{conversa.contato.nome}</p>
          {conversa.contato.subtitulo && (
            <p className="truncate text-xs text-slate-400">{conversa.contato.subtitulo}</p>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className={`h-2 w-2 rounded-full ${STATUS_COR[status]}`} />
          {STATUS_LABEL[status]}
        </div>
      </header>

      <div className="border-b border-vp-ambar-500/30 bg-vp-ambar-500/10 px-6 py-2 text-xs font-medium text-vp-ambar-700">
        ⚠️ Não utilize o chat para emergências médicas. Em caso de emergência, ligue para o SAMU (192).
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-6 py-4">
        {mensagens.length === 0 ? (
          <p className="text-center text-sm text-slate-400">Nenhuma mensagem ainda. Diga oi!</p>
        ) : (
          mensagens.map((mensagem) => {
            const éMinha = mensagem.remetenteId === meuUsuarioId
            return (
              <div key={mensagem.id} className={`flex ${éMinha ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs rounded-2xl px-4 py-2 text-sm shadow-sm sm:max-w-md ${
                    éMinha
                      ? 'rounded-br-sm bg-vp-verde-700 text-white'
                      : 'rounded-bl-sm border border-slate-100 bg-white text-slate-700'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{mensagem.texto}</p>
                  <div
                    className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                      éMinha ? 'text-white/70' : 'text-slate-400'
                    }`}
                  >
                    {formatarHora(mensagem.enviadaEm)}
                    {éMinha && <span>{mensagem.lida ? '✓✓' : '✓'}</span>}
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={fimDaListaRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-slate-100 bg-white px-4 py-3">
        <button
          type="button"
          disabled
          title="Envio de arquivos em breve"
          className="flex h-9 w-9 shrink-0 cursor-not-allowed items-center justify-center rounded-full text-slate-300"
        >
          <Paperclip className="h-5 w-5" />
        </button>

        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-vp-teal-500"
        />

        <Button type="submit" size="sm" className="!rounded-full !px-3" disabled={!texto.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
