import React from 'react';
import { Medicamento } from '../../../types/dominio';
import { Card } from '../../../componentes/ui/Card';
import { Badge } from '../../../componentes/ui/Badge';
import { CalendarCheck, AlertCircle, User } from 'lucide-react';
import { formatarDataExtenso } from '../../../lib/datas';

interface CardMedicamentoEmUsoProps {
  med: Medicamento;
  onDescontinuar: (med: Medicamento) => void;
}

export const CardMedicamentoEmUso: React.FC<CardMedicamentoEmUsoProps> = ({
  med,
  onDescontinuar,
}) => {
  return (
    <Card destaque="teal" className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="font-extrabold text-slate-900 text-base">{med.nome}</h4>
          <p className="text-xs font-semibold text-teal-900 mt-0.5">
            {med.dose} {med.frequencia && `• ${med.frequencia}`}
          </p>
        </div>
        <Badge variante="teal" tamanho="sm">
          Em uso
        </Badge>
      </div>

      <div className="text-xs text-slate-600 space-y-1">
        {med.desde && (
          <p className="flex items-center gap-1 text-slate-600">
            <CalendarCheck className="w-3.5 h-3.5 text-teal-600" /> Em uso desde:{' '}
            {formatarDataExtenso(med.desde)}
          </p>
        )}
        {med.renova_em && (
          <p className="flex items-center gap-1 text-amber-800 font-medium">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Renovação da receita:{' '}
            {formatarDataExtenso(med.renova_em)}
          </p>
        )}
        {med.prescrito_por && (
          <p className="flex items-center gap-1 text-slate-500">
            <User className="w-3.5 h-3.5" /> Prescritor: {med.prescrito_por}
          </p>
        )}
      </div>

      <div className="pt-2 border-t border-teal-200/60 flex justify-end">
        <button
          type="button"
          onClick={() => onDescontinuar(med)}
          className="text-xs text-slate-500 hover:text-rose-600 underline cursor-pointer"
        >
          Descontinuar uso
        </button>
      </div>
    </Card>
  );
};
