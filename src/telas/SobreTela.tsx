import React from 'react';
import { Card } from '../componentes/ui/Card';
import { Badge } from '../componentes/ui/Badge';
import { SisafamLogo } from '../components/ui/logo';
import {
  ShieldCheck,
  Key,
  HardDrive,
  Code,
  ExternalLink,
  Zap,
} from 'lucide-react';

export const SobreTela: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3.5">
          <SisafamLogo variant="full" size="lg" />
          <Badge variante="teal">v0.4.3 Pilot App</Badge>
        </div>

        <a
          href="https://github.com/alberthpalhares/salus-app"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl text-xs transition-colors shadow-xs w-fit"
        >
          <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span>Repositório no GitHub</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: O que é o SISAFAM */}
        <Card className="space-y-3">
          <div className="flex items-center gap-2.5 text-teal-700">
            <SisafamLogo variant="icon" size="sm" />
            <h2 className="text-base font-bold text-slate-800">O que é o SISAFAM?</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            O **SISAFAM** (Sistema de Saúde da Família) é um gerenciador completo do histórico de saúde familiar. Ele permite cadastrar pessoas e animais de estimação (cães e gatos), organizar exames de laboratório, controlar receitas e medicamentos em uso, rastrear vacinas e manter uma linha do tempo clínica unificada.
          </p>
          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5 text-[11px] text-slate-600 font-medium">
            <span className="px-2 py-0.5 bg-slate-100 rounded-md">Pessoas & Pets</span>
            <span className="px-2 py-0.5 bg-slate-100 rounded-md">Histórico Clínico</span>
            <span className="px-2 py-0.5 bg-slate-100 rounded-md">Controle de Vacinas</span>
            <span className="px-2 py-0.5 bg-slate-100 rounded-md">Propostas Clínicas</span>
          </div>
        </Card>

        {/* Card 2: Funciona 100% Sem IA */}
        <Card className="space-y-3 bg-emerald-50/40 border-emerald-200/80">
          <div className="flex items-center gap-2.5 text-emerald-800">
            <Zap className="w-5 h-5 shrink-0 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-800">Funciona 100% Sem IA</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Nenhuma funcionalidade essencial depende de IA. Você pode usar o app do início ao fim totalmente de forma manual: cadastrar e editar membros, gerenciar fichas, exames, vacinas e remédios, consultar o painel e a agenda, anexar documentos e exportar/importar dados em formato ZIP.
          </p>
          <div className="text-[11px] text-emerald-800 font-semibold bg-emerald-100/60 p-2 rounded-lg border border-emerald-200">
            💡 A IA é opcional e serve exclusivamente para acelerar a leitura de documentos e responder no chat.
          </div>
        </Card>

        {/* Card 3: BYOK e Isenção de Custos */}
        <Card className="space-y-3">
          <div className="flex items-center gap-2.5 text-teal-700">
            <Key className="w-5 h-5 shrink-0 text-teal-600" />
            <h2 className="text-base font-bold text-slate-800">Sua Própria Chave (BYOK) & Drive</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Quando você opta por ativar os recursos de IA, utiliza a sua própria chave de API (Google Gemini, Groq, OpenRouter, Mistral ou OpenAI) — todas com **opções de cota gratuita**.
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            Os arquivos originais (PDFs e fotos) vivem no **seu próprio Google Drive** na pasta <code className="bg-slate-100 px-1 py-0.5 rounded text-teal-800 font-mono">SISAFAM App</code>. O mantenedor do SISAFAM **não vê, não armazena, não acessa e não paga** pelo seu uso ou pelos seus arquivos.
          </p>
        </Card>

        {/* Card 4: Projeto Piloto & Backup Recomendado */}
        <Card className="space-y-3 bg-amber-50/40 border-amber-200/80">
          <div className="flex items-center gap-2.5 text-amber-900">
            <HardDrive className="w-5 h-5 shrink-0 text-amber-600" />
            <h2 className="text-base font-bold text-slate-800">Piloto Gratuito & Backup Recomendado</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Este aplicativo é um <strong>projeto piloto de portfólio</strong> mantido 100% gratuito utilizando infraestrutura serverless sem custos fixos.
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            Por ser uma solução gratuita, <strong>recomendamos fortemente a realização periódica de backups</strong> (via Google Drive ou exportação dos seus dados em formato ZIP/JSON nas configurações) para garantir a custódia perpétua do seu histórico familiar.
          </p>
        </Card>
      </div>

      {/* Card Núcleo Clínico Inviolável */}
      <Card className="p-5 space-y-3 bg-slate-900 text-slate-100 border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-teal-400 shrink-0" />
          <div>
            <h2 className="text-sm font-bold text-slate-100">Núcleo Clínico Inviolável</h2>
            <p className="text-xs text-slate-400">Requisitos éticos e de segurança integrados ao sistema</p>
          </div>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-2">
          <li className="flex items-start gap-2 bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60">
            <span className="text-teal-400 font-bold">•</span>
            <span><strong>Sem diagnósticos ou prescrições:</strong> O SISAFAM organiza e cruza dados; a decisão médica é do profissional.</span>
          </li>
          <li className="flex items-start gap-2 bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60">
            <span className="text-teal-400 font-bold">•</span>
            <span><strong>Sem faixas calculadas:</strong> Respeita estritamente a faixa de referência impressa no próprio laudo.</span>
          </li>
          <li className="flex items-start gap-2 bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60">
            <span className="text-teal-400 font-bold">•</span>
            <span><strong>Propostas com aprovação:</strong> Nenhuma informação de IA altera dados sem confirmação explícita do usuário.</span>
          </li>
          <li className="flex items-start gap-2 bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60">
            <span className="text-teal-400 font-bold">•</span>
            <span><strong>Privacidade individual:</strong> Isolamento estrito por usuário no Firestore (<code className="text-teal-300">/usuarios/&#123;uid&#125;/...</code>).</span>
          </li>
        </ul>
      </Card>

      {/* Footer Info: Autor e Licença */}
      <div className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-teal-600 shrink-0" />
          <span>
            Desenvolvido por <strong>Alberth Palhares</strong> e Comunidade SISAFAM.
          </span>
        </div>

        <div className="flex items-center gap-3 font-medium">
          <span className="px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300/80 rounded-lg text-[11px]">
            Licença MIT (Código Aberto)
          </span>
          <a
            href="https://github.com/alberthpalhares/salus-app"
            target="_blank"
            rel="noreferrer"
            className="text-teal-700 hover:underline flex items-center gap-1 font-bold"
          >
            GitHub <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
