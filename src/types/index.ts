import { Membro, FamiliaIndice, ItemAgenda } from './dominio';

export * from './dominio';
export * from './propostas';

export type FamilyMemberYaml = Membro;
export type FamilyIndexYaml = FamiliaIndice;
export type AgendaItem = ItemAgenda;

export interface OrganizationItemPlan {
  originalFilename: string;
  memberName: string;
  docType: 'Exames' | 'Laudos' | 'Receitas' | 'Requisicoes' | 'Audios';
  newFilename: string;
  date: string;
  extractedTitle: string;
  summary: string;
  extractedData?: {
    metrics?: Array<{ nome: string; valor: string; status?: string }>;
    medications?: Array<{ nome: string; posologia?: string; status: 'Em uso' | 'Prescrito' }>;
    vaccines?: Array<{ nome: string; data?: string; proxima?: string }>;
    conditions?: string[];
  };
}

export interface OrganizationPlan {
  items: OrganizationItemPlan[];
  warnings?: string[];
}

// UserConfig legado — usar PerfilConfig de auth/AuthProvider ou types/dominio
export type { PerfilConfig as UserConfig } from './dominio';

export interface MemberProfile {
  name: string;
  dirName: string;
  yaml?: any;
  fichaMd?: string;
  medicamentosMd?: string;
  geneticaMd?: string;
  historicoMd?: string;
  examesMd?: string;
  documents: Array<{
    folder: string;
    filename: string;
    path: string;
    size: number;
    updatedAt: string;
  }>;
  analises: Array<{
    filename: string;
    path: string;
    updatedAt: string;
  }>;
}

export interface InboxFile {
  filename: string;
  size: number;
  mimeType: string;
  updatedAt: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
