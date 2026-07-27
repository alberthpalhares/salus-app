import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withAuth, AuthContext } from '../_lib/requireAuth';

async function handler(req: VercelRequest, res: VercelResponse, ctx: AuthContext) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const ultimoBackup = ctx.userConfig.backup_automatico ? (ctx.userConfig as Record<string, unknown>).ultimo_backup : undefined;
  const diasSemBackup = ultimoBackup
    ? Math.floor((Date.now() - new Date(ultimoBackup as string).getTime()) / (1000 * 60 * 60 * 24))
    : 999;

  res.json({
    vencido: diasSemBackup > 7,
    ultimo_backup: ultimoBackup || null,
    dias_sem_backup: diasSemBackup,
    backup_automatico: ctx.userConfig.backup_automatico || false,
  });
}

export default withAuth(handler);
