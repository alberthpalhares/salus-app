import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Readable } from 'stream';
import { withAuth, AuthContext } from '../_lib/requireAuth.js';
import { adminDb } from '../_lib/firebase-admin.js';
import { obterClienteDriveAutenticado, garantirPastaRaizDrive } from '../_lib/drive/clienteDrive.js';

async function handler(req: VercelRequest, res: VercelResponse, ctx: AuthContext) {
  const action = (req.query.action as string) || (req.url?.includes('verificar') ? 'verificar' : req.url?.includes('cron') ? 'cron' : 'executar');

  if (action === 'verificar' || (req.method === 'GET' && action !== 'cron')) {
    const ultimoBackup = ctx.userConfig.backup_automatico ? (ctx.userConfig as Record<string, unknown>).ultimo_backup : undefined;
    const diasSemBackup = ultimoBackup
      ? Math.floor((Date.now() - new Date(ultimoBackup as string).getTime()) / (1000 * 60 * 60 * 24))
      : 999;

    return res.json({
      vencido: diasSemBackup > 7,
      ultimo_backup: ultimoBackup || null,
      dias_sem_backup: diasSemBackup,
      backup_automatico: ctx.userConfig.backup_automatico || false,
    });
  }

  if (action === 'cron') {
    return res.json({
      status: 'ok',
      message: 'SISAFAM Cron Job executado com sucesso.',
      timestamp: new Date().toISOString(),
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  try {
    if (!ctx.userConfig.drive_refresh_token) {
      return res.status(400).json({ error: 'Google Drive não conectado. Conecte primeiro em Ajustes.' });
    }

    const driveClient = await obterClienteDriveAutenticado(ctx.userConfig.drive_refresh_token);
    const pastaRaizId = await garantirPastaRaizDrive(driveClient, ctx.userConfig.drive_pasta_raiz_id);

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
      versao: '0.4.4',
    };

    const jsonStr = JSON.stringify(backupData, null, 2);
    const buffer = Buffer.from(jsonStr, 'utf-8');
    const stream = Readable.from(buffer);

    const nomeArquivo = `backup_${new Date().toISOString().slice(0, 10)}.json`;

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

    await adminDb
      .collection('usuarios')
      .doc(ctx.uid)
      .collection('perfil')
      .doc('config')
      .set({ ultimo_backup: new Date().toISOString() }, { merge: true });

    return res.json({ success: true, arquivo: nomeArquivo });
  } catch (err: unknown) {
    console.error('[backup] Erro:', err);
    return res.status(500).json({ error: 'Erro ao executar backup: ' + (err as Error).message });
  }
}

export default withAuth(handler);
