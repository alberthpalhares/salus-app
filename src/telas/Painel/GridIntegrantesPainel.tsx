import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../componentes/ui/Card';
import { Badge } from '../../componentes/ui/Badge';
import { Users, Dog, Cat, PawPrint, Activity, Plus } from 'lucide-react';
import { Membro, TipoMembro } from '../../types/dominio';

interface GridIntegrantesPainelProps {
  membros: Membro[];
  membrosComCondicoes: Membro[];
  onAdicionarMembro: () => void;
}

export const GridIntegrantesPainel: React.FC<GridIntegrantesPainelProps> = ({
  membros,
  membrosComCondicoes,
  onAdicionarMembro,
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

  return (
    <div className="space-y-6">
      {/* Condições em Acompanhamento */}
      <Card className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Activity className="w-5 h-5 text-teal-700" />
          <h2 className="text-base font-bold text-slate-900">
            Condições em Acompanhamento
          </h2>
        </div>

        {membrosComCondicoes.length === 0 ? (
          <p className="text-xs text-slate-500 py-2">
            Nenhuma condição clínica de acompanhamento ativo registrada.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {membrosComCondicoes.map((m) => {
              const conds = m.condicoes_ativas || m.condicoes || [];
              return (
                <div
                  key={m.id}
                  onClick={() => navigate(`/membro/${m.id}`)}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/60 transition-colors cursor-pointer space-y-2"
                >
                  <div className="flex items-center gap-2">
                    {renderIconeMembro(m.tipo)}
                    <span className="text-xs font-extrabold text-slate-900">
                      {m.nome}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {conds.map((c, idx) => (
                      <Badge key={idx} variante="teal" tamanho="sm">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Faixa de Membros */}
      <div className="space-y-3">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-600" />
          <span>Integrantes da Família ({membros.length})</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {membros.map((m) => (
            <div
              key={m.id}
              onClick={() => navigate(`/membro/${m.id}`)}
              className="p-3.5 rounded-2xl border border-slate-200/90 bg-white hover:border-teal-500 hover:shadow-md transition-all cursor-pointer flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-center shrink-0 group-hover:bg-teal-100 transition-colors">
                {renderIconeMembro(m.tipo)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {m.nome}
                </p>
                <p className="text-[11px] text-slate-500 capitalize">
                  {m.tipo === 'cao'
                    ? 'Cão'
                    : m.tipo === 'gato'
                    ? 'Gato'
                    : m.tipo === 'pessoa'
                    ? 'Pessoa'
                    : 'Pet'}
                </p>
              </div>
            </div>
          ))}

          <div
            onClick={onAdicionarMembro}
            className="p-3.5 rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            <Plus className="w-4 h-4 text-teal-600" />
            <span>Adicionar Integrante</span>
          </div>
        </div>
      </div>
    </div>
  );
};
