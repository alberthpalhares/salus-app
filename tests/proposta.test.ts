import { describe, it, expect, vi, beforeEach } from 'vitest';
import { aplicarProposta } from '../src/dominio/proposta';
import { SelecaoProposta, Proposta } from '../src/types/propostas';

// Mock das dependências externas do Firebase e API
const mockSet = vi.fn();
const mockUpdate = vi.fn();
const mockCommit = vi.fn().mockResolvedValue(undefined);

vi.mock('firebase/firestore', () => {
  return {
    writeBatch: vi.fn(() => ({
      set: mockSet,
      update: mockUpdate,
      commit: mockCommit,
    })),
    doc: vi.fn((dbInstance, path) => ({ path })),
  };
});

vi.mock('../src/data/firebase', () => ({
  db: {},
}));

vi.mock('../src/servicos/api', () => ({
  organizarArquivoDrive: vi.fn(),
  fazerUploadParaDrive: vi.fn(),
}));

import { organizarArquivoDrive, fazerUploadParaDrive } from '../src/servicos/api';

describe('src/dominio/proposta.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCommit.mockResolvedValue(undefined);
  });

  const propostaBase: Proposta = {
    tipo_documento: 'Receita Médica',
    membro_identificado: {
      id: 'm1',
      nome: 'Ana Silva',
      tipo: 'pessoa',
      confianca: 'alta',
    },
    medicamentos: [
      {
        nome: 'Amoxicilina',
        dose: '500mg',
        frequencia: '8/8h por 7 dias',
        status_sugerido: 'prescrito',
        prescrito_por: 'Dr. Carlos',
      },
    ],
  };

  it('salva medicamento de receita como "prescrito" e nunca como "em_uso" sem confirmação', async () => {
    const selecao: SelecaoProposta = {
      membroId: 'm1',
      membroNome: 'Ana Silva',
      documento: {
        nomePadronizado: '2026-07-25_Ana_Silva_Receita.pdf',
        tipo: 'Receita Médica',
        data: '2026-07-25',
      },
      medicamentos: [
        {
          incluir: true,
          nome: 'Amoxicilina',
          dose: '500mg',
          frequencia: '8/8h por 7 dias',
          status: 'prescrito', // Receita recém lida -> prescrito
          prescrito_por: 'Dr. Carlos',
        },
      ],
      exames: [],
      vacinas: [],
      eventos: [],
    };

    const res = await aplicarProposta('uid_123', propostaBase, selecao);

    expect(res.success).toBe(true);
    expect(mockCommit).toHaveBeenCalledTimes(1);

    // Encontra a chamada do batch.set para o medicamento
    const chamadaMed = mockSet.mock.calls.find((call) =>
      call[0].path.includes('medicamentos/')
    );
    expect(chamadaMed).toBeDefined();
    const medSalvo = chamadaMed[1];
    expect(medSalvo.status).toBe('prescrito');
    expect(medSalvo.desde).toBeUndefined(); // Só tem 'desde' se for em_uso
  });

  it('salva medicamento com status "em_uso" quando o usuário escolhe explicitamente "Já estou tomando"', async () => {
    const selecao: SelecaoProposta = {
      membroId: 'm1',
      membroNome: 'Ana Silva',
      documento: {
        nomePadronizado: '2026-07-25_Ana_Silva_Receita.pdf',
        tipo: 'Receita Médica',
        data: '2026-07-25',
      },
      medicamentos: [
        {
          incluir: true,
          nome: 'Amoxicilina',
          dose: '500mg',
          frequencia: '8/8h por 7 dias',
          status: 'em_uso', // Usuário respondeu que já comprou/está tomando
          prescrito_por: 'Dr. Carlos',
        },
      ],
      exames: [],
      vacinas: [],
      eventos: [],
    };

    const res = await aplicarProposta('uid_123', propostaBase, selecao);

    expect(res.success).toBe(true);
    const chamadaMed = mockSet.mock.calls.find((call) =>
      call[0].path.includes('medicamentos/')
    );
    expect(chamadaMed).toBeDefined();
    expect(chamadaMed[1].status).toBe('em_uso');
    expect(chamadaMed[1].desde).toBeDefined();
  });

  it('não grava itens desmarcados (incluir: false)', async () => {
    const selecao: SelecaoProposta = {
      membroId: 'm1',
      membroNome: 'Ana Silva',
      documento: {
        nomePadronizado: '2026-07-25_Ana_Silva_Exame.pdf',
        tipo: 'Laudo de Exame',
      },
      exames: [
        {
          incluir: false, // Desmarcado pelo usuário
          marcador: 'Colesterol',
          valor: '220',
          unidade: 'mg/dL',
          faixa_referencia_laudo: '<200',
          flag: 'alterado',
        },
        {
          incluir: true, // Mantido pelo usuário
          marcador: 'Triglicerídeos',
          valor: '140',
          unidade: 'mg/dL',
          faixa_referencia_laudo: '<150',
          flag: 'normal',
        },
      ],
      medicamentos: [],
      vacinas: [],
      eventos: [],
    };

    await aplicarProposta('uid_123', propostaBase, selecao);

    const chamadasExame = mockSet.mock.calls.filter((call) =>
      call[0].path.includes('exames/')
    );
    expect(chamadasExame).toHaveLength(1);
    expect(chamadasExame[0][1].marcador).toBe('Triglicerídeos');
  });

  it('se falhar no meio do upload para o Drive, não deixa dado parcial e retorna erroDrive', async () => {
    vi.mocked(fazerUploadParaDrive).mockRejectedValueOnce(
      new Error('Falha de conexão com o Drive')
    );

    const selecao: SelecaoProposta = {
      itemCaixaEntradaId: 'caixa_item_999',
      membroId: 'm1',
      membroNome: 'Ana Silva',
      documento: {
        drive_file_id: 'drive_file_123',
        nomePadronizado: '2026-07-25_Ana_Silva_Exame.pdf',
        tipo: 'Laudo de Exame',
      },
      exames: [
        {
          incluir: true,
          marcador: 'Hemoglobina',
          valor: '14',
          unidade: 'g/dL',
          faixa_referencia_laudo: '12-16',
          flag: 'normal',
        },
      ],
      medicamentos: [],
      vacinas: [],
      eventos: [],
    };

    const fakeFile = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    const res = await aplicarProposta('uid_123', propostaBase, selecao, fakeFile);

    expect(res.success).toBe(false);
    expect(res.erroDrive).toContain('Falha de conexão com o Drive');

    // O batch de dados clínicos NUNCA deve ter sido submetido
    expect(mockCommit).not.toHaveBeenCalled();
    expect(mockSet).not.toHaveBeenCalled(); // Nenhum dado clínico salvo!
  });
});
