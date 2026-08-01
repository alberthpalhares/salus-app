import { jsPDF } from 'jspdf';
import { Membro, Medicamento, CondicaoSaudeEstruturada, Exame } from '@/types/dominio';
import { formatarDataExtenso } from '@/lib/datas';

export interface DadosResumoConsulta {
  membro: Membro;
  especialidade: string;
  motivoConsulta: string;
  duvidas: string[];
  condicoes: CondicaoSaudeEstruturada[];
  medicamentos: Medicamento[];
  examesAlterados: Exame[];
  dataGeracao: string;
}

export function gerarPdfConsulta(dados: DadosResumoConsulta): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const { membro, especialidade, motivoConsulta, duvidas, condicoes, medicamentos, examesAlterados, dataGeracao } = dados;

  let y = 15;
  const marginX = 15;
  const maxW = 180;

  // Cabeçalho Principal (SISAFAM Logo & Título)
  doc.setFillColor(13, 148, 136); // Teal 600
  doc.rect(0, 0, 210, 18, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('SISAFAM — Resumo para Consulta Médica', marginX, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Gerado em: ${formatarDataExtenso(dataGeracao)}`, 210 - marginX, 12, { align: 'right' });

  y = 26;

  // Bloco 1: Identificação do Integrante
  doc.setFillColor(241, 245, 249); // Slate 100
  doc.roundedRect(marginX, y, maxW, 22, 2, 2, 'F');

  doc.setTextColor(15, 23, 42); // Slate 900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`${membro.nome} ${membro.tipo && membro.tipo !== 'pessoa' ? `(${membro.tipo})` : ''}`, marginX + 4, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105); // Slate 600
  const idadeStr = membro.nascimento ? `Nascimento: ${membro.nascimento}` : '';
  const tipoSangue = membro.tipo_sanguineo ? ` • Tipo Sanguíneo: ${membro.tipo_sanguineo}` : '';
  const plano = membro.plano_saude ? ` • Plano: ${membro.plano_saude}` : '';
  doc.text(`${idadeStr}${tipoSangue}${plano}`, marginX + 4, y + 14);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(13, 148, 136);
  doc.text(`Especialidade: ${especialidade || 'Clínica Geral'}`, 210 - marginX - 4, y + 7, { align: 'right' });

  y += 28;

  // Bloco 2: Motivo da Consulta & Queixa Principal
  if (motivoConsulta.trim()) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(13, 148, 136);
    doc.text('1. MOTIVO DA CONSULTA / QUEIXA PRINCIPAL', marginX, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    const splitMotivo = doc.splitTextToSize(motivoConsulta, maxW);
    doc.text(splitMotivo, marginX, y);
    y += splitMotivo.length * 4.5 + 4;
  }

  // Bloco 3: Dúvidas / Perguntas para o Médico
  if (duvidas.length > 0 && duvidas.some((d) => d.trim())) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(13, 148, 136);
    doc.text('2. PERGUNTAS E DÚVIDAS PARA O MÉDICO', marginX, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);

    duvidas.forEach((d) => {
      if (d.trim()) {
        const line = `• ${d.trim()}`;
        doc.text(line, marginX + 2, y);
        y += 4.5;
      }
    });
    y += 3;
  }

  // Bloco 4: Condições Ativas & Alergias
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(13, 148, 136);
  doc.text('3. CONDIÇÕES ATIVAS & ALERGIAS REGISTRADAS', marginX, y);
  y += 5;

  const alergiasList = membro.alergias || [];
  if (alergiasList.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(225, 29, 72); // Rose 600
    doc.text(`ALERGIAS ALERTA: ${alergiasList.join(', ')}`, marginX + 2, y);
    y += 5;
  }

  if (condicoes.length > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    condicoes.forEach((c) => {
      doc.text(`• ${c.nome} (${c.categoria || 'cronica'} - Gravidade ${c.gravidade || 'moderada'})`, marginX + 2, y);
      y += 4.5;
    });
  } else if (alergiasList.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('Nenhuma condição ou alergia registrada.', marginX + 2, y);
    y += 4.5;
  }
  y += 3;

  // Bloco 5: Medicamentos em Uso
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(13, 148, 136);
  doc.text('4. MEDICAMENTOS EM USO CONTÍNUO', marginX, y);
  y += 5;

  if (medicamentos.length > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    medicamentos.forEach((m) => {
      const detalhe = [m.dose, m.frequencia].filter(Boolean).join(' • ');
      doc.text(`• ${m.nome}${detalhe ? ` (${detalhe})` : ''}`, marginX + 2, y);
      y += 4.5;
    });
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('Nenhum medicamento ativo no momento.', marginX + 2, y);
    y += 4.5;
  }
  y += 3;

  // Bloco 6: Últimos Exames Alterados
  if (examesAlterados.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(13, 148, 136);
    doc.text('5. ÚLTIMOS EXAMES COM ALTERAÇÃO DE LAUDO', marginX, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);

    examesAlterados.slice(0, 6).forEach((e) => {
      const faixa = e.faixa_referencia_laudo ? ` [Ref: ${e.faixa_referencia_laudo}]` : '';
      doc.text(`• ${e.marcador}: ${e.valor} ${e.unidade || ''} (Data: ${e.data})${faixa}`, marginX + 2, y);
      y += 4.5;
    });
    y += 3;
  }

  // Rodapé com Disclaimer Clínico Obrigatório
  doc.setDrawColor(226, 232, 240);
  doc.line(marginX, 280, 210 - marginX, 280);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'ISENÇÃO CLÍNICA: O SISAFAM organiza informações de saúde do usuário. Ele não diagnostica, não prescreve e não substitui avaliação médica profissional.',
    marginX,
    284
  );

  // Baixar o arquivo PDF
  const nomeLimpo = membro.nome.toLowerCase().replace(/\s+/g, '_');
  doc.save(`resumo_consulta_${nomeLimpo}_${dataGeracao}.pdf`);
}
