import React, { useRef } from 'react';
import { Card } from '../../componentes/ui/Card';
import { Botao } from '../../componentes/ui/Botao';
import {
  Inbox,
  Upload,
  Camera,
  Loader2,
} from 'lucide-react';

interface DropzoneCaixaEntradaProps {
  carregandoDrive: boolean;
  isDragging: boolean;
  setIsDragging: (v: boolean) => void;
  enviando: boolean;
  arquivosEmUpload: string[];
  onProcessarArquivos: (files: File[]) => void;
}

export const DropzoneCaixaEntrada: React.FC<DropzoneCaixaEntradaProps> = ({
  carregandoDrive,
  isDragging,
  setIsDragging,
  enviando,
  arquivosEmUpload,
  onProcessarArquivos,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      onProcessarArquivos(filesArray);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      onProcessarArquivos(filesArray);
    }
  };

  if (carregandoDrive) return null;

  return (
    <Card
      className={`border-2 border-dashed transition-all duration-200 text-center p-8 sm:p-10 ${
        isDragging
          ? 'border-teal-500 bg-teal-50/80 scale-[1.005]'
          : 'border-teal-200/90 bg-teal-50/20 hover:border-teal-300'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        multiple
        accept=".pdf,.jpg,.jpeg,.png,.webp,.heic,.heif,.mp3,.m4a,.wav,.ogg,image/*,audio/*,application/pdf"
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleInputChange}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      <div className="max-w-md mx-auto space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center transition-transform group-hover:scale-105">
          <Inbox className="w-7 h-7" />
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-1">
            Arraste e solte seus arquivos aqui
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Aceita exames em PDF, fotos de receitas (JPG, PNG, HEIC) ou áudios.
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Limite de 4 MB por arquivo • Fica só nesta sessão até você confirmar a organização
          </p>
        </div>

        {enviando ? (
          <div className="p-4 bg-white rounded-xl border border-teal-200 shadow-xs space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm font-semibold text-teal-800">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Preparando arquivo(s)...</span>
            </div>
            {arquivosEmUpload.length > 0 && (
              <p className="text-xs text-slate-500 truncate">
                {arquivosEmUpload.join(', ')}
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Botao
              variante="primario"
              tamanho="sm"
              onClick={() => fileInputRef.current?.click()}
              icone={<Upload className="w-4 h-4" />}
            >
              Escolher arquivos
            </Botao>

            <Botao
              variante="outline"
              tamanho="sm"
              onClick={() => cameraInputRef.current?.click()}
              icone={<Camera className="w-4 h-4 text-teal-700" />}
            >
              Tirar foto
            </Botao>
          </div>
        )}
      </div>
    </Card>
  );
};
