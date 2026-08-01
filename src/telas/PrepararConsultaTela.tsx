import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/componentes/ui/Card';
import { Select } from '@/componentes/ui/Select';
import { Botao } from '@/componentes/ui/Botao';
import { Campo } from '@/componentes/ui/Campo';
import { Carregando } from '@/componentes/ui/Carregando';
import { EstadoVazio } from '@/componentes/ui/EstadoVazio';
import { AnimacaoEntrada } from '@/componentes/ui/AnimacaoEntrada';
import { usePrepararConsulta } from './PrepararConsulta/usePrepararConsulta';
import { PreviewResumoConsulta } from './PrepararConsulta/PreviewResumoConsulta';
import { gerarPdfConsulta } from './PrepararConsulta/gerarPdfConsulta';
import { Stethoscope, Download, Printer, ArrowLeft, Plus, HelpCircle, User } from 'lucide-react';

export const PrepararConsultaTela: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const membroIdParam = searchParams.get('membro') || undefined;

  const {
    carregando,
    membros,
    membroSelecionadoId,
    setMembroSelecionadoId,
    membroAtual,
    especialidade,
    setEspecialidade,
    motivoConsulta,
    setMotivoConsulta,
    duvida1,
    setDuvida1,
    duvida2,
    setDuvida2,
    duvida3,
    setDuvida3,
    duvidas,
    medicamentos,
    condicoes,
    examesAlterados,
    dataHojeISO,
  } = usePrepararConsulta(membroIdParam);

  if (carregando) {
    return <Carregando mensagem="Compilando histórico e medicamentos do integrante..." />;
  }

  if (membros.length === 0) {
    return (
      <EstadoVazio
        titulo="Nenhum integrante cadastrado"
        descricao="Cadastre primeiro um integrante na sua família para preparar o resumo de consulta médica."
        icone={<User className="w-8 h-8 text-slate-400" />}
      />
    );
  }

  const opcoesMembros = membros.map((m) => ({
    valor: m.id,
    rotulo: `${m.nome} ${m.tipo && m.tipo !== 'pessoa' ? `(${m.tipo})` : ''}`,
  }));

  const opcoesEspecialidades = [
    { valor: 'Clínica Geral / Pediatria', rotulo: 'Clínica Geral / Pediatria' },
    { valor: 'Cardiologia', rotulo: 'Cardiologia' },
    { valor: 'Endocrinologia', rotulo: 'Endocrinologia' },
    { valor: 'Ginecologia / Obstetrícia', rotulo: 'Ginecologia / Obstetrícia' },
    { valor: 'Ortopedia', rotulo: 'Ortopedia' },
    { valor: 'Dermatologia', rotulo: 'Dermatologia' },
    { valor: 'Neurologia', rotulo: 'Neurologia' },
    { valor: 'Gastroenterologia', rotulo: 'Gastroenterologia' },
    { valor: 'Oftalmologia', rotulo: 'Oftalmologia' },
    { valor: 'Veterinária Geral', rotulo: 'Veterinária Geral' },
    { valor: 'Outra Especialidade', rotulo: 'Outra Especialidade' },
  ];

  const handleGerarPdf = () => {
    if (!membroAtual) return;
    gerarPdfConsulta({
      membro: membroAtual,
      especialidade,
      motivoConsulta,
      duvidas,
      condicoes,
      medicamentos,
      examesAlterados,
      dataGeracao: dataHojeISO,
    });
  };

  const handleImprimir = () => {
    window.print();
  };

  return (
    <AnimacaoEntrada className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 print:hidden">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Botao variante="ghost" tamanho="sm" onClick={() => navigate(-1)} className="p-1">
              <ArrowLeft className="w-4 h-4" />
            </Botao>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              Preparar Consulta Médica
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 pl-7">
            Gere um resumo focado de 1 página com o histórico de saúde formatado para levar ao médico ou veterinário.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Botao variante="outline" tamanho="sm" icone={<Printer className="w-4 h-4" />} onClick={handleImprimir}>
            Imprimir
          </Botao>
          <Botao variante="primario" tamanho="sm" icone={<Download className="w-4 h-4" />} onClick={handleGerarPdf}>
            Baixar PDF
          </Botao>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Formulário de Configuração (Esquerda) */}
        <div className="lg:col-span-5 space-y-4 print:hidden">
          <Card className="space-y-4">
            <CardHeader className="p-0 border-b border-slate-100 dark:border-slate-800 pb-3">
              <CardTitle className="text-sm">Configuração da Consulta</CardTitle>
            </CardHeader>

            <CardContent className="p-0 space-y-4">
              <Select
                rotulo="Integrante *"
                opcoes={opcoesMembros}
                valor={membroSelecionadoId}
                onValueChange={setMembroSelecionadoId}
              />

              <Select
                rotulo="Especialidade da Consulta *"
                opcoes={opcoesEspecialidades}
                valor={especialidade}
                onValueChange={setEspecialidade}
              />

              <Campo
                rotulo="Motivo / Queixa Principal"
                placeholder="Ex: Cansaço frequente, dores de cabeça ou check-up anual..."
                textarea
                linhas={3}
                value={motivoConsulta}
                onChange={(e) => setMotivoConsulta(e.target.value)}
                dica="Descreva sinteticamente o principal assunto da consulta."
              />

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-teal-600" /> Perguntas para o Médico (até 3)
                </label>
                <Campo
                  placeholder="Pergunta 1 (Ex: Devo ajustar a dose do medicamento?)"
                  value={duvida1}
                  onChange={(e) => setDuvida1(e.target.value)}
                />
                <Campo
                  placeholder="Pergunta 2 (Ex: Posso praticar exercícios físicos?)"
                  value={duvida2}
                  onChange={(e) => setDuvida2(e.target.value)}
                />
                <Campo
                  placeholder="Pergunta 3 (Ex: Quando devo repetir os exames de sangue?)"
                  value={duvida3}
                  onChange={(e) => setDuvida3(e.target.value)}
                />
              </div>

              <div className="pt-2">
                <Botao variante="primario" className="w-full" icone={<Download className="w-4 h-4" />} onClick={handleGerarPdf}>
                  Gerar PDF da Consulta
                </Botao>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pré-visualização em Tempo Real (Direita) */}
        <div className="lg:col-span-7">
          {membroAtual && (
            <PreviewResumoConsulta
              membro={membroAtual}
              especialidade={especialidade}
              motivoConsulta={motivoConsulta}
              duvidas={duvidas}
              condicoes={condicoes}
              medicamentos={medicamentos}
              examesAlterados={examesAlterados}
              dataHojeISO={dataHojeISO}
            />
          )}
        </div>
      </div>
    </AnimacaoEntrada>
  );
};
