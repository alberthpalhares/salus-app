# Especificação SDD/BDD — Módulo de Assistente IA (Chat BYOK)

## 1. Objetivo do Módulo
Fornecer um chat consultivo em linguagem natural que responde dúvidas de saúde da família com base no snapshot do histórico clínico e pode propor novos registros diretamente na conversa.

---

## 2. Regras Clínicas de IA
1. A IA usa exclusivamente a chave pessoal do usuário (BYOK).
2. A resposta deve incluir o aviso de isenção clínica.
3. Se a IA sugerir cadastrar um medicamento ou exame na conversa, ela responde com um objeto `Proposta` anexo, renderizando o `<PainelDeProposta>`.

---

## 3. Cenários BDD (Comportamento)

### Cenário 1: Consulta ao histórico familiar
- **DADO QUE** o usuário pergunta "Quando foi a última vacina do Thor?"
- **QUANDO** a rota `/api/chat` recebe a mensagem acompanhada do `SnapshotIndiceFamilia`
- **ENTÃO** a IA analisa o histórico do membro "Thor" e responde a data exata da vacina
- **E** não realiza nenhuma alteração no banco de dados.

### Cenário 2: Ausência de chave de IA
- **DADO QUE** o usuário tenta enviar uma mensagem no Chat sem cadastrar uma chave de IA nos Ajustes
- **QUANDO** clica em "Enviar"
- **ENTÃO** o sistema exibe o cartão `<SemChaveChatCard>` orientando o cadastro gratuito de uma chave de API (Gemini, Groq, OpenRouter ou Mistral).
