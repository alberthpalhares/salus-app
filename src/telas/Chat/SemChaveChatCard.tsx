import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../componentes/ui/Card';
import { Botao } from '../../componentes/ui/Botao';
import { Key, ExternalLink } from 'lucide-react';

export const SemChaveChatCard: React.FC = () => {
  return (
    <Card className="flex-1 overflow-y-auto space-y-4 bg-amber-50/60 border-amber-200 p-8 flex flex-col justify-center items-center text-center">
      <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-1">
        <Key className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-amber-900">
        Chave do Gemini Não Configurada
      </h3>
      <p className="text-sm text-amber-800 max-w-md">
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
          className="text-xs text-amber-800 underline hover:text-amber-950 inline-flex items-center gap-1"
        >
          Obter chave no AI Studio <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </Card>
  );
};
