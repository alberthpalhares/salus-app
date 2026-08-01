import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  signInAnonymously,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../data/firebase';

// ─────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────

export interface ProvedorIA {
  tipo: 'gemini' | 'openai_compat' | 'groq' | 'openrouter' | 'mistral' | 'custom';
  url_base?: string;
  modelo: string;
  chave: string;
  suporta_imagem?: boolean;
  suporta_audio?: boolean;
  suporta_pdf?: boolean;
}

export interface PerfilConfig {
  onboarding_concluido?: boolean;
  consentimentos?: Record<string, boolean>;
  provedor_ia?: ProvedorIA;
  drive_conectado?: boolean;
  ultima_revisao?: string;
  proxima_revisao?: string;
  ultimo_export?: string;
  backup_automatico?: boolean;
  ultimo_backup?: string;
  plano?: 'free' | 'premium';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  idToken: string | null;
  userConfig: PerfilConfig;
  entrar: () => Promise<void>;
  sair: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInAnonymouslyUser: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserConfig: (newConfig: Partial<PerfilConfig>) => Promise<void>;
  refreshIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [userConfig, setUserConfig] = useState<PerfilConfig>({
    plano: 'free',
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const token = await currentUser.getIdToken();
        setIdToken(token);

        // Carregar config do Firestore (apenas dados não-sensíveis)
        // Credenciais como chave de IA e refresh_token do Drive
        // ficam APENAS no server — nunca vêm para o client
        let configLoaded = false;
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            const configRef = doc(db, 'usuarios', currentUser.uid, 'perfil', 'config');
            const snap = await getDoc(configRef);
            if (snap.exists()) {
              const data = snap.data();
              // Extrair apenas campos que o client precisa
              // Chaves de IA e refresh_token do Drive NÃO são lidos aqui
              setUserConfig({
                onboarding_concluido: data.onboarding_concluido,
                consentimentos: data.consentimentos,
                drive_conectado: !!data.drive_refresh_token,
                ultima_revisao: data.ultima_revisao,
                proxima_revisao: data.proxima_revisao,
                ultimo_export: data.ultimo_export,
                backup_automatico: data.backup_automatico,
                ultimo_backup: data.ultimo_backup,
                plano: data.plano || 'free',
                // provedor_ia é lido SEM a chave — só tipo e modelo para UI
                provedor_ia: data.provedor_ia
                  ? {
                      tipo: data.provedor_ia.tipo,
                      modelo: data.provedor_ia.modelo,
                      url_base: data.provedor_ia.url_base,
                      chave: '••••••••', // Nunca expor chave real ao client
                      suporta_imagem: data.provedor_ia.suporta_imagem,
                      suporta_audio: data.provedor_ia.suporta_audio,
                      suporta_pdf: data.provedor_ia.suporta_pdf,
                    }
                  : undefined,
              });
            } else {
              const initialConfig: PerfilConfig = { plano: 'free' };
              await setDoc(configRef, initialConfig, { merge: true });
              setUserConfig(initialConfig);
            }
            configLoaded = true;
            break;
          } catch (err) {
            if (attempt === 0) {
              await new Promise((resolve) => setTimeout(resolve, 600));
            } else {
              console.warn('Aviso ao carregar configurações:', err);
            }
          }
        }
        if (!configLoaded) {
          setUserConfig({ plano: 'free' });
        }
      } else {
        setIdToken(null);
        setUserConfig({ plano: 'free' });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshIdToken = async () => {
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken(true);
      setIdToken(token);
      return token;
    }
    return null;
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      setIdToken(token);
    } catch (error) {
      console.error('Erro no login Google:', error);
      throw error;
    }
  };

  const signInAnonymouslyUser = async () => {
    try {
      const result = await signInAnonymously(auth);
      const token = await result.user.getIdToken();
      setIdToken(token);
    } catch (error) {
      console.error('Erro no login anônimo:', error);
      throw error;
    }
  };

  const logout = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setIdToken(null);
    setUserConfig({ plano: 'free' });
  };

  const updateUserConfig = async (newConfig: Partial<PerfilConfig>) => {
    if (!user) return;

    // Se o usuário passou um novo provedor_ia com chave real, salva em localStorage como fallback
    if (newConfig.provedor_ia && newConfig.provedor_ia.chave && newConfig.provedor_ia.chave !== '••••••••') {
      try {
        localStorage.setItem('salus_byok_config', JSON.stringify(newConfig.provedor_ia));
      } catch (e) {
        console.warn('Não foi possível salvar BYOK no localStorage:', e);
      }
    }

    const configParaSalvar = { ...newConfig };
    // Se a chave for a string mascarada, remove apenas a propriedade chave para não sobrescrever a chave real no Firestore
    if (configParaSalvar.provedor_ia) {
      if (configParaSalvar.provedor_ia.chave === '••••••••') {
        const { chave, ...restoProvedor } = configParaSalvar.provedor_ia;
        configParaSalvar.provedor_ia = restoProvedor as ProvedorIA;
      }
    }

    const merged = {
      ...userConfig,
      ...newConfig,
      provedor_ia: newConfig.provedor_ia
        ? { ...(userConfig.provedor_ia || {}), ...newConfig.provedor_ia }
        : userConfig.provedor_ia,
    };
    setUserConfig(merged);

    try {
      const configRef = doc(db, 'usuarios', user.uid, 'perfil', 'config');
      await setDoc(configRef, configParaSalvar, { merge: true });
    } catch (err) {
      console.error('Erro ao salvar configurações no Firestore:', err);
    }
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        idToken,
        userConfig,
        entrar: signInWithGoogle,
        sair: logout,
        signInWithGoogle,
        signInAnonymouslyUser,
        logout,
        updateUserConfig,
        refreshIdToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
