import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { semearDadosDeExemplo } from '../data/seed';
import {
  LayoutDashboard,
  Inbox,
  MessageSquare,
  Settings,
  Sparkles,
  LogOut,
  User as UserIcon,
  HeartPulse,
  Info,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';

export const AppShell: React.FC = () => {
  const { user, sair, signInWithGoogle } = useAuth();
  const [semeando, setSemeando] = useState(false);

  const linksNavegacao = [
    { to: '/', rotulo: 'Painel', rotuloCurto: 'Painel', icone: LayoutDashboard },
    { to: '/caixa-de-entrada', rotulo: 'Caixa de Entrada', rotuloCurto: 'Entrada', icone: Inbox },
    { to: '/chat', rotulo: 'Chat Assistente', rotuloCurto: 'Chat', icone: MessageSquare },
    { to: '/ajustes', rotulo: 'Ajustes', rotuloCurto: 'Ajustes', icone: Settings },
    { to: '/sobre', rotulo: 'Sobre', rotuloCurto: 'Sobre', icone: Info },
  ];

  const handleSemearExemplo = async () => {
    if (!user?.uid || semeando) return;
    setSemeando(true);
    try {
      await semearDadosDeExemplo(user.uid);
      window.location.href = '/';
    } catch (err) {
      console.error('Erro ao semear dados de exemplo:', err);
    } finally {
      setSemeando(false);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-slate-50 flex flex-col md:flex-row text-slate-800 font-sans">
      {/* Sidebar Desktop (fixa à esquerda em telas md+) */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r border-slate-200 z-30" role="navigation" aria-label="Menu principal">
        {/* Cabeçalho da Sidebar - Logo */}
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
              Salus <span className="text-base">🩺</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">Saúde da Família</p>
          </div>
        </div>

        {/* Links de Navegação Desktop */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {linksNavegacao.map((item) => {
            const Icone = item.icone;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-teal-50 text-teal-800 border border-teal-200/60 shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Icone className="w-5 h-5 shrink-0" />
                <span>{item.rotulo}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Rodapé da Sidebar Desktop - Usuário & Sair */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50">
          <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Usuário'}
                  className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm shrink-0">
                  <UserIcon className="w-5 h-5" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800 truncate">
                  {user?.displayName || 'Usuário Salus'}
                </p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={() => sair()}
              title="Sair da conta"
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Conteúdo Principal (offset na desktop por causa da sidebar) */}
      <div className="flex-1 flex flex-col md:pl-64 min-h-screen">
        {/* Banner para Sessão Experimental Anônima */}
        {user?.isAnonymous && (
          <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2.5 text-xs text-amber-900 font-medium flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20 backdrop-blur-md">
            <div className="flex items-center gap-2 max-w-2xl">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Você está em modo experimental, sem conta. Se limpar os dados do navegador ou trocar de aparelho, isso pode ser perdido — crie uma conta Google para manter tudo em segurança.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleSemearExemplo}
                disabled={semeando}
                className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                {semeando ? 'Gerando dados...' : 'Ver com dados de exemplo'}
              </button>
              <button
                onClick={() => signInWithGoogle()}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                <UserCheck className="w-3.5 h-3.5" />
                Entrar com Google
              </button>
            </div>
          </div>
        )}

        {/* Header Mobile com Logo e Sair */}
        <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20" style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
              <HeartPulse className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-900 text-lg flex items-center gap-1">
              Salus 🩺
            </span>
          </div>

          <button
            onClick={() => sair()}
            className="p-2 text-slate-500 hover:text-rose-600 rounded-lg text-xs font-medium flex items-center gap-1 bg-slate-100"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </header>

        {/* Área da Rota Atual */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-8" role="main">
          <Outlet />
        </main>

        {/* Rodapé Permanente com Isenção Clínica Obrigatória e Link de Privacidade */}
        <footer className="mt-auto bg-white border-t border-slate-200 py-3 px-4 text-center">
          <p className="text-xs text-slate-500 max-w-4xl mx-auto leading-relaxed">
            O Salus organiza informações de saúde. Ele não diagnostica, não prescreve e não substitui médico ou veterinário.{' '}
            <NavLink to="/privacidade" className="text-teal-700 font-semibold underline hover:text-teal-900 ml-1">
              Privacidade & Termos
            </NavLink>
          </p>
        </footer>
      </div>

      {/* Bottom Navigation Bar para Mobile (somente md:hidden) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-30 px-2 flex items-center justify-around shadow-lg" style={{ paddingBottom: 'max(0.375rem, env(safe-area-inset-bottom))' }} role="navigation" aria-label="Navegação rápida">
        {linksNavegacao.map((item) => {
          const Icone = item.icone;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-center transition-colors min-w-[56px] ${
                  isActive
                    ? 'text-teal-700 font-bold'
                    : 'text-slate-500 hover:text-slate-800 font-medium'
                }`
              }
            >
              <Icone className="w-5 h-5 shrink-0" />
              <span className="text-[10px] leading-tight">{item.rotuloCurto}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
