import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export interface ToastProps {
  tipo?: 'sucesso' | 'erro' | 'aviso' | 'info';
  titulo?: string;
  mensagem: string;
  onFechar: () => void;
  duracaoMs?: number;
}

export const Toast: React.FC<ToastProps> = ({
  tipo = 'sucesso',
  titulo,
  mensagem,
  onFechar,
  duracaoMs = 4000,
}) => {
  useEffect(() => {
    if (duracaoMs > 0) {
      const timer = setTimeout(() => {
        onFechar();
      }, duracaoMs);
      return () => clearTimeout(timer);
    }
  }, [duracaoMs, onFechar]);

  const estilos = {
    sucesso: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      icone: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    },
    erro: {
      bg: 'bg-rose-50 border-rose-200 text-rose-900',
      icone: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    },
    aviso: {
      bg: 'bg-amber-50 border-amber-200 text-amber-900',
      icone: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    },
    info: {
      bg: 'bg-teal-50 border-teal-200 text-teal-900',
      icone: <Info className="w-5 h-5 text-teal-600 shrink-0" />,
    },
  }[tipo];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-20 md:bottom-6 right-4 left-4 sm:left-auto sm:max-w-md z-50 p-4 rounded-xl border shadow-lg transition-all duration-200 flex items-start gap-3 ${estilos.bg}`}
    >
      {estilos.icone}
      <div className="flex-1 min-w-0">
        {titulo && <h4 className="text-sm font-bold leading-tight mb-0.5">{titulo}</h4>}
        <p className="text-xs leading-relaxed">{mensagem}</p>
      </div>
      <button
        onClick={onFechar}
        className="p-1 rounded-lg hover:bg-black/5 transition-colors text-slate-500 hover:text-slate-800 shrink-0 cursor-pointer"
        aria-label="Fechar notificação"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
