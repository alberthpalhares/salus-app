---
name: dev-test-suite
description: Use esta skill para criar, executar e validar suítes de testes unitários e de integração baseados em BDD. Ela garante a integridade de regras de negócio complexas.
---

# Skill: dev-test-suite — Validador Agnóstico de Regras de Negócio & Testes BDD

Esta skill automatiza o planejamento e execução de suítes de teste automatizadas seguindo os cenários BDD das especificações técnicos do projeto.

## 📋 Protocolo de Execução Passo a Passo

### Passo 1: Mapeamento dos Cenários BDD
1. Ler os cenários BDD (`DADO QUE`, `QUANDO`, `ENTÃO`) presentes na especificação do módulo (`specs/`).
2. Identificar regras de borda (ex: valores nulos, falhas de conexão, isolamento de escopo).

### Passo 2: Construção dos Testes Vitest
1. Criar ou atualizar os arquivos de teste em `tests/`.
2. Estruturar os testes utilizando sintaxe clara do Vitest (`describe`, `it`, `expect`).

### Passo 3: Execução & Relatório
1. Executar a suíte de testes: `npx vitest run`.
2. Garantir 100% de aprovação antes de qualquer liberação de código.
