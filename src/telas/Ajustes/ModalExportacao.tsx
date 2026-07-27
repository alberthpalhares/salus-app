import React from 'react';
import { Badge } from '../../componentes/ui/Badge';
import { FileArchive, X, RefreshCw } from 'lucide-react';

interface ModalExportacaoProps {
  exportando: boolean;
  progressoExport: string;
  onExportar: (opcaoCompleta: boolean) => void;
  onFechar: () => void;
}

export const ModalExportacao: React.FC<ModalExportacaoProps> = ({
  exportando,
  progressoExport,
  onExportar,
  onFechar,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <FileArchive className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-slate-900 text-lg">Exportar Meus Dados</h3>
          </div>
          <button onClick={onFechar} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          O arquivo gerado contém o <strong>_index.yaml</strong>, todos os arquivos markdown organizados na árvore <strong>Familia/</strong> e <strong>Perfis/</strong>, e o arquivo <strong>salus-app-backup.json</strong> para garantia de portabilidade total.
        </p>

        {exportando ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
            <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin mx-auto" />
            <p className="text-xs font-bold text-emerald-900">{progressoExport}</p>
            <p className="text-[11px] text-emerald-700">Aguarde, este processo pode levar alguns instantes.</p>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            <button
              onClick={() => onExportar(true)}
              className="w-full text-left p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/50 hover:bg-emerald-100/60 transition-colors space-y-1 cursor-pointer"
            >
              <div className="flex items-center justify-between font-bold text-sm text-emerald-900">
                <span>Exportação Completa (com Documentos)</span>
                <Badge variante="teal">Recomendado</Badge>
              </div>
              <p className="text-xs text-emerald-700">
                Gera o arquivo ZIP e baixa também as cópias dos arquivos PDF/imagens armazenados no seu Google Drive.
              </p>
            </button>

            <button
              onClick={() => onExportar(false)}
              className="w-full text-left p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors space-y-1 cursor-pointer"
            >
              <div className="font-bold text-sm text-slate-800">
                Só os dados estruturados (Rápido)
              </div>
              <p className="text-xs text-slate-500">
                Gera instantaneamente o ZIP com _index.yaml, markdowns de cada perfil e o dump JSON, sem baixar arquivos do Drive.
              </p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
