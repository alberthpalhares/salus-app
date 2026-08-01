# Especificação SDD/BDD — Módulo de Evolução de Marcadores & Cruzamento Genético

## 1. Objetivo do Módulo
Visualizar graficamente a evolução temporal de biomarcadores (ex: Glicose, Colesterol LDL, TSH, Triglicérides) ao longo de múltiplos exames e comparar tendências entre membros da família com vínculo biológico confirmado.

---

## 2. Contratos & Regras Clínicas (Protocolo Clínico)
1. **Identificação do Laudo**: Os valores são exibidos com a data do exame e a `faixa_referencia_laudo` copiada do próprio laudo.
2. **Cruzamento Genético**: A comparação genético-hereditária de biomarcadores ocorre **exclusivamente entre membros com `vinculo: 'biologico'`**. Membros adotivos ou enteados são isolados da comparação genético-hereditária por razões clínicas.
3. **Não-mistura de Espécies**: Pessoas, Cães e Gatos nunca são comparados entre si nos mesmos gráficos.

---

## 3. Cenários BDD (Comportamento)

### Cenário 1: Visualizar gráfico de evolução de um marcador
- **DADO QUE** o usuário está no perfil da "Ana"
- **QUANDO** ele seleciona o marcador "Glicose em Jejum" na aba de Evolução
- **ENTÃO** o sistema renderiza um gráfico de linha do tempo exibindo os valores ordenados por data
- **E** destaca os exames com flag `alto` ou `baixo` com pontos visuais sóbrios.

### Cenário 2: Cruzamento genético com alerta de padrão familiar
- **DADO QUE** "Ana" (mãe, biológico) e "Pedro" (filho, biológico) possuem exames de "Colesterol Total" alterados
- **QUANDO** o usuário abre a tela de Cruzamento Genético Familiar
- **ENTÃO** o sistema exibe os dois gráficos sobrepostos
- **E** apresenta um alerta discreto: *"Padrão identificado em 2 membros com vínculo biológico. Leve este histórico ao médico."*
