---
name: dev-release
description: Use esta skill para preparar, versionar e publicar uma nova release do sistema. Ela valida a compilação, eleva o SemVer, gera as notas de lançamento no CHANGELOG.md e cria a tag no Git.
---

# Skill: dev-release — Automação Agnóstica de Lançamentos & Tagging no Git

Esta skill formaliza e automatiza a liberação de novas versões do sistema, garantindo um histórico de versões limpo e rastreável.

## 📋 Protocolo de Execução Passo a Passo

### Passo 1: Trava de Segurança & Build
1. Executar o typecheck do projeto: `npx tsc --noEmit`.
2. Executar a suíte de testes unitários: `npx vitest run`.
3. Executar o build de produção: `npm run build`.

### Passo 2: Elevação Semântica de Versão (SemVer)
1. Definir o tipo de incremento:
   - `patch` (x.y.Z): Correções de bugs e refatorações sem breaking changes.
   - `minor` (x.Y.0): Novas funcionalidades compatíveis com versões anteriores.
   - `major` (X.0.0): Mudanças estruturais ou breaking changes.
2. Atualizar a versão no `package.json`.

### Passo 3: Notas de Lançamento no CHANGELOG.md
1. Registrar a nova versão em `CHANGELOG.md` com a data atual e as seções `Adicionado`, `Alterado`, `Corrigido` ou `Removido`.

### Passo 4: Git Commit & Tag
1. Executar o commit da release no Git (`chore(release): vX.Y.Z`).
2. Criar a tag no Git (`git tag vX.Y.Z`).
