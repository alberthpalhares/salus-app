import React from 'react';
import { Card } from '../../componentes/ui/Card';
import { Botao } from '../../componentes/ui/Botao';
import { HardDriveUpload, CheckCircle2, Loader2 } from 'lucide-react';

interface BannerConexaoDriveProps {
  driveConectado: boolean;
  carregandoDrive: boolean;
  conectandoDrive: boolean;
  onConectarDrive: () => void;
}

export const BannerConexaoDrive: React.FC<BannerConexaoDriveProps> = ({
  driveConectado,
  carregandoDrive,
  conectandoDrive,
  onConectarDrive,
}) => {
  if (carregandoDrive) return null;

  if (driveConectado) {
    return (
      <div className="p-3 bg-emerald-50/80 border border-emerald-200/90 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-emerald-900 shadow-2xs">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          <strong>Google Drive Conectado:</strong> Seus laudos e documentos originais são guardados com segurança e privacidade na sua própria nuvem.
        </span>
      </div>
    );
  }

  return (
    <Card className="bg-amber-50/80 border-amber-200/90 p-4 space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
            <HardDriveUpload className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-950">
              Conecte o Google Drive para arquivar seus documentos (opcional)
            </h3>
            <p className="text-xs text-amber-900 mt-0.5">
              Sem conectar, você ainda pode organizar documentos normalmente — os dados extraídos são salvos, só o arquivo original não fica anexado. Conecte para guardar o PDF/foto original na pasta &quot;Salus App&quot; do seu próprio Google Drive.
            </p>
          </div>
        </div>
        <Botao
          variante="primario"
          tamanho="sm"
          onClick={onConectarDrive}
          disabled={conectandoDrive}
          icone={
            conectandoDrive ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <HardDriveUpload className="w-4 h-4" />
            )
          }
        >
          {conectandoDrive ? 'Conectando...' : 'Conectar Google Drive'}
        </Botao>
      </div>
    </Card>
  );
};
