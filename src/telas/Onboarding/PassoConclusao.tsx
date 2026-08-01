import React from 'react';
import { Card } from '../../componentes/ui/Card';
import { Botao } from '../../componentes/ui/Botao';
import {
  Users,
  Dog,
  Cat,
  PawPrint,
  ArrowLeft,
  Key,
  CheckCircle2,
  Sparkles,
  FileCheck,
} from 'lucide-react';
import { TipoMembro } from '../../types/dominio';
import { MembroFormState } from './PassoFamilia';

interface PassoConclusaoProps {
  nomeFamilia: string;
  membros: MembroFormState[];
  salvando: boolean;
  onCriarFamilia: () => void;
  onSemearExemplo: () => void;
  onVoltar: () => void;
}

export const PassoConclusao: React.FC<PassoConclusaoProps> = ({
  nomeFamilia,
  membros,
  salvando,
  onCriarFamilia,
  onSemearExemplo,
  onVoltar,
}) => {
  const tipoIcones: Record<TipoMembro, React.ReactNode> = {
    pessoa: <Users className="w-5 h-5 text-teal-600" />,
    cao: <Dog className="w-5 h-5 text-amber-600" />,
    gato: <Cat className="w-5 h-5 text-purple-600" />,
    outro: <PawPrint className="w-5 h-5 text-blue-600" />,
  };

  return (
    <Card className="space-y-6">
      <div className="border-b border-slate-100 pb-4 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-teal-100 text-teal-800">
          <FileCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Resumo e Conclusão
          </h2>
          <p className="text-xs text-slate-500">
            Revise as informações antes de criar o espaço da sua família.
          </p>
        </div>
      </div>

      <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs text-slate-700">
        <div>
          <span className="font-bold text-slate-900 text-sm block">
            {nomeFamilia || 'Minha Família'}
          </span>
          <span className="text-slate-500">{membros.length} integrante(s) cadastrado(s)</span>
        </div>

        <div className="divide-y divide-slate-200/60 pt-2">
          {membros.map((m) => (
            <div key={m.id} className="py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {tipoIcones[m.tipo]}
                <div>
                  <span className="font-bold text-slate-800">{m.nome}</span>
                  {m.raca && (
                    <span className="text-slate-500 text-[11px] ml-1.5">
                      ({m.raca})
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right text-slate-500">
                <span className="capitalize">{m.tipo}</span>
                {m.vinculo !== 'biologico' && (
                  <span className="ml-1 text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-medium">
                    {m.vinculo}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-teal-50/80 border border-teal-200/80 space-y-2 text-xs text-teal-900">
        <div className="flex items-center gap-2 font-bold text-teal-900">
          <Key className="w-4 h-4 text-teal-700 shrink-0" />
          <span>Chave de API do Google Gemini (BYOK)</span>
        </div>
        <p className="leading-relaxed">
          Os recursos de Inteligência Artificial do SISAFAM (análise de exames, extração de receitas e chat assistente) utilizam a sua própria chave de API do Gemini. Você poderá cadastrá-la em <strong>Ajustes</strong> a qualquer momento de forma gratuita.
        </p>
      </div>

      <div className="pt-4 space-y-3">
        <Botao
          variante="primario"
          className="w-full"
          carregando={salvando}
          onClick={onCriarFamilia}
          icone={<CheckCircle2 className="w-5 h-5" />}
        >
          Criar minha família
        </Botao>

        <Botao
          variante="secundario"
          className="w-full"
          carregando={salvando}
          onClick={onSemearExemplo}
          icone={<Sparkles className="w-4 h-4 text-amber-600" />}
        >
          Quero ver com dados de exemplo primeiro
        </Botao>

        <div className="pt-2 flex justify-start">
          <button
            type="button"
            onClick={onVoltar}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao passo anterior</span>
          </button>
        </div>
      </div>
    </Card>
  );
};
