import React from 'react';

export interface SkeletonProps {
  className?: string;
  linhas?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = 'h-4 w-full', linhas = 1 }) => {
  if (linhas > 1) {
    return (
      <div className="space-y-2 w-full animate-pulse">
        {Array.from({ length: linhas }).map((_, i) => (
          <div
            key={i}
            className={`bg-slate-200 rounded-lg ${
              i === linhas - 1 ? 'w-3/4' : 'w-full'
            } ${className}`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`bg-slate-200 rounded-lg animate-pulse ${className}`} />
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-xs animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-200" />
          <div className="space-y-1.5">
            <div className="h-4 w-32 bg-slate-200 rounded-md" />
            <div className="h-3 w-24 bg-slate-200 rounded-md" />
          </div>
        </div>
        <div className="h-6 w-16 bg-slate-200 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full bg-slate-200 rounded-md" />
        <div className="h-3 w-4/5 bg-slate-200 rounded-md" />
      </div>
    </div>
  );
};
