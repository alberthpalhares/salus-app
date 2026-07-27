import React from 'react';
import { Card } from '../../componentes/ui/Card';
import { Botao } from '../../componentes/ui/Botao';
import {
  FolderPlus,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

interface PassoDriveProps {
  driveConectado: boolean;
  conectandoDrive: boolean;
  carregandoDriveStatus: boolean;
  onIniciarConexao: () => void;
  onAvancar: () => void;
  onVoltar: () => void;
}

export const PassoDrive: React.FC<PassoDriveProps> = ({
  driveConectado,
  conectandoDrive,
  carregandoDriveStatus,
  onIniciarConexao,
  onAvancar,
  onVoltar,
}) => {
  return (
    <Card className="space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-2.5 rounded-xl bg-teal-100/80 text-teal-800">
          <FolderPlus className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Conectar Google Drive
          </h2>
          <p className="text-xs text-slate-500">
            Armazenamento seguro e exclusivo para os seus documentos originais de saúde.
          </p>
        </div>
      </div>

      <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-200/60">
        <p>
          O Salus <strong>não guarda nenhum arquivo</strong> (PDFs, laudos, exames ou fotos) na infraestrutura do aplicativo.
        </p>
        <p>
          Todos os seus documentos originais serão salvos diretamente na sua conta do <strong>Google Drive</strong>, em uma pasta dedicada chamada <strong>"Salus App"</strong>.
        </p>
        <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-teal-900 font-medium text-xs">
          ✓ <strong>Consentimento único:</strong> Você autoriza a conexão uma única vez. O acesso funciona em segundo plano, silenciosamente, sem interrupções nos próximos usos.
        </div>
      </div>

      {driveConectado ? (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-900 text-sm font-semibold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Google Drive conectado! A pasta "Salus App" está pronta.</span>
          </div>
          <Botao
            variante="primario"
            tamanho="sm"
            onClick={onAvancar}
            icone={<ArrowRight className="w-4 h-4" />}
          >
            Continuar
          </Botao>
        </div>
      ) : (
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Botao
              variante="primario"
              onClick={onIniciarConexao}
              disabled={conectandoDrive || carregandoDriveStatus}
              icone={<FolderPlus className="w-4 h-4" />}
            >
              {conectandoDrive ? 'Aguardando autorização...' : 'Conectar Google Drive'}
            </Botao>

            <button
              type="button"
              onClick={onAvancar}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline decoration-slate-300 underline-offset-4 py-2 px-3 transition-colors cursor-pointer"
            >
              pular por enquanto
            </button>
          </div>
        </div>
      )}

      <div className="pt-4 flex items-center justify-between border-t border-slate-100">
        <Botao
          variante="secundario"
          onClick={onVoltar}
          icone={<ArrowLeft className="w-4 h-4" />}
        >
          Voltar
        </Botao>

        {driveConectado && (
          <Botao
            variante="primario"
            onClick={onAvancar}
            icone={<ArrowRight className="w-4 h-4" />}
          >
            Continuar
          </Botao>
        )}
      </div>
    </Card>
  );
};
