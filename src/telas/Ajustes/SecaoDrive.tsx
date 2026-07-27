import React, { useState, useEffect } from 'react';
import { Card } from '../../componentes/ui/Card';
import { Badge } from '../../componentes/ui/Badge';
import { Botao } from '../../componentes/ui/Botao';
import { useAuth } from '../../auth/AuthProvider';
import { FolderPlus, CheckCircle2 } from 'lucide-react';

export const SecaoDrive: React.FC = () => {
  const { user, updateUserConfig } = useAuth();
  const [driveConectado, setDriveConectado] = useState<boolean>(false);
  const [carregandoDrive, setCarregandoDrive] = useState<boolean>(true);
  const [conectandoDrive, setConectandoDrive] = useState<boolean>(false);

  const checarStatusDrive = async () => {
    if (!user) return;
    setCarregandoDrive(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/drive/status', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDriveConectado(!!data.conectado);
    } catch (err: unknown) {
      console.error('Erro ao consultar status do Drive:', err);
    } finally {
      setCarregandoDrive(false);
    }
  };

  useEffect(() => {
    checarStatusDrive();
  }, [user]);

  useEffect(() => {
    const handleMessage = async (e: MessageEvent) => {
      if (e.data?.type === 'DRIVE_CONNECTED') {
        setDriveConectado(true);
        setConectandoDrive(false);
      } else if (e.data?.type === 'SALUS_DRIVE_AUTH_SUCCESS') {
        // O callback do server já salvou o token via admin SDK
        // Apenas atualizar o estado local
        await updateUserConfig({ drive_conectado: true });
        setDriveConectado(true);
        setConectandoDrive(false);
      } else if (e.data?.type === 'SALUS_DRIVE_AUTH_ERROR') {
        setConectandoDrive(false);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [user]);

  const handleConectarDrive = async () => {
    if (!user) return;
    setConectandoDrive(true);
    try {
      const token = await user.getIdToken();
      const origin = window.location.origin;
      const res = await fetch(`/api/drive/iniciar-conexao?origin=${encodeURIComponent(origin)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.url) {
        const popup = window.open(data.url, 'salus_drive_oauth', 'width=600,height=700');
        if (popup) {
          // Aguardar o popup fechar — tokens já são salvos server-side
          const timer = setInterval(() => {
            try {
              if (popup.closed) {
                clearInterval(timer);
                // Re-checar status pois o callback pode ter salvo o token
                setTimeout(() => checarStatusDrive(), 500);
                setTimeout(() => setConectandoDrive(false), 800);
              }
            } catch(e) {
              // cross-origin error — popup still open
            }
          }, 1000);
        } else {
          setConectandoDrive(false);
        }
      } else {
        setConectandoDrive(false);
      }
    } catch (err: unknown) {
      console.error('Erro ao conectar com Google Drive:', err);
      setConectandoDrive(false);
    }
  };

  const handleDesconectarDrive = async () => {
    if (!user) return;
    setCarregandoDrive(true);
    try {
      const token = await user.getIdToken();
      await fetch('/api/drive/desconectar', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      await updateUserConfig({ drive_conectado: false });
      setDriveConectado(false);
    } catch (err: unknown) {
      console.error('Erro ao desconectar Drive:', err);
    } finally {
      setCarregandoDrive(false);
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
            <FolderPlus className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-800">Google Drive</h3>
              {driveConectado ? (
                <Badge variante="teal">Google Drive: conectado</Badge>
              ) : (
                <Badge variante="neutro">Google Drive: não conectado</Badge>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Os seus arquivos e laudos de saúde são salvos na sua pasta <strong>"Salus App"</strong> do Google Drive.
            </p>
          </div>
        </div>
      </div>

      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-2 mb-4">
        <p>
          O Salus não guarda nenhum arquivo PDF ou foto em servidores próprios. Todos os documentos ficam armazenados diretamente no seu Google Drive com acesso seguro.
        </p>
        {driveConectado && (
          <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Conexão ativa com o escopo drive.file. A pasta Salus App está pronta.</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-2">
        {driveConectado && (
          <Botao
            type="button"
            variante="outline"
            tamanho="sm"
            onClick={handleDesconectarDrive}
            disabled={carregandoDrive}
          >
            Desconectar Drive
          </Botao>
        )}
        <Botao
          type="button"
          variante={driveConectado ? 'outline' : 'primario'}
          tamanho="sm"
          onClick={handleConectarDrive}
          disabled={conectandoDrive || carregandoDrive}
          icone={<FolderPlus className="w-4 h-4" />}
        >
          {conectandoDrive
            ? 'Aguardando autorização...'
            : driveConectado
            ? 'Reconectar Google Drive'
            : 'Conectar Google Drive'}
        </Botao>
      </div>
    </Card>
  );
};
