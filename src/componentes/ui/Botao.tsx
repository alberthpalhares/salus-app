import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BotaoProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'primario' | 'secundario' | 'outline' | 'perigo' | 'ghost' | 'default' | 'destructive' | 'link';
  tamanho?: 'sm' | 'md' | 'lg' | 'default';
  carregando?: boolean;
  icone?: React.ReactNode;
}

export const Botao: React.FC<BotaoProps> = ({
  children,
  variante = 'primario',
  tamanho = 'md',
  carregando = false,
  icone,
  className,
  disabled,
  ...props
}) => {
  const estilosBase =
    'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none active:scale-[0.97]';

  const variantesMap: Record<string, string> = {
    primario: 'bg-primary hover:bg-teal-700 text-primary-foreground shadow-xs',
    default: 'bg-primary hover:bg-teal-700 text-primary-foreground shadow-xs',
    secundario: 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700',
    secondary: 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700',
    outline: 'border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100',
    perigo: 'bg-destructive hover:bg-rose-700 text-destructive-foreground shadow-xs',
    destructive: 'bg-destructive hover:bg-rose-700 text-destructive-foreground shadow-xs',
    ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-none border-0',
    link: 'text-teal-600 dark:text-teal-400 hover:underline p-0 h-auto bg-transparent border-0 shadow-none',
  };

  const tamanhosMap: Record<string, string> = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 min-h-[36px]',
    md: 'text-sm px-4 py-2.5 gap-2 min-h-[44px]',
    default: 'text-sm px-4 py-2.5 gap-2 min-h-[44px]',
    lg: 'text-base px-6 py-3.5 gap-2.5 min-h-[50px]',
  };

  return (
    <button
      className={cn(estilosBase, variantesMap[variante] || variantesMap.primario, tamanhosMap[tamanho] || tamanhosMap.md, className)}
      disabled={disabled || carregando}
      {...props}
    >
      {carregando ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : icone ? (
        <span className="shrink-0">{icone}</span>
      ) : null}
      <span className="whitespace-nowrap">{children}</span>
    </button>
  );
};

export const Button = Botao;
