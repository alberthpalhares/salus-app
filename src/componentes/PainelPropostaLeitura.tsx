import React from 'react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Proposta } from '../types/propostas';
import {
  FileText,
  User,
  Activity,
  Pill,
  Syringe,
  Calendar,
  Info,
  Building,
  Tag,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

interface PainelPropostaLeituraProps {
  proposta: Proposta;
  nomeArquivo?: string;
}

export const PainelPropostaLeitura: React.FC<PainelPropostaLeituraProps> = ({
  proposta,
  nomeArquivo,
}) => {
  const { documento, membro, exames, medicamentos, vacinas, eventos, observacoes } = proposta;

  // Formatação de confiança
  const getConfiancaBadge = (confianca: 'alta' | 'media' | 'baixa') => {
    if (confianca === 'alta') {
      return (
        <Badge variante="teal" icone={<CheckCircle2 className="w-3 h-3 text-emerald-600" />}>
          Confiança Alta
        </Badge>
      );
    }
    if (confianca === 'media') {
      return (
        <Badge variante="alerta" icone={<AlertTriangle className="w-3 h-3 text-amber-600" />}>
          Confiança Média
        </Badge>
      );
    }
    return (
      <Badge variante="neutro" icone={<HelpCircle className="w-3 h-3 text-slate-500" />}>
        Confiança Baixa / Não Identificado
      </Badge>
    );
  };

  // Formatação de flag de exames (Sem pânico/alarme - Regra Clínica 3)
  const getFlagBadge = (flag: 'alto' | 'baixo' | 'normal' | 'nao_informado') => {
    if (flag === 'alto') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200">
          Sinalizado no Laudo: Acima
        </span>
      );
    }
    if (flag === 'baixo') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200">
          Sinalizado no Laudo: Abaixo
        </span>
      );
    }
    if (flag === 'normal') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
          Sinalizado: Normal
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-normal text-slate-500 bg-slate-50">
        Não Sinalizado
      </span>
    );
  };

  return (
    <div className="space-y-4 text-slate-800 text-sm">
      {/* 1. Cabeçalho do Documento */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-teal-700">
                {documento.tipo || 'Documento'}
              </span>
              <h3 className="font-bold text-slate-900 text-base leading-snug">
                {documento.nome_sugerido || nomeArquivo || 'Documento sem título'}
              </h3>
            </div>
          </div>
          {documento.data_documento && (
            <Badge variante="neutro" icone={<Calendar className="w-3 h-3 text-slate-500" />}>
              Data: {documento.data_documento}
            </Badge>
          )}
        </div>

        {documento.descricao_curta && (
          <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/60">
            {documento.descricao_curta}
          </p>
        )}

        {documento.emitido_por && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Building className="w-3.5 h-3.5 text-slate-400" />
            <span>Emitido por: <strong>{documento.emitido_por}</strong></span>
          </div>
        )}
      </div>

      {/* 2. Membro Sugerido */}
      <div className="p-3.5 bg-teal-50/50 border border-teal-200/80 rounded-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-teal-800 uppercase tracking-wider block">
              Membro identificado no documento
            </span>
            <span className="text-sm font-bold text-slate-900">
              {membro.nome_encontrado_no_documento || 'Nome não especificado'}
            </span>
          </div>
        </div>
        <div>{getConfiancaBadge(membro.confianca)}</div>
      </div>

      {/* 3. Exames / Marcadores Extraídos */}
      {exames && exames.length > 0 && (
        <Card className="p-4 space-y-3 border-slate-200">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Activity className="w-4 h-4 text-teal-600" />
            <h4 className="font-bold text-slate-800 text-sm">
              Resultados de Exames / Marcadores ({exames.length})
            </h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/80">
                  <th className="py-2 px-2.5">Marcador / Analito</th>
                  <th className="py-2 px-2.5">Resultado</th>
                  <th className="py-2 px-2.5">Faixa do Laudo</th>
                  <th className="py-2 px-2.5 text-right">Sinalização</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {exames.map((ex, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-2.5">
                      <span className="font-bold text-slate-900 block">{ex.marcador}</span>
                      {ex.painel && <span className="text-[10px] text-slate-400">{ex.painel}</span>}
                    </td>
                    <td className="py-2.5 px-2.5 font-semibold text-slate-800 whitespace-nowrap">
                      {ex.valor} {ex.unidade}
                    </td>
                    <td className="py-2.5 px-2.5 text-slate-600">
                      {ex.faixa_referencia_laudo && ex.faixa_referencia_laudo.trim() !== '' ? (
                        <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                          {ex.faixa_referencia_laudo}
                        </span>
                      ) : (
                        <span className="italic text-slate-400 text-[11px]">
                          faixa não informada no laudo
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-2.5 text-right whitespace-nowrap">
                      {getFlagBadge(ex.flag)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* 4. Medicamentos Prescritos */}
      {medicamentos && medicamentos.length > 0 && (
        <Card className="p-4 space-y-3 border-slate-200">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Pill className="w-4 h-4 text-purple-600" />
            <h4 className="font-bold text-slate-800 text-sm">
              Medicamentos Identificados ({medicamentos.length})
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {medicamentos.map((med, idx) => (
              <div
                key={idx}
                className="p-3 bg-purple-50/40 border border-purple-100 rounded-lg space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-900 text-xs">{med.nome}</span>
                  <span className="text-[10px] uppercase font-extrabold tracking-wider bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                    Status: Prescrito
                  </span>
                </div>
                {med.dose && (
                  <p className="text-xs text-slate-700">
                    Dose: <strong>{med.dose}</strong>
                  </p>
                )}
                {med.frequencia && (
                  <p className="text-xs text-slate-600">Posologia: {med.frequencia}</p>
                )}
                {med.prescrito_por && (
                  <p className="text-[11px] text-slate-500 pt-1">
                    Prescrito por: {med.prescrito_por}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 5. Vacinas */}
      {vacinas && vacinas.length > 0 && (
        <Card className="p-4 space-y-3 border-slate-200">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Syringe className="w-4 h-4 text-teal-600" />
            <h4 className="font-bold text-slate-800 text-sm">
              Vacinas Registradas ({vacinas.length})
            </h4>
          </div>

          <div className="space-y-2">
            {vacinas.map((vac, idx) => (
              <div
                key={idx}
                className="p-2.5 bg-slate-50 border border-slate-200/70 rounded-lg flex flex-wrap items-center justify-between gap-2 text-xs"
              >
                <span className="font-bold text-slate-900">{vac.nome}</span>
                <div className="flex items-center gap-3 text-slate-600">
                  {vac.aplicada_em && <span>Aplicada em: {vac.aplicada_em}</span>}
                  {vac.proxima_em && (
                    <span className="font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Próximo reforço: {vac.proxima_em}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 6. Eventos / Consultas */}
      {eventos && eventos.length > 0 && (
        <Card className="p-4 space-y-3 border-slate-200">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Calendar className="w-4 h-4 text-blue-600" />
            <h4 className="font-bold text-slate-800 text-sm">Eventos / Retornos ({eventos.length})</h4>
          </div>

          <div className="space-y-2">
            {eventos.map((ev, idx) => (
              <div key={idx} className="p-2.5 bg-blue-50/40 border border-blue-100 rounded-lg text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{ev.tipo || 'Evento'}</span>
                  {ev.data && <span className="text-slate-500 font-mono">{ev.data}</span>}
                </div>
                {ev.descricao && <p className="text-slate-700">{ev.descricao}</p>}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 7. Observações */}
      {observacoes && observacoes.length > 0 && (
        <Card className="p-4 space-y-2 border-slate-200">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
            <Info className="w-4 h-4 text-slate-600" />
            <h4 className="font-bold text-slate-800 text-sm">Observações e Recomendações</h4>
          </div>
          <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 pt-1">
            {observacoes.map((obs, idx) => (
              <li key={idx} className="leading-relaxed">
                {obs}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Banner Isenção Clínica IA */}
      <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-500 italic flex items-center gap-2">
        <Info className="w-4 h-4 text-slate-400 shrink-0" />
        <span>
          Gerado por inteligência artificial a partir dos seus documentos. Não substitui avaliação profissional.
        </span>
      </div>
    </div>
  );
};
