import { collection, doc, getDocs, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Membro } from '../../types/dominio';
import { handleFirestoreError, OperationType } from './base';

function getCollectionPath(uid: string): string {
  return `usuarios/${uid}/membros`;
}

export async function listar(uid: string): Promise<Membro[]> {
  const path = getCollectionPath(uid);
  try {
    const snapshot = await getDocs(collection(db, path));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Membro));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function obterPorId(uid: string, id: string): Promise<Membro | null> {
  const path = `${getCollectionPath(uid)}/${id}`;
  try {
    const snap = await getDoc(doc(db, path));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Membro;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function salvar(uid: string, dado: Membro): Promise<void> {
  const collectionPath = getCollectionPath(uid);
  const docId = dado.id || doc(collection(db, collectionPath)).id;
  const path = `${collectionPath}/${docId}`;
  const payload = { ...dado, id: docId };
  try {
    await setDoc(doc(db, collectionPath, docId), payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function remover(uid: string, id: string): Promise<void> {
  const path = `${getCollectionPath(uid)}/${id}`;
  try {
    await deleteDoc(doc(db, path));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
