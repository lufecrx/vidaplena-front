import type { MensagemChat, StatusConexao } from '@/app/types/chat'

export type MensagemHandler = (mensagem: MensagemChat) => void
export type LeituraHandler = (leitorId: string) => void
export type StatusHandler = (status: StatusConexao) => void

/**
 * Contrato do transporte de chat. As duas implementações (LocalBroadcastTransport
 * e StompTransport) seguem essa mesma interface — trocar uma pela outra é só
 * mudar a variável de ambiente NEXT_PUBLIC_CHAT_TRANSPORT, sem tocar em hooks/UI.
 */
export interface ChatTransport {
  conectar(usuarioId: string): Promise<void>
  desconectar(): void

  /** Assina as mensagens novas de uma conversa. Retorna função de cancelamento. */
  inscrever(conversaId: string, handler: MensagemHandler): () => void

  /** Assina os eventos de "fulano leu a conversa". Retorna função de cancelamento. */
  inscreverLeitura(conversaId: string, handler: LeituraHandler): () => void

  enviar(mensagem: MensagemChat): void

  /** Avisa a outra ponta que `leitorId` acabou de ler a conversa `conversaId`. */
  marcarComoLida(conversaId: string, leitorId: string): void

  onStatus(handler: StatusHandler): () => void
}

/**
 * Gera um id de conversa determinístico a partir dos dois participantes,
 * sem depender de um backend para atribuir o id — os dois lados calculam
 * o mesmo valor de forma independente.
 */
export function gerarConversaId(usuarioIdA: string, usuarioIdB: string): string {
  return [usuarioIdA, usuarioIdB].sort().join('__')
}
