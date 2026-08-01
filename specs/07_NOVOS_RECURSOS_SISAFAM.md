# Especificação Técnica SDD/BDD — Módulo 07: Novos Recursos SISAFAM

## Objetivos
Expandir a experiência do **SISAFAM (Sistema de Saúde da Família)** com recursos visuais lúdicos, acompanhamento financeiro de medicamentos, gestão de especialistas/clínicas de confiança, ficha médica pública configurável, dashboard de indicadores e persistência garantida do provedor Gemini IA.

---

## 1. Gestão Familiar & Avatares Lúdicos

### Contrato de Dados (Membro Extendido)
```ts
export interface Membro {
  id: string;
  nome: string;
  tipo?: 'pessoa' | 'cao' | 'gato' | 'outro';
  avatar_id?: string; // id do avatar lúdico (ex: 'homem_1', 'mulher_2', 'cao_happy', 'gato_cute')
  nascimento?: string;
  vinculo: 'biologico' | 'adotivo' | 'enteado';
  raca?: string;
  tipo_sanguineo?: string;
  plano_saude?: string;
  contatos_emergencia?: ContatoEmergencia[];
}
```

### Cenários BDD
- **Cenário 1.1: Personalização visual do integrante**
  - **DADO QUE** o usuário está editando um membro da família (pessoa ou pet)
  - **QUANDO** seleciona um avatar lúdico no modal e salva
  - **ENTÃO** o avatar é exibido imediatamente no Painel com a paleta de cores correspondente à espécie/vínculo.

- **Cenário 1.2: Edição do nome da família**
  - **DADO QUE** o usuário acessa as configurações da família no Painel
  - **QUANDO** altera o nome da família de "Família" para "Família Silva"
  - **ENTÃO** o cabeçalho e todos os relatórios da aplicação passam a exibir "Família Silva".

---

## 2. Dashboard Inteligente de Indicadores & Alertas

### Cenários BDD
- **Cenário 2.1: Cálculo de KPIs e visualização rápida**
  - **DADO QUE** existem integrantes cadastrados com vacinas e medicamentos
  - **QUANDO** o usuário acessa o Painel de Saúde
  - **ENTÃO** o dashboard exibe 4 cards de KPI com métricas consolidadas (Membros, Condições Ativas, Alertas 30d, Meds Ativos) e o gráfico visual de saúde da casa.

---

## 3. Reestruturação Visual de Condições em Acompanhamento

### Contrato de Dados (`CondicaoSaudeEstruturada`)
```ts
export interface CondicaoSaudeEstruturada {
  id: string;
  membro_id: string;
  nome: string;
  categoria: 'cronica' | 'aguda' | 'alergia' | 'cirurgica' | 'preventiva';
  gravidade: 'baixa' | 'moderada' | 'alta';
  status: 'ativa' | 'em_remissao' | 'resolvida';
  diagnostico_em?: string;
  medico_responsavel?: string;
  notas?: string;
}
```

### Cenários BDD
- **Cenário 3.1: Migração transparente de condições em texto**
  - **DADO QUE** o membro possui uma lista antiga de strings em `condicoes_ativas` (ex: `['Hipertensão', 'Asma']`)
  - **QUANDO** a Ficha do Membro é aberta
  - **ENTÃO** o sistema renderiza cada condição como um card estruturado com categoria padrão 'cronica' e gravidade 'moderada'.

---

## 4. Cadastro de Médicos, Veterinários e Clínicas de Confiança

### Contrato de Dados (`ProfissionalSaude`)
```ts
export interface ProfissionalSaude {
  id: string;
  nome: string;
  tipo: 'medico' | 'veterinario' | 'clinica' | 'hospital' | 'laboratorio';
  especialidade: string;
  crm_crmv_cnpj?: string;
  telefone?: string;
  whatsapp?: string;
  email?: string;
  endereco?: string;
  membros_vinculados: string[]; // IDs dos membros que frequentam
  observacoes?: string;
}
```

### Cenários BDD
- **Cenário 4.1: Vincular profissional a integrante da família**
  - **DADO QUE** o usuário cadastra a Dra. Paula (Pediatra)
  - **QUANDO** marca o membro "Lucas" na lista de atendidos
  - **ENTÃO** o Perfil do Lucas exibe o atalho para a Dra. Paula com botão de ação rápida para WhatsApp.

---

## 5. Histórico e Oscilação de Preço de Medicamentos

### Contrato de Dados (`RegistroPrecoMedicamento`)
```ts
export interface RegistroPrecoMedicamento {
  id: string;
  medicamento_nome: string;
  membro_id?: string;
  data_compra: string;
  preco: number;
  quantidade_embalagem: string;
  farmacia_estabelecimento: string;
  observacoes?: string;
}
```

### Cenários BDD
- **Cenário 5.1: Acompanhamento de variação de preço**
  - **DADO QUE** o medicamento "Losartana 50mg" foi comprado por R$ 20,00 em 01/05 e R$ 24,00 em 01/06
  - **QUANDO** o histórico de preços é visualizado
  - **ENTÃO** o sistema exibe um aumento de +20.0% com destaque visual em vermelho/alerta.

---

## 6. Persistência BYOK (Gemini API)

### Cenários BDD
- **Cenário 6.1: Persistência local e restauração de sessão**
  - **DADO QUE** o usuário salvou sua chave Gemini no BYOK
  - **QUANDO** o navegador é recarregado ou a sessão Firestore expira
  - **ENTÃO** o sistema recupera a chave de `localStorage` (`salus_byok_config`) mantendo a API ativa sem solicitar digitação novamente.

---

## 7. Ficha Médica Pública Seletiva

### Cenários BDD
- **Cenário 7.1: Gerar link de ficha com seções filtradas**
  - **DADO QUE** o usuário deseja compartilhar a ficha do integrante com uma clínica
  - **QUANDO** seleciona as caixas "Identificação" e "Alergias", omitindo "Exames"
  - **ENTÃO** o link/preview gerado expõe unicamente as seções selecionadas com QR Code.
