import type { ChatTransport, LeituraHandler, MensagemHandler, StatusHandler } from './ChatTransport'
import { salvarMensagemLocal, marcarHistoricoComoLido } from './historicoLocal'
import type { MensagemChat, StatusConexao } from '@/app/types/chat'

const CANAL = 'vidaplena-chat-v1'

type Envelope =
  | { tipo: 'mensagem'; payload: MensagemChat }
  | { tipo: 'leitura'; conversaId: string; leitorId: string }

/**
 * Implementação "gambiarra" do ChatTransport: roda inteiramente no
 * navegador, sem nenhum servidor de WebSocket.
 *
 * Usa a BroadcastChannel API para sincronizar mensagens entre abas abertas
 * na mesma origem (ex: uma aba logada como paciente e outra como
 * profissional, no mesmo navegador) e o localStorage (via historicoLocal)
 * para persistir o histórico entre recarregamentos.
 *
 * Limitação importante: só funciona entre abas do MESMO navegador na
 * MESMA máquina — não é um chat entre pessoas em computadores diferentes.
 * Serve para desenvolver/demonstrar a UI antes do backend expor o
 * WebSocket real (ver StompTransport.ts).
 */
export class LocalBroadcastTransport implements ChatTransport {
  private channel: BroadcastChannel | null = null
  private handlers = new Map<string, Set<MensagemHandler>>()
  private leituraHandlers = new Map<string, Set<LeituraHandler>>()
  private statusHandlers = new Set<StatusHandler>()

  async conectar(): Promise<void> {
    this.emitStatus('conectando')

    if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') {
      this.emitStatus('desconectado')
      return
    }

    this.channel = new BroadcastChannel(CANAL)
    this.channel.onmessage = (event: MessageEvent<Envelope>) => {
      const envelope = event.data

      if (envelope.tipo === 'mensagem') {
        salvarMensagemLocal(envelope.payload)
        this.handlers.get(envelope.payload.conversaId)?.forEach((handler) => handler(envelope.payload))
        return
      }

      this.leituraHandlers.get(envelope.conversaId)?.forEach((handler) => handler(envelope.leitorId))
    }

    // Pequeno atraso só pra simular a latência de um handshake de verdade
    await new Promise((resolve) => setTimeout(resolve, 250))
    this.emitStatus('conectado')
  }

  desconectar(): void {
    this.channel?.close()
    this.channel = null
    this.handlers.clear()
    this.leituraHandlers.clear()
    this.emitStatus('desconectado')
  }

  inscrever(conversaId: string, handler: MensagemHandler): () => void {
    if (!this.handlers.has(conversaId)) {
      this.handlers.set(conversaId, new Set())
    }
    this.handlers.get(conversaId)!.add(handler)

    return () => {
      this.handlers.get(conversaId)?.delete(handler)
    }
  }

  inscreverLeitura(conversaId: string, handler: LeituraHandler): () => void {
    if (!this.leituraHandlers.has(conversaId)) {
      this.leituraHandlers.set(conversaId, new Set())
    }
    this.leituraHandlers.get(conversaId)!.add(handler)

    return () => {
      this.leituraHandlers.get(conversaId)?.delete(handler)
    }
  }

  enviar(mensagem: MensagemChat): void {
    salvarMensagemLocal(mensagem)
    // BroadcastChannel não ecoa pra quem enviou — entrega otimista na própria aba
    this.handlers.get(mensagem.conversaId)?.forEach((handler) => handler(mensagem))
    this.channel?.postMessage({ tipo: 'mensagem', payload: mensagem } satisfies Envelope)
  }

  marcarComoLida(conversaId: string, leitorId: string): void {
    marcarHistoricoComoLido(conversaId, leitorId)
    this.channel?.postMessage({ tipo: 'leitura', conversaId, leitorId } satisfies Envelope)
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
