# 📚 AthleteOS Engineering Bible
# Volume 9 — GitHub Blueprint

## 1. Visão Geral do Repositório

O AthleteOS utiliza uma arquitetura de **Monorepo** gerenciada pelo **Turborepo** (`turbo`), juntamente com o gerenciador de pacotes **pnpm**.

### Por que um Monorepo para este projeto?
1. **Compartilhamento de Código Simplificado**: Tipos do banco de dados (Supabase), funções utilitárias (cálculos de SRPE, ACWR), componentes de UI (shadcn/ui) e configurações podem ser facilmente compartilhados entre múltiplas aplicações (ex: web app, painel administrativo, APIs).
2. **Refatoração Segura**: Mudanças em pacotes compartilhados refletem imediatamente em todas as aplicações dependentes, facilitando a identificação de quebras de contrato.
3. **Gerenciamento de Dependências Unificado**: O pnpm garante que todas as aplicações usem as mesmas versões de dependências críticas (React, Next.js, etc).
4. **Builds e Testes Otimizados**: O Turborepo faz cache agressivo de builds e testes. Se um pacote não foi alterado, ele não será reconstruído, economizando tempo no CI/CD e no ambiente de desenvolvimento.

### Nomenclatura do Repositório
- Nome do Repositório: `athleteos`
- URL (exemplo): `github.com/athleteos/athleteos`

---

## 2. Estrutura Completa de Diretórios

Abaixo está a árvore completa do repositório, seguida da explicação de cada diretório principal.

```text
athleteos/
├── apps/
│   └── web/                    # Next.js 14+ App Principal
│       ├── app/
│       │   ├── (auth)/         # Grupo de rotas de autenticação
│       │   │   ├── login/
│       │   │   ├── register/
│       │   │   └── layout.tsx
│       │   ├── (dashboard)/    # Rotas protegidas (Dashboard)
│       │   │   ├── dashboard/
│       │   │   ├── matches/
│       │   │   ├── training/
│       │   │   ├── wellness/
│       │   │   ├── videos/
│       │   │   ├── profile/
│       │   │   ├── settings/
│       │   │   └── layout.tsx
│       │   ├── (public)/       # Rotas públicas
│       │   │   ├── athlete/[slug]/
│       │   │   └── layout.tsx
│       │   ├── (coach)/        # Rotas exclusivas para Treinadores
│       │   │   ├── team/
│       │   │   ├── planning/
│       │   │   └── layout.tsx
│       │   ├── (scout)/        # Rotas exclusivas para Olheiros/Scouts
│       │   │   ├── search/
│       │   │   ├── evaluations/
│       │   │   └── layout.tsx
│       │   ├── api/
│       │   │   └── webhooks/
│       │   ├── layout.tsx      # Root layout
│       │   ├── page.tsx        # Landing page
│       │   └── globals.css
│       ├── components/
│       │   ├── ui/             # Componentes base (shadcn/ui)
│       │   ├── dashboard/
│       │   ├── matches/
│       │   ├── training/
│       │   ├── wellness/
│       │   ├── charts/
│       │   └── layout/
│       ├── lib/
│       │   ├── supabase/
│       │   ├── actions/        # Server Actions
│       │   └── utils/
│       ├── hooks/
│       ├── types/
│       ├── middleware.ts
│       ├── next.config.js
│       ├── tailwind.config.ts
│       ├── tsconfig.json
│       └── package.json
├── packages/
│   ├── ui/                     # Componentes de UI compartilhados
│   ├── database/               # Cliente do banco, tipos gerados e queries
│   │   ├── src/
│   │   │   ├── client.ts
│   │   │   ├── types.ts        # Tipos gerados do Supabase
│   │   │   ├── repositories/
│   │   │   └── services/
│   │   └── package.json
│   ├── ai/                     # Integração com Google Gemini AI
│   │   ├── src/
│   │   │   ├── client.ts
│   │   │   ├── prompts/
│   │   │   ├── schemas/
│   │   │   └── agents/
│   │   └── package.json
│   ├── analytics/              # Cálculos e lógica de Sports Analytics
│   │   ├── src/
│   │   │   ├── srpe.ts
│   │   │   ├── acwr.ts
│   │   │   ├── phv.ts
│   │   │   ├── wellness-score.ts
│   │   │   └── index.ts
│   │   └── package.json
│   └── config/                 # Configurações compartilhadas
│       ├── eslint/
│       ├── typescript/
│       └── tailwind/
├── supabase/
│   ├── migrations/             # Migrações SQL numeradas
│   ├── seed/                   # Dados de seed para ambiente de desenvolvimento
│   ├── functions/              # Supabase Edge Functions (Deno)
│   └── config.toml
├── workflows/
│   └── n8n/                    # Workflows do n8n exportados em JSON
├── scripts/                    # Scripts utilitários de setup e deploy
├── docs/                       # Documentação técnica e arquitetural
├── tests/
│   ├── e2e/                    # Testes E2E com Playwright
│   ├── integration/            # Testes de integração
│   └── unit/                   # Testes unitários vitais
├── .github/
│   ├── workflows/              # GitHub Actions CI/CD
│   └── PULL_REQUEST_TEMPLATE.md
├── .env.example
├── .gitignore
├── turbo.json
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

### Detalhamento dos Diretórios

#### `apps/web/`
- **Propósito**: A aplicação Next.js principal que atende atletas, treinadores, pais e scouts.
- **Convenção**: Uso estrito do App Router (`app/`). Route groups como `(auth)` ou `(dashboard)` organizam lógicas de layout sem afetar a URL.
- **Componentes**: Separados por domínio e funcionalidade.

#### `packages/`
Contém bibliotecas internas compartilhadas que podem ser importadas pelas aplicações (ex: `apps/web`) através do workspace do pnpm.
- **`packages/ui/`**: Componentes reutilizáveis independentes do framework principal, se necessário extrair do web.
- **`packages/database/`**: Centraliza o cliente do Supabase, tipos (gerados via CLI do Supabase) e repositórios de dados genéricos.
- **`packages/ai/`**: Encapsula chamadas ao Google Gemini, separando a lógica de LLM (prompts, schemas, agentes) da UI.
- **`packages/analytics/`**: O "coração" científico do sistema. Funções puras em TypeScript para cálculo de PSE, sRPE, ACWR, PHV. Facilita testes unitários.
- **`packages/config/`**: Mantém ESLint, Prettier, Tailwind e TS configs consistentes em todo o monorepo.

#### `supabase/`
- **Propósito**: Diretório gerenciado pelo Supabase CLI. Contém a configuração local, funções Deno, e estado do banco de dados (migrações).

#### `workflows/n8n/`
- **Propósito**: Armazena os arquivos JSON exportados dos workflows do n8n, garantindo versionamento das automações (ex: envio de e-mails, alertas pós-treino).

#### `tests/`
- **Propósito**: Centraliza testes globais. Testes E2E (Playwright) vão aqui para testar a aplicação como um todo.

---

## 3. Configurações do Monorepo

### `pnpm-workspace.yaml`
Define quais diretórios fazem parte do workspace.
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### `turbo.json`
Orquestra as tarefas e define o cache.
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "typecheck": {
      "dependsOn": ["^typecheck"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    }
  }
}
```

### `package.json` (Root)
Scripts globais do repositório.
```json
{
  "name": "athleteos",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "typecheck": "turbo run typecheck",
    "format": "prettier --write \"**/*.{ts,tsx,md}\"",
    "db:start": "supabase start",
    "db:stop": "supabase stop",
    "db:types": "supabase gen types typescript --local > packages/database/src/types.ts",
    "db:reset": "supabase db reset",
    "setup": "pnpm install && pnpm db:start && pnpm db:reset"
  },
  "devDependencies": {
    "turbo": "latest",
    "prettier": "^3.0.0",
    "typescript": "^5.0.0"
  },
  "engines": {
    "node": ">=20.0.0"
  },
  "packageManager": "pnpm@9.0.0"
}
```

### `.env.example` (Root)
```env
# Supabase Local (Automático no supabase start)
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Configuração n8n local
N8N_WEBHOOK_URL=http://localhost:5678/webhook

# AI Gemini
GEMINI_API_KEY=sua_chave_aqui
```

### `.gitignore` (Root)
```text
node_modules
.pnp
.pnp.js
coverage
.next/
out/
build
.DS_Store
*.pem
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.vercel
*.tsbuildinfo
.turbo
```

---

## 4. Scripts e Comandos

### Fluxo Diário de Desenvolvimento
- `pnpm dev`: Inicia todas as aplicações e pacotes no modo desenvolvimento usando Turborepo.
- `pnpm build`: Executa o build de produção de todo o workspace (Next.js, pacotes locais).
- `pnpm lint` / `pnpm format`: Varre o código procurando por erros e ajusta formatação.

### Comandos de Banco de Dados (Supabase)
- `pnpm db:start`: Sobe a stack local do Supabase via Docker (PostgreSQL, Auth, Edge Functions, Studio).
- `pnpm db:stop`: Para os containers locais do Supabase.
- `pnpm db:reset`: Aplica todas as migrações (na pasta `supabase/migrations`) e roda os arquivos de seed no banco local.
- `pnpm db:types`: Gera os tipos TypeScript atualizados do banco local e injeta diretamente no `packages/database`.
- `supabase db diff -f nome_da_migracao`: (CLI do Supabase) Analisa mudanças locais e cria um arquivo de migração.

---

## 5. Convenções de Código

### Nomenclatura de Arquivos
- **Componentes React**: PascalCase. Ex: `MatchCard.tsx`, `AthleteProfile.tsx`.
- **Arquivos Utilitários/Funções/Hooks**: kebab-case ou camelCase. Recomendado kebab-case. Ex: `use-wellness-data.ts`, `calculate-srpe.ts`.
- **Arquivos de Configuração**: kebab-case. Ex: `tailwind.config.ts`.
- **Estilos**: `globals.css` para entrada principal.

### Estrutura de Componentes
Sempre usar export default para páginas (`page.tsx`) e exportações nomeadas para componentes (`export const MyComponent = () => ...`).

### Padrão de Commits (Conventional Commits)
- `feat:` Nova funcionalidade (ex: `feat: adiciona gráfico de ACWR no dashboard`)
- `fix:` Correção de bug (ex: `fix: corrige cálculo de fadiga do atleta`)
- `chore:` Manutenções e dependências
- `docs:` Atualização de documentação
- `refactor:` Refatoração de código
- `test:` Inserção ou melhoria de testes

---

## 6. CI/CD Pipeline

O pipeline utiliza **GitHub Actions** para garantir a qualidade e automatizar os deploys (ex: Vercel para Next.js, Supabase para migrações).

### `.github/workflows/ci.yml`
Pipeline de validação em cada Pull Request.

```yaml
name: CI

on:
  pull_request:
    branches: ["main", "develop"]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9

      - name: Install Dependencies
        run: pnpm install --frozen-lockfile

      - name: Typecheck
        run: pnpm typecheck

      - name: Lint
        run: pnpm lint

      - name: Test
        run: pnpm test

      - name: Build
        run: pnpm build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
```

---

## 7. Ambiente de Desenvolvimento

### Pré-requisitos
1. **Node.js**: v20+
2. **pnpm**: v9+ (`npm install -g pnpm`)
3. **Docker Desktop**: Necessário para rodar o Supabase local.
4. **Supabase CLI**: Instalado globalmente ou via npx.

### Passo a Passo (Setup)
1. Clone o repositório: `git clone https://github.com/athleteos/athleteos.git`
2. Entre na pasta: `cd athleteos`
3. Duplique o `.env.example` para `.env.local` na raiz e no `apps/web`.
4. Instale e configure o ambiente com um único comando:
   ```bash
   pnpm setup
   ```
   *(Este script instala dependências, baixa containers do Supabase local, e aplica as migrações/seed)*
5. Inicie a aplicação web:
   ```bash
   pnpm dev
   ```
6. Acesse:
   - Web App: `http://localhost:3000`
   - Supabase Studio Local: `http://localhost:54323`

---

## 8. Gestão de Branches

Utilizamos uma adaptação simplificada do Git Flow:

- **`main`**: Branch de Produção. Código instável não entra aqui. Deploys na Vercel e produção do Supabase ocorrem a partir desta branch.
- **`develop`**: Branch de Staging/Homologação. Features são unidas aqui para testes integrados antes do lançamento.
- **`feature/<nome-da-feature>`**: Criada a partir de `develop`. Ex: `feature/grafico-acwr`.
- **`bugfix/<nome-do-bug>`**: Correções durante o desenvolvimento de release.
- **`hotfix/<nome-do-bug>`**: Criada a partir da `main` para correções críticas urgentes em produção.

O processo exige Pull Requests com aprovação (Code Review) para merges nas branches `main` e `develop`.

---

## 9. README.md Template

```markdown
# AthleteOS 🏆

Plataforma inteligente de monitoramento de performance e bem-estar para o futebol de base. Conectando atletas, treinadores, pais e olheiros (scouts).

## 🚀 Tecnologias

- **Frontend**: Next.js 14 (App Router), React, TailwindCSS, shadcn/ui
- **Backend/DB**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Automações**: n8n
- **Inteligência Artificial**: Google Gemini
- **Monorepo**: Turborepo, pnpm

## 📦 Estrutura do Monorepo

- `apps/web`: Aplicação principal em Next.js.
- `packages/analytics`: Motor científico de cálculos (sRPE, ACWR, PHV).
- `packages/database`: Cliente do Supabase e tipagens geradas.
- `packages/ai`: Integração e prompts para agentes Gemini.
- `packages/ui`: Componentes compartilhados.

## 🛠️ Como rodar o projeto localmente

Certifique-se de ter o **Docker**, **Node.js 20+** e **pnpm** instalados.

1. Clone o repositório.
2. Copie os arquivos de ambiente:
   \`cp .env.example .env.local\`
3. Rode o script de setup (instala deps, inicia Supabase local, aplica migrations):
   \`pnpm setup\`
4. Inicie o servidor de desenvolvimento:
   \`pnpm dev\`

- **Web App**: http://localhost:3000
- **Supabase Studio (Local DB)**: http://localhost:54323

## 📝 Scripts Úteis
- \`pnpm db:types\`: Gera os tipos do Supabase a partir do banco local.
- \`pnpm db:reset\`: Limpa o banco local e roda os seeds.

---
Desenvolvido com ⚽ e código limpo pela equipe AthleteOS.
```

---

*Documento gerado como parte da AthleteOS Engineering Bible. Volume 9 de 10 — GitHub Blueprint. AthleteOS © 2026*
