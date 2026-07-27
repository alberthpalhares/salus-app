import React, { useState } from 'react';
import { Medicamento } from '../../types/dominio';
import { Card } from '../../componentes/ui/Card';
import { Badge } from '../../componentes/ui/Badge';
import { Botao } from '../../componentes/ui/Botao';
import { EstadoVazio } from '../../componentes/ui/EstadoVazio';
import { obterDataHojeISO } from '../../lib/datas';
import { Pill, Plus, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { CardMedicamentoPrescrito } from './Medicamentos/CardMedicamentoPrescrito';
import { CardMedicamentoEmUso } from './Medicamentos/CardMedicamentoEmUso';
import { ModaisMedicamento } from './Medicamentos/ModaisMedicamento';

interface AbaMedicamentosProps {
  medicamentos: Medicamento[];
  onSalvarMedicamento: (med: Medicamento) => Promise<void>;
  onRemoverMedicamento?: (id: string) => Promise<void>;
}

export const AbaMedicamentos: React.FC<AbaMedicamentosProps> = ({
  medicamentos,
  onSalvarMedicamento,
}) => {
  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [modalConfirmarInicio, setModalConfirmarInicio] = useState<Medicamento | null>(null);
  const [modalDescontinuar, setModalDescontinuar] = useState<Medicamento | null>(null);
  const [salvando, setSalvando] = useState(false);

  const emUso = medicamentos.filter((m) => m.status === 'em_uso');
  const prescritos = medicamentos.filter((m) => m.status === 'prescrito');
  const descontinuados = medicamentos.filter((m) => m.status === 'descontinuado');

  const handleCriarMedicamento = async (novo: Medicamento) => {
    setSalvando(true);
    try {
      await onSalvarMedicamento(novo);
      setModalNovoAberto(false);
    } catch (err) {
      console.error('Erro ao adicionar medicamento:', err);
    } finally {
      setSalvando(false);
    }
  };

  const handleConfirmarInicio = async (med: Medicamento, dataInicio: string) => {
    setSalvando(true);
    try {
      const medAtualizado: Medicamento = {
        ...med,
        status: 'em_uso',
        desde: dataInicio || obterDataHojeISO(),
      };
      await onSalvarMedicamento(medAtualizado);
      setModalConfirmarInicio(null);
    } catch (err) {
      console.error('Erro ao mover medicamento para em_uso:', err);
    } finally {
      setSalvando(false);
    }
  };

  const handleDescontinuar = async (med: Medicamento, motivo: string) => {
    setSalvando(true);
    try {
      const medAtualizado: Medicamento = {
        ...med,
        status: 'descontinuado',
        motivo_descontinuacao: motivo.trim() || 'Descontinuado pelo usuário',
      };
      await onSalvarMedicamento(medAtualizado);
      setModalDescontinuar(null);
    } catch (err) {
      console.error('Erro ao descontinuar medicamento:', err);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Pill className="w-5 h-5 text-teal-600" />
            Medicamentos e Prescrições
          </h2>
          <p className="text-xs text-slate-500">
            Controle de medicamentos em uso, receitas prescritas e descontinuadas.
          </p>
        </div>

        <Botao
          variante="primario"
          tamanho="sm"
          icone={<Plus className="w-4 h-4" />}
          onClick={() => setModalNovoAberto(true)}
        >
          Adicionar Medicamento
        </Botao>
      </div>

      {medicamentos.length === 0 ? (
        <EstadoVazio
          titulo="Nenhum medicamento registrado"
          descricao="Cadastre medicamentos que estão em uso ou prescrições médicas aguardando início de tratamento."
          icone={<Pill className="w-8 h-8 text-slate-400" />}
          acao={
            <Botao
              variante="primario"
              tamanho="sm"
              icone={<Plus className="w-4 h-4" />}
              onClick={() => setModalNovoAberto(true)}
            >
              Adicionar Primeiro Medicamento
            </Botao>
          }
        />
      ) : (
        <div className="space-y-8">
          {/* Prescritos */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-amber-200/80 pb-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Prescritos — Aguardando confirmação de início ({prescritos.length})
              </h3>
            </div>

            {prescritos.length === 0 ? (
              <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl border border-slate-100">
                Nenhum medicamento prescrito aguardando confirmação.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prescritos.map((med) => (
                  <CardMedicamentoPrescrito
                    key={med.id}
                    med={med}
                    onConfirmarInicio={(m) => setModalConfirmarInicio(m)}
                    onDescontinuar={(m) => setModalDescontinuar(m)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Em Uso */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-teal-200/80 pb-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Em uso ativo ({emUso.length})
              </h3>
            </div>

            {emUso.length === 0 ? (
              <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl border border-slate-100">
                Nenhum medicamento registrado em uso ativo.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emUso.map((med) => (
                  <CardMedicamentoEmUso
                    key={med.id}
                    med={med}
                    onDescontinuar={(m) => setModalDescontinuar(m)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Descontinuados */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <XCircle className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                Descontinuados ({descontinuados.length})
              </h3>
            </div>

            {descontinuados.length === 0 ? (
              <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl border border-slate-100">
                Nenhum medicamento descontinuado.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {descontinuados.map((med) => (
                  <Card key={med.id} className="space-y-2 opacity-80 bg-slate-50/80">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-slate-700 line-through text-sm">
                          {med.nome}
                        </h4>
                        <p className="text-xs text-slate-500">{med.dose}</p>
                      </div>
                      <Badge variante="neutro" tamanho="sm">
                        Descontinuado
                      </Badge>
                    </div>

                    {med.motivo_descontinuacao && (
                      <p className="text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-200/60 italic">
                        Motivo: {med.motivo_descontinuacao}
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <ModaisMedicamento
        modalNovoAberto={modalNovoAberto}
        onFecharModalNovo={() => setModalNovoAberto(false)}
        onCriarMedicamento={handleCriarMedicamento}
        modalConfirmarInicio={modalConfirmarInicio}
        onFecharModalInicio={() => setModalConfirmarInicio(null)}
        onConfirmarInicio={handleConfirmarInicio}
        modalDescontinuar={modalDescontinuar}
        onFecharModalDescontinuar={() => setModalDescontinuar(null)}
        onDescontinuar={handleDescontinuar}
        salvando={salvando}
      />
    </div>
  );
};
