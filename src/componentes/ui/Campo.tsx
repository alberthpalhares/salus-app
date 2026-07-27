import React from 'react';

export interface CampoProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  rotulo?: string;
  dica?: string;
  erro?: string;
  textarea?: boolean;
  linhas?: number;
}

export const Campo = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  CampoProps
>(({ rotulo, dica, erro, textarea = false, linhas = 3, id, className = '', ...props }, ref) => {
  const campoId = id || (rotulo ? rotulo.toLowerCase().replace(/\s+/g, '-') : undefined);

  const estiloInput =
    'w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm transition-colors disabled:bg-slate-50 disabled:text-slate-500 min-h-[44px]';

  return (
    <div className={`space-y-1.5 ${className}`}>
      {rotulo && (
        <label htmlFor={campoId} className="block text-sm font-semibold text-slate-700">
          {rotulo}
        </label>
      )}

      {textarea ? (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          id={campoId}
          rows={linhas}
          className={`${estiloInput} py-3 min-h-[80px] ${
            erro ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500' : ''
          }`}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          id={campoId}
          className={`${estiloInput} ${
            erro ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500' : ''
          }`}
          {...props}
        />
      )}

      {erro ? (
        <p className="text-xs font-medium text-rose-600">{erro}</p>
      ) : dica ? (
        <p className="text-xs text-slate-500">{dica}</p>
      ) : null}
    </div>
  );
});

Campo.displayName = 'Campo';
