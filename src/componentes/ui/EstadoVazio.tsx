import React from 'react';
import { Card } from './Card';

export interface EstadoVazioProps {
  titulo: string;
  descricao: string;
  icone?: React.ReactNode;
  acao?: React.ReactNode;
  className?: string;
}

export const EstadoVazio: React.FC<EstadoVazioProps> = ({
  titulo,
  descricao,
  icone,
  acao,
  className = '',
}) => {
  return (
    <Card className={`text-center py-12 px-6 ${className}`}>
      {icone && (
        <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 mb-4">
          {icone}
        </div>
      )}
      <h3 className="text-lg font-bold text-slate-800 mb-2">{titulo}</h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">{descricao}</p>
      {acao && <div className="flex justify-center">{acao}</div>}
    </Card>
  );
};
