import React from 'react';
import { Membro } from '../../types/dominio';
import { Card } from '../../componentes/ui/Card';
import { Badge } from '../../componentes/ui/Badge';
import { Botao } from '../../componentes/ui/Botao';
import { calcularIdade } from '../../lib/datas';
import { ArrowLeft, User, Dog, Cat, Heart, AlertTriangle } from 'lucide-react';

interface CabecalhoMembroProps {
  membro: Membro;
  onVoltar: () => void;
}

export const CabecalhoMembro: React.FC<CabecalhoMembroProps> = ({ membro, onVoltar }) => {
  const idadeTexto = calcularIdade(membro.nascimento || membro.data_nascimento);

  // Ícone por tipo do membro
  const renderIconeTipo = () => {
    const tipo = (membro.tipo || membro.especie || 'pessoa').toString().toLowerCase();
    if (tipo.includes('cão') || tipo.includes('cao') || tipo === 'dog') {
      return <Dog className="w-8 h-8 text-amber-700" />;
    }
    if (tipo.includes('gato') || tipo === 'cat') {
      return <Cat className="w-8 h-8 text-indigo-700" />;
    }
    if (tipo === 'outro') {
      return <Heart className="w-8 h-8 text-teal-700" />;
    }
    return <User className="w-8 h-8 text-teal-700" />;
  };

  const formatarTipoLabel = () => {
    const tipo = (membro.tipo || membro.especie || 'pessoa').toString().toLowerCase();
    if (tipo.includes('cão') || tipo.includes('cao')) return 'Cão';
    if (tipo.includes('gato')) return 'Gato';
    if (tipo === 'outro') return 'Anatomia / Pet';
    return 'Pessoa';
  };

  const eAnimal = () => {
    const tipo = (membro.tipo || membro.especie || 'pessoa').toString().toLowerCase();
    return tipo.includes('cão') || tipo.includes('cao') || tipo.includes('gato') || tipo === 'outro';
  };

  return (
    <div className="space-y-4">
      {/* Botão de Voltar */}
      <div>
        <Botao
          variante="ghost"
          tamanho="sm"
          icone={<ArrowLeft className="w-4 h-4" />}
          onClick={onVoltar}
        >
          Voltar para lista
        </Botao>
      </div>

      {/* Cartão Principal do Cabeçalho */}
      <Card className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-linear-to-r from-white via-teal-50/20 to-white">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-100/80 border border-teal-200 flex items-center justify-center shrink-0 shadow-xs">
            {renderIconeTipo()}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {membro.nome}
              </h1>
              <Badge variante="teal" tamanho="sm">
                {formatarTipoLabel()}
              </Badge>
              {eAnimal() && membro.raca && (
                <Badge variante="neutro" tamanho="sm">
                  {membro.raca}
                </Badge>
              )}
            </div>

            <p className="text-sm font-medium text-slate-600 flex flex-wrap items-center gap-2">
              <span>{idadeTexto}</span>
              {(membro.nascimento || membro.data_nascimento) && (
                <span className="text-slate-400 text-xs">
                  (Nasc. {membro.nascimento || membro.data_nascimento})
                </span>
              )}
            </p>

            {/* Destaque discreto de alergias */}
            {membro.alergias && membro.alergias.length > 0 && (
              <div className="pt-1.5 flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold text-amber-800/90 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  Alergias:
                </span>
                {membro.alergias.map((alergia, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center text-xs px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200/80 font-medium"
                  >
                    {alergia}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
