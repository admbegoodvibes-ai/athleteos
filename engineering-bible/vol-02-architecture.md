# 📗 AthleteOS Engineering Bible
# Volume 2 — Arquitetura de Software

## 1. Visão Geral da Arquitetura

A arquitetura do AthleteOS foi desenhada para ser altamente escalável, segura e orientada a dados, suportando um ecossistema complexo de atletas juvenis, treinadores, olheiros e responsáveis. O coração da plataforma reside na combinação de renderização moderna no frontend, serviços gerenciados robustos no backend e inteligência artificial pervasiva.

```ascii
+---------------------------------------------------------------+
|                        Navegador / Cliente                    |
|  +--------------------+ +-------------------+ +-------------+ |
|  | Atletas (13-17)    | | Treinadores/Scouts| | Responsáveis| |
|  +--------------------+ +-------------------+ +-------------+ |
+-------------------------------+-------------------------------+
                                | HTTPS / WSS
+-------------------------------+-------------------------------+
|                       Next.js (App Router)                    |
|  +-----------------+ +------------------+ +-----------------+ |
|  | Server Actions  | | Client Components| | Route Handlers  | |
|  +-----------------+ +------------------+ +-----------------+ |
+--------+----------------------+-----------------------+-------+
         |                      |                       |
   REST  |                REST  | WSS (Realtime)        | REST
         v                      v                       v
+--------+-------+ +------------+-----------+ +---------+-------+
|   n8n Engine   | |     Supabase Backend   | |   Gemini AI     |
| (Automação)    | | (PostgreSQL, Auth,     | | (Análise,       |
| Workflows Async| |  Storage, Edge Funcs)  | |  Feedback, LLM) |
+--------+-------+ +------------+-----------+ +---------+-------+
         |                      |                       |
         +----------------------+-----------------------+
                (Comunicação Interna via Webhooks/APIs)
```

### Justificativa Tecnológica
- **Next.js (App Router):** Escolhido por sua renderização híbrida superior (Server e Client Components), permitindo SEO excelente para portfólios públicos e interatividade rápida no dashboard. Server Actions simplificam imensamente a mutação de dados sem a necessidade de APIs intermediárias pesadas.
- **Supabase:** Substitui a necessidade de gerenciar um backend complexo do zero. Fornece PostgreSQL (robusto, relacional, pgvector para AI), Autenticação integrada (vital para as múltiplas personas do app) e Realtime (essencial para notificações de carga de treino e mensagens).
- **n8n:** O motor de automação permite criar fluxos de trabalho assíncronos e integrações complexas (como alertas de fadiga, compilação de relatórios semanais) de forma visual, reduzindo código customizado e facilitando a manutenção lógica do negócio.
- **Google Gemini AI:** O cérebro analítico. Utiliza diferentes tamanhos de modelo para extrair insights de vídeos de jogos, analisar métricas de carga e gerar feedback humano para o desenvolvimento dos jovens atletas.

### Padrões de Comunicação
- **Frontend ↔ Backend:** Prioritariamente Server Actions do Next.js comunicando com o Supabase via cliente SDK (Edge/Server). Dados em tempo real usam WebSockets do Supabase Realtime.
- **Next.js ↔ Inteligência Artificial:** Integração direta com a API do Gemini a partir do lado do servidor (Edge Functions ou Next.js Server) para garantir a segurança das chaves de API.
- **Sistemas Assíncronos:** Webhooks do Supabase e Next.js disparam fluxos no n8n. O n8n, ao terminar o processamento, atualiza diretamente o banco de dados (Supabase) ou chama APIs internas.

---

## 2. Monorepo com Turborepo

A arquitetura do projeto utiliza um Monorepo gerenciado pelo Turborepo. Isso garante que configurações, componentes de UI e esquemas de banco de dados sejam compartilhados eficientemente, mantendo a tipagem estrita de ponta a ponta.

### Estrutura do Monorepo

```text
athleteos/
├── apps/
│   ├── web/               # Next.js App principal
│   └── docs/              # Documentação técnica e design system
├── packages/
│   ├── ui/                # Componentes React compartilhados (Tailwind, Radix)
│   ├── database/          # Esquemas do Supabase, migrations e tipos TypeScript gerados
│   ├── ai/                # Clientes e prompts do Gemini
│   ├── analytics/         # Módulos de cálculo esportivo (ACWR, sRPE)
│   ├── config/            # Prettier, ESLint, TypeScript configs base
│   └── types/             # Tipagens de domínio compartilhadas
├── supabase/              # Configuração local do Supabase e migrations SQL
├── workflows/             # Definições JSON exportadas do n8n
└── turbo.json             # Pipeline de execução do Turborepo
```

### `turbo.json` Base

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "db:generate": {
      "cache": false
    }
  }
}
```

---

## 3. Next.js Application (App Router)

A aplicação principal (`apps/web`) utiliza o App Router (`app/`) para definir a estrutura de roteamento e layouts.

### Grupos de Rotas

```text
app/
├── (public)/          # Marketing, Portfólio de Atletas (/p/[username])
├── (auth)/            # Login, Registro, Onboarding (/login, /signup)
├── (dashboard)/       # Área logada (/dashboard, /matches, /training)
│   ├── athlete/       # Visão do Atleta
│   ├── coach/         # Visão do Treinador
│   └── guardian/      # Visão do Responsável
├── api/               # Route Handlers genéricos
├── layout.tsx         # Root Layout (Providers)
└── page.tsx           # Home
```

### Estratégia de Componentes (Server vs Client)
- **Server Components (Default):** Usados para busca de dados diretas no Supabase, renderização de layouts, leitura de parâmetros de URL e SEO. Reduzem drasticamente o JS enviado ao cliente.
- **Client Components (`'use client'`):** Utilizados APENAS em componentes interativos que necessitam de `useState`, `useEffect`, ou escuta de eventos (ex: formulários de registro de sRPE, players de vídeo, botões interativos). Empurrados para as folhas da árvore de componentes.

### Mutação de Dados: Server Actions
As mutações (ex: registrar uma partida, salvar questionário de bem-estar) usam Server Actions no Next.js. Elas substituem APIs RESTful tradicionais para operações internas.

```typescript
// app/(dashboard)/athlete/training/actions.ts
'use server'

import { createServerClient } from '@packages/database';
import { revalidatePath } from 'next/cache';
import { srpeSchema } from '@packages/types';

export async function submitTrainingLoad(formData: FormData) {
  const supabase = createServerClient();
  // Validar autorização
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Validar inputs
  const rawData = Object.fromEntries(formData.entries());
  const parsed = srpeSchema.safeParse(rawData);
  
  if (!parsed.success) return { error: parsed.error.format() };

  // Inserir
  const { error } = await supabase.from('training_loads').insert({
    athlete_id: user.id,
    rpe: parsed.data.rpe,
    duration_minutes: parsed.data.duration,
    // ...
  });

  if (error) return { error: error.message };
  
  revalidatePath('/dashboard/athlete');
  return { success: true };
}
```

### Middleware
O `middleware.ts` na raiz verifica as sessões via JWT do Supabase e garante o redirecionamento com base no papel (role). Se um *scout* tenta acessar `/dashboard/athlete`, o middleware o redireciona.

---

## 4. Supabase Backend

### 4.1 Authentication
Utilizaremos **Supabase Auth** combinando E-mail/Senha e Google OAuth. 
Os papéis (`athlete`, `coach`, `scout`, `guardian`) são armazenados em `public.profiles`, mas a autorização é controlada injetando o papel na *Custom Claim* do JWT durante o login (através de um Trigger do Postgres no Auth).

### 4.2 Database (PostgreSQL)

O banco usa o esquema `public` para dados da aplicação. O Row Level Security (RLS) é a espinha dorsal da segurança.

**Exemplo de RLS para Carga de Treino:**
```sql
-- Habilitar RLS
ALTER TABLE training_loads ENABLE ROW LEVEL SECURITY;

-- Política: Atleta só vê a própria carga
CREATE POLICY "Athletes can view own loads" ON training_loads
FOR SELECT USING (auth.uid() = athlete_id);

-- Política: Treinador vê carga de atletas do seu time
CREATE POLICY "Coaches can view team loads" ON training_loads
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM team_memberships tm
    WHERE tm.athlete_id = training_loads.athlete_id
    AND tm.team_id IN (SELECT team_id FROM team_coaches WHERE coach_id = auth.uid())
  )
);
```
O `pgvector` será ativado para armazenar embeddings gerados pelo Gemini sobre relatórios de olheiros, permitindo buscas semânticas (ex: "Encontre atletas canhotos com boa explosão").

### 4.3 Storage
Buckets:
- `avatars` (Público)
- `match-videos` (Privado - requer RLS, tamanho máximo 2GB)
- `documents` (Privado, ex: atestados médicos)
- `highlights` (Público)

### 4.4 Edge Functions
Utilizadas para tarefas que requerem alto processamento e menor latência global que não cabem no Server Action:
- Geração de relatórios PDF.
- Webhooks do Stripe.
- Proxy seguro de stream para a API do Gemini.

---

## 5. n8n Automation Engine

O n8n operará de forma autônoma (self-hosted no início para custo/benefício, escalável para cloud depois) gerindo a orquestração complexa de dados.

### Padrões de Workflows Planejados
1. **Cálculo Diário de ACWR:** 
   - *Trigger:* Cron Job (00:00).
   - *Process:* Busca sRPE dos últimos 28 dias de cada atleta ativo, calcula o índice Agudo/Crônico (ACWR).
   - *Output:* Salva tabela `analytics.acwr`, dispara push notification/email se atleta estiver em "Danger Zone" (>1.5).
2. **Análise Pós-Partida AI:**
   - *Trigger:* Webhook recebido do Next.js (Partida salva com vídeo).
   - *Process:* Extrai keyframes, envia para Gemini Pro analisar fundamentos, salva json estruturado no banco.
3. **Resumo Semanal (Guardians):**
   - *Trigger:* Cron Job (Sexta-feira 18:00).
   - *Process:* Agrega treinos, bem-estar, notas escolares. Dispara e-mail via Resend.

---

## 6. Google Gemini AI Integration

### Estratégia de Modelos
- **Gemini Flash-Lite:** Tarefas de alta frequência, baixa complexidade. Ex: Classificação de texto rápido, parsing de descrições curtas, sanitização de inputs.
- **Gemini Flash (1.5):** O cavalo de batalha. Usado para gerar feedback pós-treino com base em métricas, interagir em chat de dúvidas do atleta, ler planilhas táticas simples.
- **Gemini Pro (1.5):** Tarefas complexas de raciocínio. Análise de vídeo multimodais longos de partidas, planejamento estratégico de treinamento a longo prazo (macrociclo).

### Arquitetura de Cliente

O cliente será isolado em `@packages/ai`, utilizando Zod para garantir que a saída do modelo obedeça estritamente à estrutura de dados (Structured Output).

```typescript
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

const MatchFeedbackSchema = z.object({
  tactical_notes: z.array(z.string()),
  physical_rating: z.number().min(1).max(10),
  improvement_areas: z.array(z.string()),
});

// O modelo Pro é chamado e a resposta é forçada no esquema Zod
```

---

## 7. Padrões de Código

### Clean Architecture Simplificada no Next.js
Para manter o projeto manutenível, usamos uma variação adaptada:
1. **Entities / Types (`packages/types`):** Interfaces e esquemas Zod (agnósticos de framework).
2. **Data Access / Repository:** Funções que abstraem o Supabase. Ex: `getAthleteProfile(id)`.
3. **Services / Use Cases:** Regras de negócio. Ex: `calculateWorkloadWarning()`.
4. **Controllers:** Server Actions e Route Handlers do Next.js.
5. **UI Layer:** Componentes React.

A camada de Serviço não deve conhecer Request/Response, focando estritamente nas regras esportivas e de software.

---

## 8. Autenticação e Autorização

**RBAC (Role-Based Access Control) Matrix Básica:**

| Entidade        | Atleta | Treinador | Scout | Responsável |
|-----------------|--------|-----------|-------|-------------|
| Seu Perfil      | CRUD   | R         | R     | R, U        |
| Seu sRPE        | C, R   | R         | N/A   | R           |
| Perfil (Time)   | R      | CRUD      | R     | N/A         |
| Vídeos Privados | CRUD   | R         | N/A   | R           |

As rotas do Next.js são protegidas no `middleware.ts` combinando a verificação de `jwt_decode` para as claims.

---

## 9. APIs e Comunicação

Apesar do forte uso de Server Actions, `Route Handlers` (`app/api/v1/`) serão expostos para a integração com o app mobile no futuro e webhooks externos.
- **Validação:** Todas as requisições recebidas (POST, PUT, PATCH) são validadas com esquemas `zod` antes de qualquer lógica.
- **Retorno Padronizado:**
  ```json
  {
    "success": true,
    "data": { ... },
    "error": null,
    "meta": { "timestamp": "...", "requestId": "..." }
  }
  ```

---

## 10. Monitoramento e Observabilidade

- **Erros e Tracing:** Integração nativa com **Sentry** para capturar exceções no frontend (React Error Boundaries) e no backend (Edge/Node.js).
- **Logs Estruturados:** Uso de bibliotecas como `pino` para gerar JSON logs no backend, facilitando a ingestão no Datadog/Axiom.
- **Vercel Analytics & Web Vitals:** Para acompanhamento em tempo real de performance (FCP, LCP) das páginas públicas.
- **Métricas Esportivas vs Sistema:** Painel separado no Supabase Studio para monitorar a saúde das tabelas e logs de falhas em webhooks do n8n.

---

## 11. Deploy e CI/CD

Pipeline orientada ao GitHub:
1. **PR Checks:** GitHub Actions executam lint, checagem de tipos (tsc), testes unitários (Vitest) e testes end-to-end críticos (Playwright).
2. **Database Migrations:** Gerenciadas via `supabase cli`. Quando um PR é mergeado para `main`, a action `supabase db push` aplica as mudanças no ambiente de produção.
3. **Frontend Deploy:** Conectado diretamente à Vercel. Push para `main` = Produção. Branches disparam deploys de *Preview* associados a um banco de staging no Supabase.
4. **n8n Deploy:** Os workflows (arquivos JSON) residem no repo. Uma action sincroniza os workflows do repositório para a instância do n8n via API.

---

## 12. Segurança

Considerando a natureza dos dados (menores de idade, dados de saúde e desempenho esportivo), a segurança é primária:
- **LGPD/GDPR by Design:** Dados PII (Personal Identifiable Information) separados de métricas puras. Termos de consentimento digital atrelados à conta do Responsável (Guardian).
- **Proteção CSRF:** Nativamente garantida pelas Server Actions e uso adequado de cookies HttpOnly, Secure e SameSite gerenciados pelo @supabase/ssr.
- **Validação Rigorosa:** Adoção estrita de validação Zod no servidor para evitar Injection e XSS. React cuida de escapar dados renderizados.
- **Criptografia:** TLS obrigatório (HTTPS/WSS) em trânsito. Supabase garante criptografia de volume at-rest nativa da AWS.

---

*Documento gerado como parte da AthleteOS Engineering Bible. Volume 2 de 10 — Arquitetura de Software. AthleteOS © 2026*
