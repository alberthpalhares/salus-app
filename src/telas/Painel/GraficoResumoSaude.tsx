import React from 'react';
import { Card } from '../../componentes/ui/Card';
import { HeartPulse, CheckCircle2, AlertCircle } from 'lucide-react';
import { Membro, Medicamento } from '../../types/dominio';

interface GraficoResumoSaudeProps {
  membros: Membro[];
  medicamentosEmUso: Medicamento[];
  alertasCount: number;
}

export const GraficoResumoSaude: React.FC<GraficoResumoSaudeProps> = ({
  membros,
  medicamentosEmUso,
  alertasCount,
}) => {
  const totalMembros = membros.length || 1;
  const membrosPessoas = membros.filter((m) => m.tipo === 'pessoa' || m.especie === 'Humano' || (!m.tipo && !m.especie));
  const membrosPets = membros.filter((m) => m.tipo === 'cao' || m.tipo === 'gato' || m.tipo === 'outro' || m.especie === 'Cão' || m.especie === 'Gato');

  const pctPessoas = Math.round((membrosPessoas.length / totalMembros) * 100);
  const pctPets = 100 - pctPessoas;

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
            <HeartPulse className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Panorama Visual de Saúde</h3>
            <p className="text-[11px] text-slate-500">Composição da casa e indicadores de prevenção</p>
          </div>
        </div>

        {alertasCount === 0 ? (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Em Dia
          </span>
        ) : (
          <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 inline-flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> Ação Necessária
          </span>
        )}
      </div>

      {/* Barra Multissegmento de Membros */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-bold text-slate-700">
          <span>Distribuição dos Integrantes ({totalMembros})</span>
          <span>{membrosPessoas.length} Pessoas • {membrosPets.length} Pets</span>
        </div>
        <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner p-0.5">
          <div
            style={{ width: `${pctPessoas}%` }}
            className="h-full bg-teal-500 rounded-full transition-all duration-500"
            title={`Pessoas: ${pctPessoas}%`}
          />
          <div
            style={{ width: `${pctPets}%` }}
            className="h-full bg-amber-400 rounded-full transition-all duration-500"
            title={`Pets: ${pctPets}%`}
          />
        </div>
      </div>

      {/* Mini Estatísticas Rápidas */}
      <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100 text-xs">
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between">
          <span className="text-slate-600 font-medium">Medicamentos Ativos</span>
          <span className="font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200">
            {medicamentosEmUso.length}
          </span>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between">
          <span className="text-slate-600 font-medium">Alertas 30d</span>
          <span className={`font-extrabold px-2 py-0.5 rounded-md border ${
            alertasCount > 0 ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-emerald-100 text-emerald-900 border-emerald-300'
          }`}>
            {alertasCount}
          </span>
        </div>
      </div>
    </Card>
  );
};
