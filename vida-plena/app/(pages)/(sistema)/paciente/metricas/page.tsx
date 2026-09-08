import { StatCard } from "@/app/components/Card";

export default function PacienteMetricas() {

   return (
      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Peso Atual"
          value="72.5 kg"
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

        <StatCard
          title="Glicemia"
          value="95.0 mg/dL"
          iconName=""
          trendValue=""
          trendLabel=""
          isPositive={true}
        />

        <StatCard
          title="Horas de Sono"
          value="7.5 h"
          iconName=""
          trendValue=""
          trendLabel=""
          isPositive={true}
        />

        <StatCard
          title="Consumo de Água"
          value="2.5 L"
          iconName=""
          trendValue=""
          trendLabel=""
          isPositive={true}
        />

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
      </div>
   )
}