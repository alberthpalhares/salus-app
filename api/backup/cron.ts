import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Handler para o Vercel Cron (agendado em vercel.json para rodar diariamente às 03:00 UTC).
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.json({
    status: 'ok',
    message: 'Salus Cron Job executado com sucesso.',
    timestamp: new Date().toISOString(),
  });
}
