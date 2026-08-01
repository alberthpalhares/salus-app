import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Dot,
} from 'recharts';
import { PontoEvolucao } from './useEvolucaoMarcadores';

interface GraficoEvolucaoMarcadorProps {
  pontos: PontoEvolucao[];
  corLinha?: string;
  unidade?: string;
  faixaReferencia?: string;
  altura?: number;
}

export const GraficoEvolucaoMarcador: React.FC<GraficoEvolucaoMarcadorProps> = ({
  pontos,
  corLinha = '#0D9488', // Teal 600
  unidade = '',
  faixaReferencia = '',
  altura = 260,
}) => {
  if (!pontos || pontos.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
        Nenhum histórico suficiente para renderizar a evolução deste marcador.
      </div>
    );
  }

  // Personalização de ponto no gráfico
  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (!cx || !cy) return null;

    const ehAlterado = payload.flag === 'alto' || payload.flag === 'baixo' || payload.flag === 'Alterado';
    const corPonto = ehAlterado ? '#F43F5E' : corLinha;

    return (
      <circle
        cx={cx}
        cy={cy}
        r={ehAlterado ? 5 : 4}
        fill={corPonto}
        stroke="#ffffff"
        strokeWidth={2}
      />
    );
  };

  // Personalização do Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: PontoEvolucao = payload[0].payload;
      const ehAlterado = data.flag === 'alto' || data.flag === 'baixo' || data.flag === 'Alterado';

      return (
        <div className="bg-slate-900 dark:bg-slate-950 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-800">
          <p className="font-bold text-slate-300">{data.dataFormatada}</p>
          <div className="flex items-center gap-1.5 font-extrabold text-sm">
            <span>{data.valor} {data.unidade || unidade}</span>
            {ehAlterado && (
              <span className="px-1.5 py-0.5 text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-md">
                {data.flag === 'alto' ? 'Elevado' : 'Abaixo'}
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-800">
            Faixa do laudo: {data.faixaReferencia || faixaReferencia}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full space-y-2">
      <div style={{ width: '100%', height: altura }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={pontos} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
            <XAxis
              dataKey="dataFormatada"
              tick={{ fontSize: 11, fill: '#64748b' }}
              stroke="#cbd5e1"
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#64748b' }}
              stroke="#cbd5e1"
              domain={['auto', 'auto']}
            />
            <RechartsTooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="valor"
              stroke={corLinha}
              strokeWidth={2.5}
              dot={<CustomDot />}
              activeDot={{ r: 7, strokeWidth: 2, stroke: '#ffffff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {faixaReferencia && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 text-right italic">
          Faixa de referência impressa no laudo: <strong>{faixaReferencia}</strong>
        </p>
      )}
    </div>
  );
};
