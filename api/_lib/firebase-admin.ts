import { Firestore } from '@google-cloud/firestore';
import firebaseConfig from '../../firebase-applet-config.json' with { type: 'json' };

// ─────────────────────────────────────────────────────────────
// Firestore Admin (Google Cloud SDK oficial) — singleton para Vercel
// Em produção (Vercel), usa a variável FIREBASE_SERVICE_ACCOUNT.
// Em desenvolvimento local, usa ADC ou a chave do projeto.
// ─────────────────────────────────────────────────────────────

let db: Firestore;

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
const databaseId = (firebaseConfig as Record<string, string>).firestoreDatabaseId || '(default)';

if (serviceAccountJson) {
  try {
    const serviceAccount = JSON.parse(serviceAccountJson);
    if (serviceAccount.private_key && typeof serviceAccount.private_key === 'string') {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
    db = new Firestore({
      projectId: serviceAccount.project_id || firebaseConfig.projectId,
      credentials: {
        client_email: serviceAccount.client_email,
        private_key: serviceAccount.private_key,
      },
      databaseId,
    });
  } catch (err) {
    console.error('[firestore] Erro ao inicializar com Service Account:', err);
    db = new Firestore({
      projectId: firebaseConfig.projectId,
      databaseId,
    });
  }
} else {
  db = new Firestore({
    projectId: firebaseConfig.projectId,
    databaseId,
  });
}

export const adminDb = db;
