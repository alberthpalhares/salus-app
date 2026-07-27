import { NUCLEO_CLINICO } from './nucleo';

export interface MembroResumidoPrompt {
  id: string;
  nome: string;
  tipo?: string;
  especie?: string;
  nascimento?: string;
  data_nascimento?: string;
}

/**
 * Gera o prompt de instrução para extração estruturada de documentos com o Gemini.
 */
export function gerarPromptExtracao(membros: MembroResumidoPrompt[]): string {
  const listaMembros = membros.map((m) => ({
    id: m.id,
    nome: m.nome,
    tipo: m.tipo || m.especie || 'Humano',
    nascimento: m.nascimento || m.data_nascimento || '',
  }));

  const membrosJson =
    listaMembros.length > 0
      ? JSON.stringify(listaMembros, null, 2)
      : 'Nenhum membro cadastrado previamente.';

  return `${NUCLEO_CLINICO}

INSTRUÇÕES DE EXTRAÇÃO ESTRUTURADA DE DOCUMENTOS DE SAÚDE:

Você é o motor de extração de documentos do Salus App (para pessoas e animais de estimação).
Sua missão é analisar o documento anexado (PDF, foto de laudo/receita ou áudio) e retornar os dados estritamente estruturados.

REGRAS DE EXTRAÇÃO E PREENCHIMENTO OBRIGATÓRIAS:

1. FIDELIDADE ABSOLUTA AO DOCUMENTO:
   - Extraia apenas o que está estritamente escrito ou falado no documento.
   - NUNCA complete dados ausentes, NUNCA estime valores, NUNCA deduza valores não explicitados.
   - Todo campo sem informação explícita deve ser retornado como string vazia ("").

2. FAIXA DE REFERÊNCIA DO LAUDO (REGRA CLÍNICA NÚMERO 2):
   - O campo 'faixa_referencia_laudo' deve conter LITERALMENTE a string impressa no próprio laudo (ex: "12,0 a 16,0 g/dL" ou "< 99 mg/dL").
   - Se o laudo NÃO trouxe a faixa de referência impressa, o campo OBRIGATORIAMENTE DEVE FICAR VAZIO ("").
   - NUNCA utilize faixas de referência da sua memória ou de tabelas gerais do seu conhecimento.

3. SINALIZAÇÃO DO LAUDO (FLAG):
   - O campo 'flag' deve ser 'alto' ou 'baixo' APENAS se o PRÓPRIO LAUDO sinalizou graficamente ou expressamente uma alteração (ex: setas para cima/baixo, asterisco, indicação em negrito com legenda de alteração, palavra "alterado").
   - Se o laudo indicou explicitamente "normal", use 'normal'.
   - Se o laudo não trouxe sinalização explícita de alteração, use 'nao_informado'.

4. STATUS DE MEDICAMENTOS (REGRA CLÍNICA NÚMERO 5):
   - Medicamentos extraídos de receitas ou prescrições entram SEMPRE com a intenção de status 'prescrito', NUNCA 'em_uso'.

5. IDENTIFICAÇÃO DO MEMBRO DA FAMÍLIA:
   Compare o nome do paciente/animal escrito no documento com a lista de membros cadastrados da família:
${membrosJson}

   - Se encontrar correspondência clara com um membro da lista, retorne 'membro_id_sugerido' com o ID correspondente, 'nome_encontrado_no_documento' com o nome lido no documento, e 'confianca' como 'alta' ou 'media'.
   - Se não tiver certeza ou o nome no documento não bater com nenhum membro cadastrado, retorne 'membro_id_sugerido': null, 'nome_encontrado_no_documento': (nome lido ou null), e 'confianca': 'baixa'.

6. TRATAMENTO DE ÁUDIOS:
   - Se o arquivo for uma gravação de áudio, transcreva a gravação e classifique como orientação médica ou consulta, extraindo medicamentos prescritos, recomendações e datas de retorno no campo 'eventos' e 'observacoes'.

7. CLASSIFICAÇÃO DE TIPO DE DOCUMENTO:
   - Classifique o tipo do documento no campo 'documento.tipo' como: 'exame', 'laudo', 'receita', 'requisicao', 'audio', ou 'outro'.
`;
}
