import React from 'react';
import { cn } from '@/lib/utils';

export type VarianteBadge =
  | 'sucesso'
  | 'alerta'
  | 'perigo'
  | 'neutro'
  | 'info'
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'teal'
  | 'rose'
  | 'amber'
  | 'vencido';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variante?: VarianteBadge;
  tamanho?: 'sm' | 'md';
  pulse?: boolean;
  icone?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variante = 'neutro',
  tamanho = 'md',
  pulse = false,
  icone,
  className,
  ...props
}) => {
  const variantes: Record<string, string> = {
    sucesso: 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    teal: 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    alerta: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    amber: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    perigo: 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    rose: 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    vencido: 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    info: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    neutro: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    primary: 'bg-teal-600 text-white border-teal-700',
    secondary: 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600',
    outline: 'bg-transparent text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
  };

  const tamanhos: Record<string, string> = {
    sm: 'text-[10px] px-2 py-0.5 font-bold',
    md: 'text-xs px-2.5 py-1 font-bold',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-lg border leading-none whitespace-nowrap shadow-2xs transition-colors gap-1.5',
        variantes[variante] || variantes.neutro,
        tamanhos[tamanho] || tamanhos.md,
        pulse && 'animate-pulse',
        className
      )}
      {...props}
    >
      {pulse && <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />}
      {icone && <span className="shrink-0">{icone}</span>}
      {children}
    </div>
  );
};
