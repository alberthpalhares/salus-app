import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  comBorda?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  destaque?: 'nenhum' | 'teal' | 'amber' | 'perigo';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, comBorda = true, padding = 'md', destaque = 'nenhum', className, ...props }, ref) => {
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
        ref={ref}
        className={cn(
          'rounded-2xl transition-all duration-200 shadow-2xs hover:shadow-xs',
          comBorda && 'border',
          destaques[destaque],
          paddings[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-lg font-bold tracking-tight text-slate-900', className)} {...props} />
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-xs text-slate-500 leading-relaxed', className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';
