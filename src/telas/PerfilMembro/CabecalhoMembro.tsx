import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Membro } from '../../types/dominio';
import { Card } from '../../componentes/ui/Card';
import { Badge } from '../../componentes/ui/Badge';
import { Botao } from '../../componentes/ui/Botao';
import { AvatarMembro } from '../../componentes/ui/AvatarMembro';
import { ModalCompartilharFicha } from '../../componentes/saude/ModalCompartilharFicha';
import { calcularIdade } from '../../lib/datas';
import { ArrowLeft, Share2, AlertTriangle, ClipboardPlus } from 'lucide-react';

interface CabecalhoMembroProps {
  membro: Membro;
  onVoltar: () => void;
}

export const CabecalhoMembro: React.FC<CabecalhoMembroProps> = ({ membro, onVoltar }) => {
  const navigate = useNavigate();
  const [modalCompartilharAberto, setModalCompartilharAberto] = useState(false);
  const idadeTexto = calcularIdade(membro.nascimento || membro.data_nascimento);

  const formatarTipoLabel = () => {
    const tipo = (membro.tipo || membro.especie || 'pessoa').toString().toLowerCase();
    if (tipo.includes('cão') || tipo.includes('cao')) return 'Cão';
    if (tipo.includes('gato')) return 'Gato';
    if (tipo === 'outro') return 'Pet';
    return 'Pessoa';
  };

  const eAnimal = () => {
    const tipo = (membro.tipo || membro.especie || 'pessoa').toString().toLowerCase();
    return tipo.includes('cão') || tipo.includes('cao') || tipo.includes('gato') || tipo === 'outro';
  };

  return (
    <div className="space-y-4">
      {/* Botão de Voltar & Ações Rápidas */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Botao
          variante="ghost"
          tamanho="sm"
          icone={<ArrowLeft className="w-4 h-4" />}
          onClick={onVoltar}
        >
          Voltar para lista
        </Botao>

        <div className="flex items-center gap-2">
          <Botao
            variante="secundario"
            tamanho="sm"
            icone={<ClipboardPlus className="w-4 h-4 text-teal-600 dark:text-teal-400" />}
            onClick={() => navigate(`/preparar-consulta?membro=${membro.id}`)}
          >
            Preparar Consulta
          </Botao>
          <Botao
            variante="primario"
            tamanho="sm"
            icone={<Share2 className="w-4 h-4" />}
            onClick={() => setModalCompartilharAberto(true)}
          >
            Compartilhar Ficha
          </Botao>
        </div>
      </div>

      {/* Cartão Principal do Cabeçalho com Avatar Lúdico */}
      <Card className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-white via-teal-50/30 to-white dark:from-slate-900 dark:via-slate-900/60 dark:to-slate-900">
        <div className="flex items-start sm:items-center gap-4">
          <AvatarMembro membro={membro} tamanho="xl" />

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                {membro.nome}
              </h1>
              <Badge variante="teal" tamanho="sm">
                {formatarTipoLabel()}
              </Badge>
              {membro.tipo_sanguineo && (
                <Badge variante="rose" tamanho="sm">
                  {membro.tipo_sanguineo}
                </Badge>
              )}
              {eAnimal() && membro.raca && (
                <Badge variante="neutro" tamanho="sm">
                  {membro.raca}
                </Badge>
              )}
            </div>

            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 flex flex-wrap items-center gap-2">
              <span>{idadeTexto}</span>
              {(membro.nascimento || membro.data_nascimento) && (
                <span className="text-slate-400 dark:text-slate-500 text-xs">
                  (Nasc. {membro.nascimento || membro.data_nascimento})
                </span>
              )}
            </p>

            {/* Destaque discreto de alergias */}
            {membro.alergias && membro.alergias.length > 0 && (
              <div className="pt-1.5 flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  Alergias:
                </span>
                {membro.alergias.map((alergia, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center text-xs px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-200/80 dark:border-amber-800 font-medium"
                  >
                    {alergia}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      {modalCompartilharAberto && (
        <ModalCompartilharFicha membro={membro} onFechar={() => setModalCompartilharAberto(false)} />
      )}
    </div>
  );
};
