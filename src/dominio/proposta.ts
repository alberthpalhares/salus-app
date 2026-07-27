import { writeBatch, doc } from 'firebase/firestore';
import { db } from '../data/firebase';
import {
  Proposta,
  PropostaLegada,
  PropostaAdicionarMembro,
  SelecaoProposta,
} from '../types/propostas';
import { FamiliaIndice, Exame, Medicamento, Vacina, Evento, DocumentoMembro } from '../types/dominio';
import { fazerUploadParaDrive } from '../servicos/api';
import { obterDataHojeISO } from '../lib/datas';

/**
 * Aplica uma Proposta aprovada pelo usuário salvando todos os dados selecionados
 * em um batch atômico no Firestore. Se um arquivo em memória for informado (o Drive
 * está conectado e o usuário quer arquivar), o documento é salvo direto na pasta
 * do membro no Google Drive antes da gravação clínica.
 *
 * (Regra Clínica 4 - Nada é gravado sem confirmação explícita).
 */
export async function aplicarProposta(
  uid: string,
  proposta: Proposta,
  selecao: SelecaoProposta,
  arquivo?: File
): Promise<{ success: boolean; membroId: string; membroNome: string; erroDrive?: string }> {
  if (!uid || !selecao.membroId) {
    throw new Error('UID do usuário e membroId são obrigatórios para aplicar proposta.');
  }

  const dataHoje = obterDataHojeISO();
  let driveFileId: string | undefined;

  // 1. Salvar o arquivo no Google Drive, se fornecido — o arquivo só existe em
  // memória do navegador até este ponto; se essa etapa falhar, nada é gravado e o
  // usuário pode tentar de novo (o File continua em memória do lado do cliente).
  if (arquivo) {
    try {
      const arquivoSalvo = await fazerUploadParaDrive(
        arquivo,
        selecao.membroNome,
        selecao.documento.nomePadronizado,
        selecao.documento.tipo
      );
      driveFileId = arquivoSalvo.drive_file_id;
    } catch (err: any) {
      console.warn('[aplicarProposta] Erro ao salvar arquivo no Drive:', err);
      return {
        success: false,
        membroId: selecao.membroId,
        membroNome: selecao.membroNome,
        erroDrive: err.message || 'Erro ao salvar arquivo no Google Drive.',
      };
    }
  }

  // 2. Batch atômico do Firestore para os dados clínicos
  const batch = writeBatch(db);

  // A. Exames
  if (selecao.exames && selecao.exames.length > 0) {
    for (const ex of selecao.exames) {
      if (!ex.incluir) continue;
      const idExame = `exame_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const ref = doc(db, `usuarios/${uid}/exames/${idExame}`);
      const exameDoc: Exame = {
        id: idExame,
        membro_id: selecao.membroId,
        data: ex.data || selecao.documento.data || dataHoje,
        painel: ex.painel || 'Exame',
        marcador: ex.marcador,
        valor: ex.valor,
        unidade: ex.unidade || '',
        faixa_referencia_laudo: ex.faixa_referencia_laudo || '', // Sempre vinda do próprio laudo
        flag: ex.flag || 'nao_informado',
        documento_id: driveFileId || '',
      };
      batch.set(ref, exameDoc);
    }
  }

  // B. Medicamentos (Status default: 'prescrito'. Só vira 'em_uso' se explicitamente respondido "Já estou tomando")
  if (selecao.medicamentos && selecao.medicamentos.length > 0) {
    for (const med of selecao.medicamentos) {
      if (!med.incluir) continue;
      const idMed = `med_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const ref = doc(db, `usuarios/${uid}/medicamentos/${idMed}`);
      const medDoc: Medicamento = {
        id: idMed,
        membro_id: selecao.membroId,
        nome: med.nome,
        dose: med.dose || '',
        frequencia: med.frequencia || '',
        status: med.status, // 'em_uso' ou 'prescrito'
        desde: med.status === 'em_uso' ? (med.data_prescricao || dataHoje) : undefined,
        prescrito_por: med.prescrito_por || '',
        renova_em: med.validade_receita || '',
      };
      batch.set(ref, medDoc);
    }
  }

  // C. Vacinas
  if (selecao.vacinas && selecao.vacinas.length > 0) {
    for (const vac of selecao.vacinas) {
      if (!vac.incluir) continue;
      const idVac = `vac_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const ref = doc(db, `usuarios/${uid}/vacinas/${idVac}`);
      const vacDoc: Vacina = {
        id: idVac,
        membro_id: selecao.membroId,
        nome: vac.nome,
        aplicada_em: vac.aplicada_em || selecao.documento.data || dataHoje,
        proxima_em: vac.proxima_em || undefined,
      };
      batch.set(ref, vacDoc);
    }
  }

  // D. Eventos
  if (selecao.eventos && selecao.eventos.length > 0) {
    for (const evt of selecao.eventos) {
      if (!evt.incluir) continue;
      const idEvt = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const ref = doc(db, `usuarios/${uid}/eventos/${idEvt}`);
      const evtDoc: Evento = {
        id: idEvt,
        membro_id: selecao.membroId,
        data: evt.data || selecao.documento.data || dataHoje,
        tipo: evt.tipo || 'Consulta / Retorno',
        descricao: evt.descricao,
      };
      batch.set(ref, evtDoc);
    }
  }

  // E. DocumentoMembro
  const idDoc = driveFileId || `doc_${Date.now()}`;
  const docRef = doc(db, `usuarios/${uid}/documentos/${idDoc}`);
  const docMembro: DocumentoMembro = {
    id: idDoc,
    membro_id: selecao.membroId,
    nome_arquivo: selecao.documento.nomePadronizado,
    tipo_documento: selecao.documento.tipo || 'Laudo de Exame',
    data: selecao.documento.data || dataHoje,
    drive_file_id: driveFileId || '',
  };
  batch.set(docRef, docMembro);

  // F. Evento "documento arquivado"
  const idEvtArq = `evt_arq_${Date.now()}`;
  const evtArqRef = doc(db, `usuarios/${uid}/eventos/${idEvtArq}`);
  const evtArqDoc: Evento = {
    id: idEvtArq,
    membro_id: selecao.membroId,
    data: selecao.documento.data || dataHoje,
    tipo: 'Documento Arquivado',
    descricao: driveFileId
      ? `Documento "${selecao.documento.nomePadronizado}" arquivado na pasta Salus App do Google Drive para ${selecao.membroNome}`
      : `Documento "${selecao.documento.nomePadronizado}" processado e registrado para ${selecao.membroNome} (sem Google Drive conectado)`,
  };
  batch.set(evtArqRef, evtArqDoc);

  // G. Atualiza timestamp da família
  const familiaRef = doc(db, `usuarios/${uid}/familia/info`);
  batch.set(familiaRef, { atualizado_em: dataHoje }, { merge: true });

  // Executa a gravação atômica
  await batch.commit();

  return {
    success: true,
    membroId: selecao.membroId,
    membroNome: selecao.membroNome,
  };
}

/**
 * Função Legada de Atualização de Índice
 */
export function aplicarPropostaAprovada(
  indice: FamiliaIndice,
  proposta: PropostaLegada | Proposta
): FamiliaIndice {
  const novoIndice: FamiliaIndice = JSON.parse(JSON.stringify(indice));

  if ('status' in proposta && proposta.status !== 'aprovada') {
    return novoIndice;
  }

  if ('tipo' in proposta && typeof proposta.tipo === 'string') {
    switch (proposta.tipo) {
      case 'adicionar_membro': {
        const legada = proposta as PropostaAdicionarMembro;
        if (legada.dados && legada.dados.nome) {
          const id = legada.dados.id || `membro_${Date.now()}`;
          novoIndice.membros.push({
            id,
            nome: legada.dados.nome,
            especie: legada.dados.especie || 'Humano',
            vinculo: legada.dados.vinculo || 'biologico',
            ...legada.dados,
          });
        }
        break;
      }
    }
  }

  novoIndice.atualizado_em = new Date().toISOString().split('T')[0];
  return novoIndice;
}
