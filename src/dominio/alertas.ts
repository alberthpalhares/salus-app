import { Membro, Vacina, Medicamento, Checkup, TipoMembro, ItemAgenda } from '../types/dominio';

export type CategoriaAlertaGrupo = 'VENCIDO' | 'VENCE_EM_30_DIAS' | 'VENCE_EM_31_A_90_DIAS' | 'SEM_DATA';

export interface AlertaItem {
  id: string;
  membro_id: string;
  membro_nome: string;
  membro_tipo?: TipoMembro;
  tipo: 'vacina' | 'medicamento' | 'checkup';
  tipo_label: 'Vacina' | 'Medicamento' | 'Check-up';
  descricao: string;
  data?: string; // AAAA-MM-DD
  dias_diferenca?: number; // ex: -75 (venceu há 75 dias), 12 (faltam 12 dias)
  dias_texto: string;
  grupo: CategoriaAlertaGrupo;
}

export interface DadosAlertasInput {
  membros: Membro[];
  vacinas?: Vacina[];
  medicamentos?: Medicamento[];
  checkups?: Checkup[];
}

/**
 * Função pura que calcula a diferença em dias entre uma data alvo e a data de hoje.
 */
export function calcularDiferencaDiasComHoje(dataISO: string, dataHojeISO: string): number {
  if (!dataISO || !dataHojeISO) return 0;
  const partesItem = dataISO.split('-');
  const partesHoje = dataHojeISO.split('-');
  if (partesItem.length !== 3 || partesHoje.length !== 3) return 0;

  const target = new Date(parseInt(partesItem[0], 10), parseInt(partesItem[1], 10) - 1, parseInt(partesItem[2], 10));
  const hoje = new Date(parseInt(partesHoje[0], 10), parseInt(partesHoje[1], 10) - 1, parseInt(partesHoje[2], 10));

  target.setHours(0, 0, 0, 0);
  hoje.setHours(0, 0, 0, 0);

  const msPorDia = 1000 * 60 * 60 * 24;
  return Math.round((target.getTime() - hoje.getTime()) / msPorDia);
}

/**
 * Classifica a diferença em dias em um dos quatro grupos de alerta.
 */
export function classificarGrupoAlerta(dias: number | undefined): CategoriaAlertaGrupo {
  if (dias === undefined || isNaN(dias)) return 'SEM_DATA';
  if (dias < 0) return 'VENCIDO';
  if (dias <= 30) return 'VENCE_EM_30_DIAS';
  if (dias <= 90) return 'VENCE_EM_31_A_90_DIAS';
  return 'SEM_DATA';
}

/**
 * Formata o texto descritivo sobre o vencimento para o usuário.
 */
export function formatarDiasTexto(dias: number | undefined, grupo: CategoriaAlertaGrupo): string {
  if (grupo === 'SEM_DATA' || dias === undefined || isNaN(dias)) {
    return 'Sem data informada';
  }
  if (dias < 0) {
    const abs = Math.abs(dias);
    return abs === 1 ? 'Venceu ontem' : `Venceu há ${abs} dias`;
  }
  if (dias === 0) return 'Vence hoje';
  if (dias === 1) return 'Vence amanhã';
  return `Vence em ${dias} dias`;
}

/**
 * Função pura que calcula todos os alertas da família a partir dos dados e da data de hoje.
 */
export function calcularAlertasComDataHoje(
  dados: DadosAlertasInput,
  dataHojeISO: string
): AlertaItem[] {
  const alertas: AlertaItem[] = [];
  const membrosMap = new Map<string, Membro>();

  (dados.membros || []).forEach((m) => {
    membrosMap.set(m.id, m);
  });

  // 1. Vacinas
  const vacinasList = dados.vacinas || [];
  if (vacinasList.length > 0) {
    vacinasList.forEach((v, idx) => {
      const membro = membrosMap.get(v.membro_id);
      const membroNome = membro?.nome || 'Membro';
      const membroTipo = membro?.tipo;
      const dataAlvo = v.proxima_em || (v as any).proxima;

      if (dataAlvo) {
        const dias = calcularDiferencaDiasComHoje(dataAlvo, dataHojeISO);
        if (dias <= 90) {
          const grupo = classificarGrupoAlerta(dias);
          alertas.push({
            id: v.id || `vac-${v.membro_id}-${idx}`,
            membro_id: v.membro_id,
            membro_nome: membroNome,
            membro_tipo: membroTipo,
            tipo: 'vacina',
            tipo_label: 'Vacina',
            descricao: `Vacina ${v.nome}`,
            data: dataAlvo,
            dias_diferenca: dias,
            dias_texto: formatarDiasTexto(dias, grupo),
            grupo,
          });
        }
      } else {
        alertas.push({
          id: v.id || `vac-${v.membro_id}-${idx}`,
          membro_id: v.membro_id,
          membro_nome: membroNome,
          membro_tipo: membroTipo,
          tipo: 'vacina',
          tipo_label: 'Vacina',
          descricao: `Vacina ${v.nome}`,
          data: undefined,
          dias_diferenca: undefined,
          dias_texto: 'Sem data informada',
          grupo: 'SEM_DATA',
        });
      }
    });
  } else {
    // Vacinas embutidas no membro
    (dados.membros || []).forEach((m) => {
      if (m.vacinas) {
        m.vacinas.forEach((v, idx) => {
          const dataAlvo = v.proxima_em || v.proxima;
          if (dataAlvo) {
            const dias = calcularDiferencaDiasComHoje(dataAlvo, dataHojeISO);
            if (dias <= 90) {
              const grupo = classificarGrupoAlerta(dias);
              alertas.push({
                id: `vac-emb-${m.id}-${idx}`,
                membro_id: m.id,
                membro_nome: m.nome,
                membro_tipo: m.tipo,
                tipo: 'vacina',
                tipo_label: 'Vacina',
                descricao: `Vacina ${v.nome}`,
                data: dataAlvo,
                dias_diferenca: dias,
                dias_texto: formatarDiasTexto(dias, grupo),
                grupo,
              });
            }
          }
        });
      }
    });
  }

  // 2. Medicamentos com renova_em
  const medicamentosList = dados.medicamentos || [];
  if (medicamentosList.length > 0) {
    medicamentosList.forEach((med, idx) => {
      const membro = membrosMap.get(med.membro_id);
      const membroNome = membro?.nome || 'Membro';
      const membroTipo = membro?.tipo;

      if (med.renova_em) {
        const dias = calcularDiferencaDiasComHoje(med.renova_em, dataHojeISO);
        if (dias <= 90) {
          const grupo = classificarGrupoAlerta(dias);
          alertas.push({
            id: med.id || `med-${med.membro_id}-${idx}`,
            membro_id: med.membro_id,
            membro_nome: membroNome,
            membro_tipo: membroTipo,
            tipo: 'medicamento',
            tipo_label: 'Medicamento',
            descricao: `Renovar receita de ${med.nome}`,
            data: med.renova_em,
            dias_diferenca: dias,
            dias_texto: formatarDiasTexto(dias, grupo),
            grupo,
          });
        }
      }
    });
  } else {
    // Medicamentos embutidos
    (dados.membros || []).forEach((m) => {
      if (m.medicamentos_em_uso) {
        m.medicamentos_em_uso.forEach((med, idx) => {
          if (med.renova_em) {
            const dias = calcularDiferencaDiasComHoje(med.renova_em, dataHojeISO);
            if (dias <= 90) {
              const grupo = classificarGrupoAlerta(dias);
              alertas.push({
                id: `med-emb-${m.id}-${idx}`,
                membro_id: m.id,
                membro_nome: m.nome,
                membro_tipo: m.tipo,
                tipo: 'medicamento',
                tipo_label: 'Medicamento',
                descricao: `Renovar receita de ${med.nome}`,
                data: med.renova_em,
                dias_diferenca: dias,
                dias_texto: formatarDiasTexto(dias, grupo),
                grupo,
              });
            }
          }
        });
      }
    });
  }

  // 3. Check-ups agendados
  const checkupsList = dados.checkups || [];
  checkupsList.forEach((c, idx) => {
    const membro = membrosMap.get(c.membro_id);
    const membroNome = membro?.nome || 'Membro';
    const membroTipo = membro?.tipo;

    if (c.data) {
      const dias = calcularDiferencaDiasComHoje(c.data, dataHojeISO);
      if (dias <= 90) {
        const grupo = classificarGrupoAlerta(dias);
        alertas.push({
          id: c.id || `chk-${c.membro_id}-${idx}`,
          membro_id: c.membro_id,
          membro_nome: membroNome,
          membro_tipo: membroTipo,
          tipo: 'checkup',
          tipo_label: 'Check-up',
          descricao: c.tipo,
          data: c.data,
          dias_diferenca: dias,
          dias_texto: formatarDiasTexto(dias, grupo),
          grupo,
        });
      }
    } else {
      alertas.push({
        id: c.id || `chk-${c.membro_id}-${idx}`,
        membro_id: c.membro_id,
        membro_nome: membroNome,
        membro_tipo: membroTipo,
        tipo: 'checkup',
        tipo_label: 'Check-up',
        descricao: c.tipo,
        data: undefined,
        dias_diferenca: undefined,
        dias_texto: 'Sem data informada',
        grupo: 'SEM_DATA',
      });
    }
  });

  return alertas;
}

/**
 * Função pura para agrupar alertas nos 4 grupos definidos.
 */
export function agruparAlertasPorGrupo(
  alertas: AlertaItem[]
): Record<CategoriaAlertaGrupo, AlertaItem[]> {
  const grupos: Record<CategoriaAlertaGrupo, AlertaItem[]> = {
    VENCIDO: [],
    VENCE_EM_30_DIAS: [],
    VENCE_EM_31_A_90_DIAS: [],
    SEM_DATA: [],
  };

  alertas.forEach((a) => {
    if (grupos[a.grupo]) {
      grupos[a.grupo].push(a);
    } else {
      grupos.SEM_DATA.push(a);
    }
  });

  grupos.VENCIDO.sort((a, b) => (a.dias_diferenca ?? 0) - (b.dias_diferenca ?? 0));
  grupos.VENCE_EM_30_DIAS.sort((a, b) => (a.dias_diferenca ?? 0) - (b.dias_diferenca ?? 0));
  grupos.VENCE_EM_31_A_90_DIAS.sort((a, b) => (a.dias_diferenca ?? 0) - (b.dias_diferenca ?? 0));

  return grupos;
}

/**
 * Retrocompatibilidade com a função legada calcularAlertasFamilia.
 */
export function calcularAlertasFamilia(membros: Membro[]): ItemAgenda[] {
  const hojeISO = new Date().toISOString().slice(0, 10);
  const alertas = calcularAlertasComDataHoje({ membros }, hojeISO);
  return alertas.map((a) => ({
    id: a.id,
    membro_id: a.membro_id,
    membro_nome: a.membro_nome,
    item: a.descricao,
    categoria: a.tipo_label,
    vencimento: a.data || '',
    status: a.grupo === 'VENCIDO' ? 'vencido' : 'vence_em_breve',
  }));
}

/**
 * Atalho para calcular os alertas usando a data de hoje
 */
export function calcularAlertas(dados: DadosAlertasInput): AlertaItem[] {
  const hojeISO = new Date().toISOString().slice(0, 10);
  return calcularAlertasComDataHoje(dados, hojeISO);
}

/**
 * Gera o texto Markdown estruturado da Agenda.md a partir dos alertas.
 */
export function gerarAgendaMarkdown(alertas: AlertaItem[]): string {
  const grupos = agruparAlertasPorGrupo(alertas);

  return `# Agenda de Saúde da Família

## 🔴 Vencidos
| Membro | Categoria | Item | Vencimento | Status |
| --- | --- | --- | --- | --- |
${grupos.VENCIDO.map((a) => `| ${a.membro_nome} | ${a.tipo_label} | ${a.descricao} | ${a.data || '-'} | ${a.dias_texto} |`).join('\n') || '| - | - | Nenhum item vencido | - | - |'}

## 🟡 Vence em breve (próximos 30 dias)
| Membro | Categoria | Item | Vencimento | Status |
| --- | --- | --- | --- | --- |
${grupos.VENCE_EM_30_DIAS.map((a) => `| ${a.membro_nome} | ${a.tipo_label} | ${a.descricao} | ${a.data || '-'} | ${a.dias_texto} |`).join('\n') || '| - | - | Nenhum item vencendo em 30 dias | - | - |'}

## 🔵 Próximos 31 a 90 dias
| Membro | Categoria | Item | Vencimento | Status |
| --- | --- | --- | --- | --- |
${grupos.VENCE_EM_31_A_90_DIAS.map((a) => `| ${a.membro_nome} | ${a.tipo_label} | ${a.descricao} | ${a.data || '-'} | ${a.dias_texto} |`).join('\n') || '| - | - | Nenhum item no período de 31-90 dias | - | - |'}

## 🟢 Sem data cadastrada
| Membro | Categoria | Item |
| --- | --- | --- |
${grupos.SEM_DATA.map((a) => `| ${a.membro_nome} | ${a.tipo_label} | ${a.descricao} |`).join('\n') || '| - | - | Nenhum item sem data |'}
`;
}

