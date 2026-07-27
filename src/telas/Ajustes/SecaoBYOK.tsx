import React, { useState, useEffect } from 'react';
import { Card } from '../../componentes/ui/Card';
import { Campo } from '../../componentes/ui/Campo';
import { Botao } from '../../componentes/ui/Botao';
import { useAuth, ProvedorIA } from '../../auth/AuthProvider';
import { auth } from '../../data/firebase';
import {
  Key,
  ExternalLink,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  Globe,
  Shield,
  AlertCircle,
  Loader2,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Definição de provedores suportados
// ─────────────────────────────────────────────────────────────

interface ProvedorInfo {
  id: ProvedorIA['tipo'];
  nome: string;
  icone: React.ReactNode;
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

const PROVEDORES: ProvedorInfo[] = [
  {
    id: 'gemini',
    nome: 'Google Gemini',
    icone: <Sparkles className="w-4 h-4" />,
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
    icone: <Zap className="w-4 h-4" />,
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
    icone: <Globe className="w-4 h-4" />,
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
    icone: <Shield className="w-4 h-4" />,
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

// ─────────────────────────────────────────────────────────────
// Componente
// ─────────────────────────────────────────────────────────────

export const SecaoBYOK: React.FC = () => {
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
    setChave('');
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
          mensagem: 'Diga apenas: "Conexão OK. Seu assistente de saúde está funcionando!"',
          historico: [],
          // Enviar config temporária para teste
          _teste_provedor: {
            tipo: info.id,
            modelo: modelo || info.modeloPadrao,
            chave: chave.trim(),
            url_base: urlBase || undefined,
          },
        }),
      });

      setResultadoTeste(res.ok ? 'ok' : 'erro');
    } catch {
      setResultadoTeste('erro');
    } finally {
      setTestando(false);
    }
  };

  const handleRemover = async () => {
    setSalvando(true);
    try {
      await updateUserConfig({ provedor_ia: undefined });
      setChave('');
      setMensagemSucesso('Provedor removido.');
      setTimeout(() => setMensagemSucesso(''), 3000);
    } catch (err: unknown) {
      console.error('Erro ao remover provedor:', err);
    } finally {
      setSalvando(false);
    }
  };

  const temChaveAtiva = provedorAtual?.chave && provedorAtual.chave !== '••••••••';

  return (
    <Card>
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
          <Key className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800">Provedor de IA (BYOK)</h3>
          <p className="text-xs text-slate-500">
            Traga sua própria chave — seus dados nunca saem do seu controle.
          </p>
        </div>
      </div>

      {/* Seletor de provedor — cards horizontais */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
        {PROVEDORES.map((p) => {
          const ativo = p.id === provedorSelecionado;
          const configurado = provedorAtual?.tipo === p.id && temChaveAtiva;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setProvedorSelecionado(p.id)}
              className={`
                relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-150 cursor-pointer text-center
                ${ativo
                  ? `${p.corBg} border-current ${p.cor} shadow-sm scale-[1.02]`
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }
              `}
            >
              {configurado && (
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                  <Check className="w-3 h-3" />
                </div>
              )}
              <span className="text-lg">{p.icone}</span>
              <span className="text-[11px] font-bold leading-tight">{p.nome}</span>
              {p.gratuito && (
                <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  Gratuito
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Descrição do provedor selecionado */}
      <div className={`p-3 rounded-xl border text-xs mb-4 ${info.corBg} ${info.cor}`}>
        <div className="flex items-start gap-2">
          <span className="shrink-0 mt-0.5">{info.icone}</span>
          <div>
            <p className="font-medium">{info.descricao}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {info.suportaImagem && (
                <span className="px-2 py-0.5 rounded-full bg-white/60 text-[10px] font-medium">📷 Imagem</span>
              )}
              {info.suportaAudio && (
                <span className="px-2 py-0.5 rounded-full bg-white/60 text-[10px] font-medium">🎤 Áudio</span>
              )}
              {info.suportaPdf && (
                <span className="px-2 py-0.5 rounded-full bg-white/60 text-[10px] font-medium">📄 PDF</span>
              )}
              {!info.suportaImagem && !info.suportaAudio && !info.suportaPdf && (
                <span className="px-2 py-0.5 rounded-full bg-white/60 text-[10px] font-medium">💬 Só texto</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Guia passo a passo */}
      <button
        type="button"
        onClick={() => setGuiaAberto(!guiaAberto)}
        className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 hover:bg-slate-100 transition-colors mb-4 cursor-pointer"
      >
        <span className="font-medium">📖 Como obter minha chave?</span>
        {guiaAberto ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {guiaAberto && (
        <div className="mb-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <ol className="space-y-2 text-xs text-slate-700">
            {info.guia.map((passo, i) => (
              <li key={i} className="flex gap-2">
                <span className="shrink-0 w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px] font-bold mt-0.5">
                  {i + 1}
                </span>
                <span>{passo}</span>
              </li>
            ))}
          </ol>
          <a
            href={info.urlObterChave}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center gap-1.5 text-xs font-bold underline mt-2 ${info.cor} hover:opacity-80`}
          >
            Ir para {info.labelUrlChave} <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* Formulário */}
      <form onSubmit={handleSalvar} className="space-y-3">
        <Campo
          type="password"
          rotulo="Chave de API"
          placeholder={info.placeholderChave}
          value={chave}
          onChange={(e) => { setChave(e.target.value); setResultadoTeste(null); }}
          dica="Sua chave é armazenada de forma segura no servidor e nunca é exposta no navegador."
        />

        {/* Seletor de modelo */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Modelo</label>
          <select
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
          >
            {info.modelos.map((m) => (
              <option key={m} value={m}>{m}{m === info.modeloPadrao ? ' (recomendado)' : ''}</option>
            ))}
          </select>
        </div>

        {/* Resultado do teste */}
        {resultadoTeste === 'ok' && (
          <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Chave válida! Conexão com {info.nome} funcionando.</span>
          </div>
        )}
        {resultadoTeste === 'erro' && (
          <div className="flex items-center gap-2 text-xs text-rose-800 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Chave inválida ou erro de conexão. Verifique e tente novamente.</span>
          </div>
        )}

        {/* Sucesso */}
        {mensagemSucesso && (
          <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{mensagemSucesso}</span>
          </div>
        )}

        {/* Status ativo */}
        {temChaveAtiva && provedorAtual && (
          <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <Check className="w-4 h-4 text-emerald-500" />
            <span>
              Provedor ativo: <strong>{PROVEDORES.find(p => p.id === provedorAtual.tipo)?.nome || provedorAtual.tipo}</strong>
              {' · '}Modelo: <strong>{provedorAtual.modelo}</strong>
            </span>
          </div>
        )}

        {/* Ações */}
        <div className="flex items-center justify-end gap-2 pt-1">
          {temChaveAtiva && (
            <Botao
              type="button"
              variante="outline"
              tamanho="sm"
              onClick={handleRemover}
              disabled={salvando}
            >
              Remover Provedor
            </Botao>
          )}
          {chave.trim() && (
            <Botao
              type="button"
              variante="ghost"
              tamanho="sm"
              onClick={handleTestarChave}
              disabled={testando || salvando}
              icone={testando ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : undefined}
            >
              {testando ? 'Testando...' : 'Testar Chave'}
            </Botao>
          )}
          <Botao
            type="submit"
            variante="primario"
            tamanho="sm"
            disabled={salvando || !chave.trim()}
          >
            {salvando ? 'Salvando...' : 'Salvar'}
          </Botao>
        </div>
      </form>
    </Card>
  );
};
