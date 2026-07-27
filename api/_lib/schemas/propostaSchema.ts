import { Type } from '@google/genai';

/**
 * Schema de resposta estruturada (structured output) do Gemini para extração de documentos no Salus.
 */
export const PROPOSTA_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    documento: {
      type: Type.OBJECT,
      properties: {
        tipo: {
          type: Type.STRING,
          enum: ['exame', 'laudo', 'receita', 'requisicao', 'audio', 'outro'],
          description: 'Classificação do documento.',
        },
        data_documento: {
          type: Type.STRING,
          description: 'Data do documento no formato AAAA-MM-DD. Se ausente no documento, string vazia "".',
        },
        descricao_curta: {
          type: Type.STRING,
          description: 'Resumo ou descrição curta do documento em uma frase.',
        },
        nome_sugerido: {
          type: Type.STRING,
          description: 'Nome padronizado sugerido para o documento (ex: 2026-05-10_hemograma_ana.pdf).',
        },
        emitido_por: {
          type: Type.STRING,
          description: 'Laboratório, clínica, hospital ou médico/veterinário emissor.',
        },
      },
      required: ['tipo', 'data_documento', 'descricao_curta', 'nome_sugerido', 'emitido_por'],
    },
    membro: {
      type: Type.OBJECT,
      properties: {
        membro_id_sugerido: {
          type: Type.STRING,
          nullable: true,
          description: 'ID do membro cadastrado na família que corresponde ao paciente/animal, ou null se incerto.',
        },
        nome_encontrado_no_documento: {
          type: Type.STRING,
          nullable: true,
          description: 'Nome do paciente/animal escrito exatamente como no documento.',
        },
        confianca: {
          type: Type.STRING,
          enum: ['alta', 'media', 'baixa'],
          description: 'Nível de confiança na identificação do membro.',
        },
      },
      required: ['membro_id_sugerido', 'nome_encontrado_no_documento', 'confianca'],
    },
    exames: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          painel: {
            type: Type.STRING,
            description: 'Painel ou grupo de exames (ex: Hemograma Completo, Perfil Lipídico, Urina I).',
          },
          marcador: {
            type: Type.STRING,
            description: 'Nome do analito/marcador (ex: Hemoglobina, Glicose, ALT, Leucócitos).',
          },
          valor: {
            type: Type.STRING,
            description: 'Valor numérico ou resultado escrito no laudo.',
          },
          unidade: {
            type: Type.STRING,
            description: 'Unidade de medida (ex: g/dL, mg/dL, U/L, %).',
          },
          faixa_referencia_laudo: {
            type: Type.STRING,
            description: 'Copia LITERAL da faixa de referência impressa no laudo. Se não houver faixa impressa no laudo, OBRIGATORIAMENTE string vazia "". NUNCA use valores da sua memória.',
          },
          flag: {
            type: Type.STRING,
            enum: ['alto', 'baixo', 'normal', 'nao_informado'],
            description: 'Apenas alto ou baixo se o PRÓPRIO LAUDO sinalizou alteração. Caso contrário normal se sinalizou normal, ou nao_informado.',
          },
        },
        required: ['painel', 'marcador', 'valor', 'unidade', 'faixa_referencia_laudo', 'flag'],
      },
    },
    medicamentos: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          nome: { type: Type.STRING, description: 'Nome do medicamento ou princípio ativo.' },
          dose: { type: Type.STRING, description: 'Dose ou concentração prescrita (ex: 500mg, 10ml, 1 gota).' },
          frequencia: { type: Type.STRING, description: 'Posologia e frequência (ex: 8/8h por 7 dias, 1x ao dia).' },
          prescrito_por: { type: Type.STRING, description: 'Nome e registro profissional do prescritor.' },
          validade_receita: { type: Type.STRING, description: 'Data de validade da receita em AAAA-MM-DD se constar.' },
        },
        required: ['nome', 'dose', 'frequencia', 'prescrito_por', 'validade_receita'],
      },
    },
    vacinas: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          nome: { type: Type.STRING, description: 'Nome da vacina (ex: V10, Antirrábica, Gripe).' },
          aplicada_em: { type: Type.STRING, description: 'Data de aplicação em AAAA-MM-DD.' },
          proxima_em: { type: Type.STRING, description: 'Data do próximo reforço em AAAA-MM-DD.' },
        },
        required: ['nome', 'aplicada_em', 'proxima_em'],
      },
    },
    eventos: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          data: { type: Type.STRING, description: 'Data do evento em AAAA-MM-DD.' },
          tipo: { type: Type.STRING, description: 'Tipo do evento (ex: Consulta, Retorno, Cirurgia, Procedimento).' },
          descricao: { type: Type.STRING, description: 'Descrição detalhada do evento ou recomendação.' },
        },
        required: ['data', 'tipo', 'descricao'],
      },
    },
    observacoes: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Observações, orientações clínicas ou notas relevantes.',
    },
  },
  required: ['documento', 'membro', 'exames', 'medicamentos', 'vacinas', 'eventos', 'observacoes'],
};
