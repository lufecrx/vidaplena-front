'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '../auth/Authcontext'
import { getNavForUser } from '../lib/Navegation'

interface SidebarProps {
  collapsed: boolean
  //onToggle: () => void
}

export function Sidebar({ collapsed/*, onToggle*/ }: SidebarProps) {
  const { usuario } = useAuth()
  const pathname = usePathname()

  const navGroups = usuario ? getNavForUser(usuario.tipos) : []

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40 flex flex-col bg-[#1A3A5C] transition-all duration-300
        ${collapsed ? 'w-16' : 'w-60'}
      `}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
        {!collapsed && (
          <span className="text-white font-bold text-lg tracking-tight">
            Vida<span className="text-[#4DBFA8]">Plena</span>
          </span>
           )}
         {/*  Seta para reduzir a sidebar
        <button
          onClick={onToggle}
          className="ml-auto p-1.5 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {collapsed ? '→' : '←'}
          </button>*/}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.group} className="mb-4">
            {!collapsed && (
              <p className="px-4 mb-1 text-[10px] font-semibold uppercase tracking-widest text-white/40">
                {group.group}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={`
                        relative flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                        ${isActive
                          ? 'bg-white/15 text-white font-medium'
                          : 'text-white/70 hover:text-white hover:bg-white/8'
                        }
                      `}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <span className="absolute left-0 inset-y-0 w-0.5 bg-[#4DBFA8] rounded-r" />
                      )}

                      {/* Icon placeholder — troque pelo componente da sua lib de ícones */}
                      <span className="w-5 h-5 shrink-0 text-center text-base leading-none opacity-80">
                        <IconPlaceholder name={item.icon} />
                      </span>

                      {!collapsed && (
                        <>
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span className="ml-auto rounded-full bg-[#4DBFA8] px-1.5 py-0.5 text-[10px] font-bold text-[#1A3A5C]">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User footer */}
      {usuario && (
        <div className={`border-t border-white/10 p-3 ${collapsed ? 'flex justify-center' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 shrink-0 rounded-full bg-[#4DBFA8] flex items-center justify-center text-[#1A3A5C] text-xs font-bold">
              {usuario.nome.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">{usuario.nome}</p>
                <p className="truncate text-xs text-white/50">{usuario.tipos[0]}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  )
}

// Placeholder simples de ícone por nome — substitua pelo Lucide ou similar
function IconPlaceholder({ name }: { name: string }) {
  const map: Record<string, string> = {
    LayoutDashboard: '⊞', CalendarDays: '📅', Users: '👥', ShieldCheck: '🔒',
    ClipboardList: '📋', Building2: '🏢', Stethoscope: '🩺', CreditCard: '💳',
    Handshake: '🤝', PackageCheck: '📦', HeartPulse: '💗', Megaphone: '📣',
    Settings: '⚙️', Home: '🏠', Truck: '🚚', BarChart3: '📊', TrendingUp: '📈',
    FileText: '📄', RefreshCw: '🔄', Sliders: '🎛', Search: '🔍', Clock: '🕐',
     Activity: '📉', MessageCircle: '💬', Bell: '🔔', Pill: '💊', Package: '📦',
    Exit: '🚪',
  }
  return <>{map[name] ?? '•'}</>
}
