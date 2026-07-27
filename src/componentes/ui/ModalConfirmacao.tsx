import React, { useEffect } from 'react';
import { Botao } from './Botao';
import { AlertTriangle, X } from 'lucide-react';

export interface ModalConfirmacaoProps {
  aberto: boolean;
  titulo: string;
  descricao: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  variante?: 'perigo' | 'primario';
  carregando?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export const ModalConfirmacao: React.FC<ModalConfirmacaoProps> = ({
  aberto,
  titulo,
  descricao,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  variante = 'perigo',
  carregando = false,
  onConfirmar,
  onCancelar,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && aberto && !carregando) {
        onCancelar();
      }
    };
    if (aberto) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [aberto, carregando, onCancelar]);

  if (!aberto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !carregando) onCancelar();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-confirmacao-titulo"
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                variante === 'perigo'
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-teal-100 text-teal-700'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 id="modal-confirmacao-titulo" className="text-base font-bold text-slate-900">
              {titulo}
            </h3>
          </div>
          <button
            onClick={onCancelar}
            disabled={carregando}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">{descricao}</p>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Botao
            type="button"
            variante="ghost"
            tamanho="sm"
            onClick={onCancelar}
            disabled={carregando}
          >
            {textoCancelar}
          </Botao>
          <Botao
            type="button"
            variante={variante}
            tamanho="sm"
            onClick={onConfirmar}
            carregando={carregando}
          >
            {textoConfirmar}
          </Botao>
        </div>
      </div>
    </div>
  );
};
