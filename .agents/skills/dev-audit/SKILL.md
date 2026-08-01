---
name: dev-audit
description: Use esta skill sempre que o usuário pedir para auditar o sistema, verificar a saúde do código, validar limites de linhas de arquivo ou checar se há algo quebrado. Ela executa um raio-x completo no código.
---

# Skill: dev-audit — Auditor Agnóstico de Saúde & Qualidade do Código

Esta skill executa uma varredura completa na aplicação para identificar erros de compilação, testes quebrados, arquivos fora do limite de tamanho e métricas de qualidade.

## 📋 Protocolo de Execução Passo a Passo

### Passo 1: Auditoria de Compilação & Tipagem
1. Executar o typecheck do frontend: `npx tsc --noEmit`.
2. Executar o typecheck do backend/serverless (se houver): `npx tsc --project tsconfig.server.json --noEmit`.

### Passo 2: Execução da Suíte de Testes
1. Executar a suíte de testes unitários: `npx vitest run`.
2. Verificar taxa de aprovação (deve ser 100%).

### Passo 3: Varredura de Limites de Tamanho de Arquivo
1. Analisar os arquivos da pasta `src/`:
   - Identificar Views/Componentes que excedam **150 linhas**.
   - Identificar Serviços/Utilities que excedam **200 linhas**.

### Passo 4: Atualização dos Relatórios
1. Atualizar o dashboard `STATUS.md` com as métricas consolidadas.
2. Atualizar o arquivo `DEBITO_TECNICO.md` adicionando novos itens identificados.
3. Apresentar um resumo executivo sóbrio ao usuário.
