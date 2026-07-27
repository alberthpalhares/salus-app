import { deleteUser } from 'firebase/auth';
import { collection, doc, getDocs, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../../data/firebase';
import { limparConversa } from '../../data/repositorios/conversas';

/**
 * Apaga permanentemente todas as coleções de dados do usuário no Firestore.
 */
export async function limparDadosDoUsuario(uid: string, incluirConfig = true): Promise<void> {
  const colecoes = [
    'membros',
    'medicamentos',
    'vacinas',
    'checkups',
    'exames',
    'eventos',
    'analises',
    'caixaEntrada',
    'documentos',
  ];

  for (const colName of colecoes) {
    try {
      const path = `usuarios/${uid}/${colName}`;
      const snap = await getDocs(collection(db, path));
      for (const d of snap.docs) {
        await deleteDoc(d.ref);
      }
    } catch (e) {
      console.warn(`Aviso ao apagar coleção ${colName}:`, e);
    }
  }

  try {
    await deleteDoc(doc(db, `usuarios/${uid}/familia/info`));
  } catch {}

  try {
    await limparConversa(uid);
  } catch {}

  if (incluirConfig) {
    try {
      await deleteDoc(doc(db, `usuarios/${uid}/perfil/config`));
    } catch {}
  }
}

/**
 * Fluxo de exclusão definitiva da conta do usuário.
 */
export async function excluirTodaAContaDoUsuario(uid: string): Promise<void> {
  // 1. Apagar todos os dados estruturados do Firestore
  await limparDadosDoUsuario(uid, true);

  // 2. Apagar a conta do Firebase Authentication
  const user = auth.currentUser;
  if (user) {
    await deleteUser(user);
  }
}
