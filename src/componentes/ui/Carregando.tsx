import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CarregandoProps {
  mensagem?: string;
  fullScreen?: boolean;
  className?: string;
}

export const Carregando: React.FC<CarregandoProps> = ({
  mensagem = 'Carregando...',
  fullScreen = false,
  className,
}) => {
  const container = (
    <div className={cn('flex flex-col items-center justify-center p-8 space-y-3 text-center', className)}>
      <Loader2 className="w-8 h-8 text-teal-600 dark:text-teal-400 animate-spin shrink-0" />
      {mensagem && (
        <p className="text-xs font-bold text-slate-600 dark:text-slate-400 tracking-wide animate-pulse">
          {mensagem}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center">
        {container}
      </div>
    );
  }

  return container;
};
