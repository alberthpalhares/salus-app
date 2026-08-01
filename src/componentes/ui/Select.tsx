import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  valor: string;
  rotulo: string;
  descricao?: string;
  icone?: React.ReactNode;
}

export interface SelectProps {
  opcoes: SelectOption[];
  valor: string;
  onValueChange: (valor: string) => void;
  placeholder?: string;
  rotulo?: string;
  disabled?: boolean;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  opcoes,
  valor,
  onValueChange,
  placeholder = 'Selecione uma opção...',
  rotulo,
  disabled = false,
  className,
}) => {
  const [aberto, setAberto] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const opcaoSelecionada = opcoes.find((o) => o.valor === valor);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setAberto(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn('space-y-1.5 w-full relative', className)} ref={containerRef}>
      {rotulo && (
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          {rotulo}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => setAberto(!aberto)}
        className={cn(
          'w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed',
          aberto && 'border-teal-500 ring-2 ring-teal-500/20'
        )}
      >
        <span className="flex items-center gap-2 truncate">
          {opcaoSelecionada?.icone && <span className="shrink-0">{opcaoSelecionada.icone}</span>}
          <span className={!opcaoSelecionada ? 'text-slate-400' : ''}>
            {opcaoSelecionada ? opcaoSelecionada.rotulo : placeholder}
          </span>
        </span>
        <ChevronDown className={cn('w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0', aberto && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {aberto && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 z-50 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl max-h-60 overflow-y-auto p-1 space-y-0.5"
          >
            {opcoes.map((opcao) => {
              const selecionado = opcao.valor === valor;
              return (
                <button
                  key={opcao.valor}
                  type="button"
                  onClick={() => {
                    onValueChange(opcao.valor);
                    setAberto(false);
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-left',
                    selecionado
                      ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  )}
                >
                  <span className="flex items-center gap-2">
                    {opcao.icone && <span className="shrink-0">{opcao.icone}</span>}
                    <div>
                      <div>{opcao.rotulo}</div>
                      {opcao.descricao && (
                        <span className="text-[10px] font-normal text-slate-400 block">{opcao.descricao}</span>
                      )}
                    </div>
                  </span>
                  {selecionado && <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
