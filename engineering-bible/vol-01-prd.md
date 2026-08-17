# 📘 AthleteOS Engineering Bible
# Volume 1 — Product Requirements Document (PRD)

**Versão:** 1.0
**Data:** Agosto 2026
**Autor:** Gerado para implementação automatizada no Antigravity Agent
**Atleta de referência:** Thomas Zavarizz Suprano Silva · Lateral Esquerdo · Categorias de Base

---

## Índice

1. [Visão do Produto](#1-visão-do-produto)
2. [Problemas](#2-problemas)
3. [Personas](#3-personas)
4. [Casos de Uso (User Stories)](#4-casos-de-uso-user-stories)
5. [Jornadas do Usuário](#5-jornadas-do-usuário)
6. [Definição do MVP](#6-definição-do-mvp)
7. [Roadmap](#7-roadmap)
8. [Backlog Completo](#8-backlog-completo)
9. [Requisitos Não-Funcionais](#9-requisitos-não-funcionais)

---

## 1. Visão do Produto

### 1.1 Missão

Transformar o desenvolvimento de atletas de futebol de base através de dados, inteligência artificial e acompanhamento contínuo — tornando visível o que antes era invisível.

### 1.2 Visão

Ser a plataforma de referência para monitoramento de desempenho, desenvolvimento individual e exposição profissional de jovens atletas de futebol no Brasil e na América Latina.

### 1.3 Proposta de Valor

O **AthleteOS** é um sistema operacional para a carreira de atletas de base que:

- **Para o Atleta:** Oferece um espelho técnico e emocional de cada partida e treino, com feedback de IA que acelera a evolução consciente.
- **Para o Treinador:** Centraliza dados de carga, wellness e desempenho para tomar decisões baseadas em evidência, prevenir lesões e individualizar o desenvolvimento.
- **Para o Olheiro/Scout:** Disponibiliza portfólios verificáveis com estatísticas reais, vídeos tagueados e relatórios de IA — eliminando o achismo do scouting tradicional.
- **Para o Responsável:** Dá visibilidade ao progresso do filho, garantindo que o investimento em formação esportiva tem acompanhamento profissional.

### 1.4 Diferencial Competitivo

| Solução Atual | Problema | AthleteOS |
|---------------|----------|-----------|
| Planilhas Excel | Dados dispersos, sem análise | Dashboard centralizado com IA |
| Caderno de anotações | Perda de histórico, sem padrões | Registro estruturado + tendências |
| Vídeos no celular | Sem organização, sem contexto | Vídeos tagueados por lance e jogo |
| WhatsApp com o treinador | Informal, sem rastreabilidade | Relatórios formais + plano individual |
| Currículo em PDF | Estático, desatualizado | Portfólio dinâmico com dados reais |
| Olheiro no estádio | Limitado a 1 jogo, viés | Perfil completo com histórico + IA |

### 1.5 Modelo de Negócio

**Fase atual:** Uso pessoal (single-tenant para o atleta Thomas).
**Visão futura:** SaaS multi-tenant para clubes, escolinhas e atletas independentes.

| Plano | Público | Features |
|-------|---------|----------|
| **Free** | Atletas individuais | Dashboard básico, 3 relatórios IA/mês, portfólio público |
| **Pro** | Atletas sérios | Dashboard completo, IA ilimitada, vídeos, wellness, exportação PDF |
| **Club** | Clubes / Escolinhas | Multi-atleta, painel do treinador, scouting, API |
| **Scout** | Olheiros / Agentes | Busca por atletas, filtros, comparativos, contato direto |

> **Nota:** O MVP será construído como **uso pessoal**, mas a arquitetura será desenhada para suportar multi-tenancy desde o início.

---

## 2. Problemas

### 2.1 Problemas do Atleta de Base

| # | Problema | Impacto |
|---|----------|---------|
| P1 | **Invisibilidade estatística** — Não há registro formal de desempenho em categorias de base | O atleta não consegue demonstrar evolução para olheiros |
| P2 | **Feedback tardio ou inexistente** — O treinador fala no vestiário e o atleta esquece | Sem internalização da análise, erros se repetem |
| P3 | **Ausência de acompanhamento individualizado** — Treinos são coletivos, evolução é genérica | Talentos específicos não são potencializados |
| P4 | **Sobrecarga não monitorada** — Atletas em estirão de crescimento treinam igual aos demais | Lesões epifisárias, fraturas por estresse, burnout |
| P5 | **Saúde mental ignorada** — Pressão por resultados sem suporte emocional | Abandono precoce do esporte, ansiedade, baixa autoestima |
| P6 | **Portfólio inexistente ou amador** — Currículo em Word, vídeos pelo WhatsApp | Olheiros descartam atletas antes de avaliar |
| P7 | **Dados perdidos entre clubes** — Atleta muda de clube e perde todo histórico | Recomeço do zero a cada transferência |

### 2.2 Problemas do Treinador de Base

| # | Problema | Impacto |
|---|----------|---------|
| T1 | **Gestão de elenco em planilha** — 20-30 atletas, centenas de dados, zero automação | Decisões baseadas em memória, não em dados |
| T2 | **Controle de carga manual** — Sem monitoramento de ACWR, sRPE ou wellness | Lesões evitáveis, queda de rendimento |
| T3 | **Comunicação com responsáveis** — Via WhatsApp informal, sem registro | Mal-entendidos, falta de transparência |
| T4 | **Relatórios de evolução** — Gasto de horas escrevendo laudos descritivos | Tempo que deveria ser investido em treino |

### 2.3 Problemas do Olheiro/Scout

| # | Problema | Impacto |
|---|----------|---------|
| S1 | **Viagens para avaliar 1 atleta** — Deslocamento para ver 90 min de jogo | Custo alto, escala limitada |
| S2 | **Ficha de avaliação em papel** — Sem padronização entre olheiros | Dificuldade de comparar atletas |
| S3 | **Sem dados históricos** — Avaliação baseada em 1 jogo assistido | Viés da amostra única |
| S4 | **Vídeos difíceis de encontrar** — Atleta manda link do YouTube sem contexto | Olheiro não tem tempo de assistir 90 min |

---

## 3. Personas

### 3.1 Persona 1 — O Atleta (Thomas)

| Atributo | Detalhe |
|----------|---------|
| **Nome** | Thomas (referência) |
| **Idade** | 13-17 anos |
| **Categoria** | Sub-14 a Sub-17 |
| **Posição** | Qualquer (referência: Lateral Esquerdo) |
| **Contexto** | Atleta de categoria de base de clube do interior de SP |
| **Motivação** | Quer se profissionalizar, precisa se destacar e ser visto |
| **Frustrações** | Não sabe se está evoluindo, não tem como mostrar seu trabalho |
| **Dispositivo** | Smartphone Android (acesso principal), notebook compartilhado |
| **Letramento digital** | Alto em redes sociais, médio em ferramentas profissionais |

**Necessidades:**
- Ver seu desempenho em gráficos claros e motivadores
- Receber feedback personalizado após cada jogo
- Ter um portfólio profissional para enviar a olheiros
- Registrar como se sente (cansaço, motivação, dores)
- Acompanhar sua evolução ao longo de meses/anos

---

### 3.2 Persona 2 — O Treinador

| Atributo | Detalhe |
|----------|---------|
| **Nome** | Professor Marcos (referência) |
| **Idade** | 28-50 anos |
| **Contexto** | Treinador de categorias de base, gerencia 1-3 categorias |
| **Motivação** | Desenvolver atletas com método, ser reconhecido por revelar talentos |
| **Frustrações** | Não tem ferramentas, gasta mais tempo com burocracia do que treinando |
| **Dispositivo** | Smartphone + notebook |
| **Letramento digital** | Médio — usa WhatsApp, YouTube, planilhas básicas |

**Necessidades:**
- Painel com visão geral de todo o elenco
- Controlar carga de treino (sRPE, ACWR)
- Monitorar wellness e risco de lesão
- Gerar relatórios de evolução automaticamente
- Comunicar-se com pais/responsáveis de forma estruturada

---

### 3.3 Persona 3 — O Olheiro/Scout

| Atributo | Detalhe |
|----------|---------|
| **Nome** | Ricardo (referência) |
| **Idade** | 30-55 anos |
| **Contexto** | Scout de clube de Série A ou agente de atletas |
| **Motivação** | Encontrar talentos antes da concorrência, com dados confiáveis |
| **Frustrações** | Viaja muito, avalia poucos atletas, perde tempo com perfis fracos |
| **Dispositivo** | Notebook + tablet |
| **Letramento digital** | Alto em ferramentas profissionais |

**Necessidades:**
- Buscar atletas por posição, categoria, região e indicadores
- Ver portfólio completo com estatísticas verificáveis
- Assistir highlights editados (não jogos inteiros)
- Comparar atletas com gráficos de radar
- Entrar em contato direto (sem intermediários informais)

---

### 3.4 Persona 4 — O Responsável (Pai/Mãe)

| Atributo | Detalhe |
|----------|---------|
| **Nome** | Sandra (referência) |
| **Idade** | 35-50 anos |
| **Contexto** | Mãe/pai de atleta de base, investe tempo e dinheiro na carreira do filho |
| **Motivação** | Garantir que o filho está sendo bem cuidado e evoluindo |
| **Frustrações** | Não sabe o que acontece nos treinos, recebe informações vagas |
| **Dispositivo** | Smartphone |
| **Letramento digital** | Baixo a médio |

**Necessidades:**
- Acompanhar o progresso do filho de forma simples
- Receber notificações sobre jogos, treinos e alertas de saúde
- Entender os relatórios sem jargão técnico
- Ter confiança de que a carga de treino é adequada

---

## 4. Casos de Uso (User Stories)

### 4.1 Módulo — Registro de Partidas

#### US-001: Registrar partida pós-jogo
**Como** atleta,
**Quero** registrar os dados de uma partida que acabei de jogar,
**Para que** o sistema gere uma análise de IA sobre meu desempenho.

**Critérios de Aceite:**
- [ ] Formulário com campos: adversário, data, minutos jogados, nota (1-10), pontos positivos (texto livre), pontos a melhorar (texto livre), observação emocional (texto livre)
- [ ] Validação: minutos entre 1 e 120, nota entre 1 e 10
- [ ] Ao submeter, dispara webhook para n8n
- [ ] Feedback visual de sucesso com preview do relatório IA em até 30 segundos
- [ ] Dados salvos na tabela `match_performances`

#### US-002: Visualizar relatório de IA pós-jogo
**Como** atleta,
**Quero** ler o feedback da IA sobre minha partida,
**Para que** eu saiba o que fiz bem e o que preciso melhorar.

**Critérios de Aceite:**
- [ ] Relatório exibe: análise técnica, feedback comportamental, focos de treino sugeridos
- [ ] Tom motivador e direto (sem clichês)
- [ ] Relatório acessível na tela da partida e no dashboard
- [ ] Opção de compartilhar relatório (link ou PDF)

#### US-003: Listar histórico de partidas
**Como** atleta,
**Quero** ver todas as minhas partidas em ordem cronológica,
**Para que** eu acompanhe minha frequência de jogos e padrões de desempenho.

**Critérios de Aceite:**
- [ ] Lista com: data, adversário, minutos, nota, status do relatório IA
- [ ] Filtros por: período, nota mínima/máxima, com/sem relatório
- [ ] Paginação ou scroll infinito
- [ ] Click na partida abre os detalhes + relatório

---

### 4.2 Módulo — Dashboard

#### US-004: Visualizar dashboard de evolução
**Como** atleta,
**Quero** ver meu progresso em gráficos e indicadores,
**Para que** eu tenha clareza visual da minha evolução.

**Critérios de Aceite:**
- [ ] KPIs no topo: total de jogos, média de notas, minutos totais, tendência (↑↓→)
- [ ] Gráfico de linha: evolução da nota ao longo do tempo
- [ ] Gráfico de radar: skills atuais vs. 30 dias atrás
- [ ] Card do último jogo com mini-relatório IA
- [ ] Alertas ativos (carga alta, wellness baixo, etc.)

#### US-005: Dashboard do treinador
**Como** treinador,
**Quero** ver um painel com todos os meus atletas,
**Para que** eu identifique rapidamente quem precisa de atenção.

**Critérios de Aceite:**
- [ ] Lista de atletas com: nome, foto, categoria, último jogo, wellness score, alerta de carga
- [ ] Semáforo de risco: 🟢 OK, 🟡 Atenção, 🔴 Risco
- [ ] Click no atleta abre o perfil completo
- [ ] Filtros por categoria e posição
- [ ] Resumo do elenco: média de carga, atletas em risco, próximos jogos

---

### 4.3 Módulo — Treinos e Carga

#### US-006: Registrar sessão de treino
**Como** atleta,
**Quero** registrar meus treinos (tipo, duração, intensidade),
**Para que** o sistema calcule minha carga de trabalho.

**Critérios de Aceite:**
- [ ] Campos: data, tipo (técnico/tático/físico/jogo-treino), duração em minutos, RPE percebido (1-10)
- [ ] Cálculo automático de sRPE (session RPE = duração × RPE)
- [ ] Salva na tabela `training_sessions` + `training_feedbacks`

#### US-007: Monitorar carga aguda vs. crônica (ACWR)
**Como** treinador,
**Quero** ver a relação carga aguda/crônica de cada atleta,
**Para que** eu previna lesões por sobrecarga ou destreinamento.

**Critérios de Aceite:**
- [ ] Cálculo ACWR com EWMA (Exponentially Weighted Moving Average)
- [ ] Acute = últimos 7 dias, Chronic = últimos 28 dias
- [ ] Faixas: < 0.8 (destreinamento), 0.8-1.3 (ótimo), > 1.5 (risco alto)
- [ ] Gráfico de linha com faixa ideal sombreada
- [ ] Alerta automático se ACWR > 1.5

#### US-008: Planejar treino semanal
**Como** treinador,
**Quero** planejar a semana de treinos do elenco,
**Para que** eu distribua a carga de forma inteligente.

**Critérios de Aceite:**
- [ ] Calendário semanal com drag & drop de sessões
- [ ] Visualização de carga prevista vs. realizada
- [ ] Sugestão da IA para distribuição ideal

---

### 4.4 Módulo — Wellness e Saúde

#### US-009: Check-in diário de wellness
**Como** atleta,
**Quero** registrar como estou me sentindo antes do treino,
**Para que** o treinador saiba se estou apto para treinar em alta intensidade.

**Critérios de Aceite:**
- [ ] Formulário rápido (< 60 segundos): sono (1-5), fadiga (1-5), dor muscular (1-5), estresse (1-5), humor (1-5)
- [ ] Score composto de wellness (média ponderada)
- [ ] Lembrete automático via WhatsApp/notificação às 7h
- [ ] Histórico em gráfico de tendência (7/30/90 dias)
- [ ] Alerta para treinador se score < 2.5

#### US-010: Tracker de maturação (PHV)
**Como** treinador,
**Quero** acompanhar a maturação biológica dos atletas,
**Para que** eu ajuste a carga de treino durante o estirão de crescimento.

**Critérios de Aceite:**
- [ ] Registro periódico: altura em pé, altura sentado, peso
- [ ] Cálculo de velocidade de crescimento (cm/mês)
- [ ] Estimativa de Peak Height Velocity (PHV)
- [ ] Classificação: pré-PHV, PHV, pós-PHV
- [ ] Recomendações automáticas de carga por fase

---

### 4.5 Módulo — Vídeos e Mídia

#### US-011: Upload e organização de vídeos
**Como** atleta,
**Quero** fazer upload de vídeos de jogos e treinos,
**Para que** eu tenha uma biblioteca organizada dos meus lances.

**Critérios de Aceite:**
- [ ] Upload direto para Supabase Storage
- [ ] Associar vídeo a uma partida ou treino específico
- [ ] Thumbnail automático
- [ ] Limite de tamanho: 500MB por vídeo

#### US-012: Tagging de lances em vídeo
**Como** atleta,
**Quero** marcar momentos-chave nos vídeos (gol, assistência, desarme, erro),
**Para que** olheiros possam assistir apenas os highlights.

**Critérios de Aceite:**
- [ ] Player de vídeo com timeline clicável
- [ ] Botões de tag: ⚽ Gol, 🅰️ Assistência, 🛡️ Desarme, 🏃 Sprint, ❌ Erro, ⭐ Destaque
- [ ] Cada tag salva: timestamp_inicio, timestamp_fim, tipo, descrição
- [ ] Geração de compilado de highlights automático
- [ ] Integração com YouTube (importar vídeos do canal)

---

### 4.6 Módulo — Portfólio Público

#### US-013: Portfólio público para olheiros
**Como** atleta,
**Quero** ter uma página pública profissional com meus dados,
**Para que** olheiros e clubes possam me avaliar remotamente.

**Critérios de Aceite:**
- [ ] URL pública: `athleteos.com/atleta/{slug}`
- [ ] Seções: foto, bio, estatísticas, gráfico de radar, highlights, contato
- [ ] Dados puxados em tempo real do Supabase (sempre atualizado)
- [ ] Design responsivo e premium (dark mode esportivo)
- [ ] Botão "Interessado neste atleta" (gera lead para contato)
- [ ] Meta tags para SEO e compartilhamento em redes sociais

#### US-014: Exportar portfólio em PDF
**Como** atleta,
**Quero** exportar meu portfólio como PDF,
**Para que** eu possa enviar por e-mail ou WhatsApp para clubes.

**Critérios de Aceite:**
- [ ] PDF com layout profissional (1-2 páginas)
- [ ] Inclui: foto, dados, estatísticas, QR code para portfólio online
- [ ] Gerado server-side (Edge Function ou Server Action)

---

### 4.7 Módulo — Scouting

#### US-015: Buscar atletas (visão do olheiro)
**Como** olheiro,
**Quero** buscar e filtrar atletas por critérios,
**Para que** eu encontre talentos compatíveis com o que meu clube procura.

**Critérios de Aceite:**
- [ ] Filtros: posição, categoria, região/estado, pé dominante, faixa de nota média
- [ ] Resultados em cards com: foto, nome, posição, categoria, score médio, mini-radar
- [ ] Ordenação por relevância, nota média ou atividade recente
- [ ] Click no card abre o portfólio completo

#### US-016: Ficha de avaliação do olheiro
**Como** olheiro,
**Quero** preencher uma ficha de avaliação padronizada sobre um atleta,
**Para que** eu tenha um registro formal e comparável das minhas observações.

**Critérios de Aceite:**
- [ ] Avaliação por dimensão: técnica (1-10), tática (1-10), física (1-10), mental (1-10)
- [ ] Campos de texto: destaques, limitações, projeção, comparação com jogador profissional
- [ ] Nota geral + recomendação (Dispensar / Acompanhar / Convidar para teste / Contratar)
- [ ] Ficha visível apenas para o olheiro (não aparece no portfólio do atleta)

---

### 4.8 Módulo — Desenvolvimento Individual

#### US-017: Plano Individual de Desenvolvimento (PID)
**Como** treinador,
**Quero** criar um plano de desenvolvimento individual para cada atleta,
**Para que** a evolução seja intencional e mensurável.

**Critérios de Aceite:**
- [ ] Definição de metas por ciclo (mensal/trimestral)
- [ ] Categorias: técnica, tática, física, mental
- [ ] Indicadores de progresso vinculados às métricas do sistema
- [ ] Revisão periódica com registro de observações

#### US-018: Relatório de evolução gerado por IA
**Como** atleta,
**Quero** receber um relatório mensal de evolução gerado pela IA,
**Para que** eu veja meu progresso de forma clara e motivadora.

**Critérios de Aceite:**
- [ ] Gerado automaticamente no último dia do mês
- [ ] Compara métricas atuais vs. mês anterior
- [ ] Destaca: maior evolução, ponto que mais precisa melhorar, foco para o próximo mês
- [ ] Tom motivador e personalizado
- [ ] Enviado por WhatsApp/e-mail + disponível no dashboard

---

### 4.9 Módulo — Autenticação e Perfis

#### US-019: Cadastro e login multi-role
**Como** usuário,
**Quero** me cadastrar e acessar o sistema com meu papel definido,
**Para que** eu veja apenas o conteúdo relevante para mim.

**Critérios de Aceite:**
- [ ] Cadastro com: nome, e-mail, senha, role (atleta/treinador/olheiro/responsável)
- [ ] Login com e-mail + senha (Supabase Auth)
- [ ] Login social (Google) como alternativa
- [ ] Redirecionamento pós-login baseado no role
- [ ] RLS (Row Level Security) aplicado em todas as tabelas

#### US-020: Vincular responsável ao atleta
**Como** responsável,
**Quero** vincular minha conta à conta do meu filho (atleta),
**Para que** eu acompanhe o progresso dele sem acessar funcionalidades do atleta.

**Critérios de Aceite:**
- [ ] Fluxo de convite: atleta gera código, responsável insere o código
- [ ] Responsável vê: dashboard resumido, relatórios, wellness, alertas
- [ ] Responsável NÃO pode: editar dados, registrar partidas, acessar scouting
- [ ] Múltiplos responsáveis por atleta (pai + mãe)

---

## 5. Jornadas do Usuário

### 5.1 Jornada — Registro Pós-Jogo (Atleta)

```
┌─────────────┐    ┌──────────────────┐    ┌─────────────────┐    ┌──────────────────┐
│  Thomas      │    │  Formulário      │    │  n8n Webhook     │    │  Gemini AI       │
│  abre o app  │───▶│  de partida      │───▶│  processa dados  │───▶│  gera análise    │
└─────────────┘    └──────────────────┘    └─────────────────┘    └──────────────────┘
                                                                          │
┌─────────────┐    ┌──────────────────┐    ┌─────────────────┐           │
│  Thomas lê   │◀──│  Notificação     │◀──│  Supabase salva  │◀──────────┘
│  o feedback  │    │  "Relatório      │    │  ai_reports      │
│  e reflete   │    │   pronto!"       │    │                  │
└─────────────┘    └──────────────────┘    └─────────────────┘
```

**Tempo total:** < 2 minutos para preencher, < 30 segundos para receber o relatório.

### 5.2 Jornada — Check-in Matinal (Atleta)

```
07:00 ─── WhatsApp: "Bom dia Thomas! Como você está hoje?"
  │
  ├──▶ Thomas clica no link
  │
  ├──▶ Formulário rápido (5 sliders: sono, fadiga, dor, estresse, humor)
  │
  ├──▶ Submit (< 60 segundos)
  │
  ├──▶ Dashboard atualiza wellness score
  │
  └──▶ Se score < 2.5 → Alerta para treinador: "Thomas reportou fadiga alta"
```

### 5.3 Jornada — Avaliação Remota (Olheiro)

```
┌──────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│  Olheiro     │    │  Busca por       │    │  Abre portfólio     │
│  acessa      │───▶│  "Lateral Esq    │───▶│  do Thomas          │
│  AthleteOS   │    │   Sub-14, SP"    │    │                     │
└──────────────┘    └──────────────────┘    └─────────────────────┘
                                                      │
┌──────────────┐    ┌──────────────────┐              │
│  Preenche    │◀──│  Assiste          │◀─────────────┘
│  ficha de    │    │  highlights       │
│  avaliação   │    │  (2-3 min)       │
└──────────────┘    └──────────────────┘
        │
        ▼
┌──────────────────────────────────────┐
│  Clica "Interessado neste atleta"    │
│  → Lead gerado → Contato via email   │
└──────────────────────────────────────┘
```

### 5.4 Jornada — Monitoramento Semanal (Treinador)

```
Segunda ──── Revisa wellness scores do elenco (semáforo)
  │
  ├──▶ 🟢 15 atletas OK
  ├──▶ 🟡 3 atletas em atenção (fadiga moderada)
  └──▶ 🔴 1 atleta em risco (Thomas: ACWR = 1.7)
           │
           ├──▶ Abre perfil do Thomas
           ├──▶ Vê gráfico ACWR: carga subiu 40% na última semana
           ├──▶ Decide: reduzir intensidade no treino de terça
           └──▶ Registra observação no PID do Thomas
```

---

## 6. Definição do MVP

### 6.1 Escopo do MVP (Expandido)

O MVP inclui **5 módulos core**:

| Módulo | User Stories | Prioridade |
|--------|-------------|------------|
| 🔐 Auth & Perfis | US-019 | P0 |
| 📊 Dashboard | US-004 | P0 |
| ⚽ Partidas + IA | US-001, US-002, US-003 | P0 |
| 🏋️ Treinos + Carga | US-006, US-007 | P0 |
| 💚 Wellness | US-009 | P0 |
| 🌐 Portfólio Público | US-013 | P1 |

### 6.2 Fora do MVP (Fase 2+)

| Feature | Fase |
|---------|------|
| Dashboard do treinador (US-005) | Fase 2 |
| Vídeos e tagging (US-011, US-012) | Fase 2 |
| Scouting e busca (US-015, US-016) | Fase 3 |
| PID e evolução IA (US-017, US-018) | Fase 3 |
| PHV / Maturação (US-010) | Fase 3 |
| Exportação PDF (US-014) | Fase 2 |
| Multi-responsável (US-020) | Fase 3 |
| Planejamento de treino (US-008) | Fase 4 |

### 6.3 Critérios de Sucesso do MVP

| Métrica | Target |
|---------|--------|
| Thomas consegue registrar uma partida e receber relatório IA | ✅ Funcional |
| Dashboard exibe gráficos de evolução com dados reais | ✅ Funcional |
| Wellness check-in leva menos de 60 segundos | ✅ UX |
| Carga ACWR é calculada e exibida corretamente | ✅ Funcional |
| Portfólio público carrega em < 2 segundos | ✅ Performance |
| Sistema funciona perfeitamente em mobile (Android) | ✅ Responsividade |

---

## 7. Roadmap

### Fase 1 — Fundação (MVP)
**Duração estimada:** 4-6 semanas

- 🔐 Autenticação e perfis (Supabase Auth + RLS)
- ⚽ Registro de partidas + integração Gemini AI
- 📊 Dashboard pessoal do atleta
- 🏋️ Registro de treinos + cálculo sRPE + ACWR
- 💚 Wellness check-in diário
- 🌐 Portfólio público básico

### Fase 2 — Expansão
**Duração estimada:** 4-6 semanas

- 👨‍🏫 Dashboard do treinador (multi-atleta)
- 🎥 Upload e gerenciamento de vídeos
- 🏷️ Tagging de lances em vídeo
- 📄 Exportação de portfólio em PDF
- 📱 Notificações WhatsApp (wellness reminder, relatório pronto)
- 👨‍👩‍👦 Acesso do responsável

### Fase 3 — Inteligência
**Duração estimada:** 4-6 semanas

- 🔍 Painel de scouting (busca + filtros + fichas)
- 📈 Gráfico de radar por percentil comparativo
- 📋 Plano Individual de Desenvolvimento (PID)
- 🤖 Relatório mensal de evolução por IA
- 📏 Tracker de maturação PHV
- 🔎 RAG com pgvector (consultas semânticas ao histórico)

### Fase 4 — Escala (SaaS)
**Duração estimada:** 6-8 semanas

- 🏢 Multi-tenancy (clubes e escolinhas)
- 💰 Planos e billing (Stripe)
- 📅 Planejamento de treinos com calendário
- 🔗 API pública para integrações
- 📊 Analytics avançado e BI
- 🌎 Internacionalização (pt-BR, en, es)

---

## 8. Backlog Completo

### Legenda de Prioridades
- **P0** — Must have (MVP, sem isso não lança)
- **P1** — Should have (importante, entra logo após MVP)
- **P2** — Could have (agrega valor, pode esperar)
- **P3** — Won't have now (visão futura, documenta mas não implementa)

### 8.1 Backlog por Módulo

#### Auth & Perfis
| ID | Feature | Prioridade | US |
|----|---------|------------|-----|
| AUTH-001 | Cadastro com e-mail e senha | P0 | US-019 |
| AUTH-002 | Login com e-mail e senha | P0 | US-019 |
| AUTH-003 | Login social (Google) | P1 | US-019 |
| AUTH-004 | Seleção de role no cadastro | P0 | US-019 |
| AUTH-005 | RLS por role em todas as tabelas | P0 | US-019 |
| AUTH-006 | Recuperação de senha | P0 | — |
| AUTH-007 | Edição de perfil (foto, bio, dados) | P1 | — |
| AUTH-008 | Vinculação responsável-atleta | P2 | US-020 |
| AUTH-009 | Convite por código | P2 | US-020 |

#### Partidas
| ID | Feature | Prioridade | US |
|----|---------|------------|-----|
| MATCH-001 | Formulário de registro pós-jogo | P0 | US-001 |
| MATCH-002 | Disparo de webhook n8n | P0 | US-001 |
| MATCH-003 | Análise IA via Gemini | P0 | US-002 |
| MATCH-004 | Exibição do relatório IA | P0 | US-002 |
| MATCH-005 | Lista de partidas com filtros | P0 | US-003 |
| MATCH-006 | Detalhes da partida | P0 | US-003 |
| MATCH-007 | Compartilhar relatório (link) | P1 | US-002 |
| MATCH-008 | Estatísticas avançadas por jogo | P2 | — |

#### Dashboard
| ID | Feature | Prioridade | US |
|----|---------|------------|-----|
| DASH-001 | KPIs principais (jogos, média, minutos) | P0 | US-004 |
| DASH-002 | Gráfico de evolução de notas | P0 | US-004 |
| DASH-003 | Card do último jogo | P0 | US-004 |
| DASH-004 | Gráfico de radar de skills | P1 | US-004 |
| DASH-005 | Alertas ativos | P1 | US-004 |
| DASH-006 | Dashboard do treinador (multi-atleta) | P2 | US-005 |
| DASH-007 | Semáforo de risco do elenco | P2 | US-005 |

#### Treinos & Carga
| ID | Feature | Prioridade | US |
|----|---------|------------|-----|
| TRAIN-001 | Registro de sessão de treino | P0 | US-006 |
| TRAIN-002 | Cálculo automático de sRPE | P0 | US-006 |
| TRAIN-003 | Gráfico ACWR com faixas | P0 | US-007 |
| TRAIN-004 | Alerta de sobrecarga (ACWR > 1.5) | P1 | US-007 |
| TRAIN-005 | Histórico de treinos | P0 | US-006 |
| TRAIN-006 | Calendário de planejamento | P3 | US-008 |

#### Wellness
| ID | Feature | Prioridade | US |
|----|---------|------------|-----|
| WELL-001 | Formulário de check-in (5 dimensões) | P0 | US-009 |
| WELL-002 | Score composto de wellness | P0 | US-009 |
| WELL-003 | Gráfico de tendência wellness | P0 | US-009 |
| WELL-004 | Alerta wellness baixo para treinador | P1 | US-009 |
| WELL-005 | Lembrete automático via WhatsApp | P2 | US-009 |
| WELL-006 | Tracker PHV (maturação) | P2 | US-010 |

#### Vídeos
| ID | Feature | Prioridade | US |
|----|---------|------------|-----|
| VID-001 | Upload para Supabase Storage | P1 | US-011 |
| VID-002 | Galeria de vídeos | P1 | US-011 |
| VID-003 | Associar vídeo a partida | P1 | US-011 |
| VID-004 | Player com timeline de tags | P2 | US-012 |
| VID-005 | Tagging de lances | P2 | US-012 |
| VID-006 | Geração de highlights compilado | P3 | US-012 |
| VID-007 | Importação do YouTube | P2 | US-012 |

#### Portfólio
| ID | Feature | Prioridade | US |
|----|---------|------------|-----|
| PORT-001 | Página pública do atleta | P1 | US-013 |
| PORT-002 | Estatísticas em tempo real | P1 | US-013 |
| PORT-003 | Highlights integrados | P2 | US-013 |
| PORT-004 | Botão "Interessado" (lead gen) | P2 | US-013 |
| PORT-005 | Exportação PDF | P2 | US-014 |
| PORT-006 | SEO + Open Graph tags | P1 | US-013 |

#### Scouting
| ID | Feature | Prioridade | US |
|----|---------|------------|-----|
| SCOUT-001 | Busca com filtros | P2 | US-015 |
| SCOUT-002 | Ficha de avaliação padronizada | P2 | US-016 |
| SCOUT-003 | Comparativo entre atletas | P3 | — |
| SCOUT-004 | Radar por percentil da categoria | P2 | US-015 |

#### IA & Relatórios
| ID | Feature | Prioridade | US |
|----|---------|------------|-----|
| AI-001 | Prompt de análise técnica pós-jogo | P0 | US-002 |
| AI-002 | Prompt de feedback comportamental | P0 | US-002 |
| AI-003 | Relatório mensal de evolução | P2 | US-018 |
| AI-004 | RAG com pgvector | P3 | — |
| AI-005 | Sugestão de treino baseada em IA | P3 | — |

#### Automações
| ID | Feature | Prioridade | US |
|----|---------|------------|-----|
| AUTO-001 | Workflow pós-jogo (n8n) | P0 | US-001 |
| AUTO-002 | Lembrete wellness (WhatsApp) | P2 | US-009 |
| AUTO-003 | Relatório semanal automático | P2 | US-018 |
| AUTO-004 | Ingestão YouTube | P2 | US-012 |
| AUTO-005 | Backup diário | P1 | — |

---

## 9. Requisitos Não-Funcionais

### 9.1 Performance

| Requisito | Meta |
|-----------|------|
| Tempo de carregamento do dashboard | < 2 segundos |
| Tempo de resposta da IA (relatório) | < 30 segundos |
| Tempo de carregamento do portfólio público | < 1.5 segundos (LCP) |
| API response time (p95) | < 500ms |
| Suporte a usuários simultâneos (MVP) | 50 |
| Suporte a usuários simultâneos (SaaS) | 10.000 |

### 9.2 Segurança

| Requisito | Implementação |
|-----------|---------------|
| Autenticação | Supabase Auth (bcrypt, JWT) |
| Autorização | RLS (Row Level Security) por role |
| Dados sensíveis | Criptografia at-rest (Supabase default) |
| LGPD | Consentimento explícito, direito ao esquecimento, exportação de dados |
| Proteção de menores | Dados de atletas < 18 anos vinculados ao responsável legal |
| Secrets | Variáveis de ambiente (nunca hardcoded) |
| Rate limiting | 100 req/min por IP (API), 10 req/min (IA) |

### 9.3 Acessibilidade

| Requisito | Meta |
|-----------|------|
| WCAG | Nível AA |
| Contraste | Ratio ≥ 4.5:1 para texto, ≥ 3:1 para elementos UI |
| Navegação por teclado | Todas as funcionalidades acessíveis sem mouse |
| Tamanho mínimo de toque | 44x44px (mobile) |
| Linguagem | Simples, sem jargão técnico para atletas e responsáveis |

### 9.4 Responsividade

| Dispositivo | Breakpoint | Prioridade |
|-------------|------------|------------|
| Mobile (Android) | < 768px | **Primário** — dispositivo principal do atleta |
| Tablet | 768px - 1024px | Secundário |
| Desktop | > 1024px | Secundário — treinadores e olheiros |

### 9.5 Disponibilidade

| Requisito | Meta |
|-----------|------|
| Uptime | 99.5% (MVP), 99.9% (SaaS) |
| Backup | Diário automático |
| Recovery time (RTO) | < 4 horas |
| Recovery point (RPO) | < 24 horas |

### 9.6 Conformidade Legal

| Requisito | Detalhe |
|-----------|---------|
| LGPD | Consentimento para coleta, processamento e compartilhamento de dados |
| Menores de idade | Consentimento do responsável legal obrigatório |
| Dados de saúde | Tratamento especial conforme Art. 11 da LGPD |
| Direito ao esquecimento | Funcionalidade de exclusão completa de conta e dados |
| Portabilidade | Exportação de todos os dados do atleta em formato aberto (JSON/CSV) |

---

*Documento gerado como parte da AthleteOS Engineering Bible.*
*Volume 1 de 10 — Product Requirements Document (PRD)*
*AthleteOS © 2026*
