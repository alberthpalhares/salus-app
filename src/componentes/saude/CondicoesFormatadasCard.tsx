import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Botao } from '../ui/Botao';
import { Campo } from '../ui/Campo';
import { Activity, Plus, ShieldAlert, Heart, Calendar, Stethoscope, Trash2, X } from 'lucide-react';
import { CondicaoSaudeEstruturada } from '../../types/dominio';

interface CondicoesFormatadasCardProps {
  membroId: string;
  condicoesEstruturadas: CondicaoSaudeEstruturada[];
  condicoesLegadas?: string[];
  onSalvarCondicao: (cond: CondicaoSaudeEstruturada) => Promise<void>;
  onRemoverCondicao: (id: string) => Promise<void>;
}

export const CondicoesFormatadasCard: React.FC<CondicoesFormatadasCardProps> = ({
  membroId,
  condicoesEstruturadas,
  condicoesLegadas = [],
  onSalvarCondicao,
  onRemoverCondicao,
}) => {
  const [modalAberto, setModalAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState<CondicaoSaudeEstruturada['categoria']>('cronica');
  const [gravidade, setGravidade] = useState<CondicaoSaudeEstruturada['gravidade']>('moderada');
  const [status, setStatus] = useState<CondicaoSaudeEstruturada['status']>('ativa');
  const [diagnosticoEm, setDiagnosticoEm] = useState('');
  const [medico, setMedico] = useState('');
  const [notas, setNotas] = useState('');

  // Converter legados para exibição caso ainda não tenham sido estruturados
  const todasCondicoes: CondicaoSaudeEstruturada[] = [...condicoesEstruturadas];
  condicoesLegadas.forEach((c, idx) => {
    if (!todasCondicoes.some((x) => x.nome.toLowerCase() === c.toLowerCase())) {
      todasCondicoes.push({
        id: `legada_${idx}_${c}`,
        membro_id: membroId,
        nome: c,
        categoria: 'cronica',
        gravidade: 'moderada',
        status: 'ativa',
        notas: 'Registro importado de versão anterior',
      });
    }
  });

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;
    setSalvando(true);
    try {
      const novaCondicao: CondicaoSaudeEstruturada = {
        id: `cond_${Date.now()}`,
        membro_id: membroId,
        nome: nome.trim(),
        categoria,
        gravidade,
        status,
        diagnostico_em: diagnosticoEm || undefined,
        medico_responsavel: medico.trim() || undefined,
        notas: notas.trim() || undefined,
      };
      await onSalvarCondicao(novaCondicao);
      setNome('');
      setDiagnosticoEm('');
      setMedico('');
      setNotas('');
      setModalAberto(false);
    } catch (err) {
      console.error('Erro ao salvar condição:', err);
    } finally {
      setSalvando(false);
    }
  };

  const getCorGravidade = (g: CondicaoSaudeEstruturada['gravidade']) => {
    switch (g) {
      case 'alta':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'moderada':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'baixa':
      default:
        return 'bg-teal-100 text-teal-800 border-teal-200';
    }
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Condições em Acompanhamento</h2>
            <p className="text-xs text-slate-500">Histórico diagnóstico e monitoramento ativo</p>
          </div>
        </div>

        <Botao
          variante="secundario"
          tamanho="sm"
          icone={<Plus className="w-4 h-4" />}
          onClick={() => setModalAberto(true)}
        >
          Adicionar Condição
        </Botao>
      </div>

      {todasCondicoes.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-2">
          <Heart className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-xs font-semibold text-slate-600">Nenhuma condição ativa registrada.</p>
          <p className="text-[11px] text-slate-400">Cadastre diagnósticos, alergias ou prevenções para acompanhamento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {todasCondicoes.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-slate-300 transition-all space-y-2 relative group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getCorGravidade(c.gravidade)}`}>
                    Gravidade {c.gravidade}
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900 leading-snug">{c.nome}</h4>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoverCondicao(c.id)}
                  className="p-1 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100"
                  title="Remover condição"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-slate-600 pt-1">
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium capitalize">
                  {c.categoria}
                </span>

                {c.diagnostico_em && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {c.diagnostico_em}
                  </span>
                )}

                {c.medico_responsavel && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-teal-800 font-semibold">
                    <Stethoscope className="w-3 h-3 text-teal-600" />
                    {c.medico_responsavel}
                  </span>
                )}
              </div>

              {c.notas && (
                <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100 leading-relaxed italic">
                  "{c.notas}"
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal Adicionar Condição */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setModalAberto(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                Cadastrar Condição de Saúde
              </h3>
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                className="p-1 rounded-xl text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSalvar} className="space-y-3">
              <Campo
                rotulo="Nome da Condição / Diagnóstico *"
                placeholder="Ex: Hipertensão Arterial, Asma, Dermatite Atópica..."
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Categoria</label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value as CondicaoSaudeEstruturada['categoria'])}
                    className="w-full h-10 px-3 text-xs bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-teal-500 font-medium"
                  >
                    <option value="cronica">Crônica</option>
                    <option value="aguda">Aguda</option>
                    <option value="alergia">Alergia</option>
                    <option value="cirurgica">Cirúrgica / Pós-op</option>
                    <option value="preventiva">Preventiva / Monitoramento</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gravidade / Atenção</label>
                  <select
                    value={gravidade}
                    onChange={(e) => setGravidade(e.target.value as CondicaoSaudeEstruturada['gravidade'])}
                    className="w-full h-10 px-3 text-xs bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-teal-500 font-medium"
                  >
                    <option value="baixa">Baixa (Leve)</option>
                    <option value="moderada">Moderada (Acompanhar)</option>
                    <option value="alta">Alta (Prioritária)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Campo
                  rotulo="Data do Diagnóstico"
                  type="date"
                  value={diagnosticoEm}
                  onChange={(e) => setDiagnosticoEm(e.target.value)}
                />

                <Campo
                  rotulo="Médico / Vet Responsável"
                  placeholder="Dr. Carlos Silva..."
                  value={medico}
                  onChange={(e) => setMedico(e.target.value)}
                />
              </div>

              <Campo
                rotulo="Observações e Orientações"
                placeholder="Ex: Tomar medicação em jejum, evitar poeira..."
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
              />

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Botao type="button" variante="secundario" onClick={() => setModalAberto(false)}>
                  Cancelar
                </Botao>
                <Botao type="submit" carregando={salvando} disabled={!nome.trim()}>
                  Salvar Condição
                </Botao>
              </div>
            </form>
          </div>
        </div>
      )}
    </Card>
  );
};
