import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Endpoint de diagnóstico — NÃO expõe segredos.
 * Verifica se as variáveis de ambiente e o Firebase Admin inicializam.
 */
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const checks: Record<string, string> = {};

  // 1. Variáveis de ambiente
  checks['APP_URL'] = process.env.APP_URL ? '✅ definida' : '❌ ausente';
  checks['GOOGLE_CLIENT_ID'] = process.env.GOOGLE_CLIENT_ID ? '✅ definida' : '❌ ausente';
  checks['GOOGLE_CLIENT_SECRET'] = process.env.GOOGLE_CLIENT_SECRET ? '✅ definida' : '❌ ausente';

  const saJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  checks['FIREBASE_SERVICE_ACCOUNT'] = saJson ? `✅ definida (${saJson.length} chars)` : '❌ ausente';

  // 2. Verificar se o JSON é válido
  if (saJson) {
    try {
      const parsed = JSON.parse(saJson);
      checks['SA_JSON_PARSE'] = '✅ JSON válido';
      checks['SA_project_id'] = parsed.project_id ? `✅ ${parsed.project_id}` : '❌ ausente';
      checks['SA_client_email'] = parsed.client_email ? `✅ ${parsed.client_email}` : '❌ ausente';
      checks['SA_private_key_start'] = parsed.private_key
        ? `✅ começa com "${parsed.private_key.substring(0, 30)}..."`
        : '❌ ausente';
      checks['SA_private_key_has_newlines'] = parsed.private_key?.includes('\n')
        ? '✅ tem newlines reais'
        : '⚠️ sem newlines reais (pode ter \\n literal)';
    } catch (e) {
      checks['SA_JSON_PARSE'] = `❌ erro: ${(e as Error).message}`;
    }
  }

  // 3. Tentar inicializar Firebase Admin
  try {
    const { adminAuth } = await import('./_lib/firebase-admin');
    checks['FIREBASE_ADMIN'] = adminAuth ? '✅ inicializado' : '❌ falhou';
  } catch (e) {
    checks['FIREBASE_ADMIN'] = `❌ erro: ${(e as Error).message}`;
  }

  res.json({ status: 'ok', checks });
}
