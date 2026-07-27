import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { Sparkles, AlertCircle } from 'lucide-react';
import { Membro, RelacaoMembro } from '../types/dominio';
import { repositoriofamilia, repositoriomembros, repositorioperfilConfig } from '../data/repositorios';
import { semearDadosDeExemplo } from '../data/seed';
import { PassoBoasVindas } from './Onboarding/PassoBoasVindas';
import { PassoDrive } from './Onboarding/PassoDrive';
import { PassoFamilia, MembroFormState } from './Onboarding/PassoFamilia';
import { PassoRelacoes } from './Onboarding/PassoRelacoes';
import { PassoConclusao } from './Onboarding/PassoConclusao';

export const OnboardingTela: React.FC = () => {
  const { user, updateUserConfig } = useAuth();
  const navigate = useNavigate();

  const [passo, setPasso] = useState<number>(1);
  const [salvando, setSalvando] = useState<boolean>(false);
  const [erro, setErro] = useState<string | null>(null);

  // Passo 1
  const [entendiDados, setEntendiDados] = useState<boolean>(false);
  const [tenhoConsentimento, setTenhoConsentimento] = useState<boolean>(false);

  // Passo 2
  const [driveConectado, setDriveConectado] = useState<boolean>(false);
  const [carregandoDriveStatus, setCarregandoDriveStatus] = useState<boolean>(false);
  const [conectandoDrive, setConectandoDrive] = useState<boolean>(false);

  // Passo 3
  const [nomeFamilia, setNomeFamilia] = useState<string>('Família Silva');
  const [membros, setMembros] = useState<MembroFormState[]>([
    {
      id: `membro_${Date.now()}_1`,
      nome: user?.displayName ? user.displayName.split(' ')[0] : 'Eu',
      tipo: 'pessoa',
      nascimento: '',
      raca: '',
      vinculo: 'biologico',
    },
  ]);

  // Passo 4
  const [relacoesPairs, setRelacoesPairs] = useState<Record<string, string>>({});

  useEffect(() => {
    if (passo === 2 && user) {
      setCarregandoDriveStatus(true);
      user.getIdToken().then((token) => {
        fetch('/api/drive/status', {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.conectado) {
              setDriveConectado(true);
            }
          })
          .catch((err) => console.error('Erro ao verificar status do Drive:', err))
          .finally(() => setCarregandoDriveStatus(false));
      });
    }
  }, [passo, user]);

  useEffect(() => {
    const handleMessage = async (e: MessageEvent) => {
      if (e.data?.type === 'DRIVE_CONNECTED') {
        setDriveConectado(true);
        setConectandoDrive(false);
      } else if (e.data?.type === 'SALUS_DRIVE_AUTH_SUCCESS') {
        // O callback do server já salvou o token via admin SDK
        await updateUserConfig({ drive_conectado: true });
        setDriveConectado(true);
        setConectandoDrive(false);
      } else if (e.data?.type === 'SALUS_DRIVE_AUTH_ERROR') {
        setErro(e.data.error || 'Erro ao conectar com Google Drive.');
        setConectandoDrive(false);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [user]);

  const handleIniciarConexaoDrive = async () => {
    if (!user) return;
    setConectandoDrive(true);
    setErro(null);
    try {
      const token = await user.getIdToken();
      const origin = window.location.origin;
      const res = await fetch(`/api/drive/iniciar-conexao?origin=${encodeURIComponent(origin)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.url) {
        const popup = window.open(data.url, 'salus_drive_oauth', 'width=600,height=700');
        if (popup) {
          const timer = setInterval(() => {
            try {
              const storedTokens = localStorage.getItem('salus_drive_tokens');
              if (storedTokens) {
                clearInterval(timer);
                localStorage.removeItem('salus_drive_tokens');
                const parsed = JSON.parse(storedTokens);
                window.postMessage({ type: 'SALUS_DRIVE_AUTH_SUCCESS', ...parsed }, '*');
              } else if (popup.closed) {
                clearInterval(timer);
                setTimeout(() => setConectandoDrive(false), 800);
              }
            } catch(e) {}
          }, 1000);
        } else {
          setErro('O bloqueador de pop-ups impediu a janela de abrir.');
          setConectandoDrive(false);
        }
      } else {
        setErro('Não foi possível obter a URL de autorização do Google Drive.');
        setConectandoDrive(false);
      }
    } catch (err: unknown) {
      console.error('Erro ao conectar Drive:', err);
      setErro('Erro ao iniciar conexão com o Google Drive.');
      setConectandoDrive(false);
    }
  };

  const adicionarMembro = () => {
    const novoId = `membro_${Date.now()}_${membros.length + 1}`;
    setMembros((prev) => [
      ...prev,
      {
        id: novoId,
        nome: '',
        tipo: 'pessoa',
        nascimento: '',
        raca: '',
        vinculo: 'biologico',
      },
    ]);
  };

  const removerMembro = (id: string) => {
    if (membros.length <= 1) return;
    setMembros((prev) => prev.filter((m) => m.id !== id));
  };

  const atualizarMembro = (id: string, campo: keyof MembroFormState, valor: unknown) => {
    setMembros((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [campo]: valor } : m))
    );
  };

  const handleRelacaoChange = (membroAId: string, membroBId: string, papel: string) => {
    const key = `${membroAId}_${membroBId}`;
    setRelacoesPairs((prev) => ({
      ...prev,
      [key]: papel,
    }));
  };

  const handleCriarFamilia = async () => {
    if (!user) return;
    setSalvando(true);
    setErro(null);

    try {
      await repositoriofamilia.salvar(user.uid, {
        nome: nomeFamilia.trim() || 'Minha Família',
        atualizado_em: new Date().toISOString().split('T')[0],
      });

      for (const m of membros) {
        if (!m.nome.trim()) continue;

        const relacoesDoMembro: RelacaoMembro[] = [];
        membros.forEach((outro) => {
          if (outro.id === m.id) return;
          const key = `${m.id}_${outro.id}`;
          const papel = relacoesPairs[key];
          if (papel && papel !== 'none') {
            relacoesDoMembro.push({
              membro_id: outro.id,
              papel: papel,
            });
          }
        });

        const novoMembro: Membro = {
          id: m.id,
          nome: m.nome.trim(),
          tipo: m.tipo,
          nascimento: m.nascimento || undefined,
          vinculo: m.vinculo || 'biologico',
          raca: m.tipo !== 'pessoa' && m.raca.trim() ? m.raca.trim() : undefined,
          relacoes: relacoesDoMembro.length > 0 ? relacoesDoMembro : undefined,
        };

        await repositoriomembros.salvar(user.uid, novoMembro);
      }

      await repositorioperfilConfig.salvar(user.uid, {
        onboarding_concluido: true,
        consentimentos: {
          dados_privacidade: entendiDados,
          consentimento_terceiros: tenhoConsentimento,
        },
        ultima_revisao: new Date().toISOString().split('T')[0],
      });

      await updateUserConfig({ onboarding_concluido: true });
      navigate('/', { replace: true });
    } catch (err: unknown) {
      console.error('Erro ao salvar onboarding:', err);
      setErro('Ocorreu um erro ao salvar os dados da família. Por favor, tente novamente.');
      setSalvando(false);
    }
  };

  const handleSemearExemplo = async () => {
    if (!user) return;
    setSalvando(true);
    setErro(null);

    try {
      await semearDadosDeExemplo(user.uid);
      await updateUserConfig({ onboarding_concluido: true });
      navigate('/', { replace: true });
    } catch (err: unknown) {
      console.error('Erro ao semear dados de exemplo:', err);
      setErro('Erro ao carregar dados de exemplo. Tente novamente.');
      setSalvando(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-2 sm:py-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-800 rounded-full text-xs font-bold border border-teal-200/80">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Configuração Inicial da Família</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Bem-vindo ao Salus 🩺
        </h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          Organize o histórico de saúde de toda a sua família (pessoas e pets) em poucas etapas.
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600">
          <span>
            Passo {passo} de 5:{' '}
            {passo === 1 && 'Privacidade e Consentimento'}
            {passo === 2 && 'Conectar Google Drive'}
            {passo === 3 && 'Integrantes da Família'}
            {passo === 4 && 'Relações e Vínculos'}
            {passo === 5 && 'Conclusão'}
          </span>
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
