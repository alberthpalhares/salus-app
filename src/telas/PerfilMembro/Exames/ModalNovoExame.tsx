import React, { useState } from 'react';
import { Exame } from '../../../types/dominio';
import { Card } from '../../../componentes/ui/Card';
import { Botao } from '../../../componentes/ui/Botao';
import { Campo } from '../../../componentes/ui/Campo';
import { obterDataHojeISO } from '../../../lib/datas';

interface ModalNovoExameProps {
  modalAberto: boolean;
  onFechar: () => void;
  onSalvarExame: (exame: Exame) => Promise<void>;
}

export const ModalNovoExame: React.FC<ModalNovoExameProps> = ({
  modalAberto,
  onFechar,
  onSalvarExame,
}) => {
  const [salvando, setSalvando] = useState(false);
  const [painel, setPainel] = useState('');
  const [dataExame, setDataExame] = useState(obterDataHojeISO());
  const [marcador, setMarcador] = useState('');
  const [valor, setValor] = useState('');
  const [unidade, setUnidade] = useState('');
  const [faixaLaudo, setFaixaLaudo] = useState('');
  const [flag, setFlag] = useState<'normal' | 'alto' | 'baixo' | 'nao_informado'>('normal');

  if (!modalAberto) return null;

  const handleCriarExame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!marcador.trim() || !valor.trim()) return;

    setSalvando(true);
    try {
      const novo: Exame = {
        id: `ex_${Date.now()}`,
        membro_id: '',
        data: dataExame || obterDataHojeISO(),
        painel: painel.trim() || 'Outros Exames',
        marcador: marcador.trim(),
        valor: valor.trim(),
        unidade: unidade.trim(),
        faixa_referencia_laudo: faixaLaudo.trim(),
        flag,
      };
      await onSalvarExame(novo);
      onFechar();
    } catch (err) {
      console.error('Erro ao adicionar exame:', err);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-3">
          Adicionar Resultado de Exame
        </h3>

        <form onSubmit={handleCriarExame} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Campo
              rotulo="Painel do Exame"
              placeholder="Ex: Hemograma, Perfil Lipídico..."
              value={painel}
              onChange={(e) => setPainel(e.target.value)}
            />

            <Campo
              rotulo="Data do Exame *"
              type="date"
              value={dataExame}
              onChange={(e) => setDataExame(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Campo
              rotulo="Marcador *"
              placeholder="Ex: Glicose"
              value={marcador}
              onChange={(e) => setMarcador(e.target.value)}
              className="sm:col-span-1"
              required
            />

            <Campo
              rotulo="Valor *"
              placeholder="Ex: 92"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              required
            />

            <Campo
              rotulo="Unidade"
              placeholder="Ex: mg/dL, g/dL"
              value={unidade}
              onChange={(e) => setUnidade(e.target.value)}
            />
          </div>

          <Campo
            rotulo="Faixa de referência impressa no laudo"
            placeholder="Ex: 70 a 99 mg/dL (deixe em branco se o laudo não trouxe)"
            value={faixaLaudo}
            onChange={(e) => setFaixaLaudo(e.target.value)}
            dica="Copie exatamente como impresso no laudo do laboratório."
          />

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Sinalização do laboratório
            </label>
            <select
              value={flag}
              onChange={(e) =>
                setFlag(e.target.value as 'normal' | 'alto' | 'baixo' | 'nao_informado')
              }
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm"
            >
              <option value="normal">Normal</option>
              <option value="alto">Laboratório sinalizou como alto</option>
              <option value="baixo">Laboratório sinalizou como baixo</option>
              <option value="nao_informado">Não informado / Neutro</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
            <Botao
              type="button"
              variante="secundario"
              onClick={onFechar}
              disabled={salvando}
            >
              Cancelar
            </Botao>
            <Botao type="submit" variante="primario" carregando={salvando}>
              Salvar Exame
            </Botao>
          </div>
        </form>
      </Card>
    </div>
  );
};
