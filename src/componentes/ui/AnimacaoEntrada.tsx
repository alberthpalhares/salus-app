import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface AnimacaoEntradaProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direcao?: 'up' | 'down' | 'left' | 'right' | 'none';
  duracao?: number;
}

export const AnimacaoEntrada: React.FC<AnimacaoEntradaProps> = ({
  children,
  className,
  delay = 0,
  direcao = 'up',
  duracao = 0.25,
}) => {
  const offsets = {
    up: { y: 12, x: 0 },
    down: { y: -12, x: 0 },
    left: { x: 12, y: 0 },
    right: { x: -12, y: 0 },
    none: { x: 0, y: 0 },
  };

  const initialOffset = offsets[direcao];

  return (
    <motion.div
      initial={{ opacity: 0, ...initialOffset }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, ...initialOffset }}
      transition={{ duration: duracao, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface AnimacaoListaProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const AnimacaoLista: React.FC<AnimacaoListaProps> = ({
  children,
  className,
  staggerDelay = 0.05,
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const AnimacaoItemLista: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const AnimacaoModal: React.FC<{ children: React.ReactNode; isOpen?: boolean; className?: string }> = ({
  children,
  isOpen = true,
  className,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const AnimacaoContador: React.FC<{ valor: number; duracaoMs?: number; prefixo?: string; sufixo?: string; className?: string }> = ({
  valor,
  duracaoMs = 600,
  prefixo = '',
  sufixo = '',
  className,
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duracaoMs, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * valor));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [valor, duracaoMs]);

  return (
    <span className={className}>
      {prefixo}{count}{sufixo}
    </span>
  );
};
