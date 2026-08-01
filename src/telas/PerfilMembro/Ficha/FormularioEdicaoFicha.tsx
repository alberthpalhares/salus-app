import React from 'react';
import { Membro, TipoMembro } from '../../../types/dominio';
import { Card } from '../../../componentes/ui/Card';
import { Botao } from '../../../componentes/ui/Botao';
import { Campo } from '../../../componentes/ui/Campo';
import { Edit3, Save, X, Plus, Trash2 } from 'lucide-react';
import { useEdicaoFicha } from './useEdicaoFicha';

interface FormularioEdicaoFichaProps {
  membro: Membro;
  onSalvarMembro: (membroAtualizado: Membro) => Promise<void>;
  onCancelar: () => void;
}

export const FormularioEdicaoFicha: React.FC<FormularioEdicaoFichaProps> = ({
  membro,
  onSalvarMembro,
  onCancelar,
}) => {
  const {
    salvando,
    nome,
    setNome,
    tipo,
    setTipo,
    nascimento,
    setNascimento,
    raca,
    setRaca,
    tipoSanguineo,
    setTipoSanguineo,
    planoSaude,
    setPlanoSaude,
    condicoesAtivas,
    alergias,
    contatosEmergencia,
    especialistas,
    novaCondicao,
    setNovaCondicao,
    novaAlergia,
    setNovaAlergia,
    novoContatoNome,
    setNovoContatoNome,
    novoContatoTel,
    setNovoContatoTel,
    novoContatoPapel,
    setNovoContatoPapel,
    novoEspNome,
    setNovoEspNome,
    novoEspEspecialidade,
    setNovoEspEspecialidade,
    novoEspContato,
    setNovoEspContato,
    handleSalvar,
    adicionarCondicao,
    removerCondicao,
    adicionarAlergia,
    removerAlergia,
    adicionarContato,
    removerContato,
    adicionarEspecialista,
    removerEspecialista,
  } = useEdicaoFicha(membro, onSalvarMembro, onCancelar);

  return (
    <form onSubmit={handleSalvar}>
      <Card className="p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-teal-600" />
            Editar Ficha Clínica
          </h2>

          <div className="flex items-center gap-2">
            <Botao
              type="button"
              variante="secundario"
              tamanho="sm"
              onClick={onCancelar}
              disabled={salvando}
              icone={<X className="w-4 h-4" />}
            >
              Cancelar
            </Botao>
            <Botao
              type="submit"
              variante="primario"
              tamanho="sm"
              carregando={salvando}
              icone={<Save className="w-4 h-4" />}
            >
              Salvar Alterações
            </Botao>
          </div>
        </div>

        {/* 1. Dados Básicos */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
            1. Informações Básicas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Campo
              rotulo="Nome Completo *"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Tipo do Membro *
              </label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TipoMembro)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              >
                <option value="pessoa">Pessoa (Humano)</option>
                <option value="cao">Cão (Canino)</option>
                <option value="gato">Gato (Felino)</option>
                <option value="outro">Outro Pet</option>
              </select>
            </div>

            <Campo
              rotulo="Data de Nascimento (AAAA-MM-DD)"
              type="date"
              value={nascimento}
              onChange={(e) => setNascimento(e.target.value)}
            />

            {(tipo === 'cao' || tipo === 'gato' || tipo === 'outro') && (
              <Campo
                rotulo="Raça / Porte"
                value={raca}
                onChange={(e) => setRaca(e.target.value)}
                placeholder="Ex: Poodle, SRD, Golden Retriever"
              />
            )}

            <Campo
              rotulo="Tipo Sanguíneo"
              value={tipoSanguineo}
              onChange={(e) => setTipoSanguineo(e.target.value)}
              placeholder="Ex: A+, O-, DEA 1.1+"
            />

            <Campo
              rotulo="Plano de Saúde / Convênio"
              value={planoSaude}
              onChange={(e) => setPlanoSaude(e.target.value)}
              placeholder="Ex: Unimed, Petlove, SulAmérica"
            />
          </div>
        </div>

        {/* 2. Condições Ativas e Alergias */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
            2. Condições de Saúde & Alergias
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Condições Ativas */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">
                Condições Clínicas / Doenças Ativas
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={novaCondicao}
                  onChange={(e) => setNovaCondicao(e.target.value)}
                  placeholder="Ex: Hipertensão, Asma, Gastrite..."
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      adicionarCondicao();
                    }
                  }}
                />
                <Botao
                  type="button"
                  variante="secundario"
                  tamanho="sm"
                  onClick={adicionarCondicao}
                  icone={<Plus className="w-4 h-4" />}
                >
                  Adicionar
                </Botao>
              </div>

              <div className="space-y-2">
                {condicoesAtivas.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Nenhuma condição registrada.</p>
                ) : (
                  condicoesAtivas.map((cond, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-xl text-xs font-medium text-slate-800 border border-slate-200/60"
                    >
                      <span>{cond}</span>
                      <button
                        type="button"
                        onClick={() => removerCondicao(idx)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Alergias */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">
                Alergias Conocidas
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={novaAlergia}
                  onChange={(e) => setNovaAlergia(e.target.value)}
                  placeholder="Ex: Dipirona, Penicilina, Picada de abelha..."
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      adicionarAlergia();
                    }
                  }}
                />
                <Botao
                  type="button"
                  variante="secundario"
                  tamanho="sm"
                  onClick={adicionarAlergia}
                  icone={<Plus className="w-4 h-4" />}
                >
                  Adicionar
                </Botao>
              </div>

              <div className="space-y-2">
                {alergias.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Nenhuma alergia registrada.</p>
                ) : (
                  alergias.map((alg, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-amber-50/60 px-3 py-2 rounded-xl text-xs font-medium text-amber-900 border border-amber-200/60"
                    >
                      <span>{alg}</span>
                      <button
                        type="button"
                        onClick={() => removerAlergia(idx)}
                        className="text-amber-400 hover:text-rose-600 transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Contatos de Emergência */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
            3. Contatos de Emergência
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <input
              type="text"
              placeholder="Nome *"
              value={novoContatoNome}
              onChange={(e) => setNovoContatoNome(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-xl text-xs"
            />
            <input
              type="text"
              placeholder="Telefone *"
              value={novoContatoTel}
              onChange={(e) => setNovoContatoTel(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-xl text-xs"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Relação / Papel (Ex: Mãe)"
                value={novoContatoPapel}
                onChange={(e) => setNovoContatoPapel(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs"
              />
              <Botao
                type="button"
                variante="secundario"
                tamanho="sm"
                onClick={adicionarContato}
                icone={<Plus className="w-4 h-4" />}
              >
                Add
              </Botao>
            </div>
          </div>

          <div className="space-y-2">
            {contatosEmergencia.map((ct, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-white px-3 py-2 rounded-xl text-xs border border-slate-200 shadow-2xs"
              >
                <div>
                  <span className="font-bold text-slate-900">{ct.nome}</span> —{' '}
                  <span className="text-slate-700">{ct.telefone}</span>
                  {ct.papel && <span className="text-slate-500 font-medium"> ({ct.papel})</span>}
                </div>
                <button
                  type="button"
                  onClick={() => removerContato(idx)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Médicos & Especialistas de Referência */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
            4. Médicos & Especialistas de Referência
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <input
              type="text"
              placeholder="Nome *"
              value={novoEspNome}
              onChange={(e) => setNovoEspNome(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-xl text-xs"
            />
            <input
              type="text"
              placeholder="Especialidade *"
              value={novoEspEspecialidade}
              onChange={(e) => setNovoEspEspecialidade(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-xl text-xs"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Contato (Telefone / Clínica)"
                value={novoEspContato}
                onChange={(e) => setNovoEspContato(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs"
              />
              <Botao
                type="button"
                variante="secundario"
                tamanho="sm"
                onClick={adicionarEspecialista}
                icone={<Plus className="w-4 h-4" />}
              >
                Add
              </Botao>
            </div>
          </div>

          <div className="space-y-2">
            {especialistas.map((esp, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-white px-3 py-2 rounded-xl text-xs border border-slate-200 shadow-2xs"
              >
                <div>
                  <span className="font-bold text-slate-900">{esp.nome}</span> —{' '}
                  <span className="text-teal-700 font-medium">{esp.especialidade}</span>
                  {esp.contato && <span className="text-slate-500 font-medium"> ({esp.contato})</span>}
                </div>
                <button
                  type="button"
                  onClick={() => removerEspecialista(idx)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Rodapé com Ações de Salvamento */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
          <Botao
            type="button"
            variante="secundario"
            onClick={onCancelar}
            disabled={salvando}
          >
            Cancelar
          </Botao>
          <Botao
            type="submit"
            variante="primario"
            carregando={salvando}
            icone={<Save className="w-4 h-4" />}
          >
            Salvar Ficha Clínica
          </Botao>
        </div>
      </Card>
    </form>
  );
};
