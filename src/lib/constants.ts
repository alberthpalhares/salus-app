/**
 * Constantes Globais do Salus App
 * Fonte única de verdade para literais, opções de formulário e valores padrão.
 */

// --- MODELO E TIPOS DE DOMÍNIO ---

export const TIPOS_MEMBRO_OPCOES = [
  { value: 'pessoa', label: 'Pessoa (Humano)' },
  { value: 'cao', label: 'Cão (Canino)' },
  { value: 'gato', label: 'Gato (Felino)' },
  { value: 'outro', label: 'Outro' },
] as const;

export const VINCULOS_MEMBRO_OPCOES = [
  { value: 'biologico', label: 'Biológico' },
  { value: 'adotivo', label: 'Adotivo' },
  { value: 'enteado', label: 'Enteado' },
] as const;

export const STATUS_MEDICAMENTO = {
  EM_USO: 'em_uso',
  PRESCRITO: 'prescrito',
  DESCONTINUADO: 'descontinuado',
} as const;

export const STATUS_CAIXA_ENTRADA = {
  PENDENTE: 'pendente',
  PROCESSANDO: 'processando',
  PROPOSTO: 'proposto',
  ARQUIVADO: 'arquivado',
  ERRO: 'erro',
} as const;

export const FLAG_EXAME = {
  NORMAL: 'normal',
  ALTO: 'alto',
  BAIXO: 'baixo',
  NAO_INFORMADO: 'nao_informado',
} as const;

// --- PROVEDORES DE IA (BYOK) ---

export const PRESETS_PROVEDOR_IA = [
  {
    id: 'gemini',
    nome: 'Google Gemini (Recomendado - Grátis)',
    tipo: 'gemini',
    modeloPadrao: 'gemini-2.5-flash',
    suportaImagem: true,
    suportaAudio: true,
    suportaPdf: true,
    gratis: true,
  },
  {
    id: 'groq',
    nome: 'Groq (Ultra-rápido - Grátis)',
    tipo: 'openai_compat',
    urlBase: 'https://api.groq.com/openai/v1',
    modeloPadrao: 'llama-3.3-70b-versatile',
    suportaImagem: true,
    suportaAudio: false,
    suportaPdf: false,
    gratis: true,
  },
  {
    id: 'openrouter',
    nome: 'OpenRouter (Multi-modelos)',
    tipo: 'openai_compat',
    urlBase: 'https://openrouter.ai/api/v1',
    modeloPadrao: 'google/gemini-2.5-flash',
    suportaImagem: true,
    suportaAudio: false,
    suportaPdf: true,
    gratis: true,
  },
  {
    id: 'mistral',
    nome: 'Mistral AI',
    tipo: 'openai_compat',
    urlBase: 'https://api.mistral.ai/v1',
    modeloPadrao: 'mistral-small-latest',
    suportaImagem: false,
    suportaAudio: false,
    suportaPdf: false,
    gratis: true,
  },
  {
    id: 'custom',
    nome: 'Personalizado (Compatível com OpenAI)',
    tipo: 'openai_compat',
    urlBase: '',
    modeloPadrao: 'gpt-4o-mini',
    suportaImagem: true,
    suportaAudio: false,
    suportaPdf: true,
    gratis: false,
  },
] as const;

// --- MENSAGENS E ISENÇÃO CLINICA ---

export const ISENCAO_CLINICA_TEXTO =
  'O Salus organiza informações de saúde. Ele não diagnostica, não prescreve e não substitui médico ou veterinário.';

export const TIMEOUTS = {
  CHAT_REQUEST_MS: 45000,
  EXTRACAO_REQUEST_MS: 60000,
};
