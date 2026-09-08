// Um "contato" é a outra ponta possível de uma conversa: o profissional
// para o paciente, ou o paciente para o profissional.
export interface ContatoChat {
  usuarioId: string
  nome: string
  subtitulo?: string
}

export interface MensagemChat {
  id: string
  conversaId: string
  remetenteId: string
  destinatarioId: string
  texto: string
  enviadaEm: string // ISO 8601
  lida: boolean
}

export interface ConversaChat {
  id: string
  contato: ContatoChat
  ultimaMensagem?: MensagemChat
  naoLidas: number
}

export type StatusConexao = 'conectando' | 'conectado' | 'desconectado'
