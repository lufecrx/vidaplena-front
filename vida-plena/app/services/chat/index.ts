import type { ChatTransport } from './ChatTransport'
import { LocalBroadcastTransport } from './LocalBroadcastTransport'
import { StompTransport } from './StompTransport'

export * from './ChatTransport'
export * from './historicoLocal'

/**
 * Fábrica do transporte de chat.
 *
 * Por padrão (NEXT_PUBLIC_CHAT_TRANSPORT não definido, ou "local"): usa
 * LocalBroadcastTransport — uma simulação 100% client-side (BroadcastChannel
 * + localStorage) que não depende de nenhum servidor de WebSocket. É a
 * "gambiarra" combinada para rodar o chat sem esperar o backend.
 *
 * Quando o backend expuser o endpoint STOMP (contrato documentado em
 * StompTransport.ts), basta setar NEXT_PUBLIC_CHAT_TRANSPORT=stomp — nenhum
 * componente ou hook precisa mudar, os dois implementam a mesma interface.
 */
let instancia: ChatTransport | null = null

export function getChatTransport(): ChatTransport {
  if (!instancia) {
    instancia =
      process.env.NEXT_PUBLIC_CHAT_TRANSPORT === 'stomp'
        ? new StompTransport()
        : new LocalBroadcastTransport()
  }
  return instancia
}
