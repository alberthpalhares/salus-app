import React, { useState, useEffect } from 'react';
import { Membro, TipoMembro, VinculoMembro } from '../../types/dominio';
import { Botao } from '../../componentes/ui/Botao';
import { Campo } from '../../componentes/ui/Campo';
import { AVATARES_PRESETS } from '../../componentes/ui/AvatarMembro';
import { X, Trash2 } from 'lucide-react';

interface ModalEditarMembroProps {
  membro: Membro | null;
  onFechar: () => void;
  onSalvar: (membroAtualizado: Membro) => Promise<void>;
  onExcluir: (membroId: string) => Promise<void>;
}

export const ModalEditarMembro: React.FC<ModalEditarMembroProps> = ({
  membro,
  onFechar,
  onSalvar,
  onExcluir,
}) => {
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);

  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<TipoMembro>('pessoa');
  const [nascimento, setNascimento] = useState('');
  const [raca, setRaca] = useState('');
  const [vinculo, setVinculo] = useState<VinculoMembro>('biologico');
  const [avatarId, setAvatarId] = useState<string>('');
  const [tipoSanguineo, setTipoSanguineo] = useState<string>('');

  useEffect(() => {
    if (membro) {
      setNome(membro.nome || '');
      setTipo(membro.tipo || (membro.especie === 'Cão' ? 'cao' : membro.especie === 'Gato' ? 'gato' : 'pessoa'));
      setNascimento(membro.nascimento || membro.data_nascimento || '');
      setRaca(membro.raca || '');
      setVinculo(membro.vinculo || 'biologico');
      setAvatarId(membro.avatar_id || '');
      setTipoSanguineo(membro.tipo_sanguineo || '');
      setConfirmarExclusao(false);
    }
  }, [membro]);

  if (!membro) return null;

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;
    setSalvando(true);
    try {
      const membroAtualizado: Membro = {
        ...membro,
        nome: nome.trim(),
        tipo,
        avatar_id: avatarId || undefined,
        nascimento: nascimento || undefined,
        vinculo,
        tipo_sanguineo: tipoSanguineo || undefined,
        raca: tipo !== 'pessoa' && raca.trim() ? raca.trim() : undefined,
      };
      await onSalvar(membroAtualizado);
      onFechar();
    } catch (err) {
      console.error('Erro ao editar membro:', err);
    } finally {
      setSalvando(false);
    }
  };

  const handleExcluir = async () => {
    if (!confirmarExclusao) {
      setConfirmarExclusao(true);
      return;
    }
    setExcluindo(true);
    try {
      await onExcluir(membro.id);
      onFechar();
    } catch (err) {
      console.error('Erro ao excluir membro:', err);
    } finally {
      setExcluindo(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onFechar} />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200">
          
          <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Editar Integrante</h3>
              <p className="text-xs text-slate-500 mt-0.5">Atualize dados e avatar do perfil</p>
            </div>
            <button
              type="button"
              onClick={onFechar}
              className="p-2 -mr-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form id="form-editar-membro" onSubmit={handleSalvar} className="flex-1 overflow-y-auto p-6 space-y-5">
            <Campo
              rotulo="Nome do Integrante *"
              placeholder="Ex: Ana Silva, Rex, Mia..."
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Tipo *</label>
              <select
                className="w-full h-11 px-3.5 py-2 bg-white border border-slate-200 rounded-xl focus:border-teal-500 text-slate-900 text-sm"
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TipoMembro)}
              >
                <option value="pessoa">Pessoa</option>
                <option value="cao">Cão 🐶</option>
                <option value="gato">Gato 🐱</option>
                <option value="outro">Outro Pet 🐾</option>
              </select>
            </div>

            <Campo
              rotulo="Data de Nascimento"
              type="date"
              value={nascimento}
              onChange={(e) => setNascimento(e.target.value)}
            />

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Avatar Ilustrado</label>
              <div className="grid grid-cols-4 gap-2">
                {AVATARES_PRESETS.filter((a) => (tipo === 'pessoa' ? a.tipo === 'pessoa' : a.tipo !== 'pessoa')).map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setAvatarId(a.id)}
                    className={`p-2 rounded-xl border text-center text-xl transition-all cursor-pointer ${
                      avatarId === a.id ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-500/20' : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    {a.emoji}
                  </button>
                ))}
              </div>
            </div>

            {tipo === 'pessoa' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Tipo Sanguíneo</label>
                <select
                  className="w-full h-11 px-3.5 py-2 bg-white border border-slate-200 rounded-xl focus:border-teal-500 text-slate-900 text-sm"
                  value={tipoSanguineo}
                  onChange={(e) => setTipoSanguineo(e.target.value)}
                >
                  <option value="">Não informado</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            )}

            {tipo === 'pessoa' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Vínculo Familiar</label>
                <select
                  className="w-full h-11 px-3.5 py-2 bg-white border border-slate-200 rounded-xl focus:border-teal-500 text-slate-900 text-sm"
                  value={vinculo}
                  onChange={(e) => setVinculo(e.target.value as VinculoMembro)}
                >
                  <option value="biologico">Biológico</option>
                  <option value="adotivo">Adotivo</option>
                  <option value="enteado">Enteado</option>
                </select>
              </div>
            )}

            {tipo !== 'pessoa' && (
              <Campo
                rotulo="Raça (opcional)"
                placeholder="Ex: Poodle, Golden, Siamês..."
                value={raca}
                onChange={(e) => setRaca(e.target.value)}
              />
            )}
          </form>

          <div className="p-6 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3">
            <Botao
              type="button"
              variante="outline"
              onClick={handleExcluir}
              disabled={excluindo}
              className="border-red-200 text-red-700 hover:bg-red-50"
              icone={<Trash2 className="w-4 h-4 text-red-600" />}
            >
              {confirmarExclusao ? 'Confirmar Exclusão?' : 'Excluir'}
            </Botao>

            <div className="flex items-center gap-2">
              <Botao type="button" variante="secundario" onClick={onFechar}>Cancelar</Botao>
              <Botao type="submit" form="form-editar-membro" carregando={salvando} disabled={!nome.trim()}>
                Salvar Alterações
              </Botao>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
