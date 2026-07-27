import React from 'react';
import { Loader2 } from 'lucide-react';

export interface BotaoProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'primario' | 'secundario' | 'outline' | 'perigo' | 'ghost';
  tamanho?: 'sm' | 'md' | 'lg';
  carregando?: boolean;
  icone?: React.ReactNode;
}

export const Botao: React.FC<BotaoProps> = ({
  children,
  variante = 'primario',
  tamanho = 'md',
  carregando = false,
  icone,
  className = '',
  disabled,
  ...props
}) => {
  const estilosBase =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xs select-none';

  const variantes = {
    primario:
      'bg-teal-600 hover:bg-teal-700 text-white focus:ring-teal-500 shadow-sm active:scale-[0.98]',
    secundario:
      'bg-slate-100 hover:bg-slate-200 text-slate-800 focus:ring-slate-400 border border-slate-200 active:scale-[0.98]',
    outline:
      'border-2 border-teal-600 text-teal-700 hover:bg-teal-50 focus:ring-teal-500 active:scale-[0.98]',
    perigo:
      'bg-rose-700 hover:bg-rose-800 text-white focus:ring-rose-500 shadow-sm active:scale-[0.98]',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-700 focus:ring-slate-400 shadow-none border-0',
  };

  const tamanhos = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 min-h-[36px]',
    md: 'text-sm px-4 py-2.5 gap-2 min-h-[44px]',
    lg: 'text-base px-6 py-3.5 gap-2.5 min-h-[50px]',
  };

  return (
    <button
      className={`${estilosBase} ${variantes[variante]} ${tamanhos[tamanho]} ${className}`}
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
