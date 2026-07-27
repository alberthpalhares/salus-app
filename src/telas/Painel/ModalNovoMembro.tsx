import React, { useState } from 'react';
import { Membro, TipoMembro, VinculoMembro } from '../../types/dominio';
import { Card } from '../../componentes/ui/Card';
import { Botao } from '../../componentes/ui/Botao';
import { Campo } from '../../componentes/ui/Campo';
import { X } from 'lucide-react';

interface ModalNovoMembroProps {
  modalAberto: boolean;
  onFechar: () => void;
  onSalvarMembro: (membro: Membro) => Promise<void>;
}

export const ModalNovoMembro: React.FC<ModalNovoMembroProps> = ({
  modalAberto,
  onFechar,
  onSalvarMembro,
}) => {
  const [salvando, setSalvando] = useState(false);
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<TipoMembro>('pessoa');
  const [nascimento, setNascimento] = useState('');
  const [raca, setRaca] = useState('');
  const [vinculo, setVinculo] = useState<VinculoMembro>('biologico');

  if (!modalAberto) return null;

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;
    setSalvando(true);
    try {
      const novoMembro: Membro = {
        id: `membro_${Date.now()}`,
        nome: nome.trim(),
        tipo,
        nascimento: nascimento || undefined,
        vinculo,
        raca: tipo !== 'pessoa' && raca.trim() ? raca.trim() : undefined,
      };
      await onSalvarMembro(novoMembro);
      
      setNome('');
      setTipo('pessoa');
      setNascimento('');
      setRaca('');
      setVinculo('biologico');
      onFechar();
    } catch (err) {
      console.error('Erro ao salvar membro:', err);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onFechar}
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Cadastrar Novo Integrante
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Adicione uma pessoa ou pet à família
              </p>
            </div>
            <button
              type="button"
              onClick={onFechar}
              className="p-2 -mr-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form id="form-novo-membro" onSubmit={handleSalvar} className="flex-1 overflow-y-auto p-6 space-y-5">
            <Campo
              rotulo="Nome do Integrante *"
              placeholder="Ex: Ana Silva, Rex, Mia..."
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              autoFocus
            />

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Tipo *
              </label>
              <select
                className="w-full h-11 px-3.5 py-2 bg-white border border-slate-200 rounded-xl focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none text-slate-900 transition-all text-sm"
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

            {tipo === 'pessoa' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Vínculo Familiar
                </label>
                <select
                  className="w-full h-11 px-3.5 py-2 bg-white border border-slate-200 rounded-xl focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none text-slate-900 transition-all text-sm"
                  value={vinculo}
                  onChange={(e) => setVinculo(e.target.value as VinculoMembro)}
                >
                  <option value="biologico">Biológico</option>
                  <option value="adotivo">Adotivo</option>
                  <option value="enteado">Enteado</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Usado de forma neutra para cruzamento de histórico hereditário.
                </p>
              </div>
            )}

            {tipo !== 'pessoa' && (
              <Campo
                rotulo="Raça (opcional)"
                placeholder="Ex: Poodle, Golden, Siamês, SRD..."
                value={raca}
                onChange={(e) => setRaca(e.target.value)}
              />
            )}
          </form>

          {/* Footer Actions */}
          <div className="p-6 border-t border-slate-200 bg-slate-50/50 flex items-center justify-end gap-3">
            <Botao type="button" variante="secundario" onClick={onFechar}>
              Cancelar
            </Botao>
            <Botao 
              type="submit" 
              form="form-novo-membro" 
              carregando={salvando} 
              disabled={!nome.trim()}
            >
              Salvar Integrante
            </Botao>
          </div>

        </div>
      </div>
    </div>
  );
};
