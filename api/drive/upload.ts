import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Readable } from 'stream';
import { withAuth, AuthContext } from '../_lib/requireAuth';
import { obterClienteDriveAutenticado, garantirPastaRaizDrive } from '../_lib/drive/clienteDrive';
import { adminDb } from '../_lib/firebase-admin';

// Vercel serverless max body size = 4.5MB

async function obterOuCriarSubpasta(
  driveClient: Awaited<ReturnType<typeof obterClienteDriveAutenticado>>,
  nome: string,
  pastaPaiId: string
): Promise<string> {
  const buscaRes = await driveClient.files.list({
    q: `name = '${nome}' and '${pastaPaiId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id)',
  });

  if (buscaRes.data.files && buscaRes.data.files.length > 0) {
    return buscaRes.data.files[0].id!;
  }

  const criarRes = await driveClient.files.create({
    requestBody: {
      name: nome,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [pastaPaiId],
    },
    fields: 'id',
  });

  return criarRes.data.id!;
}

async function handler(req: VercelRequest, res: VercelResponse, ctx: AuthContext) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  try {
    const { fileName, mimeType, base64Data, membroNome, novoNomeArquivo, tipoDocumento } = req.body || {};

    if (!fileName || !base64Data) {
      return res.status(400).json({ error: 'fileName e base64Data são obrigatórios.' });
    }

    const driveClient = await obterClienteDriveAutenticado(ctx.userConfig.drive_refresh_token);

    // Garantir pasta raiz
    const pastaRaizId = await garantirPastaRaizDrive(
      driveClient,
      ctx.userConfig.drive_pasta_raiz_id
    );

    // Salvar pasta raiz se nova
    if (pastaRaizId !== ctx.userConfig.drive_pasta_raiz_id) {
      await adminDb
        .collection('usuarios')
        .doc(ctx.uid)
        .collection('perfil')
        .doc('config')
        .set({ drive_pasta_raiz_id: pastaRaizId }, { merge: true });
    }

    // Resolver pasta de destino: raiz, ou pasta do membro (+ subpasta de tipo)
    let destPastaId = pastaRaizId;
    if (membroNome) {
      const membroPastaId = await obterOuCriarSubpasta(driveClient, membroNome, pastaRaizId);
      destPastaId = tipoDocumento
        ? await obterOuCriarSubpasta(driveClient, tipoDocumento, membroPastaId)
        : membroPastaId;
    }

    const buffer = Buffer.from(base64Data, 'base64');
    const stream = Readable.from(buffer);
    const nomeFinal = novoNomeArquivo || fileName;

    const driveRes = await driveClient.files.create({
      requestBody: {
        name: nomeFinal,
        parents: [destPastaId],
        mimeType: mimeType || 'application/octet-stream',
      },
      media: {
        mimeType: mimeType || 'application/octet-stream',
        body: stream,
      },
      fields: 'id, name, mimeType, size, webViewLink',
    });

    res.json({
      success: true,
      file: {
        drive_file_id: driveRes.data.id,
        nome_arquivo: driveRes.data.name,
        mime: driveRes.data.mimeType,
        tamanho_bytes: driveRes.data.size ? parseInt(driveRes.data.size, 10) : 0,
        webViewLink: driveRes.data.webViewLink,
      },
    });
  } catch (err: unknown) {
    console.error('[upload] Erro:', err);
    res.status(500).json({ error: 'Erro ao fazer upload: ' + (err as Error).message });
  }
}

export default withAuth(handler);
