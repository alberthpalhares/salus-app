import React from 'react';
import { Membro } from '../../../types/dominio';
import { Card } from '../../../componentes/ui/Card';
import { Botao } from '../../../componentes/ui/Botao';
import { Edit3, Shield, HeartPulse, PhoneCall, Stethoscope, UserCheck } from 'lucide-react';

interface VisualizacaoFichaProps {
  membro: Membro;
  onIniciarEdicao: () => void;
}

export const VisualizacaoFicha: React.FC<VisualizacaoFichaProps> = ({
  membro,
  onIniciarEdicao,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-teal-600" />
          Ficha de Saúde
        </h2>
        <Botao
          variante="outline"
          tamanho="sm"
          icone={<Edit3 className="w-4 h-4" />}
          onClick={onIniciarEdicao}
        >
          Editar Ficha
        </Botao>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card: Dados Básicos e Clínicos */}
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <Shield className="w-4 h-4 text-teal-600" />
            Dados Básicos e Clínicos
          </h3>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-xs text-slate-500 block">Tipo sanguíneo</span>
              <span className="font-semibold text-slate-900">
                {membro.tipo_sanguineo || 'Não informado'}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-500 block">Plano de saúde</span>
              <span className="font-semibold text-slate-900">
                {membro.plano_saude || 'Não informado'}
              </span>
            </div>

            {membro.raca && (
              <div>
                <span className="text-xs text-slate-500 block">Raça</span>
                <span className="font-semibold text-slate-900">{membro.raca}</span>
              </div>
            )}

            <div>
              <span className="text-xs text-slate-500 block">Nascimento</span>
              <span className="font-semibold text-slate-900">
                {membro.nascimento || membro.data_nascimento || 'Não informado'}
              </span>
            </div>
          </div>
        </Card>

        {/* Card: Condições e Alergias */}
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <HeartPulse className="w-4 h-4 text-teal-600" />
            Condições Ativas e Alergias
          </h3>

          <div className="space-y-3">
            <div>
              <span className="text-xs text-slate-500 block mb-1">Condições ativas</span>
              {membro.condicoes_ativas && membro.condicoes_ativas.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {membro.condicoes_ativas.map((c, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-medium border border-slate-200"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-slate-400 italic">Nenhuma condição ativa cadastrada.</span>
              )}
            </div>

            <div>
              <span className="text-xs text-slate-500 block mb-1">Alergias</span>
              {membro.alergias && membro.alergias.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {membro.alergias.map((a, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-amber-50 text-amber-900 rounded-lg text-xs font-medium border border-amber-200"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-slate-400 italic">Nenhuma alergia cadastrada.</span>
              )}
            </div>
          </div>
        </Card>

        {/* Card: Contatos de Emergência */}
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <PhoneCall className="w-4 h-4 text-teal-600" />
            Contatos de Emergência
          </h3>

          {membro.contatos_emergencia && membro.contatos_emergencia.length > 0 ? (
            <div className="space-y-2">
              {membro.contatos_emergencia.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm"
                >
                  <div>
                    <span className="font-bold text-slate-900">{c.nome}</span>
                    {c.papel && <span className="ml-2 text-xs text-slate-500">({c.papel})</span>}
                  </div>
                  <a
                    href={`tel:${c.telefone}`}
                    className="font-semibold text-teal-700 hover:underline text-xs"
                  >
                    {c.telefone}
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">Nenhum contato de emergência cadastrado.</p>
          )}
        </Card>

        {/* Card: Especialistas de Referência */}
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <Stethoscope className="w-4 h-4 text-teal-600" />
            Especialistas de Referência
          </h3>

          {membro.especialistas_referencia && membro.especialistas_referencia.length > 0 ? (
            <div className="space-y-2">
              {membro.especialistas_referencia.map((esp, i) => (
                <div
                  key={i}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{esp.nome}</span>
                    <span className="text-xs font-semibold text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded-md">
                      {esp.especialidade}
                    </span>
                  </div>
                  {esp.contato && <p className="text-xs text-slate-600">{esp.contato}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              Nenhum especialista de referência cadastrado.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
};
