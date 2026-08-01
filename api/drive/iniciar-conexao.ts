import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withAuth, AuthContext } from '../_lib/requireAuth.js';
import { getOAuth2Client } from '../_lib/drive/clienteDrive.js';

function getRedirectUri(req: VercelRequest): string {
  if (req.query.redirect_uri && typeof req.query.redirect_uri === 'string') {
    return req.query.redirect_uri;
  }
  if (req.query.origin && typeof req.query.origin === 'string') {
    return `${(req.query.origin as string).replace(/\/$/, '')}/api/drive/callback`;
  }
  if (process.env.APP_URL) {
    return `${process.env.APP_URL.replace(/\/$/, '')}/api/drive/callback`;
  }
  const proto = (req.headers['x-forwarded-proto'] as string) || 'https';
  const host = (req.headers['x-forwarded-host'] as string) || req.headers.host;
  return `${proto}://${host}/api/drive/callback`;
}

async function handler(req: VercelRequest, res: VercelResponse, ctx: AuthContext) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  try {
    const redirectUri = getRedirectUri(req);
    const oauth2Client = getOAuth2Client(redirectUri);

    const stateObj = { uid: ctx.uid, redirectUri };
    const stateStr = Buffer.from(JSON.stringify(stateObj)).toString('base64');

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: ['https://www.googleapis.com/auth/drive.file'],
      state: stateStr,
    });

    res.json({ url: authUrl });
  } catch (err: unknown) {
    res.status(500).json({ error: 'Erro ao gerar URL de conexão do Drive: ' + (err as Error).message });
  }
}

export default withAuth(handler);
