import JSZip from 'jszip';
import * as yaml from 'js-yaml';
import { extrairEntidadesDoYamlIndex } from './yamlParser';
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

// --- Types ---

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
  dadosParaImportar: DadosImportacao;
  arquivosDocumentosNoZip: ArquivoDocZip[];
}

interface DadosImportacao {
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
}

interface ArquivoDocZip {
  membroNome: string;
  categoria: string;
  nomeArquivo: string;
  blob: Blob;
}

// --- Helper: extract document files from ZIP ---

async function extrairDocumentosDoZip(loadedZip: JSZip): Promise<ArquivoDocZip[]> {
  const resultado: ArquivoDocZip[] = [];

  const docFiles = Object.keys(loadedZip.files).filter(
    (fPath) => !loadedZip.files[fPath].dir && fPath.includes('Documentos/')
  );

  for (const fPath of docFiles) {
    const parts = fPath.split('/');
    const idxDoc = parts.indexOf('Documentos');
    const membroNome = idxDoc > 0 ? parts[idxDoc - 1] : 'Geral';
    const categoria = parts.length > idxDoc + 1 ? parts[idxDoc + 1] : 'Outros';
    const nomeArquivo = parts[parts.length - 1];

    try {
      const blob = await loadedZip.files[fPath].async('blob');
      resultado.push({ membroNome, categoria, nomeArquivo, blob });
    } catch (e) {
      console.warn(`Erro ao extrair arquivo ${fPath} do zip:`, e);
    }
  }

  return resultado;
}

// --- Helper: parse backup JSON ---

function extrairDadosDeBackupJson(content: Record<string, unknown>): DadosImportacao {
  const safeArray = <T>(key: string): T[] =>
    Array.isArray(content[key]) ? (content[key] as T[]) : [];

  return {
    familia: (content.familia as Familia) || {
      nome: 'Nossa Família',
      atualizado_em: new Date().toISOString().slice(0, 10),
    },
    membros: safeArray<Membro>('membros'),
    medicamentos: safeArray<Medicamento>('medicamentos'),
    vacinas: safeArray<Vacina>('vacinas'),
    checkups: safeArray<Checkup>('checkups'),
    exames: safeArray<Exame>('exames'),
    eventos: safeArray<Evento>('eventos'),
    analises: safeArray<Analise>('analises'),
    caixaEntrada: safeArray<ItemCaixaEntrada>('caixaEntrada'),
    documentos: safeArray<DocumentoMembro>('documentos'),
  };
}

// --- Helper: parse YAML _index ---

async function extrairDadosDeYaml(
  loadedZip: JSZip,
  itensNaoInterpretados: string[],
): Promise<{ nomeFamilia: string; dados: DadosImportacao }> {
  const membros: Membro[] = [];
  const medicamentos: Medicamento[] = [];
  const vacinas: Vacina[] = [];
  const checkups: Checkup[] = [];
  const exames: Exame[] = [];
  let nomeFamilia = 'Nossa Família';

  const indexFile = loadedZip.file('Familia/_index.yaml') || loadedZip.file('_index.yaml');
  if (indexFile) {
    try {
      const yamlText = await indexFile.async('text');
      const parsedYaml = yaml.load(yamlText) as Record<string, unknown>;

      if (parsedYaml) {
        const extraidos = extrairEntidadesDoYamlIndex(parsedYaml);
        if (extraidos.nomeFamilia) nomeFamilia = extraidos.nomeFamilia;
        membros.push(...extraidos.membros);
        medicamentos.push(...extraidos.medicamentos);
        vacinas.push(...extraidos.vacinas);
        checkups.push(...extraidos.checkups);
        exames.push(...extraidos.exames);
      }
    } catch {
      itensNaoInterpretados.push('Estrutura de Familia/_index.yaml contém divergências');
    }
  }

  // Identify unrecognized files
  for (const fPath of Object.keys(loadedZip.files)) {
    const file = loadedZip.files[fPath];
    if (!file.dir && !fPath.endsWith('_index.yaml') && !fPath.endsWith('salus-app-backup.json') && !fPath.includes('Documentos/') && !fPath.endsWith('.md')) {
      itensNaoInterpretados.push(fPath);
    }
  }

  return {
    nomeFamilia,
    dados: {
      familia: { nome: nomeFamilia, atualizado_em: new Date().toISOString().slice(0, 10) },
      membros,
      medicamentos,
      vacinas,
      checkups,
      exames,
      eventos: [],
      analises: [],
      caixaEntrada: [],
      documentos: [],
    },
  };
}

// --- Helper: build ResumoImportacao from data ---

function construirResumo(
  temBackupJson: boolean,
  nomeFamilia: string,
  dados: DadosImportacao,
  arquivosDocumentosNoZip: ArquivoDocZip[],
  itensNaoInterpretados: string[],
): ResumoImportacao {
  return {
    temBackupJson,
    nomeFamilia,
    membrosCount: dados.membros.length,
    medicamentosCount: dados.medicamentos.length,
    vacinasCount: dados.vacinas.length,
    checkupsCount: dados.checkups.length,
    examesCount: dados.exames.length,
    eventosCount: dados.eventos.length,
    analisesCount: dados.analises.length,
    documentosCount: dados.documentos.length,
    arquivosDocumentosNoZipCount: arquivosDocumentosNoZip.length,
    itensNaoInterpretados,
    dadosParaImportar: dados,
    arquivosDocumentosNoZip,
  };
}

// --- Main: Analyze backup file ---

export async function analisarArquivoBackup(file: File): Promise<ResumoImportacao> {
  const zip = new JSZip();
  const buffer = await file.arrayBuffer();
  const loadedZip = await zip.loadAsync(buffer);

  const arquivosDocumentosNoZip = await extrairDocumentosDoZip(loadedZip);
  const itensNaoInterpretados: string[] = [];

  // Try JSON backup first
  const backupFile = loadedZip.file('salus-app-backup.json');
  if (backupFile) {
    try {
      const text = await backupFile.async('text');
      const backupContent = JSON.parse(text) as Record<string, unknown>;
      const dados = extrairDadosDeBackupJson(backupContent);
      return construirResumo(true, dados.familia?.nome || 'Nossa Família', dados, arquivosDocumentosNoZip, []);
    } catch {
      // Fall through to YAML path
    }
  }

  // Fallback: YAML index
  const { nomeFamilia, dados } = await extrairDadosDeYaml(loadedZip, itensNaoInterpretados);
  return construirResumo(false, nomeFamilia, dados, arquivosDocumentosNoZip, itensNaoInterpretados);
}

// --- Helper: persist collections ---

async function persistirColecoes(uid: string, dados: DadosImportacao): Promise<void> {
  if (dados.familia) await salvarFamilia(uid, dados.familia);
  for (const m of dados.membros) await salvarMembro(uid, m);
  for (const med of dados.medicamentos) await salvarMedicamento(uid, med);
  for (const vac of dados.vacinas) await salvarVacina(uid, vac);
  for (const chk of dados.checkups) await salvarCheckup(uid, chk);
  for (const ex of dados.exames) await salvarExame(uid, ex);
  for (const ev of dados.eventos) await salvarEvento(uid, ev);
  for (const an of dados.analises) await salvarAnalise(uid, an);
  for (const ce of dados.caixaEntrada) await salvarCaixaEntrada(uid, ce);
  for (const doc of dados.documentos) await salvarDocumento(uid, doc);
}

// --- Helper: upload document files to Drive ---

async function enviarArquivosParaDrive(
  uid: string,
  arquivos: ArquivoDocZip[],
  membros: Membro[],
  onProgress?: (msg: string) => void,
): Promise<void> {
  for (let i = 0; i < arquivos.length; i++) {
    const item = arquivos[i];
    onProgress?.(`Enviando ${i + 1}/${arquivos.length}: ${item.nomeArquivo}...`);

    try {
      const file = new File([item.blob], item.nomeArquivo, { type: item.blob.type });
      const uploadedFile = await fazerUploadParaDrive(file, item.membroNome, item.nomeArquivo, item.categoria);

      const membro = membros.find((m) => m.nome.toLowerCase() === item.membroNome.toLowerCase());
      const membroId = membro ? membro.id : (membros[0]?.id || 'geral');

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

// --- Main: Execute import ---

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
  await persistirColecoes(uid, dadosParaImportar);

  if (arquivosDocumentosNoZip.length > 0 && tokenAuth) {
    onProgress?.(`Enviando ${arquivosDocumentosNoZip.length} arquivo(s) para a pasta Salus App no seu Google Drive...`);
    await enviarArquivosParaDrive(uid, arquivosDocumentosNoZip, dadosParaImportar.membros, onProgress);
  }

  onProgress?.('Importação concluída com sucesso!');
}
