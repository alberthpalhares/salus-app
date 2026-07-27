import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withAuth, AuthContext } from '../_lib/requireAuth';
import { adminDb } from '../_lib/firebase-admin';

async function handler(req: VercelRequest, res: VercelResponse, ctx: AuthContext) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  try {
    // Remover refresh token do Firestore
    await adminDb
      .collection('usuarios')
      .doc(ctx.uid)
      .collection('perfil')
      .doc('config')
      .set(
        {
          drive_refresh_token: '',
          drive_pasta_raiz_id: '',
        },
        { merge: true }
      );

    res.json({ success: true });
  } catch (err: unknown) {
    res.status(500).json({ error: 'Erro ao desconectar Drive: ' + (err as Error).message });
  }
}

export default withAuth(handler);
