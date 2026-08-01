import React, { useState } from 'react';
import { Membro, ConfiguracaoFichaPublica } from '../../types/dominio';
import { Botao } from '../ui/Botao';
import { Share2, Check, Copy, Printer, QrCode, X, ShieldCheck } from 'lucide-react';

interface ModalCompartilharFichaProps {
  membro: Membro;
  onFechar: () => void;
}

export const ModalCompartilharFicha: React.FC<ModalCompartilharFichaProps> = ({
  membro,
  onFechar,
}) => {
  const [copiado, setCopiado] = useState(false);
  const [config, setConfig] = useState<ConfiguracaoFichaPublica>({
    membro_id: membro.id,
    incluir_identificacao: true,
    incluir_emergencia: true,
    incluir_condicoes: true,
    incluir_medicamentos: true,
    incluir_vacinas: true,
    incluir_alergias: true,
    incluir_exames: false,
  });

  const toggleOption = (key: keyof ConfiguracaoFichaPublica) => {
    if (typeof config[key] === 'boolean') {
      setConfig((prev) => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const queryParams = new URLSearchParams({
    membroId: membro.id,
    ident: config.incluir_identificacao ? '1' : '0',
    emerg: config.incluir_emergencia ? '1' : '0',
    cond: config.incluir_condicoes ? '1' : '0',
    meds: config.incluir_medicamentos ? '1' : '0',
    vac: config.incluir_vacinas ? '1' : '0',
    alerg: config.incluir_alergias ? '1' : '0',
    exam: config.incluir_exames ? '1' : '0',
  });

  const urlPublica = `${window.location.origin}/ficha-publica/${membro.id}?${queryParams.toString()}`;

  const handleCopiarLink = () => {
    navigator.clipboard.writeText(urlPublica);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  };

  const handleAbrirImpressao = () => {
    window.open(urlPublica, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onFechar} />
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Compartilhar Ficha Médica</h3>
              <p className="text-xs text-slate-500">Escolha os dados que deseja enviar ao médico ou clínica</p>
            </div>
          </div>
          <button type="button" onClick={onFechar} className="p-1 rounded-xl text-slate-400 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Seletor de Módulos a Incluir */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 block">O que você quer que apareça na Ficha?</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'incluir_identificacao', label: 'Dados Pessoais & Sangue' },
              { id: 'incluir_emergencia', label: 'Contatos de Emergência' },
              { id: 'incluir_condicoes', label: 'Condições em Acompanhamento' },
              { id: 'incluir_medicamentos', label: 'Medicamentos em Uso' },
              { id: 'incluir_alergias', label: 'Alergias Registradas' },
              { id: 'incluir_vacinas', label: 'Histórico Vacinal' },
              { id: 'incluir_exames', label: 'Exames & Laudos Recentes' },
            ].map((item) => {
              const checked = !!config[item.id as keyof ConfiguracaoFichaPublica];
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleOption(item.id as keyof ConfiguracaoFichaPublica)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                    checked
                      ? 'bg-teal-50 border-teal-300 text-teal-900 ring-1 ring-teal-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  <span>{item.label}</span>
                  <div
                    className={`w-4 h-4 rounded-md flex items-center justify-center border transition-colors ${
                      checked ? 'bg-teal-700 border-teal-700 text-white' : 'border-slate-300 bg-white'
                    }`}
                  >
                    {checked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Informação de Segurança */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
          <span>Apenas as informações marcadas acima ficarão visíveis para quem acessar o link.</span>
        </div>

        {/* Botões de Ação */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Botao
              variante="primario"
              className="w-full justify-center"
              icone={copiado ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              onClick={handleCopiarLink}
            >
              {copiado ? 'Link Copiado!' : 'Copiar Link de Compartilhamento'}
            </Botao>

            <Botao
              variante="secundario"
              icone={<Printer className="w-4 h-4" />}
              onClick={handleAbrirImpressao}
              title="Visualizar / Imprimir Ficha"
            >
              Abrir
            </Botao>
          </div>
        </div>
      </div>
    </div>
  );
};
