import { google } from 'googleapis';

// ─────────────────────────────────────────────────────────────
// OAuth2 Client
// ─────────────────────────────────────────────────────────────

/**
 * Retorna uma instância do cliente OAuth2 configurado.
 * Client ID e Secret vêm das variáveis de ambiente.
 */
export function getOAuth2Client(redirectUri?: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.OAUTH_CLIENT_ID || '';
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || process.env.OAUTH_CLIENT_SECRET || '';

  if (!clientId) {
    throw new Error('GOOGLE_CLIENT_ID não configurado. Verifique as variáveis de ambiente.');
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

// ─────────────────────────────────────────────────────────────
// Drive Client autenticado
// ─────────────────────────────────────────────────────────────

/**
 * Obtém o cliente do Google Drive autenticado silenciosamente
 * a partir do refresh_token do usuário.
 */
export async function obterClienteDriveAutenticado(refreshToken: string | undefined) {
  if (!refreshToken) {
    throw new Error('Google Drive não conectado para este usuário.');
  }

  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  return google.drive({ version: 'v3', auth: oauth2Client });
}

// ─────────────────────────────────────────────────────────────
// Pasta raiz no Drive
// ─────────────────────────────────────────────────────────────

/**
 * Garante a existência da pasta raiz do app no Drive do usuário.
 * Nome será atualizado quando o nome definitivo do app for definido.
 */
const APP_DRIVE_FOLDER_NAME = 'Salus App';

export async function garantirPastaRaizDrive(
  driveClient: ReturnType<typeof google.drive>,
  currentFolderId?: string
): Promise<string> {
  if (currentFolderId) {
    // Verificar se a pasta ainda existe
    try {
      await driveClient.files.get({ fileId: currentFolderId, fields: 'id, trashed' });
      return currentFolderId;
    } catch {
      // Pasta foi deletada, vamos recriar
    }
  }

  // Buscar se a pasta já existe
  const searchRes = await driveClient.files.list({
    q: `name = '${APP_DRIVE_FOLDER_NAME}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id, name)',
  });

  if (searchRes.data.files && searchRes.data.files.length > 0) {
    return searchRes.data.files[0].id!;
  }

  // Criar a pasta raiz
  const createRes = await driveClient.files.create({
    requestBody: {
      name: APP_DRIVE_FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder',
    },
    fields: 'id',
  });

  return createRes.data.id!;
}
