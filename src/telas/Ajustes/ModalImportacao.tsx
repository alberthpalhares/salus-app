import React from 'react';
import { Botao } from '../../componentes/ui/Botao';
import { Upload, X, AlertTriangle, RefreshCw } from 'lucide-react';
import { ResumoImportacao } from '../../servicos/portabilidade';

interface ModalImportacaoProps {
  resumo: ResumoImportacao;
  modoImport: 'substituir' | 'mesclar';
  setModoImport: (modo: 'substituir' | 'mesclar') => void;
  executandoImport: boolean;
  progressoImport: string;
  onConfirmar: () => void;
  onFechar: () => void;
}

export const ModalImportacao: React.FC<ModalImportacaoProps> = ({
  resumo,
  modoImport,
  setModoImport,
  executandoImport,
  progressoImport,
  onConfirmar,
  onFechar,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-teal-600" />
            <h3 className="font-extrabold text-slate-900 text-lg">Resumo do Backup Encontrado</h3>
          </div>
          {!executandoImport && (
            <button onClick={onFechar} className="text-slate-400 hover:text-slate-600 p-1">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 space-y-1">
          <p className="font-bold">Família: {resumo.nomeFamilia}</p>
          <p>
            Formato do backup:{' '}
            {resumo.temBackupJson
              ? 'Fiel (salus-app-backup.json)'
              : 'Framework Salus (Familia/_index.yaml e Markdowns)'}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <span className="block font-extrabold text-slate-800 text-base">{resumo.membrosCount}</span>
            <span className="text-slate-500">Membros</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <span className="block font-extrabold text-slate-800 text-base">{resumo.medicamentosCount}</span>
            <span className="text-slate-500">Medicamentos</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <span className="block font-extrabold text-slate-800 text-base">{resumo.examesCount}</span>
            <span className="text-slate-500">Exames</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <span className="block font-extrabold text-slate-800 text-base">{resumo.vacinasCount}</span>
            <span className="text-slate-500">Vacinas</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <span className="block font-extrabold text-slate-800 text-base">{resumo.checkupsCount}</span>
            <span className="text-slate-500">Check-ups</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <span className="block font-extrabold text-slate-800 text-base">{resumo.arquivosDocumentosNoZipCount}</span>
            <span className="text-slate-500">Arquivos p/ Drive</span>
          </div>
        </div>

        {resumo.itensNaoInterpretados.length > 0 && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-1">
            <p className="font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Itens não interpretados automaticamente:</span>
            </p>
            <ul className="list-disc list-inside text-[11px] text-amber-700 space-y-0.5">
              {resumo.itensNaoInterpretados.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-2 pt-2">
          <label className="block text-xs font-bold text-slate-800">Modo de Importação:</label>
          <div className="space-y-2">
            <label className="flex items-start gap-2 text-xs text-slate-700 p-2.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
              <input
                type="radio"
                name="modoImport"
                value="substituir"
                checked={modoImport === 'substituir'}
                onChange={() => setModoImport('substituir')}
                className="mt-0.5 accent-teal-600"
              />
              <div>
                <span className="font-bold text-slate-900 block">Substituir tudo</span>
                <span className="text-slate-500 text-[11px]">
                  Apaga os dados atuais do perfil do Firestore antes de gravar os dados deste backup.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2 text-xs text-slate-700 p-2.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
              <input
                type="radio"
                name="modoImport"
                value="mesclar"
                checked={modoImport === 'mesclar'}
                onChange={() => setModoImport('mesclar')}
                className="mt-0.5 accent-teal-600"
              />
              <div>
                <span className="font-bold text-slate-900 block">Mesclar</span>
                <span className="text-slate-500 text-[11px]">
                  Combina os novos membros e dados do backup com os dados existentes no seu Firestore.
                </span>
              </div>
            </label>
          </div>
        </div>

        {executandoImport ? (
          <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-center space-y-2">
            <RefreshCw className="w-6 h-6 text-teal-600 animate-spin mx-auto" />
            <p className="text-xs font-bold text-teal-900">{progressoImport}</p>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <Botao variante="outline" tamanho="sm" onClick={onFechar}>
              Cancelar
            </Botao>
            <Botao variante="primario" tamanho="sm" onClick={onConfirmar}>
              Confirmar Importação
            </Botao>
          </div>
        )}
      </div>
    </div>
  );
};
