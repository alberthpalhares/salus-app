import React, { useState } from 'react';
import { Card } from '../../componentes/ui/Card';
import { Botao } from '../../componentes/ui/Botao';
import {
  Users,
  Dog,
  Cat,
  PawPrint,
  ArrowRight,
  ArrowLeft,
  Info,
} from 'lucide-react';
import { TipoMembro, VinculoMembro } from '../../types/dominio';
import { MembroFormState } from './PassoFamilia';

interface PassoRelacoesProps {
  membros: MembroFormState[];
  relacoesPairs: Record<string, string>;
  onRelacaoChange: (membroAId: string, membroBId: string, papel: string) => void;
  atualizarMembro: (id: string, campo: keyof MembroFormState, valor: unknown) => void;
  onAvancar: () => void;
  onVoltar: () => void;
}

export const PassoRelacoes: React.FC<PassoRelacoesProps> = ({
  membros,
  relacoesPairs,
  onRelacaoChange,
  atualizarMembro,
  onAvancar,
  onVoltar,
}) => {
  const [mostrarVinculoEspecial, setMostrarVinculoEspecial] = useState<boolean>(false);

  const tipoIcones: Record<TipoMembro, React.ReactNode> = {
    pessoa: <Users className="w-5 h-5 text-teal-600" />,
    cao: <Dog className="w-5 h-5 text-amber-600" />,
    gato: <Cat className="w-5 h-5 text-purple-600" />,
    outro: <PawPrint className="w-5 h-5 text-blue-600" />,
  };

  return (
    <Card className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-lg font-bold text-slate-900">
          Relações Familiares
        </h2>
        <p className="text-xs text-slate-500">
          Declare o papel de cada membro na estrutura familiar.
        </p>
      </div>

      {membros.length <= 1 ? (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
          <Info className="w-4 h-4 text-teal-600 shrink-0" />
          <span>
            Com apenas 1 membro cadastrado, não é necessário declarar relações familiares neste momento. Você poderá adicionar mais membros posteriormente.
          </span>
        </div>
      ) : (
        <div className="space-y-4">
          {membros.map((membroA) => {
            const outrosMembros = membros.filter((m) => m.id !== membroA.id);
            if (outrosMembros.length === 0) return null;

            return (
              <div
                key={membroA.id}
                className="p-4 rounded-xl border border-slate-200 bg-white space-y-3"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-teal-50">
                    {tipoIcones[membroA.tipo]}
                  </div>
                  <span className="font-bold text-slate-800 text-sm">
                    {membroA.nome || 'Sem nome'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-2 border-l-2 border-teal-200">
                  {outrosMembros.map((membroB) => {
                    const key = `${membroA.id}_${membroB.id}`;
                    const valorAtual = relacoesPairs[key] || 'none';

                    return (
                      <div key={membroB.id} className="space-y-1">
                        <label className="text-xs text-slate-600">
                          Papel de <strong>{membroA.nome}</strong> em relação a{' '}
                          <strong>{membroB.nome}</strong>:
                        </label>
                        <select
                          value={valorAtual}
                          onChange={(e) =>
                            onRelacaoChange(membroA.id, membroB.id, e.target.value)
                          }
                          className="w-full text-xs font-medium rounded-lg border border-slate-200 bg-white p-2 text-slate-800 focus:ring-1 focus:ring-teal-500"
                        >
                          <option value="none">Não declarado</option>
                          <option value="Pai / Mãe">Pai / Mãe</option>
                          <option value="Filho(a)">Filho(a)</option>
                          <option value="Cônjuge / Companheiro(a)">Cônjuge / Companheiro(a)</option>
                          <option value="Irmão / Irmã">Irmão / Irmã</option>
                          <option value="Tutor(a) do pet">Tutor(a) do pet</option>
                          <option value="Outro">Outro</option>
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="pt-2">
        {!mostrarVinculoEspecial ? (
          <button
            type="button"
            onClick={() => setMostrarVinculoEspecial(true)}
            className="text-xs text-teal-700 hover:text-teal-900 font-semibold underline decoration-dotted underline-offset-4 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Algum membro é adotivo ou enteado?</span>
          </button>
        ) : (
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-3">
            <p className="text-xs text-slate-700 leading-relaxed">
              <strong>Vínculo Genético:</strong> Este campo serve exclusivamente para evitar o cruzamento indevido de histórico genético familiar e não aparece na ficha pública do membro.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {membros.map((m) => (
                <div key={m.id} className="space-y-1">
                  <label className="text-xs font-semibold text-slate-800">
                    Vínculo de {m.nome}:
                  </label>
                  <select
                    value={m.vinculo}
                    onChange={(e) =>
                      atualizarMembro(m.id, 'vinculo', e.target.value as VinculoMembro)
                    }
                    className="w-full text-xs rounded-lg border border-slate-300 bg-white p-2 text-slate-800 focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="biologico">Biológico (Padrão)</option>
                    <option value="adotivo">Adotivo</option>
                    <option value="enteado">Enteado</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 flex items-center justify-between border-t border-slate-100">
        <Botao
          variante="secundario"
          onClick={onVoltar}
          icone={<ArrowLeft className="w-4 h-4" />}
        >
          Voltar
        </Botao>

        <Botao
          variante="primario"
          onClick={onAvancar}
          icone={<ArrowRight className="w-4 h-4" />}
        >
          Continuar
        </Botao>
      </div>
    </Card>
  );
};
