import React from 'react';
import { Card } from '../componentes/ui/Card';
import { HeaderCaixaEntrada } from './CaixaDeEntrada/HeaderCaixaEntrada';
import { DropzoneCaixaEntrada } from './CaixaDeEntrada/DropzoneCaixaEntrada';
import { ItemCaixaEntradaCard } from './CaixaDeEntrada/ItemCaixaEntradaCard';
import { ToastSucessoConfirmacao } from './CaixaDeEntrada/ToastSucessoConfirmacao';
import { BannerConexaoDrive } from './CaixaDeEntrada/BannerConexaoDrive';
import { useCaixaEntrada } from './CaixaDeEntrada/useCaixaEntrada';
import { Inbox, AlertCircle, CheckCircle2, Loader2, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CaixaDeEntradaTela: React.FC = () => {
  const {
    itens,
    membros,
    examesExistentes,
    medicamentosExistentes,
    vacinasExistentes,
    eventosExistentes,
    driveConectado,
    carregandoDrive,
    conectandoDrive,
    isDragging,
    setIsDragging,
    enviando,
    arquivosEmUpload,
    erroMensagemObj,
    setErroMensagemObj,
    sucessoMensagem,
    setSucessoMensagem,
    deletandoId,
    confirmacaoSucessoToast,
    setConfirmacaoSucessoToast,
    processandoFila,
    itemProcessandoId,
    itemExpandidoId,
    setItemExpandidoId,
    avisoChaveAusente,
    submetendoProposta,
    temChaveIA,
    handleConectarDrive,
    handleOrganizarDocumentos,
    processarArquivos,
    handleRemover,
    handleVisualizar,
    handleConfirmarProposta,
    processarItemExtracao,
  } = useCaixaEntrada();

  const pendentesCount = itens.filter((i) => i.status === 'pendente' || i.status === 'erro').length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* 1. Banner da Conexão com Google Drive */}
      <BannerConexaoDrive
        driveConectado={driveConectado}
        carregandoDrive={carregandoDrive}
        conectandoDrive={conectandoDrive}
        onConectarDrive={handleConectarDrive}
      />

      {/* 2. Cabeçalho Principal com Botão de Ação */}
      <HeaderCaixaEntrada
        totalItens={itens.length}
        pendentesCount={pendentesCount}
        processandoFila={processandoFila}
        onOrganizarDocumentos={handleOrganizarDocumentos}
        temChaveIA={temChaveIA}
        avisoChaveAusente={avisoChaveAusente}
        setAvisoChaveAusente={() => {}}
      />

      {/* Alerta quando tenta organizar sem chave de IA cadastrada */}
      {avisoChaveAusente && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-sm flex items-start justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-950">Chave de IA não cadastrada</p>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                Para extrair dados automaticamente de documentos, cadastre uma chave gratuita de IA nos Ajustes. Se preferir, você também pode preencher os dados manualmente ao aprovar cada documento.
              </p>
            </div>
          </div>
          <Link
            to="/ajustes"
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs shrink-0 transition-colors"
          >
            Configurar IA
          </Link>
        </div>
      )}

      {/* Mensagem de Erro Global Tratada */}
      {erroMensagemObj && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs sm:text-sm flex items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{erroMensagemObj.mensagem}</span>
          </div>
          <button
            onClick={() => setErroMensagemObj(null)}
            className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Mensagem de Sucesso Global */}
      {sucessoMensagem && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs sm:text-sm flex items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{sucessoMensagem}</span>
          </div>
          <button
            onClick={() => setSucessoMensagem(null)}
            className="text-emerald-500 hover:text-emerald-700 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. Área de Dropzone / Upload */}
      <DropzoneCaixaEntrada
        carregandoDrive={carregandoDrive}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
        enviando={enviando}
        arquivosEmUpload={arquivosEmUpload}
        onProcessarArquivos={processarArquivos}
      />

      {/* 4. Lista de Documentos da Fila / Processados */}
      {itens.length === 0 ? (
        <Card className="p-8 text-center bg-slate-50/50 border-dashed border-2 border-slate-200">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Sua Caixa de Entrada está vazia</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Arraste exames, receitas ou áudios de consultas para a área acima. O Salus extrai as informações para você conferir antes de salvar.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <span>Documentos para Processar</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-xs">
                {itens.length}
              </span>
            </h3>
            {processandoFila && (
              <span className="text-xs text-teal-700 font-medium flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Processando fila com IA...
              </span>
            )}
          </div>

          <div className="space-y-3">
            {itens.map((item) => (
              <ItemCaixaEntradaCard
                key={item.id}
                item={item}
                membros={membros}
                examesExistentes={examesExistentes}
                medicamentosExistentes={medicamentosExistentes}
                vacinasExistentes={vacinasExistentes}
                eventosExistentes={eventosExistentes}
                itemProcessandoId={itemProcessandoId}
                itemExpandidoId={itemExpandidoId}
                deletandoId={deletandoId}
                submetendoProposta={submetendoProposta}
                onToggleExpandir={(id) => setItemExpandidoId((prev) => (prev === id ? null : id))}
                onVisualizar={handleVisualizar}
                onRemover={handleRemover}
                onProcessarExtracao={processarItemExtracao}
                onConfirmarProposta={(item, selecao) => handleConfirmarProposta(item, selecao)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 5. Toast de Confirmação de Sucesso */}
      {confirmacaoSucessoToast && (
        <ToastSucessoConfirmacao
          membroId={confirmacaoSucessoToast.membroId}
          membroNome={confirmacaoSucessoToast.membroNome}
          onFechar={() => setConfirmacaoSucessoToast(null)}
        />
      )}
    </div>
  );
};
