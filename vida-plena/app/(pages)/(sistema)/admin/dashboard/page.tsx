'use client'

import { StatCard, TextCard, GraficoCard } from "@/app/components/Card";


const dadosConsultas = [
  { label: "Jan", valor: 40 },
  { label: "Fev", valor: 65 },
  { label: "Mar", valor: 50 },
  { label: "Abr", valor: 95 },
  { label: "Mai", valor: 120 },
];

export default function AdminPage() {

   return (
     /* Grid de 4 colunas. Deixe as linhas serem criadas automaticamente pelo conteúdo! */
     <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">

       {/* 1. TOPO */}
       <div className="col-span-1 lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         <StatCard title="Total de Usuários" value="1.247" iconName="Users" trendValue="+12%" isPositive={true} />
         <StatCard title="Médicos Ativos" value="86" iconName="Stethoscope" trendValue="+4%" isPositive={true} />
         <StatCard title="Consultas Hoje" value="34" iconName="CalendarDays" trendValue="+8%" isPositive={true} />
         <StatCard title="Novos Cadastros (mês)" value="127" iconName="Home" trendValue="+18%" isPositive={true} />
       </div>

      {/* 2. MEIO/ESQUERDA */}
      <div className="grid col-span-1 lg:col-span-4 md:grid-cols-2 gap-4">
         {/* Gráfico de Área */}
         <GraficoCard
            title="Consultas Realizadas"
            subtitle="Total de atendimentos por mês"
            dados={dadosConsultas}
            tipo="area"
         />

         {/* Gráfico de Barras */}
         <GraficoCard
            title="Novos Usuários"
            subtitle="Cadastros efetuados"
            dados={dadosConsultas}
            tipo="barras"
            cor="#0284c7"
         />
       </div>

      {/* 3. MEIO/DIREITA */}
      <div className="col-span-1 lg:col-span-4">
         <TextCard
            title='Notificações'
            text={"Nenhum aviso."}
         />
      </div>

   </div>
   )
}
