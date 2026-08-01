import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../componentes/ui/Card';
import { Badge } from '../../componentes/ui/Badge';
import { Users, Activity, Plus, Edit2 } from 'lucide-react';
import { Membro } from '../../types/dominio';
import { AvatarMembro } from '../../componentes/ui/AvatarMembro';

interface GridIntegrantesPainelProps {
  membros: Membro[];
  membrosComCondicoes: Membro[];
  onAdicionarMembro: () => void;
  onEditarMembro?: (membro: Membro) => void;
}

export const GridIntegrantesPainel: React.FC<GridIntegrantesPainelProps> = ({
  membros,
  membrosComCondicoes,
  onAdicionarMembro,
  onEditarMembro,
}) => {
  const navigate = useNavigate();

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
                  <div className="flex items-center gap-2.5">
                    <AvatarMembro membro={m} tamanho="sm" />
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
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-600" />
            <span>Integrantes da Família ({membros.length})</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {membros.map((m) => (
            <div
              key={m.id}
              className="p-3.5 rounded-2xl border border-slate-200/90 bg-white hover:border-teal-500 hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-2 group relative"
            >
              <div
                className="flex items-center gap-3 min-w-0 flex-1"
                onClick={() => navigate(`/membro/${m.id}`)}
              >
                <AvatarMembro membro={m} tamanho="md" />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {m.nome}
                  </p>
                  <p className="text-[11px] text-slate-500 capitalize truncate">
                    {m.tipo === 'cao'
                      ? 'Cão'
                      : m.tipo === 'gato'
                      ? 'Gato'
                      : m.tipo === 'pessoa'
                      ? 'Pessoa'
                      : 'Pet'}
                    {m.tipo_sanguineo ? ` • ${m.tipo_sanguineo}` : ''}
                  </p>
                </div>
              </div>

              {onEditarMembro && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditarMembro(m);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-teal-700 hover:bg-teal-50 transition-colors opacity-0 group-hover:opacity-100"
                  title="Editar Integrante"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}

          <div
            onClick={onAdicionarMembro}
            className="p-3.5 rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 min-h-[64px]"
          >
            <Plus className="w-4 h-4 text-teal-600" />
            <span>Adicionar Integrante</span>
          </div>
        </div>
      </div>
    </div>
  );
};

