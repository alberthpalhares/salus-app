import { describe, it, expect } from 'vitest';
import { Membro, CondicaoSaudeEstruturada, ProfissionalSaude, RegistroPrecoMedicamento } from '../src/types/dominio';

describe('Novos Recursos SISAFAM', () => {
  it('deve formatar corretamente integrante com avatar e tipo sanguíneo', () => {
    const membro: Membro = {
      id: 'm1',
      nome: 'Carlos Silva',
      tipo: 'pessoa',
      avatar_id: 'homem_1',
      vinculo: 'biologico',
      tipo_sanguineo: 'O+',
    };

    expect(membro.avatar_id).toBe('homem_1');
    expect(membro.tipo_sanguineo).toBe('O+');
  });

  it('deve estruturar condicao de saude com gravidade e categoria', () => {
    const condicao: CondicaoSaudeEstruturada = {
      id: 'c1',
      membro_id: 'm1',
      nome: 'Hipertensão Arterial',
      categoria: 'cronica',
      gravidade: 'alta',
      status: 'ativa',
      diagnostico_em: '2024-01-15',
      medico_responsavel: 'Dr. Roberto',
    };

    expect(condicao.gravidade).toBe('alta');
    expect(condicao.categoria).toBe('cronica');
  });

  it('deve calcular variacao percentual de preco de medicamento', () => {
    const compra1: RegistroPrecoMedicamento = {
      id: 'p1',
      medicamento_nome: 'Losartana 50mg',
      data_compra: '2026-01-01',
      preco: 20.0,
      quantidade_embalagem: '30 comp',
      farmacia_estabelecimento: 'Drogasil',
    };

    const compra2: RegistroPrecoMedicamento = {
      id: 'p2',
      medicamento_nome: 'Losartana 50mg',
      data_compra: '2026-02-01',
      preco: 25.0,
      quantidade_embalagem: '30 comp',
      farmacia_estabelecimento: 'Drogasil',
    };

    const variacao = ((compra2.preco - compra1.preco) / compra1.preco) * 100;
    expect(variacao).toBe(25.0); // +25% de aumento
  });

  it('deve vincular profissional de saude a integrantes da familia', () => {
    const prof: ProfissionalSaude = {
      id: 'prof1',
      nome: 'Dra. Paula Lima',
      tipo: 'medico',
      especialidade: 'Pediatria',
      membros_vinculados: ['m1', 'm2'],
    };

    expect(prof.membros_vinculados).toContain('m1');
    expect(prof.membros_vinculados.length).toBe(2);
  });
});
