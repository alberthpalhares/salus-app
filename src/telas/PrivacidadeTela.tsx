import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../componentes/ui/Card';
import { Badge } from '../componentes/ui/Badge';
import { SisafamLogo } from '../components/ui/logo';
import {
  ShieldCheck,
  Key,
  HardDrive,
  Cpu,
  Lock,
  Download,
  Trash2,
  RefreshCw,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

export const PrivacidadeTela: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 text-slate-800">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
        <div>
          <Link
            to="/ajustes"
            className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar para Ajustes
          </Link>
          <div className="flex items-center gap-3">
            <SisafamLogo variant="icon" size="sm" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Transparência & Privacidade
            </h1>
            <Badge variante="teal" icone={<ShieldCheck className="w-3.5 h-3.5" />}>
              Conformidade
            </Badge>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Entenda como seus dados e documentos de saúde são protegidos no SISAFAM e mantidos sob seu controle total.
          </p>
        </div>
      </div>

      {/* Destaque / Filosofia Principal */}
      <Card className="bg-gradient-to-br from-teal-950 via-slate-900 to-slate-900 text-white border-teal-800/50 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0 border border-teal-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Compromisso com a Sua Privacidade</h2>
            <p className="text-xs text-teal-200">
              O SISAFAM foi projetado com isolamento total por login e sem retenção centralizada de documentos.
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Sua privacidade não é uma funcionalidade secundária; é a fundação do SISAFAM. Toda informação clínica cadastrada pertence exclusivamente a você. O aplicativo funciona sem intermediários de terceiros, sem venda de dados e sem dependência obrigatória de Inteligência Artificial.
        </p>
      </Card>

      {/* Seção 1: IA é opcional */}
      <Card className="p-6 space-y-3 border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">1. A IA é Opcional e o App Funciona Sem Ela</h3>
            <p className="text-xs text-slate-500">Uso 100% útil e completo mesmo sem cadastrar nenhuma chave de API</p>
          </div>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">
          Você não precisa de Inteligência Artificial para usar o SISAFAM. Todas as funções essenciais — cadastrar membros da família (pessoas e pets), registrar vacinas, exames, medicamentos, montar o histórico, consultar a agenda, ver alertas e anexar documentos — funcionam de forma <strong>100% manual</strong>, rápida e gratuita, sem qualquer envio para modelos de IA.
        </p>
        <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-200/60 text-xs text-teal-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
          <span>A IA é ativada apenas para o Chat em linguagem natural e a extração automática de laudos.</span>
        </div>
      </Card>

      {/* Seção 2: Onde os dados estruturados ficam */}
      <Card className="p-6 space-y-3 border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">2. Onde Ficam os Dados Estruturados</h3>
            <p className="text-xs text-slate-500">Banco de dados seguro e isolado por usuário no Firestore</p>
          </div>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">
          Os dados estruturados de saúde (fichas de membros, vacinas, exames cadastrados e lista de remédios) são armazenados no banco de dados do <strong>SISAFAM (Firestore)</strong> sob o caminho seguro <code>/usuarios/&#123;seu_uid&#125;/...</code>.
        </p>
        <p className="text-sm text-slate-700 leading-relaxed">
          As regras de segurança garantem que <strong>apenas a sua conta autenticada</strong> consegue ler ou modificar seus registros. Nenhum outro usuário do aplicativo consegue visualizar seus dados.
        </p>
      </Card>

      {/* Seção 3: Documentos originais no Google Drive */}
      <Card className="p-6 space-y-3 border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">3. Onde Ficam os Documentos Originais (PDFs e Fotos)</h3>
            <p className="text-xs text-slate-500">Armazenamento direto no seu próprio Google Drive</p>
          </div>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">
          O SISAFAM <strong>nunca armazena</strong> seus arquivos originais (PDFs, fotos de laudos, receitas médicas ou exames) na infraestrutura do aplicativo. Todos os seus documentos são salvos diretamente em uma pasta dedicada chamada <strong>"SISAFAM App"</strong> dentro da sua própria conta do Google Drive.
        </p>
        <p className="text-sm text-slate-700 leading-relaxed">
          A permissão solicitada ao Google Drive é estrita ao escopo <code>drive.file</code>, o que significa que o SISAFAM só enxerga os arquivos e pastas criados pelo próprio aplicativo — mantendo todo o restante do seu Google Drive completamente privado. O mantenedor do SISAFAM nunca tem acesso aos seus arquivos.
        </p>
      </Card>

      {/* Seção 4: O que sai do dispositivo e quando */}
      <Card className="p-6 space-y-3 border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">4. O Que Sai do Dispositivo e Quando (Modelo BYOK)</h3>
            <p className="text-xs text-slate-500">Transmissão direta para o provedor com a sua chave própria</p>
          </div>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">
          Quando você opta por usar recursos de IA (como analisar um laudo na Caixa de Entrada ou tirar uma dúvida no Chat), o texto ou conteúdo do documento é enviado para a API do provedor de IA escolhido por você (por exemplo, Google Gemini).
        </p>
        <p className="text-sm text-slate-700 leading-relaxed">
          Essa requisição utiliza a <strong>sua chave de API própria (BYOK - Bring Your Own Key)</strong>, cadastrada em Ajustes. A chave nunca é compartilhada com terceiros nem utilizada por outros usuários.
        </p>
      </Card>

      {/* Seção 5: Acesso técnico de administração */}
      <Card className="p-6 space-y-3 border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">5. Acesso do Mantenedor do SISAFAM</h3>
            <p className="text-xs text-slate-500">Transparência total sobre a infraestrutura</p>
          </div>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">
          O mantenedor do SISAFAM <strong>não acessa, lê ou consulta</strong> seus dados estruturados durante o uso cotidiano. No entanto, por razões de transparência, é importante esclarecer que o mantenedor possui acesso técnico de administrador à infraestrutura em nuvem (Firestore) onde o banco de dados está hospedado. Os documentos físicos (PDFs/fotos) continuam fora desse alcance por estarem no seu Google Drive.
        </p>
      </Card>

      {/* Seção 6: O que o SISAFAM NUNCA faz */}
      <Card className="p-6 space-y-3 border-amber-200/80 bg-amber-50/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-amber-900">6. O Que o SISAFAM NUNCA Faz</h3>
            <p className="text-xs text-amber-700">Garantias do Núcleo Clínico Inviolável</p>
          </div>
        </div>
        <ul className="list-disc list-inside space-y-2 text-sm text-slate-800">
          <li><strong>Nunca diagnostica e nunca prescreve:</strong> O app organiza e relaciona informações. Toda interpretação clínica é exclusivamente do profissional de saúde.</li>
          <li><strong>Nunca usa faixas de referência memorizadas:</strong> Apenas a faixa impressa no laudo do exame é exibida.</li>
          <li><strong>Nunca usa tom alarmista:</strong> Palavras como "urgente", "grave" ou "crítico" são proibidas na interface do SISAFAM.</li>
          <li><strong>Nunca vende ou compartilha seus dados:</strong> Suas informações não são comercializadas com farmácias, planos de saúde ou seguradoras.</li>
          <li><strong>Nunca altera medicamentos para "em uso" automaticamente:</strong> Ao ler uma receita, o remédio fica marcado como <code>prescrito</code> e só passa a <code>em uso</code> sob sua confirmação.</li>
        </ul>
      </Card>

      {/* Seção 7: Portabilidade, Desconexão e Exclusão */}
      <Card className="p-6 space-y-4 border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">7. Exportação, Desconexão do Drive e Exclusão de Conta</h3>
            <p className="text-xs text-slate-500">Sua soberania sobre os seus dados</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block flex items-center gap-1.5">
              <Download className="w-4 h-4 text-teal-600" /> Exportação Completa
            </span>
            <p>Você pode baixar um arquivo <code>.zip</code> com todos os seus dados estruturados em JSON e Markdown a qualquer momento em Ajustes.</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4 text-amber-600" /> Desconectar Drive ou IA
            </span>
            <p>Você pode revogar a conexão com o Google Drive ou excluir sua chave de API do provedor em Ajustes sem perder seus arquivos.</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1 md:col-span-2">
            <span className="font-bold text-rose-900 block flex items-center gap-1.5">
              <Trash2 className="w-4 h-4 text-rose-600" /> Exclusão Definitiva da Conta
            </span>
            <p>Ao solicitar a exclusão de conta em Ajustes, todos os seus dados estruturados no Firestore são apagados permanentemente. Como os arquivos originais estão salvos no seu próprio Google Drive, eles não são apagados e continuam sob a sua posse na sua conta do Google.</p>
          </div>
        </div>
      </Card>

      {/* Seção 8: Recomendação de backup */}
      <Card className="p-6 space-y-3 border-teal-200 bg-teal-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-teal-950">8. Recomendação de Backup Periódico</h3>
            <p className="text-xs text-teal-800">Mantenha uma cópia local de segurança</p>
          </div>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">
          Recomendamos que você realize o download periódico de um arquivo de backup do seu histórico de saúde na aba <strong>Ajustes &gt; Portabilidade dos Dados</strong>. Dessa forma, você garante que sempre terá uma cópia local atualizada dos registros clínicos da sua família.
        </p>
        <div className="pt-2 flex items-center justify-end">
          <Link
            to="/ajustes"
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors inline-flex items-center gap-1.5"
          >
            Ir para Ajustes
          </Link>
        </div>
      </Card>
    </div>
  );
};
