import type { VercelRequest, VercelResponse } from '@vercel/node';
import { adminDb } from '../_lib/firebase-admin.js';
import { getOAuth2Client, obterClienteDriveAutenticado, garantirPastaRaizDrive } from '../_lib/drive/clienteDrive.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  try {
    const code = req.query.code as string;
    const stateStr = req.query.state as string;

    if (!code || !stateStr) {
      return res.status(400).send('Código de autorização ou state ausente.');
    }

    let uid = '';
    let redirectUri = '';

    try {
      const stateObj = JSON.parse(Buffer.from(stateStr, 'base64').toString('utf8'));
      uid = stateObj.uid;
      redirectUri = stateObj.redirectUri;
    } catch {
      return res.status(400).send('State inválido.');
    }

    if (!uid || !redirectUri) {
      return res.status(400).send('UID ou redirectUri ausente.');
    }

    const oauth2Client = getOAuth2Client(redirectUri);
    const { tokens } = await oauth2Client.getToken(code);

    // Salvar token server-side via firebase-admin
    if (tokens.refresh_token) {
      let folderId = '';
      try {
        const driveClient = await obterClienteDriveAutenticado(tokens.refresh_token);
        folderId = await garantirPastaRaizDrive(driveClient);
      } catch (driveErr) {
        console.warn('[driveCallback] Erro ao criar pasta raiz:', driveErr);
      }

      await adminDb
        .collection('usuarios')
        .doc(uid)
        .collection('perfil')
        .doc('config')
        .set(
          {
            drive_refresh_token: tokens.refresh_token,
            ...(folderId ? { drive_pasta_raiz_id: folderId } : {}),
          },
          { merge: true }
        );
    }

    // Resposta HTML segura — nenhum token no HTML
    const appOrigin = process.env.APP_URL || '';
    const safeOrigin = JSON.stringify(appOrigin || '*');

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Google Drive Conectado</title>
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #f8fafc; color: #0f172a;">
  <div style="text-align: center; padding: 2.5rem; background: white; border-radius: 1.25rem; border: 1px solid #e2e8f0; max-width: 420px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);">
    <div style="font-size: 3rem; margin-bottom: 1rem;">🩺</div>
    <h2 style="margin: 0 0 0.5rem 0; font-size: 1.25rem;">Google Drive Conectado!</h2>
    <p style="color: #64748b; font-size: 0.875rem; margin-bottom: 1.5rem; line-height: 1.5;">
      Configuração concluída. Esta janela será fechada automaticamente.
    </p>
    <script>
      if (window.opener) {
        try {
          window.opener.postMessage({ type: 'SALUS_DRIVE_AUTH_SUCCESS' }, ${safeOrigin});
        } catch(e) {}
        setTimeout(function() { window.close(); }, 1200);
      } else {
        setTimeout(function() { window.location.href = '/?drive=conectado'; }, 1500);
      }
    </script>
  </div>
</body>
</html>`);
  } catch (err: unknown) {
    console.error('Erro no callback do Google Drive:', err);
    res.status(500).send('Erro ao finalizar conexão com o Google Drive.');
  }
}
