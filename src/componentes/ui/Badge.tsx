import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variante?: 'neutro' | 'teal' | 'alerta' | 'vencido' | 'default' | 'secondary' | 'destructive' | 'outline';
  tamanho?: 'sm' | 'md';
  icone?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variante = 'neutro',
  tamanho = 'md',
  icone,
  className,
  ...props
}) => {
  const variantes: Record<string, string> = {
    neutro: 'bg-slate-100 text-slate-700 border-slate-200/80',
    secondary: 'bg-slate-100 text-slate-700 border-slate-200/80',
    teal: 'bg-teal-50 text-teal-800 border-teal-200/80 font-medium',
    default: 'bg-teal-50 text-teal-800 border-teal-200/80 font-medium',
    alerta: 'bg-amber-50 text-amber-900 border-amber-200/80 font-medium',
    vencido: 'bg-rose-50 text-rose-800 border-rose-200/80 font-semibold',
    destructive: 'bg-rose-50 text-rose-800 border-rose-200/80 font-semibold',
    outline: 'bg-transparent text-slate-700 border-slate-300',
  };

  const tamanhos = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg border leading-none whitespace-nowrap shadow-2xs transition-colors',
        variantes[variante] || variantes.neutro,
        tamanhos[tamanho] || tamanhos.md,
        className
      )}
      {...props}
    >
      {icone && <span className="shrink-0">{icone}</span>}
      <span>{children}</span>
    </span>
  );
};
