import { describe, it, expect } from 'vitest';
import { montarSnapshotDoIndice, DadosParaIndice } from '../src/dominio/indice';
import { Membro, Exame, Medicamento, Vacina, Checkup } from '../src/types/dominio';

describe('src/dominio/indice.ts', () => {
  const membroHumano: Membro = {
    id: 'm_ana',
    nome: 'Ana Silva',
    tipo: 'pessoa',
    vinculo: 'biologico',
    condicoes_ativas: ['Hipertensão'],
  };

  it('não inclui documentos originais nem histórico completo no snapshot', () => {
    const dados: DadosParaIndice = {
      familia: { nome: 'Família Silva', atualizado_em: '2026-07-25' },
      membros: [membroHumano],
      medicamentos: [
        {
          id: 'med1',
          membro_id: 'm_ana',
          nome: 'Losartana',
          dose: '50mg',
          frequencia: '1x ao dia',
          status: 'em_uso',
        },
      ],
      vacinas: [],
      checkups: [],
      exames: [
        {
          id: 'ex1',
          membro_id: 'm_ana',
          data: '2026-07-10',
          painel: 'Cardio',
          marcador: 'Glicose',
          valor: '95',
          unidade: 'mg/dL',
          faixa_referencia_laudo: '70 a 99 mg/dL',
          flag: 'normal',
          documento_id: 'drive_file_id_secreto_xyz.pdf', // id de doc que não deve vazar como arquivo cru
        },
      ],
    };

    const snapshot = montarSnapshotDoIndice(dados);

    expect(snapshot.nome_familia).toBe('Família Silva');
    expect(snapshot.membros).toHaveLength(1);

    const mSnap = snapshot.membros[0];
    expect(mSnap.nome).toBe('Ana Silva');
    expect(mSnap.condicoes_ativas).toEqual(['Hipertensão']);

    // O snapshot possui apenas os marcadores e campos compactos do índice
    expect(mSnap).not.toHaveProperty('documento_original');
    expect(mSnap).not.toHaveProperty('eventos_completos');
    expect(mSnap).not.toHaveProperty('arquivos_pdf');

    // Verifica que os marcadores não trazem id de documento nem binários
    expect(mSnap.marcadores_chave[0]).toEqual({
      marcador: 'Glicose',
      valor: '95',
      unidade: 'mg/dL',
      faixa_referencia_laudo: '70 a 99 mg/dL',
      flag: 'normal',
      data: '2026-07-10',
    });
  });

  it('limita os marcadores-chave aos 8 exames mais recentes', () => {
    const examesMuitos: Exame[] = Array.from({ length: 15 }, (_, i) => ({
      id: `ex_${i}`,
      membro_id: 'm_ana',
      data: `2026-01-${(i + 1).toString().padStart(2, '0')}`,
      painel: 'Hemograma',
      marcador: `Marcador_${i + 1}`,
      valor: `${10 + i}`,
      unidade: 'mg/dL',
      faixa_referencia_laudo: '10-50',
      flag: 'normal',
    }));

    const dados: DadosParaIndice = {
      familia: { nome: 'Família Silva', atualizado_em: '2026-07-25' },
      membros: [membroHumano],
      medicamentos: [],
      vacinas: [],
      checkups: [],
      exames: examesMuitos,
    };

    const snapshot = montarSnapshotDoIndice(dados);
    const mSnap = snapshot.membros[0];

    // Deve limitar rigorosamente a no máximo 8 marcadores
    expect(mSnap.marcadores_chave).toHaveLength(8);

    // Como são ordenados do mais recente para o mais antigo, o primeiro marcador deve ser o do dia 15
    expect(mSnap.marcadores_chave[0].marcador).toBe('Marcador_15');
    expect(mSnap.marcadores_chave[7].marcador).toBe('Marcador_8');
  });

  it('define "faixa não informada no laudo" quando a faixa_referencia_laudo não é informada', () => {
    const dados: DadosParaIndice = {
      familia: null,
      membros: [membroHumano],
      medicamentos: [],
      vacinas: [],
      checkups: [],
      exames: [
        {
          id: 'ex_sem_faixa',
          membro_id: 'm_ana',
          data: '2026-07-20',
          painel: 'Exame',
          marcador: 'Vitamina D',
          valor: '32',
          unidade: 'ng/mL',
          faixa_referencia_laudo: '', // vazio
          flag: 'nao_informado',
        },
      ],
    };

    const snapshot = montarSnapshotDoIndice(dados);
    expect(snapshot.membros[0].marcadores_chave[0].faixa_referencia_laudo).toBe(
      'faixa não informada no laudo'
    );
  });
});
