import { Membro, Medicamento, Vacina, Checkup, Exame } from '../../types/dominio';

export function extrairEntidadesDoYamlIndex(parsedYaml: Record<string, any>) {
  let nomeFamilia = '';
  const membros: Membro[] = [];
  const medicamentos: Medicamento[] = [];
  const vacinas: Vacina[] = [];
  const checkups: Checkup[] = [];
  const exames: Exame[] = [];

  if (parsedYaml.nome_familia) {
    nomeFamilia = String(parsedYaml.nome_familia);
  }

  if (Array.isArray(parsedYaml.membros)) {
    for (const mYaml of parsedYaml.membros) {
      const mId = mYaml.id || mYaml.nome?.toLowerCase().replace(/\s+/g, '_') || `m_${Date.now()}`;

      membros.push({
        id: mId,
        nome: mYaml.nome || 'Sem Nome',
        tipo: mYaml.tipo || 'pessoa',
        vinculo: mYaml.vinculo || 'biologico',
        data_nascimento: mYaml.nascimento || mYaml.data_nascimento || '',
        condicoes_ativas: Array.isArray(mYaml.condicoes_ativas) ? mYaml.condicoes_ativas : [],
        alergias: Array.isArray(mYaml.alergias) ? mYaml.alergias : [],
      });

      if (Array.isArray(mYaml.medicamentos_em_uso)) {
        for (const med of mYaml.medicamentos_em_uso) {
          medicamentos.push({
            id: `med_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            membro_id: mId,
            nome: med.nome || 'Medicamento',
            dose: med.dose || '',
            frequencia: med.frequencia || '',
            status: 'em_uso',
            desde: med.desde,
            renova_em: med.renova_em,
          });
        }
      }

      if (Array.isArray(mYaml.medicamentos_prescritos)) {
        for (const med of mYaml.medicamentos_prescritos) {
          medicamentos.push({
            id: `med_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            membro_id: mId,
            nome: med.nome || 'Medicamento',
            dose: med.dose || '',
            frequencia: med.frequencia || '',
            status: 'prescrito',
            prescrito_por: med.prescrito_por,
          });
        }
      }

      if (Array.isArray(mYaml.vacinas)) {
        for (const v of mYaml.vacinas) {
          vacinas.push({
            id: `vac_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            membro_id: mId,
            nome: v.nome || 'Vacina',
            aplicada_em: v.aplicada_em || new Date().toISOString().slice(0, 10),
            proxima_em: v.proxima_em,
          });
        }
      }

      if (Array.isArray(mYaml.proximos_checkups)) {
        for (const c of mYaml.proximos_checkups) {
          checkups.push({
            id: `chk_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            membro_id: mId,
            tipo: c.tipo || 'Checkup',
            data: c.data || new Date().toISOString().slice(0, 10),
          });
        }
      }

      if (Array.isArray(mYaml.marcadores_chave)) {
        for (const mc of mYaml.marcadores_chave) {
          exames.push({
            id: `ex_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            membro_id: mId,
            data: mc.data || new Date().toISOString().slice(0, 10),
            painel: 'Marcadores do Índice',
            marcador: mc.marcador || 'Marcador',
            valor: String(mc.valor || ''),
            unidade: mc.unidade || '',
            faixa_referencia_laudo: mc.faixa_referencia_laudo || 'faixa não informada no laudo',
            flag: mc.flag || 'nao_informado',
          });
        }
      }
    }
  }

  return {
    nomeFamilia,
    membros,
    medicamentos,
    vacinas,
    checkups,
    exames,
  };
}
