import * as React from "react";
import { cn } from "@/lib/utils";

export interface LogoProps extends React.SVGProps<SVGSVGElement> {
  variant?: "full" | "icon" | "wordmark";
  size?: "sm" | "md" | "lg" | "xl";
}

export function SisafamLogo({
  variant = "full",
  size = "md",
  className,
  ...props
}: LogoProps) {
  const sizeClasses = {
    sm: "h-6",
    md: "h-9",
    lg: "h-12",
    xl: "h-16",
  };

  const iconOnly = variant === "icon";

  return (
    <div className={cn("inline-flex items-center gap-3 select-none", className)}>
      {/* Emblem SVG Icon */}
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("w-auto aspect-square transition-transform hover:scale-105", sizeClasses[size])}
        {...props}
      >
        <defs>
          <linearGradient id="sisafam-teal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#14B8A6" />
            <stop offset="100%" stopColor="#0D9488" />
          </linearGradient>
          <linearGradient id="sisafam-coral-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FB7185" />
            <stop offset="100%" stopColor="#F43F5E" />
          </linearGradient>
        </defs>

        {/* Shield Contour */}
        <path
          d="M100 20 C140 20 170 35 170 80 C170 135 100 175 100 175 C100 175 30 135 30 80 C30 35 60 20 100 20 Z"
          fill="url(#sisafam-teal-grad)"
          opacity="0.12"
        />
        <path
          d="M100 25 C135 25 162 38 162 78 C162 128 100 165 100 165 C100 165 38 128 38 78 C38 38 65 25 100 25 Z"
          stroke="url(#sisafam-teal-grad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Vital Heart & Medical Pulse Hybrid */}
        <path
          d="M75 75 C65 62 48 68 48 84 C48 105 75 125 100 142 C125 125 152 105 152 84 C152 68 135 62 125 75 C118 82 107 88 100 88 C93 88 82 82 75 75 Z"
          fill="url(#sisafam-coral-grad)"
        />

        {/* Pet Paw Print Dot Accent */}
        <circle cx="100" cy="55" r="10" fill="url(#sisafam-teal-grad)" />
        <circle cx="80" cy="60" r="6" fill="url(#sisafam-teal-grad)" />
        <circle cx="120" cy="60" r="6" fill="url(#sisafam-teal-grad)" />
      </svg>

      {/* Wordmark Text */}
      {!iconOnly && (
        <div className="flex flex-col">
          <span className="font-extrabold tracking-tight text-slate-900 dark:text-slate-100 text-xl leading-none">
            SISA<span className="text-primary">FAM</span>
          </span>
          <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase mt-0.5">
            Saúde da Família
          </span>
        </div>
      )}
    </div>
  );
}
