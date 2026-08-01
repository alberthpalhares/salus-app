import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withAuth, AuthContext } from './_lib/requireAuth.js';
import { gerarPromptChat } from './_lib/prompts/chat.js';
import { CHAT_RESPONSE_SCHEMA } from './_lib/schemas/chatSchema.js';
import { propostaSchema } from '../src/types/propostas.js';
import { chamarIA } from './_lib/ia/index.js';
import { tratarErroIA } from './_lib/errorHandler.js';

// --- Pure helper functions (low CC each) ---

interface ChatMessage {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

function validarRequisicao(body: Record<string, unknown>): {
  mensagem: string;
  historico: unknown[];
  snapshotIndice: unknown;
} {
  const { mensagem, historico, snapshotIndice } = body || {};

  if (!mensagem || typeof mensagem !== 'string' || (mensagem as string).trim() === '') {
    throw new Error('VALIDATION:Mensagem não pode estar em branco.');
  }

  return {
    mensagem: mensagem as string,
    historico: Array.isArray(historico) ? historico : [],
    snapshotIndice,
  };
}

function montarContents(
  mensagem: string,
  historico: unknown[],
): ChatMessage[] {
  const contents: ChatMessage[] = [];

  const historicoRecente = historico.slice(-10);
  for (const item of historicoRecente) {
    const h = item as Record<string, unknown>;
    const role = h.role === 'assistant' || h.role === 'model' ? 'model' as const : 'user' as const;
    const text = (h.text || h.content || '') as string;
    if (text) {
      contents.push({ role, parts: [{ text }] });
    }
  }

  contents.push({ role: 'user', parts: [{ text: mensagem }] });
  return contents;
}

function parseRespostaIA(texto: string): Record<string, unknown> {
  try {
    return JSON.parse(texto) as Record<string, unknown>;
  } catch {
    return {
      resposta: texto || 'Não foi possível obter uma resposta estruturada do assistente.',
      temProposta: false,
    };
  }
}

function validarProposta(rawObj: Record<string, unknown>): unknown | null {
  if (!rawObj.temProposta || !rawObj.proposta) return null;

  const parseResult = propostaSchema.safeParse(rawObj.proposta);
  if (parseResult.success) return parseResult.data;

  // Fallback: tentar montar proposta com defaults
  const propObj = (rawObj.proposta && typeof rawObj.proposta === 'object')
    ? (rawObj.proposta as Record<string, unknown>)
    : {};

  try {
    return propostaSchema.parse({
      documento: propObj.documento || {
        tipo: 'outro',
        data_documento: new Date().toISOString().slice(0, 10),
        descricao_curta: 'Registro via chat',
        nome_sugerido: 'registro_chat',
        emitido_por: '',
      },
      membro: propObj.membro || {
        membro_id_sugerido: null,
        nome_encontrado_no_documento: null,
        confianca: 'baixa',
      },
      exames: propObj.exames || [],
      medicamentos: propObj.medicamentos || [],
      vacinas: propObj.vacinas || [],
      eventos: propObj.eventos || [],
      observacoes: propObj.observacoes || ['Registrado via assistente no chat'],
    });
  } catch {
    return null;
  }
}

// --- Handler (orchestrator) ---

async function handler(req: VercelRequest, res: VercelResponse, ctx: AuthContext) {
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido.' });
  }

  try {
    const { mensagem, historico, snapshotIndice } = validarRequisicao(req.body || {});

    const snapshotTexto = snapshotIndice
      ? typeof snapshotIndice === 'string'
        ? snapshotIndice
        : JSON.stringify(snapshotIndice, null, 2)
      : 'Nenhum snapshot do índice fornecido.';

    const systemInstruction = gerarPromptChat(snapshotTexto);
    const contents = montarContents(mensagem, historico);

    const resultadoIA = await chamarIA({
      uid: ctx.uid,
      systemInstruction,
      contents,
      responseSchema: CHAT_RESPONSE_SCHEMA,
      userConfig: ctx.userConfig,
    });

    const rawObj = parseRespostaIA(resultadoIA.texto);
    const propostaValida = validarProposta(rawObj);

    return res.json({
      resposta: (rawObj.resposta as string) || 'Não foi possível obter uma resposta do assistente.',
      proposta: propostaValida,
      dadosConsultados: rawObj.dadosConsultados || null,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message.startsWith('VALIDATION:')) {
      return res.status(400).json({ erro: err.message.replace('VALIDATION:', '') });
    }
    return tratarErroIA(err, res);
  }
}

export default withAuth(handler);
