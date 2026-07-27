import React, { useRef } from 'react';
import { Card } from '../../componentes/ui/Card';
import { Botao } from '../../componentes/ui/Botao';
import { useAuth } from '../../auth/AuthProvider';
import { Download, Upload, CheckCircle2 } from 'lucide-react';

interface SecaoPortabilidadeProps {
  onAbrirExport: () => void;
  onSelecionarImportFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  analisandoImport: boolean;
}

export const SecaoPortabilidade: React.FC<SecaoPortabilidadeProps> = ({
  onAbrirExport,
  onSelecionarImportFile,
  analisandoImport,
}) => {
  const { userConfig } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Card>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
          <Download className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800">Portabilidade dos Dados</h3>
          <p className="text-xs text-slate-500">
            Seus dados pertencem a você. Exporte uma cópia completa em formato .ZIP ou importe um backup a qualquer momento.
          </p>
        </div>
      </div>

      {userConfig.ultimo_export && (
        <div className="mb-4 text-xs text-slate-500 flex items-center gap-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>
            Último export realizado em: <strong>{new Date(userConfig.ultimo_export).toLocaleString('pt-BR')}</strong>
          </span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Botao
          variante="primario"
          tamanho="sm"
          onClick={onAbrirExport}
          icone={<Download className="w-4 h-4" />}
        >
          Exportar meus dados
        </Botao>

        <Botao
          variante="outline"
          tamanho="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={analisandoImport}
          icone={<Upload className="w-4 h-4" />}
        >
          {analisandoImport ? 'Analisando arquivo ZIP...' : 'Importar backup (.ZIP)'}
        </Botao>

        <input
          type="file"
          ref={fileInputRef}
          onChange={onSelecionarImportFile}
          accept=".zip"
          className="hidden"
        />
      </div>
    </Card>
  );
};
