import type { VercelRequest, VercelResponse } from '@vercel/node';
import { adminAuth, adminDb } from './firebase-admin.js';

// ─────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────

export interface ProvedorIA {
  tipo: 'gemini' | 'openai_compat' | 'groq' | 'openrouter' | 'mistral' | 'custom';
  url_base?: string;
  modelo: string;
  chave: string;
  suporta_imagem?: boolean;
  suporta_audio?: boolean;
  suporta_pdf?: boolean;
}

export interface UserConfigServer {
  provedor_ia?: ProvedorIA;
  drive_refresh_token?: string;
  drive_pasta_raiz_id?: string;
  backup_automatico?: boolean;
  plano?: 'free' | 'premium';
}

export interface AuthContext {
  uid: string;
  email?: string;
  userConfig: UserConfigServer;
}

// ─────────────────────────────────────────────────────────────
// Verificação de Token + carregamento de config
// ─────────────────────────────────────────────────────────────

/**
 * Verifica o Firebase ID Token e carrega a config do Firestore via admin.
 * Retorna o contexto autenticado ou null se inválido.
 */
export async function verificarAuth(req: VercelRequest): Promise<AuthContext> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Não autorizado. Token de autenticação não fornecido.');
  }

  const token = authHeader.split('Bearer ')[1]?.trim();
  if (!token) {
    throw new Error('Não autorizado. Token em branco.');
  }

  // Verificação criptográfica — sem fallback
  const decodedToken = await adminAuth.verifyIdToken(token);
  if (!decodedToken?.uid) {
    throw new Error('Token decodificado não possui uid.');
  }

  const uid = decodedToken.uid;
  const email = decodedToken.email;

  // Carregar config do Firestore via admin
  let userConfig: UserConfigServer = { plano: 'free' };
  try {
    const configDoc = await adminDb
      .collection('usuarios')
      .doc(uid)
      .collection('perfil')
      .doc('config')
      .get();

    if (configDoc.exists) {
      const data = configDoc.data() || {};
      userConfig = {
        provedor_ia: data.provedor_ia || undefined,
        drive_refresh_token: data.drive_refresh_token || undefined,
        drive_pasta_raiz_id: data.drive_pasta_raiz_id || undefined,
        backup_automatico: data.backup_automatico || false,
        plano: data.plano || 'free',
      };
    }
  } catch (err) {
    console.error(`[auth] Erro ao carregar config de ${uid}:`, err);
  }

  return { uid, email, userConfig };
}

/**
 * Wrapper para proteger uma serverless function.
 * Retorna 401 se não autenticado.
 */
export function withAuth(
  handler: (req: VercelRequest, res: VercelResponse, ctx: AuthContext) => Promise<unknown>
) {
  return async (req: VercelRequest, res: VercelResponse) => {
    try {
      const ctx = await verificarAuth(req);
      return handler(req, res, ctx);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Acesso não autorizado.';
      return res.status(401).json({ error: message });
    }
  };
}
