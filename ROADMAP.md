# Roadmap Estratégico do Produto — Salus App

> Este documento alinha as metas de desenvolvimento por versões e marcos evolutivos do **Salus App**.

---

## 🗺️ Marcos de Desenvolvimento (Milestones)

### 📌 Milestone v0.4 — Estabilidade & Governança T4 (Concluída)
- [x] Correção de todos os erros de compilação TypeScript no cliente e na API.
- [x] Desacoplamento dos 5 principais monólitos com custom hooks (`useCaixaEntrada`, `useSecaoBYOK`, `useChatSession`, `useEdicaoFicha`, `yamlParser`).
- [x] Criação da suíte de governança `.md` (`GLOSSARIO.md`, `STATUS.md`, `DEBITO_TECNICO.md`, `SEGURANCA_PRIVACIDADE.md`, `AGENTS_GUIDE.md`).
- [x] Criação dos blueprints SDD/BDD em `specs/` e registros ADR em `adr/`.

---

### 🎨 Milestone v0.5 — Modernização de Interface (shadcn/ui & tweakcn) (Em Progresso)
- [ ] Utilitário `cn()` (`clsx` + `tailwind-merge`) em `src/lib/utils.ts`.
- [ ] Reformulação dos componentes primitivos de UI (`Button`, `Card`, `Input`, `Badge`, `Dialog`, `Toast`, `Tabs`) no padrão shadcn/ui.
- [ ] Aplicação do tema Slate/Teal com elevações suaves e micro-animações acessíveis.

---

### 🚀 Milestone v1.0 — Novos Recursos & Telas Clínicas Avançadas (Planejada)
- [ ] **Visão de Cruzamento Genético (`cruzar`)**: Gráficos de linha de tendência temporal de biomarcadores comparando membros da família com vínculo biológico.
- [ ] **Gerador de Resumo para Consulta (`preparar-consulta`)**: Geração de documento sintético em PDF imprimível formatado para a especialidade da consulta.
- [ ] **Lembretes de Agenda & Calendário**: Sincronização de vacinas e renovação de receitas com Google Calendar.
- [ ] **Central de Notificações Própria**: Alertas proativos no Painel quando um exame ou receita estiver prestes a vencer.
