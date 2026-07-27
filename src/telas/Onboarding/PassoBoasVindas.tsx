import React from 'react';
import { Card } from '../../componentes/ui/Card';
import { Botao } from '../../componentes/ui/Botao';
import {
  ShieldCheck,
  Lock,
  Key,
  Database,
  Download,
  Users,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

interface PassoBoasVindasProps {
  entendiDados: boolean;
  setEntendiDados: (v: boolean) => void;
  tenhoConsentimento: boolean;
  setTenhoConsentimento: (v: boolean) => void;
  onContinuar: () => void;
}

export const PassoBoasVindas: React.FC<PassoBoasVindasProps> = ({
  entendiDados,
  setEntendiDados,
  tenhoConsentimento,
  setTenhoConsentimento,
  onContinuar,
}) => {
  return (
    <Card className="space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-2.5 rounded-xl bg-teal-100/80 text-teal-800">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Privacidade, Segurança e Isenção Clínica
          </h2>
          <p className="text-xs text-slate-500">
            Leia com atenção como seus dados de saúde são tratados no Salus.
          </p>
        </div>
      </div>

      <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-200/60 max-h-80 overflow-y-auto">
        <div className="flex items-start gap-3">
          <Lock className="w-4 h-4 text-teal-600 shrink-0 mt-1" />
          <p>
            <strong>Armazenamento Seguro e Isolado:</strong> Seus dados ficam salvos na sua conta (autenticada via Google), isolados de qualquer outro usuário por regras de segurança nativas do banco de dados.
          </p>
        </div>

        <div className="flex items-start gap-3">
          <Key className="w-4 h-4 text-teal-600 shrink-0 mt-1" />
          <p>
            <strong>Processamento com Chave Própria (BYOK):</strong> Quando você solicita uma análise ou envia um laudo, aquele conteúdo é enviado para a API do Gemini utilizando a <em>sua própria chave de API</em> (cadastrada em Ajustes) — o processamento e a cota pertencem exclusivamente a você.
          </p>
        </div>

        <div className="flex items-start gap-3">
          <Database className="w-4 h-4 text-slate-600 shrink-0 mt-1" />
          <p>
            <strong>Acesso Técnico:</strong> O mantenedor do app não acessa seus dados no uso rotineiro, mas, como proprietário da infraestrutura, possui acesso técnico de administrador — similar a qualquer serviço em nuvem.
          </p>
        </div>

        <div className="flex items-start gap-3">
          <Download className="w-4 h-4 text-slate-600 shrink-0 mt-1" />
          <p>
            <strong>Portabilidade dos Dados:</strong> Você pode exportar todos os seus dados a qualquer momento em formato aberto (.zip), garantindo que seu histórico permaneça acessível mesmo fora do aplicativo.
          </p>
        </div>

        <div className="flex items-start gap-3">
          <Users className="w-4 h-4 text-teal-600 shrink-0 mt-1" />
          <p>
            <strong>Consentimento de Terceiros:</strong> Ao registrar informações de saúde de familiares ou dependentes, certifique-se de possuir o consentimento expresso das pessoas envolvidas.
          </p>
        </div>

        <div className="flex items-start gap-3 pt-2 border-t border-slate-200/80">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-1" />
          <p className="text-slate-800 font-medium">
            <strong>Isenção Médica e Veterinária:</strong> O Salus organiza e cruza dados de saúde. Ele <u>nunca diagnostica</u>, <u>nunca prescreve</u> e não substitui a consulta nem a interpretação de um profissional de saúde qualificado.
          </p>
        </div>
      </div>

      <div className="space-y-3 pt-2 border-t border-slate-100">
        <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={entendiDados}
            onChange={(e) => setEntendiDados(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
          />
          <span className="text-xs sm:text-sm font-semibold text-slate-800">
            Entendi como meus dados são tratados e guardados no Salus.
          </span>
        </label>

        <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={tenhoConsentimento}
            onChange={(e) => setTenhoConsentimento(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
          />
          <span className="text-xs sm:text-sm font-semibold text-slate-800">
            Tenho consentimento das pessoas cujos dados de saúde vou cadastrar.
          </span>
        </label>
      </div>

      <div className="pt-2 flex justify-end">
        <Botao
          variante="primario"
          disabled={!entendiDados || !tenhoConsentimento}
          onClick={onContinuar}
          icone={<ArrowRight className="w-4 h-4" />}
        >
          Continuar
        </Botao>
      </div>
    </Card>
  );
};
