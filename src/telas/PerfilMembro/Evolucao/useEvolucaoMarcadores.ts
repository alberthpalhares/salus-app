import { useState, useEffect } from 'react';
import { useAuth } from '@/auth/AuthProvider';
import { Exame, Membro } from '@/types/dominio';
import { repositorioexames, repositoriomembros } from '@/data/repositorios';

export interface PontoEvolucao {
  id: string;
  data: string; // AAAA-MM-DD
  dataFormatada: string;
  valor: number;
  valorOriginal: string;
  unidade: string;
  faixaReferencia: string;
  flag: 'normal' | 'alto' | 'baixo' | 'nao_informado' | string;
  membroId: string;
  membroNome?: string;
}

export interface MarcadorAgrupado {
  nome: string;
  pontos: PontoEvolucao[];
  unidade: string;
  faixaReferencia: string;
  ultimoValor: number;
  ultimoFlag: string;
  ultimaData: string;
  tendencia: 'estavel' | 'subindo' | 'descendo';
}

export interface MembroComCruzamento {
  membro: Membro;
  pontos: PontoEvolucao[];
}

export function useEvolucaoMarcadores(membroId?: string) {
  const { user } = useAuth();
  const [carregando, setCarregando] = useState(true);
  const [exames, setExames] = useState<Exame[]>([]);
  const [membrosFamilia, setMembrosFamilia] = useState<Membro[]>([]);
  const [marcadorSelecionado, setMarcadorSelecionado] = useState<string>('');

  useEffect(() => {
    let montado = true;
    async function carregarDados() {
      if (!user) return;
      try {
        setCarregando(true);
        const [todosExames, todosMembros] = await Promise.all([
          repositorioexames.listar(user.uid),
          repositoriomembros.listar(user.uid),
        ]);

        if (!montado) return;

        setExames(todosExames || []);
        setMembrosFamilia(todosMembros || []);
      } catch (err) {
        console.error('Erro ao carregar exames para evolução:', err);
      } finally {
        if (montado) setCarregando(false);
      }
    }
    carregarDados();
    return () => { montado = false; };
  }, [user]);

  // Extrair valor numérico
  const extrairValorNumerico = (valorStr: string): number | null => {
    if (!valorStr) return null;
    const limpo = valorStr.replace(',', '.').replace(/[^0-9.]/g, '');
    const num = parseFloat(limpo);
    return isNaN(num) ? null : num;
  };

  // Filtrar exames do membro específico (ou todos se não informado)
  const examesDoMembro = membroId
    ? exames.filter((e) => e.membro_id === membroId)
    : exames;

  // Agrupar exames por marcador
  const marcadoresAgrupados: Record<string, PontoEvolucao[]> = {};

  examesDoMembro.forEach((ex) => {
    const num = extrairValorNumerico(ex.valor);
    if (num === null) return; // Ignora se não for numérico

    const nomeKey = ex.marcador.trim();
    if (!marcadoresAgrupados[nomeKey]) {
      marcadoresAgrupados[nomeKey] = [];
    }

    const dataPartes = ex.data ? ex.data.split('-') : [];
    const dataFormatada = dataPartes.length === 3 ? `${dataPartes[2]}/${dataPartes[1]}/${dataPartes[0]}` : ex.data;

    marcadoresAgrupados[nomeKey].push({
      id: ex.id,
      data: ex.data,
      dataFormatada,
      valor: num,
      valorOriginal: ex.valor,
      unidade: ex.unidade || '',
      faixaReferencia: ex.faixa_referencia_laudo || 'faixa não informada no laudo',
      flag: ex.flag || 'normal',
      membroId: ex.membro_id,
    });
  });

  // Converter para lista ordenada
  const listaMarcadores: MarcadorAgrupado[] = Object.entries(marcadoresAgrupados).map(
    ([nome, pontos]) => {
      // Ordenar por data (mais antigo para o mais recente)
      const pontosOrdenados = [...pontos].sort(
        (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
      );

      const ultimo = pontosOrdenados[pontosOrdenados.length - 1];
      const penultimo = pontosOrdenados.length > 1 ? pontosOrdenados[pontosOrdenados.length - 2] : null;

      let tendencia: 'estavel' | 'subindo' | 'descendo' = 'estavel';
      if (penultimo) {
        if (ultimo.valor > penultimo.valor) tendencia = 'subindo';
        else if (ultimo.valor < penultimo.valor) tendencia = 'descendo';
      }

      return {
        nome,
        pontos: pontosOrdenados,
        unidade: ultimo.unidade,
        faixaReferencia: ultimo.faixaReferencia,
        ultimoValor: ultimo.valor,
        ultimoFlag: ultimo.flag,
        ultimaData: ultimo.data,
        tendencia,
      };
    }
  );

  // Definir marcador selecionado padrão
  useEffect(() => {
    if (listaMarcadores.length > 0 && !marcadorSelecionado) {
      setMarcadorSelecionado(listaMarcadores[0].nome);
    }
  }, [listaMarcadores, marcadorSelecionado]);

  // Marcador selecionado atual
  const marcadorAtual = listaMarcadores.find((m) => m.nome === marcadorSelecionado) || listaMarcadores[0];

  // Cruzamento genético: buscar dados do mesmo marcador entre membros da família com vinculo biologico e mesma especie
  const obterCruzamentoFamiliar = (nomeMarcador: string) => {
    const membroFoco = membrosFamilia.find((m) => m.id === membroId);

    // Filtrar membros da mesma espécie e com vinculo biologico
    const membrosEspecieEBiologicos = membrosFamilia.filter((m) => {
      // Mesma espécie
      const mesmaEspecie = membroFoco
        ? (m.tipo || 'pessoa') === (membroFoco.tipo || 'pessoa')
        : true;
      // Vínculo biológico obrigatório
      const ehBiologico = m.vinculo === 'biologico' || !m.vinculo;
      return mesmaEspecie && ehBiologico;
    });

    const resultado: MembroComCruzamento[] = [];

    membrosEspecieEBiologicos.forEach((m) => {
      const examesMembro = exames.filter(
        (e) => e.membro_id === m.id && e.marcador.trim().toLowerCase() === nomeMarcador.trim().toLowerCase()
      );

      const pontos: PontoEvolucao[] = [];
      examesMembro.forEach((ex) => {
        const num = extrairValorNumerico(ex.valor);
        if (num !== null) {
          const dataPartes = ex.data ? ex.data.split('-') : [];
          const dataFormatada = dataPartes.length === 3 ? `${dataPartes[2]}/${dataPartes[1]}/${dataPartes[0]}` : ex.data;

          pontos.push({
            id: ex.id,
            data: ex.data,
            dataFormatada,
            valor: num,
            valorOriginal: ex.valor,
            unidade: ex.unidade || '',
            faixaReferencia: ex.faixa_referencia_laudo || 'faixa não informada no laudo',
            flag: ex.flag || 'normal',
            membroId: m.id,
            membroNome: m.nome,
          });
        }
      });

      if (pontos.length > 0) {
        pontos.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
        resultado.push({ membro: m, pontos });
      }
    });

    return resultado;
  };

  return {
    carregando,
    listaMarcadores,
    marcadorSelecionado,
    setMarcadorSelecionado,
    marcadorAtual,
    membrosFamilia,
    obterCruzamentoFamiliar,
  };
}
