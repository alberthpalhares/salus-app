# Inventário de Débito Técnico — Salus App

> Este documento registra, prioriza e acompanha a quitação da dívida técnica do Salus App. Nenhuma alteração de código deve introduzir débito de prioridade ALTA sem plano imediato de mitigação.

---

## 1. Matriz de Débito Técnico Ativo

| ID | Item | Prioridade | Localização | Impacto | Ação Planejada |
|---|---|---|---|---|---|
| **DT-01** | Refatorar `OnboardingTela.tsx` (304L) | Média | `src/telas/OnboardingTela.tsx` | View acumula lógica dos 5 passos do wizard | Extrair hook `useOnboarding` e sub-passos |
| **DT-02** | Refatorar `PainelTela.tsx` (256L) | Média | `src/telas/PainelTela.tsx` | Home consulta 5 coleções simultaneamente no Firestore | Extrair hook `usePainelData` |
| **DT-03** | Refatorar `AbaDocumentos.tsx` (264L) | Média | `src/telas/PerfilMembro/AbaDocumentos.tsx` | UI mistura upload direto e listagem de links Drive | Extrair sub-componente `ItemDocumentoRow` |
| **DT-04** | Centralizar Magic Strings de Mensagens | Baixa | Vários componentes em `src/telas/` | Mensagens de sucesso/erro duplicadas em inline strings | Mover para `src/lib/constants.ts` |
| **DT-05** | Code Splitting de Bundles (>500KB) | Média | `vite.config.ts` | Bundle do client gera arquivo JS de 1.2MB | Configurar `manualChunks` no Rollup |
| **DT-06** | Testes de Integração de Fluxo BDD | Média | `tests/` | Testes atuais focam em unidades puras | Criar testes de integração de fluxo completo |

---

## 2. Critérios de Quitação de Débito
1. Todo arquivo refatorado deve permanecer com **0 regressões** em testes unitários.
2. Nenhuma view refatorada deve exceder **150 linhas**.
3. Nenhum utilitário ou serviço deve exceder **200 linhas**.
