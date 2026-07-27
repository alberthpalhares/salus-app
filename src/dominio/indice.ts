import {
  Familia,
  Membro,
  Medicamento,
  Vacina,
  Checkup,
  Exame,
  TipoMembro,
  VinculoMembro,
  FamiliaIndice
} from '../types/dominio';
import { obter as obterFamilia } from '../data/repositorios/familia';
import { listar as listarMembros } from '../data/repositorios/membros';
import { listar as listarMedicamentos } from '../data/repositorios/medicamentos';
import { listar as listarVacinas } from '../data/repositorios/vacinas';
import { listar as listarCheckups } from '../data/repositorios/checkups';
import { listar as listarExames } from '../data/repositorios/exames';

export interface SnapshotIndiceMembro {
  id: string;
  nome: string;
  tipo: TipoMembro;
  vinculo: VinculoMembro;
  condicoes_ativas: string[];
  medicamentos_em_uso: {
    nome: string;
    dose: string;
    frequencia: string;
    desde?: string;
    renova_em?: string;
  }[];
  medicamentos_prescritos: {
    nome: string;
    dose: string;
    frequencia: string;
    prescrito_por?: string;
  }[];
  vacinas: {
    nome: string;
    aplicada_em: string;
    proxima_em?: string;
  }[];
  proximos_checkups: {
    tipo: string;
    data: string;
  }[];
  ultimo_exame_em?: string;
  marcadores_chave: {
    marcador: string;
    valor: string;
    unidade: string;
    faixa_referencia_laudo: string;
    flag: string;
    data: string;
  }[];
}

export interface SnapshotIndiceFamilia {
  nome_familia: string;
  atualizado_em: string;
  membros: SnapshotIndiceMembro[];
}

export interface DadosParaIndice {
  familia: Familia | null;
  membros: Membro[];
  medicamentos: Medicamento[];
  vacinas: Vacina[];
  checkups: Checkup[];
  exames: Exame[];
}

/**
 * Função pura que monta o snapshot compacto do índice em formato JSON para enviar à IA.
 * Regra Clínica 8 - Índice Primeiro.
 */
export function montarSnapshotDoIndice(dados: DadosParaIndice): SnapshotIndiceFamilia {
  const nomeFamilia = dados.familia?.nome || 'Família';
  const atualizadoEm = dados.familia?.atualizado_em || new Date().toISOString().slice(0, 10);

  const membrosSnapshot: SnapshotIndiceMembro[] = (dados.membros || []).map((m) => {
    // Medicamentos
    const medsDoMembro = (dados.medicamentos || []).filter((med) => med.membro_id === m.id);
    const medicamentosEmUso = medsDoMembro
      .filter((med) => med.status === 'em_uso')
      .map((med) => ({
        nome: med.nome,
        dose: med.dose,
        frequencia: med.frequencia,
        desde: med.desde,
        renova_em: med.renova_em,
      }));

    const medicamentosPrescritos = medsDoMembro
      .filter((med) => med.status === 'prescrito')
      .map((med) => ({
        nome: med.nome,
        dose: med.dose,
        frequencia: med.frequencia,
        prescrito_por: med.prescrito_por,
      }));

    // Vacinas
    const vacinasDoMembro = (dados.vacinas || [])
      .filter((v) => v.membro_id === m.id)
      .map((v) => ({
        nome: v.nome,
        aplicada_em: v.aplicada_em,
        proxima_em: v.proxima_em,
      }));

    // Checkups
    const checkupsDoMembro = (dados.checkups || [])
      .filter((c) => c.membro_id === m.id)
      .sort((a, b) => a.data.localeCompare(b.data))
      .map((c) => ({
        tipo: c.tipo,
        data: c.data,
      }));

    // Exames e marcadores chave (máximo 8 mais recentes)
    const examesDoMembro = (dados.exames || [])
      .filter((e) => e.membro_id === m.id)
      .sort((a, b) => b.data.localeCompare(a.data));

    const ultimoExameEm = examesDoMembro.length > 0 ? examesDoMembro[0].data : undefined;

    const marcadoresChave = examesDoMembro.slice(0, 8).map((e) => ({
      marcador: e.marcador,
      valor: e.valor,
      unidade: e.unidade,
      faixa_referencia_laudo: e.faixa_referencia_laudo || 'faixa não informada no laudo',
      flag: e.flag,
      data: e.data,
    }));

    return {
      id: m.id,
      nome: m.nome,
      tipo: m.tipo || (m.especie === 'Cão' ? 'cao' : m.especie === 'Gato' ? 'gato' : 'pessoa'),
      vinculo: m.vinculo || 'biologico',
      condicoes_ativas: m.condicoes_ativas || m.condicoes || [],
      medicamentos_em_uso: medicamentosEmUso,
      medicamentos_prescritos: medicamentosPrescritos,
      vacinas: vacinasDoMembro,
      proximos_checkups: checkupsDoMembro,
      ultimo_exame_em: ultimoExameEm,
      marcadores_chave: marcadoresChave,
    };
  });

  return {
    nome_familia: nomeFamilia,
    atualizado_em: atualizadoEm,
    membros: membrosSnapshot,
  };
}

/**
 * Converte um snapshot para string formatada de texto (compatibilidade).
 */
export function gerarSnapshotIndiceCompacto(indice: FamiliaIndice | SnapshotIndiceFamilia): string {
  if ('membros' in indice && Array.isArray(indice.membros)) {
    const snapshot = 'nome_familia' in indice && typeof (indice as SnapshotIndiceFamilia).membros[0]?.tipo !== 'undefined'
      ? (indice as SnapshotIndiceFamilia)
      : null;

    if (snapshot) {
      const linhas: string[] = [];
      linhas.push(`Família: ${snapshot.nome_familia}`);
      linhas.push(`Membros (${snapshot.membros.length}):`);
      snapshot.membros.forEach((m) => {
        linhas.push(`- ${m.nome} (${m.tipo} - vínculo: ${m.vinculo})`);
        if (m.condicoes_ativas.length > 0) {
          linhas.push(`  Condições Ativas: ${m.condicoes_ativas.join(', ')}`);
        }
        if (m.medicamentos_em_uso.length > 0) {
          const meds = m.medicamentos_em_uso.map((med) => `${med.nome} (${med.dose})`).join(', ');
          linhas.push(`  Medicamentos em uso: ${meds}`);
        }
      });
      return linhas.join('\n');
    }
  }
  return 'Família sem membros cadastrados.';
}

/**
 * Carrega todos os dados do Firestore e gera o snapshot do índice para o usuário.
 */
export async function carregarSnapshotDoIndice(uid: string): Promise<SnapshotIndiceFamilia> {
  if (!uid) {
    return {
      nome_familia: 'Família',
      atualizado_em: new Date().toISOString().slice(0, 10),
      membros: [],
    };
  }

  const [familia, membros, medicamentos, vacinas, checkups, exames] = await Promise.all([
    obterFamilia(uid).catch(() => null),
    listarMembros(uid).catch(() => []),
    listarMedicamentos(uid).catch(() => []),
    listarVacinas(uid).catch(() => []),
    listarCheckups(uid).catch(() => []),
    listarExames(uid).catch(() => []),
  ]);

  return montarSnapshotDoIndice({
    familia,
    membros,
    medicamentos,
    vacinas,
    checkups,
    exames,
  });
}

