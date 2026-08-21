import type { RetornaProfissional } from '../services/profissionalService'

interface TabelaProfissionaisProps {
  dados: RetornaProfissional[]
  carregando: boolean
}

export default function TabelaProfissionais({ dados, carregando }: TabelaProfissionaisProps) {
  if (carregando) {
    return null
  }

  if (!dados || dados.length === 0) {
    return null
  }

  return (
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="table-header-base text-left">Nome</th>
                <th className="table-header-base">Conselho</th>
                <th className="table-header-base text-left">Especialidade</th>
              </tr>
            </thead>
            <tbody>
              {dados.map((prof) => {
                const temNome = Boolean(prof.nome)

               return (
              <tr key={prof.id} className="hover:bg-gray-50">
                <td className="table-cell-base text-left">
                  {temNome ? prof.nome : <span className="text-gray-400 italic">Indisponivel</span>}
                </td>
                <td className="table-cell-base">
                  {prof.registroConselho}
                </td>
                <td className="table-cell-base text-left">
                  {prof.especialidade}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}