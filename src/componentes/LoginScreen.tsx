import React, { useState } from 'react';
import { ShieldCheck, Key, Lock, Cloud, Sparkles } from 'lucide-react';
import { useAuth } from '../auth/useAuth';
import { SisafamLogo } from '../components/ui/logo';
import { AnimacaoEntrada, AnimacaoLista, AnimacaoItemLista } from './ui/AnimacaoEntrada';

export const LoginScreen: React.FC = () => {
  const { signInWithGoogle, signInAnonymouslyUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingAnonimo, setLoadingAnonimo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch {
      setError('Erro ao autenticar com o Google. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginAnonimo = async () => {
    setLoadingAnonimo(true);
    setError(null);
    try {
      await signInAnonymouslyUser();
    } catch (err: unknown) {
      console.error('Erro no login anônimo:', err);
      setError('Erro ao iniciar modo experimental. Verifique a conexão e tente novamente.');
    } finally {
      setLoadingAnonimo(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-4">
      <AnimacaoEntrada duracao={0.4} className="max-w-xl w-full">
        <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl border border-slate-700/80 shadow-2xl p-8 space-y-8">
          
          {/* Header com Logo Oficial SISAFAM */}
          <div className="text-center space-y-4 flex flex-col items-center">
            <SisafamLogo variant="full" size="xl" />
            <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed pt-2">
              Organize exames, laudos e histórico clínico de toda a família — pessoas e animais de estimação — com inteligência artificial, privacidade individual e chaves próprias.
            </p>
          </div>

          {/* Highlight Badges Animados */}
          <AnimacaoLista className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
            <AnimacaoItemLista>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-700/50 hover:border-teal-500/40 transition-colors">
                <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200 block">Isolamento Multi-Tenant</span>
                  Seus dados médicos ficam no seu Firestore exclusivo.
                </div>
              </div>
            </AnimacaoItemLista>

            <AnimacaoItemLista>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-700/50 hover:border-teal-500/40 transition-colors">
                <Key className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200 block">Sua Própria Chave (BYOK)</span>
                  Cadastre sua chave Gemini ou DeepSeek em Ajustes.
                </div>
              </div>
            </AnimacaoItemLista>

            <AnimacaoItemLista>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-700/50 hover:border-teal-500/40 transition-colors">
                <Cloud className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200 block">Google Drive & Agenda</span>
                  Sincronize backups e lembretes de vacinas/consultas.
                </div>
              </div>
            </AnimacaoItemLista>

            <AnimacaoItemLista>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-700/50 hover:border-teal-500/40 transition-colors">
                <Lock className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200 block">Núcleo Clínico Seguro</span>
                  Sem diagnósticos automáticos, sem alarde e com propostas.
                </div>
              </div>
            </AnimacaoItemLista>
          </AnimacaoLista>

          {/* Action button */}
          <div className="space-y-4 pt-2">
            {error && (
              <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-center">
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading || loadingAnonimo}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl active:scale-[0.98] disabled:opacity-50 text-sm cursor-pointer"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              {loading ? 'Entrando com o Google...' : 'Entrar com o Google'}
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-700/80"></div>
              <span className="shrink mx-3 text-[11px] font-semibold text-slate-400">ou</span>
              <div className="flex-grow border-t border-slate-700/80"></div>
            </div>

            <button
              onClick={handleLoginAnonimo}
              disabled={loading || loadingAnonimo}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700/80 text-teal-300 font-semibold py-3 px-4 rounded-xl border border-teal-500/30 transition-all duration-200 text-sm cursor-pointer active:scale-[0.98] disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-teal-400" />
              {loadingAnonimo ? 'Iniciando modo experimental...' : 'Experimentar sem criar conta'}
            </button>

            <p className="text-[11px] text-center text-slate-400">
              Ao entrar, você concorda com o armazenamento isolado dos dados de saúde da sua família no seu próprio ambiente Firebase.{' '}
              <a href="/privacidade" className="text-teal-400 hover:underline">
                Política de Privacidade & Termos
              </a>
            </p>
          </div>

        </div>
      </AnimacaoEntrada>
    </div>
  );
};
