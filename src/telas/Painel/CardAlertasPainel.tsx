import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../componentes/ui/Card';
import { Badge } from '../../componentes/ui/Badge';
import {
  Users,
  Dog,
  Cat,
  PawPrint,
  CheckCircle2,
  AlertTriangle,
  Pill,
  Syringe,
  Stethoscope,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { TipoMembro } from '../../types/dominio';
import { AlertaItem } from '../../dominio/alertas';
import { formatarDataExtenso } from '../../lib/datas';

interface CardAlertasPainelProps {
  gruposAlertas: {
    VENCIDO: AlertaItem[];
    VENCE_EM_30_DIAS: AlertaItem[];
    VENCE_EM_31_A_90_DIAS: AlertaItem[];
  };
  temAlerta30Dias: boolean;
}

export const CardAlertasPainel: React.FC<CardAlertasPainelProps> = ({
  gruposAlertas,
  temAlerta30Dias,
}) => {
  const navigate = useNavigate();

  const renderIconeMembro = (tipo?: TipoMembro) => {
    switch (tipo) {
      case 'cao':
        return <Dog className="w-4 h-4 text-amber-700 shrink-0" />;
      case 'gato':
        return <Cat className="w-4 h-4 text-purple-700 shrink-0" />;
      case 'outro':
        return <PawPrint className="w-4 h-4 text-blue-700 shrink-0" />;
      case 'pessoa':
      default:
        return <Users className="w-4 h-4 text-teal-700 shrink-0" />;
    }
  };

  const renderIconeAlerta = (tipo: 'vacina' | 'medicamento' | 'checkup') => {
    switch (tipo) {
      case 'vacina':
        return <Syringe className="w-4 h-4 shrink-0 text-emerald-700" />;
      case 'medicamento':
        return <Pill className="w-4 h-4 shrink-0 text-blue-700" />;
      case 'checkup':
        return <Stethoscope className="w-4 h-4 shrink-0 text-purple-700" />;
      default:
        return <Calendar className="w-4 h-4 shrink-0 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Alertas e Vencimentos</span>
        </h2>
      </div>

      {!temAlerta30Dias ? (
        <div className="p-4 rounded-xl bg-emerald-50/90 border border-emerald-200 text-emerald-900 text-sm font-semibold flex items-center gap-2.5 shadow-2xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Nada vencendo nos próximos 30 dias ✅</span>
        </div>
      ) : (
        <div className="space-y-4">
          {/* GRUPO: VENCIDO */}
          {gruposAlertas.VENCIDO.length > 0 && (
            <Card className="bg-rose-50/70 border-rose-200/90 text-rose-950 p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-rose-200/70 pb-2.5">
                <div className="flex items-center gap-2">
                  <Badge variante="vencido">Vencido</Badge>
                  <span className="text-xs font-bold text-rose-900 uppercase tracking-wider">
                    Demandam Atenção ({gruposAlertas.VENCIDO.length})
                  </span>
                </div>
              </div>

              <div className="divide-y divide-rose-200/60">
                {gruposAlertas.VENCIDO.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/membro/${item.membro_id}`)}
                    className="py-2.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-rose-100/50 p-2 rounded-lg transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-white/80 border border-rose-200 shrink-0">
                        {renderIconeAlerta(item.tipo)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                            {renderIconeMembro(item.membro_tipo)}
                            {item.membro_nome}
                          </span>
                          <span className="text-[10px] font-semibold text-rose-800 bg-rose-100 px-1.5 py-0.2 rounded border border-rose-200/80">
                            {item.tipo_label}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-slate-900 mt-0.5">
                          {item.descricao}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 text-xs font-semibold text-rose-900">
                      <div className="text-right">
                        <span>{item.data ? formatarDataExtenso(item.data) : ''}</span>
                        <p className="text-[11px] font-extrabold text-rose-800">
                          {item.dias_texto}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-rose-400 group-hover:text-rose-700 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* GRUPO: VENCE EM 30 DIAS */}
          {gruposAlertas.VENCE_EM_30_DIAS.length > 0 && (
            <Card className="bg-amber-50/70 border-amber-200/90 text-amber-950 p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-amber-200/70 pb-2.5">
                <div className="flex items-center gap-2">
                  <Badge variante="alerta">Próximos 30 dias</Badge>
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                    Vencem em Breve ({gruposAlertas.VENCE_EM_30_DIAS.length})
                  </span>
                </div>
              </div>

              <div className="divide-y divide-amber-200/60">
                {gruposAlertas.VENCE_EM_30_DIAS.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/membro/${item.membro_id}`)}
                    className="py-2.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-amber-100/50 p-2 rounded-lg transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-white/80 border border-amber-200 shrink-0">
                        {renderIconeAlerta(item.tipo)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                            {renderIconeMembro(item.membro_tipo)}
                            {item.membro_nome}
                          </span>
                          <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-200/80">
                            {item.tipo_label}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-slate-900 mt-0.5">
                          {item.descricao}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 text-xs font-semibold text-amber-900">
                      <div className="text-right">
                        <span>{item.data ? formatarDataExtenso(item.data) : ''}</span>
                        <p className="text-[11px] font-bold text-amber-800">
                          {item.dias_texto}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-amber-400 group-hover:text-amber-700 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* GRUPO: 31 A 90 DIAS */}
      {gruposAlertas.VENCE_EM_31_A_90_DIAS.length > 0 && (
        <Card className="bg-slate-50 border-slate-200 text-slate-800 p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <Badge variante="neutro">31 a 90 dias</Badge>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Agendamentos Próximos ({gruposAlertas.VENCE_EM_31_A_90_DIAS.length})
              </span>
            </div>
          </div>

          <div className="divide-y divide-slate-200/80">
            {gruposAlertas.VENCE_EM_31_A_90_DIAS.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/membro/${item.membro_id}`)}
                className="py-2 first:pt-0 last:pb-0 flex items-center justify-between gap-2 hover:bg-slate-100/80 p-2 rounded-lg transition-colors cursor-pointer group text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    {renderIconeMembro(item.membro_tipo)}
                    {item.membro_nome}:
                  </span>
                  <span className="text-slate-700 font-medium">{item.descricao}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 font-medium">
                  <span>{item.data ? formatarDataExtenso(item.data) : ''}</span>
                  <span className="text-[11px] bg-slate-200/80 text-slate-700 px-1.5 py-0.5 rounded">
                    {item.dias_texto}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
