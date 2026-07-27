import {
  repositoriofamilia,
  repositoriomembros,
  repositoriomedicamentos,
  repositoriovacinas,
  repositoriocheckups,
  repositorioexames,
  repositorioeventos,
  repositeriodocumentos,
  repositorioperfilConfig,
} from './repositorios';
import { Membro, Medicamento, Vacina, Checkup, Exame, Evento, DocumentoMembro } from '../types/dominio';

/**
 * Grava dados de exemplo ("Família Exemplo") sob o /usuarios/{uid}/ do usuário.
 * Não é chamada automaticamente; só deve ser executada quando explicitamente solicitado.
 */
export async function semearDadosDeExemplo(uid: string): Promise<void> {
  if (!uid) {
    throw new Error('ID do usuário (uid) é obrigatório para semear dados de exemplo.');
  }

  // 1. Família
  await repositoriofamilia.salvar(uid, {
    nome: 'Família Exemplo',
    atualizado_em: '2026-07-24',
  });

  // 2. Membros
  const ana: Membro = {
    id: 'membro_ana_exemplo',
    nome: 'Ana Exemplo',
    tipo: 'pessoa',
    nascimento: '1984-03-15',
    vinculo: 'biologico',
    tipo_sanguineo: 'A+',
    plano_saude: 'Plano Saúde Exemplo',
    condicoes_ativas: ['Hipertensão arterial leve'],
    alergias: ['Penicilina'],
    contatos_emergencia: [{ nome: 'Carlos Exemplo', telefone: '(11) 98765-4321', papel: 'Esposo' }],
    especialistas_referencia: [{ nome: 'Dr. Carlos Silva', especialidade: 'Cardiologia', contato: '(11) 3333-4444' }],
    relacoes: [{ membro_id: 'membro_pedro_exemplo', papel: 'Mãe' }],
  };

  const pedro: Membro = {
    id: 'membro_pedro_exemplo',
    nome: 'Pedro Exemplo',
    tipo: 'pessoa',
    nascimento: '2017-06-20',
    vinculo: 'biologico',
    tipo_sanguineo: 'A+',
    condicoes_ativas: [],
    alergias: ['Peixe'],
    contatos_emergencia: [{ nome: 'Ana Exemplo', telefone: '(11) 99999-1111', papel: 'Mãe' }],
    especialistas_referencia: [{ nome: 'Dra. Maria Pediatra', especialidade: 'Pediatria', contato: '(11) 3333-5555' }],
    relacoes: [{ membro_id: 'membro_ana_exemplo', papel: 'Filho' }],
  };

  const rex: Membro = {
    id: 'membro_rex_exemplo',
    nome: 'Rex Exemplo',
    tipo: 'cao',
    nascimento: '2021-11-10',
    vinculo: 'adotivo',
    raca: 'Golden Retriever',
    condicoes_ativas: [],
    alergias: [],
    contatos_emergencia: [{ nome: 'Ana Exemplo', telefone: '(11) 99999-1111', papel: 'Tutora' }],
    especialistas_referencia: [{ nome: 'Dr. Roberto Vet', especialidade: 'Veterinário de Rotina', contato: '(11) 3333-6666' }],
    relacoes: [],
  };

  await repositoriomembros.salvar(uid, ana);
  await repositoriomembros.salvar(uid, pedro);
  await repositoriomembros.salvar(uid, rex);

  // 3. Medicamentos
  const medAna: Medicamento = {
    id: 'med_ana_losartana',
    membro_id: 'membro_ana_exemplo',
    nome: 'Losartana Potássica',
    dose: '50 mg',
    frequencia: '1x ao dia (pela manhã)',
    status: 'em_uso',
    desde: '2023-01-10',
    renova_em: '2026-08-01', // Receita vencendo em breve
    prescrito_por: 'Dr. Carlos Silva (Cardiologia)',
  };

  const medAnaPrescrito: Medicamento = {
    id: 'med_ana_vitamina_d',
    membro_id: 'membro_ana_exemplo',
    nome: 'Vitamina D3 7.000 UI',
    dose: '1 cápsula por semana',
    frequencia: 'Semanalmente aos domingos',
    status: 'prescrito',
    desde: '2026-07-22',
    prescrito_por: 'Dra. Patricia Endócrino',
  };

  const medPedro: Medicamento = {
    id: 'med_pedro_amoxicilina',
    membro_id: 'membro_pedro_exemplo',
    nome: 'Amoxicilina Suspensão',
    dose: '250 mg / 5 mL',
    frequencia: 'de 8 em 8 horas por 7 dias',
    status: 'prescrito',
    desde: '2026-07-20',
    prescrito_por: 'Dra. Maria (Pediatria)',
  };

  const medAnaDescontinuado: Medicamento = {
    id: 'med_ana_captopril',
    membro_id: 'membro_ana_exemplo',
    nome: 'Captopril',
    dose: '25 mg',
    frequencia: '2x ao dia',
    status: 'descontinuado',
    desde: '2021-05-10',
    motivo_descontinuacao: 'Substituído por Losartana Potássica',
    prescrito_por: 'Dr. Carlos Silva',
  };

  await repositoriomedicamentos.salvar(uid, medAna);
  await repositoriomedicamentos.salvar(uid, medAnaPrescrito);
  await repositoriomedicamentos.salvar(uid, medPedro);
  await repositoriomedicamentos.salvar(uid, medAnaDescontinuado);

  // 4. Vacinas
  const vacAna: Vacina = {
    id: 'vac_ana_influenza',
    membro_id: 'membro_ana_exemplo',
    nome: 'Influenza (Gripe)',
    aplicada_em: '2025-05-10',
    proxima_em: '2026-05-10', // Vencida
  };

  const vacPedro: Vacina = {
    id: 'vac_pedro_triplice',
    membro_id: 'membro_pedro_exemplo',
    nome: 'Tríplice Viral',
    aplicada_em: '2022-04-12',
  };

  const vacRexV10: Vacina = {
    id: 'vac_rex_v10',
    membro_id: 'membro_rex_exemplo',
    nome: 'Vacina V10 Canina',
    aplicada_em: '2025-08-15',
    proxima_em: '2026-08-15', // Vence em breve
  };

  await repositoriovacinas.salvar(uid, vacAna);
  await repositoriovacinas.salvar(uid, vacPedro);
  await repositoriovacinas.salvar(uid, vacRexV10);

  // 5. Checkups
  const chkAna: Checkup = {
    id: 'chk_ana_cardio',
    membro_id: 'membro_ana_exemplo',
    tipo: 'Consulta Anual de Cardiologia',
    data: '2026-09-10',
  };

  const chkRex: Checkup = {
    id: 'chk_rex_vet',
    membro_id: 'membro_rex_exemplo',
    tipo: 'Consulta Veterinária de Rotina',
    data: '2026-08-20',
  };

  await repositoriocheckups.salvar(uid, chkAna);
  await repositoriocheckups.salvar(uid, chkRex);

  // 6. Exames
  const exAnaGlicose: Exame = {
    id: 'ex_ana_glicose',
    membro_id: 'membro_ana_exemplo',
    data: '2026-06-01',
    painel: 'Bioquímica do Sangue',
    marcador: 'Glicose em Jejum',
    valor: '92',
    unidade: 'mg/dL',
    faixa_referencia_laudo: '70 a 99 mg/dL',
    flag: 'normal',
  };

  const exAnaColesterol: Exame = {
    id: 'ex_ana_colesterol',
    membro_id: 'membro_ana_exemplo',
    data: '2026-06-01',
    painel: 'Perfil Lipídico',
    marcador: 'Colesterol Total',
    valor: '210',
    unidade: 'mg/dL',
    faixa_referencia_laudo: 'Desejável: menor que 190 mg/dL',
    flag: 'alto',
  };

  const exAnaTriglicerides: Exame = {
    id: 'ex_ana_triglicerides',
    membro_id: 'membro_ana_exemplo',
    data: '2026-06-01',
    painel: 'Perfil Lipídico',
    marcador: 'Triglicerídeos',
    valor: '125',
    unidade: 'mg/dL',
    faixa_referencia_laudo: 'Desejável: menor que 150 mg/dL',
    flag: 'normal',
  };

  await repositorioexames.salvar(uid, exAnaGlicose);
  await repositorioexames.salvar(uid, exAnaColesterol);
  await repositorioexames.salvar(uid, exAnaTriglicerides);

  // 7. Eventos (Histórico)
  const evAna1: Evento = {
    id: 'ev_ana_1',
    membro_id: 'membro_ana_exemplo',
    data: '2026-06-01',
    tipo: 'Exame de Rotina',
    descricao: 'Realização de exames de sangue gerais no laboratório.',
  };

  const evAna2: Evento = {
    id: 'ev_ana_2',
    membro_id: 'membro_ana_exemplo',
    data: '2026-01-15',
    tipo: 'Consulta',
    descricao: 'Consulta de acompanhamento cardiológico com Dr. Carlos. Pressão controlada.',
  };

  const evPedro1: Evento = {
    id: 'ev_pedro_1',
    membro_id: 'membro_pedro_exemplo',
    data: '2026-07-20',
    tipo: 'Atendimento Médico',
    descricao: 'Atendimento pediátrico por quadro de dor de garganta. Prescrita Amoxicilina.',
  };

  const evRex1: Evento = {
    id: 'ev_rex_1',
    membro_id: 'membro_rex_exemplo',
    data: '2025-08-15',
    tipo: 'Vacinação',
    descricao: 'Aplicação da dose anual da vacina V10 Canina.',
  };

  await repositorioeventos.salvar(uid, evAna1);
  await repositorioeventos.salvar(uid, evAna2);
  await repositorioeventos.salvar(uid, evPedro1);
  await repositorioeventos.salvar(uid, evRex1);

  // 8. Documentos
  const docAna1: DocumentoMembro = {
    id: 'doc_ana_1',
    membro_id: 'membro_ana_exemplo',
    nome_arquivo: 'Laudo_Exames_Sangue_Junho_2026.pdf',
    tipo_documento: 'Laudo de Exame',
    data: '2026-06-01',
    drive_file_id: '1a2b3c4d5e6f7g8h9i0j',
    mime: 'application/pdf',
    tamanho_bytes: 452000,
  };

  const docAna2: DocumentoMembro = {
    id: 'doc_ana_2',
    membro_id: 'membro_ana_exemplo',
    nome_arquivo: 'Receita_Losartana_2026.pdf',
    tipo_documento: 'Receita',
    data: '2026-01-15',
    drive_file_id: '0j9i8h7g6f5e4d3c2b1a',
    mime: 'application/pdf',
    tamanho_bytes: 180000,
  };

  const docPedro1: DocumentoMembro = {
    id: 'doc_pedro_1',
    membro_id: 'membro_pedro_exemplo',
    nome_arquivo: 'Receita_Amoxicilina_Julho_2026.pdf',
    tipo_documento: 'Receita',
    data: '2026-07-20',
    drive_file_id: '5e6f7g8h9i0j1a2b3c4d',
    mime: 'application/pdf',
    tamanho_bytes: 210000,
  };

  await repositeriodocumentos.salvar(uid, docAna1);
  await repositeriodocumentos.salvar(uid, docAna2);
  await repositeriodocumentos.salvar(uid, docPedro1);

  // 9. Perfil e Configurações
  await repositorioperfilConfig.salvar(uid, {
    onboarding_concluido: true,
    consentimentos: { termos_uso: true, privacidade: true },
    ultima_revisao: '2026-07-01',
    proxima_revisao: '2026-08-01',
  });
}
