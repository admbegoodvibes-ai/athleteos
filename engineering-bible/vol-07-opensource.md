# 📒 AthleteOS Engineering Bible
# Volume 7 — Integrações Open Source

## 1. Estratégia de Integração

A filosofia principal do AthleteOS em relação ao open source é: **não reinvente a roda**. Nosso valor central não está em reconstruir bibliotecas de gráficos ou sistemas de autenticação, mas em orquestrar essas ferramentas para fornecer insights revolucionários sobre o desempenho de jovens atletas.

- **Filosofia:** Construa o que nos diferencia (análise preditiva, IA, modelos específicos do futebol), e aproveite o open source para todo o resto (UI, banco de dados, renderização de gráficos, infraestrutura).
- **Compatibilidade de Licenças:** Priorizamos licenças permissivas:
  - **MIT:** Preferencial. Uso irrestrito comercialmente.
  - **Apache 2.0:** Excelente. Permite uso comercial, inclui proteções de patente.
  - **CC-BY:** Requer atribuição. Usado apenas quando podemos creditar adequadamente (ex: datasets).
  - *Evitamos GPL/AGPL* estritamente para não comprometermos a natureza proprietária do AthleteOS.
- **Padrões de Integração:**
  - `npm install`: Para bibliotecas mantidas ativamente e infraestrutura core (ex: React, Recharts).
  - `copy & paste`: Para componentes visuais ou pequenos utilitários onde o código-fonte deve ser nosso para fácil adaptação (ex: Shadcn/UI, fórmulas matemáticas, gráficos Python convertidos).
  - `fork`: Somente quando precisamos modificar extensivamente uma biblioteca grande e não mantida, o que evitamos sempre que possível.
- **Critérios de Avaliação:** Estabilidade (quantidade de issues abertas/fechadas), atividade recente no repositório, popularidade (Stars) e, crucialmente, tamanho do bundle/impacto na performance.

---

## 2. Projetos de Analytics Esportivo

Esta seção detalha os projetos open source específicos para a ciência e análise de futebol que podemos referenciar ou adaptar.

### 2.1 Football Match Intelligence
- **Nome e URL:** [DataKnight1/football-match-intelligence](https://github.com/DataKnight1/football-match-intelligence)
- **Licença:** MIT (Verificar repositório)
- **Status/Estrelas:** ~100+ Stars / Atividade Moderada
- **O que faz:** Script em Python para gerar relatórios pós-jogo detalhados, mapas de calor e visualizações baseadas em eventos.
- **O que aproveitar:** Lógica de processamento de coordenadas (x,y) do campo para conversão em densidade (mapas de calor) e as fórmulas matemáticas por trás das comparações de jogadores.
- **O que descartar:** Toda a camada de visualização em Python/Matplotlib. Não rodaremos Python no client-side nem geraremos imagens estáticas no backend se pudermos evitar.
- **Dependências que traz:** Nenhuma para o nosso código-fonte (servirá apenas de referência matemática).
- **Como integrar:** 
  1. Estudar o algoritmo de KDE (Kernel Density Estimation) usado por eles.
  2. Implementar a mesma lógica em JavaScript/TypeScript.
  3. Mapear as densidades calculadas para a biblioteca D3.js ou matriz de grade para exibição via React.
- **Exemplo de Integração:**
  ```typescript
  // Adaptação da lógica de zonas do campo do projeto para JS
  export function calculatePitchZones(events: PlayerEvent[]) {
    // Mapeamento de coordenadas (0-100) para 18 zonas (6x3) do campo
    // ...lógica inspirada no repositório
  }
  ```
- **Riscos e Considerações:** As coordenadas do campo variam dependendo da fonte dos dados. É vital normalizar todos os dados de eventos para um sistema de coordenadas padrão (ex: 105x68 metros, mapeado para 0-100%) antes de aplicar suas lógicas.

### 2.2 StatsBomb Open Data
- **Nome e URL:** [statsbomb/open-data](https://github.com/statsbomb/open-data)
- **Licença:** Permitido para uso não-comercial com atribuição, MAS as *especificações e esquemas* podem ser usados como referência arquitetural livremente.
- **Status/Estrelas:** 3k+ Stars / Muito Ativo
- **O que faz:** Maior dataset público de eventos de futebol, com JSONs extremamente detalhados (incluindo pressão invisível, Freeze Frames).
- **O que aproveitar:** O **Schema de Eventos**. Usaremos como inspiração máxima para o banco de dados do AthleteOS.
- **O que descartar:** Os dados propriamente ditos (já que focamos no atleta).
- **Dependências que traz:** Nenhuma.
- **Como integrar:** 
  1. Revisar o PDF de especificação do StatsBomb.
  2. Criar nosso schema Prisma/Drizzle baseando nossos `event_types` nos deles (`Pass`, `Ball Receipt`, `Carry`, `Pressure`, `Duel`).
- **Riscos e Considerações:** O modelo deles é extremamente verboso. Precisamos simplificá-lo, removendo campos que não coletaremos para times de base (ex: *Freeze Frames* precisos do momento do chute).

### 2.3 mplsoccer (Pitch Visualizations)
- **Nome e URL:** [andrewRowlinson/mplsoccer](https://github.com/andrewRowlinson/mplsoccer)
- **Licença:** MIT
- **Status/Estrelas:** 1.5k+ Stars / Ativo
- **O que faz:** Biblioteca Python baseada em Matplotlib especializada em desenhar campos de futebol, redes de passes e mapas de finalização.
- **O que aproveitar:** As geometrias precisas e marcações do campo (raio do círculo central, área penal, etc.) que estão em proporções matemáticas exatas.
- **Como integrar/Guia de Conversão (Matplotlib para Recharts/D3/SVG):**
  1. Nós não vamos instalar Python.
  2. Extrairemos as constantes geométricas de campo da biblioteca `mplsoccer`.
  3. Recriaremos o componente `Pitch` usando SVGs puros do React, utilizando as dimensões padronizadas da biblioteca.
- **Exemplo de Código (O que criaremos inspirados neles):**
  ```tsx
  // React SVG Pitch - Inspirado nas dimensões do mplsoccer
  export const SoccerPitch = ({ events }) => (
    <svg viewBox="0 0 105 68" className="bg-green-700 w-full h-full">
      {/* Linha central, círculos e áreas mapeadas das constantes do mplsoccer */}
      {events.map(e => <circle cx={e.x} cy={e.y} r={1} fill="red" />)}
    </svg>
  );
  ```

### 2.4 soccerplots
- **Nome e URL:** [Slothfulwave612/soccerplots](https://github.com/Slothfulwave612/soccerplots)
- **Licença:** MIT
- **Status/Estrelas:** 400+ Stars
- **O que faz:** Gera "Radar Charts" (pizza/radar) estilizados específicos para comparação de jogadores no formato percentile.
- **O que aproveitar:** A metodologia de cálculo de percentis para ranqueamento (ex: como comparar a métrica de 15 passes progressivos de um lateral vs todos os outros laterais da liga).
- **O que descartar:** O gerador de imagens Python.
- **Como integrar:** Usaremos a lógica de fatiamento do gráfico de radar deles, mas vamos renderizar na web utilizando o **Recharts** (RadarChart).
- **Exemplo de Integração (Cálculo de Percentil):**
  ```typescript
  // Algoritmo inspirado no soccerplots
  function calculatePercentile(playerStat: number, leagueStatsArray: number[]) {
    // Cálculo do Rank
  }
  ```
- **Riscos e Considerações:** Radar charts podem ser distorcidos visualmente se a escala não for ajustada minunciosamente (min 0, max 99º percentil).

### 2.5 football_analysis (YOLOv8 + ByteTrack)
- **Nome e URL:** [abdullahtarek/football_analysis](https://github.com/abdullahtarek/football_analysis)
- **Licença:** MIT
- **Status/Estrelas:** 1.5k+ / Ativo
- **O que faz:** Pipeline de Visão Computacional (Computer Vision) end-to-end. Rastrea jogadores usando YOLOv8, mantém o ID do jogador ao longo do tempo (ByteTrack), calcula posse de bola da equipe via cores da camisa e mede a distância percorrida convertendo pixels para metros através de homografia do campo.
- **O que aproveitar:** O repositório INTEIRO é uma mina de ouro. Os pesos pré-treinados do YOLOv8 e o algoritmo de transformação de perspectiva (Pixel para Metros).
- **O que descartar:** O frontend/dashboard que ele possa ter em gradio/streamlit.
- **Dependências que traz:** Requer backend Python separado, OpenCV, PyTorch, Ultralytics YOLO.
- **Como integrar:** Este será um **microserviço de processamento assíncrono** (Media Pipeline).
  1. O usuário do AthleteOS faz upload do vídeo via Next.js (upload para bucket S3).
  2. O Next.js notifica o microserviço em Python (onde este projeto rodará).
  3. O modelo processa, extrai métricas físicas e coordenadas, e salva os JSONs no Supabase.
  4. O frontend consome os dados do Supabase.
- **Requisitos de Hardware:** GPUs Nvidia necessárias no servidor de processamento de vídeos (AWS EC2 G4dn ou equivalente).

---

## 3. Projetos de UI/Dashboard

### 3.1 Shadcn/UI
- **Nome e URL:** [shadcn/ui](https://ui.shadcn.com/)
- **O que faz:** Componentes de interface acessíveis e altamente customizáveis que você copia e cola diretamente no projeto (não instalados via npm, você é dono do código).
- **Componentes a utilizar:** `Button`, `Dialog`, `Select`, `Card`, `Table`, `Tabs`, `Form`, `Calendar`.
- **Guia de Instalação e Customização:**
  1. Rodar `npx shadcn-ui@latest init` no diretório Next.js.
  2. Para o tema escuro esportivo do AthleteOS, ajustaremos os tokens no `globals.css` (Background: `#09090b` (zinc-950), Primária: `#22c55e` (green-500) para toques vibrantes parecidos com gramado iluminado).

### 3.2 Recharts
- **Nome e URL:** [recharts/recharts](https://github.com/recharts/recharts)
- **O que faz:** A biblioteca padrão para gráficos em React, baseada em D3.js.
- **Gráficos utilizados e Implementações:**
  
  - **Gráfico de Linha de Evolução (Evolution line chart):**
  ```tsx
  import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
  
  export const EvolutionChart = ({ data }) => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="date" stroke="#888888" />
        <YAxis stroke="#888888" />
        <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a' }} />
        <Line type="monotone" dataKey="sprintSpeed" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
  ```

  - **Radar de Habilidades (Skills radar chart):**
  ```tsx
  import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
  
  export const SkillsRadar = ({ data }) => (
    <ResponsiveContainer width="100%" height={350}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid stroke="#27272a" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa' }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
        <Radar name="Player" dataKey="A" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} />
      </RadarChart>
    </ResponsiveContainer>
  );
  ```
  *(Implementações de ACWR zone, Wellness trend e Training load distribuem de forma análoga, utilizando `AreaChart` para ACWR e `BarChart` para Carga de Treinamento).*

### 3.3 Tremor (Componentes Opcionais)
- **Nome e URL:** [tremorlabs/tremor](https://github.com/tremorlabs/tremor)
- **O que faz:** Componentes específicos para construção de Dashboards de Analytics em Tailwind (Cards, Sparklines, ProgressBars).
- **Quando usar vs Customizado:** Usaremos Tremor para KPI Cards rápidos da aba inicial da comissão técnica (ex: "Jogadores em Risco de Lesão"). Para visualizações muito complexas do jogador, preferiremos construir do zero com Recharts e Tailwind.

### 3.4 React Player
- **Nome e URL:** [cookpete/react-player](https://github.com/cookpete/react-player)
- **O que faz:** Componente versátil para tocar vídeos (YouTube, Vimeo ou URLs cruas mp4) lidando com os problemas chatos das APIs nativas.
- **O que aproveitar:** Sincronização de timestamps para Highlights tagueados. Podemos criar botões no Dashboard ("Ver Chute do Min 32") que controlam a ref do React Player (`playerRef.current.seekTo(1920)`).

---

## 4. Projetos de Backend/Infraestrutura

### 4.1 Supabase Auth Helpers (Next.js)
- **Projeto:** `@supabase/ssr` (Nova versão dos helpers)
- **Como integrar:** Permite verificar a sessão tanto no lado do cliente, quanto em Server Components e no `middleware.ts` para proteger as rotas da plataforma. Padrão de integração envolve a criação dos arquivos `utils/supabase/server.ts` e `client.ts`.

### 4.2 Drizzle ORM (Opcional)
- **Projeto:** `drizzle-orm` e `drizzle-kit`
- **Comparação:** O client tradicional do Supabase `supabase.from('table').select('*')` já possui tipagem através do GenTypes (Gerador de tipos TypeScript). Contudo, o Drizzle pode ser usado se precisarmos de migrações complexas locais ou queries multi-tabela com joins que ficam difíceis no Supabase-js padrão.

### 4.3 Zod
- **O que faz:** Schema de validação TypeScript.
- **Padrão de Integração:** Usaremos como única fonte da verdade (Single Source of Truth). O schema do Zod de um Formulário de Registro de Atleta será reutilizado:
  1. No lado do cliente para validar o Form (React Hook Form).
  2. Na Rota da API (Backend) para garantir segurança e sanitizar dados maliciosos.
  3. Para **validar a saída (Structured Output)** recebida do Gemini AI.

### 4.4 React Hook Form
- **Projeto:** `react-hook-form` associado ao `@hookform/resolvers/zod`
- **Integração:** Garante que grandes formulários de avaliações físicas e questionários diários de bem-estar não causem re-renders desnecessários no Next.js (melhora gritante de performance).

---

## 5. Projetos de IA e NLP

### 5.1 Google AI SDK (@google/genai)
- **Projeto:** Pacote oficial para a API Gemini.
- **Como Integrar:** Configuração no backend edge functions do Vercel, suportando Streaming de relatórios para não deixar a interface bloqueada (UI responsiva). Suporte essencial para "JSON mode".
- **Exemplo de Uso no AthleteOS:**
  ```typescript
  import { GoogleGenAI } from '@google/genai';
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  // Prompt de Insights de Jogador forçando retorno Estruturado
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: 'Analise o bem-estar deste atleta. Retorne em JSON...',
    config: {
      responseMimeType: 'application/json',
      // Passar o schema para forçar propriedades
    }
  });
  ```

### 5.2 LangChain.js (Opcional)
- **Quando usar:** Langchain deve ser evitado para prompts simples (over-engineering). Só integraremos a Langchain SE construirmos um **Agente Autônomo** (que decide buscar mais dados, analisar e criar rotinas iterativamente) ou se fizermos RAG complexo no banco vetorial de manuais do time (`pgvector` no Supabase). Para sumários normais, uso direto da API é superior.

---

## 6. Projetos de Automação

### 6.1 Evolution API
- **Nome e URL:** [EvolutionAPI/evolution-api](https://github.com/EvolutionAPI/evolution-api)
- **O que faz:** API WhatsApp (via WhatsApp Web em servidor).
- **Como integrar:** Permite automatizar lembretes para os jovens responderem o RPE, questionário diário e enviar resumos de relatórios (pdfs/IA) aos pais e técnicos pelo canal de maior adoção (WhatsApp).

### 6.2 node-cron
- **Como integrar:** Para rodar funções programadas diretamente no Edge/Server caso não queiramos levantar toda a infraestrutura complexa do **n8n** para uma simples tarefa diária ("Calcular ACWR diário de todos os jogadores meia-noite").

---

## 7. Projetos de Ciência do Esporte

*(Obs: Muitos destes não são repositórios de software em si, mas algoritmos de domínio público de ciências biológicas que traduziremos para código TypeScript interno).*

### 7.1 ACWR Calculation Libraries
- **Fórmulas:** Cálculo da Carga Aguda vs Carga Crônica. Utilizaremos preferencialmente o método EWMA (Exponentially Weighted Moving Average) por ser cientificamente mais preciso.
- **Integração:** Criaremos uma classe TypeScript `/utils/sport-science/acwr.ts` que recebe os sRPEs dos últimos 28 dias e calcula o coeficiente matemático. Não vamos importar pacotes duvidosos, faremos _in-house_.

### 7.2 PHV (Peak Height Velocity) Calculators
- **Fórmulas:** Equação de Mirwald ou Método Khamis-Roche (Predição de altura adulta e maturação).
- **Integração:** Ponto crucial para futebol de base (sub-12 a sub-17). Traduziremos a fórmula e referências científicas para uma utilidade TS que estimará se um atleta atingiu o pico de estirão de crescimento (para evitar lesões severas ou ajustar expectativas de ganho muscular).

### 7.3 sRPE (Session RPE) Standards
- **Fórmulas:** Método sRPE de Foster (Minutos da sessão x Avaliação de esforço [0-10]).
- **Integração:** A lógica é simples, o segredo será criar as Categorias Baseadas em Zonas: Recuperação, Manutenção e Zona de Risco (Overreaching), cruzando a carga da sessão com a "monotonia de treino".

---

## 8. Templates e Starters

### 8.1 Next.js + Supabase Starter
- **URL:** [vercel/nextjs-subscription-payments](https://github.com/vercel/nextjs-subscription-payments) ou o repositório base `with-supabase`.
- **Como lidar:** Extrairemos o *boilerplate* da conexão Auth + RLS policies + middlewares, o que nos poupará 2 semanas inteiras configurando sessão de cookies segura. Mudaremos as tabelas para nossos domínios (Teams, Players, Sessions em vez de Subscriptions).

### 8.2 Turborepo Starter
- **URL:** [vercel/turbo](https://github.com/vercel/turbo)
- **O que aproveitar:** Usaremos um Monorepo caso a plataforma de vídeo python (Microserviço AI) precise conviver no mesmo repositório do frontend web e um possível app Expo (Mobile futuro). O Turborepo lidará com cache e buid pipelines velozes.

---

## 9. Mapa de Dependências

Este será o espqueleto base do nosso `package.json` principal (Aplicações Frontend + Integrações Centrais):

```json
{
  "dependencies": {
    // Next.js & React Core
    "next": "^15.x",
    "react": "^19.x",
    "react-dom": "^19.x",
    
    // Auth & Backend via Supabase
    "@supabase/supabase-js": "^2.39.0",
    "@supabase/ssr": "^0.1.0",
    
    // AI Integration
    "@google/genai": "^0.1.1",
    
    // UI, Gráficos & Estilos
    "recharts": "^2.10.3",
    "tailwindcss": "^3.4.1", // ou 4.0 se estável
    "lucide-react": "^0.320.0", // Ícones elegantes
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "date-fns": "^3.3.1", // Manipulação temporal
    
    // Forms & Validação
    "react-hook-form": "^7.50.0",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.4"
  }
}
```
*Notas de Compatibilidade:* Sempre travar versões de Next, React e `@google/genai` (strict versions ou acento circunflexo seguro) para evitar atualizações menores (minor updates) quebrem em produção devido às constantes inovações no ecossistema App Router.

---

## 10. Licenças e Compliance

Matriz de compatibilidade para tranquilidade legal no lado de monetização do AthleteOS (plataforma B2B/B2C).

| Projeto/Biblioteca | Licença | Uso Comercial Permitido? | Modificações Proprietárias? | Requer Atribuição? | Risco |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Next.js / React | MIT | ✅ Sim | ✅ Sim | ➖ Não estrita | Baixíssimo |
| Shadcn/UI | MIT | ✅ Sim | ✅ Sim | ➖ Não estrita | Baixíssimo |
| Recharts | MIT | ✅ Sim | ✅ Sim | ➖ Não estrita | Baixíssimo |
| Supabase (Clients) | Apache 2.0 | ✅ Sim | ✅ Sim | ➖ Não estrita | Baixíssimo |
| YOLOv8 (Ultralytics) | **AGPL-3.0** / Comercial | ⚠️ **CUIDADO** | ❌ **NÃO**, exceto se o backend for open-source | ✅ Sim, e contamina projeto | **ALTO**. Deve rodar isoladamente como API separada ou adquirir licença corporativa Ultralytics. |
| StatsBomb Data | CC-BY | ❌ Não-comercial | ✅ Sim | ✅ Sim, obrigatória | Médio (Usar *apenas* como inspiração do schema, não vender os dados). |

**Ação de Conformidade:** A única grande bandeira vermelha está no uso do pacote Ultralytics/YOLOv8 para o rastreamento de jogadores (Item 2.5). Sob licença AGPL, não podemos embuti-lo em um pacote distribuível, mas é tolerado se roda como um Software-as-a-Service (embora o risco varie). Idealmente, criar uma infraestrutura que interaja puramente via API remota com a instância que roda o YOLO, ou buscar alternativas MIT como o OpenCV puro ou modelos YOLO antigos (YOLOv5 em PyTorch puro sob MIT) dependendo do budget disponível.

---

*Documento gerado como parte da AthleteOS Engineering Bible. Volume 7 de 10 — Integrações Open Source. AthleteOS © 2026*
