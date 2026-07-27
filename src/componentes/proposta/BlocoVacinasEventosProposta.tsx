import React from 'react';
import { Syringe, Calendar } from 'lucide-react';
import { Card } from '../ui/Card';

export interface VacinaStateItem {
  incluir: boolean;
  nome: string;
  aplicada_em: string;
  proxima_em: string;
}

export interface EventoStateItem {
  incluir: boolean;
  data: string;
  tipo: string;
  descricao: string;
}

interface BlocoVacinasEventosPropostaProps {
  vacinasState: VacinaStateItem[];
  setVacinasState: React.Dispatch<React.SetStateAction<VacinaStateItem[]>>;
  eventosState: EventoStateItem[];
  setEventosState: React.Dispatch<React.SetStateAction<EventoStateItem[]>>;
}

export const BlocoVacinasEventosProposta: React.FC<BlocoVacinasEventosPropostaProps> = ({
  vacinasState,
  setVacinasState,
  eventosState,
  setEventosState,
}) => {
  return (
    <>
      {/* VACINAS */}
      {vacinasState.length > 0 && (
        <Card className="p-4 space-y-3 border-slate-200">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <Syringe className="w-4 h-4 text-teal-600" />
            <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
              Vacinas Identificadas ({vacinasState.length})
            </h4>
          </div>

          <div className="space-y-2">
            {vacinasState.map((vac, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border flex flex-wrap items-center justify-between gap-3 text-xs ${
                  vac.incluir ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200 opacity-50'
                }`}
              >
                <label className="flex items-center gap-2 font-bold text-slate-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={vac.incluir}
                    onChange={(e) => {
                      const novo = [...vacinasState];
                      novo[idx].incluir = e.target.checked;
                      setVacinasState(novo);
                    }}
                    className="w-4 h-4 text-teal-600 rounded border-slate-300"
                  />
                  <span>{vac.nome}</span>
                </label>

                {vac.incluir && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <span>Aplicada em: {vac.aplicada_em}</span>
                    {vac.proxima_em && (
                      <span className="font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Próximo reforço: {vac.proxima_em}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* EVENTOS */}
      {eventosState.length > 0 && (
        <Card className="p-4 space-y-3 border-slate-200">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <Calendar className="w-4 h-4 text-blue-600" />
            <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
              Eventos e Retornos ({eventosState.length})
            </h4>
          </div>

          <div className="space-y-2">
            {eventosState.map((ev, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border text-xs space-y-1 ${
                  ev.incluir ? 'bg-blue-50/30 border-blue-100' : 'bg-slate-50 border-slate-200 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <label className="flex items-center gap-2 font-bold text-slate-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ev.incluir}
                      onChange={(e) => {
                        const novo = [...eventosState];
                        novo[idx].incluir = e.target.checked;
                        setEventosState(novo);
                      }}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300"
                    />
                    <span>{ev.tipo || 'Evento'}</span>
                  </label>
                  <span className="text-slate-500 font-mono">{ev.data}</span>
                </div>
                {ev.descricao && <p className="text-slate-700 pl-6">{ev.descricao}</p>}
              </div>
            ))}
          </div>
        </Card>
      )}
    </>
  );
};
