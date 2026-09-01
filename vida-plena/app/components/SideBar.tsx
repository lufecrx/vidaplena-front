'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '../auth/Authcontext'
import { getNavForUser } from '../lib/Navegation'
import Button from './Button'
import { IconPlaceholder, Logo } from './Icons'


export function Sidebar() {
  const { usuario } = useAuth()
  const pathname = usePathname()

  const navGroups = usuario ? getNavForUser(usuario.tipos) : []

  return (
    <aside
      className={"fixed inset-y-0 left-0 z-40 flex flex-col bg-brand-primary transition-all duration-300 w-68"}
     >
      {/* ÁREA DA LOGO */}
      <div className="px-4 py-5 self-center">
           <Logo />
      </div>

      <div className="mx-4 h-px bg-white/10 mb-4" />

      {/* BOTÕES DE NAVEGAÇÃO */}
      <nav className="flex flex-col items-center overflow-y-auto py-4 scrollbar-thin gap-3">
        {navGroups.flatMap((group) => group.items).map((item) => {
          const isActive =
            pathname === item.href ||
            pathname.startsWith(item.href + '/')

          return (
                <Button
                   key={item.href}
                   variant={isActive ? 'outline' : 'transparent'}
                   size='md'
                   className={
                      isActive ?
                      "w-54 text-vp-verde-500 bg-vp-verde-500/10 hover:bg-vp-verde-500/10" :
                      "w-54 text-white/60 border border-transparent hover:text-white hover:bg-transparent hover:border hover:border-white"}
             >
               <Link
                  href={item.href}
                  title={item.label}
                  className="relative flex w-full items-center px-4 gap-2.5"
                >
                   <span className="flex h-5 w-5 shrink-0 items-center justify-center text-base">
                         <IconPlaceholder name={item.icon} />
                   </span>
                   {item.label}
                </Link>
              </Button>
          )
        })}
      </nav>

      {/* ÁREA DO USUÁRIO */}
      {usuario && (
        <>
         <div className="mx-4 h-px bg-white/10 mt-auto" />

         <div className={"p-3 flex justify-center"}>
            <div className="flex items-center gap-3">
               <div className="h-8 w-8 shrink-0 rounded-full bg-[#4DBFA8] flex items-center justify-center text-[#1A3A5C] text-xs font-bold">
                  {usuario.nome.charAt(0).toUpperCase()}
               </div>

               <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{usuario.nome}</p>
                  <p className="truncate text-xs text-white/50">{usuario.tipos[0]}</p>
               </div>
            </div>
         </div>
        </>
      )}
    </aside>
  )
}
