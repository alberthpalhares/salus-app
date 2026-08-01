import React from 'react';
import { User, Dog, Cat, Bird, Sparkles, Heart } from 'lucide-react';
import { Membro } from '../../types/dominio';

export interface AvatarMembroProps {
  membro?: Partial<Membro>;
  nome?: string;
  tipo?: string;
  avatarId?: string;
  tamanho?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const AVATARES_PRESETS = [
  { id: 'homem_1', label: 'Homem (Casual)', emoji: '👨‍💼', tipo: 'pessoa', bg: 'bg-teal-100 text-teal-800' },
  { id: 'mulher_1', label: 'Mulher (Casual)', emoji: '👩‍💼', tipo: 'pessoa', bg: 'bg-rose-100 text-rose-800' },
  { id: 'menino_1', label: 'Menino', emoji: '👦', tipo: 'pessoa', bg: 'bg-sky-100 text-sky-800' },
  { id: 'menina_1', label: 'Menina', emoji: '👧', tipo: 'pessoa', bg: 'bg-amber-100 text-amber-800' },
  { id: 'vovo_f', label: 'Vovó', emoji: '👵', tipo: 'pessoa', bg: 'bg-purple-100 text-purple-800' },
  { id: 'vovo_m', label: 'Vovô', emoji: '👴', tipo: 'pessoa', bg: 'bg-emerald-100 text-emerald-800' },
  { id: 'cao_happy', label: 'Cãozinho Feliz', emoji: '🐶', tipo: 'cao', bg: 'bg-amber-100 text-amber-800' },
  { id: 'cao_fluffy', label: 'Cão Fofinho', emoji: '🐕', tipo: 'cao', bg: 'bg-orange-100 text-orange-800' },
  { id: 'gato_cute', label: 'Gatinho Fofo', emoji: '🐱', tipo: 'gato', bg: 'bg-indigo-100 text-indigo-800' },
  { id: 'gato_sleepy', label: 'Gato Preguiçoso', emoji: '🐈', tipo: 'gato', bg: 'bg-violet-100 text-violet-800' },
  { id: 'ave_colorful', label: 'Avezinha', emoji: '🦜', tipo: 'outro', bg: 'bg-lime-100 text-lime-800' },
  { id: 'pet_generic', label: 'Pet Amigo', emoji: '🐾', tipo: 'outro', bg: 'bg-pink-100 text-pink-800' },
];

export const AvatarMembro: React.FC<AvatarMembroProps> = ({
  membro,
  nome,
  tipo,
  avatarId,
  tamanho = 'md',
  className = '',
}) => {
  const nomeExibicao = membro?.nome || nome || 'Membro';
  const tipoExibicao = membro?.tipo || membro?.especie || tipo || 'pessoa';
  const selectedAvatarId = membro?.avatar_id || avatarId;

  const preset = AVATARES_PRESETS.find((a) => a.id === selectedAvatarId);

  const tamanhoClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-11 h-11 text-base',
    lg: 'w-16 h-16 text-2xl',
    xl: 'w-24 h-24 text-4xl',
  }[tamanho];

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  }[tamanho];

  const isPet = tipoExibicao === 'cao' || tipoExibicao === 'gato' || tipoExibicao === 'Cão' || tipoExibicao === 'Gato' || tipoExibicao === 'outro';

  const defaultBg = isPet ? 'bg-amber-100 text-amber-900 border-amber-200' : 'bg-teal-100 text-teal-900 border-teal-200';

  const renderIconFallback = () => {
    if (tipoExibicao === 'cao' || tipoExibicao === 'Cão') return <Dog className={iconSizes} />;
    if (tipoExibicao === 'gato' || tipoExibicao === 'Gato') return <Cat className={iconSizes} />;
    if (tipoExibicao === 'outro') return <Bird className={iconSizes} />;
    return <User className={iconSizes} />;
  };

  const inicial = nomeExibicao.charAt(0).toUpperCase();

  return (
    <div
      className={`relative rounded-2xl flex items-center justify-center shrink-0 border shadow-2xs font-extrabold transition-all duration-200 select-none ${
        preset ? `${preset.bg} border-slate-200` : defaultBg
      } ${tamanhoClasses} ${className}`}
      title={`${nomeExibicao} (${tipoExibicao})`}
    >
      {preset ? (
        <span>{preset.emoji}</span>
      ) : (
        <span className="flex items-center justify-center">
          {inicial ? inicial : renderIconFallback()}
        </span>
      )}

      {/* Mini badge indicadora de Pet vs Humano */}
      {tamanho !== 'sm' && (
        <span
          className={`absolute -bottom-1 -right-1 p-0.5 rounded-full border border-white text-[9px] shadow-2xs ${
            isPet ? 'bg-amber-500 text-white' : 'bg-teal-600 text-white'
          }`}
        >
          {isPet ? <Heart className="w-2.5 h-2.5 fill-current" /> : <Sparkles className="w-2.5 h-2.5" />}
        </span>
      )}
    </div>
  );
};
