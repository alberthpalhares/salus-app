import { z } from 'zod';
import { Membro, MedicamentoPrescrito, VacinaRegistro, MarcadorChave } from './dominio';

// --- SCHEMA ZOD E TIPOS PARA EXTRAÇÃO DE DOCUMENTOS (P8) ---

export const propostaDocumentoSchema = z.object({
  tipo: z.enum(['exame', 'laudo', 'receita', 'requisicao', 'audio', 'outro']).default('outro'),
  data_documento: z.string().default(''), // AAAA-MM-DD
  descricao_curta: z.string().default(''),
  nome_sugerido: z.string().default(''),
  emitido_por: z.string().default(''),
});

export const propostaMembroSchema = z.object({
  membro_id_sugerido: z.string().nullable().default(null),
  nome_encontrado_no_documento: z.string().nullable().default(null),
  confianca: z.enum(['alta', 'media', 'baixa']).default('baixa'),
});

export const propostaExameItemSchema = z.object({
  painel: z.string().default(''),
  marcador: z.string().default(''),
  valor: z.string().default(''),
  unidade: z.string().default(''),
  faixa_referencia_laudo: z.string().default(''),
  flag: z.enum(['alto', 'baixo', 'normal', 'nao_informado']).default('nao_informado'),
});

export const propostaMedicamentoItemSchema = z.object({
  nome: z.string().default(''),
  dose: z.string().default(''),
  frequencia: z.string().default(''),
  prescrito_por: z.string().default(''),
  validade_receita: z.string().default(''),
});

export const propostaVacinaItemSchema = z.object({
  nome: z.string().default(''),
  aplicada_em: z.string().default(''),
  proxima_em: z.string().default(''),
});

export const propostaEventoItemSchema = z.object({
  data: z.string().default(''),
  tipo: z.string().default(''),
  descricao: z.string().default(''),
});

export const propostaSchema = z.object({
  documento: propostaDocumentoSchema,
  membro: propostaMembroSchema,
  exames: z.array(propostaExameItemSchema).default([]),
  medicamentos: z.array(propostaMedicamentoItemSchema).default([]),
  vacinas: z.array(propostaVacinaItemSchema).default([]),
  eventos: z.array(propostaEventoItemSchema).default([]),
  observacoes: z.array(z.string()).default([]),
});

export type PropostaDocumento = z.infer<typeof propostaDocumentoSchema>;
export type PropostaMembro = z.infer<typeof propostaMembroSchema>;
export type PropostaExameItem = z.infer<typeof propostaExameItemSchema>;
export type PropostaMedicamentoItem = z.infer<typeof propostaMedicamentoItemSchema>;
export type PropostaVacinaItem = z.infer<typeof propostaVacinaItemSchema>;
export type PropostaEventoItem = z.infer<typeof propostaEventoItemSchema>;

export type Proposta = z.infer<typeof propostaSchema>;

// --- TIPOS DE SELEÇÃO E APROVAÇÃO DE PROPOSTA (P9) ---

export interface SelecaoPropostaItemExame {
  incluir: boolean;
  painel: string;
  marcador: string;
  valor: string;
  unidade: string;
  faixa_referencia_laudo: string;
  flag: 'normal' | 'alto' | 'baixo' | 'nao_informado';
  data?: string;
}

export interface SelecaoPropostaItemMedicamento {
  incluir: boolean;
  nome: string;
  dose: string;
  frequencia: string;
  prescrito_por: string;
  validade_receita?: string;
  status: 'em_uso' | 'prescrito'; // Default 'prescrito'. Changes to 'em_uso' if "Já estou tomando" selected.
  data_prescricao?: string;
}

export interface SelecaoPropostaItemVacina {
  incluir: boolean;
  nome: string;
  aplicada_em: string;
  proxima_em?: string;
}

export interface SelecaoPropostaItemEvento {
  incluir: boolean;
  data: string;
  tipo: string;
  descricao: string;
}

export interface SelecaoProposta {
  itemCaixaEntradaId: string;
  membroId: string;
  membroNome: string;
  documento: {
    tipo: string;
    data: string;
    descricao_curta?: string;
    nomePadronizado: string;
  };
  exames: SelecaoPropostaItemExame[];
  medicamentos: SelecaoPropostaItemMedicamento[];
  vacinas: SelecaoPropostaItemVacina[];
  eventos: SelecaoPropostaItemEvento[];
}

// --- TIPOS LEGADOS PARA RETROCOMPATIBILIDADE ---

export type TipoProposta =
  | 'adicionar_membro'
  | 'atualizar_membro'
  | 'adicionar_medicamento'
  | 'adicionar_vacina'
  | 'adicionar_exame';

export interface PropostaBase {
  id: string;
  tipo: TipoProposta;
  resumo: string;
  membro_id?: string;
  membro_nome?: string;
  criado_em: string;
  status: 'pendente' | 'aprovada' | 'rejeitada';
}

export interface PropostaAdicionarMembro extends PropostaBase {
  tipo: 'adicionar_membro';
  dados: Partial<Membro>;
}

export interface PropostaAdicionarMedicamento extends PropostaBase {
  tipo: 'adicionar_medicamento';
  dados: MedicamentoPrescrito;
}

export interface PropostaAdicionarVacina extends PropostaBase {
  tipo: 'adicionar_vacina';
  dados: VacinaRegistro;
}

export interface PropostaAdicionarExame extends PropostaBase {
  tipo: 'adicionar_exame';
  dados: MarcadorChave;
}

export type PropostaLegada =
  | PropostaAdicionarMembro
  | PropostaAdicionarMedicamento
  | PropostaAdicionarVacina
  | PropostaAdicionarExame;
