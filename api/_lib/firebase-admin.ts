import { initializeApp, getApps, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// ─────────────────────────────────────────────────────────────
// Firebase Admin — singleton para serverless (Vercel)
// Reutiliza a instância entre invocações da mesma function instance.
// ─────────────────────────────────────────────────────────────

let adminApp: App;

if (!getApps().length) {
  adminApp = initializeApp({
    projectId: firebaseConfig.projectId,
  });
} else {
  adminApp = getApps()[0];
}

const databaseId = (firebaseConfig as Record<string, string>).firestoreDatabaseId || '(default)';

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp, databaseId);
export { adminApp };
