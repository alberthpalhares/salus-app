import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../componentes/ui/Card';
import { Badge } from '../componentes/ui/Badge';
import { Botao } from '../componentes/ui/Botao';
import { useAuth } from '../auth/AuthProvider';
import { Trash2, ShieldCheck, ArrowRight } from 'lucide-react';
import { SecaoBYOK } from './Ajustes/SecaoBYOK';
import { SecaoDrive } from './Ajustes/SecaoDrive';
import { SecaoBackup } from './Ajustes/SecaoBackup';
import { SecaoPortabilidade } from './Ajustes/SecaoPortabilidade';
import { ModalExportacao } from './Ajustes/ModalExportacao';
import { ModalImportacao } from './Ajustes/ModalImportacao';
import { ModalExclusaoConta } from './Ajustes/ModalExclusaoConta';
import {
  exportarDadosUsuario,
  analisarArquivoBackup,
  executarImportacao,
  excluirTodaAContaDoUsuario,
  ResumoImportacao,
} from '../servicos/portabilidade';

export const AjustesTela: React.FC = () => {
  const { user } = useAuth();

  // Export state
  const [exportando, setExportando] = useState(false);
  const [progressoExport, setProgressoExport] = useState('');
  const [modalExportAberto, setModalExportAberto] = useState(false);

  // Import state
  const [analisandoImport, setAnalisandoImport] = useState(false);
  const [resumoImport, setResumoImport] = useState<ResumoImportacao | null>(null);
  const [modoImport, setModoImport] = useState<'substituir' | 'mesclar'>('substituir');
  const [executandoImport, setExecutandoImport] = useState(false);
  const [progressoImport, setProgressoImport] = useState('');

  // Deletion state
  const [modalExclusaoPasso, setModalExclusaoPasso] = useState<0 | 1 | 2>(0);
  const [excluindoConta, setExcluindoConta] = useState(false);

  const handleExportar = async (opcaoCompleta: boolean) => {
    if (!user) return;
    setExportando(true);
    setProgressoExport('Iniciando exportação...');
    try {
      const tokenAuth = await user.getIdToken();
      const zipBlob = await exportarDadosUsuario(user.uid, tokenAuth, opcaoCompleta, (msg) => {
        setProgressoExport(msg);
      });

      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `salus_historico_saude_${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setModalExportAberto(false);
    } catch (err: unknown) {
      console.error('Erro na exportação:', err);
      alert('Ocorreu um erro ao gerar o arquivo de exportação: ' + ((err as Error).message || 'Erro desconhecido'));
    } finally {
      setExportando(false);
      setProgressoExport('');
    }
  };

  const handleSelecionarArquivoImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalisandoImport(true);
    try {
      const resumo = await analisarArquivoBackup(file);
      setResumoImport(resumo);
    } catch (err: unknown) {
      console.error('Erro ao analisar arquivo de importação:', err);
      alert('Arquivo inválido ou corrompido. Certifique-se de selecionar um arquivo .ZIP exportado do SISAFAM.');
    } finally {
      setAnalisandoImport(false);
      e.target.value = '';
    }
  };

  const handleConfirmarImport = async () => {
    if (!user || !resumoImport) return;
    setExecutandoImport(true);
    setProgressoImport('Iniciando importação dos dados...');
    try {
      const tokenAuth = await user.getIdToken();
      await executarImportacao(user.uid, resumoImport, modoImport, tokenAuth, (msg) => {
        setProgressoImport(msg);
      });

      alert('Importação concluída com sucesso! Recarregando aplicação...');
      window.location.reload();
    } catch (err: unknown) {
      console.error('Erro ao executar importação:', err);
      alert('Ocorreu um erro ao importar os dados: ' + ((err as Error).message || 'Erro desconhecido'));
    } finally {
      setExecutandoImport(false);
      setProgressoImport('');
      setResumoImport(null);
    }
  };

  const handleConfirmarExclusaoConta = async () => {
    if (!user) return;
    setExcluindoConta(true);
    try {
      await excluirTodaAContaDoUsuario(user.uid);
      alert('Sua conta e todos os seus dados estruturados foram apagados permanentemente.');
      window.location.href = '/';
    } catch (err: unknown) {
      console.error('Erro ao excluir conta:', err);
      alert('Erro ao excluir conta: ' + ((err as Error).message || 'Erro desconhecido.'));
    } finally {
      setExcluindoConta(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="pb-2 border-b border-slate-200/80">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Ajustes e Configurações
          </h1>
          <Badge variante="teal">BYOK Ativo</Badge>
        </div>
        <p className="text-sm text-slate-600">
          Gerencie sua chave de API (BYOK), preferências de IA e portabilidade dos dados.
        </p>
      </div>

      <SecaoBYOK />

      <SecaoDrive />

      <SecaoBackup />

      <SecaoPortabilidade
        onAbrirExport={() => setModalExportAberto(true)}
        onSelecionarImportFile={handleSelecionarArquivoImport}
        analisandoImport={analisandoImport}
      />

      <Card>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Transparência, Permissões e Privacidade</h3>
              <p className="text-xs text-slate-500">
                Consulte em linguagem simples como seus dados e documentos de saúde são protegidos.
              </p>
            </div>
          </div>

          <Link
            to="/privacidade"
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors inline-flex items-center gap-1.5"
          >
            Ler Termos &amp; Privacidade <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-800 flex items-center justify-center shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Zona de Perigo — Exclusão de Conta</h3>
              <p className="text-xs text-slate-500">
                Apague sua conta e todos os dados estruturados do SISAFAM App definitivamente.
              </p>
            </div>
          </div>

          <Botao
            type="button"
            variante="outline"
            tamanho="sm"
            onClick={() => setModalExclusaoPasso(1)}
            className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
            icone={<Trash2 className="w-4 h-4 text-red-600" />}
          >
            Apagar minha conta e todos os dados
          </Botao>
        </div>
      </Card>

      {modalExportAberto && (
        <ModalExportacao
          exportando={exportando}
          progressoExport={progressoExport}
          onExportar={handleExportar}
          onFechar={() => setModalExportAberto(false)}
        />
      )}

      {resumoImport && (
        <ModalImportacao
          resumo={resumoImport}
          modoImport={modoImport}
          setModoImport={setModoImport}
          executandoImport={executandoImport}
          progressoImport={progressoImport}
          onConfirmar={handleConfirmarImport}
          onFechar={() => setResumoImport(null)}
        />
      )}

      {modalExclusaoPasso > 0 && (
        <ModalExclusaoConta
          passo={modalExclusaoPasso}
          setPasso={setModalExclusaoPasso}
          onAbrirExport={() => setModalExportAberto(true)}
          onConfirmarExclusao={handleConfirmarExclusaoConta}
          excluindo={excluindoConta}
        />
      )}
    </div>
  );
};
