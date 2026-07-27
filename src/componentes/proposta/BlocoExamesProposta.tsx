import React from 'react';
import { Activity } from 'lucide-react';
import { Card } from '../ui/Card';
import { Exame } from '../../types/dominio';

export interface ExameStateItem {
  incluir: boolean;
  painel: string;
  marcador: string;
  valor: string;
  unidade: string;
  faixa_referencia_laudo: string;
  flag: 'normal' | 'alto' | 'baixo' | 'nao_informado';
  data: string;
}

interface BlocoExamesPropostaProps {
  examesState: ExameStateItem[];
  setExamesState: React.Dispatch<React.SetStateAction<ExameStateItem[]>>;
  examesExistentes: Exame[];
  membroId: string;
  modoEdicao: boolean;
}

export const BlocoExamesProposta: React.FC<BlocoExamesPropostaProps> = ({
  examesState,
  setExamesState,
  examesExistentes,
  membroId,
  modoEdicao,
}) => {
  if (examesState.length === 0) return null;

  return (
    <Card className="p-4 space-y-4 border-slate-200">
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-teal-600" />
          <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
            Exames e Marcadores Extraídos ({examesState.length})
          </h4>
        </div>
        <span className="text-[11px] text-slate-500">
          Desmarque marcadores que não deseja gravar
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50">
              <th className="py-2.5 px-2 w-8 text-center">
                <input
                  type="checkbox"
                  checked={examesState.every((e) => e.incluir)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setExamesState((prev) => prev.map((item) => ({ ...item, incluir: checked })));
                  }}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300"
                />
              </th>
              <th className="py-2.5 px-2.5">Marcador</th>
              <th className="py-2.5 px-2.5">Resultado</th>
              <th className="py-2.5 px-2.5">Faixa do Laudo</th>
              <th className="py-2.5 px-2.5">Sinalização</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {examesState.map((ex, idx) => {
              const exExistente = examesExistentes.find(
                (e) =>
                  e.membro_id === membroId &&
                  e.marcador.toLowerCase().trim() === ex.marcador.toLowerCase().trim()
              );

              return (
                <tr
                  key={idx}
                  className={`transition-colors ${
                    ex.incluir ? 'hover:bg-teal-50/30' : 'opacity-40 bg-slate-50'
                  }`}
                >
                  <td className="py-2.5 px-2 text-center">
                    <input
                      type="checkbox"
                      checked={ex.incluir}
                      onChange={(e) => {
                        const novo = [...examesState];
                        novo[idx].incluir = e.target.checked;
                        setExamesState(novo);
                      }}
                      className="w-4 h-4 text-teal-600 rounded border-slate-300"
                    />
                  </td>

                  <td className="py-2.5 px-2.5">
                    {modoEdicao ? (
                      <input
                        type="text"
                        value={ex.marcador}
                        onChange={(e) => {
                          const novo = [...examesState];
                          novo[idx].marcador = e.target.value;
                          setExamesState(novo);
                        }}
                        className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-bold"
                      />
                    ) : (
                      <div>
                        <span className="font-bold text-slate-900 block">{ex.marcador}</span>
                        {exExistente && (
                          <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            Valor anterior: {exExistente.valor} {exExistente.unidade}
                          </span>
                        )}
                      </div>
                    )}
                  </td>

                  <td className="py-2.5 px-2.5 font-semibold text-slate-800 whitespace-nowrap">
                    {modoEdicao ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={ex.valor}
                          onChange={(e) => {
                            const novo = [...examesState];
                            novo[idx].valor = e.target.value;
                            setExamesState(novo);
                          }}
                          className="w-20 px-2 py-1 border border-slate-300 rounded text-xs"
                        />
                        <input
                          type="text"
                          value={ex.unidade}
                          onChange={(e) => {
                            const novo = [...examesState];
                            novo[idx].unidade = e.target.value;
                            setExamesState(novo);
                          }}
                          className="w-16 px-2 py-1 border border-slate-300 rounded text-xs"
                        />
                      </div>
                    ) : (
                      <span>
                        {ex.valor} {ex.unidade}
                      </span>
                    )}
                  </td>

                  <td className="py-2.5 px-2.5 text-slate-600">
                    {modoEdicao ? (
                      <input
                        type="text"
                        value={ex.faixa_referencia_laudo}
                        onChange={(e) => {
                          const novo = [...examesState];
                          novo[idx].faixa_referencia_laudo = e.target.value;
                          setExamesState(novo);
                        }}
                        className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                      />
                    ) : ex.faixa_referencia_laudo ? (
                      <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                        {ex.faixa_referencia_laudo}
                      </span>
                    ) : (
                      <span className="italic text-slate-400 text-[11px]">
                        faixa não informada no laudo
                      </span>
                    )}
                  </td>

                  <td className="py-2.5 px-2.5 text-slate-600">
                    {ex.flag === 'alto' && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-200">
                        Acima da Faixa
                      </span>
                    )}
                    {ex.flag === 'baixo' && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-200">
                        Abaixo da Faixa
                      </span>
                    )}
                    {ex.flag === 'normal' && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                        Normal
                      </span>
                    )}
                    {(!ex.flag || ex.flag === 'nao_informado') && (
                      <span className="text-[11px] text-slate-400">Não Sinalizado</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
