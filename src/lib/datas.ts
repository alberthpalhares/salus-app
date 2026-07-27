/**
 * Utilitários para manipular datas em formato estrito AAAA-MM-DD.
 * Regra Salus: Datas sempre em AAAA-MM-DD como string.
 */

export function obterDataHojeISO(): string {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

export function formatarDataExtenso(dataISO?: string): string {
  if (!dataISO) return 'Data não informada';
  const partes = dataISO.split('-');
  if (partes.length !== 3) return dataISO;

  const ano = parseInt(partes[0], 10);
  const mes = parseInt(partes[1], 10) - 1;
  const dia = parseInt(partes[2], 10);

  const d = new Date(ano, mes, dia);
  if (isNaN(d.getTime())) return dataISO;

  return d.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function calcularDiferencaDias(dataISO: string): number {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const partes = dataISO.split('-');
  if (partes.length !== 3) return 0;

  const alvo = new Date(
    parseInt(partes[0], 10),
    parseInt(partes[1], 10) - 1,
    parseInt(partes[2], 10)
  );
  alvo.setHours(0, 0, 0, 0);

  const msPorDia = 1000 * 60 * 60 * 24;
  return Math.round((alvo.getTime() - hoje.getTime()) / msPorDia);
}

export function calcularIdade(nascimentoISO?: string): string {
  if (!nascimentoISO) return 'Idade não informada';
  const partes = nascimentoISO.split('-');
  if (partes.length !== 3) return 'Idade não informada';

  const anoNasc = parseInt(partes[0], 10);
  const mesNasc = parseInt(partes[1], 10) - 1;
  const diaNasc = parseInt(partes[2], 10);

  if (isNaN(anoNasc) || isNaN(mesNasc) || isNaN(diaNasc)) return 'Idade não informada';

  const hoje = new Date();
  let anos = hoje.getFullYear() - anoNasc;
  let meses = hoje.getMonth() - mesNasc;

  if (hoje.getDate() < diaNasc) {
    meses--;
  }
  if (meses < 0) {
    anos--;
    meses += 12;
  }

  if (anos < 0) return 'Data futura';
  if (anos === 0) {
    if (meses <= 0) return 'Menos de 1 mês';
    return meses === 1 ? '1 mês' : `${meses} meses`;
  }
  if (meses === 0) {
    return anos === 1 ? '1 ano' : `${anos} anos`;
  }
  return `${anos} ${anos === 1 ? 'ano' : 'anos'} e ${meses} ${meses === 1 ? 'mês' : 'meses'}`;
}
