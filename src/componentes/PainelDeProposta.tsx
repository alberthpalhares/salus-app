import React, { useState } from 'react';
import { Botao } from './ui/Botao';
import { Proposta, SelecaoProposta } from '../types/propostas';
import { Membro, ItemCaixaEntrada, Exame, Medicamento, Vacina, Evento } from '../types/dominio';
import { obterDataHojeISO } from '../lib/datas';
import { FolderArchive, CheckCircle2, Edit3, Trash2 } from 'lucide-react';
import { BlocoDocumentoProposta } from './proposta/BlocoDocumentoProposta';
import { BlocoMembroProposta } from './proposta/BlocoMembroProposta';
import { BlocoMedicamentosProposta, MedicamentoStateItem } from './proposta/BlocoMedicamentosProposta';
import { BlocoExamesProposta, ExameStateItem } from './proposta/BlocoExamesProposta';
import { BlocoVacinasEventosProposta, VacinaStateItem, EventoStateItem } from './proposta/BlocoVacinasEventosProposta';

interface PainelDePropostaProps {
  proposta: Proposta;
  itemCaixaEntrada: ItemCaixaEntrada;
  membros: Membro[];
  examesExistentes?: Exame[];
  medicamentosExistentes?: Medicamento[];
  vacinasExistentes?: Vacina[];
  eventosExistentes?: Evento[];
  onConfirmar: (selecao: SelecaoProposta) => Promise<void>;
  onEditar?: () => void;
  onDescartar: () => Promise<void> | void;
  submetendo?: boolean;
}

function sanitizarNomeArquivo(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_\-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

export const PainelDeProposta: React.FC<PainelDePropostaProps> = ({
  proposta,
  itemCaixaEntrada,
  membros,
  examesExistentes = [],
  medicamentosExistentes = [],
  onConfirmar,
  onEditar,
  onDescartar,
  submetendo = false,
}) => {
  const { documento, membro, exames, medicamentos, vacinas, eventos } = proposta;

  const extensaoOriginal = itemCaixaEntrada.nome_arquivo.includes('.')
    ? '.' + itemCaixaEntrada.nome_arquivo.split('.').pop()
    : '.pdf';

  const [membroId, setMembroId] = useState<string>(() => {
    if (membro.membro_id_sugerido && membros.some((m) => m.id === membro.membro_id_sugerido)) {
      return membro.membro_id_sugerido;
    }
    if (membro.nome_encontrado_no_documento) {
      const encontrado = membros.find(
        (m) => m.nome.toLowerCase() === membro.nome_encontrado_no_documento?.toLowerCase()
      );
      if (encontrado) return encontrado.id;
    }
    return membros[0]?.id || '';
  });

  const [membroConfirmadoExplicitamente, setMembroConfirmadoExplicitamente] = useState<boolean>(
    () => membro.confianca === 'alta' && !!membro.membro_id_sugerido
  );

  const [tipoDoc, setTipoDoc] = useState<string>(documento.tipo || 'exame');
  const [dataDoc, setDataDoc] = useState<string>(
    documento.data_documento || itemCaixaEntrada.adicionado_em || obterDataHojeISO()
  );
  const [descricaoDoc, setDescricaoDoc] = useState<string>(
    documento.descricao_curta || documento.nome_sugerido || 'Documento_Clinico'
  );

  const [examesState, setExamesState] = useState<ExameStateItem[]>(
    (exames || []).map((ex) => ({
      incluir: true,
      painel: ex.painel || '',
      marcador: ex.marcador || '',
      valor: ex.valor || '',
      unidade: ex.unidade || '',
      faixa_referencia_laudo: ex.faixa_referencia_laudo || '',
      flag: ex.flag || 'nao_informado',
      data: dataDoc,
    }))
  );

  const [medicamentosState, setMedicamentosState] = useState<MedicamentoStateItem[]>(
    (medicamentos || []).map((med) => ({
      incluir: true,
      nome: med.nome || '',
      dose: med.dose || '',
      frequencia: med.frequencia || '',
      prescrito_por: med.prescrito_por || documento.emitido_por || '',
      validade_receita: med.validade_receita || '',
      status: 'prescrito' as const,
      data_prescricao: dataDoc,
    }))
  );

  const [vacinasState, setVacinasState] = useState<VacinaStateItem[]>(
    (vacinas || []).map((vac) => ({
      incluir: true,
      nome: vac.nome || '',
      aplicada_em: vac.aplicada_em || dataDoc,
      proxima_em: vac.proxima_em || '',
    }))
  );

  const [eventosState, setEventosState] = useState<EventoStateItem[]>(
    (eventos || []).map((ev) => ({
      incluir: true,
      data: ev.data || dataDoc,
      tipo: ev.tipo || 'Consulta / Retorno',
      descricao: ev.descricao || '',
    }))
  );

  const [modoEdicao, setModoEdicao] = useState<boolean>(false);

  const tipoFormatado = tipoDoc.charAt(0).toUpperCase() + tipoDoc.slice(1);
  const descSanitizada = sanitizarNomeArquivo(descricaoDoc) || 'Documento';
  const nomePadronizadoCalculado = `${dataDoc}_${tipoFormatado}_${descSanitizada}${extensaoOriginal}`;

  const membroSelecionadoObj = membros.find((m) => m.id === membroId);
  const nomeMembroSelecionado = membroSelecionadoObj?.nome || 'Membro';

  const handleSelecionarMembro = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMembroId(e.target.value);
    setMembroConfirmadoExplicitamente(true);
  };

  const handleConfirmar = async () => {
    if (!membroId || !membroConfirmadoExplicitamente) return;

    const selecao: SelecaoProposta = {
      itemCaixaEntradaId: itemCaixaEntrada.id,
      membroId,
      membroNome: nomeMembroSelecionado,
      documento: {
        tipo: tipoDoc,
        data: dataDoc,
        descricao_curta: descricaoDoc,
        nomePadronizado: nomePadronizadoCalculado,
      },
      exames: examesState,
      medicamentos: medicamentosState,
      vacinas: vacinasState,
      eventos: eventosState,
    };

    await onConfirmar(selecao);
  };

  return (
    <div className="space-y-6 text-slate-800 text-sm bg-white rounded-2xl border border-teal-200 p-4 sm:p-6 shadow-xs relative">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold shrink-0">
            <FolderArchive className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">
              Painel de Validação da Proposta
            </h3>
            <p className="text-xs text-slate-500">
              Revise e ajuste as informações extraídas antes de arquivar no Salus App e no Google Drive.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setModoEdicao(!modoEdicao)}
          className="text-xs text-teal-700 font-semibold hover:text-teal-900 inline-flex items-center gap-1 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200 transition-colors cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          {modoEdicao ? 'Concluir edições' : 'Editar dados extraídos'}
        </button>
      </div>

      <BlocoDocumentoProposta
        tipoDoc={tipoDoc}
        setTipoDoc={setTipoDoc}
        dataDoc={dataDoc}
        setDataDoc={setDataDoc}
        descricaoDoc={descricaoDoc}
        setDescricaoDoc={setDescricaoDoc}
        nomePadronizadoCalculado={nomePadronizadoCalculado}
        nomeMembroSelecionado={nomeMembroSelecionado}
        tipoFormatado={tipoFormatado}
      />

      <BlocoMembroProposta
        membros={membros}
        membroId={membroId}
        membroConfianca={membro.confianca}
        membroConfirmadoExplicitamente={membroConfirmadoExplicitamente}
        nomeMembroSelecionado={nomeMembroSelecionado}
        onSelecionarMembro={handleSelecionarMembro}
        onConfirmarExplicitamente={() => setMembroConfirmadoExplicitamente(true)}
      />

      <BlocoMedicamentosProposta
        medicamentosState={medicamentosState}
        setMedicamentosState={setMedicamentosState}
        medicamentosExistentes={medicamentosExistentes}
        membroId={membroId}
        modoEdicao={modoEdicao}
      />

      <BlocoExamesProposta
        examesState={examesState}
        setExamesState={setExamesState}
        examesExistentes={examesExistentes}
        membroId={membroId}
        modoEdicao={modoEdicao}
      />

      <BlocoVacinasEventosProposta
        vacinasState={vacinasState}
        setVacinasState={setVacinasState}
        eventosState={eventosState}
        setEventosState={setEventosState}
      />

      {/* Banner de Isenção Clínica da IA */}
      <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-500 italic flex items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          <span className="font-semibold not-italic text-slate-700">Aviso:</span>
          Gerado por inteligência artificial a partir dos seus documentos. Não substitui avaliação profissional.
        </span>
      </div>

      <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 rounded-b-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg z-20">
        <div className="flex items-center gap-2">
          <Botao
            variante="outline"
            tamanho="md"
            onClick={onDescartar}
            disabled={submetendo}
            icone={<Trash2 className="w-4 h-4 text-rose-500" />}
          >
            Descartar
          </Botao>

          {onEditar && (
            <Botao
              variante="secundario"
              tamanho="md"
              onClick={onEditar}
              disabled={submetendo}
              icone={<Edit3 className="w-4 h-4" />}
            >
              Editar
            </Botao>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Botao
            variante="primario"
            tamanho="md"
            onClick={handleConfirmar}
            disabled={submetendo || !membroId || !membroConfirmadoExplicitamente}
            carregando={submetendo}
            icone={<CheckCircle2 className="w-4 h-4 text-white" />}
          >
            Confirmar e arquivar
          </Botao>
        </div>
      </div>
    </div>
  );
};
