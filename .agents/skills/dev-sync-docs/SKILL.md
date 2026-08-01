---
name: dev-sync-docs
description: Use esta skill sempre que alterações no código fonte precisarem ser refletidas na documentação (.md, specs/, glossário, status e changelog). Ela garante que a documentação técnica nunca fique obsoleta ou desalinhada.
---

# Skill: dev-sync-docs — Sincronizador Agnóstico de Documentação

Esta skill garante a integridade e sincronização contínua entre o código fonte em execução e os arquivos de governança em Markdown.

## 📋 Protocolo de Execução Passo a Passo

### Passo 1: Varredura de Inconsistências
1. Comparar os modelos de dados e tipos atuais (`src/types/`) com o `GLOSSARIO.md`.
2. Comparar as rotas ativas (`App.tsx`) com os arquivos em `specs/`.
3. Comparar a lista de componentes e hooks com os mapas no `STATUS.md`.

### Passo 2: Atualização dos Arquivos de Governança
1. Atualizar o `GLOSSARIO.md` caso novos termos ou entidades tenham sido adicionados.
2. Atualizar as especificações em `specs/` ajustando contratos de dados ou novos parâmetros.
3. Atualizar o `STATUS.md` com os números de linhas e status de cada módulo.

### Passo 3: Commit de Documentação
1. Executar o commit semântico no Git (`docs(sync): atualiza documentacao tecnica e especificacoes`).
