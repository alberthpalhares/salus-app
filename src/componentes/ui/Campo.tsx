import React from 'react';
import { cn } from '@/lib/utils';

export interface CampoProps extends React.InputHTMLAttributes<HTMLInputElement> {
  rotulo?: string;
  erro?: string;
  dica?: string;
  textarea?: boolean;
  linhas?: number;
}

export const Campo = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, CampoProps>(
  ({ rotulo, erro, dica, textarea, linhas = 3, className, type = 'text', id, ...props }, ref) => {
    const inputId = id || (rotulo ? rotulo.toLowerCase().replace(/\s+/g, '-') : undefined);

    const estilos = cn(
      'w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed',
      erro && 'border-rose-500 focus:ring-rose-500 focus:border-rose-500',
      className
    );

    return (
      <div className="space-y-1.5 w-full">
        {rotulo && (
          <label htmlFor={inputId} className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            {rotulo}
          </label>
        )}
        {textarea ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={inputId}
            rows={linhas}
            className={estilos}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            id={inputId}
            type={type}
            className={estilos}
            {...props}
          />
        )}
        {dica && !erro && <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{dica}</p>}
        {erro && <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">{erro}</p>}
      </div>
    );
  }
);
Campo.displayName = 'Campo';
