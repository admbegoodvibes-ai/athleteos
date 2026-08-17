# 📔 AthleteOS Engineering Bible
# Volume 6 — Automações

## 1. Visão Geral de Automação

### 1.1 Por que o n8n como motor de automação
O n8n é o núcleo de orquestração do AthleteOS. Ele foi escolhido por ser uma plataforma baseada em nós (node-based) altamente visual, flexível e orientada a código, permitindo a criação de lógicas complexas sem abrir mão da facilidade de manutenção. Além disso, o suporte nativo a webhooks, manipulação de JSON e integração fácil com APIs REST faz dele a ferramenta perfeita para orquestrar as interações entre Supabase, Gemini e Evolution API.

### 1.2 n8n Cloud vs Self-Hosted
**Recomendação:** Self-Hosted (via Docker).
Embora o n8n Cloud ofereça conveniência, a versão self-hosted é recomendada para o AthleteOS pelas seguintes razões:
- **Controle total de dados:** Manter dados sensíveis de atletas em nossa infraestrutura.
- **Custo-benefício:** Previsibilidade de custos em escala, sem cobrança por execução de workflow.
- **Integração em rede interna:** Facilidade de comunicação com bancos de dados e serviços na mesma rede (ex: Supabase local/self-hosted).

### 1.3 Arquitetura Orientada a Eventos
A arquitetura baseia-se no modelo **Triggers → Processing → Actions**:
- **Triggers:** Webhooks (do Next.js ou Supabase) ou Agendamentos (Cron). Iniciam a execução de forma assíncrona.
- **Processing:** Formatação de dados, chamadas a APIs de IA (Gemini), estruturação e validação de JSON.
- **Actions:** Inserção no banco de dados, envio de mensagens via WhatsApp/Email.

### 1.4 Convenção de Nomenclatura para Workflows
Para manter a organização, siga o padrão:
`[Contexto] - [Ação principal] (Gatilho)`
Exemplos:
- `Match - Análise Pós-Jogo (Webhook)`
- `Wellness - Lembrete Diário (Cron)`
- `Alert - Carga Alta (DB Webhook)`

### 1.5 Estratégia de Tratamento de Erros
Todo workflow crítico deve conter um sub-fluxo de erro (Error Trigger). Em caso de falha de um nó, o n8n deve capturar o erro, registrar os detalhes na tabela `error_logs` do Supabase e notificar a equipe de engenharia (via Slack/Email/WhatsApp admin).

### 1.6 Melhores Práticas de Gerenciamento de Credenciais
Nunca coloque chaves de API "hardcoded" em nós HTTP. Utilize sempre o gerenciador de credenciais do n8n para armazenar chaves do Supabase, Evolution API e Gemini. As credenciais são encriptadas no banco do n8n.

### 1.7 Monitoramento e Alertas para Workflows Falhos
Configure alertas para quando workflows essenciais falharem repetidamente. O n8n permite configurar o fluxo de "Error Workflow" globalmente nas configurações do sistema.

---

## 2. Infraestrutura n8n

### 2.1 Setup e Configuração
**Método de Instalação Recomendado:** Docker + PostgreSQL.

**docker-compose.yml de exemplo:**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    restart: always
    environment:
      - POSTGRES_USER
      - POSTGRES_PASSWORD
      - POSTGRES_DB
    volumes:
      - db_data:/var/lib/postgresql/data

  n8n:
    image: docker.n8n.io/n8nio/n8n
    restart: always
    environment:
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=${POSTGRES_DB}
      - DB_POSTGRESDB_USER=${POSTGRES_USER}
      - DB_POSTGRESDB_PASSWORD=${POSTGRES_PASSWORD}
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER
      - N8N_BASIC_AUTH_PASSWORD
      - WEBHOOK_URL=https://n8n.athleteos.com/
    ports:
      - "5678:5678"
    depends_on:
      - postgres
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  db_data:
  n8n_data:
```

**Configuração de SSL/HTTPS:**
Recomenda-se utilizar um reverse proxy como Nginx Proxy Manager ou Traefik para gerenciar os certificados SSL do Let's Encrypt para o domínio `n8n.athleteos.com`.

**Estratégia de Backup:**
Realizar dump diário do banco de dados PostgreSQL do n8n, garantindo o versionamento de todos os workflows e credenciais.

### 2.2 Credenciais Necessárias
No n8n, você precisará configurar:
- **Supabase API:** `service_role key` para acesso total em background e `URL` do projeto.
- **Google Gemini API:** Chave de API gerada no Google AI Studio.
- **Evolution API (WhatsApp):** API Key e URL da instância do Evolution.
- **Google OAuth:** Para integrações com YouTube e Calendar.
- **SMTP (Email):** Credenciais do provedor de e-mail transacional (ex: Resend, SendGrid).

> A rotação de chaves deve ocorrer a cada 90 dias ou imediatamente após exposição suspeita.

---

## 3. Workflows Detalhados

### 3.1 Workflow: Análise Pós-Jogo
**Propósito:** Receber dados da partida submetidos pelo atleta, enviar para análise do Gemini, armazenar a resposta estruturada e embeddings, e notificar o atleta.
**Gatilho:** Webhook POST do Next.js.

**Fluxo Node a Node:**
1. **Webhook:** Recebe o payload com `{ match_id, athlete_id, match_data, self_evaluation }`.
2. **IF (Validação):** Checa se `match_id` e `athlete_id` existem.
3. **Supabase (Fetch):** Busca contexto do atleta (idade, posição, histórico de lesões).
4. **Set (Prompt Builder):** Constrói o prompt para o Gemini juntando os dados da partida e do atleta.
5. **Gemini (HTTP Request):** Envia o prompt para a API do Gemini Flash Lite solicitando output em JSON (análise técnica).
6. **JSON Parse:** Garante que a resposta da IA é um JSON válido.
7. **Supabase (Insert):** Salva na tabela `ai_reports`.
8. **Gemini (HTTP Request - Embedding):** Solicita a geração do embedding para o texto da análise.
9. **Supabase (Insert):** Salva o embedding na tabela `ai_embeddings`.
10. **Supabase (Update):** Atualiza a tabela `matches`, definindo `status = 'analyzed'`.
11. **Evolution API (WhatsApp):** Envia mensagem ao atleta avisando que a análise está pronta.
12. **Error Branch:** Se qualquer falha ocorrer, atualiza status para 'error' e notifica o admin.

**JSON do Workflow (Importável no n8n):**
```json
{
  "name": "Análise Pós-Jogo",
  "nodes": [
    {
      "parameters": {
        "path": "match-analysis",
        "responseMode": "lastNode",
        "options": {}
      },
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{$json.body.match_id}}",
              "operation": "isNotEmpty"
            }
          ]
        }
      },
      "name": "Validate Input",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [450, 300]
    },
    {
      "parameters": {
        "url": "=https://api.openai.com/v1/chat/completions",
        "method": "POST",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "Bearer YOUR_GEMINI_API_KEY_HERE"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "model",
              "value": "gemini-2.5-flash"
            },
            {
              "name": "messages",
              "value": "=[{\"role\": \"user\", \"content\": \"Faça a análise técnica desta partida: {{$json.body.match_data}}\"}]"
            }
          ]
        },
        "options": {}
      },
      "name": "Gemini AI",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 3,
      "position": [650, 280]
    }
  ],
  "connections": {
    "Webhook": {
      "main": [
        [
          {
            "node": "Validate Input",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Validate Input": {
      "main": [
        [
          {
            "node": "Gemini AI",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "active": false,
  "settings": {}
}
```

### 3.2 Workflow: Feedback Comportamental
**Propósito:** Extrair tendências comportamentais baseadas na análise técnica.
**Gatilho:** Encadeado ao fluxo 3.1.
**Fluxo:**
1. **Trigger:** Finalização do fluxo de análise técnica.
2. **Prompt Builder:** Cria prompt focado em psicologia e comportamento.
3. **Gemini:** Gera feedback comportamental.
4. **Supabase:** Atualiza a tabela `ai_reports` fazendo um append com o feedback.
5. **Evolution API:** Envia um resumo motivacional via WhatsApp.

### 3.3 Workflow: Lembrete Diário de Wellness
**Propósito:** Aumentar a taxa de preenchimento do questionário de Wellness diário.
**Gatilho:** Schedule Trigger (Cron) diário às 7:00 AM BRT.
**Fluxo:**
1. **Supabase:** Busca atletas ativos.
2. **Supabase:** Filtra atletas que não possuem registro em `wellness_logs` hoje.
3. **Loop:** Itera sobre cada atleta faltante.
4. **Evolution API:** Envia mensagem personalizada via WhatsApp com o link dinâmico para preenchimento.
5. **Supabase:** Registra na tabela `notifications` que o lembrete foi enviado.

### 3.4 Workflow: Alerta de Carga Alta
**Propósito:** Proteger o atleta de overtraining notificando treinadores quando ACWR (Acute:Chronic Workload Ratio) > 1.5.
**Gatilho:** Supabase DB Webhook (INSERT na `workload_metrics`).
**Fluxo:**
1. **Webhook:** Recebe payload de inserção de métrica de carga.
2. **Supabase (Fetch):** Busca nome do atleta e contatos do treinador.
3. **Evolution API / SMTP:** Envia alerta crítico para o WhatsApp/Email do treinador.
4. **Supabase (Insert):** Registra o alerta.

### 3.5 Workflow: Alerta de Wellness Baixo
**Propósito:** Identificar rápida degradação no bem-estar (Wellness Score < 2.5).
**Gatilho:** Supabase DB Webhook (INSERT na `wellness_logs`).
**Fluxo:**
1. **Webhook:** Recebe payload de log.
2. **Supabase (Fetch):** Busca dados do atleta.
3. **Evolution API:** Envia alerta ao treinador ou fisiologista.
4. **Supabase (Insert):** Registra evento na tabela de notificações.

### 3.6 Workflow: Relatório Semanal
**Propósito:** Gerar panorama semanal consolidado.
**Gatilho:** Schedule Trigger (Domingo, 20:00 BRT).
**Fluxo:**
1. **Supabase:** Busca todos os atletas ativos.
2. **Loop (Sub-workflow):** Para cada atleta:
   - Busca `matches`, `training_sessions`, `wellness_logs` e `workload_metrics` dos últimos 7 dias.
   - Formata dados para o Gemini.
   - **Gemini:** Gera o relatório semanal estruturado.
   - **Supabase:** Salva o relatório tipo `weekly`.
   - **Evolution API:** Dispara resumo ao atleta e treinador.

### 3.7 Workflow: Relatório Mensal de Evolução
**Propósito:** Avaliação macro de evolução mensal comparativa.
**Gatilho:** Schedule Trigger (Último dia do mês, 20:00 BRT).
**Fluxo:** Semelhante ao semanal, mas comparando o mês atual (T) com o mês anterior (T-1), fornecendo insights de evolução de performance via IA.

### 3.8 Workflow: Ingestão de Vídeos do YouTube
**Propósito:** Manter o portfólio de vídeos do atleta atualizado automaticamente.
**Gatilho:** Schedule Trigger diário (ou manual).
**Fluxo:**
1. **YouTube API:** Busca novos vídeos publicados nos canais vinculados aos atletas.
2. **HTTP Node / Supabase:** Faz download do thumbnail e faz o upload para o Supabase Storage.
3. **Supabase (Insert):** Adiciona registro em `media_assets`.
4. **Evolution API:** Notifica o atleta que seu vídeo foi indexado no portfólio.

### 3.9 Workflow: Backup Diário
**Propósito:** Backup de segurança de tabelas essenciais.
**Gatilho:** Schedule Trigger (3:00 AM BRT).
**Fluxo:**
1. **HTTP / Postgres Node:** Realiza um dump JSON ou CSV das tabelas críticas.
2. **Execute Command / Script:** Comprime (GZIP).
3. **AWS S3 / Google Drive:** Faz o upload.
4. **Discord/Slack:** Notifica status (Sucesso ou Falha).

### 3.10 Workflow: Sync Instagram (Futuro)
**Propósito:** Sincronizar posts do Instagram para compor o portfólio de mídia.
**Gatilho:** Webhook do Instagram Graph API na publicação de novo post.
**Fluxo:** Recebe detalhes (imagem/legenda), armazena em `media_assets` e atualiza portfólio do jogador.

---

## 4. Webhooks

### 4.1 Webhook do Next.js para n8n
- **URL Convention:** `https://n8n.athleteos.com/webhook/{workflow-id}` (ou slugs descritivos, ex: `/webhook/match-analysis`).
- **Autenticação:** Adicionar Header personalizado `X-N8N-Webhook-Secret: [SHARED_SECRET]`.
- **Payload Schema:** TypeScript Type
```typescript
type WebhookPayload = {
  event_type: string;
  athlete_id: string;
  data: Record<string, any>;
  timestamp: string;
}
```
- **Timeout:** Configurar timeout de resposta rápido. Operações pesadas no n8n devem retornar `200 OK` imediatamente e processar em background.

### 4.2 Webhooks do Supabase
- **Configuração:** No painel do Supabase -> Database -> Webhooks.
- **Eventos:** `INSERT`, `UPDATE`, `DELETE`.
- **Segurança:** Incluir segredo HTTP para garantir que apenas o Supabase acione a rota do n8n.

---

## 5. Integração WhatsApp (Evolution API)

### 5.1 Setup
- Utilizar Docker para rodar uma instância do Evolution API isolada.
- Conectar a instância via código QR.
- Utilizar as rotas `/message/sendText` e `/message/sendMedia` no n8n via HTTP Request node.

### 5.2 Templates de Mensagem

**Lembrete de Wellness (Manhã):**
> "Bom dia, *{{nome}}*! ☀️ Lembre-se de preencher seu questionário de wellness hoje para mantermos o monitoramento em dia. Leva só 1 minuto: {{link}}"

**Notificação de Relatório IA (Pronto):**
> "Fala *{{nome}}*! 🤖 A análise do seu último jogo já está disponível no seu painel AthleteOS. Confira os insights técnicos e dicas de melhoria aqui: {{link_analise}}"

**Alerta de Carga Alta (Para o Treinador):**
> "⚠️ *Alerta de Carga:* O atleta *{{nome}}* ultrapassou a razão de carga aguda/crônica (ACWR de {{acwr_valor}}). Risco elevado de lesão. Recomenda-se diminuir o volume do próximo treino."

**Alerta de Wellness Baixo (Para o Treinador):**
> "⚠️ *Alerta Wellness:* *{{nome}}* relatou fadiga extrema e qualidade ruim de sono hoje (Score: {{wellness_score}})."

**Resumo Semanal:**
> "E aí *{{nome}}*, confira o resumo da sua semana! 📊 Você completou {{qtd_treinos}} treinos e jogou {{qtd_jogos}} partidas. Sua evolução tática teve destaque positivo. Veja o relatório completo: {{link}}"

**Relatório de Evolução Mensal:**
> "Seu relatório de evolução de *{{mes}}* chegou! 📈 Comparado ao mês anterior, você melhorou seu vigor físico e aumentou participações diretas. Continue o ótimo trabalho! Ver detalhes: {{link}}"

### 5.3 Rate Limiting
- Respeite o limite de envio para evitar banimento (Meta). Envie campanhas massivas em blocos e utilize delays (Wait node do n8n) em loops grandes.
- Processo de **Opt-out**: Lide com respostas "PARAR" registrando `whatsapp_opt_out = true` na tabela de perfil do atleta.

---

## 6. Integração Email

- Configurar o node **Send Email** ou **HTTP Request** com provedores transacionais como Resend (via API REST).
- Templates em HTML devem ser responsivos, seguindo o design system do AthleteOS.
- **Uso Comum:** Notificação de olheiros (Scout Interest), Onboarding (Welcome Email), Recuperação de Senhas.

---

## 7. Integração Google Calendar

- **Sync Treinos:** Ao criar um treino na plataforma de administração, injetar evento no calendário do time via API.
- **Sync Partidas:** Manter calendário de competições atualizado automaticamente.
- **Two-way Sync:** Necessita de webhook do Google Calendar para o n8n capturar alterações (mudanças de horário e cancelamentos) e refletir no Supabase.

---

## 8. Monitoramento de Workflows

- **Logs do n8n:** Habilitar log de execução em banco de dados e limpar periodicamente execuções bem-sucedidas para salvar espaço.
- **Meta-Workflow (Error Notification):** Um workflow específico acionado pelo trigger "On Error" que captura o ID da execução, nome do workflow falho e envia pro Discord/Slack da engenharia.
- **Dashboard:** Integrar banco de log do n8n com o Metabase/Grafana para rastrear a taxa de sucesso das automações (uptime).

---

## 9. Testes de Workflows

- Ao desenvolver, utilize o **Execute Workflow** do n8n em modo manual fornecendo **Mock Data** via nós "Set" no início da cadeia.
- Para webhooks, utilize ferramentas como Postman ou a aba Thunder Client do VSCode para disparar payloads simulados.
- **Staging:** Mantenha uma instância n8n de staging apontando para um Supabase de staging antes de promover workflows críticos para produção.

---

## 10. Escala e Performance

- **Queue Management:** Para tarefas em massa (ex: gerar 500 relatórios semanais simultâneos), não force o fluxo principal. Salve as "jobs" no banco de dados e use Cron para processar em lotes (batch processing).
- **Worker Mode:** Para alto volume de processamento, configure o n8n no modo **Main-Worker architecture** com RabbitMQ/Redis, separando os nós de execução.
- **Rate Limiting:** Em nós que consomem APIs de terceiros (Gemini/Evolution), sempre trate código HTTP 429 e aplique delays estratégicos para evitar estrangulamento de rede.

---

*Documento gerado como parte da AthleteOS Engineering Bible. Volume 6 de 10 — Automações. AthleteOS © 2026*
