'use client'

import React from 'react'
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  ShieldCheck,
  ClipboardList,
  Building2,
  Stethoscope,
  CreditCard,
  Handshake,
  PackageCheck,
  HeartPulse,
  Megaphone,
  Settings,
  Home,
  Truck,
  BarChart3,
  TrendingUp,
  FileText,
  RefreshCw,
  Sliders,
  Search,
  Clock,
  Activity,
  MessageCircle,
  Bell,
  Pill,
  Package,
  LogOut,
  HelpCircle,
  LucideProps,
} from 'lucide-react'


/* MAPEAMENTO DOS ICONES DA SIDEBAR BASEADO NO NAVEGATION */
const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  LayoutDashboard,
  CalendarDays,
  Users,
  ShieldCheck,
  ClipboardList,
  Building2,
  Stethoscope,
  CreditCard,
  Handshake,
  PackageCheck,
  HeartPulse,
  Megaphone,
  Settings,
  Home,
  Truck,
  BarChart3,
  TrendingUp,
  FileText,
  RefreshCw,
  Sliders,
  Search,
  Clock,
  Activity,
  MessageCircle,
  Bell,
  Pill,
  Package,
  Exit: LogOut,
}

interface IconProps extends LucideProps {
  name: string
}

export function IconPlaceholder({ name, ...props }: IconProps) {
  const IconComponent = iconMap[name]

  if (!IconComponent) {
    return <HelpCircle {...props} />
  }

  return <IconComponent {...props} />
}


/*
* Interface para poder reutilizar a logo em vários lugares.
* Vem com subtitulo: "GESTÃO DE SAÚDE" que pode ser desativado.
*/

interface LogoProps {
   showSubtitle?: boolean
   className?: string
}

export function Logo({ showSubtitle = true, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white shadow-inner">
        <Activity className="h-6 w-6 stroke-[2.25]" />
      </div>


      {/* Textos da Logo */}
      <div className="flex flex-col justify-center">
        <span className="text-lg font-bold leading-tight text-white">
          Vida Plena
        </span>
        {showSubtitle && (
          <span className="text-[10px] font-semibold tracking-[0.18em] text-white/60 uppercase leading-tight mt-0.5">
            Gestão de Saúde
          </span>
        )}
      </div>
    </div>
  )
}
