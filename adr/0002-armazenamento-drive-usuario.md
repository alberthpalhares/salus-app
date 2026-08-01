# ADR 0002: Armazenamento de Arquivos Originais no Google Drive do Próprio Usuário

- **Status**: Aceito
- **Data**: 2026-07-24 / Atualizado 2026-08-01
- **Decisores**: Equipe Salus App

---

## Contexto
Arquivos físicos de exames (PDFs, fotos de receitas, áudios) representam o maior custo de armazenamento e maior responsabilidade de custódia de dados. O mantenedor não deseja armazenar esses arquivos no Firebase Storage do projeto.

---

## Decisão
Os arquivos físicos originais são enviados e armazenados exclusivamente no **Google Drive do próprio usuário**, utilizando OAuth 2.0 com escopo restrito `drive.file` (acesso limitado à pasta `Salus App` criada pelo aplicativo). O Firestore armazena apenas metadados (id do arquivo no Drive, tipo de documento, data, membro).

---

## Consequências

### Positivas
- **Soberania Total do Usuário**: Os documentos originais permanecem na conta Google do usuário.
- **Custo Zero de Armazenamento para o Projeto**: Sem custos com Firebase Storage ou infraestrutura de mídia.
- **Isolamento de Responsabilidade**: O mantenedor do app nunca tem acesso aos PDFs e fotos originais.

### Negativas / Riscos
- Exige consentimento OAuth do Google Drive no onboarding (mitigado pelo recurso ser opcional: o app funciona normalmente sem Drive conectado).
