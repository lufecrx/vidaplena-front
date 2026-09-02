'use client'

import { useState, useEffect } from 'react'
import { StatCard, RecentUsersCard } from "@/app/components/Card";
import { usuarioService } from '@/app/services/usuarioService';
import { PaginaUsuariosResponse } from '@/app/types/usuario'

export default function AdminPage() {
   const [paginaUsuarios, setPaginaUsuarios] = useState<PaginaUsuariosResponse | null>(null)
   const [loading, setLoading] = useState(true)
   const [page, setPage] = useState(0)

   useEffect(() => {
       async function carregar() {
         try {
           setLoading(true)
           // Chamada direta do seu método (passando página atual e tamanho por página)
           const res = await usuarioService.listarUsuarios(page, 6)
           setPaginaUsuarios(res)
         } catch (error) {
           console.error('Erro ao listar usuários:', error)
         } finally {
           setLoading(false)
         }
       }

       carregar()
     }, [page])


   return (
      <div>

         {/* DEPOIS É POSSIVEL FAZER UMA CHAMADA AO BACKEND E RECEBER ESSES DADOS */}
         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 p-6">
            <StatCard
               title="Total de Usuários"
               value="1.247"
               iconName="Users"
               trendValue="+12%"
               trendLabel="vs. mês anterior"
               isPositive={true}
            />

            <StatCard
               title="Médicos Ativos"
               value="86"
               iconName="Stethoscope"
               trendValue="+4%"
               trendLabel="vs. mês anterior"
               isPositive={true}
            />

            <StatCard
               title="Consultas Hoje"
               value="34"
               iconName="CalendarDays"
               trendValue="+8%"
               trendLabel="vs. mês anterior"
               isPositive={true}
            />

            <StatCard
               title="Novos Cadastros (mês)"
               value="127"
               iconName="Home"
               trendValue="+18%"
               trendLabel="vs. mês anterior"
               isPositive={true}
            />
         </div>

         <div className="p-6">
            <RecentUsersCard
               data={paginaUsuarios}
               loading={loading}
               currentPage={page}
               onPageChange={(newPage) => setPage(newPage)}
            />
         </div>

      </div>
   )
}
