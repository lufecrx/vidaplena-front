'use client'

import { useAuth } from '@/app/auth/Authcontext'
import { useChat } from '@/app/hooks/useChat'
import { ConversaList } from '@/app/components/chat/ConversaList'
import { ChatWindow } from '@/app/components/chat/ChatWindow'

export default function ChatPage() {
   const { usuario } = useAuth()
   const {
      status,
      carregandoContatos,
      conversas,
      conversaAtiva,
      mensagensDaConversaAtiva,
      abrirConversa,
      enviarMensagem,
   } = useChat()

   if (!usuario) return null

   return (
      <div className="flex h-[calc(100vh-6rem)] w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
         <ConversaList
            conversas={conversas}
            carregando={carregandoContatos}
            conversaAtivaId={conversaAtiva?.id ?? null}
            onSelecionar={abrirConversa}
         />

         <ChatWindow
            conversa={conversaAtiva}
            mensagens={mensagensDaConversaAtiva}
            meuUsuarioId={usuario.id}
            status={status}
            onEnviar={(texto) => conversaAtiva && enviarMensagem(conversaAtiva.contato, texto)}
         />
      </div>
   )
}
