# Salus 🩺 — Central de Inteligência de Saúde da Família (v0.3.0)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Status: Beta](https://img.shields.io/badge/status-v0.3.0--beta-orange.svg)]()
[![Platform: Web App & Multi-AI](https://img.shields.io/badge/Plataforma-Web%20App%20%7C%20Local%20Markdown-blue.svg)]()

**Salus** é uma solução completa e segura para gerenciar o histórico de saúde de toda a família — **pessoas e animais de estimação (cães e gatos)**.

Ele combina uma **aplicação web moderna (React + Express + Firestore)** com uma **estrutura em arquivos locais (Markdown + YAML)**, garantindo que cada usuário mantenha propriedade total sobre seus dados médicos e sobre a cota de Inteligência Artificial utilizada.

---

## 🚀 Como Usar o Salus

O Salus foi projetado com duas formas flexíveis de utilização:

### 1. 🌐 Aplicativo Web (Salus Web App)

Você pode acessar o aplicativo web diretamente pelo navegador:

1. **Entrar com Conta Google:** Cria seu espaço isolado e sincroniza backups.
2. **Modo Experimental Sem Conta:** Habilita login anônimo instantâneo com isolamento por UID único no Firestore. Você pode clicar em **"Ver com dados de exemplo"** para testar a interface com a Família Exemplo imediatamente.

### 2. 💻 Framework em Arquivos Locais (`npx salus-ai`)

Para rodar 100% no seu computador (via Obsidian, Cursor, Claude Code ou VS Code):

```bash
npx salus-ai init MinhaSaude
```

Siga as instruções em `COMECE_AQUI.md` dentro da pasta criada.

---

## ⚡ Uso Com e Sem Inteligência Artificial

> [!IMPORTANT]
> **A IA é 100% opcional.** O Salus funciona como um gerenciador de saúde de excelência mesmo para quem nunca cadastrar nenhuma chave de API.

### 🟢 Sem IA (Uso Manual Completo e Gratuito)
Todas as telas e recursos essenciais funcionam sem nenhuma chave de API:
- Cadastrar pessoas e animais de estimação.
- Gerenciar Ficha Médica, Alergias, Contatos e Especialistas.
- Controlar Medicamentos Em Uso, Prescritos e Descontinuados.
- Rastrear Vacinas aplicadas e futuras doses.
- Acompanhar Tabela Evolutiva de Exames e Marcadores.
- Linha do Tempo e Histórico Familiar.
- Caixa de Entrada (upload de documentos e associação manual).
- Exportação e Importação completa de dados em arquivo `.zip`.

### 🟣 Com IA (Extração de Documentos & Chat Assistente)
A IA é ativada apenas para acelerar tarefas complexas:
- **Extração Automática:** Lê laudos, exames em PDF ou foto e gera uma **Proposta Clínica** com preenchimento automático.
- **Chat Assistente:** Responde a perguntas em linguagem natural sobre o histórico da família e sugere novos apontamentos.

---

## 🔑 Onde Obter uma Chave de API Gratuita (BYOK)

No Salus, você traz sua própria chave (**Bring Your Own Key**). Você pode cadastrar sua chave em **Ajustes → Chave de API da IA**.

Opções de provedores com planos ou cotas gratuitas:

| Provedor | Onde Obter a Chave Gratuita | Destaque |
|---|---|---|
| **Google Gemini** | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) | Cota gratuita muito generosa, suporte a visão/PDF nativo |
| **Groq Cloud** | [console.groq.com/keys](https://console.groq.com/keys) | Inferência de modelos abertos ultrarrápida e gratuita |
| **OpenRouter** | [openrouter.ai/keys](https://openrouter.ai/keys) | Acesso a múltiplos modelos com créditos ou modelos grátis |
| **Mistral AI** | [console.mistral.ai](https://console.mistral.ai) | Modelos abertos de alta qualidade |
| **OpenAI** | [platform.openai.com](https://platform.openai.com) | Suporte ao GPT-4o e GPT-4o-mini |

---

## 📁 Conexão ao Google Drive (Autorização Única)

O Salus não armazena arquivos pesados (PDFs, fotos de exames ou receitas) no banco de dados da aplicação. Em vez disso, conecta-se diretamente ao **seu próprio Google Drive**:

1. No primeiro upload ou durante o Onboarding, você concede permissão do Google Drive (`drive.file`).
2. O consentimento usa `access_type=offline` para obter um **`refresh_token`**.
3. Esse token é mantido exclusivamente no seu documento protegido no Firestore (`/usuarios/{uid}/perfil/config`) e é trocado no servidor por tokens de acesso temporários.
4. **O consentimento é feito uma única vez:** você nunca é interrompido pedindo autorização a cada upload ou sessão futura.
5. Todos os seus documentos ficam salvos com segurança em uma pasta dedicada chamada **`Salus App`** no seu próprio Google Drive.

---

## 🔒 Arquitetura, Isolamento e Limitações

- **Isolamento Total Multi-Tenant:** Toda informação do seu grupo familiar vive sob a coleção `/usuarios/{uid}/...` no Firestore. As Regras de Segurança do Firestore garantem que apenas requisições autenticadas onde `request.auth.uid == uid` conseguem ler ou gravar dados.
- **Sem Custos ou Leitura pelo Mantenedor:** O mantenedor do aplicativo não visualiza, não armazena, não acessa e não paga pelas requisições de IA ou pelos arquivos de nenhum usuário.
- **Portabilidade de Dados:** Seus arquivos originais continuam no seu Google Drive mesmo se você parar de usar o aplicativo.
- 💾 **Recomendação de Backup Periódico:** Recomendamos exportar periodicamente seu arquivo de backup `.zip` na tela **Ajustes → Portabilidade**. A exportação gera um arquivo compatível com o formato do repositório Salus local.

---

## 🩺 Núcleo Clínico Inviolável

 O Salus segue 9 regras clínicas invioláveis:

1. **Nunca diagnostica e nunca prescreve.** A interpretação é sempre do médico ou veterinário.
2. **Nunca usa faixa de referência memorizada ou calculada.** Apenas a faixa impressa no laudo.
3. **Nunca amplifica alarme.** Não usa termos de pânico como "urgente", "crítico" ou "perigoso".
4. **Nada é gravado sem confirmação explícita.** Toda alteração passa por uma Proposta aprovada pelo usuário.
5. **Medicamento prescrito não vira "em uso" automaticamente.**
6. **Vínculo biológico governa cruzamento genético.** Distingue membros biológicos, adotivos e enteados.
7. **Nunca mistura espécies.** Vacinas de cão não se aplicam a gato ou humano.
8. **Índice compacto primeiro.** Envia resumos aos prompts antes dos dados completos.
9. **IA é sempre opcional.** O uso manual é 100% completo e preservado.

---

## 📜 Licença e Autoria

Distribuído sob a licença **MIT**. Veja [`LICENSE`](LICENSE) para mais detalhes.

<p align="center">
  Desenvolvido por <a href="https://github.com/alberthpalhares">Alberth Palhares</a>
</p>
