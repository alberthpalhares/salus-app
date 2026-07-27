import type { VercelResponse } from '@vercel/node';

/**
 * Tratamento centralizado de erros de IA para serverless functions.
 */
export function tratarErroIA(err: unknown, res: VercelResponse): VercelResponse {
  const errMsg = err instanceof Error ? err.message : 'Erro desconhecido';

  if (errMsg.includes('chave_ausente')) {
    return res.status(400).json({ erro: 'chave_ausente' });
  }

  if (
    errMsg.includes('API key') ||
    errMsg.includes('API_KEY') ||
    errMsg.includes('INVALID_ARGUMENT') ||
    errMsg.includes('UNAUTHENTICATED') ||
    errMsg.includes('API key not valid')
  ) {
    return res.status(400).json({
      erro: 'Sua chave de IA é inválida ou expirou. Verifique sua chave em Ajustes.',
    });
  }

  if (
    errMsg.includes('RESOURCE_EXHAUSTED') ||
    errMsg.includes('quota') ||
    errMsg.includes('429')
  ) {
    return res.status(429).json({
      erro: 'Sua cota de uso da IA foi excedida. Aguarde um momento ou verifique sua conta no provedor.',
    });
  }

  console.error('[IA] Erro:', errMsg);
  return res.status(500).json({ erro: `Erro ao comunicar com a IA: ${errMsg}` });
}
