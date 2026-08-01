# Guia de Contribuição & Desenvolvimento com Agentes de IA (`AGENTS_GUIDE.md`)

> Este guia estabelece o protocolo de engajamento para desenvolvedores humanos e assistentes de IA (Cursor, Antigravity, Claude, Gemini CLI) atuando no código do **Salus App**.

---

## 1. Diretrizes Invioláveis para IAs

1. **Leitura Obrigatória de Contexto**:
   - Antes de iniciar qualquer tarefa de refatoração ou criação de código, a IA **deve consultar** `GLOSSARIO.md`, `STATUS.md` e as especificações em `specs/`.

2. **Respeito aos Limites de Linhas por Arquivo**:
   - Componentes de View (`src/telas/` ou `src/componentes/`): **Máximo 150 linhas**.
   - Serviços / Utilities (`src/servicos/` ou `src/lib/`): **Máximo 200 linhas**.
   - Se uma alteração for fazer um arquivo ultrapassar esses limites, a IA deve propor a extração de um custom hook ou utilitário.

3. **Verificação Empírica de Sucesso**:
   - Nenhuma alteração é declarada como concluída antes da execução e aprovação dos testes unitários (`npx vitest run`) e do typecheck (`npx tsc --noEmit`).

4. **Commits Semânticos com Versionamento**:
   - Cada entrega de etapa deve gerar um commit semântico com bump de versão em `package.json` e atualização do `CHANGELOG.md`.

---

## 2. Convenções de Mensagem de Commit (Conventional Commits)

| Tipo | Descrição | Exemplo |
|---|---|---|
| `feat` | Nova funcionalidade para o usuário | `feat(membros): adiciona seletor de tipo de sangue` |
| `fix` | Correção de bug / erro de compilação | `fix(drive): trata erro de autenticação OAuth` |
| `refactor` | Mudança de código que não altera comportamento | `refactor(chat): extrai hook useChatSession` |
| `docs` | Alterações em arquivos `.md` ou especificações | `docs(adr): adiciona ADR 0001 sobre BYOK` |
| `test` | Adição ou ajuste de suítes de teste | `test(alertas): adiciona testes de cruzamento` |
| `chore` | Tarefas de manutenção ou dependências | `chore(deps): atualiza pacote zod` |
