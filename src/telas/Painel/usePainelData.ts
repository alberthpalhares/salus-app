import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import { Membro, Medicamento, Vacina, Checkup } from '../../types/dominio';
import {
  repositoriomembros,
  repositoriomedicamentos,
  repositoriovacinas,
  repositoriocheckups,
  repositorioperfilConfig,
} from '../../data/repositorios';
import {
  calcularAlertasComDataHoje,
  agruparAlertasPorGrupo,
} from '../../dominio/alertas';
import { obterDataHojeISO } from '../../lib/datas';

export function usePainelData() {
  const { user } = useAuth();

  const [carregando, setCarregando] = useState<boolean>(true);
  const [membros, setMembros] = useState<Membro[]>([]);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [vacinas, setVacinas] = useState<Vacina[]>([]);
  const [checkups, setCheckups] = useState<Checkup[]>([]);
  const [ultimoExport, setUltimoExport] = useState<string | undefined>(undefined);

  const dataHojeISO = obterDataHojeISO();

  // --- Fetch data ---

  useEffect(() => {
    let montado = true;

    async function carregarDados() {
      if (!user) return;
      try {
        setCarregando(true);
        const [membrosRes, medsRes, vacinasRes, checkupsRes, configRes] =
          await Promise.all([
            repositoriomembros.listar(user.uid),
            repositoriomedicamentos.listar(user.uid),
            repositoriovacinas.listar(user.uid),
            repositoriocheckups.listar(user.uid),
            repositorioperfilConfig.obter(user.uid),
          ]);

        if (montado) {
          setMembros(membrosRes || []);
          setMedicamentos(medsRes || []);
          setVacinas(vacinasRes || []);
          setCheckups(checkupsRes || []);
          setUltimoExport(configRes?.ultimo_export);
        }
      } catch (err) {
        console.error('Erro ao carregar dados no Painel:', err);
      } finally {
        if (montado) setCarregando(false);
      }
    }

    carregarDados();
    return () => { montado = false; };
  }, [user]);

  // --- CRUD handlers ---

  const handleSalvarMembro = async (novoMembro: Membro) => {
    if (!user) return;
    await repositoriomembros.salvar(user.uid, novoMembro);
    setMembros((prev) => [...prev, novoMembro]);
  };

  const handleEditarMembro = async (membroAtualizado: Membro) => {
    if (!user) return;
    await repositoriomembros.salvar(user.uid, membroAtualizado);
    setMembros((prev) => prev.map((m) => (m.id === membroAtualizado.id ? membroAtualizado : m)));
  };

  const handleExcluirMembro = async (membroId: string) => {
    if (!user) return;
    await repositoriomembros.remover(user.uid, membroId);
    setMembros((prev) => prev.filter((m) => m.id !== membroId));
  };

  // --- Computed values ---

  const alertas = calcularAlertasComDataHoje(
    { membros, vacinas, medicamentos, checkups },
    dataHojeISO
  );
  const gruposAlertas = agruparAlertasPorGrupo(alertas);
  const temAlerta30Dias =
    gruposAlertas.VENCIDO.length > 0 || gruposAlertas.VENCE_EM_30_DIAS.length > 0;

  // Merge embedded meds with collection meds
  const todosMedicamentos: Medicamento[] = [...medicamentos];
  membros.forEach((m) => {
    if (m.medicamentos_em_uso) {
      m.medicamentos_em_uso.forEach((med, idx) => {
        if (!todosMedicamentos.some((x) => x.membro_id === m.id && x.nome === med.nome)) {
          todosMedicamentos.push({
            id: `emb-med-${m.id}-${idx}`,
            membro_id: m.id,
            nome: med.nome,
            dose: med.dose || med.posologia || '',
            frequencia: med.frequencia || '',
            status: 'em_uso',
            desde: med.inicio,
            renova_em: med.renova_em,
          });
        }
      });
    }
  });

  const medicamentosEmUso = todosMedicamentos.filter((m) => m.status === 'em_uso');
  const medicamentosPrescritos = todosMedicamentos.filter((m) => m.status === 'prescrito');

  const membrosComCondicoes = membros.filter((m) => {
    const conds = m.condicoes_ativas || m.condicoes || [];
    return conds.length > 0;
  });

  const totalCondicoesCount = membros.reduce((acc, m) => {
    const conds = m.condicoes_ativas || m.condicoes || [];
    return acc + conds.length;
  }, 0);

  const precisaBackup = !ultimoExport;
  const estaTotalmenteVazio = membros.length === 0;

  return {
    carregando,
    membros,
    dataHojeISO,

    // Alerts
    alertas,
    gruposAlertas,
    temAlerta30Dias,

    // Meds
    medicamentosEmUso,
    medicamentosPrescritos,

    // Conditions
    membrosComCondicoes,
    totalCondicoesCount,

    // Flags
    precisaBackup,
    estaTotalmenteVazio,

    // Handlers
    handleSalvarMembro,
    handleEditarMembro,
    handleExcluirMembro,
  };
}
