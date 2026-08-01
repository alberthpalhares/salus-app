import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utilitário de fusão de classes CSS do Tailwind (shadcn/ui standard)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
