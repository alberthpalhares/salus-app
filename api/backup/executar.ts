import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Readable } from 'stream';
import { withAuth, AuthContext } from '../_lib/requireAuth';
import { adminDb } from '../_lib/firebase-admin';
import { obterClienteDriveAutenticado, garantirPastaRaizDrive } from '../_lib/drive/clienteDrive';

async function handler(req: VercelRequest, res: VercelResponse, ctx: AuthContext) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  try {
    if (!ctx.userConfig.drive_refresh_token) {
      return res.status(400).json({ error: 'Google Drive não conectado. Conecte primeiro em Ajustes.' });
    }

    const driveClient = await obterClienteDriveAutenticado(ctx.userConfig.drive_refresh_token);
    const pastaRaizId = await garantirPastaRaizDrive(driveClient, ctx.userConfig.drive_pasta_raiz_id);

    // Coletar todos os dados do usuário do Firestore
    const userDocRef = adminDb.collection('usuarios').doc(ctx.uid);
    const collections = ['membros', 'caixa_entrada', 'perfil'];
    const backupData: Record<string, unknown> = {};

    for (const col of collections) {
      const snap = await userDocRef.collection(col).get();
      backupData[col] = snap.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data();
        return acc;
      }, {} as Record<string, unknown>);
    }

    backupData._meta = {
      exportado_em: new Date().toISOString(),
      uid: ctx.uid,
      versao: '0.4.0',
    };

    const jsonStr = JSON.stringify(backupData, null, 2);
    const buffer = Buffer.from(jsonStr, 'utf-8');
    const stream = Readable.from(buffer);

    const nomeArquivo = `backup_${new Date().toISOString().slice(0, 10)}.json`;

    // Buscar ou criar pasta de backups
    let backupPastaId = '';
    const searchRes = await driveClient.files.list({
      q: `name = '_backups' and '${pastaRaizId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: 'files(id)',
    });

    if (searchRes.data.files && searchRes.data.files.length > 0) {
      backupPastaId = searchRes.data.files[0].id!;
    } else {
      const createRes = await driveClient.files.create({
        requestBody: {
          name: '_backups',
          mimeType: 'application/vnd.google-apps.folder',
          parents: [pastaRaizId],
        },
        fields: 'id',
      });
      backupPastaId = createRes.data.id!;
    }

    await driveClient.files.create({
      requestBody: {
        name: nomeArquivo,
        parents: [backupPastaId],
        mimeType: 'application/json',
      },
      media: {
        mimeType: 'application/json',
        body: stream,
      },
    });

    // Atualizar timestamp de backup
    await adminDb
      .collection('usuarios')
      .doc(ctx.uid)
      .collection('perfil')
      .doc('config')
      .set({ ultimo_backup: new Date().toISOString() }, { merge: true });

    res.json({ success: true, arquivo: nomeArquivo });
  } catch (err: unknown) {
    console.error('[backup] Erro:', err);
    res.status(500).json({ error: 'Erro ao executar backup: ' + (err as Error).message });
  }
}

export default withAuth(handler);
