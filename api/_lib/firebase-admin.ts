import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

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
    const serviceAccount = JSON.parse(serviceAccountJson);
    adminApp = initializeApp({
      credential: cert(serviceAccount),
      projectId: firebaseConfig.projectId,
    });
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

