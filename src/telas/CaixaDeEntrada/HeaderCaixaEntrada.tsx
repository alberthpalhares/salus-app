import React from 'react';
import { Badge } from '../../componentes/ui/Badge';
import { Botao } from '../../componentes/ui/Botao';
import { HardDrive, Loader2, Sparkles, AlertCircle, Clock } from 'lucide-react';

interface HeaderCaixaEntradaProps {
  temChaveIA: boolean;
  processandoFila: boolean;
  pendentesCount: number;
  totalItens: number;
  avisoChaveAusente: boolean;
  setAvisoChaveAusente: (v: boolean) => void;
  onOrganizarDocumentos: () => void;
}

export const HeaderCaixaEntrada: React.FC<HeaderCaixaEntradaProps> = ({
  temChaveIA,
  processandoFila,
  pendentesCount,
  totalItens,
  avisoChaveAusente,
  setAvisoChaveAusente,
  onOrganizarDocumentos,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Caixa de Entrada
            </h1>
            <Badge variante="teal" icone={<HardDrive className="w-3.5 h-3.5" />}>
              Google Drive
            </Badge>
          </div>
          <p className="text-sm text-slate-600">
            Receba e armazene laudos, exames e receitas com segurança na pasta "Salus App" do seu Google Drive.
          </p>
        </div>

        <div className="flex flex-col sm:items-end gap-1 shrink-0">
          <Botao
            variante="primario"
            tamanho="sm"
            onClick={onOrganizarDocumentos}
            disabled={processandoFila || totalItens === 0}
            icone={
              processandoFila ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Sparkles className="w-4 h-4 text-white" />
              )
            }
          >
            {processandoFila
              ? 'Organizando...'
              : `Organizar documentos ${pendentesCount > 0 ? `(${pendentesCount})` : ''}`}
          </Botao>
          {!temChaveIA && (
            <span className="text-[11px] text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Requer chave Gemini
            </span>
          )}
        </div>
      </div>

      {avisoChaveAusente && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-amber-900 text-sm shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              Para organizar documentos com inteligência artificial, você precisa cadastrar sua chave gratuita do Gemini em <strong>Ajustes</strong>.
            </span>
          </div>
          <button
            onClick={() => setAvisoChaveAusente(false)}
            className="text-amber-800 hover:text-amber-950 font-semibold text-xs whitespace-nowrap underline cursor-pointer"
          >
            Entendi
          </button>
        </div>
      )}

      {pendentesCount > 0 && !processandoFila && (
        <div className="flex items-center justify-between gap-3 p-3.5 bg-amber-50/90 border border-amber-200 rounded-xl text-amber-900 text-sm shadow-xs">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-amber-600 shrink-0" />
            <span className="font-semibold">
              {pendentesCount === 1
                ? '1 documento aguardando organização pela IA'
                : `${pendentesCount} documentos aguardando organização pela IA`}
            </span>
          </div>
          <span className="text-xs text-amber-700 hidden sm:inline font-medium">
            Clique em "Organizar documentos" no topo para analisar
          </span>
        </div>
      )}
    </div>
  );
};
