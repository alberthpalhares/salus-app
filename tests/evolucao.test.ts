import { describe, it, expect } from 'vitest';
import { Membro, Exame } from '../src/types/dominio';

describe('Módulo de Evolução de Marcadores & Cruzamento Genético', () => {
  const membrosExemplo: Membro[] = [
    { id: '1', nome: 'Ana (Mãe)', tipo: 'pessoa', vinculo: 'biologico' },
    { id: '2', nome: 'Pedro (Filho)', tipo: 'pessoa', vinculo: 'biologico' },
    { id: '3', nome: 'Lucas (Adotivo)', tipo: 'pessoa', vinculo: 'adotivo' },
    { id: '4', nome: 'Thor (Pet)', tipo: 'cao', vinculo: 'biologico' },
  ];

  const examesExemplo: Exame[] = [
    { id: 'e1', membro_id: '1', data: '2026-01-10', painel: 'Lipídico', marcador: 'Colesterol Total', valor: '220', unidade: 'mg/dL', faixa_referencia_laudo: '<190', flag: 'alto' },
    { id: 'e2', membro_id: '1', data: '2026-05-15', painel: 'Lipídico', marcador: 'Colesterol Total', valor: '240', unidade: 'mg/dL', faixa_referencia_laudo: '<190', flag: 'alto' },
    { id: 'e3', membro_id: '2', data: '2026-04-20', painel: 'Lipídico', marcador: 'Colesterol Total', valor: '210', unidade: 'mg/dL', faixa_referencia_laudo: '<190', flag: 'alto' },
    { id: 'e4', membro_id: '3', data: '2026-03-12', painel: 'Lipídico', marcador: 'Colesterol Total', valor: '230', unidade: 'mg/dL', faixa_referencia_laudo: '<190', flag: 'alto' },
    { id: 'e5', membro_id: '4', data: '2026-02-01', painel: 'Bioquímico', marcador: 'Colesterol Total', valor: '180', unidade: 'mg/dL', faixa_referencia_laudo: '<150', flag: 'alto' },
  ];

  it('deve extrair e ordenar valores numéricos de marcadores', () => {
    const examesAna = examesExemplo.filter(e => e.membro_id === '1');
    const valoresNum = examesAna.map(e => parseFloat(e.valor.replace(',', '.')));
    expect(valoresNum).toEqual([220, 240]);
  });

  it('deve filtrar para cruzamento genético apenas membros da mesma espécie com vínculo biológico', () => {
    const membroFoco = membrosExemplo[0]; // Ana (Humana, Biológico)

    const membrosElegiveisParaCruzamento = membrosExemplo.filter(m => {
      const mesmaEspecie = (m.tipo || 'pessoa') === (membroFoco.tipo || 'pessoa');
      const ehBiologico = m.vinculo === 'biologico' || !m.vinculo;
      return mesmaEspecie && ehBiologico;
    });

    const idsElegiveis = membrosElegiveisParaCruzamento.map(m => m.id);
    expect(idsElegiveis).toContain('1'); // Ana
    expect(idsElegiveis).toContain('2'); // Pedro (Biológico)
    expect(idsElegiveis).not.toContain('3'); // Lucas (Adotivo - isolado do cruzamento genético)
    expect(idsElegiveis).not.toContain('4'); // Thor (Pet - nunca misturado com humanos)
  });
});
