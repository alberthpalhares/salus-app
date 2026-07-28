import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
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

  res.status(200).json(checks);
}
