import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore, setLogLevel } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = initializeFirestore(app, { ignoreUndefinedProperties: true }, firebaseConfig.firestoreDatabaseId || undefined);

// Silencia avisos de desenvolvimento e conexões secundárias do Firestore no console
setLogLevel('error');

// Google Auth Provider with Google Drive and Google Calendar scopes
export const googleProvider = new GoogleAuthProvider();
