import JSZip from 'jszip';
import * as yaml from 'js-yaml';
import {
  Familia,
  Membro,
  Medicamento,
  Vacina,
  Checkup,
  Exame,
  Evento,
  Analise,
  DocumentoMembro,
  ItemCaixaEntrada,
} from '../../types/dominio';
import { salvar as salvarFamilia } from '../../data/repositorios/familia';
import { salvar as salvarMembro } from '../../data/repositorios/membros';
import { salvar as salvarMedicamento } from '../../data/repositorios/medicamentos';
import { salvar as salvarVacina } from '../../data/repositorios/vacinas';
import { salvar as salvarCheckup } from '../../data/repositorios/checkups';
import { salvar as salvarExame } from '../../data/repositorios/exames';
import { salvar as salvarEvento } from '../../data/repositorios/eventos';
import { salvar as salvarAnalise } from '../../data/repositorios/analises';
import { salvar as salvarCaixaEntrada } from '../../data/repositorios/caixaEntrada';
import { salvar as salvarDocumento } from '../../data/repositorios/documentos';
import { limparDadosDoUsuario } from './excluir';
import { fazerUploadParaDrive } from '../api';

export interface ResumoImportacao {
  temBackupJson: boolean;
  nomeFamilia: string;
  membrosCount: number;
  medicamentosCount: number;
  vacinasCount: number;
  checkupsCount: number;
  examesCount: number;
  eventosCount: number;
  analisesCount: number;
  documentosCount: number;
  arquivosDocumentosNoZipCount: number;
  itensNaoInterpretados: string[];
  dadosParaImportar: {
    familia?: Familia;
    membros: Membro[];
    medicamentos: Medicamento[];
    vacinas: Vacina[];
    checkups: Checkup[];
    exames: Exame[];
    eventos: Evento[];
    analises: Analise[];
    caixaEntrada: ItemCaixaEntrada[];
    documentos: DocumentoMembro[];
  };
  arquivosDocumentosNoZip: {
    membroNome: string;
    categoria: string;
    nomeArquivo: string;
    blob: Blob;
  }[];
}

/**
 * Analisa o arquivo ZIP enviado pelo usuário e constrói um resumo da importação.
 */
export async function analisarArquivoBackup(file: File): Promise<ResumoImportacao> {
  const zip = new JSZip();
  const buffer = await file.arrayBuffer();
  const loadedZip = await zip.loadAsync(buffer);

  let temBackupJson = false;
  let backupContent: Record<string, unknown> | null = null;
  const itensNaoInterpretados: string[] = [];

  const backupFile = loadedZip.file('salus-app-backup.json');
  if (backupFile) {
    temBackupJson = true;
    try {
      const text = await backupFile.async('text');
      backupContent = JSON.parse(text) as Record<string, unknown>;
    } catch {
      temBackupJson = false;
    }
  }

  const arquivosDocumentosNoZip: ResumoImportacao['arquivosDocumentosNoZip'] = [];

  const docFiles = Object.keys(loadedZip.files).filter(
    (fPath) => !loadedZip.files[fPath].dir && fPath.includes('Documentos/')
  );

  for (const fPath of docFiles) {
    const parts = fPath.split('/');
    const idxDoc = parts.indexOf('Documentos');
    let membroNome = 'Geral';
    let categoria = 'Outros';
    if (idxDoc > 0) membroNome = parts[idxDoc - 1];
    if (parts.length > idxDoc + 1) categoria = parts[idxDoc + 1];
    const nomeArquivo = parts[parts.length - 1];

    try {
      const blob = await loadedZip.files[fPath].async('blob');
      arquivosDocumentosNoZip.push({
        membroNome,
        categoria,
        nomeArquivo,
        blob,
      });
    } catch (e) {
      console.warn(`Erro ao extrair arquivo ${fPath} do zip:`, e);
    }
  }

  if (temBackupJson && backupContent) {
    const dados = {
      familia: (backupContent.familia as Familia) || { nome: 'Nossa Família', atualizado_em: new Date().toISOString().slice(0, 10) },
      membros: Array.isArray(backupContent.membros) ? (backupContent.membros as Membro[]) : [],
      medicamentos: Array.isArray(backupContent.medicamentos) ? (backupContent.medicamentos as Medicamento[]) : [],
      vacinas: Array.isArray(backupContent.vacinas) ? (backupContent.vacinas as Vacina[]) : [],
      checkups: Array.isArray(backupContent.checkups) ? (backupContent.checkups as Checkup[]) : [],
      exames: Array.isArray(backupContent.exames) ? (backupContent.exames as Exame[]) : [],
      eventos: Array.isArray(backupContent.eventos) ? (backupContent.eventos as Evento[]) : [],
      analises: Array.isArray(backupContent.analises) ? (backupContent.analises as Analise[]) : [],
      caixaEntrada: Array.isArray(backupContent.caixaEntrada) ? (backupContent.caixaEntrada as ItemCaixaEntrada[]) : [],
      documentos: Array.isArray(backupContent.documentos) ? (backupContent.documentos as DocumentoMembro[]) : [],
    };

    return {
      temBackupJson: true,
      nomeFamilia: dados.familia.nome || 'Nossa Família',
      membrosCount: dados.membros.length,
      medicamentosCount: dados.medicamentos.length,
      vacinasCount: dados.vacinas.length,
      checkupsCount: dados.checkups.length,
      examesCount: dados.exames.length,
      eventosCount: dados.eventos.length,
      analisesCount: dados.analises.length,
      documentosCount: dados.documentos.length,
      arquivosDocumentosNoZipCount: arquivosDocumentosNoZip.length,
      itensNaoInterpretados: [],
      dadosParaImportar: dados,
      arquivosDocumentosNoZip,
    };
  }

  let nomeFamilia = 'Nossa Família';
  const membros: Membro[] = [];
  const medicamentos: Medicamento[] = [];
  const vacinas: Vacina[] = [];
  const checkups: Checkup[] = [];
  const exames: Exame[] = [];
  const eventos: Evento[] = [];
  const analises: Analise[] = [];
  const caixaEntrada: ItemCaixaEntrada[] = [];
  const documentos: DocumentoMembro[] = [];

  const indexFile = loadedZip.file('Familia/_index.yaml') || loadedZip.file('_index.yaml');
  if (indexFile) {
    try {
      const yamlText = await indexFile.async('text');
      const parsedYaml = yaml.load(yamlText) as Record<string, unknown>;

      if (parsedYaml) {
        if (parsedYaml.nome_familia) nomeFamilia = String(parsedYaml.nome_familia);

        if (Array.isArray(parsedYaml.membros)) {
          for (const mYaml of parsedYaml.membros) {
            const mId = mYaml.id || mYaml.nome?.toLowerCase().replace(/\s+/g, '_') || `m_${Date.now()}`;
            membros.push({
              id: mId,
              nome: mYaml.nome || 'Sem Nome',
              tipo: mYaml.tipo || 'pessoa',
              vinculo: mYaml.vinculo || 'biologico',
              condicoes_ativas: Array.isArray(mYaml.condicoes_ativas) ? mYaml.condicoes_ativas : [],
              alergias: Array.isArray(mYaml.alergias) ? mYaml.alergias : [],
            });

            if (Array.isArray(mYaml.medicamentos_em_uso)) {
              for (const med of mYaml.medicamentos_em_uso) {
                medicamentos.push({
                  id: `med_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
                  membro_id: mId,
                  nome: med.nome || 'Medicamento',
                  dose: med.dose || '',
                  frequencia: med.frequencia || '',
                  status: 'em_uso',
                  desde: med.desde,
                  renova_em: med.renova_em,
                });
              }
            }

            if (Array.isArray(mYaml.medicamentos_prescritos)) {
              for (const med of mYaml.medicamentos_prescritos) {
                medicamentos.push({
                  id: `med_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
                  membro_id: mId,
                  nome: med.nome || 'Medicamento',
                  dose: med.dose || '',
                  frequencia: med.frequencia || '',
                  status: 'prescrito',
                  prescrito_por: med.prescrito_por,
                });
              }
            }

            if (Array.isArray(mYaml.vacinas)) {
              for (const v of mYaml.vacinas) {
                vacinas.push({
                  id: `vac_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
                  membro_id: mId,
                  nome: v.nome || 'Vacina',
                  aplicada_em: v.aplicada_em || new Date().toISOString().slice(0, 10),
                  proxima_em: v.proxima_em,
                });
              }
            }

            if (Array.isArray(mYaml.proximos_checkups)) {
              for (const c of mYaml.proximos_checkups) {
                checkups.push({
                  id: `chk_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
                  membro_id: mId,
                  tipo: c.tipo || 'Checkup',
                  data: c.data || new Date().toISOString().slice(0, 10),
                });
              }
            }

            if (Array.isArray(mYaml.marcadores_chave)) {
              for (const mc of mYaml.marcadores_chave) {
                exames.push({
                  id: `ex_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
                  membro_id: mId,
                  data: mc.data || new Date().toISOString().slice(0, 10),
                  painel: 'Marcadores do Índice',
                  marcador: mc.marcador || 'Marcador',
                  valor: String(mc.valor || ''),
                  unidade: mc.unidade || '',
                  faixa_referencia_laudo: mc.faixa_referencia_laudo || 'faixa não informada no laudo',
                  flag: mc.flag || 'nao_informado',
                });
              }
            }
          }
        }
      }
    } catch {
      itensNaoInterpretados.push('Estrutura de Familia/_index.yaml contém divergências');
    }
  }

  for (const fPath of Object.keys(loadedZip.files)) {
    if (!loadedZip.files[fPath].dir && !fPath.endsWith('_index.yaml') && !fPath.endsWith('salus-app-backup.json') && !fPath.includes('Documentos/')) {
      if (!fPath.endsWith('.md')) {
        itensNaoInterpretados.push(fPath);
      }
    }
  }

  return {
    temBackupJson: false,
    nomeFamilia,
    membrosCount: membros.length,
    medicamentosCount: medicamentos.length,
    vacinasCount: vacinas.length,
    checkupsCount: checkups.length,
    examesCount: exames.length,
    eventosCount: eventos.length,
    analisesCount: analises.length,
    documentosCount: documentos.length,
    arquivosDocumentosNoZipCount: arquivosDocumentosNoZip.length,
    itensNaoInterpretados,
    dadosParaImportar: {
      familia: { nome: nomeFamilia, atualizado_em: new Date().toISOString().slice(0, 10) },
      membros,
      medicamentos,
      vacinas,
      checkups,
      exames,
      eventos,
      analises,
      caixaEntrada,
      documentos,
    },
    arquivosDocumentosNoZip,
  };
}

export async function executarImportacao(
  uid: string,
  resumo: ResumoImportacao,
  modo: 'substituir' | 'mesclar',
  tokenAuth: string,
  onProgress?: (msg: string) => void
): Promise<void> {
  if (modo === 'substituir') {
    onProgress?.('Limpando dados atuais no Firestore...');
    await limparDadosDoUsuario(uid, false);
  }

  const { dadosParaImportar, arquivosDocumentosNoZip } = resumo;

  onProgress?.('Gravando informações da família e membros...');
  if (dadosParaImportar.familia) {
    await salvarFamilia(uid, dadosParaImportar.familia);
  }

  for (const m of dadosParaImportar.membros) {
    await salvarMembro(uid, m);
  }

  onProgress?.('Gravando medicamentos, vacinas e exames...');
  for (const med of dadosParaImportar.medicamentos) {
    await salvarMedicamento(uid, med);
  }

  for (const vac of dadosParaImportar.vacinas) {
    await salvarVacina(uid, vac);
  }

  for (const chk of dadosParaImportar.checkups) {
    await salvarCheckup(uid, chk);
  }

  for (const ex of dadosParaImportar.exames) {
    await salvarExame(uid, ex);
  }

  for (const ev of dadosParaImportar.eventos) {
    await salvarEvento(uid, ev);
  }

  for (const an of dadosParaImportar.analises) {
    await salvarAnalise(uid, an);
  }

  for (const ce of dadosParaImportar.caixaEntrada) {
    await salvarCaixaEntrada(uid, ce);
  }

  for (const docRec of dadosParaImportar.documentos) {
    await salvarDocumento(uid, docRec);
  }

  if (arquivosDocumentosNoZip.length > 0 && tokenAuth) {
    onProgress?.(`Enviando ${arquivosDocumentosNoZip.length} arquivo(s) para a pasta Salus App no seu Google Drive...`);

    for (let i = 0; i < arquivosDocumentosNoZip.length; i++) {
      const item = arquivosDocumentosNoZip[i];
      onProgress?.(`Enviando ${i + 1}/${arquivosDocumentosNoZip.length}: ${item.nomeArquivo}...`);

      try {
        const file = new File([item.blob], item.nomeArquivo, { type: item.blob.type });
        const uploadedFile = await fazerUploadParaDrive(
          file,
          item.membroNome,
          item.nomeArquivo,
          item.categoria
        );

        const membro = dadosParaImportar.membros.find(
          (m) => m.nome.toLowerCase() === item.membroNome.toLowerCase()
        );
        const membroId = membro ? membro.id : (dadosParaImportar.membros[0]?.id || 'geral');

        await salvarDocumento(uid, {
          id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          membro_id: membroId,
          nome_arquivo: item.nomeArquivo,
          tipo_documento: item.categoria,
          data: new Date().toISOString().slice(0, 10),
          drive_file_id: uploadedFile.drive_file_id,
          mime: item.blob.type,
          tamanho_bytes: item.blob.size,
        });
      } catch (err) {
        console.warn(`Erro ao enviar arquivo ${item.nomeArquivo} para o Drive:`, err);
      }
    }
  }

  onProgress?.('Importação concluída com sucesso!');
}
