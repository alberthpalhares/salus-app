# Especificação SDD/BDD — Módulo de Portabilidade & Google Drive

## 1. Objetivo do Módulo
Garantir a soberania dos dados do usuário permitindo exportação e importação completa em formato `.zip` legível por humanos (compatível com o framework Salus original) e arquivamento de documentos originais no Google Drive próprio do usuário.

---

## 2. Contratos de Formato
- **Estrutura do ZIP de Backup**:
  - `Familia/_index.yaml`
  - `Perfis/[NomeMembro]/Ficha.md`
  - `Perfis/[NomeMembro]/Medicamentos.md`
  - `Perfis/[NomeMembro]/Exames.md`
  - `Perfis/[NomeMembro]/Historico.md`

---

## 3. Cenários BDD (Comportamento)

### Cenário 1: Exportação completa do histórico
- **DADO QUE** o usuário solicita exportar seus dados em Ajustes
- **QUANDO** a função `exportarDadosUsuario` é executada
- **ENTÃO** todos os documentos do Firestore sob `/usuarios/{uid}/` são serializados em um arquivo `.zip`
- **E** o download do arquivo é iniciado imediatamente no navegador.

### Cenário 2: Importação de backup ZIP
- **DADO QUE** o usuário faz upload de um arquivo `.zip` de backup do Salus
- **QUANDO** o serviço `analisarArquivoBackup` processa a estrutura
- **ENTÃO** os membros, exames, medicamentos e vacinas são validados e importados atomicamente para o Firestore do usuário logado.
