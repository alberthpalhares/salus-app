import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import firebaseConfig from '../../firebase-applet-config.json' with { type: 'json' };

// ─────────────────────────────────────────────────────────────
// Firebase Admin — singleton para serverless (Vercel)
// Em produção (Vercel), usa a variável FIREBASE_SERVICE_ACCOUNT.
// Em desenvolvimento local, usa ADC (Application Default Credentials).
// ─────────────────────────────────────────────────────────────

let adminApp: App;

if (!getApps().length) {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (serviceAccountJson) {
    // Produção (Vercel): usa Service Account explícita
    try {
      const serviceAccount = JSON.parse(serviceAccountJson);
      // Corrigir \n literal → newline real na private_key
      // (Vercel UI pode escapar as quebras de linha do PEM)
      if (serviceAccount.private_key && typeof serviceAccount.private_key === 'string') {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }
      adminApp = initializeApp({
        credential: cert(serviceAccount),
        projectId: firebaseConfig.projectId,
      });
    } catch (err) {
      console.error('[firebase-admin] Erro ao inicializar com Service Account:', err);
      // Fallback: inicializa sem credenciais (limitado)
      adminApp = initializeApp({ projectId: firebaseConfig.projectId });
    }
  } else {
    // Desenvolvimento local: usa ADC
    adminApp = initializeApp({
      projectId: firebaseConfig.projectId,
    });
  }
} else {
  adminApp = getApps()[0];
}

const databaseId = (firebaseConfig as Record<string, string>).firestoreDatabaseId || '(default)';

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp, databaseId);
export { adminApp };

