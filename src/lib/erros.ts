export interface AcaoErro {
  rotulo: string;
  link?: string;
  funcao?: () => void;
}

export interface ErroTratado {
  mensagem: string;
  acao?: AcaoErro;
}

/**
  Mapeia erros de rede, API de IA, Firestore, Drive e validações para mensagens humanas e claras.
 */
export function tratarErro(err: unknown): ErroTratado {
  if (!err) {
    return { mensagem: 'Ocorreu um erro inesperado. Tente novamente.' };
  }

  const msg = typeof err === 'string' ? err : (err as Error)?.message || '';

  // 1. Falha de rede / sem conexão
  if (
    typeof navigator !== 'undefined' && !navigator.onLine ||
    msg.includes('Failed to fetch') ||
    msg.includes('NetworkError') ||
    msg.includes('TypeError: Failed to fetch') ||
    msg.includes('network')
  ) {
    return {
      mensagem: 'Você parece estar sem conexão com a internet. Verifique sua rede e tente novamente.',
    };
  }

  // 2. Sessão expirada
  if (
    msg.includes('auth/id-token-expired') ||
    msg.includes('auth/user-token-expired') ||
    msg.includes('Sessão expirada') ||
    msg.includes('Não autenticado') ||
    msg.includes('401')
  ) {
    return {
      mensagem: 'Sua sessão expirou por segurança. Faça login novamente.',
    };
  }

  // 3. Chave de IA ausente
  if (
    msg.includes('chave_ausente') ||
    msg.includes('Chave de API') ||
    msg.includes('chave Gemini') ||
    msg.includes('sem chave')
  ) {
    return {
      mensagem: 'Chave de API do provedor de IA não configurada. O app continua totalmente útil de forma manual.',
      acao: {
        rotulo: 'Configurar Chave em Ajustes',
        link: '/ajustes',
      },
    };
  }

  // 4. Chave de API inválida ou sem cota
  if (
    msg.includes('inválida') ||
    msg.includes('cota') ||
    msg.includes('quota') ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('429') ||
    msg.includes('API key not valid')
  ) {
    return {
      mensagem: 'Sua chave de API do provedor de IA é inválida ou atingiu o limite de cota. Atualize sua chave em Ajustes.',
      acao: {
        rotulo: 'Atualizar Chave em Ajustes',
        link: '/ajustes',
      },
    };
  }

  // 5. Cota do Firestore excedida
  if (
    msg.includes('resource-exhausted') ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('quota exceeded') ||
    msg.includes('banco de dados')
  ) {
    return {
      mensagem: 'Limite de requisições ao banco de dados excedido. Tente novamente mais tarde.',
    };
  }

  // 6. Drive desconectado ou acesso revogado
  if (
    msg.includes('Drive não conectado') ||
    msg.includes('drive_desconectado') ||
    msg.includes('invalid_grant') ||
    msg.includes('Google Drive') ||
    msg.includes('revogado')
  ) {
    return {
      mensagem: 'O acesso ao Google Drive foi interrompido. Reconecte sua conta em Ajustes para sincronizar arquivos, sem perder nenhum dado.',
      acao: {
        rotulo: 'Reconectar Google Drive',
        link: '/ajustes',
      },
    };
  }

  // 7. Arquivo não suportado
  if (
    msg.includes('formato') ||
    msg.includes('não suportado') ||
    msg.includes('unsupported file')
  ) {
    return {
      mensagem: 'Este formato de arquivo não é suportado. Envie documentos em PDF ou imagens (PNG, JPG, WEBP).',
    };
  }

  // 8. Arquivo grande demais
  if (
    msg.includes('excedem o limite') ||
    msg.includes('grande demais') ||
    msg.includes('20 MB') ||
    msg.includes('LIMIT_FILE_SIZE')
  ) {
    return {
      mensagem: 'O arquivo excede o tamanho máximo permitido (20 MB). Tente enviar um arquivo menor.',
    };
  }

  return {
    mensagem: msg || 'Ocorreu um erro inesperado. Tente novamente.',
  };
}
