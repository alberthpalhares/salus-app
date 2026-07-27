import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import { LoginScreen } from './componentes/LoginScreen';
import { AppShell } from './componentes/AppShell';
import { PainelTela } from './telas/PainelTela';
import { CaixaDeEntradaTela } from './telas/CaixaDeEntradaTela';
import { PerfilMembroTela } from './telas/PerfilMembroTela';
import { ChatTela } from './telas/ChatTela';
import { AjustesTela } from './telas/AjustesTela';
import { OnboardingTela } from './telas/OnboardingTela';
import { PrivacidadeTela } from './telas/PrivacidadeTela';
import { SobreTela } from './telas/SobreTela';
import { Carregando } from './componentes/ui/Carregando';

function GuardaOnboarding({ children }: { children: React.ReactNode }) {
  const { userConfig } = useAuth();
  const location = useLocation();

  const onboardingConcluido = Boolean(userConfig?.onboarding_concluido);

  if (
    !onboardingConcluido &&
    location.pathname !== '/onboarding' &&
    location.pathname !== '/privacidade' &&
    location.pathname !== '/sobre'
  ) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}

function RoteamentoAutenticado() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Carregando mensagem="Carregando Salus..." fullScreen />;
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <GuardaOnboarding>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<PainelTela />} />
          <Route path="/caixa-de-entrada" element={<CaixaDeEntradaTela />} />
          <Route path="/membro/:id" element={<PerfilMembroTela />} />
          <Route path="/chat" element={<ChatTela />} />
          <Route path="/ajustes" element={<AjustesTela />} />
          <Route path="/onboarding" element={<OnboardingTela />} />
          <Route path="/privacidade" element={<PrivacidadeTela />} />
          <Route path="/sobre" element={<SobreTela />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </GuardaOnboarding>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <RoteamentoAutenticado />
      </BrowserRouter>
    </AuthProvider>
  );
}
