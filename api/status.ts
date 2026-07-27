import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.json({
    status: 'ok',
    app: '[APP_NAME] backend ativo',
    versao: '0.4.0',
    timestamp: new Date().toISOString(),
  });
}
