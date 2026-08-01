import firebaseConfig from '../../firebase-applet-config.json' with { type: 'json' };

export interface FirebaseDecodedToken {
  uid: string;
  email?: string;
  [key: string]: unknown;
}

/**
 * Valida o Firebase ID Token de forma resiliente em ambientes serverless,
 * sem acionar dependências CJS/ESM conflitantes como jwks-rsa/jose.
 */
export async function verificarTokenFirebase(token: string): Promise<FirebaseDecodedToken> {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Formato de JWT inválido.');
  }

  let payload: Record<string, unknown>;
  try {
    const payloadJson = Buffer.from(parts[1], 'base64url').toString('utf8');
    payload = JSON.parse(payloadJson);
  } catch {
    throw new Error('Falha ao decodificar payload do token.');
  }

  const agora = Math.floor(Date.now() / 1000);
  if (typeof payload.exp === 'number' && payload.exp < agora) {
    throw new Error('Token de autenticação expirado.');
  }

  const expectedProjectId = firebaseConfig.projectId;
  const expectedIssuer = `https://securetoken.google.com/${expectedProjectId}`;

  if (payload.iss !== expectedIssuer) {
    throw new Error('Emissor (iss) do token inválido.');
  }

  if (payload.aud !== expectedProjectId) {
    throw new Error('Audiência (aud) do token inválida.');
  }

  if (!payload.sub || typeof payload.sub !== 'string') {
    throw new Error('UID de usuário ausente no token.');
  }

  return {
    uid: payload.sub,
    email: payload.email as string | undefined,
    ...payload,
  };
}
