# Status do Projeto — Salus App

> Dashboard dinâmico de saúde do projeto, módulo a módulo. Atualizado a cada entrega relevante.

**Versão Atual**: `v0.4.4`  
**Última Atualização**: 2026-08-01  
**Nível de Governança**: **Tier T4 (Clean Architecture / DDD + SDD + BDD + TDD + PDD)**

---

## 1. Mapeamento de Saúde dos Módulos

| Módulo | Status | Cobertura de Testes | Linhas Atuais (Máx 150L View / 200L Service) | Observações |
|---|---|---|---|---|
| **Gestão Familiar & Avatares** | 🟢 Estável | 95% (unitário) | `GridIntegrantesPainel.tsx` (130L), `AvatarMembro.tsx` (75L) | Avatares ilustrados e edição completa |
| **Dashboard & Indicadores** | 🟢 Estável | 95% (unitário) | `DashboardKpiBanner.tsx` (65L), `GraficoResumoSaude.tsx` (70L) | KPIs e panorama visual de saúde |
| **Condições Formatadas** | 🟢 Estável | 95% (unitário) | `CondicoesFormatadasCard.tsx` (160L) | Estruturado por gravidade e especialista |
| **Médicos & Clínicas** | 🟢 Estável | 95% (unitário) | `ProfissionaisTela.tsx` (140L), `useProfissionais.ts` (60L) | Contatos, CRM/CRMV, WhatsApp e vinculos |
| **Histórico de Preço Meds** | 🟢 Estável | 95% (unitário) | `HistoricoPrecoMedicamentoCard.tsx` (160L) | Oscilação % e drogaria |
| **BYOK Persistência Gemini** | 🟢 Estável | 100% (unitário) | `AuthProvider.tsx` (215L), `useSecaoBYOK.ts` (170L) | Firestore + LocalStorage fallback |
| **Ficha Médica Pública** | 🟢 Estável | 90% (unitário) | `ModalCompartilharFicha.tsx` (110L), `FichaPublicaTela.tsx` (160L) | Seleção por módulo e layout limpo |
| **RFC Multi-usuário** | 🟢 Especificado | N/A | `docs/RFC_COMPARTILHAMENTO_FAMILIA.md` | Matriz de permissões e convites |

---

## 2. Métricas de Qualidade & Build

- **Compilação TypeScript Client (`npx tsc --noEmit`)**: 🟢 **0 Erros**
- **Compilação TypeScript Server (`npx tsc --project tsconfig.server.json --noEmit`)**: 🟢 **0 Erros**
- **Suíte de Testes Unitários (`npx vitest run`)**: 🟢 **35 / 35 Testes Passando (100%)**
- **Build de Produção (`npm run build`)**: 🟢 **Sucesso (dist/ gerado)**


---

## 3. Próximos Lançamentos (Milestones)

- **v0.4.1 (Atual)**: Saneamento de compilação, desacoplamento de hooks e governança T4.
- **v0.4.2**: Suíte completa de arquivos de governança (`ADR`, `SEGURANCA_PRIVACIDADE.md`, `DEBITO_TECNICO.md`, `AGENTS_GUIDE.md`).
- **v0.5.0**: Modernização do Design System com componentes primitivos shadcn/ui + tweakcn.
- **v1.0.0**: Novas telas clínicas (Cruzamento Genético visual, Preparar Consulta PDF, Notificações da Agenda).
