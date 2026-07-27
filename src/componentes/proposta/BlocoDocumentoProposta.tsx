import React from 'react';
import { FileText } from 'lucide-react';

interface BlocoDocumentoPropostaProps {
  tipoDoc: string;
  setTipoDoc: (v: string) => void;
  dataDoc: string;
  setDataDoc: (v: string) => void;
  descricaoDoc: string;
  setDescricaoDoc: (v: string) => void;
  nomePadronizadoCalculado: string;
  nomeMembroSelecionado: string;
  tipoFormatado: string;
}

export const BlocoDocumentoProposta: React.FC<BlocoDocumentoPropostaProps> = ({
  tipoDoc,
  setTipoDoc,
  dataDoc,
  setDataDoc,
  descricaoDoc,
  setDescricaoDoc,
  nomePadronizadoCalculado,
  nomeMembroSelecionado,
  tipoFormatado,
}) => {
  return (
    <div className="bg-slate-50/80 border border-slate-200/90 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <FileText className="w-4 h-4 text-teal-600" />
        <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
          1. Informações do Documento e Arquivamento
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Tipo do Documento
          </label>
          <select
            value={tipoDoc}
            onChange={(e) => setTipoDoc(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500"
          >
            <option value="exame">Exame de Laboratório / Imagem</option>
            <option value="laudo">Laudo Médico / Consulta</option>
            <option value="receita">Receita / Prescrição Médica</option>
            <option value="requisicao">Requisição / Pedido de Exame</option>
            <option value="audio">Áudio / Apontamento</option>
            <option value="outro">Outros Documentos</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Data do Documento
          </label>
          <input
            type="date"
            value={dataDoc}
            onChange={(e) => setDataDoc(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Descrição Curta
          </label>
          <input
            type="text"
            value={descricaoDoc}
            onChange={(e) => setDescricaoDoc(e.target.value)}
            placeholder="Ex: Hemograma, Losartana..."
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      <div className="p-3 bg-white border border-teal-200/80 rounded-xl space-y-2 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-slate-500 font-medium">Nome padronizado do arquivo:</span>
          <code className="font-mono font-bold text-teal-800 bg-teal-50 px-2 py-1 rounded border border-teal-200">
            {nomePadronizadoCalculado}
          </code>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
          <span className="text-slate-500 font-medium">Destino no Google Drive:</span>
          <span className="font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md">
            Pasta Salus App / <strong>{nomeMembroSelecionado}</strong> / {tipoFormatado}
          </span>
        </div>
      </div>
    </div>
  );
};
