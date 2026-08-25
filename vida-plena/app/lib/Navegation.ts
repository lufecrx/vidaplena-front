import type { TipoUsuario } from '../types/auth'

export interface NavItem {
  label: string
  href: string
  icon: string // nome do ícone (use com sua lib de ícones)
  badge?: string
  children?: NavItem[]
}

export interface NavGroup {
  group: string
  items: NavItem[]
}

// Navegação por perfil de usuário
const NAV_BY_ROLE: Record<string, NavGroup[]> = {
  ADMINISTRADOR: [
    {
      group: 'Visão Geral',
      items: [
        { label: 'Dashboard', href: '/admin/dashboard', icon: 'LayoutDashboard' },
      ],
    },
    {
      group: 'Usuários',
      items: [
        { label: 'Usuários', href: '/admin/usuarios', icon: 'Users' },
        { label: 'Permissões', href: '/admin/permissoes', icon: 'ShieldCheck' },
        { label: 'Log de Auditoria', href: '/admin/auditoria', icon: 'ClipboardList' },
      ],
    },
    {
      group: 'Clínica',
      items: [
        { label: 'Unidades', href: '/admin/unidades', icon: 'Building2' },
        { label: 'Especialidades', href: '/admin/especialidades', icon: 'Stethoscope' },
        { label: 'Convênios', href: '/admin/convenios', icon: 'CreditCard' },
        { label: 'Parceiros', href: '/admin/parceiros', icon: 'Handshake' },
      ],
    },
    {
      group: 'Planos',
      items: [
        { label: 'Planos', href: '/admin/planos', icon: 'PackageCheck' },
        { label: 'Programas', href: '/admin/programas', icon: 'HeartPulse' },
      ],
    },
    {
      group: 'Comunicação',
      items: [
        { label: 'Campanhas', href: '/admin/campanhas', icon: 'Megaphone' },
      ],
    },
    {
      group: 'Configurações',
      items: [
        { label: 'Configurações', href: '/admin/configuracoes', icon: 'Settings' },
      ],
    },
  ],

  GESTOR: [
    {
      group: 'Visão Geral',
      items: [
        { label: 'Dashboard', href: '/gestor/dashboard', icon: 'LayoutDashboard' },
      ],
    },
    {
      group: 'Operações',
      items: [
        { label: 'Visitas Domiciliares', href: '/gestor/visitas', icon: 'Home' },
        { label: 'Frota', href: '/gestor/frota', icon: 'Truck' },
      ],
    },
    {
      group: 'Relatórios',
      items: [
        { label: 'Faturamento', href: '/financeiro/relatorios', icon: 'BarChart3' },
        { label: 'Dashboard Financeiro', href: '/financeiro/dashboard', icon: 'TrendingUp' },
      ],
    },
  ],

  FINANCEIRO: [
    {
      group: 'Visão Geral',
      items: [
        { label: 'Dashboard Financeiro', href: '/financeiro/dashboard', icon: 'TrendingUp' },
      ],
    },
    {
      group: 'Cobranças',
      items: [
        { label: 'Emitir Cobranças', href: '/financeiro/cobrancas', icon: 'FileText' },
        { label: 'Reembolsos e Estornos', href: '/financeiro/reembolsos', icon: 'RefreshCw' },
        { label: 'Regras Financeiras', href: '/financeiro/regras', icon: 'Sliders' },
      ],
    },
    {
      group: 'Relatórios',
      items: [
        { label: 'Faturamento', href: '/financeiro/relatorios', icon: 'BarChart3' },
        { label: 'Auditoria', href: '/financeiro/auditoria', icon: 'Search' },
      ],
    },
  ],

  MEDICO: [
    {
      group: 'Visão Geral',
      items: [
        { label: 'Dashboard', href: '/profissional/dashboard', icon: 'LayoutDashboard' },
      ],
    },
    {
      group: 'Atendimento',
      items: [
        { label: 'Minha Agenda', href: '/profissional/agenda', icon: 'CalendarDays' },
        { label: 'Disponibilidade', href: '/profissional/disponibilidade', icon: 'Clock' },
      ],
    },
    {
      group: 'Pacientes',
      items: [
        { label: 'Meus Pacientes', href: '/profissional/pacientes', icon: 'Users' },
        { label: 'Monitoramento', href: '/profissional/monitoramento', icon: 'Activity' },
      ],
    },
    {
      group: 'Comunicação',
      items: [
        { label: 'Chat', href: '/chat', icon: 'MessageCircle', badge: 'new' },
      ],
    },
  ],

  PROFISSIONAL: [
    {
      group: 'Visão Geral',
      items: [
        { label: 'Dashboard', href: '/profissional/dashboard', icon: 'LayoutDashboard' },
      ],
    },
    {
      group: 'Atendimento',
      items: [
        { label: 'Minha Agenda', href: '/profissional/agenda', icon: 'CalendarDays' },
        { label: 'Disponibilidade', href: '/profissional/disponibilidade', icon: 'Clock' },
        { label: 'Visitas Domiciliares', href: '/profissional/visitas', icon: 'Home' },
      ],
    },
    {
      group: 'Comunicação',
      items: [
        { label: 'Chat', href: '/chat', icon: 'MessageCircle', badge: 'new' },
      ],
    },
  ],

  RECEPCIONISTA: [
    {
      group: 'Agendamentos',
      items: [
        { label: 'Agendamentos', href: '/recepcionista/agendamentos', icon: 'CalendarDays' },
        { label: 'Lista de Espera', href: '/recepcionista/lista-espera', icon: 'Clock' },
        { label: 'Convênios', href: '/admin/convenios', icon: 'CreditCard' },
      ],
    },
  ],

  FARMACIA: [
    {
      group: 'Farmácia',
      items: [
        { label: 'Receitas Digitais', href: '/farmacia/receitas', icon: 'FileText' },
        { label: 'Estoque', href: '/farmacia/estoque', icon: 'Package' },
      ],
    },
  ],

  REPRESENTANTE_EMPRESA: [
    {
      group: 'Empresa',
      items: [
        { label: 'Dashboard', href: '/empresa/dashboard', icon: 'LayoutDashboard' },
        { label: 'Relatório de Utilização', href: '/empresa/relatorio', icon: 'BarChart3' },
      ],
    },
  ],

  PACIENTE: [
    {
      group: 'Início',
      items: [
        { label: 'Meu Painel', href: '/paciente/dashboard', icon: 'LayoutDashboard' },
      ],
    },
    {
      group: 'Saúde',
      items: [
        { label: 'Agendamentos', href: '/paciente/agendamentos', icon: 'CalendarDays' },
        { label: 'Prontuário', href: '/paciente/prontuario', icon: 'FileText' },
        { label: 'Minhas Métricas', href: '/paciente/metricas', icon: 'Activity' },
        { label: 'Medicamentos', href: '/paciente/medicamentos', icon: 'Pill' },
        { label: 'Meu Plano', href: '/paciente/plano', icon: 'PackageCheck' },
      ],
    },
    {
      group: 'Financeiro',
      items: [
        { label: 'Pagamentos', href: '/paciente/pagamentos', icon: 'CreditCard' },
      ],
    },
    {
      group: 'Comunicação',
      items: [
        { label: 'Chat', href: '/chat', icon: 'MessageCircle' },
        { label: 'Notificações', href: '/notificacoes', icon: 'Bell' },
      ],
     },
     {
       group: 'Configurações',
       items: [
         { label: 'Sair', href: '/logout', icon: 'Exit' },
       ],
     },
  ],

  RESPONSAVEL: [
    {
      group: 'Início',
      items: [
        { label: 'Meu Painel', href: '/paciente/dashboard', icon: 'LayoutDashboard' },
      ],
    },
    {
      group: 'Dependentes',
      items: [
        { label: 'Dependentes', href: '/paciente/dependentes', icon: 'Users' },
        { label: 'Agendamentos', href: '/paciente/agendamentos', icon: 'CalendarDays' },
        { label: 'Métricas', href: '/paciente/metricas', icon: 'Activity' },
        { label: 'Medicamentos', href: '/paciente/medicamentos', icon: 'Pill' },
      ],
    },
  ],
}

/**
 * Retorna os grupos de navegação para o perfil principal do usuário.
 * Se o usuário tiver múltiplos tipos, usa o de maior privilégio.
 */
export function getNavForUser(tipos: TipoUsuario[]): NavGroup[] {
  const priority: TipoUsuario[] = [
    'ADMINISTRADOR', 'GESTOR', 'FINANCEIRO',
    'MEDICO', 'PROFISSIONAL', 'RECEPCIONISTA',
    'FARMACIA', 'REPRESENTANTE_EMPRESA',
    'RESPONSAVEL', 'PACIENTE',
  ]

  for (const tipo of priority) {
    if (tipos.includes(tipo)) {
      return NAV_BY_ROLE[tipo] ?? []
    }
  }

  return []
}
