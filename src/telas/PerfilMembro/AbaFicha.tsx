import React, { useState } from 'react';
import { Membro } from '../../types/dominio';
import { VisualizacaoFicha } from './Ficha/VisualizacaoFicha';
import { FormularioEdicaoFicha } from './Ficha/FormularioEdicaoFicha';

interface AbaFichaProps {
  membro: Membro;
  onSalvarMembro: (membroAtualizado: Membro) => Promise<void>;
}

export const AbaFicha: React.FC<AbaFichaProps> = ({ membro, onSalvarMembro }) => {
  const [modoEdicao, setModoEdicao] = useState(false);

  if (modoEdicao) {
    return (
      <FormularioEdicaoFicha
        membro={membro}
        onSalvarMembro={onSalvarMembro}
        onCancelar={() => setModoEdicao(false)}
      />
    );
  }

  return (
    <VisualizacaoFicha
      membro={membro}
      onIniciarEdicao={() => setModoEdicao(true)}
    />
  );
};
