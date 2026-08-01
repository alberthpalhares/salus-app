import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withAuth, AuthContext } from './_lib/requireAuth.js';
import { adminDb } from './_lib/firebase-admin.js';
import { gerarPromptExtracao } from './_lib/prompts/extrair.js';
import { PROPOSTA_RESPONSE_SCHEMA } from './_lib/schemas/propostaSchema.js';
import { propostaSchema } from '../src/types/propostas.js';
import { chamarIA } from './_lib/ia/index.js';
import { tratarErroIA } from './_lib/errorHandler.js';

async function handler(req: VercelRequest, res: VercelResponse, ctx: AuthContext) {
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido.' });
  }

  try {
    const { base64Data, mime } = req.body || {};

    if (!base64Data || typeof base64Data !== 'string') {
      return res.status(400).json({ erro: 'Nenhum arquivo foi enviado para extração.' });
    }

    // 1. Buscar membros via admin SDK
    const membrosSnap = await adminDb
      .collection('usuarios')
      .doc(ctx.uid)
      .collection('membros')
      .get();

    const membros = membrosSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    const mimeType = (mime as string) || 'application/pdf';

    const promptText = gerarPromptExtracao(membros as Parameters<typeof gerarPromptExtracao>[0]);

    const contents = {
      parts: [
        { inlineData: { mimeType, data: base64Data } },
        { text: promptText },
      ],
    };

    // 2. Chamada de IA
    const resultadoIA = await chamarIA({
      uid: ctx.uid,
      contents,
      responseSchema: PROPOSTA_RESPONSE_SCHEMA,
      userConfig: ctx.userConfig,
    });

    let rawObj: Record<string, unknown>;
    try {
      rawObj = JSON.parse(resultadoIA.texto) as Record<string, unknown>;
    } catch {
      return res.status(500).json({ erro: 'A IA não retornou um formato JSON válido.' });
    }

    // 3. Validação com Zod
    const parseResult = propostaSchema.safeParse(rawObj);

    if (!parseResult.success) {
      const fallback = propostaSchema.parse({
        documento: rawObj.documento || {},
        membro: rawObj.membro || {},
        exames: rawObj.exames || [],
        medicamentos: rawObj.medicamentos || [],
        vacinas: rawObj.vacinas || [],
        eventos: rawObj.eventos || [],
        observacoes: rawObj.observacoes || [],
      });
      return res.json({ success: true, proposta: fallback });
    }

    return res.json({ success: true, proposta: parseResult.data });
  } catch (err: unknown) {
    return tratarErroIA(err, res);
  }
}

export default withAuth(handler);
