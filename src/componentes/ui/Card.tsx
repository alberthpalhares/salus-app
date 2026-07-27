import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  comBorda?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  destaque?: 'nenhum' | 'teal' | 'amber' | 'perigo';
}

export const Card: React.FC<CardProps> = ({
  children,
  comBorda = true,
  padding = 'md',
  destaque = 'nenhum',
  className = '',
  ...props
}) => {
  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const destaques = {
    nenhum: 'border-slate-200/80 bg-white',
    teal: 'border-teal-200 bg-teal-50/40',
    amber: 'border-amber-200 bg-amber-50/40',
    perigo: 'border-rose-200 bg-rose-50/40',
  };

  return (
    <div
      className={`rounded-2xl transition-shadow ${paddings[padding]} ${
        comBorda ? 'border' : ''
      } ${destaques[destaque]} shadow-xs hover:shadow-md ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
