import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Card } from '../../componentes/ui/Card';
import { Botao } from '../../componentes/ui/Botao';
import { Key, ExternalLink } from 'lucide-react';
import { AnimacaoEntrada } from '../../componentes/ui/AnimacaoEntrada';

export const SemChaveChatCard: React.FC = () => {
  return (
    <AnimacaoEntrada className="flex-1 flex flex-col items-center justify-center">
      <Card className="flex-1 overflow-y-auto space-y-4 bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 p-8 flex flex-col justify-center items-center text-center max-w-xl">
        <motion.div
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 flex items-center justify-center mb-1 shadow-xs"
        >
          <Key className="w-7 h-7" />
        </motion.div>
        <h3 className="text-lg font-extrabold text-amber-950 dark:text-amber-200">
          Chave do Gemini Não Configurada
        </h3>
        <p className="text-sm text-amber-800 dark:text-amber-300/90 max-w-md leading-relaxed">
          Para conversar com o Assistente SISAFAM sobre a saúde da sua família, você precisa cadastrar
          sua própria chave de API gratuita do Google Gemini em <strong>Ajustes</strong>.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <Link to="/ajustes">
            <Botao variante="primario" icone={<Key className="w-4 h-4" />}>
              Cadastrar Chave em Ajustes
            </Botao>
          </Link>
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-amber-800 dark:text-amber-300 underline hover:text-amber-950 dark:hover:text-amber-100 inline-flex items-center gap-1 font-semibold"
          >
            Obter chave no AI Studio <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </Card>
    </AnimacaoEntrada>
  );
};
