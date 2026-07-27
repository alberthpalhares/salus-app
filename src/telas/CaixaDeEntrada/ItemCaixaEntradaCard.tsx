import React from 'react';
import { Card } from '../../componentes/ui/Card';
import { Badge } from '../../componentes/ui/Badge';
import { Botao } from '../../componentes/ui/Botao';
import { ItemCaixaEntrada, Membro, Exame, Medicamento, Vacina, Evento } from '../../types/dominio';
import { Proposta, SelecaoProposta } from '../../types/propostas';
import { PainelDeProposta } from '../../componentes/PainelDeProposta';
import {
  FileText,
  FileImage,
  FileAudio,
  File,
  Trash2,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Clock,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from 'lucide-react';

function formatarTamanho(bytes?: number): string {
  if (!bytes || bytes <= 0) return '';
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatarDataBR(dataIso: string): string {
  if (!dataIso) return '';
  const partes = dataIso.split('-');
  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
  return dataIso;
}

function obterInfoTipoArquivo(mime: string, nomeArquivo: string) {
  const mimeLower = (mime || '').toLowerCase();
  const nomeLower = (nomeArquivo || '').toLowerCase();

  if (
    mimeLower.includes('image') ||
    nomeLower.endsWith('.jpg') ||
    nomeLower.endsWith('.jpeg') ||
    nomeLower.endsWith('.png') ||
    nomeLower.endsWith('.webp') ||
    nomeLower.endsWith('.heic') ||
    nomeLower.endsWith('.heif')
  ) {
    return {
      tipo: 'Imagem',
      icone: FileImage,
      corBg: 'bg-teal-100 text-teal-800',
    };
  }

  if (mimeLower.includes('pdf') || nomeLower.endsWith('.pdf')) {
    return {
      tipo: 'PDF',
      icone: FileText,
      corBg: 'bg-rose-100 text-rose-800',
    };
  }

  if (
    mimeLower.includes('audio') ||
    nomeLower.endsWith('.mp3') ||
    nomeLower.endsWith('.m4a') ||
    nomeLower.endsWith('.wav') ||
    nomeLower.endsWith('.ogg')
  ) {
    return {
      tipo: 'Áudio',
      icone: FileAudio,
      corBg: 'bg-purple-100 text-purple-800',
    };
  }

  return {
    tipo: 'Documento',
    icone: File,
    corBg: 'bg-slate-100 text-slate-800',
  };
}

interface ItemCaixaEntradaCardProps {
  item: ItemCaixaEntrada;
  itemProcessandoId: string | null;
  itemExpandidoId: string | null;
  deletandoId: string | null;
  submetendoProposta: boolean;
  membros: Membro[];
  examesExistentes: Exame[];
  medicamentosExistentes: Medicamento[];
  vacinasExistentes: Vacina[];
  eventosExistentes: Evento[];
  onToggleExpandir: (id: string) => void;
  onProcessarExtracao: (item: ItemCaixaEntrada) => void;
  onVisualizar: (item: ItemCaixaEntrada) => void;
  onRemover: (item: ItemCaixaEntrada) => void;
  onConfirmarProposta: (item: ItemCaixaEntrada, selecao: SelecaoProposta) => Promise<void>;
}

export const ItemCaixaEntradaCard: React.FC<ItemCaixaEntradaCardProps> = ({
  item,
  itemProcessandoId,
  itemExpandidoId,
  deletandoId,
  submetendoProposta,
  membros,
  examesExistentes,
  medicamentosExistentes,
  vacinasExistentes,
  eventosExistentes,
  onToggleExpandir,
  onProcessarExtracao,
  onVisualizar,
  onRemover,
  onConfirmarProposta,
}) => {
  const info = obterInfoTipoArquivo(item.mime, item.nome_arquivo);
  const IconeTipo = info.icone;
  const emProcessamento = itemProcessandoId === item.id || item.status === 'processando';
  const temProposta = item.status === 'proposto' && item.proposta;
  const ehExpandido = itemExpandidoId === item.id;

  return (
    <Card
      className={`p-4 transition-colors ${
        ehExpandido ? 'border-teal-300 bg-teal-50/10' : 'hover:border-slate-300'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-bold ${info.corBg}`}
          >
            <IconeTipo className="w-5.5 h-5.5" />
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-bold text-slate-900 truncate">
                {item.nome_arquivo}
              </h4>

              {emProcessamento ? (
                <Badge variante="alerta" icone={<Loader2 className="w-3 h-3 animate-spin text-amber-600" />}>
                  Analisando IA...
                </Badge>
              ) : item.status === 'proposto' ? (
                <Badge variante="teal" icone={<CheckCircle2 className="w-3 h-3 text-emerald-600" />}>
                  Proposta Pronta
                </Badge>
              ) : item.status === 'erro' ? (
                <Badge variante="vencido" icone={<AlertCircle className="w-3 h-3 text-rose-600" />}>
                  Erro na Extração
                </Badge>
              ) : (
                <Badge variante="neutro" icone={<Clock className="w-3 h-3 text-amber-600" />}>
                  Pendente
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
              <span>Adicionado em {formatarDataBR(item.adicionado_em)}</span>
              {item.tamanho_bytes && item.tamanho_bytes > 0 && (
                <>
                  <span>•</span>
                  <span>{formatarTamanho(item.tamanho_bytes)}</span>
                </>
              )}
              <span>•</span>
              {item.drive_file_id ? (
                <span className="text-teal-700 font-medium">Google Drive</span>
              ) : (
                <span className="text-amber-600 font-medium">Nesta sessão</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0 flex-wrap">
          {Boolean(temProposta) && (
            <Botao
              variante="secundario"
              tamanho="sm"
              onClick={() => onToggleExpandir(item.id)}
              icone={
                ehExpandido ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )
              }
            >
              {ehExpandido ? 'Ocultar Proposta' : 'Ver Proposta'}
            </Botao>
          )}

          {item.status === 'erro' && (
            <Botao
              variante="outline"
              tamanho="sm"
              onClick={() => onProcessarExtracao(item)}
              disabled={emProcessamento}
              icone={<RefreshCw className="w-3.5 h-3.5 text-amber-600" />}
            >
              Tentar de novo
            </Botao>
          )}

          <Botao
            variante="outline"
            tamanho="sm"
            onClick={() => onVisualizar(item)}
            icone={<ExternalLink className="w-3.5 h-3.5" />}
          >
            Visualizar
          </Botao>

          <Botao
            variante="outline"
            tamanho="sm"
            onClick={() => onRemover(item)}
            disabled={deletandoId === item.id}
            icone={
              deletandoId === item.id ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              )
            }
          >
            Remover
          </Botao>
        </div>
      </div>

      {item.status === 'erro' && item.erro_mensagem && (
        <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{item.erro_mensagem}</span>
          </div>
          <button
            onClick={() => onProcessarExtracao(item)}
            className="font-bold text-rose-900 hover:underline shrink-0 text-xs cursor-pointer"
          >
            Reagendar
          </button>
        </div>
      )}

      {ehExpandido && Boolean(item.proposta) && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <PainelDeProposta
            proposta={item.proposta as Proposta}
            itemCaixaEntrada={item}
            membros={membros}
            examesExistentes={examesExistentes}
            medicamentosExistentes={medicamentosExistentes}
            vacinasExistentes={vacinasExistentes}
            eventosExistentes={eventosExistentes}
            onConfirmar={(selecao) => onConfirmarProposta(item, selecao)}
            onDescartar={() => onRemover(item)}
            submetendo={submetendoProposta}
          />
        </div>
      )}
    </Card>
  );
};
