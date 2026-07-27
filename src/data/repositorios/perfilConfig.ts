import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { PerfilConfig } from '../../types/dominio';
import { handleFirestoreError, OperationType } from './base';

function getDocPath(uid: string): string {
  return `usuarios/${uid}/perfil/config`;
}

export async function obter(uid: string): Promise<PerfilConfig | null> {
  const path = getDocPath(uid);
  try {
    const snap = await getDoc(doc(db, path));
    if (!snap.exists()) return null;
    return snap.data() as PerfilConfig;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function obterPorId(uid: string, _id?: string): Promise<PerfilConfig | null> {
  return obter(uid);
}

export async function salvar(uid: string, dado: PerfilConfig): Promise<void> {
  const path = getDocPath(uid);
  try {
    await setDoc(doc(db, path), dado, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
