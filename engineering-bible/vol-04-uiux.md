# 📕 AthleteOS Engineering Bible
# Volume 4 — UI/UX

## 1. Design System

### 1.1 Filosofia de Design
A filosofia de design do AthleteOS é centrada em uma experiência **premium, dark-first, esportiva e moderna**. 
- **Mobile-first**: O atleta, nosso usuário principal diário, consome a plataforma primariamente em dispositivos móveis (Android). A interface deve parecer um aplicativo nativo no navegador.
- **Data-dense**: Para treinadores e olheiros, a densidade de dados é crucial. Telas de desktop devem maximizar a informação sem parecerem desorganizadas.
- **Motivador e Engajante**: Para os adolescentes (13-17 anos), o design deve evocar a estética de jogos de videogame e plataformas de e-sports, incentivando o engajamento diário e a gamificação do próprio desenvolvimento.

### 1.2 Paleta de Cores
O sistema de cores utiliza variáveis CSS no root para suportar o tema dark padrão.

```css
:root {
  /* Fundo e Superfícies */
  --bg-main: #0B0F19; /* Deep navy */
  --surface-main: #1E293B; /* Slate */
  --surface-hover: #334155;
  --border-subtle: #334155;

  /* Cores de Marca e Ação */
  --primary: #2563EB; /* Electric blue - CTAs principais */
  --primary-hover: #1D4ED8;
  
  /* Status e Semântica */
  --success: #10B981; /* Emerald green - Wellness positivo, sucesso */
  --warning: #F59E0B; /* Amber - Alertas, atenção */
  --danger: #F43F5E; /* Rose - Risco, erro, lesão */
  
  /* Tipografia */
  --text-primary: #F8FAFC;
  --text-secondary: #94A3B8;
  --text-muted: #64748B;
  
  /* Zonas ACWR */
  --acwr-danger-low: #3B82F6; /* Azul (Destreinamento) < 0.8 */
  --acwr-sweet-spot: #10B981; /* Verde (Zona Ideal) 0.8 - 1.3 */
  --acwr-danger-zone: #F59E0B; /* Amarelo (Risco Moderado) 1.3 - 1.5 */
  --acwr-danger-high: #F43F5E; /* Vermelho (Risco Alto) > 1.5 */

  /* Wellness (1-5) */
  --wellness-1: #F43F5E; /* Vermelho (Péssimo) */
  --wellness-2: #F97316; /* Laranja (Ruim) */
  --wellness-3: #F59E0B; /* Amarelo (Normal) */
  --wellness-4: #84CC16; /* Verde limão (Bom) */
  --wellness-5: #10B981; /* Verde esmeralda (Excelente) */
}
```

### 1.3 Tipografia
- **Font Family**: Inter (Google Fonts) para garantir legibilidade impecável e um visual moderno e clean.
- **Escala (Tailwind classes)**:
  - `text-xs`: 12px (labels secundários, meta dados)
  - `text-sm`: 14px (texto auxiliar)
  - `text-base`: 16px (corpo de texto principal)
  - `text-lg`: 18px (destaques sutis)
  - `text-xl`: 20px (títulos de cards)
  - `text-2xl`: 24px (títulos de seção)
  - `text-3xl`: 30px (títulos de página)
  - `text-4xl`: 36px (números hero de KPIs)
- **Pesos (Weights)**:
  - `font-normal` (400): Corpo do texto.
  - `font-medium` (500): Labels de botões e formulários.
  - `font-semibold` (600): Headings e títulos.
  - `font-bold` (700): Valores de KPIs e Hero sections.

### 1.4 Espaçamento
Baseado em uma grid de 4px, alinhado com o Tailwind:
- `1` (4px), `2` (8px), `3` (12px), `4` (16px), `5` (20px), `6` (24px), `8` (32px), `10` (40px), `12` (48px)

### 1.5 Border Radius
Cantos arredondados, mas estruturados:
- `sm`: 6px (inputs, badges pequenos)
- `md`: 8px (cards menores, botões)
- `lg`: 12px (cards principais, modais)
- `xl`: 16px (elementos hero, painéis)
- `full`: 9999px (avatares, pílulas, botões circulares)

### 1.6 Sombras
Utilizadas primariamente para elevação em um ambiente dark e para indicar foco/interação:
- `sm`: Para dropdowns sutis.
- `md`: Para cards principais e modais.
- `lg`: Para o FAB (Floating Action Button) e modais em destaque.
- `glow`: Sombra colorida difusa para botões primários em estado de hover ou elementos críticos (ex: `box-shadow: 0 0 15px rgba(37, 99, 235, 0.4)`).

### 1.7 Animações e Micro-interações
- **Transições de Página**: Fade-in suave de 200ms.
- **Card Hover**: `transform: translateY(-2px)` com incremento sutil na borda (`border-subtle` para `border-white/20`).
- **Botões**: Efeito de "press" (`scale-95`) ao clicar.
- **Loading**: Esqueletos (Skeleton screens) pulsantes em tom slate para carregamento de dados.
- **KPIs**: Animação de "count-up" numérico para engajar o usuário ao abrir dashboards.
- **Sidebar**: Slide-in/slide-out suave (300ms, ease-in-out) para mobile.

### 1.8 Componentes Base (Shadcn/UI Customizado)
- **Button**: Cantos `md`. Variantes: `primary` (fundo Electric Blue), `secondary` (fundo Slate), `ghost` (fundo transparente, texto Hover), `danger` (fundo Rose). Alturas: `sm` (32px), `default` (40px), `lg` (48px).
- **Card**: Fundo `surface-main`, borda `border-subtle`, radius `lg`. Dividido estruturalmente em Header, Body e Footer.
- **Input/Select/Textarea**: Fundo escuro (mais escuro que o card, ex: `#0F172A`), borda sutil. Focus ring na cor `primary`.
- **Badge**: Pílulas (`rounded-full`) para status. Variantes semânticas (sucesso, aviso, perigo).
- **Dialog/Modal**: Centralizado, overlay semi-transparente (`bg-black/80` com backdrop blur).
- **Avatar**: Circular (`rounded-full`), fallback com iniciais estilizadas.
- **Slider**: Barra de progresso grossa (8px), thumb proeminente (24px) para toque mobile. Cores dinâmicas para Wellness.
- **Skeleton**: Componente base com classe `animate-pulse` e cor `surface-hover`.

### 1.9 Iconografia
- **Lucide Icons**: Conjunto padrão por sua consistência e traços precisos.
- **Personalizados**: Ícones esportivos específicos (ex: chuteira, campo, prancheta tática) onde o Lucide não cobrir adequadamente.
- **Emojis**: Utilizados proeminentemente nas telas de Wellness (faces de humor) por serem universais e instantaneamente reconhecíveis pelos jovens.

---

## 2. Telas do Atleta

### 2.1 Login / Registro
- **Layout**: Full-page, background dark (`bg-main`) com um gradiente animado muito sutil e escuro ao fundo.
- **Centro**: Card principal (`max-w-md`) centralizado horizontal e verticalmente.
- **Conteúdo**: Logo AthleteOS em destaque. Formulário de Email e Senha limpo.
- **OAuth**: Botão grande e proeminente "Continuar com o Google".
- **Registro**: Seletor de Role (Atleta, Treinador, Olheiro) visual, com cards clicáveis contendo o ícone da função.
- **Toggle**: Link discreto "Não tem conta? Registre-se" no rodapé do card.

### 2.2 Dashboard Home (Atleta)
**Grid Layout (Mobile)**
```text
[ Cabeçalho: "Fala, Thomas! 👊" | Sino ]
[ Wellness Status Card (CTA ou Emoji) ]
[ KPI 1: Jogos ] [ KPI 2: Nota ]
[ KPI 3: Minutos ] [ KPI 4: ACWR ]
[ Card Último Jogo (Oponente, Placar) ]
[ Gráfico Evolução (Notas)          ]
[ Lista de Alertas (se houver)      ]
                    ( FAB + Menu )
[ Tab Bar Inferior                  ]
```
- **Header**: Texto engajador e direto.
- **KPI Row**: Grid 2x2. Cartões pequenos com valor em texto grande (count-up). Seta de tendência (ex: `↑ 12%`).
- **Último Jogo**: Resumo rápido. Inclui um badge do status do relatório de IA. Botão secundário "Ver Relatório".
- **Gráfico de Evolução**: Line chart simples, limpo. Eixo X oculto ou simplificado. Interativo ao tocar.
- **Wellness**: Se não preenchido hoje, exibe um banner chamativo colorido (ex: `bg-primary/20` com borda `primary`) para incentivar o check-in.
- **FAB (Quick Actions)**: Botão circular grande flutuante no canto inferior direito. Ao clicar, expande 3 opções: "Registrar Jogo", "Registrar Treino", "Check-in Wellness".

### 2.3 Partidas

#### Lista de Partidas
- **Filtros**: Barra horizontal com chips roláveis para filtrar.
- **Lista**: Cards empilhados. Cada card mostra a data, escudo do adversário (ou ícone padrão), minutos jogados, e a Nota do jogador colorida de acordo com o desempenho (verde para >7, etc).
- **Empty State**: Ilustração vetorial de um campo vazio + texto motivacional + CTA "Registre sua primeira partida".

#### Registro de Partida
- Formulário em página única, otimizado para scroll no celular.
- **Rating**: Seletor iterativo. Em vez de dropdown, botões grandes ou um slider de 1 a 10 com feedback visual em tempo real (cor mudando).
- **Submissão**: Botão primário longo ocupando 100% da largura. Estado de loading (`spinner` + texto "Processando...").

#### Detalhe da Partida
- **Hero**: Header imponente. Fundo com padrão sutil de campo. Nome do oponente em destaque. Nota do jogador em círculo brilhante.
- **Resumo**: Grid de estatísticas (minutos, gols, assistências, etc).
- **Relatório de IA**: Três cards com bordas sutis das cores de status. 
  - 🟢 Pontos Fortes
  - 🟡 Áreas de Melhoria
  - 🔵 Foco para Treinamento

### 2.4 Treinos

#### Lista de Treinos
- Toggle simples: Visão Calendário (quadrados de dias) ou Visão Lista.
- Cada entrada exibe o tipo de treino (Físico, Tático, Técnico) através de ícone/cor e a sRPE.

#### Registro de Treino
- Formulário simples. Destaca-se o **Slider de RPE** (Borg CR10): 1 a 10, de verde a vermelho, com carinhas de emoji (sorriso a exausto).
- Exibição do cálculo automático de sRPE ao vivo na tela enquanto ajusta duração/RPE.

#### ACWR Dashboard (Carga de Trabalho)
- **Indicador Principal**: Número do ACWR (ex: `1.2`) centralizado em um componente de Gauge (semicírculo). A cor do número e da barra acompanha a zona semântica.
- **Gráfico**: Line chart da proporção aguda/crônica, com o "sweet spot" (0.8-1.3) destacado em um background sombreado no gráfico.

### 2.5 Wellness

#### Check-in Form
- Telas rápidas. O objetivo é completar em < 60 segundos.
- Lista vertical de 5 sliders, cada um de 1 a 5.
- Etiquetas claras. **Atenção à inversão de escala**: Para dor e estresse, 5 é bom (sem dor/estresse), 1 é ruim. Interface deve refletir isso visualmente (Verde no 5, Vermelho no 1).
- Botão CTA gigantesco "Salvar Check-in" no final.

#### Wellness Dashboard
- **Heatmap**: Calendário no estilo GitHub (quadradinhos coloridos). Verde para dias bons, vermelho para dias ruins, cinza escuro para dias não preenchidos.
- Gráficos de linha mostrando a evolução de cada dimensão ao longo do tempo.

### 2.6 Perfil do Atleta
- **Hero**: Avatar centralizado e grande. Ícone de câmera no canto para alterar.
- **Campos Pessoais**: Layout em lista com labels superiores. 
- **Bio**: Textarea expansível.
- **Link Público**: Botão fantasma com ícone de link externo "Ver Portfólio Público".

### 2.7 Configurações
- Layout padrão de ajustes de app nativo (listas agrupadas com separadores).
- Switches para preferências de notificação (Push/Email).
- Seção de Zona de Perigo (botão de deletar conta na cor `danger`).

---

## 3. Portfólio Público
- **Acesso**: `/athlete/{slug}`, público sem auth.
- **Aparência**: Design mais impressionante e cinemático. Uso intenso de fundos negros puros e destaques em `primary`. Deve parecer um "cartão de visita do futuro".
- **Hero Section**: Foto grande (se disponível), tipografia display pesada para o nome, badges de posição e clube atual.
- **Stats Grid**: Blocos sólidos `surface-main` com estatísticas chave, usando ícones premium.
- **Radar Chart**: Gráfico tipo "FIFA" / Football Manager demonstrando as 4 dimensões (Técnica, Tática, Física, Mental). Usa `Recharts`. Polígono preenchido com a cor primária e opacidade 40%.
- **Vídeos**: Player embutido elegante.
- **CTA**: Botão proeminente "Interessado neste atleta" ancorado na base da tela (mobile) ou visível no header (desktop), abrindo um modal simples de contato.
- SEO totalmente configurado.

---

## 4. Telas do Treinador

### 4.1 Dashboard do Treinador
- Otimizado para desktop e tablet (landscape).
- **Overview de Elenco**: Tabela rica ou Grid de cards compactos.
- **Avatar + Nome**.
- **Semáforo de Wellness**: Bolinhas coloridas ao lado do nome resumindo o estado do dia.
- **Badge ACWR**: Etiqueta com valor numérico e cor correspondente.
- **Risk Matrix**: Seção de destaques classificando automaticamente atletas em "Risco Alto", "Risco Moderado" e "Prontos".

### 4.2 Planejamento
- Visão de calendário semanal de segunda a domingo.
- Colunas por dia. Blocos de treino com Drag & Drop para reorganizar.

### 4.3 PID (Plano Individual)
- Interface de formulário estruturado para definir metas.
- Barras de progresso preenchidas parcialmente representando acompanhamento.

---

## 5. Telas do Olheiro

### 5.1 Busca de Atletas
- **Layout**: Sidebar de filtros complexos à esquerda (desktop). Grid de resultados à direita.
- **Filtros**: Comboboxes, Range Sliders (Idade, Nota).
- **Cards de Resultado**: Compactos, com o mini Radar Chart embutido, pontuação geral da IA e metadados. Hover eleva o card.

### 5.2 Ficha de Avaliação
- Formulário privativo para anotações do olheiro.
- Sliders idênticos aos do portfólio, mas ajustáveis pelo olheiro para dar sua nota particular ao atleta.
- Campo longo para relatórios.

---

## 6. Componentes Reutilizáveis Customizados

- **RadarChart**: Baseado no `Recharts`. Eixos limpos, sem bordas externas pesadas. Cores dinâmicas, tooltip on hover exibindo os valores numéricos.
- **MatchCard**: Card de uso geral. Props: `opponentName`, `score`, `rating`, `date`, `aiStatus`. Responsivo (se expande em linhas no desktop).
- **WellnessSlider**: Customização radical do input range nativo. O `thumb` contém um emoji que muda com base no valor (1=😭, 3=😐, 5=🤩). Pista colorida gradualmente.
- **ACWRGauge**: SVG customizado ou D3.js. Arco de 180 graus. Agulha indicadora e zonas coloridas pintadas no arco.
- **KPICard**: Props: `title`, `value`, `icon`, `trendValue`.
- **AIReportCard**: Design tipográfico rico. Fundo com transparência colorida indicando o sentimento geral do bloco (verde para elogios, amarelo para foco).
- **LoadChart**: `Recharts` ComposedChart. Linhas para carga aguda, barras para carga diária, `ReferenceArea` para a zona ideal (sweet spot).
- **WellnessHeatmap**: Baseado em CSS Grid. Quadrados (365/90) com opacidades variando conforme o score de wellness.
- **QuickActionFAB**: Botão fixo `bottom-20 right-6` (para não cobrir a tab bar). Animação radial ao expandir.

---

## 7. Navegação e Layout

- **Desktop (>1024px)**: Sidebar permanente à esquerda. Ícones + Labels claros. Header com breadcrumbs no topo.
- **Mobile (<768px)**: Bottom Tab Bar fixa com 5 rotas principais (Dashboard, Partidas, Treinos, Wellness, Perfil). Esconde links secundários no menu Hambúrguer do header ou no Perfil.
- O FAB fica flutuando acima da Tab Bar no mobile.

---

## 8. Responsividade

- A aplicação usa as breakpoints padrões do Tailwind: `sm (640px)`, `md (768px)`, `lg (1024px)`.
- Telas densas de dados (Treinadores) alternam de Tabelas no Desktop para visualização em Lista de Cards expandíveis (Accordion) no mobile para evitar overflow horizontal.

---

## 9. Estados Especiais

- **Empty States**: Páginas não podem ficar vazias. Sempre exibir uma arte vetorial leve, uma mensagem em texto e um botão de ação primária (ex: "Criar Avaliação").
- **Loading Skeletons**: Utilizados no Dashboard e Perfil. Mantém a estrutura da página visualmente enquanto a API responde.
- **Offline**: Toast permanente laranja no topo: "Sem conexão de internet. Algumas funções estão desativadas."
- **Onboarding**: Primeiro acesso abre um modal em tela cheia com 3 passos simples apresentando as features ("Registre treinos", "Acompanhe jogos", "Seu Portfólio").

---

## 10. Acessibilidade (A11y)

- **Contraste**: Validação de taxa WCAG AA. O azul primário sobre o fundo dark garante excelente contraste. Textos de placeholder usam `text-muted` que atinge no mínimo 4.5:1.
- **Foco**: O `focus-ring` (anel de foco) nunca deve ser desativado via CSS globalmente. Utilizar `focus:ring-primary` do Tailwind para navegação por teclado fluida.
- **Touch Targets**: No mobile, botões e links interativos devem ter no mínimo 44x44px.
- **Aria Labels**: Todos os botões apenas com ícone (ex: Sino de notificação, FAB) possuem `aria-label` descritivo explícito no código.

---
*Documento gerado como parte da AthleteOS Engineering Bible. Volume 4 de 10 — UI/UX. AthleteOS © 2026*
