import { Client, IMessage, StompSubscription } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { getAccessToken } from '@/api'
import type { ChatTransport, LeituraHandler, MensagemHandler, StatusHandler } from './ChatTransport'
import type { MensagemChat, StatusConexao } from '@/app/types/chat'

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:8089/ws-chat'

/**
 * Implementação real do chat via STOMP sobre SockJS, para quando o backend
 * (Spring Boot + spring-boot-starter-websocket) expuser o endpoint.
 *
 * Ative com NEXT_PUBLIC_CHAT_TRANSPORT=stomp (ver services/chat/index.ts).
 *
 * ── Contrato esperado do backend ──────────────────────────────────────────
 *  - Handshake SockJS em `NEXT_PUBLIC_WS_URL` (default: http://localhost:8089/ws-chat)
 *  - STOMP CONNECT com header `Authorization: Bearer <accessToken>`
 *    (o mesmo access token usado nas chamadas REST, ver api.ts)
 *  - Assinatura por conversa:      SUBSCRIBE /topic/chat/{conversaId}
 *      → corpo publicado: MensagemChat (JSON), ver app/types/chat.ts
 *  - Envio de mensagem:            SEND /app/chat/{conversaId}/enviar
 *      → corpo enviado: MensagemChat (JSON)
 *  - Confirmação de leitura:
 *      SUBSCRIBE /topic/chat/{conversaId}/leitura → corpo: { leitorId: string }
 *      SEND      /app/chat/{conversaId}/lida      → corpo: { leitorId: string }
 * ───────────────────────────────────────────────────────────────────────────
 */
export class StompTransport implements ChatTransport {
  private client: Client | null = null
  private statusHandlers = new Set<StatusHandler>()
  private handlers = new Map<string, Set<MensagemHandler>>()
  private leituraHandlers = new Map<string, Set<LeituraHandler>>()
  private subscricoes = new Map<string, StompSubscription>()
  private subscricoesLeitura = new Map<string, StompSubscription>()

  conectar(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.emitStatus('conectando')

      this.client = new Client({
        webSocketFactory: () => new SockJS(WS_URL) as unknown as WebSocket,
        connectHeaders: {
          Authorization: `Bearer ${getAccessToken() ?? ''}`,
        },
        reconnectDelay: 4000,
        onConnect: () => {
          this.emitStatus('conectado')
          resolve()
        },
        onStompError: (frame) => {
          this.emitStatus('desconectado')
          reject(new Error(frame.headers?.message ?? 'Erro STOMP ao conectar no chat'))
        },
        onWebSocketClose: () => {
          this.emitStatus('desconectado')
        },
      })

      this.client.activate()
    })
  }

  desconectar(): void {
    this.subscricoes.forEach((sub) => sub.unsubscribe())
    this.subscricoesLeitura.forEach((sub) => sub.unsubscribe())
    this.subscricoes.clear()
    this.subscricoesLeitura.clear()
    this.handlers.clear()
    this.leituraHandlers.clear()
    this.client?.deactivate()
    this.client = null
    this.emitStatus('desconectado')
  }

  inscrever(conversaId: string, handler: MensagemHandler): () => void {
    if (!this.handlers.has(conversaId)) {
      this.handlers.set(conversaId, new Set())
    }
    this.handlers.get(conversaId)!.add(handler)

    if (!this.subscricoes.has(conversaId) && this.client?.connected) {
      const sub = this.client.subscribe(`/topic/chat/${conversaId}`, (frame: IMessage) => {
        const mensagem: MensagemChat = JSON.parse(frame.body)
        this.handlers.get(conversaId)?.forEach((h) => h(mensagem))
      })
      this.subscricoes.set(conversaId, sub)
    }

    return () => {
      this.handlers.get(conversaId)?.delete(handler)
    }
  }

  inscreverLeitura(conversaId: string, handler: LeituraHandler): () => void {
    if (!this.leituraHandlers.has(conversaId)) {
      this.leituraHandlers.set(conversaId, new Set())
    }
    this.leituraHandlers.get(conversaId)!.add(handler)

    if (!this.subscricoesLeitura.has(conversaId) && this.client?.connected) {
      const sub = this.client.subscribe(`/topic/chat/${conversaId}/leitura`, (frame: IMessage) => {
        const { leitorId } = JSON.parse(frame.body) as { leitorId: string }
        this.leituraHandlers.get(conversaId)?.forEach((h) => h(leitorId))
      })
      this.subscricoesLeitura.set(conversaId, sub)
    }

    return () => {
      this.leituraHandlers.get(conversaId)?.delete(handler)
    }
  }

  enviar(mensagem: MensagemChat): void {
    this.client?.publish({
      destination: `/app/chat/${mensagem.conversaId}/enviar`,
      body: JSON.stringify(mensagem),
    })
  }

  marcarComoLida(conversaId: string, leitorId: string): void {
    this.client?.publish({
      destination: `/app/chat/${conversaId}/lida`,
      body: JSON.stringify({ leitorId }),
    })
  }

  onStatus(handler: StatusHandler): () => void {
    this.statusHandlers.add(handler)
    return () => {
      this.statusHandlers.delete(handler)
    }
  }

  private emitStatus(status: StatusConexao) {
    this.statusHandlers.forEach((handler) => handler(status))
  }
}
