import { useState, useEffect } from 'react';
import { useAuth } from '@/auth/AuthProvider';
import { Membro, Medicamento, CondicaoSaudeEstruturada, Exame } from '@/types/dominio';
import {
  repositoriomembros,
  repositoriomedicamentos,
  repositoriocondicoes,
  repositorioexames,
} from '@/data/repositorios';
import { obterDataHojeISO } from '@/lib/datas';

export function usePrepararConsulta(membroIdInicial?: string) {
  const { user } = useAuth();
  const [carregando, setCarregando] = useState(true);

  const [membros, setMembros] = useState<Membro[]>([]);
  const [membroSelecionadoId, setMembroSelecionadoId] = useState<string>(membroIdInicial || '');

  const [especialidade, setEspecialidade] = useState<string>('Clínica Geral');
  const [motivoConsulta, setMotivoConsulta] = useState<string>('');
  const [duvida1, setDuvida1] = useState<string>('');
  const [duvida2, setDuvida2] = useState<string>('');
  const [duvida3, setDuvida3] = useState<string>('');

  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [condicoes, setCondicoes] = useState<CondicaoSaudeEstruturada[]>([]);
  const [exames, setExames] = useState<Exame[]>([]);

  useEffect(() => {
    let montado = true;
    async function carregarTodosMembros() {
      if (!user) return;
      try {
        setCarregando(true);
        const listaMembros = await repositoriomembros.listar(user.uid);
        if (!montado) return;

        setMembros(listaMembros || []);
        if (listaMembros && listaMembros.length > 0 && !membroSelecionadoId) {
          setMembroSelecionadoId(listaMembros[0].id);
        }
      } catch (err) {
        console.error('Erro ao carregar membros:', err);
      } finally {
        if (montado) setCarregando(false);
      }
    }
    carregarTodosMembros();
    return () => { montado = false; };
  }, [user]);

  // Carregar dados específicos do membro selecionado
  useEffect(() => {
    let montado = true;
    async function carregarDadosMembro() {
      if (!user || !membroSelecionadoId) return;
      try {
        const [medsRes, condsRes, examesRes] = await Promise.all([
          repositoriomedicamentos.listarPorMembro(user.uid, membroSelecionadoId),
          repositoriocondicoes.listar(user.uid),
          repositorioexames.listarPorMembro(user.uid, membroSelecionadoId),
        ]);

        if (!montado) return;

        const condsMembro = (condsRes || []).filter(c => c.membro_id === membroSelecionadoId);

        setMedicamentos((medsRes || []).filter((m: Medicamento) => m.status === 'em_uso'));
        setCondicoes(condsMembro.filter((c: CondicaoSaudeEstruturada) => c.status === 'ativa'));
        setExames(examesRes || []);
      } catch (err) {
        console.error('Erro ao carregar dados do membro selecionado:', err);
      }
    }
    carregarDadosMembro();
    return () => { montado = false; };
  }, [user, membroSelecionadoId]);

  const membroAtual = membros.find((m) => m.id === membroSelecionadoId) || membros[0];

  // Exames com alteração de laudo
  const examesAlterados = exames.filter(
    (e) => e.flag === 'alto' || e.flag === 'baixo'
  );

  const duvidas = [duvida1, duvida2, duvida3].filter((d) => d.trim() !== '');

  const dataHojeISO = obterDataHojeISO();

  return {
    carregando,
    membros,
    membroSelecionadoId,
    setMembroSelecionadoId,
    membroAtual,
    especialidade,
    setEspecialidade,
    motivoConsulta,
    setMotivoConsulta,
    duvida1,
    setDuvida1,
    duvida2,
    setDuvida2,
    duvida3,
    setDuvida3,
    duvidas,
    medicamentos,
    condicoes,
    examesAlterados,
    dataHojeISO,
  };
}
