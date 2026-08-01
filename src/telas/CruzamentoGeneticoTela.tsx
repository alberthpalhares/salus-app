import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/componentes/ui/Card';
import { Select } from '@/componentes/ui/Select';
import { Badge } from '@/componentes/ui/Badge';
import { Carregando } from '@/componentes/ui/Carregando';
import { EstadoVazio } from '@/componentes/ui/EstadoVazio';
import { AnimacaoEntrada, AnimacaoLista, AnimacaoItemLista } from '@/componentes/ui/AnimacaoEntrada';
import { useEvolucaoMarcadores } from './PerfilMembro/Evolucao/useEvolucaoMarcadores';
import { GraficoEvolucaoMarcador } from './PerfilMembro/Evolucao/GraficoEvolucaoMarcador';
import { Dna, AlertCircle, ArrowLeft, Users, ShieldCheck } from 'lucide-react';
import { Botao } from '@/componentes/ui/Botao';

export const CruzamentoGeneticoTela: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const marcadorUrl = searchParams.get('marcador') || '';

  const {
    carregando,
    listaMarcadores,
    marcadorSelecionado,
    setMarcadorSelecionado,
    obterCruzamentoFamiliar,
  } = useEvolucaoMarcadores();

  const [marcadorAtivo, setMarcadorAtivo] = useState(marcadorUrl || (listaMarcadores[0]?.nome || ''));

  if (carregando) {
    return <Carregando mensagem="Analisando marcadores e vínculo biológico familiar..." />;
  }

  const opcoesSelect = listaMarcadores.map((m) => ({
    valor: m.nome,
    rotulo: m.nome,
  }));

  const nomeParaBuscar = marcadorAtivo || marcadorSelecionado || (listaMarcadores[0]?.nome || '');
  const cruzamento = nomeParaBuscar ? obterCruzamentoFamiliar(nomeParaBuscar) : [];

  // Cores de linhas para cada membro
  const CORES = ['#0D9488', '#F43F5E', '#F59E0B', '#6366F1', '#EC4899', '#8B5CF6'];

  return (
    <AnimacaoEntrada className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Botao variante="ghost" tamanho="sm" onClick={() => navigate(-1)} className="p-1">
              <ArrowLeft className="w-4 h-4" />
            </Botao>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Dna className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              Cruzamento Genético Familiar
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 pl-7">
            Comparativo genético-hereditário de exames entre integrantes com <strong>vínculo biológico</strong> confirmado.
          </p>
        </div>

        {listaMarcadores.length > 0 && (
          <div className="w-full sm:w-72">
            <Select
              rotulo="Marcador em Comparativo"
              opcoes={opcoesSelect}
              valor={nomeParaBuscar}
              onValueChange={(val) => {
                setMarcadorAtivo(val);
                setMarcadorSelecionado(val);
              }}
            />
          </div>
        )}
      </div>

      {/* Regras do Protocolo Clínico */}
      <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
        <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
        <span>
          <strong>Protocolo Clínico SISAFAM:</strong> Este comparativo cruza exclusivamente marcadores de integrantes com <em>vinculo: biologico</em> e da mesma espécie. Integrantes adotivos/enteados e animais são isolados em conformidade com as diretrizes de genética.
        </span>
      </div>

      {cruzamento.length === 0 ? (
        <EstadoVazio
          titulo="Nenhum dado comparativo disponível"
          descricao="Não foram encontrados exames com valores quantitativos deste marcador para múltiplos integrantes biológicos."
          icone={<Dna className="w-8 h-8 text-slate-400" />}
        />
      ) : (
        <div className="space-y-6">
          {/* Card Resumo do Cruzamento */}
          <Card className="space-y-4">
            <CardHeader className="p-0 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{nomeParaBuscar}</CardTitle>
                <Badge variante="sucesso" icone={<Users className="w-3.5 h-3.5" />}>
                  {cruzamento.length} {cruzamento.length === 1 ? 'membro biológico' : 'membros biológicos'}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-0 space-y-6 pt-2">
              <AnimacaoLista className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cruzamento.map((item, idx) => {
                  const corLinha = CORES[idx % CORES.length];
                  return (
                    <AnimacaoItemLista key={item.membro.id}>
                      <Card className="p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="flex items-center justify-between">
                          <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: corLinha }} />
                            {item.membro.nome}
                          </h4>
                          <span className="text-xs text-slate-500 font-medium">
                            {item.pontos.length} {item.pontos.length === 1 ? 'medição' : 'medições'}
                          </span>
                        </div>

                        <GraficoEvolucaoMarcador
                          pontos={item.pontos}
                          corLinha={corLinha}
                          altura={180}
                        />
                      </Card>
                    </AnimacaoItemLista>
                  );
                })}
              </AnimacaoLista>
            </CardContent>
          </Card>

          {/* Aviso se houver alteração em mais de 1 membro */}
          {cruzamento.length >= 2 && (
            <Card destaque="amber" className="p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs text-amber-900 dark:text-amber-200">
                <h4 className="font-extrabold">Padrão Genético-Hereditário em Acompanhamento</h4>
                <p>
                  Foram identificados registros de <strong>{nomeParaBuscar}</strong> em múltiplos membros biológicos da família. Leve este histórico impresso ou digital à consulta médica.
                </p>
              </div>
            </Card>
          )}
        </div>
      )}
    </AnimacaoEntrada>
  );
};
