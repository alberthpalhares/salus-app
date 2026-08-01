# Especificação SDD/BDD — Módulo Gerador de Resumo para Consulta (`preparar-consulta`)

## 1. Objetivo do Módulo
Compilar rapidamente um resumo executivo de 1 página, focado e formatado para impressão ou salvamento em PDF, com o histórico do membro adaptado à especialidade médica ou veterinária da consulta.

---

## 2. Estrutura do Resumo de Consulta
O resumo compilado é dividido nas seções:
1. **Cabeçalho**: Nome do membro, espécie/raça, idade, tipo sanguíneo, plano de saúde e contatos de emergência.
2. **Motivo & Dúvidas**: Pergunta/queixa principal trazida pelo usuário para a consulta.
3. **Condições Ativas & Alergias**: Lista de condições registradas e alertas de alergia em destaque.
4. **Medicamentos em Uso**: Nome, dose, frequência e prescritor.
5. **Últimos Exames Alterados**: Biomarcadores recentes com flag `alto` ou `baixo` e faixas dos laudos.

---

## 3. Cenários BDD (Comportamento)

### Cenário 1: Gerar resumo para consulta médica por especialidade
- **DADO QUE** o usuário seleciona o membro "Ana" e a especialidade "Cardiologia"
- **QUANDO** ele informa a queixa principal "Palpitações ocasionais e cansaço"
- **E** clica em "Gerar Resumo para Consulta"
- **ENTÃO** o sistema filtra exames cardiológicos, medicamentos ativos e condições relacionadas
- **E** apresenta um layout de impressão limpo com a Isenção Clínica no rodapé.
