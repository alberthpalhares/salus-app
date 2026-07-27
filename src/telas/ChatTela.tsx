import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../componentes/ui/Card';
import { Badge } from '../componentes/ui/Badge';
import { Campo } from '../componentes/ui/Campo';
import { Botao } from '../componentes/ui/Botao';
import { useAuth } from '../auth/AuthProvider';
import { enviarMensagemChat, MensagemChat } from '../servicos/api';
import { obterConversa, salvarConversa, limparConversa } from '../data/repositorios/conversas';
import { carregarSnapshotDoIndice } from '../dominio/indice';
import { aplicarProposta } from '../dominio/proposta';
import { listar as listarMembros } from '../data/repositorios/membros';
import { listar as listarExames } from '../data/repositorios/exames';
import { listar as listarMedicamentos } from '../data/repositorios/medicamentos';
import { listar as listarVacinas } from '../data/repositorios/vacinas';
import { listar as listarEventos } from '../data/repositorios/eventos';
import { Membro, Exame, Medicamento, Vacina, Evento } from '../types/dominio';
import { SelecaoProposta } from '../types/propostas';
import { Sparkles, Send, AlertTriangle, Bot, RefreshCw, Trash2, HelpCircle } from 'lucide-react';
import { tratarErro, ErroTratado } from '../lib/erros';
import { SemChaveChatCard } from './Chat/SemChaveChatCard';
import { MensagemItemChat } from './Chat/MensagemItemChat';

export const ChatTela: React.FC = () => {
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

  return (
    <div className="space-y-4 flex flex-col h-[calc(100vh-140px)] max-w-4xl mx-auto">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Chat Assistente Salus
            </h1>
            <Badge variante="teal" icone={<Sparkles className="w-3.5 h-3.5" />}>
              Salus AI
            </Badge>
          </div>
          <p className="text-xs text-slate-600">
            Converse em linguagem natural, tire dúvidas e registre eventos com suporte de IA.
          </p>
        </div>

        {temChave && mensagens.length > 0 && (
          <Botao
            variante="secundario"
            tamanho="sm"
            onClick={handleLimparConversa}
            icone={<Trash2 className="w-3.5 h-3.5 text-slate-500" />}
          >
            Limpar Conversa
          </Botao>
        )}
      </div>

      {!temChave ? (
        <SemChaveChatCard />
      ) : (
        <>
          <Card className="flex-1 overflow-y-auto space-y-4 bg-slate-50/50 p-4 sm:p-6 flex flex-col">
            {carregandoHistorico ? (
              <div className="my-auto text-center py-8 space-y-2 text-slate-500">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-teal-600" />
                <p className="text-xs">Carregando conversa...</p>
              </div>
            ) : mensagens.length === 0 ? (
              <div className="my-auto text-center py-6 space-y-4 max-w-lg mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Como posso ajudar a sua família hoje?
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Pergunte sobre vacinas pendentes, dosagens ou peça para registrar eventos como vacinas tomadas ou remédios.
                  </p>
                </div>

                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                  {sugestoes.map((sug, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (sug.somenteCompletar) {
                          setNovaMensagem(sug.prompt);
                          campoInputRef.current?.focus();
                        } else {
                          enviarTexto(sug.prompt);
                        }
                      }}
                      className="p-3 bg-white hover:bg-teal-50/60 border border-slate-200/90 hover:border-teal-300 rounded-xl text-xs text-slate-700 hover:text-teal-900 transition-colors shadow-2xs flex items-center gap-2 group cursor-pointer"
                    >
                      <HelpCircle className="w-4 h-4 text-teal-600 shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">{sug.rotulo}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              mensagens.map((msg, index) => (
                <MensagemItemChat
                  key={index}
                  msg={msg}
                  index={index}
                  membros={membros}
                  exames={exames}
                  medicamentos={medicamentos}
                  vacinas={vacinas}
                  eventos={eventos}
                  submetendoProposta={submetendoProposta}
                  onConfirmarProposta={handleConfirmarPropostaInline}
                  onDescartarProposta={handleDescartarPropostaInline}
                />
              ))
            )}

            {carregando && (
              <div className="flex gap-3 max-w-[88%] mr-auto items-center">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-teal-300 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 animate-pulse" />
                </div>
                <div className="p-3.5 bg-white border border-slate-200/80 rounded-2xl rounded-tl-none text-xs text-slate-500 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
                  <span>Salus está consultando os dados e gerando a resposta...</span>
                </div>
              </div>
            )}

            {erroTratado && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs shadow-xs">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>{erroTratado.mensagem}</span>
                </div>
                {erroTratado.acao && (
                  <Link
                    to={erroTratado.acao.link || '/ajustes'}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs transition-colors shrink-0"
                  >
                    {erroTratado.acao.rotulo}
                  </Link>
                )}
              </div>
            )}

            <div ref={messagesEndRef} />
          </Card>

          <form
            onSubmit={handleEnviarForm}
            className="shrink-0 flex items-center gap-2 bg-white p-2 sm:p-3 rounded-2xl border border-slate-200 shadow-2xs"
          >
            <div className="flex-1">
              <Campo
                ref={campoInputRef}
                placeholder="Digite sua dúvida ou peça para registrar (ex: 'registra a vacina da Ana hoje')..."
                value={novaMensagem}
                onChange={(e) => setNovaMensagem(e.target.value)}
                disabled={carregando}
                className="border-none shadow-none focus:ring-0 text-sm"
              />
            </div>
            <Botao
              type="submit"
              variante="primario"
              disabled={carregando || !novaMensagem.trim()}
              icone={<Send className="w-4 h-4" />}
            >
              Enviar
            </Botao>
          </form>
        </>
      )}
    </div>
  );
};
