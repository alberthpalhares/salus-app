import React from 'react';
import { Pill, HelpCircle as QuestionIcon, Check } from 'lucide-react';
import { Card } from '../ui/Card';
import { Campo } from '../ui/Campo';
import { Medicamento } from '../../types/dominio';

export interface MedicamentoStateItem {
  incluir: boolean;
  nome: string;
  dose: string;
  frequencia: string;
  prescrito_por: string;
  validade_receita: string;
  status: 'prescrito' | 'em_uso';
  data_prescricao: string;
}

interface BlocoMedicamentosPropostaProps {
  medicamentosState: MedicamentoStateItem[];
  setMedicamentosState: React.Dispatch<React.SetStateAction<MedicamentoStateItem[]>>;
  medicamentosExistentes: Medicamento[];
  membroId: string;
  modoEdicao: boolean;
}

export const BlocoMedicamentosProposta: React.FC<BlocoMedicamentosPropostaProps> = ({
  medicamentosState,
  setMedicamentosState,
  medicamentosExistentes,
  membroId,
  modoEdicao,
}) => {
  if (medicamentosState.length === 0) return null;

  return (
    <Card className="p-4 space-y-4 border-purple-200 bg-purple-50/20">
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-purple-200">
        <div className="flex items-center gap-2">
          <Pill className="w-4.5 h-4.5 text-purple-700" />
          <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
            3. Medicamentos / Receita Médica ({medicamentosState.length})
          </h4>
        </div>
        <span className="text-[11px] font-semibold text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-full">
          Regra Clínica 5: Início requer confirmação
        </span>
      </div>

      <div className="space-y-4">
        {medicamentosState.map((med, idx) => {
          const medExistente = medicamentosExistentes.find(
            (m) =>
              m.membro_id === membroId &&
              m.nome.toLowerCase().trim() === med.nome.toLowerCase().trim()
          );

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all space-y-3 ${
                med.incluir ? 'bg-white border-purple-200 shadow-xs' : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <label className="flex items-center gap-2.5 cursor-pointer font-bold text-slate-900 text-sm">
                  <input
                    type="checkbox"
                    checked={med.incluir}
                    onChange={(e) => {
                      const novo = [...medicamentosState];
                      novo[idx].incluir = e.target.checked;
                      setMedicamentosState(novo);
                    }}
                    className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
                  />
                  <span>{med.nome}</span>
                </label>

                {medExistente && (
                  <span className="text-xs text-slate-500 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-medium">
                    Já existe no perfil: {medExistente.dose} ({medExistente.status === 'em_uso' ? 'Em uso' : 'Prescrito'})
                  </span>
                )}
              </div>

              {med.incluir && (
                <>
                  {modoEdicao ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <Campo
                        rotulo="Nome do Medicamento"
                        value={med.nome}
                        onChange={(e) => {
                          const novo = [...medicamentosState];
                          novo[idx].nome = e.target.value;
                          setMedicamentosState(novo);
                        }}
                      />
                      <Campo
                        rotulo="Dose"
                        value={med.dose}
                        onChange={(e) => {
                          const novo = [...medicamentosState];
                          novo[idx].dose = e.target.value;
                          setMedicamentosState(novo);
                        }}
                      />
                      <Campo
                        rotulo="Frequência / Posologia"
                        value={med.frequencia}
                        onChange={(e) => {
                          const novo = [...medicamentosState];
                          novo[idx].frequencia = e.target.value;
                          setMedicamentosState(novo);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="text-xs text-slate-600 space-y-1 bg-purple-50/50 p-2.5 rounded-lg border border-purple-100">
                      {med.dose && (
                        <p>
                          Dose: <strong>{med.dose}</strong> {med.frequencia && `• ${med.frequencia}`}
                        </p>
                      )}
                      {med.prescrito_por && <p>Prescrito por: {med.prescrito_por}</p>}
                    </div>
                  )}

                  {/* PERGUNTA EXPLÍCITA OBRIGATÓRIA DA RECEITA */}
                  <div className="p-3 bg-purple-100/70 border border-purple-300/80 rounded-xl space-y-2">
                    <label className="block text-xs font-bold text-purple-950 flex items-center gap-1.5">
                      <QuestionIcon className="w-4 h-4 text-purple-700 shrink-0" />
                      <span>Você já comprou / está tomando este medicamento?</span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          const novo = [...medicamentosState];
                          novo[idx].status = 'prescrito';
                          setMedicamentosState(novo);
                        }}
                        className={`p-2.5 rounded-lg border text-xs font-bold text-left transition-all cursor-pointer ${
                          med.status === 'prescrito'
                            ? 'bg-purple-700 text-white border-purple-800 shadow-xs ring-2 ring-purple-400'
                            : 'bg-white text-slate-700 border-purple-200 hover:bg-purple-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>Só a receita por enquanto</span>
                          {med.status === 'prescrito' && <Check className="w-4 h-4" />}
                        </div>
                        <span className="text-[10px] font-normal opacity-90 block mt-0.5">
                          Status: Prescrito (aba Prescritos do perfil)
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const novo = [...medicamentosState];
                          novo[idx].status = 'em_uso';
                          setMedicamentosState(novo);
                        }}
                        className={`p-2.5 rounded-lg border text-xs font-bold text-left transition-all cursor-pointer ${
                          med.status === 'em_uso'
                            ? 'bg-teal-700 text-white border-teal-800 shadow-xs ring-2 ring-teal-400'
                            : 'bg-white text-slate-700 border-purple-200 hover:bg-purple-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>Já estou tomando</span>
                          {med.status === 'em_uso' && <Check className="w-4 h-4" />}
                        </div>
                        <span className="text-[10px] font-normal opacity-90 block mt-0.5">
                          Status: Em uso (aba Em Uso do perfil)
                        </span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};
