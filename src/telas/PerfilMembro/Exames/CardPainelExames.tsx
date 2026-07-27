import React from 'react';
import { Exame } from '../../../types/dominio';
import { Card } from '../../../componentes/ui/Card';
import { Badge } from '../../../componentes/ui/Badge';
import { FileSpreadsheet } from 'lucide-react';
import { formatarDataExtenso } from '../../../lib/datas';

interface CardPainelExamesProps {
  nomePainel: string;
  listaExames: Exame[];
}

export const CardPainelExames: React.FC<CardPainelExamesProps> = ({
  nomePainel,
  listaExames,
}) => {
  const renderBadgeFlag = (exFlag: string) => {
    if (exFlag === 'alto') {
      return (
        <Badge variante="alerta" tamanho="sm">
          o laboratório sinalizou como alto
        </Badge>
      );
    }
    if (exFlag === 'baixo') {
      return (
        <Badge variante="alerta" tamanho="sm">
          o laboratório sinalizou como baixo
        </Badge>
      );
    }
    if (exFlag === 'normal') {
      return (
        <Badge variante="teal" tamanho="sm">
          normal
        </Badge>
      );
    }
    return (
      <Badge variante="neutro" tamanho="sm">
        sinalização não informada
      </Badge>
    );
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-teal-600" />
          {nomePainel}
        </h3>
        <span className="text-xs text-slate-500 font-medium">
          {listaExames.length} {listaExames.length === 1 ? 'marcador' : 'marcadores'}
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {listaExames.map((ex) => (
          <div
            key={ex.id}
            className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">{ex.marcador}</span>
                {renderBadgeFlag(ex.flag)}
              </div>

              <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>Data: {formatarDataExtenso(ex.data)}</span>
                <span>•</span>
                <span>
                  Faixa de referência:{' '}
                  {ex.faixa_referencia_laudo && ex.faixa_referencia_laudo.trim() !== '' ? (
                    <span className="text-slate-700 font-medium">
                      {ex.faixa_referencia_laudo}
                    </span>
                  ) : (
                    <span className="text-slate-400 italic">
                      faixa não informada no laudo
                    </span>
                  )}
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <span className="text-base font-extrabold text-slate-900">
                {ex.valor} <span className="text-xs font-normal text-slate-500">{ex.unidade}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
