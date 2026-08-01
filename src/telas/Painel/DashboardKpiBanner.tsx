import React from 'react';
import { Users, Activity, AlertTriangle, Pill } from 'lucide-react';
import { Membro, Medicamento } from '../../types/dominio';

interface DashboardKpiBannerProps {
  membros: Membro[];
  medicamentosEmUso: Medicamento[];
  alertasCount: number;
  condicoesCount: number;
  onNavigateTab?: (tab: string) => void;
}

export const DashboardKpiBanner: React.FC<DashboardKpiBannerProps> = ({
  membros,
  medicamentosEmUso,
  alertasCount,
  condicoesCount,
}) => {
  const pessoasCount = membros.filter((m) => m.tipo === 'pessoa' || m.especie === 'Humano' || (!m.tipo && !m.especie)).length;
  const petsCount = membros.length - pessoasCount;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Card 1: Membros */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-600 to-teal-800 text-white shadow-sm flex flex-col justify-between relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-teal-100 uppercase tracking-wider">Família</span>
          <div className="p-2 rounded-xl bg-white/10 text-teal-100 backdrop-blur-xs group-hover:scale-110 transition-transform">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">{membros.length}</div>
          <p className="text-xs text-teal-100/90 font-medium mt-0.5">
            {pessoasCount} {pessoasCount === 1 ? 'pessoa' : 'pessoas'} • {petsCount} {petsCount === 1 ? 'pet' : 'pets'}
          </p>
        </div>
      </div>

      {/* Card 2: Condições */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 text-white shadow-sm flex flex-col justify-between relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-rose-100 uppercase tracking-wider">Acompanhamento</span>
          <div className="p-2 rounded-xl bg-white/10 text-rose-100 backdrop-blur-xs group-hover:scale-110 transition-transform">
            <Activity className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">{condicoesCount}</div>
          <p className="text-xs text-rose-100/90 font-medium mt-0.5">
            {condicoesCount === 1 ? 'Condição ativa' : 'Condições registradas'}
          </p>
        </div>
      </div>

      {/* Card 3: Alertas */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-sm flex flex-col justify-between relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-100 uppercase tracking-wider">Alertas &amp; Vacinas</span>
          <div className="p-2 rounded-xl bg-white/10 text-amber-100 backdrop-blur-xs group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">{alertasCount}</div>
          <p className="text-xs text-amber-100/90 font-medium mt-0.5">
            {alertasCount === 0 ? 'Tudo em dia!' : `${alertasCount} pendentes em 30d`}
          </p>
        </div>
      </div>

      {/* Card 4: Medicamentos */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-800 text-white shadow-sm flex flex-col justify-between relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-indigo-100 uppercase tracking-wider">Medicamentos</span>
          <div className="p-2 rounded-xl bg-white/10 text-indigo-100 backdrop-blur-xs group-hover:scale-110 transition-transform">
            <Pill className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">{medicamentosEmUso.length}</div>
          <p className="text-xs text-indigo-100/90 font-medium mt-0.5">Em uso contínuo</p>
        </div>
      </div>
    </div>
  );
};
