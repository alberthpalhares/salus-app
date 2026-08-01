# Especificação SDD/BDD — Módulo de Membros & Ficha Clínica

## 1. Objetivo do Módulo
Gerenciar o cadastro e o histórico clínico individualizado de cada integrante da família (humanos, cães, gatos ou outros animais).

---

## 2. Contratos & Interfaces
- **Estrutura do Firestore**: `/usuarios/{uid}/membros/{membroId}`
- **Tipos de Membro**: `'pessoa'`, `'cao'`, `'gato'`, `'outro'`
- **Vínculo**: `'biologico'`, `'adotivo'`, `'enteado'` (privado, usado para cruzamento genético)

---

## 3. Cenários BDD (Comportamento)

### Cenário 1: Adicionar novo membro humano
- **DADO QUE** o usuário está autenticado e na tela do Painel ou Onboarding
- **QUANDO** ele preenche o nome "Maria", tipo "pessoa", vínculo "biologico" e data de nascimento "1990-05-15"
- **E** clica em "Salvar Membro"
- **ENTÃO** um novo documento é gravado no Firestore sob `/usuarios/{uid}/membros/{id}`
- **E** o membro passa a figurar no Painel e na navegação de membros.

### Cenário 2: Preservar sigilo do vínculo familiar
- **DADO QUE** o usuário visualiza a Ficha de um membro com vínculo "adotivo" ou "enteado"
- **QUANDO** a Ficha Clínica é exibida na tela pública
- **ENTÃO** a informação de vínculo NÃO é apresentada visualmente na Ficha
- **MAS** é respeitada internamente pela lógica de cruzamento genético em `alertas.ts`.
