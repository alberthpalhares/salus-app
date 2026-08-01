import React from 'react';
import { Card } from '../../componentes/ui/Card';
import { Campo } from '../../componentes/ui/Campo';
import { Botao } from '../../componentes/ui/Botao';
import { useSecaoBYOK, PROVEDORES, ProvedorInfo } from './useSecaoBYOK';
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

function renderIcone(nome: ProvedorInfo['iconeName']) {
  switch (nome) {
    case 'sparkles':
      return <Sparkles className="w-4 h-4" />;
    case 'zap':
      return <Zap className="w-4 h-4" />;
    case 'globe':
      return <Globe className="w-4 h-4" />;
    case 'shield':
      return <Shield className="w-4 h-4" />;
    default:
      return <Key className="w-4 h-4" />;
  }
}

export const SecaoBYOK: React.FC = () => {
  const {
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
  } = useSecaoBYOK();

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Key className="w-5 h-5 text-teal-600" />
            Inteligência Artificial (BYOK — Sua Própria Chave)
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-2xl">
            Escolha o provedor de IA e cole sua chave de API pessoal. Suas credenciais são salvas apenas na sua conta Firestore e usadas para extração de documentos e no chat. O Salus funciona 100% sem IA caso você prefira cadastrar tudo à mão.
          </p>
        </div>
      </div>

      {mensagemSucesso && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{mensagemSucesso}</span>
        </div>
      )}

      {/* Grid de Seleção de Provedor */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700">Selecione o Provedor de IA:</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PROVEDORES.map((p) => {
            const isSelected = provedorSelecionado === p.id;
            const isConfigured = provedorAtual?.tipo === p.id && provedorAtual?.chave;

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setProvedorSelecionado(p.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 relative ${
                  isSelected
                    ? `${p.corBg} ring-2 ring-teal-500/20 font-semibold shadow-xs`
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-1.5 rounded-lg ${p.corBg} ${p.cor}`}>
                    {renderIcone(p.iconeName)}
                  </div>
                  {isConfigured && (
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" /> Ativo
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">{p.nome}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                    {p.descricao}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form de Configuração do Provedor Selecionado */}
      <form onSubmit={handleSalvar} className="space-y-4 pt-2">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span>Configurar {info.nome}</span>
              {info.gratuito && (
                <span className="text-[10px] font-extrabold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
                  Tier Gratuito Disponível
                </span>
              )}
            </h3>
            <a
              href={info.urlObterChave}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 underline"
            >
              Obter chave no {info.labelUrlChave} <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="space-y-3">
            <Campo
              rotulo="Chave de API (API Key)"
              type="password"
              value={chave}
              onChange={(e) => setChave(e.target.value)}
              placeholder={provedorAtual?.tipo === info.id && provedorAtual?.chave ? '••••••••••••••••' : info.placeholderChave}
              dica="Sua chave fica gravada apenas na sua conta Firestore."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Modelo de IA</label>
                <select
                  value={modelo}
                  onChange={(e) => setModelo(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 font-medium text-slate-800"
                >
                  {info.modelos.map((m) => (
                    <option key={m} value={m}>
                      {m} {m === info.modeloPadrao ? '(Padrão Recomendado)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {info.id === 'openrouter' && (
                <Campo
                  rotulo="URL Base da API (Opcional)"
                  value={urlBase}
                  onChange={(e) => setUrlBase(e.target.value)}
                  placeholder="https://openrouter.ai/api/v1"
                />
              )}
            </div>
          </div>

          {/* Guia Passo a Passo Expansível */}
          <div className="border-t border-slate-200/80 pt-3">
            <button
              type="button"
              onClick={() => setGuiaAberto(!guiaAberto)}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              {guiaAberto ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              <span>Como obter uma chave gratuita do {info.nome}?</span>
            </button>

            {guiaAberto && (
              <ol className="mt-2 text-xs text-slate-600 space-y-1 pl-5 list-decimal font-medium leading-relaxed">
                {info.guia.map((passo, idx) => (
                  <li key={idx}>{passo}</li>
                ))}
              </ol>
            )}
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center gap-3 pt-2">
            <Botao
              variante="primario"
              type="submit"
              disabled={salvando || !chave.trim()}
              icone={salvando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            >
              {salvando ? 'Salvando...' : 'Salvar Chave'}
            </Botao>

            <Botao
              variante="outline"
              type="button"
              onClick={handleTestarChave}
              disabled={testando || !chave.trim()}
              icone={testando ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
            >
              {testando ? 'Testando...' : 'Testar Chave'}
            </Botao>

            {resultadoTeste === 'ok' && (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <Check className="w-4 h-4 text-emerald-600" /> Chave Válida!
              </span>
            )}
            {resultadoTeste === 'erro' && (
              <span className="text-xs font-bold text-rose-700 flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-rose-600" /> Chave Inválida
              </span>
            )}
          </div>
        </div>
      </form>
    </Card>
  );
};
