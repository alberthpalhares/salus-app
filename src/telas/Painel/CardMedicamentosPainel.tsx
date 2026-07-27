import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../componentes/ui/Card';
import { Pill, Clock, Users, Dog, Cat, PawPrint } from 'lucide-react';
import { Medicamento, Membro, TipoMembro } from '../../types/dominio';
import { formatarDataExtenso } from '../../lib/datas';

interface CardMedicamentosPainelProps {
  medicamentosEmUso: Medicamento[];
  medicamentosPrescritos: Medicamento[];
  membros: Membro[];
}

export const CardMedicamentosPainel: React.FC<CardMedicamentosPainelProps> = ({
  medicamentosEmUso,
  medicamentosPrescritos,
  membros,
}) => {
  const navigate = useNavigate();

  const renderIconeMembro = (tipo?: TipoMembro) => {
    switch (tipo) {
      case 'cao':
        return <Dog className="w-4 h-4 text-amber-700 shrink-0" />;
      case 'gato':
        return <Cat className="w-4 h-4 text-purple-700 shrink-0" />;
      case 'outro':
        return <PawPrint className="w-4 h-4 text-blue-700 shrink-0" />;
      case 'pessoa':
      default:
        return <Users className="w-4 h-4 text-teal-700 shrink-0" />;
    }
  };

  const obterNomeMembro = (membroId: string) => {
    const m = membros.find((x) => x.id === membroId);
    return m ? m.nome : 'Membro';
  };

  const obterTipoMembro = (membroId: string) => {
    const m = membros.find((x) => x.id === membroId);
    return m?.tipo;
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Pill className="w-5 h-5 text-teal-700" />
          <h2 className="text-base font-bold text-slate-900">
            Medicamentos em Uso
          </h2>
        </div>
        <span className="text-xs font-semibold text-slate-500">
          {medicamentosEmUso.length} em uso ativo
        </span>
      </div>

      {medicamentosEmUso.length === 0 ? (
        <p className="text-xs text-slate-500 py-2">
          Nenhum medicamento registrado como em uso no momento.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Membro</th>
                <th className="py-2.5 px-3">Medicamento</th>
                <th className="py-2.5 px-3">Dose / Frequência</th>
                <th className="py-2.5 px-3">Desde</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {medicamentosEmUso.map((med) => (
                <tr
                  key={med.id}
                  onClick={() => navigate(`/membro/${med.membro_id}`)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer font-medium"
                >
                  <td className="py-2.5 px-3 whitespace-nowrap font-bold text-slate-900">
                    <div className="flex items-center gap-1.5">
                      {renderIconeMembro(obterTipoMembro(med.membro_id))}
                      <span>{obterNomeMembro(med.membro_id)}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">
                    {med.nome}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">
                    {med.dose}
                    {med.frequencia ? ` — ${med.frequencia}` : ''}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                    {med.desde ? formatarDataExtenso(med.desde) : 'Não informado'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {medicamentosPrescritos.length > 0 && (
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 bg-teal-50/50 p-3 rounded-xl border border-teal-100">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-700 shrink-0" />
            <span className="font-semibold text-teal-950">
              {medicamentosPrescritos.length}{' '}
              {medicamentosPrescritos.length === 1
                ? 'receita aguardando confirmação de início'
                : 'receitas aguardando confirmação de início'}
            </span>
          </div>
          <span className="text-[11px] text-teal-800 font-medium">
            Ver nas fichas dos membros
          </span>
        </div>
      )}
    </Card>
  );
};
