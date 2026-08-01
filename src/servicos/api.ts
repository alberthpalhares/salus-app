import { auth } from '../data/firebase';
import { SnapshotIndiceFamilia } from '../dominio/indice';
import { Proposta } from '../types/propostas';

// ─────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────

export interface MensagemChat {
  id?: string;
  role: 'user' | 'assistant' | 'model';
  text: string;
  proposta?: Proposta;
  propostaStatus?: 'pendente' | 'aprovada' | 'descartada';
  dadosConsultados?: string;
  timestamp?: string;
}

export interface RespostaChatApi {
  resposta: string;
  proposta?: Proposta;
  dadosConsultados?: string;
  erro?: string;
}

export interface ArquivoDriveUploadResult {
  drive_file_id: string;
  nome_arquivo: string;
  mime: string;
  tamanho_bytes?: number;
  webViewLink?: string;
}

// ─────────────────────────────────────────────────────────────
// Helper: obter token de autenticação
// ─────────────────────────────────────────────────────────────

async function getAuthHeaders(): Promise<Record<string, string>> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('Usuário não autenticado.');
  }
  const idToken = await currentUser.getIdToken();
  return {
    Authorization: `Bearer ${idToken}`,
  };
}

// ─────────────────────────────────────────────────────────────
// Chat
// ─────────────────────────────────────────────────────────────

/**
 * POST /api/chat
 * O servidor busca a chave de IA do Firestore via admin SDK.
 * O client envia APENAS o token de autenticação.
 */
export async function enviarMensagemChat(
  mensagem: string,
  historico: MensagemChat[] = [],
  snapshotIndice?: SnapshotIndiceFamilia | string | null
): Promise<RespostaChatApi> {
  const headers = await getAuthHeaders();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000);

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mensagem,
        historico,
        snapshotIndice,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data: RespostaChatApi = await res.json().catch(() => ({ resposta: '' }));

    if (!res.ok) {
      if (data.erro === 'chave_ausente' || (res.status === 400 && data.erro?.includes('chave'))) {
        throw new Error('chave_ausente');
      }
      throw new Error(data.erro || `Erro no servidor HTTP ${res.status}`);
    }

    if (data.erro) {
      if (data.erro === 'chave_ausente') {
        throw new Error('chave_ausente');
      }
      throw new Error(data.erro);
    }

    return {
      resposta: data.resposta || 'Sem resposta do assistente.',
      proposta: data.proposta,
      dadosConsultados: data.dadosConsultados,
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Tempo limite de conexão excedido (45s). Tente novamente.');
    }
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────
// Google Drive — Upload
// Credenciais do Drive são buscadas pelo server do Firestore.
// O client envia APENAS o token de autenticação.
// ─────────────────────────────────────────────────────────────

async function arquivoParaBase64(file: File | Blob): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

/**
 * Envia um arquivo para o servidor, que o grava no Google Drive do usuário.
 * Se membroNome for informado, o arquivo já nasce na pasta do membro (e, opcionalmente,
 * numa subpasta de tipoDocumento) com o nome novoNomeArquivo — sem passo de reorganização depois.
 */
export async function fazerUploadParaDrive(
  file: File | Blob,
  membroNome?: string,
  novoNomeArquivo?: string,
  tipoDocumento?: string
): Promise<ArquivoDriveUploadResult> {
  const headers = await getAuthHeaders();
  const base64Data = await arquivoParaBase64(file);
  const fileName = novoNomeArquivo || (file instanceof File ? file.name : 'documento');

  const res = await fetch('/api/drive/upload', {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fileName,
      mimeType: file.type || 'application/octet-stream',
      base64Data,
      membroNome,
      novoNomeArquivo,
      tipoDocumento,
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Erro no servidor ao enviar arquivo (${res.status})`);
  }

  return data.file;
}

/**
 * Remove um arquivo do Google Drive do usuário.
 */
export async function removerArquivoDrive(fileId: string): Promise<void> {
  const headers = await getAuthHeaders();

  const res = await fetch(`/api/drive/deletar?fileId=${encodeURIComponent(fileId)}`, {
    method: 'DELETE',
    headers,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    console.warn('Aviso ao deletar arquivo do Drive:', data.error);
  }
}

/**
 * Envia um arquivo direto da memória do navegador para extração pela IA.
 * O servidor nunca persiste os bytes — eles só passam pela memória da requisição.
 */
export async function extrairDocumento(file: File): Promise<Proposta> {
  const headers = await getAuthHeaders();
  const base64Data = await arquivoParaBase64(file);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const res = await fetch('/api/extrair-documento', {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        base64Data,
        mime: file.type || 'application/pdf',
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await res.json().catch(() => ({}));

    if (!res.ok || data.erro) {
      throw new Error(data.erro || `Erro no servidor ao extrair documento (${res.status})`);
    }

    return data.proposta as Proposta;
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Tempo limite de conexão excedido (60s). Tente novamente.');
    }
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────
// Backup
// ─────────────────────────────────────────────────────────────

/**
 * Executa backup manual dos dados para o Google Drive.
 */
export async function executarBackup(): Promise<{ success: boolean; arquivo?: string }> {
  const headers = await getAuthHeaders();

  const res = await fetch('/api/backup/executar', {
    method: 'POST',
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Erro ao executar backup (${res.status})`);
  }

  return data;
}

/**
 * Verifica se o backup está vencido.
 */
export async function verificarBackup(): Promise<{ vencido: boolean; ultimo_backup?: string }> {
  const headers = await getAuthHeaders();

  const res = await fetch('/api/backup/verificar', {
    method: 'GET',
    headers,
  });

  const data = await res.json().catch(() => ({ vencido: false }));
  return data;
}
