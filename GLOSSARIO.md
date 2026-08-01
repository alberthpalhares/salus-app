# Glossário — Linguagem Ubíqua (Salus App)

Este documento define a Linguagem Ubíqua do **Salus App** seguindo os princípios de Domain-Driven Design (DDD). Todos os módulos, rotas, tipos, componentes e documentações devem aderir estritamente a estes termos.

---

| Termo | Definição | Contexto de Aplicação |
|---|---|---|
| **Membro** | Integrante da família (pessoa ou animal de estimação como cão ou gato). Possui ficha clínica, medicamentos, exames e histórico. | `membros`, `dominio` |
| **TipoMembro** | Categoria do membro: `'pessoa'`, `'cao'`, `'gato'`, ou `'outro'`. | `membros`, `types` |
| **Vínculo** | Relação familiar (`'biologico'`, `'adotivo'`, `'enteado'`). Governa o cruzamento genético (privado, nunca exibido na Ficha pública). | `membros`, `alertas` |
| **Caixa de Entrada** | Local onde arquivos originais (PDFs, fotos, áudios) são depositados para extração por IA ou preenchimento manual. | `caixa-entrada` |
| **ItemCaixaEntrada** | Registro de um documento em estado `'pendente'`, `'processando'`, `'proposto'`, `'arquivado'`, ou `'erro'`. | `caixa-entrada`, `types` |
| **Proposta** | Estrutura de dados extraída pela IA contendo sugestões de exames, medicamentos, vacinas e eventos antes da gravação. | `caixa-entrada`, `chat` |
| **SelecaoProposta** | Escolha explícita do usuário (`incluir: true/false`, edições de campos) confirmando o que deve ser salvo no Firestore. | `caixa-entrada`, `dominio` |
| **FaixaReferenciaLaudo** | Texto exato copiado do laudo do laboratório. **Nunca calculada ou memorizada pela IA.** | `exames`, `dominio` |
| **BYOK (Bring Your Own Key)** | Modelo onde cada usuário fornece sua própria chave de API de IA (Gemini, Groq, OpenRouter, Mistral, OpenAI) salva no seu Firestore. | `auth`, `ajustes` |
| **ProvedorIA** | Configuração do provedor ativo contendo `{ tipo, url_base?, modelo, chave }`. | `auth`, `chat` |
| **DriveRefreshToken** | Credencial de acesso renovável armazenada exclusivamente no Firestore privado do usuário para salvar arquivos no Google Drive dele. | `drive`, `auth` |
| **SnapshotIndiceFamilia** | Resumo textual leve da família (membros, condições, medicamentos ativos) enviado à IA no Chat como contexto de leitura. | `chat`, `dominio` |
| **Raio-X** | Visão agregada no Painel destacando itens vencidos, a vencer nos próximos 30 dias e alertas clínicos da família. | `painel`, `alertas` |
| **Isenção Clínica** | Aviso obrigatório de que o Salus organiza informações e não substitui diagnósticos, prescrições ou médicos/veterinários. | `core`, `footer` |
