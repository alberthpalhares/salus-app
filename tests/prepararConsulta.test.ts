import { describe, it, expect } from 'vitest';
import { Membro, Medicamento, CondicaoSaudeEstruturada, Exame } from '../src/types/dominio';

describe('Módulo de Preparar Consulta Médica', () => {
  const membroExemplo: Membro = {
    id: 'm1',
    nome: 'Ana Silva',
    nascimento: '1985-04-12',
    vinculo: 'biologico',
    tipo_sanguineo: 'O+',
    plano_saude: 'Bradesco Saúde',
    alergias: ['Dipirona', 'Penicilina'],
  };

  const medicamentosExemplo: Medicamento[] = [
    { id: 'med1', membro_id: 'm1', nome: 'Losartana 50mg', dose: '50mg', frequencia: '1x ao dia', status: 'em_uso' },
    { id: 'med2', membro_id: 'm1', nome: 'Omeprazol 20mg', dose: '20mg', frequencia: 'Em jejum', status: 'em_uso' },
  ];

  const condicoesExemplo: CondicaoSaudeEstruturada[] = [
    { id: 'c1', membro_id: 'm1', nome: 'Hipertensão Arterial', categoria: 'cronica', gravidade: 'moderada', status: 'ativa' },
  ];

  const examesExemplo: Exame[] = [
    { id: 'e1', membro_id: 'm1', data: '2026-06-01', painel: 'Metabólico', marcador: 'Glicose em Jejum', valor: '115', unidade: 'mg/dL', faixa_referencia_laudo: '70-99', flag: 'alto' },
  ];

  it('deve estruturar corretamente os dados do resumo de consulta', () => {
    const dadosResumo = {
      membro: membroExemplo,
      especialidade: 'Cardiologia',
      motivoConsulta: 'Palpitações e ajuste de anti-hipertensivo',
      duvidas: ['Devo alterar o horário da Losartana?'],
      condicoes: condicoesExemplo,
      medicamentos: medicamentosExemplo,
      examesAlterados: examesExemplo.filter(e => e.flag === 'alto' || e.flag === 'baixo'),
      dataGeracao: '2026-08-01',
    };

    expect(dadosResumo.membro.nome).toBe('Ana Silva');
    expect(dadosResumo.membro.alergias).toHaveLength(2);
    expect(dadosResumo.medicamentos).toHaveLength(2);
    expect(dadosResumo.examesAlterados).toHaveLength(1);
    expect(dadosResumo.examesAlterados[0].marcador).toBe('Glicose em Jejum');
  });
});
