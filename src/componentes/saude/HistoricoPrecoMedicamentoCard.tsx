import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Botao } from '../ui/Botao';
import { Campo } from '../ui/Campo';
import { DollarSign, TrendingUp, TrendingDown, Plus, Store, Calendar, X, Trash2 } from 'lucide-react';
import { RegistroPrecoMedicamento } from '../../types/dominio';

interface HistoricoPrecoMedicamentoCardProps {
  medicamentoNome: string;
  membroId?: string;
  registros: RegistroPrecoMedicamento[];
  onSalvarRegistro: (reg: RegistroPrecoMedicamento) => Promise<void>;
  onRemoverRegistro: (id: string) => Promise<void>;
}

export const HistoricoPrecoMedicamentoCard: React.FC<HistoricoPrecoMedicamentoCardProps> = ({
  medicamentoNome,
  membroId,
  registros,
  onSalvarRegistro,
  onRemoverRegistro,
}) => {
  const [modalAberto, setModalAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const [preco, setPreco] = useState('');
  const [dataCompra, setDataCompra] = useState(new Date().toISOString().slice(0, 10));
  const [quantidade, setQuantidade] = useState('30 comprimidos');
  const [farmacia, setFarmacia] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const registrosFiltrados = registros.filter(
    (r) => r.medicamento_nome.toLowerCase() === medicamentoNome.toLowerCase()
  );

  const registrosOrdenados = [...registrosFiltrados].sort((a, b) =>
    (b.data_compra || '').localeCompare(a.data_compra || '')
  );

  const ultimaCompra = registrosOrdenados[0];
  const penultimaCompra = registrosOrdenados[1];

  let variacaoPercentual: number | null = null;
  if (ultimaCompra && penultimaCompra && penultimaCompra.preco > 0) {
    variacaoPercentual = ((ultimaCompra.preco - penultimaCompra.preco) / penultimaCompra.preco) * 100;
  }

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    const valorNum = parseFloat(preco.replace(',', '.'));
    if (isNaN(valorNum) || valorNum <= 0) return;
    setSalvando(true);
    try {
      const novoRegistro: RegistroPrecoMedicamento = {
        id: `prec_${Date.now()}`,
        medicamento_nome: medicamentoNome,
        membro_id: membroId,
        data_compra: dataCompra || new Date().toISOString().slice(0, 10),
        preco: valorNum,
        quantidade_embalagem: quantidade.trim() || '1 caixa',
        farmacia_estabelecimento: farmacia.trim() || 'Farmácia Local',
        observacoes: observacoes.trim() || undefined,
      };
      await onSalvarRegistro(novoRegistro);
      setPreco('');
      setFarmacia('');
      setObservacoes('');
      setModalAberto(false);
    } catch (err) {
      console.error('Erro ao registrar preço:', err);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            Histórico &amp; Oscilação de Preço: {medicamentoNome}
          </h3>
          <p className="text-xs text-slate-500">Acompanhe reajustes e compare drogarias</p>
        </div>

        <Botao
          variante="secundario"
          tamanho="sm"
          icone={<Plus className="w-4 h-4" />}
          onClick={() => setModalAberto(true)}
        >
          Registrar Compra
        </Botao>
      </div>

      {/* Indicador de Variação Recente */}
      {variacaoPercentual !== null && (
        <div className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold ${
          variacaoPercentual > 0
            ? 'bg-rose-50 border-rose-200 text-rose-800'
            : variacaoPercentual < 0
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}>
          <div className="flex items-center gap-2">
            {variacaoPercentual > 0 ? (
              <TrendingUp className="w-4 h-4 text-rose-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-emerald-600" />
            )}
            <span>
              {variacaoPercentual > 0
                ? `Aumento de +${variacaoPercentual.toFixed(1)}% em relação à última compra`
                : variacaoPercentual < 0
                ? `Economia de ${variacaoPercentual.toFixed(1)}% na compra mais recente`
                : 'Preço idêntico à compra anterior'}
            </span>
          </div>
          <Badge variante={variacaoPercentual > 0 ? 'rose' : 'teal'} tamanho="sm">
            R$ {ultimaCompra.preco.toFixed(2)}
          </Badge>
        </div>
      )}

      {/* Tabela / Lista de Compras */}
      {registrosOrdenados.length === 0 ? (
        <p className="text-xs text-slate-400 py-3 text-center italic">
          Nenhum valor de compra registrado para este medicamento ainda.
        </p>
      ) : (
        <div className="space-y-2">
          {registrosOrdenados.map((r) => (
            <div
              key={r.id}
              className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-extrabold shrink-0">
                  R$
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 text-sm">
                    R$ {r.preco.toFixed(2)} <span className="text-[11px] font-normal text-slate-500">({r.quantidade_embalagem})</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Store className="w-3 h-3 text-slate-400" /> {r.farmacia_estabelecimento}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" /> {r.data_compra}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onRemoverRegistro(r.id)}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Excluir registro"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal Registrar Valor Pago */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setModalAberto(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" /> Registrar Preço da Compra
              </h3>
              <button type="button" onClick={() => setModalAberto(false)} className="p-1 rounded-xl text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSalvar} className="space-y-3">
              <Campo
                rotulo="Valor Pago (R$) *"
                placeholder="Ex: 29.90"
                type="number"
                step="0.01"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                required
                autoFocus
              />

              <div className="grid grid-cols-2 gap-3">
                <Campo
                  rotulo="Data da Compra"
                  type="date"
                  value={dataCompra}
                  onChange={(e) => setDataCompra(e.target.value)}
                />
                <Campo
                  rotulo="Embalagem / Qtd"
                  placeholder="Ex: 30 comp, 1 frasco..."
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                />
              </div>

              <Campo
                rotulo="Farmácia / Drogaria"
                placeholder="Ex: Drogasil, Droga Raia, Ultrafarma..."
                value={farmacia}
                onChange={(e) => setFarmacia(e.target.value)}
              />

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Botao type="button" variante="secundario" onClick={() => setModalAberto(false)}>
                  Cancelar
                </Botao>
                <Botao type="submit" carregando={salvando} disabled={!preco.trim()}>
                  Salvar Registro
                </Botao>
              </div>
            </form>
          </div>
        </div>
      )}
    </Card>
  );
};
