'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '@/app/auth/Authcontext'
import { getChatTransport, gerarConversaId, obterHistoricoLocal } from '@/app/services/chat'
import { profissionalService } from '@/app/services/profissionalService'
import { usuarioService } from '@/app/services/usuarioService'
import type { TipoUsuario } from '@/app/types/usuario'
import type { ConversaChat, ContatoChat, MensagemChat, StatusConexao } from '@/app/types/chat'

function ehProfissionalDeSaude(tipos: TipoUsuario[]): boolean {
  return tipos.includes('MEDICO') || tipos.includes('PROFISSIONAL')
}

export function useChat() {
  const { usuario } = useAuth()
  const transport = useMemo(() => getChatTransport(), [])

  const [status, setStatus] = useState<StatusConexao>('conectando')
  const [contatos, setContatos] = useState<ContatoChat[]>([])
  const [carregandoContatos, setCarregandoContatos] = useState(true)
  const [conversaAtivaId, setConversaAtivaId] = useState<string | null>(null)
  const [mensagensPorConversa, setMensagensPorConversa] = useState<Record<string, MensagemChat[]>>({})
  const [naoLidasPorConversa, setNaoLidasPorConversa] = useState<Record<string, number>>({})

  const conversaAtivaRef = useRef<string | null>(null)
  useEffect(() => {
    conversaAtivaRef.current = conversaAtivaId
  }, [conversaAtivaId])

  // Conecta ao transporte assim que soubermos quem está logado
  useEffect(() => {
    if (!usuario) return

    const removerStatus = transport.onStatus(setStatus)
    transport.conectar(usuario.id)

    return () => {
      removerStatus()
    }
  }, [usuario, transport])

  // Carrega a lista de possíveis contatos conforme o perfil logado.
  // Paciente/Responsável conversam com profissionais; profissional/médico
  // conversam com pacientes. Reaproveita endpoints que já existem — não há
  // (ainda) um endpoint dedicado de "meus contatos de chat".
  useEffect(() => {
    if (!usuario) return
    let ativo = true

    async function carregarContatos() {
      setCarregandoContatos(true)
      try {
        if (ehProfissionalDeSaude(usuario!.tipos)) {
          const pagina = await usuarioService.listarUsuarios(0, 100)
          const pacientes = pagina.content
            .filter((u) => u.tipos.includes('PACIENTE') || u.tipos.includes('RESPONSAVEL'))
            .map<ContatoChat>((u) => ({ usuarioId: u.id, nome: u.nome, subtitulo: 'Paciente' }))
          if (ativo) setContatos(pacientes)
        } else {
          const profissionais = await profissionalService.listarProfissionais()
          const contatosProfissionais = profissionais.map<ContatoChat>((p) => ({
            usuarioId: p.usuarioId,
            nome: p.nome ?? 'Profissional de saúde',
            subtitulo: p.especialidade,
          }))
          if (ativo) setContatos(contatosProfissionais)
        }
      } catch (error) {
        console.error('Erro ao carregar contatos do chat:', error)
        if (ativo) setContatos([])
      } finally {
        if (ativo) setCarregandoContatos(false)
      }
    }

    carregarContatos()

    return () => {
      ativo = false
    }
  }, [usuario])

  // Assina mensagens e leituras de cada conversa possível (uma por contato)
  useEffect(() => {
    if (!usuario) return
    const remocoes: Array<() => void> = []

    contatos.forEach((contato) => {
      const conversaId = gerarConversaId(usuario.id, contato.usuarioId)

      setMensagensPorConversa((prev) =>
        prev[conversaId] ? prev : { ...prev, [conversaId]: obterHistoricoLocal(conversaId) },
      )

      const removerMensagem = transport.inscrever(conversaId, (mensagem) => {
        setMensagensPorConversa((prev) => {
          const historico = prev[conversaId] ?? []
          if (historico.some((m) => m.id === mensagem.id)) return prev
          return { ...prev, [conversaId]: [...historico, mensagem] }
        })

        if (mensagem.remetenteId !== usuario.id && conversaAtivaRef.current !== conversaId) {
          setNaoLidasPorConversa((prev) => ({ ...prev, [conversaId]: (prev[conversaId] ?? 0) + 1 }))
        }
      })

      const removerLeitura = transport.inscreverLeitura(conversaId, (leitorId) => {
        setMensagensPorConversa((prev) => {
          const historico = prev[conversaId] ?? []
          return {
            ...prev,
            [conversaId]: historico.map((m) =>
              m.remetenteId !== leitorId && !m.lida ? { ...m, lida: true } : m,
            ),
          }
        })
      })

      remocoes.push(removerMensagem, removerLeitura)
    })

    return () => {
      remocoes.forEach((remover) => remover())
    }
  }, [contatos, usuario, transport])

  const conversas: ConversaChat[] = useMemo(() => {
    if (!usuario) return []
    return contatos.map((contato) => {
      const conversaId = gerarConversaId(usuario.id, contato.usuarioId)
      const mensagens = mensagensPorConversa[conversaId] ?? []
      return {
        id: conversaId,
        contato,
        ultimaMensagem: mensagens[mensagens.length - 1],
        naoLidas: naoLidasPorConversa[conversaId] ?? 0,
      }
    })
  }, [contatos, mensagensPorConversa, naoLidasPorConversa, usuario])

  const abrirConversa = useCallback(
    (conversaId: string) => {
      setConversaAtivaId(conversaId)
      setNaoLidasPorConversa((prev) => ({ ...prev, [conversaId]: 0 }))
      if (usuario) transport.marcarComoLida(conversaId, usuario.id)
    },
    [usuario, transport],
  )

  const enviarMensagem = useCallback(
    (contato: ContatoChat, texto: string) => {
      if (!usuario || !texto.trim()) return

      const conversaId = gerarConversaId(usuario.id, contato.usuarioId)
      const mensagem: MensagemChat = {
        id: `${usuario.id}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        conversaId,
        remetenteId: usuario.id,
        destinatarioId: contato.usuarioId,
        texto: texto.trim(),
        enviadaEm: new Date().toISOString(),
        lida: false,
      }

      transport.enviar(mensagem)
    },
    [usuario, transport],
  )

  const conversaAtiva = conversas.find((c) => c.id === conversaAtivaId) ?? null
  const mensagensDaConversaAtiva = conversaAtivaId ? mensagensPorConversa[conversaAtivaId] ?? [] : []

  return {
    status,
    carregandoContatos,
    conversas,
    conversaAtiva,
    mensagensDaConversaAtiva,
    abrirConversa,
    enviarMensagem,
  }
}
