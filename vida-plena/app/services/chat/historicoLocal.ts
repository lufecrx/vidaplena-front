import type { MensagemChat } from '@/app/types/chat'

const STORAGE_PREFIX = 'vidaplena_chat_'

function chave(conversaId: string) {
  return STORAGE_PREFIX + conversaId
}

/**
 * Cache local (localStorage) do histórico de mensagens por conversa.
 *
 * É usado pela LocalBroadcastTransport como a própria fonte de dados, e
 * também pelo useChat como cache de leitura independente do transporte —
 * assim o histórico sobrevive a um F5 mesmo quando o transporte real (Stomp)
 * não tem endpoint de histórico ainda.
 */
export function obterHistoricoLocal(conversaId: string): MensagemChat[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(chave(conversaId)) ?? '[]')
  } catch {
    return []
  }
}

export function salvarMensagemLocal(mensagem: MensagemChat): void {
  if (typeof window === 'undefined') return
  try {
    const historico = obterHistoricoLocal(mensagem.conversaId)
    if (historico.some((m) => m.id === mensagem.id)) return
    historico.push(mensagem)
    localStorage.setItem(chave(mensagem.conversaId), JSON.stringify(historico))
  } catch {
    // localStorage indisponível (modo privado, quota etc.) — mensagem só vive em memória
  }
}

/** Marca como lidas todas as mensagens que NÃO foram enviadas por `leitorId`. */
export function marcarHistoricoComoLido(conversaId: string, leitorId: string): void {
  if (typeof window === 'undefined') return
  try {
    const historico = obterHistoricoLocal(conversaId).map((m) =>
      m.remetenteId !== leitorId ? { ...m, lida: true } : m,
    )
    localStorage.setItem(chave(conversaId), JSON.stringify(historico))
  } catch {
    // ignora
  }
}
