import React from 'react';
import { DocumentoMembro } from '../../../types/dominio';
import { Card } from '../../../componentes/ui/Card';
import { Botao } from '../../../componentes/ui/Botao';
import { formatarDataExtenso } from '../../../lib/datas';
import { formatarTamanhoArquivo } from '../../../lib/formatacao';
import { FileText, Image as ImageIcon, ExternalLink, Download } from 'lucide-react';

interface ItemDocumentoCardProps {
  documento: DocumentoMembro;
  onAbrirNoDrive: (driveId?: string) => void;
  onBaixarDoDrive: (driveId?: string) => void;
}

export const ItemDocumentoCard: React.FC<ItemDocumentoCardProps> = ({
  documento,
  onAbrirNoDrive,
  onBaixarDoDrive,
}) => {
  const eImagem = documento.mime?.startsWith('image/');

  return (
    <Card className="flex flex-col justify-between gap-4 hover:border-teal-300 transition-colors">
      <div className="space-y-3">
        {/* Miniatura ou Ícone */}
        <div className="w-full h-32 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center overflow-hidden">
          {eImagem ? (
            <div className="flex flex-col items-center justify-center text-teal-700 gap-1">
              <ImageIcon className="w-10 h-10 text-teal-600" />
              <span className="text-xs font-semibold">Imagem anexada</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-500 gap-1">
              <FileText className="w-10 h-10 text-slate-400" />
              <span className="text-xs uppercase tracking-wider font-bold">
                {documento.nome_arquivo.endsWith('.pdf') ? 'PDF' : 'Documento'}
              </span>
            </div>
          )}
        </div>

        <div>
          <h4 className="font-bold text-slate-900 text-sm line-clamp-1">
            {documento.nome_arquivo}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Data: {formatarDataExtenso(documento.data)}
            {documento.tamanho_bytes ? ` • ${formatarTamanhoArquivo(documento.tamanho_bytes)}` : ''}
          </p>
        </div>
      </div>

      {/* Botões de Ação Drive API */}
      <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
        <Botao
          variante="outline"
          tamanho="sm"
          className="flex-1 text-xs"
          icone={<ExternalLink className="w-3.5 h-3.5" />}
          onClick={() => onAbrirNoDrive(documento.drive_file_id)}
        >
          Abrir no Drive
        </Botao>
        <Botao
          variante="secundario"
          tamanho="sm"
          icone={<Download className="w-3.5 h-3.5" />}
          onClick={() => onBaixarDoDrive(documento.drive_file_id)}
          title="Baixar arquivo original"
        >
          Baixar
        </Botao>
      </div>
    </Card>
  );
};
