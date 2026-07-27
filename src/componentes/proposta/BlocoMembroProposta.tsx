import React from 'react';
import { User, CheckCircle2, AlertTriangle, HelpCircle, Check } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Botao } from '../ui/Botao';
import { Membro } from '../../types/dominio';

interface BlocoMembroPropostaProps {
  membros: Membro[];
  membroId: string;
  membroConfianca: 'alta' | 'media' | 'baixa';
  membroConfirmadoExplicitamente: boolean;
  nomeMembroSelecionado: string;
  onSelecionarMembro: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onConfirmarExplicitamente: () => void;
}

export const BlocoMembroProposta: React.FC<BlocoMembroPropostaProps> = ({
  membros,
  membroId,
  membroConfianca,
  membroConfirmadoExplicitamente,
  nomeMembroSelecionado,
  onSelecionarMembro,
  onConfirmarExplicitamente,
}) => {
  const renderBadgeConfianca = () => {
    if (membroConfianca === 'alta') {
      return (
        <Badge variante="teal" icone={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}>
          Confiança Alta
        </Badge>
      );
    }
    if (membroConfianca === 'media') {
      return (
        <Badge variante="alerta" icone={<AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}>
          Confiança Média — Requer confirmação
        </Badge>
      );
    }
    return (
      <Badge variante="neutro" icone={<HelpCircle className="w-3.5 h-3.5 text-slate-500" />}>
        Confiança Baixa — Selecione o membro
      </Badge>
    );
  };

  return (
    <div
      className={`p-4 rounded-xl border transition-all ${
        !membroConfirmadoExplicitamente || membroConfianca !== 'alta'
          ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-300/60'
          : 'bg-teal-50/40 border-teal-200'
      }`}
    >
      <div className="flex items-center justify-between gap-2 pb-2 mb-3 border-b border-slate-200/80">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-teal-700" />
          <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
            2. A quem pertence este documento?
          </h4>
        </div>
        <div>{renderBadgeConfianca()}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Selecione o membro da família *
          </label>
          <select
            value={membroId}
            onChange={onSelecionarMembro}
            className="w-full px-4 py-2.5 bg-white border-2 border-teal-500 rounded-xl font-bold text-slate-900 text-sm shadow-xs focus:ring-2 focus:ring-teal-600"
          >
            {membros.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome} ({m.especie || m.tipo || 'Pessoa'})
              </option>
            ))}
          </select>
        </div>

        {!membroConfirmadoExplicitamente && (
          <div className="p-3 bg-amber-100/90 border border-amber-300 rounded-xl text-amber-950 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                Confirme explicitamente o membro escolhido para liberar a confirmação final.
              </span>
            </div>
            <Botao
              variante="primario"
              tamanho="sm"
              onClick={onConfirmarExplicitamente}
              icone={<Check className="w-3.5 h-3.5" />}
            >
              Confirmar Membro
            </Botao>
          </div>
        )}

        {membroConfirmadoExplicitamente && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Membro confirmado: <strong>{nomeMembroSelecionado}</strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
