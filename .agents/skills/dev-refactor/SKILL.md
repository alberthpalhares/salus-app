---
name: dev-refactor
description: Use esta skill sempre que o usuário solicitar refatorar, desacoplar, organizar ou desmembrar arquivos grandes, views monólitas ou serviços complexos. Ela garante refatorações limpas com regressão zero, atualização de débitos técnicos e versionamento.
---

# Skill: dev-refactor — Decompositor Agnóstico & Quitação de Débito Técnico

Esta skill guia e automatiza a decomposição de monólitos de código, reduzindo a complexidade cognitiva dos arquivos sem alterar o comportamento externo da aplicação.

## 📋 Protocolo de Execução Passo a Passo

### Passo 1: Análise de Limites & Diagnóstico
1. Medir o tamanho do arquivo alvo:
   - Componentes UI / Views: limite **150 linhas**.
   - Serviços / Hooks / Utilities: limite **200 linhas**.
2. Identificar responsabilidades misturadas (estado, efeitos, busca de dados, sub-formulários).

### Passo 2: Extração Isolada
1. Extrair estado e manipuladores de eventos para um Custom Hook dedicado (`use[NomeDoComponente].ts`).
2. Extrair parsers ou algoritmos puros para funções utilitárias em `[nome]Parser.ts` ou `[nome]Utils.ts`.
3. Re-escrever o arquivo original consumindo os elementos extraídos.

### Passo 3: Validação de Regressão Zero
1. Executar o typecheck do projeto: `npx tsc --noEmit`.
2. Executar a suíte de testes unitários: `npx vitest run`.
3. Validar se o comportamento visual e funcional permaneceu idêntico.

### Passo 4: Gestão do Inventário & Commit
1. Atualizar o arquivo `DEBITO_TECNICO.md` (removendo ou dando baixa no item).
2. Atualizar o arquivo `STATUS.md`.
3. Incrementar a versão patch no `package.json` e registrar em `CHANGELOG.md`.
4. Executar o commit semântico no Git (`refactor(escopo): descrição da refatoração (vX.Y.Z)`).
