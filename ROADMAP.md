# Roadmap Estratégico do Produto — Salus App

> Este documento alinha as metas de desenvolvimento por versões e marcos evolutivos do **Salus App**.

---

## 🗺️ Marcos de Desenvolvimento (Milestones)

### 📌 Milestone v0.4 — Estabilidade & Governança T4 (Concluída)
- [x] Correção de todos os erros de compilação TypeScript no cliente e na API.
- [x] Desacoplamento dos monólitos com custom hooks (`useOnboarding`, `usePainelData`, `useCaixaEntrada`, `useSecaoBYOK`, `useChatSession`, `useEdicaoFicha`, `yamlParser`).
- [x] Suíte de governança `.md` (`GLOSSARIO.md`, `STATUS.md`, `DEBITO_TECNICO.md`, `SEGURANCA_PRIVACIDADE.md`, `AGENTS_GUIDE.md`).

---

### 🎨 Milestone v0.5 — Reformulação Visual & Design System (Concluída)
- [x] Tokens CSS em formato OKLCH integrados com tweakcn (Teal Profundo `#0D9488` / Coral Rose `#F43F5E`).
- [x] Componentes primitivos em pattern shadcn/ui (`Dialog`, `Tabs`, `Select`, `Tooltip`, `Drawer`, `Switch`, `Botao`, `Card`, `Badge`, `Campo`, `Toast`).
- [x] Sistema de Animação com `motion` ativado em todo o sistema (`AnimacaoEntrada`, `AnimacaoLista`, `AnimacaoPagina`, `AnimacaoContador`).
- [x] Suporte a Tema Escuro (Dark Mode) com chaveador e persistência local.

---

### 🚀 Milestone v1.0 — Novos Recursos & Telas Clínicas Avançadas (Concluída)
- [x] **Visão de Evolução de Marcadores & Cruzamento Genético (`cruzar`)**: Gráficos de tendência temporal com Recharts e cruzamento genético isolando vínculo biológico e espécies.
- [x] **Gerador de Resumo para Consulta (`preparar-consulta`)**: Compilação sintética de 1 página em PDF via jsPDF para consultas médicas ou veterinárias.
- [x] **Code Splitting & Bundle Optimization**: Separação de chunks vendor no Vite/Rollup (build <1.4s).
- [x] **Suíte de Testes BDD (38/38 testes passando)**: Validação de regras clínicas e genéticas.

---

### 🔮 Milestone v1.1 — Expansão & Notificações (Planejada)
- [ ] Lembretes de Agenda & Calendário com Google Calendar.
- [ ] Central de Notificações Própria no Painel.
- [ ] Leitura da Carteira de Vacinação por Foto.
