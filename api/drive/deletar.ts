import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withAuth, AuthContext } from '../_lib/requireAuth.js';
import { obterClienteDriveAutenticado } from '../_lib/drive/clienteDrive.js';

async function handler(req: VercelRequest, res: VercelResponse, ctx: AuthContext) {
  if (req.method !== 'DELETE' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  try {
    const fileId = (req.query.fileId as string) || req.body?.fileId;

    if (!fileId) {
      return res.status(400).json({ error: 'fileId é obrigatório.' });
    }

    if (!ctx.userConfig.drive_refresh_token) {
      return res.status(400).json({ error: 'Google Drive não conectado.' });
    }

    const driveClient = await obterClienteDriveAutenticado(ctx.userConfig.drive_refresh_token);

    await driveClient.files.delete({ fileId });

    res.json({ success: true });
  } catch (err: unknown) {
    console.error('[deletar] Erro ao remover arquivo do Drive:', err);
    res.status(500).json({ error: 'Erro ao remover arquivo: ' + (err as Error).message });
  }
}

export default withAuth(handler);
