import React, { useState } from 'react';
import { Evento } from '../../types/dominio';
import { Card } from '../../componentes/ui/Card';
import { Badge } from '../../componentes/ui/Badge';
import { Botao } from '../../componentes/ui/Botao';
import { Campo } from '../../componentes/ui/Campo';
import { EstadoVazio } from '../../componentes/ui/EstadoVazio';
import { formatarDataExtenso, obterDataHojeISO } from '../../lib/datas';
import { Clock, Plus, Calendar, FileText, Stethoscope, Syringe, HeartPulse, Activity } from 'lucide-react';

interface AbaHistoricoProps {
  eventos: Evento[];
  onSalvarEvento: (evento: Evento) => Promise<void>;
}

export const AbaHistorico: React.FC<AbaHistoricoProps> = ({ eventos, onSalvarEvento }) => {
  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // Form states
  const [data, setData] = useState(obterDataHojeISO());
  const [tipo, setTipo] = useState('Consulta');
  const [descricao, setDescricao] = useState('');

  // Ordenar por data decrescente
  const eventosOrdenados = [...eventos].sort((a, b) =>
    (b.data || '').localeCompare(a.data || '')
  );

  const abrirNovoModal = () => {
    setData(obterDataHojeISO());
    setTipo('Consulta');
    setDescricao('');
    setModalNovoAberto(true);
  };

  const handleCriarEvento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao.trim()) return;

    setSalvando(true);
    try {
      const novo: Evento = {
        id: `ev_${Date.now()}`,
        membro_id: '',
        data: data || obterDataHojeISO(),
        tipo: tipo.trim() || 'Consulta',
        descricao: descricao.trim(),
      };
      await onSalvarEvento(novo);
      setModalNovoAberto(false);
    } catch (err) {
      console.error('Erro ao adicionar evento ao histórico:', err);
    } finally {
      setSalvando(false);
    }
  };

  const renderIconeTipo = (tipoEv: string) => {
    const t = tipoEv.toLowerCase();
    if (t.includes('vacina')) return <Syringe className="w-4 h-4 text-teal-600" />;
    if (t.includes('consulta') || t.includes('atendimento'))
      return <Stethoscope className="w-4 h-4 text-indigo-600" />;
    if (t.includes('exame')) return <Activity className="w-4 h-4 text-amber-600" />;
    if (t.includes('sintoma') || t.includes('cirurgia'))
      return <HeartPulse className="w-4 h-4 text-rose-600" />;
    return <FileText className="w-4 h-4 text-slate-600" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-600" />
            Linha do Tempo e Histórico
          </h2>
          <p className="text-xs text-slate-500">
            Registro cronológico de consultas, diagnósticos, internações e procedimentos.
          </p>
        </div>

        <Botao
          variante="primario"
          tamanho="sm"
          icone={<Plus className="w-4 h-4" />}
          onClick={abrirNovoModal}
        >
          Adicionar Evento
        </Botao>
      </div>

      {eventos.length === 0 ? (
        <EstadoVazio
          titulo="Nenhum evento no histórico"
          descricao="Crie uma linha do tempo completa registrando cirurgias, sintomas relevantes, internações ou consultas passadas."
          icone={<Clock className="w-8 h-8 text-slate-400" />}
          acao={
            <Botao
              variante="primario"
              tamanho="sm"
              icone={<Plus className="w-4 h-4" />}
              onClick={abrirNovoModal}
            >
              Adicionar Primeiro Registro
            </Botao>
          }
        />
      ) : (
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {eventosOrdenados.map((ev) => (
            <div key={ev.id} className="relative group">
              {/* Marcador na linha do tempo */}
              <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border-2 border-teal-500 flex items-center justify-center shadow-xs">
                {renderIconeTipo(ev.tipo)}
              </div>

              <Card className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <Badge variante="teal" tamanho="sm">
                      {ev.tipo}
                    </Badge>
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatarDataExtenso(ev.data)}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-800 leading-relaxed font-normal whitespace-pre-wrap">
                  {ev.descricao}
                </p>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Modal Adicionar Evento */}
      {modalNovoAberto && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-3">
              Adicionar Evento ao Histórico
            </h3>

            <form onSubmit={handleCriarEvento} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Campo
                  rotulo="Data *"
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  required
                />

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Tipo de Evento
                  </label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm"
                  >
                    <option value="Consulta">Consulta Médica / Vet</option>
                    <option value="Exame de Rotina">Exame de Rotina</option>
                    <option value="Sintoma / Queixa">Sintoma / Queixa</option>
                    <option value="Cirurgia">Cirurgia / Procedimento</option>
                    <option value="Internação">Internação</option>
                    <option value="Vacinação">Vacinação</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>

              <Campo
                rotulo="Descrição do evento *"
                placeholder="Descreva o que aconteceu, diagnóstico informado pelo médico ou observações importantes..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                textarea
                linhas={4}
                required
              />

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <Botao
                  type="button"
                  variante="secundario"
                  onClick={() => setModalNovoAberto(false)}
                  disabled={salvando}
                >
                  Cancelar
                </Botao>
                <Botao type="submit" variante="primario" carregando={salvando}>
                  Salvar no Histórico
                </Botao>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
