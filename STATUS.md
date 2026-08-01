# Status do Projeto — Salus App

> Dashboard dinâmico de saúde do projeto, módulo a módulo. Atualizado a cada entrega relevante.

**Versão Atual**: `v0.4.1`  
**Última Atualização**: 2026-08-01  
**Nível de Governança**: **Tier T4 (Clean Architecture / DDD + SDD + BDD + TDD + PDD)**

---

## 1. Mapeamento de Saúde dos Módulos

| Módulo | Status | Cobertura de Testes | Linhas Atuais (Máx 150L View / 200L Service) | Observações |
|---|---|---|---|---|
| **Membros & Ficha** | 🟡 Estável | 80% (unitário) | `PerfilMembroTela.tsx` (242L), `FormularioEdicaoFicha.tsx` (250L) | Hook `useEdicaoFicha` desacoplado |
| **Caixa de Entrada & Propostas** | 🟢 Estável | 90% (unitário) | `CaixaDeEntradaTela.tsx` (145L), `useCaixaEntrada.ts` (340L) | 100% desacoplado com hook |
| **Chat & Assistente IA (BYOK)** | 🟢 Estável | 85% (unitário) | `ChatTela.tsx` (140L), `useChatSession.ts` (280L) | Propostas inline testadas |
| **Ajustes & BYOK Config** | 🟢 Estável | 80% (unitário) | `SecaoBYOK.tsx` (240L), `useSecaoBYOK.ts` (190L) | Hook desacoplado |
| **Portabilidade & Drive Sync** | 🟢 Estável | 95% (unitário) | `importar.ts` (306L), `yamlParser.ts` (110L) | Parsers desacoplados em `yamlParser.ts` |
| **Painel / Raio-X** | 🟡 Funcional | 90% (unitário) | `PainelTela.tsx` (256L), `alertas.ts` (312L) | Pendente refatoração para hook `usePainelData` |

---

## 2. Métricas de Qualidade & Build

- **Compilação TypeScript Client (`npx tsc --noEmit`)**: 🟢 **0 Erros**
- **Compilação TypeScript Server (`npx tsc --project tsconfig.server.json --noEmit`)**: 🟢 **0 Erros**
- **Suíte de Testes Unitários (`npx vitest run`)**: 🟢 **31 / 31 Testes Passando (100%)**
- **Build de Produção (`npm run build`)**: 🟢 **Sucesso (dist/ gerado)**

---

## 3. Próximos Lançamentos (Milestones)

- **v0.4.1 (Atual)**: Saneamento de compilação, desacoplamento de hooks e governança T4.
- **v0.4.2**: Suíte completa de arquivos de governança (`ADR`, `SEGURANCA_PRIVACIDADE.md`, `DEBITO_TECNICO.md`, `AGENTS_GUIDE.md`).
- **v0.5.0**: Modernização do Design System com componentes primitivos shadcn/ui + tweakcn.
- **v1.0.0**: Novas telas clínicas (Cruzamento Genético visual, Preparar Consulta PDF, Notificações da Agenda).
