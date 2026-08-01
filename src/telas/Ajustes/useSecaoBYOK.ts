import { useState, useEffect } from 'react';
import { useAuth, ProvedorIA } from '../../auth/AuthProvider';
import { auth } from '../../data/firebase';

export interface ProvedorInfo {
  id: ProvedorIA['tipo'];
  nome: string;
  iconeName: 'sparkles' | 'zap' | 'globe' | 'shield';
  cor: string;
  corBg: string;
  descricao: string;
  modeloPadrao: string;
  modelos: string[];
  urlBase?: string;
  placeholderChave: string;
  urlObterChave: string;
  labelUrlChave: string;
  guia: string[];
  gratuito: boolean;
  suportaImagem: boolean;
  suportaAudio: boolean;
  suportaPdf: boolean;
}

export const PROVEDORES: ProvedorInfo[] = [
  {
    id: 'gemini',
    nome: 'Google Gemini',
    iconeName: 'sparkles',
    cor: 'text-blue-700',
    corBg: 'bg-blue-50 border-blue-200',
    descricao: 'Recomendado — gratuito, multimodal (texto + imagem + áudio + PDF).',
    modeloPadrao: 'gemini-2.5-flash',
    modelos: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash'],
    placeholderChave: 'AIzaSy...',
    urlObterChave: 'https://aistudio.google.com/apikey',
    labelUrlChave: 'Google AI Studio',
    guia: [
      'Acesse aistudio.google.com/apikey',
      'Clique em "Create API Key"',
      'Escolha um projeto ou crie um novo',
      'Copie a chave gerada e cole aqui',
    ],
    gratuito: true,
    suportaImagem: true,
    suportaAudio: true,
    suportaPdf: true,
  },
  {
    id: 'groq',
    nome: 'Groq',
    iconeName: 'zap',
    cor: 'text-orange-700',
    corBg: 'bg-orange-50 border-orange-200',
    descricao: 'Ultra rápido — tier gratuito generoso. Só texto (sem imagem/áudio).',
    modeloPadrao: 'llama-3.3-70b-versatile',
    modelos: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'gemma2-9b-it', 'mixtral-8x7b-32768'],
    placeholderChave: 'gsk_...',
    urlObterChave: 'https://console.groq.com/keys',
    labelUrlChave: 'Groq Console',
    guia: [
      'Acesse console.groq.com e crie uma conta (é gratuito)',
      'Vá em "API Keys" no menu lateral',
      'Clique em "Create API Key"',
      'Copie a chave e cole aqui',
    ],
    gratuito: true,
    suportaImagem: false,
    suportaAudio: false,
    suportaPdf: false,
  },
  {
    id: 'openrouter',
    nome: 'OpenRouter',
    iconeName: 'globe',
    cor: 'text-purple-700',
    corBg: 'bg-purple-50 border-purple-200',
    descricao: 'Hub de modelos — acesso a dezenas de provedores com uma única chave.',
    modeloPadrao: 'google/gemini-2.5-flash',
    modelos: ['google/gemini-2.5-flash', 'anthropic/claude-sonnet-4', 'meta-llama/llama-3.3-70b-instruct', 'mistralai/mistral-large-latest'],
    placeholderChave: 'sk-or-...',
    urlObterChave: 'https://openrouter.ai/keys',
    labelUrlChave: 'OpenRouter',
    guia: [
      'Acesse openrouter.ai e crie uma conta',
      'Vá em "Keys" e crie uma nova API Key',
      'Alguns modelos são gratuitos (como Gemini via OpenRouter)',
      'Copie a chave e cole aqui',
    ],
    gratuito: false,
    suportaImagem: true,
    suportaAudio: false,
    suportaPdf: false,
  },
  {
    id: 'mistral',
    nome: 'Mistral AI',
    iconeName: 'shield',
    cor: 'text-indigo-700',
    corBg: 'bg-indigo-50 border-indigo-200',
    descricao: 'Modelos europeus de alta qualidade. Tier gratuito disponível.',
    modeloPadrao: 'mistral-small-latest',
    modelos: ['mistral-small-latest', 'mistral-medium-latest', 'mistral-large-latest', 'open-mistral-nemo'],
    placeholderChave: 'sk-...',
    urlObterChave: 'https://console.mistral.ai/api-keys',
    labelUrlChave: 'Mistral Console',
    guia: [
      'Acesse console.mistral.ai e crie uma conta',
      'Vá em "API Keys" no painel',
      'Crie uma nova chave',
      'Copie e cole aqui',
    ],
    gratuito: true,
    suportaImagem: false,
    suportaAudio: false,
    suportaPdf: false,
  },
];

export function useSecaoBYOK() {
  const { userConfig, updateUserConfig } = useAuth();
  const provedorAtual = userConfig.provedor_ia;
  const tipoAtual = provedorAtual?.tipo || 'gemini';

  const [provedorSelecionado, setProvedorSelecionado] = useState<string>(tipoAtual);
  const [chave, setChave] = useState('');
  const [modelo, setModelo] = useState('');
  const [urlBase, setUrlBase] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [testando, setTestando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [guiaAberto, setGuiaAberto] = useState(false);
  const [resultadoTeste, setResultadoTeste] = useState<'ok' | 'erro' | null>(null);

  const info = PROVEDORES.find((p) => p.id === provedorSelecionado) || PROVEDORES[0];

  useEffect(() => {
    if (provedorAtual) {
      setProvedorSelecionado(provedorAtual.tipo);
      setModelo(provedorAtual.modelo || '');
      setUrlBase(provedorAtual.url_base || '');
    }
  }, [provedorAtual]);

  useEffect(() => {
    try {
      const cachedRaw = localStorage.getItem('salus_byok_config');
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw);
        if (cached.tipo === provedorSelecionado && cached.chave) {
          setChave(cached.chave);
        } else {
          setChave('');
        }
      } else {
        setChave('');
      }
    } catch {
      setChave('');
    }
    setModelo(info.modeloPadrao);
    setUrlBase(info.urlBase || '');
    setResultadoTeste(null);
    setGuiaAberto(false);
  }, [provedorSelecionado]);


  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chave.trim()) return;

    setSalvando(true);
    setMensagemSucesso('');
    try {
      await updateUserConfig({
        provedor_ia: {
          tipo: info.id,
          modelo: modelo || info.modeloPadrao,
          chave: chave.trim(),
          url_base: urlBase || undefined,
          suporta_imagem: info.suportaImagem,
          suporta_audio: info.suportaAudio,
          suporta_pdf: info.suportaPdf,
        },
      });
      setMensagemSucesso(`${info.nome} configurado com sucesso!`);
      setChave('');
      setTimeout(() => setMensagemSucesso(''), 4000);
    } catch (err: unknown) {
      console.error('Erro ao salvar provedor:', err);
    } finally {
      setSalvando(false);
    }
  };

  const handleTestarChave = async () => {
    if (!chave.trim()) return;
    setTestando(true);
    setResultadoTeste(null);

    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error('Não autenticado');

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mensagem: 'Ping de teste',
          historico: [],
        }),
      });

      if (res.ok) {
        setResultadoTeste('ok');
      } else {
        setResultadoTeste('erro');
      }
    } catch {
      setResultadoTeste('erro');
    } finally {
      setTestando(false);
    }
  };

  return {
    provedorAtual,
    provedorSelecionado,
    setProvedorSelecionado,
    chave,
    setChave,
    modelo,
    setModelo,
    urlBase,
    setUrlBase,
    salvando,
    testando,
    mensagemSucesso,
    guiaAberto,
    setGuiaAberto,
    resultadoTeste,
    info,
    handleSalvar,
    handleTestarChave,
  };
}
