# 📗 AthleteOS Engineering Bible
# Volume 10 — Manual para IA (Antigravity)

## 1. Introdução
Bem-vinda, inteligência artificial. Este documento foi escrito especificamente para você, o agente assistente de código (Antigravity ou outro assistente), que será nosso co-piloto e executor técnico no desenvolvimento do **AthleteOS**.

O AthleteOS é uma plataforma revolucionária de monitoramento de performance para o futebol de base. Antes de escrever qualquer linha de código ou realizar qualquer alteração estrutural, você **DEVE** ler o volume relevante da Engineering Bible. Esta "Bíblia" é sua única fonte da verdade e guia definitivo.

Quando você tiver qualquer dúvida sobre regras de negócios, estrutura de dados, requisitos ou componentes visuais, consulte a Bíblia primeiro. Caso a informação não esteja nos volumes da Bíblia ou haja ambiguidades não resolvidas, pergunte diretamente ao usuário antes de tomar decisões irreversíveis.

## 2. Como o Projeto Funciona
O **AthleteOS** é uma plataforma que monitora a performance e evolução de jovens atletas no futebol, fornecendo insights através de análise de dados e Inteligência Artificial.

Existem **4 papéis de usuário** principais:
1. **Atleta**: Registra seus dados, visualiza relatórios e acompanha seu progresso.
2. **Treinador**: Acompanha o desempenho do time, carga de treino e dados de partidas.
3. **Scout (Olheiro)**: Analisa o portfólio, assiste vídeos e avalia potencial dos atletas.
4. **Guardião (Responsável)**: Acompanha o desenvolvimento e os dados do jovem atleta.

**O Ciclo Principal (Core Loop)**:
Atleta/Treinador registra dados de uma partida → IA (Gemini) analisa os dados e gera insights → Dashboard exibe a evolução do atleta e recomendações personalizadas.

**Módulos de Apoio**:
- Treinamento (Carga, sRPE, ACWR)
- Bem-estar (Wellness, Qualidade do Sono, Fadiga)
- Vídeos & Portfólio (Melhores momentos)
- Scouting (Relatórios de observação técnica)

**Visão Geral da Arquitetura**:
- **Frontend/Fullstack**: Next.js 14+ (App Router)
- **Backend/Banco de Dados**: Supabase (PostgreSQL + Auth + Storage + RLS)
- **Automação**: n8n
- **Inteligência Artificial**: Gemini AI (Google)

## 3. Organização do Projeto
O AthleteOS utiliza uma arquitetura de monorepo baseada em Turborepo.

### 3.1 Estrutura de Pastas
Onde colocar cada tipo de arquivo:

- **Pages/Routes**: `apps/web/app/(group)/module/`
- **Componentes específicos de um módulo**: `apps/web/components/module/`
- **Componentes UI compartilhados (Design System)**: `packages/ui/`
- **Queries de Banco de Dados**: `packages/database/src/repositories/`
- **Regras de Negócio**: `packages/database/src/services/`
- **Prompts de IA**: `packages/ai/src/prompts/`
- **Schemas de validação para IA**: `packages/ai/src/schemas/`
- **Cálculos de Analytics**: `packages/analytics/src/`
- **Tipos/Interfaces globais**: `apps/web/types/` ou `packages/*/src/types.ts`
- **Utilitários compartilhados**: `apps/web/lib/utils/`
- **Server Actions (Next.js)**: `apps/web/lib/actions/`
- **Cliente Supabase**: `apps/web/lib/supabase/`
- **React Hooks**: `apps/web/hooks/`
- **Migrations SQL**: `supabase/migrations/`
- **Workflows do n8n**: `workflows/n8n/`

## 4. Padrões de Código Obrigatórios

### 4.1 Convenções de Naming
Siga estritamente este padrão de nomenclatura:
- **Arquivos**: `kebab-case` (ex: `match-card.tsx`, `use-matches.ts`)
- **Componentes React**: `PascalCase` (ex: `MatchCard`, `WellnessSlider`)
- **Funções e Hooks**: `camelCase` (ex: `useMatches`, `calculateACWR`)
- **Tabelas de Banco de Dados**: `snake_case` no singular (ex: `athlete`, `match_performance`)
- **Colunas de Banco de Dados**: `snake_case` (ex: `created_at`, `athlete_id`)
- **Rotas de API**: `kebab-case` (ex: `/api/webhooks/post-match`)
- **Variáveis CSS**: `kebab-case` com prefixo `--` (ex: `--color-primary`)
- **Variáveis de Ambiente**: `UPPER_SNAKE_CASE` (ex: `NEXT_PUBLIC_SUPABASE_URL`)
- **Tipos/Interfaces**: `PascalCase` com nome descritivo (ex: `MatchPerformance`, `AIReport`)
- **Enums**: `PascalCase` (ex: `UserRole`, `MatchStatus`)

### 4.2 Import Ordering
Sempre ordene as importações nesta sequência exata:
```typescript
// 1. React/Next.js
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// 2. Bibliotecas externas
import { z } from 'zod'
import { format } from 'date-fns'

// 3. Pacotes internos (monorepo)
import { calculateACWR } from '@athleteos/analytics'
import { supabase } from '@athleteos/database'

// 4. Componentes
import { Button } from '@/components/ui/button'
import { MatchCard } from '@/components/matches/match-card'

// 5. Hooks
import { useMatches } from '@/hooks/use-matches'

// 6. Tipos
import type { Match } from '@/types'

// 7. Utils/Constants
import { formatDate } from '@/lib/utils'
```

### 4.3 Estrutura de Componentes React
Mantenha a consistência em todos os componentes:
```typescript
// match-card.tsx
'use client' // Use APENAS se necessitar de hooks/interatividade no cliente

import { useState } from 'react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import type { Match } from '@/types'
import { formatDate } from '@/lib/utils'

interface MatchCardProps {
  match: Match
  onSelect?: (id: string) => void
}

export function MatchCard({ match, onSelect }: MatchCardProps) {
  // 1. Hooks (React e Custom) primeiro
  const [isLoading, setIsLoading] = useState(false)

  // 2. Derived state
  const formattedDate = formatDate(match.date)

  // 3. Handlers
  const handleSelect = () => {
    if (onSelect) onSelect(match.id)
  }

  // 4. Return JSX
  return (
    <div className="rounded-lg border p-4 shadow-sm" onClick={handleSelect}>
      <h3>{match.title}</h3>
      <p>{formattedDate}</p>
      <Button disabled={isLoading}>Ver Detalhes</Button>
    </div>
  )
}
```

### 4.4 Server Components vs Client Components
Regras estritas:
- **PADRÃO**: Use Server Components (sem a diretiva `'use client'`).
- Use `'use client'` **APENAS** quando precisar de: `useState`, `useEffect`, event listeners (`onClick`, `onChange`), ou APIs do navegador (window, document, localStorage).
- **Faça o fetch de dados** sempre em Server Components e passe os dados como `props` para os Client Components.
- Mantenha os Client Components o menor possível (prefira que sejam "nós folhas" na árvore de componentes).
- Use **Server Actions** para mutações de dados (formulários, requisições POST).

### 4.5 Server Actions
Padrão para todas as mutações no Next.js:
```typescript
// lib/actions/match-actions.ts
'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const CreateMatchSchema = z.object({
  title: z.string().min(3),
  date: z.string()
})

export async function createMatch(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const validated = CreateMatchSchema.parse(Object.fromEntries(formData))
  
  const { data, error } = await supabase
    .from('match')
    .insert({ ...validated, athlete_id: user.id })
    .select()
    .single()
  
  if (error) throw error
  
  revalidatePath('/dashboard/matches')
  return data
}
```

### 4.6 Supabase Client
Siga o padrão adequado conforme o contexto:
- **Server Components & Server Actions**: Use `createServerClient`
- **Client Components**: Use `createBrowserClient`
- **Middleware (Next.js)**: Use `createServerClient` para verificações de autenticação de rotas.

### 4.7 Error Handling
Padrão obrigatório para tratamento de erros:
```typescript
try {
  // operação principal
} catch (error) {
  if (error instanceof z.ZodError) {
    // Tratamento de erro de validação (ex: retornar mapeamento de erros de formulário)
  } else if (error instanceof AuthError) {
    // Tratamento de erro de autenticação (ex: redirecionar para login)
  } else {
    // Erro inesperado - logar e relançar (ou retornar um objeto de erro padronizado)
    console.error('[ModuleName]', error)
    throw error
  }
}
```

## 5. Como Escrever Migrations SQL

### Naming
- **Formato**: `YYYYMMDDHHMMSS_description.sql`
- **Exemplo**: `20260807000001_create_athlete_table.sql`

### Rules
- Sempre use `IF NOT EXISTS` na criação de tabelas.
- Sempre habilite Row Level Security (RLS) nas novas tabelas.
- Sempre adicione as colunas `created_at` e `updated_at`.
- Sempre crie políticas de RLS (Policies) para proteger o acesso, de acordo com cada perfil.
- Sempre adicione índices adequados em colunas usadas frequentemente para busca (Foreign keys, IDs).
- Teste a migration no Supabase SQL Editor antes de efetivá-la.

**Exemplo de Migration:**
```sql
CREATE TABLE IF NOT EXISTS athlete (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    position TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE athlete ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Athletes can view their own profile"
    ON athlete FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Athletes can update their own profile"
    ON athlete FOR UPDATE
    USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON athlete
  FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);
```

## 6. Como Escrever APIs (Route Handlers)
Padrão de desenvolvimento para endpoints REST e webhooks:
```typescript
// app/api/webhooks/post-match/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    // 1. Validate auth/webhook secret
    const secret = request.headers.get('x-webhook-secret')
    if (secret !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid secret' } },
        { status: 401 }
      )
    }

    // 2. Parse and validate body with Zod
    const body = await request.json()
    // const validated = Schema.parse(body)

    // 3. Execute business logic
    // ...

    // 4. Return standardized response
    return NextResponse.json({ success: true, data: { result: 'ok' } })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: String(error) } },
      { status: 500 }
    )
  }
}
```
**Respostas Padronizadas:**
- Sucesso: `{ "success": true, "data": { ... } }`
- Erro: `{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "..." } }`

## 7. Como Escrever Prompts de IA

### Rules
- Todos os prompts devem viver no diretório `packages/ai/src/prompts/`.
- Cada prompt é uma função que recebe as variáveis necessárias (contexto, dados do atleta) e retorna a string completa do prompt.
- Todos os outputs da IA devem ter um schema do Zod (em `packages/ai/src/schemas/`) para validação rigorosa.
- Sempre requisite saída JSON ao Gemini (`response_mime_type: 'application/json'`).
- Sempre valide a resposta recebida usando o Zod schema.
- Sempre forneça fallback e tratamento de erros caso o parse JSON falhe.

```typescript
// packages/ai/src/prompts/match-analysis.ts
export function buildMatchAnalysisPrompt(athleteName: string, matchStats: any) {
  return `
Você é um especialista em análise de desempenho no futebol.
Analise os seguintes dados do atleta ${athleteName}.

DADOS DA PARTIDA:
${JSON.stringify(matchStats)}

Responda APENAS com um JSON válido seguindo a estrutura solicitada.
`
}
```

## 8. Como Escrever Testes

### E2E (Playwright)
- Teste sempre os fluxos críticos de usuários: login, cadastro de partida, visualização do dashboard.
- Teste cada papel separadamente (Athleta, Treinador, Scout).
- Utilize o padrão **Page Object** para maior manutenibilidade.

### Unit Tests (Vitest / Jest)
- Teste todas as lógicas complexas e cálculos de analytics (sRPE, ACWR, PHV).
- Teste construtores de prompts.
- Teste Zod schemas para garantir que os dados de entrada e saída estão estritos.

## 9. Como Escrever Componentes de Gráficos
- **Obrigatório**: Utilize a biblioteca **Recharts**.
- Sempre use as cores do tema do AthleteOS (usando variáveis CSS definidas no Tailwind, ex: `var(--color-primary)`).
- Sempre torne os gráficos responsivos (usando `ResponsiveContainer`).
- Sempre adicione labels, tooltips estilizados e legendas compreensíveis.

**Template Recharts:**
```tsx
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

export function EvolutionChart({ data }: { data: any[] }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', borderRadius: '8px' }}
          />
          <Line type="monotone" dataKey="score" stroke="var(--color-primary)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
```

## 10. Bibliotecas Obrigatórias

| Propósito | Biblioteca | Versão |
|---|---|---|
| **UI Components** | shadcn/ui | (latest) |
| **Charts** | recharts | (latest) |
| **Forms** | react-hook-form + @hookform/resolvers | (latest) |
| **Validação** | zod | (latest) |
| **Datas** | date-fns | (latest) |
| **Ícones** | lucide-react | (latest) |
| **Banco de Dados** | @supabase/ssr | (latest) |
| **IA** | @google/genai | (latest) |
| **Estilização** | tailwindcss | (latest) |
| **Merge de Classes** | clsx + tailwind-merge | (latest) |
| **Animações** | framer-motion | (opcional, para micro-interações) |

### 🚫 Bibliotecas PROIBIDAS
- **NÃO utilize**: `axios` (utilize o `fetch` nativo).
- **NÃO utilize**: `moment.js` (utilize `date-fns`).
- **NÃO utilize**: `jQuery`.
- **NÃO utilize**: `lodash` (utilize funções JavaScript nativas, array methods, etc).
- **NÃO utilize**: `styled-components` (o projeto é baseado em Tailwind).

## 11. Checklist de Qualidade
Antes de entregar qualquer nova funcionalidade ou correção de bug, verifique mentalmente e garanta que o código cumpra estes requisitos:

- [ ] **TypeScript**: Ausência de `any`. Todas as `props` e retornos de funções devidamente tipados.
- [ ] **Validação**: Todas as entradas (inputs, formulários, APIs) são validadas usando Zod.
- [ ] **RLS**: Novas tabelas possuem políticas (Policies) criadas e restritas para cada papel envolvido.
- [ ] **Responsividade**: Funciona perfeitamente em telas de dispositivos móveis (< 768px).
- [ ] **Carregamento (Loading)**: Implementação de *skeleton states* para carregamentos de dados assíncronos.
- [ ] **Tratamento de Erros**: Uso de Error Boundaries adequados e exibição de mensagens amigáveis ao usuário final.
- [ ] **Empty States**: Estados vazios possuem uma call-to-action (CTA) e visual convidativo.
- [ ] **Acessibilidade (A11y)**: Labels preenchidos adequadamente, bom contraste visual e navegação via teclado suportada.
- [ ] **SEO / Metadata**: Páginas públicas (não-autenticadas) possuem as tags meta configuradas.
- [ ] **Performance**: Evitar re-renderizações desnecessárias. Cuidar de chamadas repetidas à base de dados.

## 12. Referência Rápida dos Volumes
Sempre que tiver dúvidas contextuais mais amplas, consulte a "Engineering Bible". Aqui está o guia rápido de onde encontrar cada assunto:

- **Requisitos de Produto** → Consulte o Volume 1 (PRD)
- **Decisões Arquiteturais** → Consulte o Volume 2 (Architecture)
- **Modelagem de Banco de Dados** → Consulte o Volume 3 (Database)
- **Design de Telas (UI/UX)** → Consulte o Volume 4 (UI/UX)
- **Engenharia de Prompts de IA** → Consulte o Volume 5 (AI)
- **Workflows e Automações (n8n)** → Consulte o Volume 6 (Automations)
- **Integrações e Bibliotecas** → Consulte o Volume 7 (Open Source)
- **Prioridades e Cronograma** → Consulte o Volume 8 (Execution Plan)
- **Estrutura do Repositório** → Consulte o Volume 9 (GitHub Blueprint)
- **Padrões de Código** → Consulte o Volume 10 (este documento)

## 13. Comandos Essenciais
Referência rápida dos comandos de desenvolvimento que você precisará usar:

```bash
# Desenvolvimento
pnpm dev              # Inicia todas as aplicações do monorepo
pnpm dev --filter web # Inicia apenas a aplicação web

# Banco de Dados
pnpm db:migrate      # Roda as migrações (se aplicável ao ambiente local)
pnpm db:seed         # Semeia (Seed) dados de desenvolvimento
pnpm db:types        # Gera tipos TypeScript atualizados a partir do Supabase
pnpm db:reset        # Reseta completamente a base de dados

# Testes
pnpm test            # Roda todos os testes do projeto
pnpm test:e2e        # Roda apenas os testes E2E (Playwright)
pnpm test:unit       # Roda apenas testes unitários

# Build e Qualidade
pnpm build           # Compila todas as aplicações (production build)
pnpm lint            # Linta todos os pacotes e encontra problemas
pnpm format          # Formata o código com o Prettier

# Comandos do Supabase CLI
npx supabase start   # Inicia os serviços locais do Supabase (Docker)
npx supabase db push # Dá push de novas migrações locais
npx supabase gen types typescript --local > packages/database/src/types.ts # Gera os tipos baseados no Supabase local
```

Este documento é a sua referência primária (e a mais importante) para escrever código, definir o estilo e a qualidade do projeto AthleteOS. Siga estritamente essas normas. Quando houver conflitos aparentes, a convenção e estrutura contidas neste Volume têm preeminência sobre escolhas estilísticas genéricas.

*Documento gerado como parte da AthleteOS Engineering Bible. Volume 10 de 10 — Manual para IA (Antigravity). AthleteOS © 2026*
