import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../componentes/ui/Card';
import { useAuth } from '../auth/AuthProvider';
import * as membrosRepo from '../data/repositorios/membros';
import * as examesRepo from '../data/repositorios/exames';
import * as medicamentosRepo from '../data/repositorios/medicamentos';
import * as vacinasRepo from '../data/repositorios/vacinas';
import * as eventosRepo from '../data/repositorios/eventos';
import { extrairDocumento, removerArquivoDrive } from '../servicos/api';
import { ItemCaixaEntrada, Membro, Exame, Medicamento, Vacina, Evento } from '../types/dominio';
import { Proposta, SelecaoProposta } from '../types/propostas';
import { aplicarProposta } from '../dominio/proposta';
import { HeaderCaixaEntrada } from './CaixaDeEntrada/HeaderCaixaEntrada';
import { DropzoneCaixaEntrada } from './CaixaDeEntrada/DropzoneCaixaEntrada';
import { ItemCaixaEntradaCard } from './CaixaDeEntrada/ItemCaixaEntradaCard';
import { ToastSucessoConfirmacao } from './CaixaDeEntrada/ToastSucessoConfirmacao';
import { BannerConexaoDrive } from './CaixaDeEntrada/BannerConexaoDrive';
import { tratarErro, ErroTratado } from '../lib/erros';
import { Inbox, AlertCircle, CheckCircle2, Loader2, X } from 'lucide-react';
import { Link } from 'react-router-dom';

// Vercel serverless functions aceitam corpos de até ~4.5MB; base64 tem ~33% de overhead.
const LIMITE_TAMANHO_ARQUIVO = 4 * 1024 * 1024;

export const CaixaDeEntradaTela: React.FC = () => {
  const { user, userConfig, updateUserConfig } = useAuth();
  const [itens, setItens] = useState<ItemCaixaEntrada[]>([]);
  const arquivosEmMemoria = useRef<Map<string, File>>(new Map());
  const [membros, setMembros] = useState<Membro[]>([]);
  const [examesExistentes, setExamesExistentes] = useState<Exame[]>([]);
  const [medicamentosExistentes, setMedicamentosExistentes] = useState<Medicamento[]>([]);
  const [vacinasExistentes, setVacinasExistentes] = useState<Vacina[]>([]);
  const [eventosExistentes, setEventosExistentes] = useState<Evento[]>([]);

  const [driveConectado, setDriveConectado] = useState<boolean>(false);
  const [carregandoDrive, setCarregandoDrive] = useState<boolean>(true);
  const [conectandoDrive, setConectandoDrive] = useState<boolean>(false);

  const [isDragging, setIsDragging] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [arquivosEmUpload, setArquivosEmUpload] = useState<string[]>([]);
  const [erroMensagemObj, setErroMensagemObj] = useState<ErroTratado | null>(null);
  const [sucessoMensagem, setSucessoMensagem] = useState<string | null>(null);
  const [deletandoId, setDeletandoId] = useState<string | null>(null);

  const [confirmacaoSucessoToast, setConfirmacaoSucessoToast] = useState<{
    membroId: string;
    membroNome: string;
  } | null>(null);

  const [processandoFila, setProcessandoFila] = useState<boolean>(false);
  const [itemProcessandoId, setItemProcessandoId] = useState<string | null>(null);
  const [itemExpandidoId, setItemExpandidoId] = useState<string | null>(null);
  const [avisoChaveAusente, setAvisoChaveAusente] = useState<boolean>(false);
  const [submetendoProposta, setSubmetendoProposta] = useState<boolean>(false);

  const temChaveIA = !!(userConfig?.provedor_ia?.chave && userConfig.provedor_ia.chave !== '••••••••');

  // Membros e dados clínicos existentes — usados para comparação "valor atual → valor novo"
  // no Painel de Proposta. A fila de documentos em si não vem mais do Firestore: ela vive
  // só nesta sessão, junto com os bytes dos arquivos em arquivosEmMemoria.
  const carregarDadosExistentes = async () => {
    if (!user) return;
    try {
      const [listaMembros, listaExames, listaMeds, listaVac, listaEvts] =
        await Promise.all([
          membrosRepo.listar(user.uid),
          examesRepo.listar(user.uid).catch(() => []),
          medicamentosRepo.listar(user.uid).catch(() => []),
          vacinasRepo.listar(user.uid).catch(() => []),
          eventosRepo.listar(user.uid).catch(() => []),
        ]);

      setMembros(listaMembros || []);
      setExamesExistentes(listaExames || []);
      setMedicamentosExistentes(listaMeds || []);
      setVacinasExistentes(listaVac || []);
      setEventosExistentes(listaEvts || []);
    } catch (err: unknown) {
      console.error('Erro ao carregar membros e dados existentes:', err);
    }
  };

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
    carregarDadosExistentes();
    checarStatusDrive();
  }, [user]);

  // Os documentos pendentes só existem em memória do navegador (arquivo + estado local).
  // Se a aba fechar antes da confirmação, eles se perdem — avisamos o usuário.
  useEffect(() => {
    if (itens.length === 0) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [itens.length]);

  useEffect(() => {
    const handleMessage = async (e: MessageEvent) => {
      if (e.data?.type === 'DRIVE_CONNECTED') {
        setDriveConectado(true);
        setConectandoDrive(false);
        setErroMensagemObj(null);
        // O callback do server já salvou o token via admin SDK
        await updateUserConfig({ drive_conectado: true });
        setDriveConectado(true);
        setErroMensagemObj(null);
        setConectandoDrive(false);
      } else if (e.data?.type === 'SALUS_DRIVE_AUTH_ERROR') {
        setErroMensagemObj(tratarErro(new Error(e.data.error || 'Erro ao conectar')));
        setConectandoDrive(false);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [user]);

  const handleConectarDrive = async () => {
    if (!user) return;
    setConectandoDrive(true);
    setErroMensagemObj(null);
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
          const timer = setInterval(() => {
            try {
              if (popup.closed) {
                clearInterval(timer);
                setTimeout(() => checarStatusDrive(), 500);
                setTimeout(() => setConectandoDrive(false), 800);
              }
            } catch(e) {}
          }, 1000);
        } else {
          setErroMensagemObj(tratarErro(new Error('O bloqueador de pop-ups impediu a janela de abrir.')));
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

  const processarItemExtracao = async (item: ItemCaixaEntrada) => {
    if (!user || !temChaveIA) return;

    const arquivo = arquivosEmMemoria.current.get(item.id);
    if (!arquivo) {
      const itemErro: ItemCaixaEntrada = {
        ...item,
        status: 'erro',
        erro_mensagem: 'O arquivo não está mais disponível nesta sessão. Remova e envie-o novamente.',
      };
      setItens((prev) => prev.map((i) => (i.id === item.id ? itemErro : i)));
      return;
    }

    setItemProcessandoId(item.id);
    const itemEmProcessamento: ItemCaixaEntrada = {
      ...item,
      status: 'processando',
      erro_mensagem: undefined,
    };
    setItens((prev) => prev.map((i) => (i.id === item.id ? itemEmProcessamento : i)));

    try {
      const proposta = await extrairDocumento(arquivo);
      const itemProposto: ItemCaixaEntrada = {
        ...item,
        status: 'proposto',
        proposta,
        erro_mensagem: undefined,
      };
      setItens((prev) => prev.map((i) => (i.id === item.id ? itemProposto : i)));
      setItemExpandidoId(item.id);
    } catch (err: unknown) {
      const erroTrat = tratarErro(err);
      const itemErro: ItemCaixaEntrada = {
        ...item,
        status: 'erro',
        erro_mensagem: erroTrat.mensagem,
      };
      setItens((prev) => prev.map((i) => (i.id === item.id ? itemErro : i)));
    } finally {
      setItemProcessandoId(null);
    }
  };

  const handleOrganizarDocumentos = async () => {
    if (!temChaveIA) {
      setAvisoChaveAusente(true);
      return;
    }

    const aProcessar = itens.filter(
      (i) => i.status === 'pendente' || i.status === 'erro' || i.status === 'processando'
    );

    if (aProcessar.length === 0) return;

    setAvisoChaveAusente(false);
    setProcessandoFila(true);
    setErroMensagemObj(null);
    setSucessoMensagem(null);

    for (const item of aProcessar) {
      await processarItemExtracao(item);
    }

    setProcessandoFila(false);
    setItemProcessandoId(null);
    setSucessoMensagem('Organização dos documentos concluída!');
  };

  const processarArquivos = async (files: File[]) => {
    if (!user || files.length === 0) return;

    setErroMensagemObj(null);
    setSucessoMensagem(null);

    const invalidos = files.filter((f) => f.size > LIMITE_TAMANHO_ARQUIVO);
    if (invalidos.length > 0) {
      setErroMensagemObj(
        tratarErro('O arquivo excede o tamanho máximo permitido (4 MB). Tente enviar um arquivo menor.')
      );
      return;
    }

    setEnviando(true);
    setArquivosEmUpload(files.map((f) => f.name));

    try {
      const dataHoje = new Date().toISOString().split('T')[0];
      const novosItens: ItemCaixaEntrada[] = [];

      for (const file of files) {
        const id = crypto.randomUUID();
        arquivosEmMemoria.current.set(id, file);
        novosItens.push({
          id,
          nome_arquivo: file.name,
          mime: file.type || 'application/pdf',
          adicionado_em: dataHoje,
          tamanho_bytes: file.size,
          status: 'pendente',
        });
      }

      setItens((prev) => [...prev, ...novosItens]);
      setSucessoMensagem(
        novosItens.length === 1
          ? '1 arquivo pronto para organizar.'
          : `${novosItens.length} arquivos prontos para organizar.`
      );
    } finally {
      setEnviando(false);
      setArquivosEmUpload([]);
    }
  };

  const handleRemover = async (item: ItemCaixaEntrada) => {
    if (!user) return;
    setDeletandoId(item.id);
    setErroMensagemObj(null);
    setSucessoMensagem(null);

    try {
      if (item.drive_file_id) {
        await removerArquivoDrive(item.drive_file_id);
      }
      arquivosEmMemoria.current.delete(item.id);
      setItens((prev) => prev.filter((i) => i.id !== item.id));
      if (itemExpandidoId === item.id) setItemExpandidoId(null);
      setSucessoMensagem('Arquivo removido da Caixa de Entrada.');
    } catch (err: unknown) {
      console.error('Erro ao remover arquivo:', err);
      setErroMensagemObj(tratarErro(err));
    } finally {
      setDeletandoId(null);
    }
  };

  const handleVisualizar = async (item: ItemCaixaEntrada) => {
    if (!user) return;

    if (item.drive_file_id) {
      try {
        const token = await user.getIdToken();
        const res = await fetch(`/api/drive/link/${item.drive_file_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.webViewLink) {
          window.open(data.webViewLink, '_blank');
        } else {
          setErroMensagemObj(tratarErro('O acesso ao Google Drive foi interrompido. Reconecte sua conta em Ajustes para sincronizar arquivos, sem perder nenhum dado.'));
        }
      } catch (err: unknown) {
        setErroMensagemObj(tratarErro(err));
      }
      return;
    }

    const arquivo = arquivosEmMemoria.current.get(item.id);
    if (!arquivo) {
      setErroMensagemObj(tratarErro('O arquivo não está mais disponível nesta sessão.'));
      return;
    }
    const objectUrl = URL.createObjectURL(arquivo);
    window.open(objectUrl, '_blank');
    setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
  };

  const handleConfirmarProposta = async (item: ItemCaixaEntrada, selecao: SelecaoProposta) => {
    if (!user || !item.proposta) return;
    setSubmetendoProposta(true);
    setErroMensagemObj(null);
    setSucessoMensagem(null);

    try {
      const arquivo = driveConectado ? arquivosEmMemoria.current.get(item.id) : undefined;
      const res = await aplicarProposta(user.uid, item.proposta as Proposta, selecao, arquivo);

      if (res.success) {
        arquivosEmMemoria.current.delete(item.id);
        setConfirmacaoSucessoToast({
          membroId: res.membroId,
          membroNome: res.membroNome,
        });

        setItens((prev) => prev.filter((i) => i.id !== item.id));
        if (itemExpandidoId === item.id) setItemExpandidoId(null);
      } else if (res.erroDrive) {
        setErroMensagemObj(tratarErro(res.erroDrive));
      }
    } catch (err: unknown) {
      console.error('Erro ao aplicar proposta:', err);
      setErroMensagemObj(tratarErro(err));
    } finally {
      setSubmetendoProposta(false);
    }
  };

  const pendentesCount = itens.filter(
    (i) => i.status === 'pendente' || i.status === 'erro' || i.status === 'processando'
  ).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <HeaderCaixaEntrada
        temChaveIA={temChaveIA}
        processandoFila={processandoFila}
        pendentesCount={pendentesCount}
        totalItens={itens.length}
        avisoChaveAusente={avisoChaveAusente}
        setAvisoChaveAusente={setAvisoChaveAusente}
        onOrganizarDocumentos={handleOrganizarDocumentos}
      />

      <BannerConexaoDrive
        driveConectado={driveConectado}
        carregandoDrive={carregandoDrive}
        conectandoDrive={conectandoDrive}
        onConectarDrive={handleConectarDrive}
      />

      {erroMensagemObj && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-sm shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{erroMensagemObj.mensagem}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {erroMensagemObj.acao && (
              <Link
                to={erroMensagemObj.acao.link || '/ajustes'}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs transition-colors"
              >
                {erroMensagemObj.acao.rotulo}
              </Link>
            )}
            <button
              onClick={() => setErroMensagemObj(null)}
              className="text-amber-500 hover:text-amber-800 p-1 rounded-md cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {sucessoMensagem && (
        <div className="flex items-center justify-between gap-2 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{sucessoMensagem}</span>
          </div>
          <button onClick={() => setSucessoMensagem(null)} className="text-emerald-500 hover:text-emerald-800 p-1 rounded-md">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {confirmacaoSucessoToast && (
        <ToastSucessoConfirmacao
          membroId={confirmacaoSucessoToast.membroId}
          membroNome={confirmacaoSucessoToast.membroNome}
          onFechar={() => setConfirmacaoSucessoToast(null)}
        />
      )}

      <DropzoneCaixaEntrada
        carregandoDrive={carregandoDrive}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
        enviando={enviando}
        arquivosEmUpload={arquivosEmUpload}
        onProcessarArquivos={processarArquivos}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Documentos Recebidos</h2>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            {itens.length} {itens.length === 1 ? 'item' : 'itens'}
          </span>
        </div>

        {itens.length === 0 ? (
          <Card className="py-12 text-center border-slate-200/80">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-700 mb-1">Nenhum documento pendente</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Sua Caixa de Entrada está vazia. Arraste arquivos ou tire fotos de exames e receitas para começar.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {itens.map((item) => (
              <ItemCaixaEntradaCard
                key={item.id}
                item={item}
                itemProcessandoId={itemProcessandoId}
                itemExpandidoId={itemExpandidoId}
                deletandoId={deletandoId}
                submetendoProposta={submetendoProposta}
                membros={membros}
                examesExistentes={examesExistentes}
                medicamentosExistentes={medicamentosExistentes}
                vacinasExistentes={vacinasExistentes}
                eventosExistentes={eventosExistentes}
                onToggleExpandir={(id) => setItemExpandidoId(itemExpandidoId === id ? null : id)}
                onProcessarExtracao={processarItemExtracao}
                onVisualizar={handleVisualizar}
                onRemover={handleRemover}
                onConfirmarProposta={handleConfirmarProposta}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
