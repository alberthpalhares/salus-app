import { Type } from '@google/genai';
import { PROPOSTA_RESPONSE_SCHEMA } from './propostaSchema.js';

/**
 * Schema de resposta estruturada (structured output) do Gemini para o Chat do Salus App.
 */
export const CHAT_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    resposta: {
      type: Type.STRING,
      description:
        'Texto principal da resposta ao usuário. Deve ser em português do Brasil simples, sem LaTeX (proibido \\mathbf, \\frac, etc), sem jargão médico, sem diagnóstico ou prescrição. Se o usuário apenas mencionou um fato de saúde de passagem, inclua ao final a pergunta: "Percebi que você mencionou [resumo]. Quer que eu registre isso?".',
    },
    temProposta: {
      type: Type.BOOLEAN,
      description:
        'Defina como true apenas quando o usuário pediu explicitamente para registrar/anotar algum dado de saúde ou confirmou o registro.',
    },
    proposta: {
      type: Type.OBJECT,
      nullable: true,
      description: 'Proposta estruturada de dados de saúde a registrar (vacina, medicamento, exame, evento, etc).',
      properties: PROPOSTA_RESPONSE_SCHEMA.properties,
    },
    dadosConsultados: {
      type: Type.STRING,
      nullable: true,
      description: 'String opcional indicando dados específicos de um membro consultados no histórico se aplicável.',
    },
  },
  required: ['resposta', 'temProposta'],
};
