import React, { useState } from 'react';
import { Campo } from '../../componentes/ui/Campo';
import { Botao } from '../../componentes/ui/Botao';
import { AlertTriangle, Download, X } from 'lucide-react';

interface ModalExclusaoContaProps {
  passo: 0 | 1 | 2;
  setPasso: (passo: 0 | 1 | 2) => void;
  onAbrirExport: () => void;
  onConfirmarExclusao: () => void;
  excluindo: boolean;
}

export const ModalExclusaoConta: React.FC<ModalExclusaoContaProps> = ({
  passo,
  setPasso,
  onAbrirExport,
  onConfirmarExclusao,
  excluindo,
}) => {
  const [textoConfirmacao, setTextoConfirmacao] = useState('');

  if (passo === 1) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-red-200 max-w-md w-full p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Recomendação de Backup</h3>
              <p className="text-xs text-slate-500">Atenção antes de excluir seus dados</p>
            </div>
          </div>

          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
            Isso apaga permanentemente todos os seus dados estruturados do Salus App. Seus documentos no Google Drive <strong>NÃO são apagados</strong> — continuam com você, na sua pasta "Salus App". Recomendamos fazer o download do seu backup antes.
          </div>

          <div className="space-y-2 pt-2">
            <Botao
              variante="primario"
              tamanho="md"
              onClick={() => {
                setPasso(0);
                onAbrirExport();
              }}
              icone={<Download className="w-4 h-4" />}
              className="w-full justify-center"
            >
              Exportar agora
            </Botao>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setPasso(2)}
                className="text-xs text-slate-500 hover:text-slate-800 underline font-medium cursor-pointer"
              >
                Continuar sem exportar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-red-200 max-w-md w-full p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-extrabold text-slate-900 text-lg">Confirmação Definitiva</h3>
          </div>
          <button onClick={() => setPasso(0)} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Esta ação é <strong>irreversível</strong>. Todos os membros, exames, vacinas, medicamentos e histórico do Salus App serão apagados permanentemente da sua conta.
        </p>

        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-800">
            Para confirmar, digite a palavra <span className="text-red-700 font-extrabold">APAGAR</span> abaixo:
          </p>
          <Campo
            type="text"
            value={textoConfirmacao}
            onChange={(e) => setTextoConfirmacao(e.target.value)}
            placeholder="Digite APAGAR"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
          <Botao
            variante="outline"
            tamanho="sm"
            onClick={() => {
              setPasso(0);
              setTextoConfirmacao('');
            }}
          >
            Cancelar
          </Botao>
          <Botao
            variante="perigo"
            tamanho="sm"
            onClick={onConfirmarExclusao}
            disabled={textoConfirmacao.trim().toUpperCase() !== 'APAGAR' || excluindo}
          >
            {excluindo ? 'Excluindo conta...' : 'Apagar minha conta e todos os dados'}
          </Botao>
        </div>
      </div>
    </div>
  );
};
