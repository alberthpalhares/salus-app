import JSZip from 'jszip';
import * as yaml from 'js-yaml';
import {
  obter as obterFamilia,
} from '../../data/repositorios/familia';
import {
  listar as listarMembros,
} from '../../data/repositorios/membros';
import {
  listar as listarMedicamentos,
} from '../../data/repositorios/medicamentos';
import {
  listar as listarVacinas,
} from '../../data/repositorios/vacinas';
import {
  listar as listarCheckups,
} from '../../data/repositorios/checkups';
import {
  listar as listarExames,
} from '../../data/repositorios/exames';
import {
  listar as listarEventos,
} from '../../data/repositorios/eventos';
import {
  listar as listarAnalises,
} from '../../data/repositorios/analises';
import {
  listar as listarCaixaEntrada,
} from '../../data/repositorios/caixaEntrada';
import {
  listar as listarDocumentos,
} from '../../data/repositorios/documentos';
import {
  obterConversa,
} from '../../data/repositorios/conversas';
import {
  obter as obterPerfilConfig,
  salvar as salvarPerfilConfig,
} from '../../data/repositorios/perfilConfig';
import { montarSnapshotDoIndice } from '../../dominio/indice';
import { calcularAlertas, gerarAgendaMarkdown } from '../../dominio/alertas';

/**
 * Exporta todos os dados do usuário para um arquivo ZIP compatível com Salus.
 */
export async function exportarDadosUsuario(
  uid: string,
  tokenAuth: string,
  opcaoCompleta: boolean,
  onProgress?: (msg: string) => void
): Promise<Blob> {
  onProgress?.('Carregando dados do Firestore...');

  const [
    familia,
    membros,
    medicamentos,
    vacinas,
    checkups,
    exames,
    eventos,
    analises,
    caixaEntrada,
    documentos,
    conversas,
    perfilConfig,
  ] = await Promise.all([
    obterFamilia(uid).catch(() => null),
    listarMembros(uid).catch(() => []),
    listarMedicamentos(uid).catch(() => []),
    listarVacinas(uid).catch(() => []),
    listarCheckups(uid).catch(() => []),
    listarExames(uid).catch(() => []),
    listarEventos(uid).catch(() => []),
    listarAnalises(uid).catch(() => []),
    listarCaixaEntrada(uid).catch(() => []),
    listarDocumentos(uid).catch(() => []),
    obterConversa(uid).catch(() => []),
    obterPerfilConfig(uid).catch(() => null),
  ]);

  const dataExport = new Date().toISOString();
  await salvarPerfilConfig(uid, {
    ...(perfilConfig || { onboarding_concluido: true, consentimentos: {} }),
    ultimo_export: dataExport,
  });

  onProgress?.('Montando estrutura de arquivos...');

  const zip = new JSZip();

  // 1. salus-app-backup.json
  const backupJson = {
    versao: '0.3.0',
    exportado_em: dataExport,
    familia: familia || { nome: 'Nossa Família', atualizado_em: dataExport.slice(0, 10) },
    membros: membros || [],
    medicamentos: medicamentos || [],
    vacinas: vacinas || [],
    checkups: checkups || [],
    exames: exames || [],
    eventos: eventos || [],
    analises: analises || [],
    caixaEntrada: caixaEntrada || [],
    documentos: documentos || [],
    conversas: conversas || [],
    perfilConfig: perfilConfig || {},
  };

  zip.file('salus-app-backup.json', JSON.stringify(backupJson, null, 2));

  // 2. Familia/_index.yaml
  const snapshot = montarSnapshotDoIndice({
    familia,
    membros,
    medicamentos,
    vacinas,
    checkups,
    exames,
  });

  const indexYamlStr = yaml.dump(snapshot, { indent: 2 });
  zip.file('Familia/_index.yaml', indexYamlStr);

  // 3. Familia/META.md
  const nomeFam = familia?.nome || 'Nossa Família';
  const metaMd = `# Central de Saúde da Família — ${nomeFam}

Atualizado em: ${dataExport.slice(0, 10)}

## Membros Registrados

| Nome | Tipo | Vínculo Biológico | Papel |
| --- | --- | --- | --- |
${membros.map((m) => `| ${m.nome} | ${m.tipo || m.especie || 'pessoa'} | ${m.vinculo || 'biologico'} | ${m.papel || '-'} |`).join('\n')}
`;
  zip.file('Familia/META.md', metaMd);

  // 4. Familia/Agenda.md
  const alertas = calcularAlertas({ membros, medicamentos, vacinas, checkups });
  const agendaMd = gerarAgendaMarkdown(alertas);
  zip.file('Familia/Agenda.md', agendaMd);

  // 5. Familia/Arvore.md
  const arvoreMd = `# Árvore Familiar — ${nomeFam}

\`\`\`mermaid
graph TD
    Fam["${nomeFam}"]
${membros.map((m) => `    Fam --> M_${m.id}["${m.nome} (${m.tipo || m.especie || 'pessoa'})"]`).join('\n')}
\`\`\`
`;
  zip.file('Familia/Arvore.md', arvoreMd);

  // 6. Familia/Linha_do_Tempo_Geral.md
  const todosEventos = [
    ...eventos.map((e) => ({
      data: e.data,
      membro: membros.find((m) => m.id === e.membro_id)?.nome || 'Família',
      tipo: e.tipo,
      descricao: e.descricao,
    })),
    ...exames.map((ex) => ({
      data: ex.data,
      membro: membros.find((m) => m.id === ex.membro_id)?.nome || 'Família',
      tipo: 'Exame',
      descricao: `${ex.painel} — ${ex.marcador}: ${ex.valor} ${ex.unidade} (Ref: ${ex.faixa_referencia_laudo || 'não informada'})`,
    })),
  ].sort((a, b) => b.data.localeCompare(a.data));

  const linhaTempoMd = `# Linha do Tempo Geral da Família

| Data | Membro | Tipo | Descrição |
| --- | --- | --- | --- |
${todosEventos.map((ev) => `| ${ev.data} | ${ev.membro} | ${ev.tipo} | ${ev.descricao} |`).join('\n')}
`;
  zip.file('Familia/Linha_do_Tempo_Geral.md', linhaTempoMd);

  // 7. Familia/Medicamentos_Ativos.md
  const medsEmUso = medicamentos.filter((m) => m.status === 'em_uso');
  const medsAtivosMd = `# Medicamentos em Uso na Família

| Membro | Medicamento | Dose | Frequência | Desde | Renova Em |
| --- | --- | --- | --- | --- | --- |
${medsEmUso.map((m) => {
  const mNome = membros.find((mb) => mb.id === m.membro_id)?.nome || 'Membro';
  return `| ${mNome} | ${m.nome} | ${m.dose} | ${m.frequencia} | ${m.desde || '-'} | ${m.renova_em || '-'} |`;
}).join('\n')}
`;
  zip.file('Familia/Medicamentos_Ativos.md', medsAtivosMd);

  // 8. Familia/Genetica_Familiar.md
  const membrosBiologicos = membros.filter((m) => (m.vinculo || 'biologico') === 'biologico');
  const geneticaFamMd = `# Genética Familiar e Condições Hereditárias

> **Nota:** Conforme o Núcleo Clínico do Salus, o cruzamento genético considera exclusivamente membros com vínculo **Biológico**.

${membrosBiologicos.map((m) => `### ${m.nome} (${m.tipo || 'pessoa'})
- **Condições:** ${(m.condicoes_ativas || m.condicoes || []).join(', ') || 'Nenhuma informada'}
`).join('\n')}
`;
  zip.file('Familia/Genetica_Familiar.md', geneticaFamMd);

  // 9. Perfis/[Nome]/*.md
  for (const m of membros) {
    const perfFolder = zip.folder(`Perfis/${m.nome}`);
    if (!perfFolder) continue;

    // Ficha.md
    const fichaMd = `# Ficha de Saúde — ${m.nome}

- **Tipo / Espécie:** ${m.tipo || m.especie || 'pessoa'}
- **Vínculo Biológico:** ${m.vinculo || 'biologico'}
- **Data de Nascimento:** ${m.nascimento || m.data_nascimento || 'não informada'}
- **Tipo Sanguíneo:** ${m.tipo_sanguineo || 'não informado'}
- **Raça:** ${m.raca || 'não informada'}
- **Plano de Saúde:** ${m.plano_saude || 'não informado'}

## Alergias
${(m.alergias || []).map((a) => `- ${a}`).join('\n') || '- Nenhuma alergia cadastrada'}

## Condições Ativas
${(m.condicoes_ativas || m.condicoes || []).map((c) => `- ${c}`).join('\n') || '- Nenhuma condição ativa'}

## Contatos de Emergência
| Nome | Telefone | Papel |
| --- | --- | --- |
${(m.contatos_emergencia || []).map((ce) => `| ${ce.nome} | ${ce.telefone} | ${ce.papel || '-'} |`).join('\n')}

## Especialistas de Referência
| Nome | Especialidade | Contato |
| --- | --- | --- |
${(m.especialistas_referencia || []).map((er) => `| ${er.nome} | ${er.especialidade} | ${er.contato || '-'} |`).join('\n')}
`;
    perfFolder.file('Ficha.md', fichaMd);

    // Medicamentos.md
    const medsDoMembro = medicamentos.filter((med) => med.membro_id === m.id);
    const medsUso = medsDoMembro.filter((med) => med.status === 'em_uso');
    const medsPresc = medsDoMembro.filter((med) => med.status === 'prescrito');
    const medsDesc = medsDoMembro.filter((med) => med.status === 'descontinuado');

    const medicamentosMd = `# Controle de Medicamentos — ${m.nome}

## Em Uso
| Medicamento | Dose | Frequência | Desde | Renova Em | Prescritor |
| --- | --- | --- | --- | --- | --- |
${medsUso.map((med) => `| ${med.nome} | ${med.dose} | ${med.frequencia} | ${med.desde || '-'} | ${med.renova_em || '-'} | ${med.prescrito_por || '-'} |`).join('\n')}

## Prescritos (Aguardando Confirmação)
| Medicamento | Dose | Frequência | Prescritor |
| --- | --- | --- | --- |
${medsPresc.map((med) => `| ${med.nome} | ${med.dose} | ${med.frequencia} | ${med.prescrito_por || '-'} |`).join('\n')}

## Descontinuados
| Medicamento | Dose | Frequência | Motivo |
| --- | --- | --- | --- |
${medsDesc.map((med) => `| ${med.nome} | ${med.dose} | ${med.frequencia} | ${med.motivo_descontinuacao || '-'} |`).join('\n')}
`;
    perfFolder.file('Medicamentos.md', medicamentosMd);

    // Genetica.md
    const geneticaMd = `# Histórico Genético — ${m.nome}

- **Vínculo Familiar:** ${m.vinculo || 'biologico'}
- **Espécie / Raça:** ${m.especie || m.tipo || 'pessoa'} ${m.raca ? `(${m.raca})` : ''}

## Condições e Predisposições
${(m.condicoes_ativas || m.condicoes || []).map((c) => `- ${c}`).join('\n') || '- Sem registros específicos'}
`;
    perfFolder.file('Genetica.md', geneticaMd);

    // Historico.md
    const evsDoMembro = eventos.filter((ev) => ev.membro_id === m.id).sort((a, b) => b.data.localeCompare(a.data));
    const historicoMd = `# Linha do Tempo — ${m.nome}

| Data | Tipo | Descrição |
| --- | --- | --- |
${evsDoMembro.map((ev) => `| ${ev.data} | ${ev.tipo} | ${ev.descricao} |`).join('\n')}
`;
    perfFolder.file('Historico.md', historicoMd);

    // Exames.md
    const examesDoMembro = exames.filter((ex) => ex.membro_id === m.id).sort((a, b) => b.data.localeCompare(a.data));
    const examesMd = `# Registro de Exames — ${m.nome}

| Data | Painel | Marcador | Valor | Unidade | Faixa de Referência do Laudo | Flag |
| --- | --- | --- | --- | --- | --- | --- |
${examesDoMembro.map((ex) => `| ${ex.data} | ${ex.painel} | ${ex.marcador} | ${ex.valor} | ${ex.unidade} | ${ex.faixa_referencia_laudo || 'faixa não informada no laudo'} | ${ex.flag} |`).join('\n')}
`;
    perfFolder.file('Exames.md', examesMd);

    // Analises/*.md
    const analisesDoMembro = analises.filter((an) => an.membro_id === m.id);
    if (analisesDoMembro.length > 0) {
      const analisesFolder = perfFolder.folder('Analises');
      if (analisesFolder) {
        analisesDoMembro.forEach((an) => {
          const fileTitle = (an.titulo || 'Analise').replace(/[\/\\]/g, '_');
          const anMd = `# ${an.titulo}

- **Data:** ${an.criado_em}
- **Tipo:** ${an.tipo}
- **Fontes:** ${(an.fontes || []).join(', ')}

## Conclusão / Resumo
${an.conclusao}
`;
          analisesFolder.file(`${fileTitle}.md`, anMd);
        });
      }
    }
  }

  // 10. Se opção completa for selecionada: baixar documentos originais do Drive
  if (opcaoCompleta) {
    const docsComDriveId = documentos.filter((d) => d.drive_file_id);
    if (docsComDriveId.length > 0) {
      onProgress?.(`Baixando ${docsComDriveId.length} arquivo(s) do Google Drive...`);
      for (let i = 0; i < docsComDriveId.length; i++) {
        const docRecord = docsComDriveId[i];
        const membro = membros.find((m) => m.id === docRecord.membro_id);
        const membroNome = membro ? membro.nome : 'Geral';
        const cat = docRecord.tipo_documento?.includes('Laudo')
          ? 'Laudos'
          : docRecord.tipo_documento?.includes('Receita')
          ? 'Receitas'
          : docRecord.tipo_documento?.includes('Exame')
          ? 'Exames'
          : 'Outros';

        onProgress?.(`Baixando arquivo ${i + 1}/${docsComDriveId.length}: ${docRecord.nome_arquivo}`);

        try {
          const res = await fetch(`/api/drive/download/${docRecord.drive_file_id}`, {
            headers: { Authorization: `Bearer ${tokenAuth}` },
          });

          if (res.ok) {
            const arrayBuf = await res.arrayBuffer();
            zip.file(
              `Perfis/${membroNome}/Documentos/${cat}/${docRecord.nome_arquivo}`,
              arrayBuf
            );
          }
        } catch (err) {
          console.warn(`[exportarDadosUsuario] Erro ao baixar arquivo ${docRecord.nome_arquivo}:`, err);
        }
      }
    }
  }

  onProgress?.('Gerando arquivo ZIP final...');
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  return zipBlob;
}
