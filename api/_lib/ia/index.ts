import { GoogleGenAI } from '@google/genai';
import type { UserConfigServer } from '../requireAuth.js';

// ─────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────

export interface ParametrosChamarIA {
  uid: string;
  systemInstruction?: string;
  contents: unknown;
  responseSchema?: unknown;
  modeloPadrao?: string;
  userConfig?: UserConfigServer;
}

export interface RespostaIA {
  texto: string;
  bruto?: unknown;
}

// ─────────────────────────────────────────────────────────────
// Interface única de proxy stateless para IA
// Resolve o provedor e a chave do userConfig (carregado do Firestore pelo middleware).
// Garante isolamento total (BYOK) sem retenção.
// ─────────────────────────────────────────────────────────────

export async function chamarIA(params: ParametrosChamarIA): Promise<RespostaIA> {
  const { uid, systemInstruction, contents, responseSchema, modeloPadrao = 'gemini-2.5-flash', userConfig } = params;

  if (!uid) {
    throw new Error('UID do usuário não informado para chamada de IA.');
  }

  const provedor = userConfig?.provedor_ia;

  if (!provedor || !provedor.chave || provedor.chave.trim() === '') {
    throw new Error('chave_ausente');
  }

  const chaveLimpa = provedor.chave.trim();
  const tipoProvedor = provedor.tipo || 'gemini';
  const modelo = provedor.modelo || modeloPadrao;
  const urlBase = provedor.url_base || '';

  // ── Adaptador OpenAI-compat (Groq, OpenRouter, Mistral, OpenAI, custom) ──
  if (tipoProvedor === 'openai_compat' || tipoProvedor === 'groq' || tipoProvedor === 'openrouter' || tipoProvedor === 'mistral' || tipoProvedor === 'custom') {
    const endpoint = urlBase || getDefaultEndpoint(tipoProvedor);

    const messages: Array<{ role: string; content: string }> = [];
    if (systemInstruction) {
      messages.push({ role: 'system', content: systemInstruction });
    }

    if (Array.isArray(contents)) {
      for (const item of contents) {
        const role = item.role === 'model' ? 'assistant' : (item.role || 'user');
        let textContent = '';
        if (Array.isArray(item.parts)) {
          textContent = item.parts.map((p: { text?: string }) => p.text || '').join('\n');
        } else if (typeof item === 'string') {
          textContent = item;
        }
        messages.push({ role, content: textContent });
      }
    } else if (typeof contents === 'string') {
      messages.push({ role: 'user', content: contents });
    }

    const resOpenAI = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${chaveLimpa}`,
      },
      body: JSON.stringify({
        model: modelo,
        messages,
        response_format: { type: 'json_object' },
      }),
    });

    if (!resOpenAI.ok) {
      const errText = await resOpenAI.text();
      throw new Error(`Erro no provedor ${tipoProvedor}: ${resOpenAI.status} - ${errText}`);
    }

    const dataOpenAI = (await resOpenAI.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const outputText = dataOpenAI.choices?.[0]?.message?.content || '{}';
    return { texto: outputText, bruto: dataOpenAI };

  } else {
    // ── Adaptador Nativo Google Gemini ──
    const ai = new GoogleGenAI({ apiKey: chaveLimpa });

    const response = await ai.models.generateContent({
      model: modelo || 'gemini-2.5-flash',
      contents: contents as Parameters<typeof ai.models.generateContent>[0]['contents'],
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: responseSchema as Parameters<typeof ai.models.generateContent>[0]['config'] extends { responseSchema?: infer S } ? S : unknown,
      },
    });

    return {
      texto: response.text || '{}',
      bruto: response,
    };
  }
}

// ─────────────────────────────────────────────────────────────
// Endpoints padrão por provedor
// ─────────────────────────────────────────────────────────────

export function getDefaultEndpoint(tipo: string): string {
  switch (tipo) {
    case 'groq':
      return 'https://api.groq.com/openai/v1/chat/completions';
    case 'openrouter':
      return 'https://openrouter.ai/api/v1/chat/completions';
    case 'mistral':
      return 'https://api.mistral.ai/v1/chat/completions';
    case 'openai_compat':
    case 'custom':
    default:
      return 'https://api.openai.com/v1/chat/completions';
  }
}
