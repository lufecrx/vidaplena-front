import { TipoDependencia, CadastroDependenteRequestDTO } from '../types/dependente'
import { cpfValido, emailValido, telefoneValido } from './Validation'
import { limparCPF, limparTelefone } from './Formatters'

export function calcularIdade(dataNascimento: string): number {
  if (!dataNascimento) return 0
  const hoje = new Date()
  const nascimento = new Date(dataNascimento + 'T00:00:00')
  if (isNaN(nascimento.getTime())) return 0

  let idade = hoje.getFullYear() - nascimento.getFullYear()
  const mesAtual = hoje.getMonth()
  const diaAtual = hoje.getDate()
  const mesNasc = nascimento.getMonth()
  const diaNasc = nascimento.getDate()

  if (mesAtual < mesNasc || (mesAtual === mesNasc && diaAtual < diaNasc)) {
    idade--
  }

  return Math.max(0, idade)
}

export function formatarIdadeTexto(dataNascimento: string): string {
  if (!dataNascimento) return ''
  const hoje = new Date()
  const nascimento = new Date(dataNascimento + 'T00:00:00')
  if (isNaN(nascimento.getTime())) return ''

  const idadeAnos = calcularIdade(dataNascimento)
  if (idadeAnos >= 1) {
    return `${idadeAnos} ${idadeAnos === 1 ? 'ano' : 'anos'}`
  }

  // Menor de 1 ano: calcular meses
  let meses = (hoje.getFullYear() - nascimento.getFullYear()) * 12 + (hoje.getMonth() - nascimento.getMonth())
  if (hoje.getDate() < nascimento.getDate()) {
    meses--
  }
  meses = Math.max(0, meses)
  return `${meses} ${meses === 1 ? 'mês' : 'meses'}`
}

export function sugerirTipoPorIdade(idade: number): TipoDependencia {
  if (idade < 18) {
    return 'CRIANCA'
  }
  if (idade >= 60) {
    return 'IDOSO'
  }
  return 'NECESSIDADE_ESPECIAL'
}

export function validarCompatibilidadeTipoIdade(
  tipo: TipoDependencia,
  idade: number
): { valido: boolean; mensagem?: string } {
  if (tipo === 'CRIANCA' && idade >= 18) {
    return {
      valido: false,
      mensagem: `A classificação 'Criança' é restrita a menores de 18 anos. Idade atual: ${idade} anos.`,
    }
  }

  if (tipo === 'IDOSO' && idade < 60) {
    return {
      valido: false,
      mensagem: `A classificação 'Idoso' é restrita a pessoas com 60 anos ou mais. Idade atual: ${idade} anos.`,
    }
  }

  return { valido: true }
}

export interface ErrosValidacaoDependente {
  nome?: string
  cpf?: string
  dataNascimento?: string
  tipo?: string
  email?: string
  telefone?: string
  dataInicio?: string
  dataFim?: string
  geral?: string
}

export function validarFormularioDependente(
  dados: {
    nome: string
    cpf: string
    dataNascimento: string
    tipo: TipoDependencia
    email?: string
    telefone?: string
    dataInicio?: string
    dataFim?: string
  },
  cpfResponsavel?: string
): { valido: boolean; erros: ErrosValidacaoDependente } {
  const erros: ErrosValidacaoDependente = {}

  // 1. Nome
  const nomeLimpo = dados.nome ? dados.nome.replace(/\s+/g, ' ').trim() : ''
  if (!nomeLimpo || nomeLimpo.length < 2) {
    erros.nome = 'O nome deve ter no mínimo 2 caracteres.'
  }

  // 2. CPF
  const cpfLimpo = limparCPF(dados.cpf || '')
  if (!cpfLimpo) {
    erros.cpf = 'O CPF é obrigatório.'
  } else if (!cpfValido(cpfLimpo)) {
    erros.cpf = 'CPF inválido.'
  } else if (cpfResponsavel && cpfLimpo === limparCPF(cpfResponsavel)) {
    erros.cpf = 'Auto-dependência não permitida. O CPF pertence ao próprio responsável.'
  }

  // 3. Data de Nascimento
  if (!dados.dataNascimento) {
    erros.dataNascimento = 'A data de nascimento é obrigatória.'
  } else {
    const hoje = new Date()
    hoje.setHours(23, 59, 59, 999)
    const nasc = new Date(dados.dataNascimento + 'T00:00:00')
    if (isNaN(nasc.getTime())) {
      erros.dataNascimento = 'Data de nascimento inválida.'
    } else if (nasc > hoje) {
      erros.dataNascimento = 'A data de nascimento não pode ser futura.'
    } else {
      // 4. Validação Tipo vs Idade
      const idade = calcularIdade(dados.dataNascimento)
      const compatibilidade = validarCompatibilidadeTipoIdade(dados.tipo, idade)
      if (!compatibilidade.valido) {
        erros.tipo = compatibilidade.mensagem
      }
    }
  }

  // 5. E-mail opcional
  if (dados.email && dados.email.trim().length > 0) {
    if (!emailValido(dados.email.trim())) {
      erros.email = 'E-mail informado é inválido.'
    }
  }

  // 6. Telefone opcional
  if (dados.telefone && dados.telefone.trim().length > 0) {
    const telLimpo = limparTelefone(dados.telefone)
    if (!telefoneValido(telLimpo)) {
      erros.telefone = 'Telefone informado é inválido (deve ter DDD + 8 ou 9 dígitos).'
    }
  }

  // 7. Datas de início e término
  if (dados.dataInicio) {
    const hoje = new Date()
    hoje.setHours(23, 59, 59, 999)
    const inicio = new Date(dados.dataInicio + 'T00:00:00')
    if (inicio > hoje) {
      erros.dataInicio = 'A data de início do vínculo não pode ser futura.'
    }
  }

  if (dados.dataFim && dados.dataInicio) {
    const inicio = new Date(dados.dataInicio + 'T00:00:00')
    const fim = new Date(dados.dataFim + 'T00:00:00')
    if (fim < inicio) {
      erros.dataFim = 'A data de término não pode ser anterior à data de início.'
    }
  }

  return {
    valido: Object.keys(erros).length === 0,
    erros,
  }
}
