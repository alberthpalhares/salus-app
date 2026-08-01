import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withAuth, AuthContext } from './_lib/requireAuth.js';
import { gerarPromptChat } from './_lib/prompts/chat.js';
import { CHAT_RESPONSE_SCHEMA } from './_lib/schemas/chatSchema.js';
import { propostaSchema } from '../src/types/propostas.js';
import { chamarIA } from './_lib/ia/index.js';
import { tratarErroIA } from './_lib/errorHandler.js';

async function handler(req: VercelRequest, res: VercelResponse, ctx: AuthContext) {
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido.' });
  }

  try {
    const { mensagem, historico, snapshotIndice } = req.body || {};

    if (!mensagem || typeof mensagem !== 'string' || mensagem.trim() === '') {
      return res.status(400).json({ erro: 'Mensagem não pode estar em branco.' });
    }

    // 1. System Instruction
    const snapshotTexto = snapshotIndice
      ? typeof snapshotIndice === 'string'
        ? snapshotIndice
        : JSON.stringify(snapshotIndice, null, 2)
      : 'Nenhum snapshot do índice fornecido.';

    const systemInstruction = gerarPromptChat(snapshotTexto);

    // 2. Formatar histórico (últimas 10 mensagens)
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
    if (Array.isArray(historico)) {
      const historicoRecente = historico.slice(-10);
      for (const item of historicoRecente) {
        const role = item.role === 'assistant' || item.role === 'model' ? 'model' as const : 'user' as const;
        const text = item.text || item.content || '';
        if (text) {
          contents.push({ role, parts: [{ text }] });
        }
      }
    }

    contents.push({ role: 'user', parts: [{ text: mensagem }] });

    // 3. Chamada de IA
    const resultadoIA = await chamarIA({
      uid: ctx.uid,
      systemInstruction,
      contents,
      responseSchema: CHAT_RESPONSE_SCHEMA,
      userConfig: ctx.userConfig,
    });

    let rawObj: Record<string, unknown> = {};
    try {
      rawObj = JSON.parse(resultadoIA.texto) as Record<string, unknown>;
    } catch {
      rawObj = {
        resposta: resultadoIA.texto || 'Não foi possível obter uma resposta estruturada do assistente.',
        temProposta: false,
      };
    }

    // 4. Validar proposta com Zod
    let propostaValida = null;
    if (rawObj.temProposta && rawObj.proposta) {
      const parseResult = propostaSchema.safeParse(rawObj.proposta);
      if (parseResult.success) {
        propostaValida = parseResult.data;
      } else {
        const propObj = (rawObj.proposta && typeof rawObj.proposta === 'object')
          ? (rawObj.proposta as Record<string, unknown>)
          : {};
        try {
          propostaValida = propostaSchema.parse({
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
          propostaValida = null;
        }
      }
    }

    return res.json({
      resposta: (rawObj.resposta as string) || 'Não foi possível obter uma resposta do assistente.',
      proposta: propostaValida,
      dadosConsultados: rawObj.dadosConsultados || null,
    });
  } catch (err: unknown) {
    return tratarErroIA(err, res);
  }
}

export default withAuth(handler);
