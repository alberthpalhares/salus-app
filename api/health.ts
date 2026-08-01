import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Diagnóstico completo: testa Firebase Admin + Drive OAuth setup
 */
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const checks: Record<string, string> = {};

  // 1. Env vars
  checks['APP_URL'] = process.env.APP_URL || 'ausente';
  checks['GOOGLE_CLIENT_ID'] = process.env.GOOGLE_CLIENT_ID ? 'ok' : 'ausente';
  checks['GOOGLE_CLIENT_SECRET'] = process.env.GOOGLE_CLIENT_SECRET ? 'ok' : 'ausente';

  // 2. Firebase Admin (Firestore)
  try {
    const { adminDb } = await import('./_lib/firebase-admin.js');
    checks['firebase_admin'] = adminDb ? 'ok - inicializado' : 'erro - null';
  } catch (e: unknown) {
    checks['firebase_admin'] = `erro: ${(e as Error).message}`;
  }

  // 3. Drive OAuth client
  try {
    const { getOAuth2Client } = await import('./_lib/drive/clienteDrive.js');
    const client = getOAuth2Client('https://example.com/callback');
    checks['drive_oauth_client'] = client ? 'ok - criado' : 'erro - null';
  } catch (e: unknown) {
    checks['drive_oauth_client'] = `erro: ${(e as Error).message}`;
  }

  res.status(200).json(checks);
}
