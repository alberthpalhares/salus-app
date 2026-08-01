# Status do Projeto — Salus App

> Dashboard dinâmico de saúde do projeto, módulo a módulo. Atualizado a cada entrega relevante.

**Versão Atual**: `v1.0.0`  
**Última Atualização**: 2026-08-01  
**Nível de Governança**: **Tier T4 (Clean Architecture / DDD + SDD + BDD + TDD + PDD)**

---

## 1. Mapeamento de Saúde dos Módulos

| Módulo | Status | Cobertura de Testes | Linhas Atuais (Max 150L View / 200L Service) | Observações |
|---|---|---|---|---|
| **Evolução de Marcadores** | 🟢 Estável | 100% (unitário) | `AbaEvolucao.tsx` (145L), `useEvolucaoMarcadores.ts` (185L) | Gráficos temporais Recharts e cruzamento genético |
| **Cruzamento Genético Familiar** | 🟢 Estável | 100% (unitário) | `CruzamentoGeneticoTela.tsx` (140L) | Isolamento por vínculo biológico e espécie |
| **Preparar Consulta (PDF)** | 🟢 Estável | 100% (unitário) | `PrepararConsultaTela.tsx` (148L), `gerarPdfConsulta.ts` (190L) | 1 página sintética em PDF via jsPDF com disclaimer |
| **UI System & Motion Animations** | 🟢 Estável | 100% (unitário) | `Dialog.tsx`, `Tabs.tsx`, `Select.tsx`, `Drawer.tsx`, `Switch.tsx` | OKLCH tweakcn + Motion animations + Dark Mode |
| **Gestão Familiar & Avatares** | 🟢 Estável | 95% (unitário) | `GridIntegrantesPainel.tsx` (130L), `AvatarMembro.tsx` (75L) | Avatares ilustrados e edição completa |
| **Dashboard & Indicadores** | 🟢 Estável | 95% (unitário) | `DashboardKpiBanner.tsx` (80L), `GraficoResumoSaude.tsx` (70L) | KPIs animados e panorama visual de saúde |
| **BYOK Persistência Gemini API** | 🟢 Estável | 100% (unitário) | `AuthProvider.tsx` (215L), `useSecaoBYOK.ts` (170L) | Firestore + LocalStorage fallback |
| **Ficha Médica Pública** | 🟢 Estável | 90% (unitário) | `ModalCompartilharFicha.tsx` (110L), `FichaPublicaTela.tsx` (160L) | Seleção por módulo e layout limpo |

---

## 2. Métricas de Qualidade & Build

- **Compilação TypeScript Client (`npx tsc --noEmit`)**: 🟢 **0 Erros**
- **Compilação TypeScript Server (`npx tsc --project tsconfig.server.json --noEmit`)**: 🟢 **0 Erros**
- **Suíte de Testes Unitários (`npx vitest run`)**: 🟢 **38 / 38 Testes Passando (100%)**
- **Build de Produção (`npm run build`)**: 🟢 **Sucesso (dist/ gerado em 1.39s)**
