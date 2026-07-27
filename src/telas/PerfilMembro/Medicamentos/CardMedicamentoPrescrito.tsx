import React from 'react';
import { Medicamento } from '../../../types/dominio';
import { Card } from '../../../componentes/ui/Card';
import { Badge } from '../../../componentes/ui/Badge';
import { Botao } from '../../../componentes/ui/Botao';
import { CheckCircle2, User, Calendar } from 'lucide-react';
import { formatarDataExtenso } from '../../../lib/datas';

interface CardMedicamentoPrescritoProps {
  med: Medicamento;
  onConfirmarInicio: (med: Medicamento) => void;
  onDescontinuar: (med: Medicamento) => void;
}

export const CardMedicamentoPrescrito: React.FC<CardMedicamentoPrescritoProps> = ({
  med,
  onConfirmarInicio,
  onDescontinuar,
}) => {
  return (
    <Card destaque="amber" className="space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="font-extrabold text-slate-900 text-base">{med.nome}</h4>
          <p className="text-xs font-semibold text-amber-900 mt-0.5">
            {med.dose} {med.frequencia && `• ${med.frequencia}`}
          </p>
        </div>
        <Badge variante="alerta" tamanho="sm">
          Prescrito
        </Badge>
      </div>

      <div className="text-xs text-slate-600 space-y-1">
        {med.prescrito_por && (
          <p className="flex items-center gap-1 text-slate-500">
            <User className="w-3.5 h-3.5" /> Prescrito por: {med.prescrito_por}
          </p>
        )}
        {med.desde && (
          <p className="flex items-center gap-1 text-slate-500">
            <Calendar className="w-3.5 h-3.5" /> Prescrição de:{' '}
            {formatarDataExtenso(med.desde)}
          </p>
        )}
      </div>

      <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between">
        <Botao
          variante="primario"
          tamanho="sm"
          icone={<CheckCircle2 className="w-4 h-4" />}
          onClick={() => onConfirmarInicio(med)}
        >
          Já estou tomando
        </Botao>

        <button
          type="button"
          onClick={() => onDescontinuar(med)}
          className="text-xs text-slate-500 hover:text-rose-600 underline cursor-pointer"
        >
          Descontinuar
        </button>
      </div>
    </Card>
  );
};
