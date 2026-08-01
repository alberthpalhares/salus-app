import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withAuth, AuthContext } from '../_lib/requireAuth.js';

async function handler(req: VercelRequest, res: VercelResponse, ctx: AuthContext) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  res.json({
    conectado: !!ctx.userConfig.drive_refresh_token,
  });
}

export default withAuth(handler);
