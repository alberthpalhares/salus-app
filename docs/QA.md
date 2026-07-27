# Salus App — Roteiro de Verificação Manual e Garantia de Qualidade (QA)

> **Versão:** 0.3.0  
> **Objetivo:** Fornecer um guia passo a passo para auditoria e teste de aceitação de todas as funcionalidades, regras de isolamento multi-tenant, Núcleo Clínico e resiliência do Salus App.

---

## 📋 Sumário
1. [Visão Geral e Pré-requisitos](#1-visão-geral-e-pré-requisitos)
2. [Bateria de Testes Automatizados (Vitest)](#2-bateria-de-testes-automatizados-vitest)
3. [Roteiro Manual de Testes (Passo a Passo)](#3-roteiro-manual-de-testes-passo-a-passo)
   - [Caso 01: Login e Autenticação Google](#caso-01-login-e-autenticação-google)
   - [Caso 02: Onboarding Bloqueado sem Consentimento](#caso-02-onboarding-bloqueado-sem-consentimento)
   - [Caso 03: Isolamento Multi-tenant (Segunda Conta Google)](#caso-03-isolamento-multi-tenant-segunda-conta-google)
   - [Caso 04: Uso Completo sem Chave de IA Cadastrada (P18 - Regra 9)](#caso-04-uso-completo-sem-chave-de-ia-cadastrada-p18---regra-9)
   - [Caso 05: Troca de Provedores de IA em Ajustes (P17 - BYOK)](#caso-05-troca-de-provedores-de-ia-em-ajustes-p17---byok)
   - [Caso 06: Upload de PDF, Foto e Áudio na Caixa de Entrada](#caso-06-upload-de-pdf-foto-e-áudio-na-caixa-de-entrada)
   - [Caso 07: Proposta com Membro Incerto](#caso-07-proposta-com-membro-incerto)
   - [Caso 08: Confirmação Parcial de Proposta](#caso-08-confirmação-parcial-de-proposta)
   - [Caso 09: Receita Marcada como Prescrita (Regra 5)](#caso-09-receita-marcada-como-prescrita-regra-5)
   - [Caso 10: Chat Registrando Vacina via Linguagem Natural](#caso-10-chat-registrando-vacina-via-linguagem-natural)
   - [Caso 11: Exportação e Importação de Dados (Portabilidade)](#caso-11-exportação-e-importação-de-dados-portabilidade)
   - [Caso 12: Exclusão de Conta com Oferta de Exportação](#caso-12-exclusão-de-conta-com-oferta-de-exportação)
   - [Caso 13: Resiliência a Recarregamento de Página (F5 em todas as etapas)](#caso-13-resiliência-a-recarregamento-de-página-f5-em-todas-as-etapas)

---

## 1. Visão Geral e Pré-requisitos

Para realizar os testes manuais e automatizados do Salus App, certifique-se de:
- Servidor em execução via `npm run dev` na porta 3000.
- Duas contas do Google válidas disponíveis para teste de isolamento multi-tenant.
- Navegador atualizado (Chrome / Firefox / Safari / Edge).

---

## 2. Bateria de Testes Automatizados (Vitest)

O Salus App inclui uma suíte de testes unitários automatizados para validação das regras de negócio puras:

```bash
npm test
```

### Escopo Coberto pelos Testes Automatizados:
1. **`tests/alertas.test.ts`**:
   - Cálculo de alertas para itens vencidos ontem (-1 dia), vencendo hoje (0 dias), em 30 dias (+30 dias), em 89 dias (+89 dias), em 91 dias (fora da janela <=90) e sem data.
   - Resiliência a viradas de ano (31/12 para 01/01).
   - Cálculo exato em fevereiro de anos bissextos (ex: 29 dias em 2028).
2. **`tests/indice.test.ts`**:
   - Garantia de que o snapshot do índice **não inclui** documentos originais brutos nem histórico ilimitado.
   - Limite estrito de no máximo 8 marcadores-chave mais recentes por membro.
   - Preenchimento do padrão `"faixa não informada no laudo"` para laudos sem faixa de referência.
3. **`tests/proposta.test.ts`**:
   - Medicamento extraído de receita salva como `prescrito` e **nunca** como `em_uso` sem resposta explícita.
   - Itens desmarcados pelo usuário (`incluir: false`) **não** são persistidos no banco.
   - Falhas no Google Drive abortam a gravação clínica atômica, mantendo a proposta pendente sem dados parciais corrompidos.
4. **`tests/portabilidade.test.ts`**:
   - Roundtrip completo: `Exportar → Importar → Analisar → Re-exportar` garantindo integridade e recuperação 100% dos registros.

---

## 3. Roteiro Manual de Testes (Passo a Passo)

### Caso 01: Login e Autenticação Google
1. Acesse o app sem sessão.
2. **Passo:** Clique em **"Entrar com Google"**.
3. **Resultado Esperado:** A popup de autenticação do Google abre. Após autenticar, o app redireciona para o Onboarding (se primeiro acesso) ou para o Painel da Família.
4. **Passo:** Recarregue a página (F5).
5. **Resultado Esperado:** A sessão permanece ativa, sem solicitar login novamente.
6. **Passo:** Clique em **"Sair da Conta"** no menu do perfil.
7. **Resultado Esperado:** A sessão é encerrada e a tela de Login é exibida.

---

### Caso 02: Onboarding Bloqueado sem Consentimento
1. Faça login com uma nova conta Google.
2. **Passo:** Avance nas telas iniciais de Boas-vindas e Cadastro da Família.
3. **Passo:** Na etapa de Conectar Google Drive, clique em **"Não autorizar agora"** ou cancele o consentimento na janela.
4. **Resultado Esperado:** O botão para concluir o onboarding permanece bloqueado ou exibe aviso informando que o acesso ao Google Drive é necessário para o armazenamento seguro de documentos em sua própria nuvem.
5. **Passo:** Autorize o escopo do Google Drive.
6. **Resultado Esperado:** O botão de conclusão é liberado e o usuário é guiado para o Painel Principal.

---

### Caso 03: Isolamento Multi-tenant (Segunda Conta Google)
1. Estando logado com a **Conta A** (com membros e exames cadastrados), anote o nome da família e dos membros.
2. **Passo:** Faça logout da Conta A e faça login com a **Conta B** (segunda conta Google).
3. **Resultado Esperado:** O Salus App **não** exibe nenhum dado da Conta A. A Conta B inicia seu próprio fluxo de Onboarding/Painel zerado sob `/usuarios/{uid_B}/`.
4. **Passo:** Cadastre o membro "Ana Conta B" na Conta B.
5. **Passo:** Faça logout da Conta B e entre novamente com a Conta A.
6. **Resultado Esperado:** Todos os dados da Conta A permanecem intactos e o membro "Ana Conta B" **não** aparece para a Conta A.

---

### Caso 04: Uso Completo sem Chave de IA Cadastrada (P18 - Regra 9)
1. Acesse **Ajustes → Configuração de IA** e certifique-se de que **nenhuma chave de IA está cadastrada** (ou remova a chave existente).
2. **Passo:** Navegue pelo Painel da Família, visualize a Agenda de Vencimentos e adicione um membro manualmente na aba Família.
3. **Resultado Esperado:** Todas as telas e cadastros manuais funcionam perfeitamente sem falha.
4. **Passo:** Vá para a **Caixa de Entrada**, suba um documento e faça a associação manual com o membro "Ana Silva", tipo "Laudo de Exame" e data do exame.
5. **Resultado Esperado:** O documento é organizado na pasta Salus App do Google Drive e associado à ficha do membro sem necessidade de IA.
6. **Passo:** Acesse a tela de **Chat**.
7. **Resultado Esperado:** É exibido um cartão informativo amigável avisando que o assistente de linguagem natural necessita de uma chave cadastrada em Ajustes, sem travar ou quebrar o app.

---

### Caso 05: Troca de Provedores de IA em Ajustes (P17 - BYOK)
1. Acesse **Ajustes → Provedor de IA**.
2. **Passo:** Selecione o provedor **Gemini (Google)** e informe a chave de API. Salve.
3. **Resultado Esperado:** Toast de confirmação exibido com sucesso.
4. **Passo:** Altere o provedor para **OpenAI / Compatível (Ex: Groq / OpenRouter / Preset Gratuito)**. Preencha a URL base (se aplicável), nome do modelo e chave de API. Salve.
5. **Resultado Esperado:** A configuração é salva no Firestore sob `/usuarios/{uid}/perfil/config.provedor_ia`.
6. **Passo:** Recarregue a página (F5) e verifique os Ajustes.
7. **Resultado Esperado:** O provedor e o modelo selecionados anteriormente são recarregados corretamente.

---

### Caso 06: Upload de PDF, Foto e Áudio na Caixa de Entrada
1. Acesse a **Caixa de Entrada**.
2. **Passo:** Faça o upload de um arquivo **PDF** (ex: laudo de exame em PDF).
3. **Resultado Esperado:** O arquivo é recebido, visualizado na listagem da Caixa de Entrada e o upload para o Google Drive é concluído.
4. **Passo:** Faça o upload de uma **imagem/foto** (ex: foto de receita em JPG/PNG).
5. **Resultado Esperado:** O arquivo de imagem é aceito e exibido com pré-visualização.
6. **Passo:** Faça o upload de um **áudio** (ex: nota de voz do médico em MP3/M4A/WAV).
7. **Resultado Esperado:** O áudio é recebido na caixa de entrada e disponibilizado para extração/arquivamento.

---

### Caso 07: Proposta com Membro Incerto
1. Envie um documento onde o nome do membro não é evidente ou não bate com nenhum membro cadastrado.
2. **Passo:** Clique em **"Analisar com IA"**.
3. **Resultado Esperado:** O Painel de Proposta exibe um aviso destacado solicitando a seleção explícita de qual membro da família aquele documento pertence.
4. **Passo:** Selecione o membro no dropdown do Painel de Proposta.
5. **Resultado Esperado:** A proposta vincula todos os exames/medicamentos ao membro selecionado e libera o botão de aprovação.

---

### Caso 08: Confirmação Parcial de Proposta
1. Abra uma proposta contendo 3 exames e 2 medicamentos sugeridos.
2. **Passo:** Desmarque o segundo exame e o primeiro medicamento.
3. **Passo:** Clique em **"Aprovar e Gravar no Histórico"**.
4. **Resultado Esperado:** Apenas os 2 exames mantidos e o 1 medicamento mantido são salvos no Firestore do membro. Os itens desmarcados são ignorados.

---

### Caso 09: Receita Marcada como Prescrita (Regra 5)
1. Faça a leitura de uma Receita Médica que contenha o medicamento "Amoxicilina 500mg".
2. **Passo:** Observe o status do medicamento no Painel de Proposta.
3. **Resultado Esperado:** O status inicial é obrigatoriamente **`prescrito`**.
4. **Passo:** No Painel de Proposta, responda à pergunta "Já está tomando este medicamento?" com "Não / Aguardando compra" e aprove a proposta.
5. **Resultado Esperado:** Ao acessar a ficha do membro na aba Medicamentos, o item aparece na seção **"Prescritos (Aguardando Confirmação)"** e **não** em "Em Uso".
6. **Passo:** Na ficha do membro, clique no botão "Já estou tomando".
7. **Resultado Esperado:** O status do medicamento transita para **`em_uso`**.

---

### Caso 10: Chat Registrando Vacina via Linguagem Natural
1. Com uma chave de IA configurada, acesse o **Chat**.
2. **Passo:** Digite a mensagem: *"Apliquei a vacina Gripe na Ana hoje e a próxima é em 1 ano"*.
3. **Resultado Esperado:** A IA responde gerando um **Painel de Proposta** estruturado com os dados da vacina. Nenhuma gravação direta é realizada no banco antes da sua ação.
4. **Passo:** Clique em **"Aprovar Proposta"** no chat.
5. **Resultado Esperado:** A vacina "Gripe" é registrada na ficha da Ana e adicionada à Agenda da Família.

---

### Caso 11: Exportação e Importação de Dados (Portabilidade)
1. Vá em **Ajustes → Portabilidade dos Dados**.
2. **Passo:** Clique em **"Exportar Dados (ZIP)"**.
3. **Resultado Esperado:** O download do arquivo `.zip` é iniciado. Abra o arquivo e verifique os arquivos `salus-app-backup.json`, `Familia/_index.yaml` e as pastas dos membros.
4. **Passo:** Clique em **"Importar Dados"**, selecione o arquivo `.zip` baixado e escolha o modo **"Substituir dados atuais"**.
5. **Resultado Esperado:** O progresso da importação é exibido e os dados do histórico são restaurados integralmente.

---

### Caso 12: Exclusão de Conta com Oferta de Exportação
1. Acesse **Ajustes → Zona de Perigo**.
2. **Passo:** Clique em **"Excluir Minha Conta"**.
3. **Resultado Esperado:** Um modal de confirmação abre com aviso de segurança e oferece explicitamente o botão **"Exportar meus dados em ZIP antes de excluir"**.
4. **Passo:** Clique em "Exportar dados antes de excluir".
5. **Resultado Esperado:** O backup ZIP é baixado para a máquina do usuário antes da exclusão.
6. **Passo:** Confirme a exclusão digitando "EXCLUIR".
7. **Resultado Esperado:** Todos os dados do usuário no Firestore sob `/usuarios/{uid}` são removidos e a sessão é encerrada.

---

### Caso 13: Resiliência a Recarregamento de Página (F5 em todas as etapas)
1. Durante cada uma das etapas abaixo, pressione **F5 (Reload)** no navegador:
   - Durante a edição da Ficha de um Membro.
   - Na visualização da Caixa de Entrada.
   - Na aba de Exames / Medicamentos.
   - Na tela de Ajustes.
2. **Resultado Esperado em todas as etapas:** O estado atual e as informações são restaurados do Firestore e a aplicação retorna à tela sem erros, sem tela em branco e sem perda de contexto do usuário autenticado.

---
*Fim do Roteiro de Verificação e QA — Salus App v0.3.0*
