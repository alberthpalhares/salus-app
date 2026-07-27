import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportarDadosUsuario } from '../src/servicos/portabilidade/exportar';
import { analisarArquivoBackup } from '../src/servicos/portabilidade/importar';
import {
  Familia,
  Membro,
  Medicamento,
  Vacina,
  Checkup,
  Exame,
  Evento,
} from '../src/types/dominio';

const {
  mockFamilia,
  mockMembros,
  mockMedicamentos,
  mockVacinas,
  mockCheckups,
  mockExames,
  mockEventos,
} = vi.hoisted(() => {
  const familia: Familia = {
    nome: 'Família Salus Teste',
    atualizado_em: '2026-07-25',
  };

  const membros: Membro[] = [
    {
      id: 'm1',
      nome: 'Ana Silva',
      tipo: 'pessoa',
      vinculo: 'biologico',
      condicoes_ativas: ['Hipertensão'],
      alergias: ['Dipirona'],
    },
    {
      id: 'm2',
      nome: 'Rex',
      tipo: 'cao',
      vinculo: 'biologico',
      raca: 'Golden Retriever',
    },
  ];

  const medicamentos: Medicamento[] = [
    {
      id: 'med1',
      membro_id: 'm1',
      nome: 'Losartana',
      dose: '50mg',
      frequencia: '1x ao dia',
      status: 'em_uso',
      desde: '2025-01-10',
      renova_em: '2026-08-10',
    },
  ];

  const vacinas: Vacina[] = [
    {
      id: 'vac1',
      membro_id: 'm2',
      nome: 'Múltipla V10',
      aplicada_em: '2025-08-01',
      proxima_em: '2026-08-01',
    },
  ];

  const checkups: Checkup[] = [
    {
      id: 'chk1',
      membro_id: 'm1',
      tipo: 'Consulta Cardiologia',
      data: '2026-08-15',
    },
  ];

  const exames: Exame[] = [
    {
      id: 'ex1',
      membro_id: 'm1',
      data: '2026-07-01',
      painel: 'Exame de Sangue',
      marcador: 'Glicose',
      valor: '90',
      unidade: 'mg/dL',
      faixa_referencia_laudo: '70-99 mg/dL',
      flag: 'normal',
    },
  ];

  const eventos: Evento[] = [
    {
      id: 'evt1',
      membro_id: 'm1',
      data: '2026-07-01',
      tipo: 'Exame Realizado',
      descricao: 'Coleta de sangue no laboratório',
    },
  ];

  return {
    mockFamilia: familia,
    mockMembros: membros,
    mockMedicamentos: medicamentos,
    mockVacinas: vacinas,
    mockCheckups: checkups,
    mockExames: exames,
    mockEventos: eventos,
  };
});

vi.mock('../src/data/repositorios/familia', () => ({
  obter: vi.fn().mockImplementation(() => Promise.resolve(mockFamilia)),
}));

vi.mock('../src/data/repositorios/membros', () => ({
  listar: vi.fn().mockImplementation(() => Promise.resolve(mockMembros)),
}));

vi.mock('../src/data/repositorios/medicamentos', () => ({
  listar: vi.fn().mockImplementation(() => Promise.resolve(mockMedicamentos)),
}));

vi.mock('../src/data/repositorios/vacinas', () => ({
  listar: vi.fn().mockImplementation(() => Promise.resolve(mockVacinas)),
}));

vi.mock('../src/data/repositorios/checkups', () => ({
  listar: vi.fn().mockImplementation(() => Promise.resolve(mockCheckups)),
}));

vi.mock('../src/data/repositorios/exames', () => ({
  listar: vi.fn().mockImplementation(() => Promise.resolve(mockExames)),
}));

vi.mock('../src/data/repositorios/eventos', () => ({
  listar: vi.fn().mockImplementation(() => Promise.resolve(mockEventos)),
}));

vi.mock('../src/data/repositorios/analises', () => ({
  listar: vi.fn().mockImplementation(() => Promise.resolve([])),
}));

vi.mock('../src/data/repositorios/caixaEntrada', () => ({
  listar: vi.fn().mockImplementation(() => Promise.resolve([])),
}));

vi.mock('../src/data/repositorios/documentos', () => ({
  listar: vi.fn().mockImplementation(() => Promise.resolve([])),
}));

vi.mock('../src/data/repositorios/conversas', () => ({
  obterConversa: vi.fn().mockImplementation(() => Promise.resolve([])),
}));

vi.mock('../src/data/repositorios/perfilConfig', () => ({
  obter: vi.fn().mockImplementation(() => Promise.resolve(null)),
  salvar: vi.fn().mockImplementation(() => Promise.resolve(undefined)),
}));

describe('Portabilidade (exportar -> importar -> exportar)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exporta os dados para um ZIP e depois importa recuperando conteúdo idêntico (roundtrip)', async () => {
    // 1. Exporta dados
    const blobExportado = await exportarDadosUsuario('uid_123', 'token_123', false);
    expect(blobExportado).toBeDefined();
    expect(blobExportado.size).toBeGreaterThan(0);

    // Converte o Blob para objeto File compatível com a análise de importação
    const fileExportado = new File([blobExportado], 'salus-backup-test.zip', {
      type: 'application/zip',
    });

    // 2. Importa o ZIP exportado
    const resumo = await analisarArquivoBackup(fileExportado);

    expect(resumo.temBackupJson).toBe(true);
    expect(resumo.nomeFamilia).toBe('Família Salus Teste');
    expect(resumo.membrosCount).toBe(2);
    expect(resumo.medicamentosCount).toBe(1);
    expect(resumo.vacinasCount).toBe(1);
    expect(resumo.checkupsCount).toBe(1);
    expect(resumo.examesCount).toBe(1);
    expect(resumo.eventosCount).toBe(1);

    // Compara os dados importados com os dados originais
    const dadosImportados = resumo.dadosParaImportar;
    expect(dadosImportados.membros).toEqual(mockMembros);
    expect(dadosImportados.medicamentos).toEqual(mockMedicamentos);
    expect(dadosImportados.vacinas).toEqual(mockVacinas);
    expect(dadosImportados.checkups).toEqual(mockCheckups);
    expect(dadosImportados.exames).toEqual(mockExames);
    expect(dadosImportados.eventos).toEqual(mockEventos);
  });
});
