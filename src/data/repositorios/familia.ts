import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Familia } from '../../types/dominio';
import { handleFirestoreError, OperationType } from './base';

function getDocPath(uid: string): string {
  return `usuarios/${uid}/familia/info`;
}

export async function obter(uid: string): Promise<Familia | null> {
  const path = getDocPath(uid);
  try {
    const snap = await getDoc(doc(db, path));
    if (!snap.exists()) return null;
    return snap.data() as Familia;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function obterPorId(uid: string, _id?: string): Promise<Familia | null> {
  return obter(uid);
}

export async function salvar(uid: string, dado: Familia): Promise<void> {
  const path = getDocPath(uid);
  try {
    await setDoc(doc(db, path), dado, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
