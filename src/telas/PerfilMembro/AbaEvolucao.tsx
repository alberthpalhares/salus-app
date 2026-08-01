import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/componentes/ui/Card';
import { Badge } from '@/componentes/ui/Badge';
import { Select } from '@/componentes/ui/Select';
import { Carregando } from '@/componentes/ui/Carregando';
import { EstadoVazio } from '@/componentes/ui/EstadoVazio';
import { useEvolucaoMarcadores } from './Evolucao/useEvolucaoMarcadores';
import { GraficoEvolucaoMarcador } from './Evolucao/GraficoEvolucaoMarcador';
import { TrendingUp, TrendingDown, Minus, Activity, ShieldAlert, Dna } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AbaEvolucaoProps {
  membroId: string;
  membroNome: string;
}

export const AbaEvolucao: React.FC<AbaEvolucaoProps> = ({ membroId, membroNome }) => {
  const {
    carregando,
    listaMarcadores,
    marcadorSelecionado,
    setMarcadorSelecionado,
    marcadorAtual,
    obterCruzamentoFamiliar,
  } = useEvolucaoMarcadores(membroId);

  if (carregando) {
    return <Carregando mensagem="Carregando evolução de biomarcadores..." />;
  }

  if (listaMarcadores.length === 0) {
    return (
      <EstadoVazio
        titulo="Nenhum marcador de exame registrado"
        descricao={`Ainda não há exames com marcadores quantitativos para ${membroNome}. Ao cadastrar laudos na Caixa de Entrada ou na aba de Exames, a evolução gráfica será exibida aqui.`}
        icone={<Activity className="w-8 h-8 text-slate-400" />}
      />
    );
  }

  const opcoesSelect = listaMarcadores.map((m) => ({
    valor: m.nome,
    rotulo: `${m.nome} (${m.pontos.length} ${m.pontos.length === 1 ? 'registro' : 'registros'})`,
  }));

  const cruzamento = marcadorSelecionado ? obterCruzamentoFamiliar(marcadorSelecionado) : [];
  const temAlertaCruzamento = cruzamento.length >= 2;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            Evolução de Biomarcadores
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Acompanhe a variação temporal de exames de {membroNome}.
          </p>
        </div>

        <div className="w-full sm:w-72">
          <Select
            rotulo="Selecione o Marcador"
            opcoes={opcoesSelect}
            valor={marcadorSelecionado}
            onValueChange={setMarcadorSelecionado}
          />
        </div>
      </div>

      {marcadorAtual && (
        <Card className="space-y-4">
          <CardHeader className="p-0 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{marcadorAtual.nome}</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Última medição em {marcadorAtual.ultimaData}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variante={
                    marcadorAtual.ultimoFlag === 'alto' || marcadorAtual.ultimoFlag === 'baixo'
                      ? 'perigo'
                      : 'sucesso'
                  }
                >
                  {marcadorAtual.ultimoValor} {marcadorAtual.unidade}
                </Badge>

                {marcadorAtual.tendencia === 'subindo' && (
                  <Badge variante="alerta" icone={<TrendingUp className="w-3.5 h-3.5" />}>
                    Subindo
                  </Badge>
                )}
                {marcadorAtual.tendencia === 'descendo' && (
                  <Badge variante="info" icone={<TrendingDown className="w-3.5 h-3.5" />}>
                    Descendo
                  </Badge>
                )}
                {marcadorAtual.tendencia === 'estavel' && (
                  <Badge variante="neutro" icone={<Minus className="w-3.5 h-3.5" />}>
                    Estável
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 pt-2">
            <GraficoEvolucaoMarcador
              pontos={marcadorAtual.pontos}
              unidade={marcadorAtual.unidade}
              faixaReferencia={marcadorAtual.faixaReferencia}
            />
          </CardContent>
        </Card>
      )}

      {/* Alerta de Cruzamento Familiar / Hereditário */}
      {temAlertaCruzamento && (
        <Card destaque="teal" className="p-4 flex items-start gap-3">
          <Dna className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
          <div className="space-y-1 flex-1 text-xs">
            <h4 className="font-extrabold text-teal-900 dark:text-teal-200">
              Histórico Familiar Encontrado para {marcadorSelecionado}
            </h4>
            <p className="text-teal-800 dark:text-teal-300">
              Existe registro deste mesmo marcador em <strong>{cruzamento.length} membros da família com vínculo biológico</strong>.
            </p>
            <div className="pt-1">
              <Link
                to={`/evolucao?marcador=${encodeURIComponent(marcadorSelecionado)}`}
                className="font-bold text-teal-700 dark:text-teal-400 underline hover:text-teal-950 dark:hover:text-teal-100"
              >
                Abrir Comparativo Genético Familiar →
              </Link>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
