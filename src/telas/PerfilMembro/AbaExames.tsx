import React, { useState } from 'react';
import { Exame } from '../../types/dominio';
import { Botao } from '../../componentes/ui/Botao';
import { EstadoVazio } from '../../componentes/ui/EstadoVazio';
import { Activity, Plus, FileSpreadsheet } from 'lucide-react';
import { CardPainelExames } from './Exames/CardPainelExames';
import { ModalNovoExame } from './Exames/ModalNovoExame';

interface AbaExamesProps {
  exames: Exame[];
  onSalvarExame: (exame: Exame) => Promise<void>;
}

export const AbaExames: React.FC<AbaExamesProps> = ({ exames, onSalvarExame }) => {
  const [modalNovoAberto, setModalNovoAberto] = useState(false);

  // Group exams by panel
  const paineisMap: Record<string, Exame[]> = {};
  exames.forEach((ex) => {
    const nomePainel = ex.painel?.trim() || 'Outros Exames';
    if (!paineisMap[nomePainel]) {
      paineisMap[nomePainel] = [];
    }
    paineisMap[nomePainel].push(ex);
  });

  // Sort each group by date descending
  Object.keys(paineisMap).forEach((p) => {
    paineisMap[p].sort((a, b) => (b.data || '').localeCompare(a.data || ''));
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600" />
            Exames e Marcadores
          </h2>
          <p className="text-xs text-slate-500">
            Resultados de laboratório agrupados por painel e ordenados por data.
          </p>
        </div>

        <Botao
          variante="primario"
          tamanho="sm"
          icone={<Plus className="w-4 h-4" />}
          onClick={() => setModalNovoAberto(true)}
        >
          Adicionar Exame
        </Botao>
      </div>

      {exames.length === 0 ? (
        <EstadoVazio
          titulo="Nenhum exame cadastrado"
          descricao="Acompanhe valores de hemograma, perfil lipídico e exames de sangue do membro organizados em painéis."
          icone={<FileSpreadsheet className="w-8 h-8 text-slate-400" />}
          acao={
            <Botao
              variante="primario"
              tamanho="sm"
              icone={<Plus className="w-4 h-4" />}
              onClick={() => setModalNovoAberto(true)}
            >
              Adicionar Primeiro Exame
            </Botao>
          }
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(paineisMap).map(([nomePainel, listaExames]) => (
            <CardPainelExames
              key={nomePainel}
              nomePainel={nomePainel}
              listaExames={listaExames}
            />
          ))}
        </div>
      )}

      <ModalNovoExame
        modalAberto={modalNovoAberto}
        onFechar={() => setModalNovoAberto(false)}
        onSalvarExame={onSalvarExame}
      />
    </div>
  );
};
