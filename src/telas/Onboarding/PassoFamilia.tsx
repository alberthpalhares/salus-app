import React from 'react';
import { Card } from '../../componentes/ui/Card';
import { Botao } from '../../componentes/ui/Botao';
import { Campo } from '../../componentes/ui/Campo';
import {
  Users,
  Dog,
  Cat,
  PawPrint,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
} from 'lucide-react';
import { TipoMembro, VinculoMembro } from '../../types/dominio';

export interface MembroFormState {
  id: string;
  nome: string;
  tipo: TipoMembro;
  nascimento: string;
  raca: string;
  vinculo: VinculoMembro;
}

interface PassoFamiliaProps {
  nomeFamilia: string;
  setNomeFamilia: (nome: string) => void;
  membros: MembroFormState[];
  adicionarMembro: () => void;
  removerMembro: (id: string) => void;
  atualizarMembro: (id: string, campo: keyof MembroFormState, valor: unknown) => void;
  onAvancar: () => void;
  onVoltar: () => void;
}

export const PassoFamilia: React.FC<PassoFamiliaProps> = ({
  nomeFamilia,
  setNomeFamilia,
  membros,
  adicionarMembro,
  removerMembro,
  atualizarMembro,
  onAvancar,
  onVoltar,
}) => {
  return (
    <Card className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Nome da Família e Integrantes
          </h2>
          <p className="text-xs text-slate-500">
            Adicione quem faz parte da sua casa (pessoas e animais de estimação).
          </p>
        </div>
      </div>

      <Campo
        rotulo="Nome da Família"
        value={nomeFamilia}
        onChange={(e) => setNomeFamilia(e.target.value)}
        placeholder="Ex: Família Silva ou Casa dos Bichos"
        dica="Identificador do núcleo da sua família."
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-slate-800">
            Membros da Família ({membros.length})
          </label>
          <Botao
            variante="secundario"
            tamanho="sm"
            onClick={adicionarMembro}
            icone={<Plus className="w-4 h-4" />}
          >
            Adicionar membro
          </Botao>
        </div>

        <div className="space-y-4">
          {membros.map((m, idx) => (
            <div
              key={m.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4 relative"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                  Integrante #{idx + 1}
                </span>
                {membros.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removerMembro(m.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Remover integrante"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Campo
                  rotulo="Nome"
                  value={m.nome}
                  onChange={(e) => atualizarMembro(m.id, 'nome', e.target.value)}
                  placeholder="Ex: Ana, Carlos, Rex, Mia..."
                />

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tipo de Integrante
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'pessoa', label: 'Pessoa', icon: Users },
                      { id: 'cao', label: 'Cão', icon: Dog },
                      { id: 'gato', label: 'Gato', icon: Cat },
                      { id: 'outro', label: 'Outro', icon: PawPrint },
                    ].map((t) => {
                      const Icone = t.icon;
                      const selecionado = m.tipo === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => atualizarMembro(m.id, 'tipo', t.id as TipoMembro)}
                          className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs font-semibold transition-all ${
                            selecionado
                              ? 'border-teal-600 bg-teal-50 text-teal-800 shadow-2xs'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <Icone className="w-4 h-4 mb-0.5" />
                          <span className="text-[10px]">{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Campo
                  rotulo="Data de Nascimento (Opcional)"
                  type="date"
                  value={m.nascimento}
                  onChange={(e) => atualizarMembro(m.id, 'nascimento', e.target.value)}
                />

                {m.tipo !== 'pessoa' && (
                  <Campo
                    rotulo="Raça (para pets)"
                    value={m.raca}
                    onChange={(e) => atualizarMembro(m.id, 'raca', e.target.value)}
                    placeholder="Ex: Golden Retriever, Persa, SRD..."
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between border-t border-slate-100">
        <Botao
          variante="secundario"
          onClick={onVoltar}
          icone={<ArrowLeft className="w-4 h-4" />}
        >
          Voltar
        </Botao>

        <Botao
          variante="primario"
          disabled={membros.some((m) => !m.nome.trim())}
          onClick={onAvancar}
          icone={<ArrowRight className="w-4 h-4" />}
        >
          Continuar
        </Botao>
      </div>
    </Card>
  );
};
