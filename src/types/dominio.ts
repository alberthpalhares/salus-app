export type TipoMembro = 'pessoa' | 'cao' | 'gato' | 'outro';
export type EspecieMembro = 'Humano' | 'Cão' | 'Gato' | 'pessoa' | 'cao' | 'gato' | 'outro';
export type VinculoMembro = 'biologico' | 'adotivo' | 'enteado';

export interface Familia {
  nome: string;
  atualizado_em: string; // AAAA-MM-DD
}

export interface RelacaoMembro {
  membro_id: string;
  papel: string;
}

export interface MedicamentoEmUso {
  nome: string;
  posologia?: string;
  inicio?: string;
  prescritor?: string;
  renova_em?: string;
  dose?: string;
  frequencia?: string;
}

export interface MedicamentoPrescrito {
  nome: string;
  posologia?: string;
  data_prescricao?: string;
  prescritor?: string;
  dose?: string;
  frequencia?: string;
}

export interface VacinaRegistro {
  nome: string;
  data?: string;
  proxima?: string;
  aplicada_em?: string;
  proxima_em?: string;
}

export interface MarcadorChave {
  nome: string;
  ultimo_valor: string;
  unit?: string;
  data: string;
  status: 'Normal' | 'Alterado' | 'Atenção' | string;
  faixa_referencia?: string; // Faixa impressa no próprio laudo (nunca calculada)
}

export interface ContatoEmergencia {
  nome: string;
  telefone: string;
  papel?: string;
}

export interface EspecialistaReferencia {
  nome: string;
  especialidade: string;
  contato?: string;
}

export interface Membro {
  id: string;
  nome: string;
  tipo?: TipoMembro;
  nascimento?: string; // AAAA-MM-DD
  vinculo: VinculoMembro;
  raca?: string;
  tipo_sanguineo?: string;
  plano_saude?: string;
  condicoes_ativas?: string[];
  alergias?: string[];
  contatos_emergencia?: ContatoEmergencia[];
  especialistas_referencia?: EspecialistaReferencia[];
  relacoes?: RelacaoMembro[];
  // Campos legados/retrocompatibilidade
  especie?: EspecieMembro;
  data_nascimento?: string;
  condicoes?: string[];
  papel?: string;
  medicamentos_em_uso?: MedicamentoEmUso[];
  medicamentos_prescritos?: MedicamentoPrescrito[];
  vacinas?: VacinaRegistro[];
  marcadores_chave?: MarcadorChave[];
}

export interface Medicamento {
  id: string;
  membro_id: string;
  nome: string;
  dose: string;
  frequencia: string;
  status: 'em_uso' | 'prescrito' | 'descontinuado';
  desde?: string; // AAAA-MM-DD
  renova_em?: string; // AAAA-MM-DD
  prescrito_por?: string;
  motivo_descontinuacao?: string;
}

export interface Vacina {
  id: string;
  membro_id: string;
  nome: string;
  aplicada_em: string; // AAAA-MM-DD
  proxima_em?: string; // AAAA-MM-DD
}

export interface Checkup {
  id: string;
  membro_id: string;
  tipo: string;
  data: string; // AAAA-MM-DD
}

export interface Exame {
  id: string;
  membro_id: string;
  data: string; // AAAA-MM-DD
  painel: string;
  marcador: string;
  valor: string;
  unidade: string;
  faixa_referencia_laudo: string; // Texto copiado do próprio laudo (nunca calculado)
  flag: 'normal' | 'alto' | 'baixo' | 'nao_informado';
  documento_id?: string;
}

export interface Evento {
  id: string;
  membro_id: string;
  data: string; // AAAA-MM-DD
  tipo: string;
  descricao: string;
}

export interface Analise {
  id: string;
  membro_id: string;
  titulo: string;
  criado_em: string; // AAAA-MM-DD
  tipo: string;
  fontes: string[];
  dados: unknown[];
  conclusao: string;
}

export interface DocumentoMembro {
  id: string;
  membro_id: string;
  nome_arquivo: string;
  tipo_documento: 'Laudo de Exame' | 'Receita' | 'Atestado' | 'Outros' | string;
  data: string; // AAAA-MM-DD
  drive_file_id?: string;
  mime?: string;
  tamanho_bytes?: number;
}

export interface ItemCaixaEntrada {
  id: string;
  nome_arquivo: string;
  mime: string;
  drive_file_id?: string;
  status: 'pendente' | 'processando' | 'proposto' | 'arquivado' | 'erro';
  proposta?: unknown;
  erro_mensagem?: string;
  adicionado_em: string; // AAAA-MM-DD
  tamanho_bytes?: number;
}

export interface ProvedorIA {
  tipo: 'gemini' | 'openai_compat' | 'groq' | 'openrouter' | 'mistral' | 'custom';
  url_base?: string;
  modelo: string;
  chave: string;
  suporta_imagem?: boolean;
  suporta_audio?: boolean;
  suporta_pdf?: boolean;
}

export interface PerfilConfig {
  onboarding_concluido?: boolean;
  consentimentos?: Record<string, boolean> | string[];
  provedor_ia?: ProvedorIA;
  drive_conectado?: boolean;
  ultima_revisao?: string;
  proxima_revisao?: string;
  ultimo_export?: string;
  backup_automatico?: boolean;
  ultimo_backup?: string;
  plano?: 'free' | 'premium';
}

export interface FamiliaIndice {
  nome_familia: string;
  criado_em: string;
  atualizado_em: string;
  membros: Membro[];
}

export interface ItemAgenda {
  id?: string;
  membro_id?: string;
  membro_nome?: string;
  membro?: string;
  item: string;
  categoria: 'Vacina' | 'Receita' | 'Check-up' | 'Exame' | string;
  vencimento: string; // AAAA-MM-DD
  status: 'vencido' | 'vence_em_breve' | 'em_dia' | 'Vencido' | 'Vence em breve' | 'Em dia' | string;
}
