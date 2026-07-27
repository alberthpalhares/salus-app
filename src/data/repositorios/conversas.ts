import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { MensagemChat } from '../../servicos/api';

/**
 * Obtém a lista de mensagens salva da conversa do usuário.
 */
export async function obterConversa(uid: string): Promise<MensagemChat[]> {
  if (!uid) return [];
  try {
    const ref = doc(db, `usuarios/${uid}/conversas/principal`);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      return Array.isArray(data.mensagens) ? data.mensagens : [];
    }
    return [];
  } catch (err) {
    console.warn('[obterConversa] Erro ao carregar histórico de mensagens:', err);
    return [];
  }
}

/**
 * Salva a lista de mensagens da conversa do usuário no Firestore.
 */
export async function salvarConversa(uid: string, mensagens: MensagemChat[]): Promise<void> {
  if (!uid) return;
  try {
    const ref = doc(db, `usuarios/${uid}/conversas/principal`);
    await setDoc(
      ref,
      {
        mensagens,
        atualizado_em: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('[salvarConversa] Erro ao salvar histórico de mensagens:', err);
  }
}

/**
 * Apaga o histórico de conversa do usuário no Firestore.
 */
export async function limparConversa(uid: string): Promise<void> {
  if (!uid) return;
  try {
    const ref = doc(db, `usuarios/${uid}/conversas/principal`);
    await deleteDoc(ref);
  } catch (err) {
    console.warn('[limparConversa] Erro ao limpar conversa:', err);
  }
}
