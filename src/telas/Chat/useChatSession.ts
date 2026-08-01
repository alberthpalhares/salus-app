import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import { enviarMensagemChat, MensagemChat } from '../../servicos/api';
import { obterConversa, salvarConversa, limparConversa } from '../../data/repositorios/conversas';
import { carregarSnapshotDoIndice } from '../../dominio/indice';
import { aplicarProposta } from '../../dominio/proposta';
import { listar as listarMembros } from '../../data/repositorios/membros';
import { listar as listarExames } from '../../data/repositorios/exames';
import { listar as listarMedicamentos } from '../../data/repositorios/medicamentos';
import { listar as listarVacinas } from '../../data/repositorios/vacinas';
import { listar as listarEventos } from '../../data/repositorios/eventos';
import { Membro, Exame, Medicamento, Vacina, Evento } from '../../types/dominio';
import { SelecaoProposta } from '../../types/propostas';
import { tratarErro, ErroTratado } from '../../lib/erros';

export function useChatSession() {
  const { user, userConfig } = useAuth();
  const [mensagens, setMensagens] = useState<MensagemChat[]>([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [carregandoHistorico, setCarregandoHistorico] = useState(true);
  const [submetendoProposta, setSubmetendoProposta] = useState(false);
  const [erroTratado, setErroTratado] = useState<ErroTratado | null>(null);

  const [membros, setMembros] = useState<Membro[]>([]);
  const [exames, setExames] = useState<Exame[]>([]);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [vacinas, setVacinas] = useState<Vacina[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);

  const temChave = Boolean(userConfig?.provedor_ia?.chave && userConfig.provedor_ia.chave !== '••••••••');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const campoInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!user?.uid) return;

    async function carregarTudo() {
      setCarregandoHistorico(true);
      try {
        const [
          historicoSalvo,
          membrosLista,
          examesLista,
          medsLista,
          vacinasLista,
          eventosLista,
        ] = await Promise.all([
          obterConversa(user!.uid),
          listarMembros(user!.uid).catch(() => []),
          listarExames(user!.uid).catch(() => []),
          listarMedicamentos(user!.uid).catch(() => []),
          listarVacinas(user!.uid).catch(() => []),
          listarEventos(user!.uid).catch(() => []),
        ]);

        setMensagens(historicoSalvo);
        setMembros(membrosLista);
        setExames(examesLista);
        setMedicamentos(medsLista);
        setVacinas(vacinasLista);
        setEventos(eventosLista);
      } catch (err) {
        console.warn('[ChatTela] Erro ao carregar dados:', err);
      } finally {
        setCarregandoHistorico(false);
      }
    }

    carregarTudo();
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [mensagens, carregando]);

  const recarregarDadosClinicos = async () => {
    if (!user?.uid) return;
    try {
      const [membrosLista, examesLista, medsLista, vacinasLista, eventosLista] = await Promise.all([
        listarMembros(user.uid).catch(() => []),
        listarExames(user.uid).catch(() => []),
        listarMedicamentos(user.uid).catch(() => []),
        listarVacinas(user.uid).catch(() => []),
        listarEventos(user.uid).catch(() => []),
      ]);
      setMembros(membrosLista);
      setExames(examesLista);
      setMedicamentos(medsLista);
      setVacinas(vacinasLista);
      setEventos(eventosLista);
    } catch (err) {
      console.warn('[ChatTela] Erro ao recarregar dados clínicos:', err);
    }
  };

  const enviarTexto = async (texto: string) => {
    if (!user?.uid || !texto.trim() || carregando) return;

    const textoUsuario = texto.trim();
    setNovaMensagem('');
    setErroTratado(null);

    const mensagemUsuarioObj: MensagemChat = {
      role: 'user',
      text: textoUsuario,
      timestamp: new Date().toISOString(),
    };

    const historicoComNovaMsg = [...mensagens, mensagemUsuarioObj];
    setMensagens(historicoComNovaMsg);
    setCarregando(true);

    try {
      const snapshotIndice = await carregarSnapshotDoIndice(user.uid);
      const resApi = await enviarMensagemChat(textoUsuario, mensagens, snapshotIndice);

      const mensagemAssistenteObj: MensagemChat = {
        role: 'assistant',
        text: resApi.resposta,
        proposta: resApi.proposta || undefined,
        propostaStatus: resApi.proposta ? 'pendente' : undefined,
        dadosConsultados: resApi.dadosConsultados || undefined,
        timestamp: new Date().toISOString(),
      };

      const historicoAtualizado = [...historicoComNovaMsg, mensagemAssistenteObj];
      setMensagens(historicoAtualizado);
      await salvarConversa(user.uid, historicoAtualizado);
    } catch (err: unknown) {
      setErroTratado(tratarErro(err));
    } finally {
      setCarregando(false);
    }
  };

  const handleEnviarForm = (e: React.FormEvent) => {
    e.preventDefault();
    enviarTexto(novaMensagem);
  };

  const handleLimparConversa = async () => {
    if (!user?.uid) return;
    if (window.confirm('Tem certeza que deseja apagar o histórico de conversa?')) {
      setMensagens([]);
      await limparConversa(user.uid);
    }
  };

  const handleConfirmarPropostaInline = async (index: number, selecao: SelecaoProposta) => {
    if (!user?.uid || submetendoProposta) return;
    setSubmetendoProposta(true);
    setErroTratado(null);

    try {
      const msgObj = mensagens[index];
      if (!msgObj || !msgObj.proposta) return;

      const resultado = await aplicarProposta(user.uid, msgObj.proposta, selecao);

      if (resultado.success) {
        const mensagensAtualizadas = [...mensagens];
        mensagensAtualizadas[index] = {
          ...mensagensAtualizadas[index],
          propostaStatus: 'aprovada',
        };

        const confirmacaoMsg: MensagemChat = {
          role: 'assistant',
          text: `✅ Dados salvos com sucesso no perfil de ${resultado.membroNome}!`,
          timestamp: new Date().toISOString(),
        };

        mensagensAtualizadas.push(confirmacaoMsg);
        setMensagens(mensagensAtualizadas);

        await salvarConversa(user.uid, mensagensAtualizadas);
        await recarregarDadosClinicos();
      } else {
        setErroTratado(tratarErro(resultado.erroDrive || 'Não foi possível confirmar a proposta.'));
      }
    } catch (err: unknown) {
      setErroTratado(tratarErro(err));
    } finally {
      setSubmetendoProposta(false);
    }
  };

  const handleDescartarPropostaInline = async (index: number) => {
    if (!user?.uid) return;
    const mensagensAtualizadas = [...mensagens];
    mensagensAtualizadas[index] = {
      ...mensagensAtualizadas[index],
      propostaStatus: 'descartada',
    };
    setMensagens(mensagensAtualizadas);
    await salvarConversa(user.uid, mensagensAtualizadas);
  };

  const sugestoes = [
    { rotulo: 'Como estamos?', prompt: 'Como estamos de saúde na família hoje?' },
    { rotulo: 'O que está vencendo?', prompt: 'O que está vencendo ou pendente na família?' },
    { rotulo: 'Registra que...', prompt: 'Registra que ', somenteCompletar: true },
    {
      rotulo: membros.length > 0 ? `Como está a saúde da ${membros[0].nome}?` : 'Como está a saúde da família?',
      prompt: membros.length > 0 ? `Como está a saúde da ${membros[0].nome}?` : 'Como está a saúde da família?',
    },
  ];

  return {
    mensagens,
    novaMensagem,
    setNovaMensagem,
    carregando,
    carregandoHistorico,
    submetendoProposta,
    erroTratado,
    membros,
    exames,
    medicamentos,
    vacinas,
    eventos,
    temChave,
    messagesEndRef,
    campoInputRef,
    sugestoes,
    enviarTexto,
    handleEnviarForm,
    handleLimparConversa,
    handleConfirmarPropostaInline,
    handleDescartarPropostaInline,
  };
}
