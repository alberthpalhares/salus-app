# Especificação SDD/BDD — Módulo de Propostas & Caixa de Entrada

## 1. Objetivo do Módulo
Permitir o upload e processamento de documentos de saúde (laudos, receitas, atestados), gerando uma Proposta legível antes de qualquer alteração no banco de dados.

---

## 2. Regra Fundamental de Segurança Clinica
> **Regra Clínica 4**: O Salus nunca grava exames, medicamentos ou eventos no banco de dados sem a confirmação explícita do usuário via `<PainelDeProposta>`.

---

## 3. Cenários BDD (Comportamento)

### Cenário 1: Processar documento via IA e gerar proposta
- **DADO QUE** o usuário envia um PDF de exame de sangue para a Caixa de Entrada
- **E** possui uma chave de IA válida cadastrada (BYOK)
- **QUANDO** o serviço `/api/extrair-documento` analisa o arquivo
- **ENTÃO** é retornado um objeto `Proposta` estruturado com o schema Zod `propostaSchema`
- **E** o status do item na Caixa de Entrada muda para `'proposto'`.

### Cenário 2: Aprovação parcial de proposta com gravação atômica
- **DADO QUE** o usuário visualiza o `<PainelDeProposta>` com 5 exames e 2 medicamentos sugeridos
- **QUANDO** ele desmarca 1 medicamento e altera o valor de 1 exame
- **E** clica em "Confirmar e Gravar"
- **ENTÃO** a função `aplicarProposta` executa um `writeBatch` atômico no Firestore
- **E** grava apenas os itens marcados com `incluir: true`
- **E** se fornecido um arquivo, envia o arquivo para a pasta do membro no Google Drive.
