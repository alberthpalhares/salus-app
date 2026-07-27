import React from 'react';
import { HeartPulse } from 'lucide-react';

export interface CarregandoProps {
  mensagem?: string;
  fullScreen?: boolean;
}

export const Carregando: React.FC<CarregandoProps> = ({
  mensagem = 'Carregando...',
  fullScreen = false,
}) => {
  const conteudo = (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div className="p-4 bg-teal-500/10 border border-teal-500/20 rounded-2xl text-teal-600 animate-pulse mb-3">
        <HeartPulse className="w-8 h-8 animate-bounce" />
      </div>
      <p className="text-sm font-semibold text-slate-700">{mensagem}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        {conteudo}
      </div>
    );
  }

  return conteudo;
};
