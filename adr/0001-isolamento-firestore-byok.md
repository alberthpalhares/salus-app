# ADR 0001: Isolamento Multi-Tenant por UID no Firestore e Modelo BYOK

- **Status**: Aceito
- **Data**: 2026-07-24 / Atualizado 2026-08-01
- **Decisores**: Equipe Salus App

---

## Contexto
O Salus App gerencia informações sensíveis de saúde de pessoas e animais. O modelo tradicional onde o mantenedor do app paga os custos de API de IA centralizada e armazena os dados em banco global introduz dois grandes problemas:
1. **Risco Financeiro**: Custo de API imprevisível sob a conta do mantenedor.
2. **Risco de Privacidade**: Acumulação centralizada de dados de saúde de múltiplos usuários.

---

## Decisão
1. **Isolamento de Dados**: Todo documento clínico estruturado reside sob `/usuarios/{uid}/` no Firestore, protegido por Firestore Rules que impedem acesso cruzado entre usuários.
2. **Modelo BYOK (Bring Your Own Key)**: Cada usuário cadastra sua própria chave de API de IA (Gemini, Groq, OpenRouter, Mistral, OpenAI) salva de forma privada no seu Firestore. Chamadas de IA utilizam a chave e cota do próprio usuário.

---

## Consequências

### Positivas
- **Custo Zero para o Mantenedor**: O uso de IA não consome a cota financeira do projeto.
- **Privacidade por Desenho (Privacy by Design)**: Cada usuário é dono isolado dos seus dados e credenciais.

### Negativas / Riscos
- Usuários sem chave de IA cadastrada não possuem acesso ao Chat ou extração por IA (mitigado pelo suporte a preenchimento manual completo no app).
