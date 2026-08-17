# 📘 AthleteOS Engineering Bible
# Volume 8 — Plano de Execução

## 1. Visão Geral do Plano
- **Total estimated timeline**: ~16-20 semanas (4-5 meses)
- **Sprint duration**: 2 semanas
- **Methodology**: Estilo Kanban com limites de sprint
- **Definition of Done (DoD) para cada tarefa**:
  - Código submetido e revisado (PR aprovado)
  - Testes unitários/E2E passando (se aplicável)
  - Critérios de aceite cumpridos
  - Sem erros de lint ou formatação
  - Feature testada no ambiente de staging/preview
- **Risk management approach**:
  - Identificação proativa de gargalos de dependência (ex: IA, APIs externas)
  - Revisão semanal de progresso em relação às métricas de sucesso do MVP
  - Escopo estrito para MVP: se não for essencial para o fluxo principal de Thomas, vai para Fase 2+.

## 2. Sprint 0 — Setup e Infraestrutura (1 semana)
### Objetivo
Configurar todo o ambiente de desenvolvimento e infraestrutura base para permitir que o desenvolvimento de features inicie sem bloqueios.

### Tarefas

- **SETUP-001: Criar repositório monorepo com Turborepo**
  - **Description**: Inicializar o repositório utilizando Turborepo com as configurações recomendadas para Next.js e pacotes compartilhados.
  - **Priority**: P0
  - **Estimated effort**: 4 horas
  - **Dependencies**: Nenhuma
  - **Acceptance criteria**: Repositório criado, `npm run build` e `npm run dev` funcionando na raiz, estrutura de `apps/` e `packages/` configurada.

- **SETUP-002: Configurar Next.js 14+ com App Router**
  - **Description**: Criar a aplicação web principal dentro de `apps/web` usando Next.js com App Router.
  - **Priority**: P0
  - **Estimated effort**: 2 horas
  - **Dependencies**: SETUP-001
  - **Acceptance criteria**: App rodando localmente com a página inicial padrão do Next.js.

- **SETUP-003: Configurar Tailwind CSS + Shadcn/UI**
  - **Description**: Instalar e configurar o Tailwind CSS na aplicação web, e inicializar o Shadcn/UI para a biblioteca de componentes base.
  - **Priority**: P0
  - **Estimated effort**: 3 horas
  - **Dependencies**: SETUP-002
  - **Acceptance criteria**: Tailwind funcionando. Componente `Button` do Shadcn adicionado e renderizado com sucesso.

- **SETUP-004: Criar projeto Supabase**
  - **Description**: Criar o projeto no Supabase (Cloud ou local via CLI) e obter as credenciais de API.
  - **Priority**: P0
  - **Estimated effort**: 1 hora
  - **Dependencies**: Nenhuma
  - **Acceptance criteria**: Projeto acessível via painel web do Supabase, chaves anotadas no `.env`.

- **SETUP-005: Executar migrations do banco de dados (todas as tabelas core)**
  - **Description**: Traduzir o schema definido no Vol 3 em arquivos de migração do Supabase e aplicá-los.
  - **Priority**: P0
  - **Estimated effort**: 8 horas
  - **Dependencies**: SETUP-004
  - **Acceptance criteria**: Tabelas `profiles`, `matches`, `match_stats`, `trainings`, `wellness`, `alerts` criadas no banco.

- **SETUP-006: Configurar Supabase Auth (email + Google OAuth)**
  - **Description**: Habilitar provedores de autenticação (Email e Google) no painel do Supabase e configurar URLs de redirecionamento.
  - **Priority**: P0
  - **Estimated effort**: 3 horas
  - **Dependencies**: SETUP-004
  - **Acceptance criteria**: Cadastro e login de teste funcionando via Supabase UI ou API.

- **SETUP-007: Configurar RLS policies básicas**
  - **Description**: Adicionar políticas de Row Level Security para garantir que atletas vejam apenas seus próprios dados.
  - **Priority**: P0
  - **Estimated effort**: 4 horas
  - **Dependencies**: SETUP-005, SETUP-006
  - **Acceptance criteria**: Testes de query mostrando que um usuário X não consegue ler/escrever dados de um usuário Y.

- **SETUP-008: Configurar n8n (Docker ou Cloud)**
  - **Description**: Inicializar o n8n para orquestração de workflows.
  - **Priority**: P1
  - **Estimated effort**: 4 horas
  - **Dependencies**: Nenhuma
  - **Acceptance criteria**: n8n acessível, capaz de receber um webhook de teste e responder HTTP 200.

- **SETUP-009: Configurar CI/CD (GitHub Actions)**
  - **Description**: Criar pipeline básico no GitHub para lint, testes e build.
  - **Priority**: P1
  - **Estimated effort**: 4 horas
  - **Dependencies**: SETUP-001
  - **Acceptance criteria**: Actions rodando e passando em cada pull request.

- **SETUP-010: Configurar variáveis de ambiente**
  - **Description**: Definir `.env.example` e validar variáveis via Zod no startup da aplicação.
  - **Priority**: P1
  - **Estimated effort**: 2 horas
  - **Dependencies**: SETUP-002
  - **Acceptance criteria**: App falha no build/start se variáveis obrigatórias estiverem ausentes.

- **SETUP-011: Criar seed data para desenvolvimento**
  - **Description**: Criar script para popular o banco de dados com usuários, partidas e treinos falsos.
  - **Priority**: P2
  - **Estimated effort**: 4 horas
  - **Dependencies**: SETUP-005
  - **Acceptance criteria**: Comando `npm run db:seed` popula o banco com dados consistentes.

- **SETUP-012: Configurar ESLint + Prettier**
  - **Description**: Estabelecer regras unificadas de linting e formatação no monorepo.
  - **Priority**: P1
  - **Estimated effort**: 2 horas
  - **Dependencies**: SETUP-001
  - **Acceptance criteria**: Erros de lint impedem commits (husky) ou falham no CI.

- **SETUP-013: Configurar Playwright para E2E tests**
  - **Description**: Instalar e configurar ambiente de testes end-to-end com Playwright.
  - **Priority**: P2
  - **Estimated effort**: 3 horas
  - **Dependencies**: SETUP-002
  - **Acceptance criteria**: Teste simples que abre a home page roda com sucesso.

## 3. Sprint 1 — Auth e Estrutura Base (2 semanas)
### Objetivo
Implementar autenticação completa e layout base da aplicação para dar suporte às funcionalidades core.

### Tarefas
- **AUTH-001**: Página de login (email + senha)
- **AUTH-002**: Página de registro com seleção de role
- **AUTH-003**: Login com Google OAuth
- **AUTH-004**: Middleware de proteção de rotas
- **AUTH-005**: Redirecionamento baseado em role (Atleta vs Coach vs Admin)
- **AUTH-006**: Recuperação de senha
- **LAYOUT-001**: Root layout com providers (Theme, Auth, Query)
- **LAYOUT-002**: Dashboard layout (sidebar retrátil + header com perfil)
- **LAYOUT-003**: Navegação responsiva (sidebar desktop, bottom tabs mobile)
- **LAYOUT-004**: Página de perfil do atleta (formulário de dados básicos)
- **LAYOUT-005**: Página de configurações (tema, idioma, notificações)

## 4. Sprint 2 — Partidas e IA (2 semanas)
### Objetivo
Implementar o fluxo core: registro de partida → análise IA → exibição de relatório.

### Tarefas
- **MATCH-001**: Formulário de registro de partida (oponente, resultado, gols, minutos jogados, notas)
- **MATCH-002**: Server Action para salvar partida no Supabase
- **MATCH-003**: Webhook para n8n (disparo da análise após save da partida)
- **MATCH-004**: Workflow n8n: análise pós-jogo completa (integração Gemini via HTTP request)
- **MATCH-005**: Exibição do relatório de IA (parsing do markdown/JSON recebido)
- **MATCH-006**: Lista de partidas com filtros (data, resultado, competição)
- **MATCH-007**: Página de detalhes da partida (Estatísticas + Relatório IA)
- **AI-001**: Package `@athleteos/ai` com client Gemini customizado
- **AI-002**: Prompt de análise técnica (desenvolvimento e otimização)
- **AI-003**: Prompt de feedback comportamental (desenvolvimento e otimização)
- **AI-004**: Schemas Zod para validação de output de IA estruturado

## 5. Sprint 3 — Dashboard e Gráficos (2 semanas)
### Objetivo
Implementar dashboard principal do atleta com KPIs chave e visualizações de dados.

### Tarefas
- **DASH-001**: Componente `KPICard` reutilizável com variação percentual
- **DASH-002**: KPIs principais (Total de jogos, Nota média, Minutos, Tendência de performance)
- **DASH-003**: Gráfico de evolução de notas (utilizando Recharts Line Chart)
- **DASH-004**: Card de resumo do último jogo
- **DASH-005**: Quick Action FAB (Floating Action Button) para registrar atividades no mobile
- **DASH-006**: Gráfico de radar de skills agregadas (Recharts Radar)
- **DASH-007**: Seção de alertas ativos (lesões, fadiga)
- **CHART-001**: Package `@athleteos/analytics` contendo lógica (sRPE, ACWR, wellness)
- **CHART-002**: Componente `RadarChart` customizado e responsivo
- **CHART-003**: Componente `LoadChart` (ACWR zones com áreas verde, amarela e vermelha)

## 6. Sprint 4 — Treinos e Carga (2 semanas)
### Objetivo
Implementar registro de sessões de treinos e monitoramento avançado de carga física.

### Tarefas
- **TRAIN-001**: Formulário de registro de treino (RPE, duração, tipo)
- **TRAIN-002**: Cálculo automático de sRPE (RPE x Duração) no client
- **TRAIN-003**: Lista e visualização de calendário de treinos
- **TRAIN-004**: Dashboard focado em ACWR
- **TRAIN-005**: Gráfico ACWR com faixas de risco (Recharts ComposedChart)
- **TRAIN-006**: Lógica de cálculo EWMA (Acute/Chronic)
- **TRAIN-007**: Sistema de alerta de sobrecarga (ACWR > 1.5 aciona notificação)
- **LOAD-001**: Função PostgreSQL para cálculo diário consolidado de `workload_metrics`
- **LOAD-002**: Trigger de banco para recalcular métricas após a inserção/edição de um novo treino

## 7. Sprint 5 — Wellness e Portfólio (2 semanas)
### Objetivo
Implementar rotina de wellness check-in diário e o portfólio público para recrutamento.

### Tarefas
- **WELL-001**: Formulário rápido de wellness (5 sliders com emojis: sono, dor, estresse, fadiga, humor)
- **WELL-002**: Lógica de cálculo de wellness score (0-100)
- **WELL-003**: Dashboard wellness com gráfico de tendências semanais
- **WELL-004**: Heatmap de wellness (estilo GitHub contributions chart)
- **WELL-005**: Alerta automático de wellness baixo
- **PORT-001**: Criação de página pública dinâmica `/athlete/[slug]`
- **PORT-002**: Hero section premium com dados do atleta (foto, posição, clube)
- **PORT-003**: Gráfico de radar estilizado para visualização no portfólio
- **PORT-004**: Seção de highlights de vídeo (YouTube/Vimeo embed)
- **PORT-005**: Botão "Interessado" com formulário para scouts/olheiros entrarem em contato
- **PORT-006**: Configuração avançada de SEO (meta tags dinâmicas, Open Graph images)

## 8. Sprint 6 — Polish, Testes e Deploy (2 semanas)
### Objetivo
Garantir a qualidade, refinar a experiência do usuário (Polish) e realizar o lançamento para produção.

### Tarefas
- **QA-001**: Testes E2E com Playwright cobrindo fluxos críticos (login, adicionar partida, preencher wellness)
- **QA-002**: Testes rigorosos de responsividade (garantir pixel-perfect em mobile, tablet, desktop)
- **QA-003**: Testes de acessibilidade (ARIA labels, contraste, navegação por teclado)
- **QA-004**: Performance audit utilizando Lighthouse (meta: 90+ em todas categorias)
- **QA-005**: Security review completa (RLS policies, auth, input validation via Zod)
- **DEPLOY-001**: Configurar domínio customizado
- **DEPLOY-002**: Deploy da aplicação Next.js para a Vercel
- **DEPLOY-003**: Configurar ambiente Supabase de produção (Migrations + Config)
- **DEPLOY-004**: Deploy de workflows n8n para produção
- **DEPLOY-005**: Configurar ferramentas de monitoring/alerting (Sentry)
- **POLISH-001**: Onboarding flow guiado para first-time user (Tooltip tour)
- **POLISH-002**: Empty states atraentes com ilustrações para listas vazias
- **POLISH-003**: Loading skeletons em toda a UI durante fetching de dados
- **POLISH-004**: Error boundaries globais e locais com UI amigável
- **POLISH-005**: Micro-animações e transições utilizando Framer Motion ou CSS

## 9. Fases 2-4 (Pós-MVP)

### Fase 2 Sprints (7-9)
- **Sprint 7**: Coach dashboard (visão gerencial do time) + upload nativo de vídeo
- **Sprint 8**: Video tagging de melhores momentos + PDF export de relatórios
- **Sprint 9**: WhatsApp notifications (n8n + Twilio/Z-API) + Guardian access (pais/responsáveis)

### Fase 3 Sprints (10-12)
- **Sprint 10**: Scouting panel (dashboard para olheiros) + busca avançada de atletas
- **Sprint 11**: IDP (Individual Development Plan) tracker + Monthly AI reports automatizados
- **Sprint 12**: PHV (Peak Height Velocity) tracker para crescimento + RAG (Retrieval-Augmented Generation) para o AI coach entender o histórico longo do atleta

### Fase 4 Sprints (13-16)
- **Sprint 13**: Refatoração arquitetural para Multi-tenancy (Múltiplos clubes/academias isolados)
- **Sprint 14**: Billing (Stripe integration) + Gestão de Planos de assinatura
- **Sprint 15**: Public API para integrações de terceiros (ex: wearables)
- **Sprint 16**: i18n (Internacionalização) completo + Advanced Analytics

## 10. Gestão de Riscos

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| API Gemini fora do ar | Média | Alto | Implementar fallback; retry logic no n8n; salvar status da partida como 'Pendente de Análise' |
| Custo de IA acima do previsto | Baixa | Médio | Monitoramento rígido; cache agressivo de requisições de análise repetidas; usar modelos menores onde possível |
| Performance do banco com muitos dados | Baixa (no MVP) | Alto | Índices corretos; paginação desde o dia 1; arquitetar `workload_metrics` pre-calculado (Rollups) |
| Supabase rate limits | Baixa | Médio | Throttling no client; caching de rotas estáticas/revalidação (Next.js ISR) |
| n8n workflow failures | Média | Alto | Sistema de filas/retries embutido no n8n; alertas visuais no app sobre falha na análise |
| WhatsApp API blocking | Alta | Alto | Utilizar provedores oficiais (BSP); garantir opt-in do usuário; manter templates rigorosamente aprovados |
| Scope creep | Alta | Alto | Rigoroso gerenciamento de backlog; manter foco estrito na utilidade para o "Thomas" no MVP |
| Data privacy (LGPD) issues | Média | Extremo | Strict RLS policies; criptografia de dados sensíveis; feature clara de "Deletar Conta"; consentimento explícito no onboarding |

## 11. Métricas de Sucesso

### MVP Launch Criteria
| Metric | Target |
|---|---|
| Funcionalidades Core | All P0 features working perfeitamente |
| Estabilidade | No critical bugs em produção |
| Performance web | Lighthouse score > 90 em Mobile/Desktop |
| Qualidade | E2E tests passing em todos os fluxos P0 |
| Core Flow Demo | Thomas consegue registrar uma partida real e receber o feedback da IA com sucesso |
| Velocidade de Carregamento | Portfolio público loads in < 2s |

### Post-Launch KPIs
- **Adoção**: Weekly active usage (WAU) by Thomas e early adopters.
- **Engajamento**: Número médio de partidas registradas por mês por atleta ativo.
- **Qualidade da IA**: AI report quality rating (sistema de feedback thumbs up/down nas análises).
- **Alcance**: Portfolio page views por mês.

## 12. Cronograma Visual

```text
Semana:  1    2    3    4    5    6    7    8    9    10   11   12   13
Sprint:  S0   |--- S1 ---|--- S2 ---|--- S3 ---|--- S4 ---|--- S5 ---|--- S6 ---|
Foco:    Setup Auth+Layout Matches+AI Dashboard  Training  Well+Port  Polish+Deploy
```

*Documento gerado como parte da AthleteOS Engineering Bible. Volume 8 de 10 — Plano de Execução. AthleteOS © 2026*
