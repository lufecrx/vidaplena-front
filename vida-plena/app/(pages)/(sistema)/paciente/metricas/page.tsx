'use client'

const dadosPressao = [
  { label: 'Jan', valor: 142 },
  { label: 'Fev', valor: 138 },
  { label: 'Mar', valor: 135 },
  { label: 'Abr', valor: 128 },
  { label: 'Mai', valor: 124 },
  { label: 'Jun', valor: 120 },
]

const dadosCefaleia = [
  { label: 'Jan', valor: 8 },
  { label: 'Fev', valor: 9 },
  { label: 'Mar', valor: 6 },
  { label: 'Abr', valor: 5 },
  { label: 'Mai', valor: 3 },
  { label: 'Jun', valor: 2 },
]

const dadosLipidicos = [
  { label: 'Jan', valor: 168 },
  { label: 'Fev', valor: 160 },
  { label: 'Mar', valor: 145 },
  { label: 'Abr', valor: 130 },
  { label: 'Mai', valor: 115 },
  { label: 'Jun', valor: 98 },
]

const dadosHabitos = [
  { label: 'Jan', valor: 26 },
  { label: 'Fev', valor: 23 },
  { label: 'Mar', valor: 16 },
  { label: 'Abr', valor: 11 },
  { label: 'Mai', valor: 7 },
  { label: 'Jun', valor: 3 },
]

import { StatCard, GraficoCard, TextCard } from "@/app/components/Card";


export default function PacienteMetricas() {

   return (
      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="IMC"
          value="22.4 normal"
          iconName=""
          trendValue=""
          trendLabel=""
          isPositive={true}
        />

        <StatCard
          title="Passos diários"
          value="11.936"
          iconName=""
          trendValue=""
          trendLabel=""
          isPositive={true}
        />

        <StatCard
          title="Média Cardíaca"
          value="92 bpm"
          iconName=""
          trendValue=""
          trendLabel=""
          isPositive={true}
        />

        <StatCard
          title="Pressão Arterial"
          value="120/80 mmHg"
          iconName=""
          trendValue=""
          trendLabel=""
          isPositive={true}
         />

         <div className="col-span-4">
            <TextCard
               title="Exames Recentes"
               text={
                  <>
                     <div className="grid grid-cols-2 gap-6">
                       <GraficoCard
                         title="Evolução da pressão arterial"
                         subtitle="2026.1 - Média mensal em mmHg"
                         dados={dadosPressao}
                         tipo="area"
                         cor="#0284c7"
                       />

                       <GraficoCard
                         title="Diário de Cefaleia/Enxaqueca"
                         subtitle="2026.1 - Intensidade máxima (Escala 0-10)"
                         dados={dadosCefaleia}
                         tipo="barras"
                         cor="#e11d48"
                       />

                       <GraficoCard
                         title="Perfil Lipídico / Colesterol"
                         subtitle="2026.1 - Colesterol LDL em mg/dL"
                         dados={dadosLipidicos}
                         tipo="area"
                         cor="#0284c7"
                       />

                       <GraficoCard
                         title="Hábitos: Cafeína vs Tabaco"
                         subtitle="2026.1 - Consumo médio diário"
                         dados={dadosHabitos}
                         tipo="barras"
                         cor="#d97706"
                       />
                     </div>
                  </>
               }
            />
         </div >

      </div>

   )
}
