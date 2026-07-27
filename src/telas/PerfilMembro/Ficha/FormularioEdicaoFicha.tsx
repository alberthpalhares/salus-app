import React, { useState } from 'react';
import { Membro, TipoMembro, ContatoEmergencia, EspecialistaReferencia } from '../../../types/dominio';
import { Card } from '../../../componentes/ui/Card';
import { Botao } from '../../../componentes/ui/Botao';
import { Campo } from '../../../componentes/ui/Campo';
import { Edit3, Save, X, Plus, Trash2 } from 'lucide-react';

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
  const [salvando, setSalvando] = useState(false);

  const [nome, setNome] = useState(membro.nome || '');
  const [tipo, setTipo] = useState<TipoMembro>(membro.tipo || 'pessoa');
  const [nascimento, setNascimento] = useState(membro.nascimento || membro.data_nascimento || '');
  const [raca, setRaca] = useState(membro.raca || '');
  const [tipoSanguineo, setTipoSanguineo] = useState(membro.tipo_sanguineo || '');
  const [planoSaude, setPlanoSaude] = useState(membro.plano_saude || '');
  const [condicoesAtivas, setCondicoesAtivas] = useState<string[]>(
    membro.condicoes_ativas || membro.condicoes || []
  );
  const [alergias, setAlergias] = useState<string[]>(membro.alergias || []);
  const [contatosEmergencia, setContatosEmergencia] = useState<ContatoEmergencia[]>(
    membro.contatos_emergencia || []
  );
  const [especialistas, setEspecialistas] = useState<EspecialistaReferencia[]>(
    membro.especialistas_referencia || []
  );

  const [novaCondicao, setNovaCondicao] = useState('');
  const [novaAlergia, setNovaAlergia] = useState('');

  const [novoContatoNome, setNovoContatoNome] = useState('');
  const [novoContatoTel, setNovoContatoTel] = useState('');
  const [novoContatoPapel, setNovoContatoPapel] = useState('');

  const [novoEspNome, setNovoEspNome] = useState('');
  const [novoEspEspecialidade, setNovoEspEspecialidade] = useState('');
  const [novoEspContato, setNovoEspContato] = useState('');

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    try {
      const membroAtualizado: Membro = {
        ...membro,
        nome: nome.trim(),
        tipo,
        nascimento: nascimento.trim(),
        raca: raca.trim(),
        tipo_sanguineo: tipoSanguineo.trim(),
        plano_saude: planoSaude.trim(),
        condicoes_ativas: condicoesAtivas,
        alergias: alergias,
        contatos_emergencia: contatosEmergencia,
        especialistas_referencia: especialistas,
      };
      await onSalvarMembro(membroAtualizado);
      onCancelar();
    } catch (err) {
      console.error('Erro ao salvar ficha do membro:', err);
    } finally {
      setSalvando(false);
    }
  };

  const adicionarCondicao = () => {
    if (novaCondicao.trim()) {
      setCondicoesAtivas([...condicoesAtivas, novaCondicao.trim()]);
      setNovaCondicao('');
    }
  };

  const removerCondicao = (idx: number) => {
    setCondicoesAtivas(condicoesAtivas.filter((_, i) => i !== idx));
  };

  const adicionarAlergia = () => {
    if (novaAlergia.trim()) {
      setAlergias([...alergias, novaAlergia.trim()]);
      setNovaAlergia('');
    }
  };

  const removerAlergia = (idx: number) => {
    setAlergias(alergias.filter((_, i) => i !== idx));
  };

  const adicionarContato = () => {
    if (novoContatoNome.trim() && novoContatoTel.trim()) {
      setContatosEmergencia([
        ...contatosEmergencia,
        {
          nome: novoContatoNome.trim(),
          telefone: novoContatoTel.trim(),
          papel: novoContatoPapel.trim() || undefined,
        },
      ]);
      setNovoContatoNome('');
      setNovoContatoTel('');
      setNovoContatoPapel('');
    }
  };

  const removerContato = (idx: number) => {
    setContatosEmergencia(contatosEmergencia.filter((_, i) => i !== idx));
  };

  const adicionarEspecialista = () => {
    if (novoEspNome.trim() && novoEspEspecialidade.trim()) {
      setEspecialistas([
        ...especialistas,
        {
          nome: novoEspNome.trim(),
          especialidade: novoEspEspecialidade.trim(),
          contato: novoEspContato.trim() || undefined,
        },
      ]);
      setNovoEspNome('');
      setNovoEspEspecialidade('');
      setNovoEspContato('');
    }
  };

  const removerEspecialista = (idx: number) => {
    setEspecialistas(especialistas.filter((_, i) => i !== idx));
  };

  return (
    <Card>
      <form onSubmit={handleSalvar} className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-teal-600" />
            Editar Ficha Clínica
          </h2>
          <div className="flex items-center gap-2">
            <Botao
              type="button"
              variante="secundario"
              tamanho="sm"
              icone={<X className="w-4 h-4" />}
              onClick={onCancelar}
              disabled={salvando}
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
              Salvar Ficha
            </Botao>
          </div>
        </div>

        {/* Dados Básicos */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Dados Básicos
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Campo
              rotulo="Nome completo / Identificação"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Tipo de membro
              </label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TipoMembro)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 min-h-[44px]"
              >
                <option value="pessoa">Pessoa (Humano)</option>
                <option value="cao">Cão (Dog)</option>
                <option value="gato">Gato (Cat)</option>
                <option value="outro">Outro animal de estimação</option>
              </select>
            </div>

            <Campo
              rotulo="Data de Nascimento"
              type="date"
              value={nascimento}
              onChange={(e) => setNascimento(e.target.value)}
            />

            <Campo
              rotulo="Raça (se animal)"
              placeholder="Ex: Golden Retriever, SRD, Persa..."
              value={raca}
              onChange={(e) => setRaca(e.target.value)}
            />
          </div>
        </div>

        {/* Dados Clínicos Principais */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Dados Clínicos
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Campo
              rotulo="Tipo Sanguíneo"
              placeholder="Ex: A+, O-, DEA 1.1+..."
              value={tipoSanguineo}
              onChange={(e) => setTipoSanguineo(e.target.value)}
            />

            <Campo
              rotulo="Plano de Saúde"
              placeholder="Ex: Unimed, Bradesco, Porto Pet..."
              value={planoSaude}
              onChange={(e) => setPlanoSaude(e.target.value)}
            />
          </div>
        </div>

        {/* Condições Ativas */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Condições Ativas
          </h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {condicoesAtivas.map((cond, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-medium border border-slate-200"
              >
                {cond}
                <button
                  type="button"
                  onClick={() => removerCondicao(i)}
                  className="text-slate-400 hover:text-rose-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Adicionar condição (Ex: Hipertensão, Asma...)"
              value={novaCondicao}
              onChange={(e) => setNovaCondicao(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
            />
            <Botao
              type="button"
              variante="secundario"
              tamanho="sm"
              icone={<Plus className="w-4 h-4" />}
              onClick={adicionarCondicao}
            >
              Adicionar
            </Botao>
          </div>
        </div>

        {/* Alergias */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Alergias</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {alergias.map((alergia, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 rounded-lg text-xs font-medium border border-amber-200"
              >
                {alergia}
                <button
                  type="button"
                  onClick={() => removerAlergia(i)}
                  className="text-amber-600 hover:text-rose-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Adicionar alergia (Ex: Penicilina, Peixe, Dipirona...)"
              value={novaAlergia}
              onChange={(e) => setNovaAlergia(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
            />
            <Botao
              type="button"
              variante="secundario"
              tamanho="sm"
              icone={<Plus className="w-4 h-4" />}
              onClick={adicionarAlergia}
            >
              Adicionar
            </Botao>
          </div>
        </div>

        {/* Contatos de Emergência */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Contatos de Emergência
          </h3>
          {contatosEmergencia.map((contato, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            >
              <div>
                <span className="font-semibold text-slate-900">{contato.nome}</span>
                {contato.papel && (
                  <span className="ml-2 text-xs text-slate-500">({contato.papel})</span>
                )}
                <p className="text-xs text-slate-600">{contato.telefone}</p>
              </div>
              <button
                type="button"
                onClick={() => removerContato(i)}
                className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Nome do contato"
              value={novoContatoNome}
              onChange={(e) => setNovoContatoNome(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-300 rounded-xl"
            />
            <input
              type="text"
              placeholder="Telefone"
              value={novoContatoTel}
              onChange={(e) => setNovoContatoTel(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-300 rounded-xl"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Relação / Papel"
                value={novoContatoPapel}
                onChange={(e) => setNovoContatoPapel(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-xl"
              />
              <Botao
                type="button"
                variante="secundario"
                tamanho="sm"
                icone={<Plus className="w-4 h-4" />}
                onClick={adicionarContato}
              >
                +
              </Botao>
            </div>
          </div>
        </div>

        {/* Especialistas de Referência */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Especialistas de Referência
          </h3>
          {especialistas.map((esp, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            >
              <div>
                <span className="font-semibold text-slate-900">{esp.nome}</span>
                <span className="ml-2 text-xs font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                  {esp.especialidade}
                </span>
                {esp.contato && <p className="text-xs text-slate-600">{esp.contato}</p>}
              </div>
              <button
                type="button"
                onClick={() => removerEspecialista(i)}
                className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Nome do profissional"
              value={novoEspNome}
              onChange={(e) => setNovoEspNome(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-300 rounded-xl"
            />
            <input
              type="text"
              placeholder="Especialidade (Ex: Cardiologia)"
              value={novoEspEspecialidade}
              onChange={(e) => setNovoEspEspecialidade(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-300 rounded-xl"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Contato / Clínica"
                value={novoEspContato}
                onChange={(e) => setNovoEspContato(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-xl"
              />
              <Botao
                type="button"
                variante="secundario"
                tamanho="sm"
                icone={<Plus className="w-4 h-4" />}
                onClick={adicionarEspecialista}
              >
                +
              </Botao>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <Botao type="button" variante="secundario" onClick={onCancelar} disabled={salvando}>
            Cancelar
          </Botao>
          <Botao
            type="submit"
            variante="primario"
            carregando={salvando}
            icone={<Save className="w-4 h-4" />}
          >
            Salvar Alterações na Ficha
          </Botao>
        </div>
      </form>
    </Card>
  );
};
