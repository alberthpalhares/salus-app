import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  linhas?: number;
  altura?: string;
  largura?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  linhas = 1,
  altura = 'h-4',
  largura = 'w-full',
  className,
  ...props
}) => {
  return (
    <div className="space-y-2.5 w-full">
      {Array.from({ length: linhas }).map((_, idx) => (
        <div
          key={idx}
          className={cn(
            'animate-pulse bg-slate-200 dark:bg-slate-800 rounded-xl',
            altura,
            largura,
            className
          )}
          {...props}
        />
      ))}
    </div>
  );
};
