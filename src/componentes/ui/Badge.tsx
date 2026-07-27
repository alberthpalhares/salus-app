import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variante?: 'neutro' | 'teal' | 'alerta' | 'vencido';
  tamanho?: 'sm' | 'md';
  icone?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variante = 'neutro',
  tamanho = 'md',
  icone,
  className = '',
}) => {
  const variantes = {
    neutro: 'bg-slate-100 text-slate-700 border-slate-200',
    teal: 'bg-teal-50 text-teal-800 border-teal-200 font-medium',
    alerta: 'bg-amber-50 text-amber-800 border-amber-200 font-medium',
    vencido: 'bg-rose-50 text-rose-800 border-rose-200 font-semibold',
  };

  const tamanhos = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  return (
    <span
      className={`inline-flex items-center rounded-lg border leading-none whitespace-nowrap ${variantes[variante]} ${tamanhos[tamanho]} ${className}`}
    >
      {icone && <span className="shrink-0">{icone}</span>}
      <span>{children}</span>
    </span>
  );
};
