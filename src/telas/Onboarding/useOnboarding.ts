import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import { Membro, RelacaoMembro } from '../../types/dominio';
import { repositoriofamilia, repositoriomembros, repositorioperfilConfig } from '../../data/repositorios';
import { semearDadosDeExemplo } from '../../data/seed';
import { MembroFormState } from './PassoFamilia';

export function useOnboarding() {
  const { user, updateUserConfig } = useAuth();
  const navigate = useNavigate();

  // Wizard navigation
  const [passo, setPasso] = useState<number>(1);
  const [salvando, setSalvando] = useState<boolean>(false);
  const [erro, setErro] = useState<string | null>(null);

  // Passo 1 — Consentimento
  const [entendiDados, setEntendiDados] = useState<boolean>(false);
  const [tenhoConsentimento, setTenhoConsentimento] = useState<boolean>(false);

  // Passo 2 — Drive
  const [driveConectado, setDriveConectado] = useState<boolean>(false);
  const [carregandoDriveStatus, setCarregandoDriveStatus] = useState<boolean>(false);
  const [conectandoDrive, setConectandoDrive] = useState<boolean>(false);

  // Passo 3 — Membros
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

  // Passo 4 — Relações
  const [relacoesPairs, setRelacoesPairs] = useState<Record<string, string>>({});

  // --- Effects ---

  useEffect(() => {
    if (passo !== 2 || !user) return;
    setCarregandoDriveStatus(true);
    user.getIdToken().then((token) => {
      fetch('/api/drive/status', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.conectado) setDriveConectado(true);
        })
        .catch((err) => console.error('Erro ao verificar status do Drive:', err))
        .finally(() => setCarregandoDriveStatus(false));
    });
  }, [passo, user]);

  useEffect(() => {
    const handleMessage = async (e: MessageEvent) => {
      if (e.data?.type === 'DRIVE_CONNECTED') {
        setDriveConectado(true);
        setConectandoDrive(false);
      } else if (e.data?.type === 'SALUS_DRIVE_AUTH_SUCCESS') {
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
  }, [user, updateUserConfig]);

  // --- Handlers ---

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
            } catch (_) { /* popup cross-origin */ }
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
      { id: novoId, nome: '', tipo: 'pessoa', nascimento: '', raca: '', vinculo: 'biologico' },
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
    setRelacoesPairs((prev) => ({ ...prev, [key]: papel }));
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
            relacoesDoMembro.push({ membro_id: outro.id, papel });
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

  return {
    // Wizard
    passo,
    setPasso,
    salvando,
    erro,

    // Passo 1
    entendiDados,
    setEntendiDados,
    tenhoConsentimento,
    setTenhoConsentimento,

    // Passo 2
    driveConectado,
    carregandoDriveStatus,
    conectandoDrive,
    handleIniciarConexaoDrive,

    // Passo 3
    nomeFamilia,
    setNomeFamilia,
    membros,
    adicionarMembro,
    removerMembro,
    atualizarMembro,

    // Passo 4
    relacoesPairs,
    handleRelacaoChange,

    // Passo 5
    handleCriarFamilia,
    handleSemearExemplo,
  };
}
