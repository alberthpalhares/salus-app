import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { semearDadosDeExemplo } from '../data/seed';
import { SisafamLogo } from '../components/ui/logo';
import { AnimacaoPagina } from './ui/AnimacaoPagina';
import { Switch } from './ui/Switch';
import {
  LayoutDashboard,
  Inbox,
  MessageSquare,
  Stethoscope,
  Settings,
  Sparkles,
  LogOut,
  User as UserIcon,
  Info,
  AlertTriangle,
  UserCheck,
  Moon,
  Sun,
  Dna,
  ClipboardPlus,
} from 'lucide-react';

export const AppShell: React.FC = () => {
  const { user, sair, signInWithGoogle } = useAuth();
  const [semeando, setSemeando] = useState(false);

  // Dark mode state with localStorage persistence
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('salus_dark_mode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('salus_dark_mode', 'true');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('salus_dark_mode', 'false');
    }
  }, [darkMode]);

  const linksNavegacao = [
    { to: '/', rotulo: 'Painel', rotuloCurto: 'Painel', icone: LayoutDashboard },
    { to: '/caixa-de-entrada', rotulo: 'Caixa de Entrada', rotuloCurto: 'Entrada', icone: Inbox },
    { to: '/evolucao', rotulo: 'Cruzamento Genético', rotuloCurto: 'Genética', icone: Dna },
    { to: '/preparar-consulta', rotulo: 'Preparar Consulta', rotuloCurto: 'Consulta', icone: ClipboardPlus },
    { to: '/profissionais', rotulo: 'Médicos & Clínicas', rotuloCurto: 'Médicos', icone: Stethoscope },
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
    <div className="min-h-screen min-h-[100dvh] bg-background text-foreground flex flex-col md:flex-row font-sans transition-colors duration-200">
      {/* Sidebar Desktop (fixa à esquerda em telas md+) */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-sidebar border-r border-sidebar-border z-30 text-sidebar-foreground" role="navigation" aria-label="Menu principal">
        {/* Cabeçalho da Sidebar - Logo Oficial SISAFAM */}
        <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
          <SisafamLogo variant="full" size="md" />
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
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-2xs font-bold'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`
                }
              >
                <Icone className="w-5 h-5 shrink-0" />
                <span>{item.rotulo}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Toggle Dark Mode na Sidebar */}
        <div className="px-4 py-3 border-t border-sidebar-border flex items-center justify-between text-xs font-semibold text-sidebar-foreground/80">
          <span className="flex items-center gap-2">
            {darkMode ? <Moon className="w-4 h-4 text-teal-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span>Tema Escuro</span>
          </span>
          <Switch checked={darkMode} onCheckedChange={setDarkMode} />
        </div>

        {/* Rodapé da Sidebar Desktop - Usuário & Sair */}
        <div className="p-4 border-t border-sidebar-border bg-sidebar-accent/30">
          <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-sidebar-accent border border-sidebar-border shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Usuário'}
                  className="w-9 h-9 rounded-full object-cover shrink-0 border border-sidebar-border"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-sidebar-accent text-sidebar-foreground flex items-center justify-center font-bold text-sm shrink-0">
                  <UserIcon className="w-5 h-5" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-sidebar-foreground truncate">
                  {user?.displayName || 'Usuário SISAFAM'}
                </p>
                <p className="text-[11px] text-sidebar-foreground/60 truncate">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={() => sair()}
              title="Sair da conta"
              className="p-2 text-sidebar-foreground/50 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer shrink-0"
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
          <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2.5 text-xs text-amber-900 dark:text-amber-200 font-medium flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20 backdrop-blur-md">
            <div className="flex items-center gap-2 max-w-2xl">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>
                Você está em modo experimental, sem conta. Se limpar os dados do navegador ou trocar de aparelho, isso pode ser perdido — crie uma conta Google para manter tudo em segurança.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleSemearExemplo}
                disabled={semeando}
                className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
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

        {/* Header Mobile com Logo SISAFAM e Dark Mode Toggle */}
        <header className="md:hidden bg-card border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-20" style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}>
          <SisafamLogo variant="full" size="sm" />

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-muted-foreground hover:text-foreground rounded-lg bg-muted text-xs font-medium"
              title="Alternar Tema"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
            <button
              onClick={() => sair()}
              className="p-2 text-muted-foreground hover:text-destructive rounded-lg text-xs font-medium flex items-center gap-1 bg-muted"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </header>

        {/* Área da Rota Atual com Animação de Transição de Página */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-8" role="main">
          <AnimacaoPagina>
            <Outlet />
          </AnimacaoPagina>
        </main>

        {/* Rodapé Permanente com Isenção Clínica Obrigatória e Link de Privacidade */}
        <footer className="mt-auto bg-card border-t border-border py-3 px-4 text-center">
          <p className="text-xs text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            O SISAFAM organiza informações de saúde. Ele não diagnostica, não prescreve e não substitui médico ou veterinário.{' '}
            <NavLink to="/privacidade" className="text-primary font-semibold underline hover:text-teal-700 ml-1">
              Privacidade & Termos
            </NavLink>
          </p>
        </footer>
      </div>

      {/* Bottom Navigation Bar para Mobile (somente md:hidden) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-30 px-2 flex items-center justify-around shadow-lg" style={{ paddingBottom: 'max(0.375rem, env(safe-area-inset-bottom))' }} role="navigation" aria-label="Navegação rápida">
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
                    ? 'text-primary font-bold'
                    : 'text-muted-foreground hover:text-foreground font-medium'
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
