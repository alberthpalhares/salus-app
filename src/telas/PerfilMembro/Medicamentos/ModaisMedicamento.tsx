import React, { useState } from 'react';
import { Medicamento } from '../../../types/dominio';
import { Card } from '../../../componentes/ui/Card';
import { Botao } from '../../../componentes/ui/Botao';
import { Campo } from '../../../componentes/ui/Campo';
import { CheckCircle2 } from 'lucide-react';
import { obterDataHojeISO } from '../../../lib/datas';

interface ModaisMedicamentoProps {
  modalNovoAberto: boolean;
  onFecharModalNovo: () => void;
  onCriarMedicamento: (med: Medicamento) => Promise<void>;

  modalConfirmarInicio: Medicamento | null;
  onFecharModalInicio: () => void;
  onConfirmarInicio: (med: Medicamento, dataInicio: string) => Promise<void>;

  modalDescontinuar: Medicamento | null;
  onFecharModalDescontinuar: () => void;
  onDescontinuar: (med: Medicamento, motivo: string) => Promise<void>;

  salvando: boolean;
}

export const ModaisMedicamento: React.FC<ModaisMedicamentoProps> = ({
  modalNovoAberto,
  onFecharModalNovo,
  onCriarMedicamento,
  modalConfirmarInicio,
  onFecharModalInicio,
  onConfirmarInicio,
  modalDescontinuar,
  onFecharModalDescontinuar,
  onDescontinuar,
  salvando,
}) => {
  // Novo Medicamento
  const [nome, setNome] = useState('');
  const [dose, setDose] = useState('');
  const [frequencia, setFrequencia] = useState('');
  const [statusNovo, setStatusNovo] = useState<'em_uso' | 'prescrito' | 'descontinuado'>('prescrito');
  const [desde, setDesde] = useState(obterDataHojeISO());
  const [renovaEm, setRenovaEm] = useState('');
  const [prescritoPor, setPrescritoPor] = useState('');

  // Confirmar início
  const [dataInicioConfirmada, setDataInicioConfirmada] = useState(obterDataHojeISO());

  // Descontinuar
  const [motivoDescontinuacao, setMotivoDescontinuacao] = useState('');

  const handleSubmeterNovo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    const novo: Medicamento = {
      id: `med_${Date.now()}`,
      membro_id: '',
      nome: nome.trim(),
      dose: dose.trim(),
      frequencia: frequencia.trim(),
      status: statusNovo,
      desde: desde || undefined,
      renova_em: renovaEm || undefined,
      prescrito_por: prescritoPor.trim() || undefined,
    };
    await onCriarMedicamento(novo);
  };

  return (
    <>
      {/* MODAL 1: Adicionar Novo Medicamento */}
      {modalNovoAberto && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-3">
              Adicionar Medicamento
            </h3>

            <form onSubmit={handleSubmeterNovo} className="space-y-4">
              <Campo
                rotulo="Nome do Medicamento *"
                placeholder="Ex: Losartana, Amoxicilina, Omeprazol..."
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Campo
                  rotulo="Dose"
                  placeholder="Ex: 50 mg, 5 mL"
                  value={dose}
                  onChange={(e) => setDose(e.target.value)}
                />

                <Campo
                  rotulo="Frequência"
                  placeholder="Ex: 1x ao dia, de 8 em 8h"
                  value={frequencia}
                  onChange={(e) => setFrequencia(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Status Inicial
                </label>
                <select
                  value={statusNovo}
                  onChange={(e) =>
                    setStatusNovo(e.target.value as 'em_uso' | 'prescrito' | 'descontinuado')
                  }
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm"
                >
                  <option value="prescrito">Prescrito (Aguardando confirmação de início)</option>
                  <option value="em_uso">Em Uso Ativo</option>
                  <option value="descontinuado">Descontinuado</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Campo
                  rotulo="Data de início / prescrição"
                  type="date"
                  value={desde}
                  onChange={(e) => setDesde(e.target.value)}
                />

                <Campo
                  rotulo="Data de renovação da receita"
                  type="date"
                  value={renovaEm}
                  onChange={(e) => setRenovaEm(e.target.value)}
                />
              </div>

              <Campo
                rotulo="Prescrito por (Médico / Veterinário)"
                placeholder="Ex: Dr. Carlos (Cardiologia)"
                value={prescritoPor}
                onChange={(e) => setPrescritoPor(e.target.value)}
              />

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <Botao
                  type="button"
                  variante="secundario"
                  onClick={onFecharModalNovo}
                  disabled={salvando}
                >
                  Cancelar
                </Botao>
                <Botao type="submit" variante="primario" carregando={salvando}>
                  Salvar Medicamento
                </Botao>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* MODAL 2: Confirmar início "Já estou tomando" */}
      {modalConfirmarInicio && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Confirmar Início de Tratamento</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Você está alterando o status de <strong>{modalConfirmarInicio.nome}</strong> para{' '}
              <strong className="text-teal-700">Em uso</strong>. Por favor, confirme a data de
              início:
            </p>

            <Campo
              rotulo="Data de início"
              type="date"
              value={dataInicioConfirmada}
              onChange={(e) => setDataInicioConfirmada(e.target.value)}
            />

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <Botao
                type="button"
                variante="secundario"
                onClick={onFecharModalInicio}
                disabled={salvando}
              >
                Cancelar
              </Botao>
              <Botao
                type="button"
                variante="primario"
                carregando={salvando}
                icone={<CheckCircle2 className="w-4 h-4" />}
                onClick={() => onConfirmarInicio(modalConfirmarInicio, dataInicioConfirmada)}
              >
                Confirmar Início
              </Botao>
            </div>
          </Card>
        </div>
      )}

      {/* MODAL 3: Descontinuar medicamento */}
      {modalDescontinuar && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Descontinuar Medicamento</h3>
            <p className="text-sm text-slate-600">
              Mudar o status de <strong>{modalDescontinuar.nome}</strong> para Descontinuado.
            </p>

            <Campo
              rotulo="Motivo da descontinuação"
              placeholder="Ex: Fim do tratamento, substituição pelo médico..."
              value={motivoDescontinuacao}
              onChange={(e) => setMotivoDescontinuacao(e.target.value)}
              textarea
            />

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <Botao
                type="button"
                variante="secundario"
                onClick={onFecharModalDescontinuar}
                disabled={salvando}
              >
                Cancelar
              </Botao>
              <Botao
                type="button"
                variante="perigo"
                carregando={salvando}
                onClick={() => onDescontinuar(modalDescontinuar, motivoDescontinuacao)}
              >
                Descontinuar Medicamento
              </Botao>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};
