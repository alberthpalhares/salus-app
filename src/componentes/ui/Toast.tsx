import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ToastProps {
  mensagem: string;
  tipo?: 'sucesso' | 'erro' | 'alerta' | 'info';
  visivel: boolean;
  onFechar: () => void;
  duracaoMs?: number;
}

export const Toast: React.FC<ToastProps> = ({
  mensagem,
  tipo = 'sucesso',
  visivel,
  onFechar,
  duracaoMs = 4000,
}) => {
  useEffect(() => {
    if (visivel && duracaoMs > 0) {
      const timer = setTimeout(() => {
        onFechar();
      }, duracaoMs);
      return () => clearTimeout(timer);
    }
  }, [visivel, duracaoMs, onFechar]);

  const config = {
    sucesso: {
      icone: <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />,
      estilos: 'border-teal-200 dark:border-teal-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100',
    },
    erro: {
      icone: <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />,
      estilos: 'border-rose-200 dark:border-rose-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100',
    },
    alerta: {
      icone: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />,
      estilos: 'border-amber-200 dark:border-amber-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100',
    },
    info: {
      icone: <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />,
      estilos: 'border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100',
    },
  };

  const item = config[tipo];

  return (
    <AnimatePresence>
      {visivel && (
        <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
            className={cn(
              'pointer-events-auto flex items-center gap-3 p-4 rounded-2xl border shadow-xl max-w-md min-w-[280px]',
              item.estilos
            )}
          >
            {item.icone}
            <span className="text-xs font-bold leading-snug flex-1">{mensagem}</span>
            <button
              onClick={onFechar}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
