import { describe, it, expect } from 'vitest';
import {
  calcularDiferencaDiasComHoje,
  classificarGrupoAlerta,
  formatarDiasTexto,
  calcularAlertasComDataHoje,
  agruparAlertasPorGrupo,
  AlertaItem,
} from '../src/dominio/alertas';
import { Membro } from '../src/types/dominio';

describe('src/dominio/alertas.ts', () => {
  describe('calcularDiferencaDiasComHoje', () => {
    it('calcula corretamente item vencido ontem (-1 dia)', () => {
      const diff = calcularDiferencaDiasComHoje('2026-07-24', '2026-07-25');
      expect(diff).toBe(-1);
    });

    it('calcula corretamente item vencendo hoje (0 dias)', () => {
      const diff = calcularDiferencaDiasComHoje('2026-07-25', '2026-07-25');
      expect(diff).toBe(0);
    });

    it('calcula corretamente item vencendo em 30 dias', () => {
      const diff = calcularDiferencaDiasComHoje('2026-08-24', '2026-07-25');
      expect(diff).toBe(30);
    });

    it('calcula corretamente item vencendo em 89 dias', () => {
      const diff = calcularDiferencaDiasComHoje('2026-10-22', '2026-07-25');
      expect(diff).toBe(89);
    });

    it('calcula corretamente item vencendo em 91 dias', () => {
      const diff = calcularDiferencaDiasComHoje('2026-10-24', '2026-07-25');
      expect(diff).toBe(91);
    });

    it('trata datas inválidas ou vazias retornando 0', () => {
      expect(calcularDiferencaDiasComHoje('', '2026-07-25')).toBe(0);
      expect(calcularDiferencaDiasComHoje('2026-07-25', '')).toBe(0);
    });

    it('calcula virada de ano corretamente (ex: 31/12 para 01/01)', () => {
      const diffAmanha = calcularDiferencaDiasComHoje('2027-01-01', '2026-12-31');
      expect(diffAmanha).toBe(1);

      const diffOntem = calcularDiferencaDiasComHoje('2026-12-30', '2026-12-31');
      expect(diffOntem).toBe(-1);

      const diff30Dias = calcularDiferencaDiasComHoje('2027-01-30', '2026-12-31');
      expect(diff30Dias).toBe(30);
    });

    it('calcula fevereiro em ano bissexto (2028 tem 29 dias)', () => {
      // 28/02 para 29/02/2028 (ano bissexto) = +1 dia
      const diffBissexto1 = calcularDiferencaDiasComHoje('2028-02-29', '2028-02-28');
      expect(diffBissexto1).toBe(1);

      // 29/02 para 01/03/2028 = +1 dia
      const diffBissexto2 = calcularDiferencaDiasComHoje('2028-03-01', '2028-02-29');
      expect(diffBissexto2).toBe(1);

      // 28/02 para 01/03 em ano NÃO bissexto (2027) = +1 dia (28/02 -> 01/03)
      const diffNaoBissexto = calcularDiferencaDiasComHoje('2027-03-01', '2027-02-28');
      expect(diffNaoBissexto).toBe(1);
    });
  });

  describe('classificarGrupoAlerta', () => {
    it('classifica dias < 0 como VENCIDO', () => {
      expect(classificarGrupoAlerta(-1)).toBe('VENCIDO');
      expect(classificarGrupoAlerta(-10)).toBe('VENCIDO');
    });

    it('classifica dias entre 0 e 30 como VENCE_EM_30_DIAS', () => {
      expect(classificarGrupoAlerta(0)).toBe('VENCE_EM_30_DIAS');
      expect(classificarGrupoAlerta(1)).toBe('VENCE_EM_30_DIAS');
      expect(classificarGrupoAlerta(30)).toBe('VENCE_EM_30_DIAS');
    });

    it('classifica dias entre 31 e 90 como VENCE_EM_31_A_90_DIAS', () => {
      expect(classificarGrupoAlerta(31)).toBe('VENCE_EM_31_A_90_DIAS');
      expect(classificarGrupoAlerta(89)).toBe('VENCE_EM_31_A_90_DIAS');
      expect(classificarGrupoAlerta(90)).toBe('VENCE_EM_31_A_90_DIAS');
    });

    it('classifica dias > 90 ou undefined como SEM_DATA', () => {
      expect(classificarGrupoAlerta(91)).toBe('SEM_DATA');
      expect(classificarGrupoAlerta(120)).toBe('SEM_DATA');
      expect(classificarGrupoAlerta(undefined)).toBe('SEM_DATA');
    });
  });

  describe('formatarDiasTexto', () => {
    it('formata texto de vencido ontem e há N dias', () => {
      expect(formatarDiasTexto(-1, 'VENCIDO')).toBe('Venceu ontem');
      expect(formatarDiasTexto(-5, 'VENCIDO')).toBe('Venceu há 5 dias');
    });

    it('formata texto de vence hoje e amanhã', () => {
      expect(formatarDiasTexto(0, 'VENCE_EM_30_DIAS')).toBe('Vence hoje');
      expect(formatarDiasTexto(1, 'VENCE_EM_30_DIAS')).toBe('Vence amanhã');
      expect(formatarDiasTexto(15, 'VENCE_EM_30_DIAS')).toBe('Vence em 15 dias');
    });

    it('formata texto para sem data', () => {
      expect(formatarDiasTexto(undefined, 'SEM_DATA')).toBe('Sem data informada');
    });
  });

  describe('calcularAlertasComDataHoje e agruparAlertasPorGrupo', () => {
    const membroTeste: Membro = {
      id: 'm1',
      nome: 'Ana Silva',
      tipo: 'pessoa',
      vinculo: 'biologico',
    };

    it('filtra itens com mais de 90 dias e inclui itens sem data em SEM_DATA', () => {
      const alertas = calcularAlertasComDataHoje(
        {
          membros: [membroTeste],
          vacinas: [
            { id: 'v1', membro_id: 'm1', nome: 'Gripe', aplicada_em: '2025-07-01', proxima_em: '2026-07-24' }, // -1 dia -> VENCIDO
            { id: 'v2', membro_id: 'm1', nome: 'Tétano', aplicada_em: '2025-07-01', proxima_em: '2026-07-25' }, // 0 dias -> 30 DIAS
            { id: 'v3', membro_id: 'm1', nome: 'Hepatite', aplicada_em: '2025-07-01', proxima_em: '2026-10-22' }, // 89 dias -> 31-90 DIAS
            { id: 'v4', membro_id: 'm1', nome: 'Febre Amarela', aplicada_em: '2025-07-01', proxima_em: '2026-10-24' }, // 91 dias -> ignorado por >90
            { id: 'v5', membro_id: 'm1', nome: 'Tríplice', aplicada_em: '2025-07-01' }, // sem proxima_em -> SEM_DATA
          ],
        },
        '2026-07-25'
      );

      const grupos = agruparAlertasPorGrupo(alertas);

      expect(grupos.VENCIDO).toHaveLength(1);
      expect(grupos.VENCIDO[0].descricao).toBe('Vacina Gripe');
      expect(grupos.VENCIDO[0].dias_texto).toBe('Venceu ontem');

      expect(grupos.VENCE_EM_30_DIAS).toHaveLength(1);
      expect(grupos.VENCE_EM_30_DIAS[0].descricao).toBe('Vacina Tétano');
      expect(grupos.VENCE_EM_30_DIAS[0].dias_texto).toBe('Vence hoje');

      expect(grupos.VENCE_EM_31_A_90_DIAS).toHaveLength(1);
      expect(grupos.VENCE_EM_31_A_90_DIAS[0].descricao).toBe('Vacina Hepatite');

      // V4 com 91 dias não entra no radar <=90 dias
      const temV4 = alertas.some((a) => a.id === 'v4');
      expect(temV4).toBe(false);

      expect(grupos.SEM_DATA).toHaveLength(1);
      expect(grupos.SEM_DATA[0].descricao).toBe('Vacina Tríplice');
    });
  });
});
