import React, { useState } from 'react';
import { User as UserIcon, Bot, CheckCircle2, X, Info, Copy, Check, ShieldAlert } from 'lucide-react';
import { PainelDeProposta } from '../../componentes/PainelDeProposta';
import { MensagemChat } from '../../servicos/api';
import { Membro, Exame, Medicamento, Vacina, Evento, ItemCaixaEntrada } from '../../types/dominio';
import { SelecaoProposta } from '../../types/propostas';
import { obterDataHojeISO } from '../../lib/datas';

export const DISCLAIMER_CLINICO_IA =
  'Gerado por inteligência artificial a partir dos seus documentos. Não substitui avaliação profissional.';

interface MensagemItemChatProps {
  msg: MensagemChat;
  index: number;
  membros: Membro[];
  exames: Exame[];
  medicamentos: Medicamento[];
  vacinas: Vacina[];
  eventos: Evento[];
  submetendoProposta: boolean;
  onConfirmarProposta: (index: number, selecao: SelecaoProposta) => Promise<void>;
  onDescartarProposta: (index: number) => Promise<void>;
}

export const MensagemItemChat: React.FC<MensagemItemChatProps> = ({
  msg,
  index,
  membros,
  exames,
  medicamentos,
  vacinas,
  eventos,
  submetendoProposta,
  onConfirmarProposta,
  onDescartarProposta,
}) => {
  const isUser = msg.role === 'user';
  const [copiado, setCopiado] = useState(false);

  const handleCopiarMensagem = () => {
    const textoComDisclaimer = `${msg.text}\n\n${DISCLAIMER_CLINICO_IA}`;
    navigator.clipboard.writeText(textoComDisclaimer);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  const virtualItemChat: ItemCaixaEntrada = {
    id: `chat_${index}`,
    nome_arquivo: 'Registro_Chat.txt',
    mime: 'text/plain',
    adicionado_em: obterDataHojeISO(),
    status: 'proposto',
    drive_file_id: '',
  };

  return (
    <div
      className={`flex gap-3 max-w-[95%] sm:max-w-[88%] ${
        isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          isUser
            ? 'bg-teal-600 text-white'
            : 'bg-slate-800 text-teal-300'
        }`}
      >
        {isUser ? (
          <UserIcon className="w-4 h-4" />
        ) : (
          <Bot className="w-4 h-4" />
        )}
      </div>

      <div className="space-y-2 flex-1">
        <div
          className={`p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? 'bg-teal-600 text-white rounded-tr-none'
              : 'bg-white text-slate-800 border border-slate-200/80 shadow-2xs rounded-tl-none'
          }`}
        >
          {msg.text}

          {!isUser && (
            <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 font-normal">
              <span className="italic flex items-center gap-1.5 text-slate-500">
                <ShieldAlert className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                {DISCLAIMER_CLINICO_IA}
              </span>
              <button
                type="button"
                onClick={handleCopiarMensagem}
                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                title="Copiar mensagem com isenção clínica"
              >
                {copiado ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-500" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {!isUser && msg.proposta && (
          <div className="mt-3">
            {msg.propostaStatus === 'pendente' ? (
              <div className="border border-teal-200 rounded-2xl bg-white p-2 shadow-xs">
                <PainelDeProposta
                  proposta={msg.proposta}
                  itemCaixaEntrada={virtualItemChat}
                  membros={membros}
                  examesExistentes={exames}
                  medicamentosExistentes={medicamentos}
                  vacinasExistentes={vacinas}
                  eventosExistentes={eventos}
                  onConfirmar={(selecao) => onConfirmarProposta(index, selecao)}
                  onDescartar={() => onDescartarProposta(index)}
                  submetendo={submetendoProposta}
                />
              </div>
            ) : msg.propostaStatus === 'aprovada' ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">
                  Proposta confirmada e gravada no histórico da família.
                </span>
              </div>
            ) : (
              <div className="p-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs flex items-center gap-2">
                <X className="w-3.5 h-3.5 shrink-0" />
                <span>Proposta descartada.</span>
              </div>
            )}
          </div>
        )}

        {!isUser && msg.dadosConsultados && (
          <div className="text-[11px] text-slate-500 border-t border-slate-200/60 pt-1 flex items-center gap-1.5">
            <Info className="w-3 h-3 text-teal-600 shrink-0" />
            <span>Dados consultados: {msg.dadosConsultados}</span>
          </div>
        )}
      </div>
    </div>
  );
};
