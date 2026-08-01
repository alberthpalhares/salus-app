import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/componentes/ui/Card';
import { Badge } from '@/componentes/ui/Badge';
import { Membro, Medicamento, CondicaoSaudeEstruturada, Exame } from '@/types/dominio';
import { formatarDataExtenso } from '@/lib/datas';
import { ShieldCheck, Stethoscope, AlertTriangle, Pill, Activity, HelpCircle } from 'lucide-react';

interface PreviewResumoConsultaProps {
  membro: Membro;
  especialidade: string;
  motivoConsulta: string;
  duvidas: string[];
  condicoes: CondicaoSaudeEstruturada[];
  medicamentos: Medicamento[];
  examesAlterados: Exame[];
  dataHojeISO: string;
}

export const PreviewResumoConsulta: React.FC<PreviewResumoConsultaProps> = ({
  membro,
  especialidade,
  motivoConsulta,
  duvidas,
  condicoes,
  medicamentos,
  examesAlterados,
  dataHojeISO,
}) => {
  return (
    <Card className="p-6 space-y-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md print:shadow-none print:border-none print:p-0">
      {/* Cabeçalho do Resumo */}
      <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Resumo para Consulta — {membro?.nome}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Especialidade: <strong>{especialidade}</strong> • Compilado em {formatarDataExtenso(dataHojeISO)}
          </p>
        </div>

        <Badge variante="sucesso">1 Página Sintética</Badge>
      </div>

      {/* Dados do Integrante */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <span className="text-slate-400 block font-semibold">Integrante</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">{membro?.nome}</span>
        </div>
        <div>
          <span className="text-slate-400 block font-semibold">Nascimento</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">{membro?.nascimento || 'Não informado'}</span>
        </div>
        <div>
          <span className="text-slate-400 block font-semibold">Tipo Sanguíneo</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">{membro?.tipo_sanguineo || 'Não informado'}</span>
        </div>
        <div>
          <span className="text-slate-400 block font-semibold">Plano de Saúde</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">{membro?.plano_saude || 'Particular'}</span>
        </div>
      </div>

      {/* Motivo & Queixa */}
      {motivoConsulta && (
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
            <Stethoscope className="w-4 h-4" /> 1. Motivo / Queixa Principal
          </h4>
          <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 leading-relaxed">
            {motivoConsulta}
          </p>
        </div>
      )}

      {/* Dúvidas */}
      {duvidas.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4" /> 2. Perguntas para o Médico ({duvidas.length})
          </h4>
          <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
            {duvidas.map((d, i) => (
              <li key={i} className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-200/50 dark:border-slate-800">
                <span className="font-bold text-teal-600 shrink-0">{i + 1}.</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Condições & Alergias */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4" /> 3. Condições Ativas & Alergias
        </h4>
        {membro?.alergias && membro.alergias.length > 0 && (
          <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-900 dark:text-rose-300 font-bold">
            ALERGIAS: {membro.alergias.join(', ')}
          </div>
        )}
        {condicoes.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
            {condicoes.map((c) => (
              <li key={c.id} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 font-semibold">
                • {c.nome} ({c.categoria || 'crônica'})
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-slate-400 italic">Nenhuma condição ativa registrada.</p>
        )}
      </div>

      {/* Medicamentos */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
          <Pill className="w-4 h-4" /> 4. Medicamentos em Uso Contínuo ({medicamentos.length})
        </h4>
        {medicamentos.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
            {medicamentos.map((m) => (
              <li key={m.id} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                <strong className="text-slate-900 dark:text-slate-100">{m.nome}</strong>
                {m.dose && <span className="text-slate-500 dark:text-slate-400 block text-[11px]">{m.dose} • {m.frequencia}</span>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-slate-400 italic">Nenhum medicamento ativo em uso.</p>
        )}
      </div>

      {/* Exames Alterados */}
      {examesAlterados.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-4 h-4" /> 5. Exames com Alteração Recente ({examesAlterados.length})
          </h4>
          <div className="space-y-1 text-xs">
            {examesAlterados.slice(0, 5).map((e) => (
              <div key={e.id} className="p-2 rounded-lg bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{e.marcador}</span>
                  <span className="text-slate-500 text-[11px] block">{e.data}</span>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-rose-700 dark:text-rose-400">{e.valor} {e.unidade}</span>
                  <span className="text-[10px] text-slate-400 block italic">{e.faixa_referencia_laudo}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Disclaimer */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-[10px] text-slate-400 italic">
        ISENÇÃO CLÍNICA: O SISAFAM organiza informações de saúde. Ele não diagnostica, não prescreve e não substitui avaliação médica ou veterinária.
      </div>
    </Card>
  );
};
