---
name: dev-feature
description: Use esta skill sempre que o usuário pedir para criar um novo recurso, tela, módulo ou funcionalidade no sistema. Ela automatiza todo o ciclo de vida de desenvolvimento seguindo Arquitetura Limpa e T4 (spec SDD/BDD, custom hook <200L, view UI <150L, roteamento, validação de compilação/testes, bump de versão e commit semântico automático).
---

# Skill: dev-feature — Construtor Agnóstico de Recursos & Telas

Esta skill automatiza a criação de novos recursos e telas em aplicações web modernas com Arquitetura Limpa. Ela garante que nenhuma nova funcionalidade seja criada de forma desorganizada ou quebrando o código existente.

## 📋 Protocolo de Execução Passo a Passo

### Passo 1: Leitura de Contexto & Especificação SDD/BDD
1. Consultar os arquivos de governança do projeto (`GLOSSARIO.md`, `specs/`, `src/lib/constants.ts`).
2. Criar ou atualizar a especificação SDD/BDD do recurso em `specs/XX_[NOME_DO_MODULO].md` contendo:
   - Objetivos do módulo e contratos de dados.
   - Cenários BDD (`DADO QUE`, `QUANDO`, `ENTÃO`).

### Passo 2: Construção da Camada de Estado & Lógica (Custom Hook)
1. Criar o custom hook em `src/telas/[Modulo]/use[Feature].ts`.
2. Encapsular todo o estado local, chamadas de API/repositório e manipuladores de eventos.
3. **Regra de Ouro**: O arquivo do hook não deve ultrapassar **200 linhas**.

### Passo 3: Construção da Camada de Apresentação (View UI)
1. Criar a View em `src/telas/[Modulo]Tela.tsx` (ou `src/componentes/`).
2. Utilizar exclusivamente os componentes primitivos do Design System (`shadcn/ui` / `cn()`).
3. Consumir o estado e handlers gerados pelo custom hook do Passo 2.
4. **Regra de Ouro**: O arquivo da View não deve ultrapassar **150 linhas**.

### Passo 4: Roteamento & Navegação
1. Conectar a nova rota no arquivo principal de roteamento (`App.tsx` ou equivalente).
2. Adicionar o link de navegação no menu/sidebar da aplicação (`AppShell.tsx` ou equivalente).

### Passo 5: Suíte de Validação
1. Executar o typecheck do projeto: `npx tsc --noEmit`.
2. Executar a suíte de testes unitários: `npx vitest run`.
3. Executar o build de produção: `npm run build`.

### Passo 6: Versionamento & Commit Semântico Automático
1. Incrementar a versão patch no `package.json`.
2. Adicionar a entrada com a nova funcionalidade no `CHANGELOG.md`.
3. Atualizar o dashboard em `STATUS.md`.
4. Executar o commit semântico automático no Git (`feat(escopo): descrição da nova funcionalidade (vX.Y.Z)`).
