import React from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import { useOnboarding } from './Onboarding/useOnboarding';
import { PassoBoasVindas } from './Onboarding/PassoBoasVindas';
import { PassoDrive } from './Onboarding/PassoDrive';
import { PassoFamilia } from './Onboarding/PassoFamilia';
import { PassoRelacoes } from './Onboarding/PassoRelacoes';
import { PassoConclusao } from './Onboarding/PassoConclusao';

const TITULO_PASSO: Record<number, string> = {
  1: 'Privacidade e Consentimento',
  2: 'Conectar Google Drive',
  3: 'Integrantes da Família',
  4: 'Relações e Vínculos',
  5: 'Conclusão',
};

export const OnboardingTela: React.FC = () => {
  const {
    passo, setPasso, salvando, erro,
    entendiDados, setEntendiDados, tenhoConsentimento, setTenhoConsentimento,
    driveConectado, carregandoDriveStatus, conectandoDrive, handleIniciarConexaoDrive,
    nomeFamilia, setNomeFamilia, membros, adicionarMembro, removerMembro, atualizarMembro,
    relacoesPairs, handleRelacaoChange,
    handleCriarFamilia, handleSemearExemplo,
  } = useOnboarding();

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-2 sm:py-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-800 rounded-full text-xs font-bold border border-teal-200/80">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Configuração Inicial da Família</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Bem-vindo ao SISAFAM 🩺
        </h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          Organize o histórico de saúde de toda a sua família (pessoas e pets) em poucas etapas.
        </p>
      </div>

      {/* Progress bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600">
          <span>Passo {passo} de 5: {TITULO_PASSO[passo]}</span>
          <span>{passo * 20}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-600 transition-all duration-300 rounded-full"
            style={{ width: `${passo * 20}%` }}
          />
        </div>
      </div>

      {erro && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>{erro}</div>
        </div>
      )}

      {passo === 1 && (
        <PassoBoasVindas
          entendiDados={entendiDados}
          setEntendiDados={setEntendiDados}
          tenhoConsentimento={tenhoConsentimento}
          setTenhoConsentimento={setTenhoConsentimento}
          onContinuar={() => setPasso(2)}
        />
      )}

      {passo === 2 && (
        <PassoDrive
          driveConectado={driveConectado}
          conectandoDrive={conectandoDrive}
          carregandoDriveStatus={carregandoDriveStatus}
          onIniciarConexao={handleIniciarConexaoDrive}
          onAvancar={() => setPasso(3)}
          onVoltar={() => setPasso(1)}
        />
      )}

      {passo === 3 && (
        <PassoFamilia
          nomeFamilia={nomeFamilia}
          setNomeFamilia={setNomeFamilia}
          membros={membros}
          adicionarMembro={adicionarMembro}
          removerMembro={removerMembro}
          atualizarMembro={atualizarMembro}
          onAvancar={() => setPasso(4)}
          onVoltar={() => setPasso(2)}
        />
      )}

      {passo === 4 && (
        <PassoRelacoes
          membros={membros}
          relacoesPairs={relacoesPairs}
          onRelacaoChange={handleRelacaoChange}
          atualizarMembro={atualizarMembro}
          onAvancar={() => setPasso(5)}
          onVoltar={() => setPasso(3)}
        />
      )}

      {passo === 5 && (
        <PassoConclusao
          nomeFamilia={nomeFamilia}
          membros={membros}
          salvando={salvando}
          onCriarFamilia={handleCriarFamilia}
          onSemearExemplo={handleSemearExemplo}
          onVoltar={() => setPasso(4)}
        />
      )}
    </div>
  );
};
