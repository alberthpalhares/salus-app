# Governança de Segurança & Privacidade (LGPD) — Salus App

> Este documento define a Matriz de Conformidade de Segurança e Proteção de Dados Pessoais de Saúde do **Salus App**, em cumprimento à Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018, Art. 5º II).

---

## 1. Princípios Invioláveis de Arquitetura de Dados

### 1. Dados Clínicos Estruturados no Firestore (Isolados por `uid`)
- **Regra de Segurança do Firestore**:
  ```firestore
  match /usuarios/{uid}/{documento=**} {
    allow read, write: if request.auth != null && request.auth.uid == uid;
  }
  ```
- Nenhum usuário pode ler ou alterar dados clínicos estruturados de outro usuário sob nenhuma hipótese.

---

### 2. Arquivos Originais no Google Drive Próprio do Usuário
- **Escopo OAuth Restrito**: O app solicita apenas o escopo `https://www.googleapis.com/auth/drive.file`.
- **Soberania do Usuário**: Os arquivos físicos (PDFs de laudos, fotos de receitas, áudios) vivem exclusivamente no Google Drive da própria pessoa, na pasta `Salus App`.
- **Zero Storage Próprio**: O projeto Firebase do Salus App **não possui Firebase Storage habilitado** e nunca armazena cópia física dos documentos.

---

### 3. Proteção das Chaves de API de IA (BYOK — Bring Your Own Key)
- As chaves de API dos provedores de IA (Gemini, Groq, OpenRouter, Mistral, OpenAI) residem no documento privado `/usuarios/{uid}/perfil/config` do próprio usuário no Firestore.
- O servidor Node.js serverless é o único intermediário que utiliza a chave recebida para efetuar chamadas à API do provedor em memória de requisição.
- Os bytes de arquivos enviados para extração por IA trafegam via HTTPS em memória volátil da função serverless e são descartados imediatamente após a resposta.

---

### 4. Direito ao Esquecimento & Exclusão Total
- Ao acionar a opção "Apagar Conta" na tela de Ajustes, o sistema executa a exclusão de todas as subcoleções do Firestore vinculadas ao `uid` do usuário.
- Como os arquivos originais residem no Google Drive pessoal do usuário, eles permanecem sob o domínio do usuário e podem ser removidos por ele a qualquer momento diretamente no Drive.
