import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, X } from 'lucide-react';

interface ToastSucessoConfirmacaoProps {
  membroId: string;
  membroNome: string;
  onFechar: () => void;
}

export const ToastSucessoConfirmacao: React.FC<ToastSucessoConfirmacaoProps> = ({
  membroId,
  membroNome,
  onFechar,
}) => {
  return (
    <div className="p-4 bg-emerald-50/90 border-2 border-emerald-300 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-emerald-950 text-sm shadow-xs animate-fade-in">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <p className="font-bold text-slate-900">Documento arquivado com sucesso!</p>
          <p className="text-xs text-slate-600">
            Os dados clínicos e o arquivo no Google Drive foram salvos no perfil de <strong>{membroNome}</strong>.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link
          to={`/membro/${membroId}`}
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-900 bg-white px-3.5 py-2 rounded-xl border border-emerald-300 hover:bg-emerald-100 transition-colors shadow-xs"
        >
          Ver no perfil de {membroNome} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <button
          onClick={onFechar}
          className="text-emerald-700 hover:text-emerald-950 p-1.5 rounded-lg hover:bg-emerald-100/50 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
