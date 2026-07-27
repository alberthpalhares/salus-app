import React, { useState, useEffect } from 'react';
import { Card } from '../../componentes/ui/Card';
import { Botao } from '../../componentes/ui/Botao';
import { Badge } from '../../componentes/ui/Badge';
import { useAuth } from '../../auth/AuthProvider';
import { executarBackup, verificarBackup } from '../../servicos/api';
import { HardDrive, RefreshCw, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export const SecaoBackup: React.FC = () => {
  const { userConfig, updateUserConfig } = useAuth();
  const [executando, setExecutando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [statusBackup, setStatusBackup] = useState<{
    vencido: boolean;
    ultimo_backup?: string | null;
    dias_sem_backup?: number;
  }>({ vencido: false });

  const checarStatus = async () => {
    try {
      const res = await verificarBackup();
      setStatusBackup(res);
    } catch {
      // Ignorar se endpoint indisponível offline
    }
  };

  useEffect(() => {
    checarStatus();
  }, []);

  const handleExecutarBackup = async () => {
    setExecutando(true);
    setMensagem(null);
    setErro(null);

    try {
      const res = await executarBackup();
      if (res.success) {
        setMensagem(`Backup concluído! Salvo como ${res.arquivo || 'JSON no Drive'}.`);
        await checarStatus();
      }
    } catch (err: unknown) {
      setErro((err as Error).message || 'Erro ao executar backup.');
    } finally {
      setExecutando(false);
    }
  };

  const handleToggleAutoBackup = async () => {
    const novoValor = !userConfig.backup_automatico;
    try {
      await updateUserConfig({ backup_automatico: novoValor });
    } catch (err: unknown) {
      console.error('Erro ao atualizar preferencia de backup:', err);
    }
  };

  const driveConectado = !!userConfig.drive_conectado;

  return (
    <Card>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-800">Backup dos Dados</h3>
              {statusBackup.vencido ? (
                <Badge variante="vencido">Backup pendente (+7 dias)</Badge>
              ) : statusBackup.ultimo_backup ? (
                <Badge variante="teal">Em dia</Badge>
              ) : (
                <Badge variante="neutro">Não realizado</Badge>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Copie todos os seus registros do Firestore diretamente para a pasta <code className="bg-slate-100 px-1 rounded text-teal-800 font-mono">_backups</code> do seu Google Drive.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs text-slate-600 mb-4">
        <div className="flex items-center justify-between">
          <span className="font-medium text-slate-700">Backup automático semanal</span>
          <button
            type="button"
            role="switch"
            aria-checked={userConfig.backup_automatico || false}
            disabled={!driveConectado}
            onClick={handleToggleAutoBackup}
            className={`
              relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
              ${userConfig.backup_automatico ? 'bg-teal-600' : 'bg-slate-300'}
            `}
          >
            <span
              className={`
                pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out
                ${userConfig.backup_automatico ? 'translate-x-5' : 'translate-x-0'}
              `}
            />
          </button>
        </div>

        {statusBackup.ultimo_backup && (
          <div className="flex items-center gap-1.5 text-slate-500 pt-1 border-t border-slate-200/60">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Último backup: {new Date(statusBackup.ultimo_backup).toLocaleDateString('pt-BR')} às {new Date(statusBackup.ultimo_backup).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        )}
      </div>

      {mensagem && (
        <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 mb-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{mensagem}</span>
        </div>
      )}

      {erro && (
        <div className="flex items-center gap-2 text-xs text-rose-800 bg-rose-50 p-2.5 rounded-lg border border-rose-200 mb-4">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{erro}</span>
        </div>
      )}

      <div className="flex items-center justify-end">
        <Botao
          type="button"
          variante="secundario"
          tamanho="sm"
          onClick={handleExecutarBackup}
          disabled={executando || !driveConectado}
          carregando={executando}
          icone={<RefreshCw className="w-3.5 h-3.5" />}
        >
          {executando ? 'Gerando backup...' : 'Fazer backup agora'}
        </Botao>
      </div>
    </Card>
  );
};
