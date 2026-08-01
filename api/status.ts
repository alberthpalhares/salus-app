import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const type = req.query.type as string;

  if (type === 'ping') {
    const checks: Record<string, string> = {};
    checks['APP_URL'] = process.env.APP_URL ? 'ok' : 'ausente';
    checks['GOOGLE_CLIENT_ID'] = process.env.GOOGLE_CLIENT_ID ? 'ok' : 'ausente';
    checks['GOOGLE_CLIENT_SECRET'] = process.env.GOOGLE_CLIENT_SECRET ? 'ok' : 'ausente';

    const saJson = process.env.FIREBASE_SERVICE_ACCOUNT;
    checks['FIREBASE_SERVICE_ACCOUNT'] = saJson ? `ok (${saJson.length} chars)` : 'ausente';

    if (saJson) {
      try {
        const parsed = JSON.parse(saJson);
        checks['sa_parse'] = 'json valido';
        checks['sa_project_id'] = parsed.project_id || 'ausente';
        checks['sa_client_email'] = parsed.client_email ? 'presente' : 'ausente';
        checks['sa_private_key'] = parsed.private_key ? `presente (${parsed.private_key.length} chars)` : 'ausente';
      } catch (e: unknown) {
        checks['sa_parse'] = `erro: ${(e as Error).message}`;
      }
    }
    return res.status(200).json(checks);
  }

  if (type === 'health') {
    const checks: Record<string, string> = {};
    checks['APP_URL'] = process.env.APP_URL || 'ausente';
    checks['GOOGLE_CLIENT_ID'] = process.env.GOOGLE_CLIENT_ID ? 'ok' : 'ausente';
    checks['GOOGLE_CLIENT_SECRET'] = process.env.GOOGLE_CLIENT_SECRET ? 'ok' : 'ausente';

    try {
      const { adminDb } = await import('./_lib/firebase-admin.js');
      checks['firebase_admin'] = adminDb ? 'ok - inicializado' : 'erro - null';
    } catch (e: unknown) {
      checks['firebase_admin'] = `erro: ${(e as Error).message}`;
    }

    try {
      const { getOAuth2Client } = await import('./_lib/drive/clienteDrive.js');
      const client = getOAuth2Client('https://example.com/callback');
      checks['drive_oauth_client'] = client ? 'ok - criado' : 'erro - null';
    } catch (e: unknown) {
      checks['drive_oauth_client'] = `erro: ${(e as Error).message}`;
    }

    return res.status(200).json(checks);
  }

  return res.json({
    status: 'ok',
    app: 'SISAFAM backend ativo',
    versao: '0.4.4',
    timestamp: new Date().toISOString(),
  });
}
