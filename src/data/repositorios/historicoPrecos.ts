import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { RegistroPrecoMedicamento } from '../../types/dominio';
import { handleFirestoreError, OperationType } from './base';

function getCollectionPath(uid: string): string {
  return `usuarios/${uid}/historico_precos`;
}

export async function listar(uid: string): Promise<RegistroPrecoMedicamento[]> {
  const path = getCollectionPath(uid);
  try {
    const snapshot = await getDocs(collection(db, path));
    const lista = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as RegistroPrecoMedicamento));
    return lista.sort((a, b) => (b.data_compra || '').localeCompare(a.data_compra || ''));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function salvar(uid: string, dado: RegistroPrecoMedicamento): Promise<void> {
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
