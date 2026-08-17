# 📓 AthleteOS Engineering Bible
# Volume 5 — Inteligência Artificial

## 1. Estratégia de IA

A Inteligência Artificial no AthleteOS não é apenas um recurso isolado; ela permeia toda a plataforma, atuando como o motor de inteligência que processa dados e gera insights acionáveis. Nossa estratégia baseia-se nos seguintes pilares:

*   **Assistente, Não Substituto:** A IA atua como uma ferramenta para potencializar o trabalho de treinadores e o desenvolvimento de atletas, nunca substituindo o julgamento humano. Ela aponta tendências e oferece sugestões que devem ser validadas pelos profissionais envolvidos.
*   **IA Responsável para Menores:** Como nossos usuários finais são jovens de 13 a 17 anos, a comunicação da IA deve ser sempre construtiva, motivacional e adequada à idade. Evitamos tons excessivamente críticos ou que gerem pressão desnecessária. O foco está no desenvolvimento, no aprendizado e no esforço (Growth Mindset).
*   **Privacidade de Dados:** Os dados de saúde, desempenho e estado psicológico de menores são extremamente sensíveis. A IA processa esses dados de forma segura via APIs da Google Cloud, sem utilizá-los para o treinamento público de modelos (sem fine-tuning com dados de clientes). A transparência é total: o usuário sempre sabe quando o conteúdo foi gerado por IA.

## 2. Modelos e Seleção

### Modelo por Caso de Uso

Utilizamos a stack do Google Gemini, selecionando o modelo mais adequado em termos de custo, velocidade e capacidade de raciocínio para cada tarefa.

| Caso de Uso | Modelo | Justificativa | Custo Estimado |
| :--- | :--- | :--- | :--- |
| **Análise pós-jogo** | `gemini-2.0-flash` | Equilíbrio perfeito entre velocidade e inteligência para estruturar dados textuais. | Baixo |
| **Feedback comportamental** | `gemini-2.0-flash` | Capacidade de empatia e geração de texto rápido e adequado ao tom exigido. | Baixo |
| **Resumo semanal** | `gemini-2.0-flash` | Rápido para agregar múltiplos pontos de dados de uma semana. | Baixo |
| **Relatório mensal** | `gemini-1.5-pro` | Necessita de uma janela de contexto maior e raciocínio profundo para comparar tendências longas. | Médio/Alto |
| **Consultas RAG** | `gemini-2.0-flash-lite` | Ideal para tarefas simples de recuperação e resposta rápida (baixa latência e baixo custo). | Muito Baixo |
| **Sugestões de treino** | `gemini-2.0-flash` | Rápido e capaz de cruzar deficiências apontadas com catálogos de exercícios. | Baixo |

### Estimativa de Custos Mensais (Projeção)

*Cálculos baseados em estimativas médias de tokens de entrada e saída (API).*

*   **Usuário Único (1 Atleta):** ~$0.15 a $0.30 / mês
*   **Time Pequeno (10 Atletas):** ~$1.50 a $3.00 / mês
*   **Categoria/Clube Base (100 Atletas):** ~$15.00 a $30.00 / mês

## 3. Catálogo Completo de Prompts

### 3.1 Prompt: Análise Técnica Pós-Jogo

*   **Propósito:** Transformar as observações brutas do atleta pós-partida em uma análise estruturada de desempenho técnico e físico.
*   **Variáveis de Entrada:** `athlete_name` (string), `position` (string), `category` (string), `club` (string), `opponent` (string), `minutes_played` (number), `self_rating` (number 1-10), `positive_points` (string), `improvement_points` (string), `emotional_note` (string).
*   **Prompt Text:**
    ```text
    Você é um analista técnico de futebol experiente e construtivo, trabalhando na plataforma AthleteOS. 
    Seu objetivo é analisar o relato pós-jogo do atleta {{athlete_name}}, que joga na posição de {{position}} pelo time {{club}} (Categoria: {{category}}).
    
    Detalhes da Partida:
    - Oponente: {{opponent}}
    - Minutos jogados: {{minutes_played}}
    - Autoavaliação do atleta (1-10): {{self_rating}}
    - Pontos positivos relatados: "{{positive_points}}"
    - Pontos a melhorar relatados: "{{improvement_points}}"
    - Nota emocional/Como se sentiu: "{{emotional_note}}"
    
    Analise os dados e retorne EXCLUSIVAMENTE um objeto JSON válido, sem formatação markdown e sem texto adicional, com a seguinte estrutura e tipos correspondentes ao schema solicitado. Mantenha um tom profissional, analítico e preciso.
    {
      "strengths": ["Ponto forte 1", "Ponto forte 2"],
      "improvements": ["Área a melhorar 1", "Área a melhorar 2"],
      "training_focus": ["Foco de treino 1"],
      "technical_analysis": "Análise técnica detalhada...",
      "physical_analysis": "Análise física percebida...",
      "score": 7.5
    }
    ```
*   **Exemplo de Entrada:**
    *   `athlete_name`: João Silva, `position`: Volante, `self_rating`: 7, `positive_points`: Bons passes longos, desarmei muito. `improvement_points`: Cansei no final, perdi bola perigosa na saída.
*   **Exemplo de Saída:**
    ```json
    {
      "strengths": ["Eficiência nos passes longos", "Alto volume de desarmes no setor defensivo"],
      "improvements": ["Gestão de energia ao longo dos 90 minutos", "Segurança na posse de bola em zonas de risco"],
      "training_focus": ["Resistência aeróbica específica", "Tomada de decisão sob pressão na saída de bola"],
      "technical_analysis": "João demonstrou excelente visão de jogo com passes longos precisos e forte presença defensiva. A perda de bola na saída indica necessidade de maior controle sob pressão.",
      "physical_analysis": "O relato de cansaço na reta final indica a necessidade de melhor gestão de energia ou melhora no condicionamento específico para a posição.",
      "score": 7.0
    }
    ```
*   **Parâmetros:** `temperature: 0.2`, `response_mime_type: application/json`.
*   **Fallback:** Retornar os dados do usuário em um JSON básico sem insights avançados se o modelo falhar após retentativas.

### 3.2 Prompt: Feedback Comportamental Pós-Jogo

*   **Propósito:** Fornecer suporte mental, encorajamento e dicas baseadas na psicologia do esporte, focando no esforço e mentalidade de crescimento (Growth Mindset).
*   **Variáveis de Entrada:** Mesmas da 3.1 + `technical_analysis` (string, do output anterior).
*   **Prompt Text:**
    ```text
    Você é um psicólogo esportivo empático e motivador trabalhando no AthleteOS com o jovem atleta {{athlete_name}} (idade: 13-17 anos).
    Ele relatou o seguinte após o jogo contra {{opponent}}:
    - Nota emocional: "{{emotional_note}}"
    - Autoavaliação (1-10): {{self_rating}}
    - Pontos relatados: "{{positive_points}}" e "{{improvement_points}}"
    - Análise Técnica gerada pelo sistema: "{{technical_analysis}}"
    
    Forneça um feedback construtivo focado no aprendizado e no esforço (Growth Mindset). Faça referência direta ao que ele mencionou no relato. Não seja clichê, use uma linguagem direta, autêntica e adequada para jovens.
    
    Retorne EXCLUSIVAMENTE um objeto JSON válido, sem markdown:
    {
      "behavioral_feedback": "Texto de feedback analítico sobre a postura mental...",
      "mental_recommendations": ["Dica prática 1", "Dica prática 2"],
      "motivation_message": "Mensagem curta, direta e encorajadora",
      "growth_mindset_tip": "Conceito de mentalidade de crescimento aplicável à situação"
    }
    ```
*   **Parâmetros:** `temperature: 0.6` (Para maior empatia e naturalidade do texto).
*   **Fallback:** Mensagem motivacional padrão genérica ("Continue focado no seu desenvolvimento e descanse para o próximo treino!").

### 3.3 Prompt: Relatório Semanal

*   **Propósito:** Consolidar uma semana de treinos, jogos e dados de wellness em uma visão geral equilibrada.
*   **Variáveis de Entrada:** `week_data_array` (JSON array em string detalhando eventos).
*   **Prompt Text:**
    ```text
    Você é o coordenador de desenvolvimento técnico do AthleteOS. Avalie a semana de {{athlete_name}} com base nestes dados consolidados:
    {{week_data_array}}
    
    Seu tom deve ser equilibrado e focado na visão geral da semana. 
    Retorne EXCLUSIVAMENTE um objeto JSON válido:
    {
      "week_summary": "Resumo geral da semana, integrando jogos, treinos e wellness...",
      "highlights": ["Destaque da semana 1", "Destaque da semana 2"],
      "concerns": ["Preocupação (se houver, senão array vazio)"],
      "recommendations": ["Recomendação prática 1"],
      "load_assessment": "Texto avaliando a carga acumulada",
      "wellness_trend": "positive | stable | negative"
    }
    ```
*   **Parâmetros:** `temperature: 0.3`.

### 3.4 Prompt: Relatório Mensal de Evolução

*   **Propósito:** Celebrar conquistas, apontar lacunas e planejar o próximo mês comparando os dados atuais com o mês anterior.
*   **Variáveis de Entrada:** `current_month_data` (JSON string), `previous_month_data` (JSON string).
*   **Prompt Text:**
    ```text
    Você é um diretor de desenvolvimento de talentos no AthleteOS analisando o mês de {{athlete_name}}.
    Mês atual: {{current_month_data}}
    Mês anterior: {{previous_month_data}}
    
    Comemore o progresso de forma entusiasmada, mas seja construtivo e objetivo em relação às lacunas de desenvolvimento.
    Retorne EXCLUSIVAMENTE um JSON válido:
    {
      "evolution_summary": "Visão geral das melhorias e mudanças de um mês para o outro...",
      "biggest_improvement": "A principal habilidade ou métrica que evoluiu",
      "area_needing_work": "A principal área que ainda precisa de foco",
      "month_comparison": {"minutes_played": "+45", "average_score": "+0.5"},
      "next_month_goals": ["Meta clara 1", "Meta clara 2"],
      "motivation_message": "Mensagem final inspiradora"
    }
    ```
*   **Parâmetros:** `temperature: 0.4`. (Neste caso específico, usa-se o `gemini-1.5-pro` devido ao contexto longo).

### 3.5 Prompt: Sugestão de Foco de Treino

*   **Propósito:** Traduzir as deficiências recentes em recomendações práticas de exercícios para o treinador.
*   **Variáveis de Entrada:** `recent_analyses` (JSON string), `current_weaknesses` (array de strings), `acwr_data` (dados de carga aguda crônica).
*   **Prompt Text:**
    ```text
    Como um assistente de comissão técnica do AthleteOS, crie um plano de foco de treino.
    Atleta: {{athlete_name}}
    Análises recentes: {{recent_analyses}}
    Pontos fracos atuais: {{current_weaknesses}}
    Estado de carga (ACWR): {{acwr_data}}
    
    O tom deve ser altamente técnico e voltado para o treinador.
    Retorne EXCLUSIVAMENTE JSON válido:
    {
      "suggested_drills": ["Nome/Tipo do exercício 1", "Nome/Tipo do exercício 2"],
      "focus_areas": ["Tática", "Física", etc],
      "intensity_recommendation": "Alta | Média | Baixa | Recuperativa (baseado estritamente no ACWR)",
      "rationale": "Justificativa técnica explicando o porquê destas escolhas"
    }
    ```
*   **Parâmetros:** `temperature: 0.2`.

### 3.6 Prompt: Análise de Tendência (RAG-enhanced)

*   **Propósito:** Responder perguntas diretas do atleta, consultando o banco de dados vetorial de seus relatórios anteriores.
*   **Variáveis de Entrada:** `user_question` (string), `retrieved_context` (string).
*   **Prompt Text:**
    ```text
    Você é o assistente pessoal de futebol de {{athlete_name}}.
    Pergunta do atleta: "{{user_question}}"
    Contexto recuperado de relatórios passados:
    {{retrieved_context}}
    
    Responda à pergunta baseando-se APENAS no contexto fornecido. Mantenha um tom amigável. Se os dados não responderem a pergunta, diga honestamente que não há registros suficientes.
    
    Retorne EXCLUSIVAMENTE JSON:
    {
      "answer": "Sua resposta direta...",
      "supporting_data": ["Citação do contexto 1", "Citação do contexto 2"],
      "confidence_level": "High | Medium | Low"
    }
    ```
*   **Parâmetros:** `temperature: 0.1` (Evita alucinações fora do contexto do RAG).
*   **Exemplos de Pergunta:** "Como joguei contra times grandes?", "Minha resistência melhorou no último mês?"

## 4. Output Schemas (Zod)

```typescript
import { z } from 'zod';

export const PostMatchAnalysisSchema = z.object({
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  training_focus: z.array(z.string()),
  technical_analysis: z.string(),
  physical_analysis: z.string(),
  score: z.number().min(0).max(10)
});

export const BehavioralFeedbackSchema = z.object({
  behavioral_feedback: z.string(),
  mental_recommendations: z.array(z.string()),
  motivation_message: z.string(),
  growth_mindset_tip: z.string()
});

export const WeeklyReportSchema = z.object({
  week_summary: z.string(),
  highlights: z.array(z.string()),
  concerns: z.array(z.string()),
  recommendations: z.array(z.string()),
  load_assessment: z.string(),
  wellness_trend: z.enum(['positive', 'stable', 'negative'])
});

export const MonthlyEvolutionSchema = z.object({
  evolution_summary: z.string(),
  biggest_improvement: z.string(),
  area_needing_work: z.string(),
  month_comparison: z.record(z.any()), // Flexível para lidar com as chaves variadas
  next_month_goals: z.array(z.string()),
  motivation_message: z.string()
});

export const TrainingFocusSchema = z.object({
  suggested_drills: z.array(z.string()),
  focus_areas: z.array(z.string()),
  intensity_recommendation: z.string(),
  rationale: z.string()
});

export const RAGQuerySchema = z.object({
  answer: z.string(),
  supporting_data: z.array(z.string()),
  confidence_level: z.enum(['High', 'Medium', 'Low'])
});
```

## 5. Agentes de IA

A inteligência da plataforma é compartimentada em diferentes "personas" para garantir adequação ao contexto de cada output.

### 5.1 Agente Analista Técnico
*   **Papel:** Especialista tático, voltado a fundamentos do esporte e desempenho puramente técnico. Objetivo, calcado em fatos.
*   **Restrições:** Avalia apenas ações em campo. Jamais emite juízos de valor sobre o caráter ou a atitude pessoal.
*   **Ferramentas:** Histórico de eventos de jogo, estatísticas (gols, desarmes), notas de treinadores passadas.
*   **System Prompt Base:** "Você é um analista de desempenho técnico do AthleteOS, focado apenas em ações do jogo, tática e física."

### 5.2 Agente Psicólogo Esportivo
*   **Papel:** Suporte emocional. Atua na construção de confiança, resiliência e foco (Growth Mindset).
*   **Restrições:** Estritamente proibido oferecer conselhos de saúde mental clínica ou diagnósticos. Nunca gera pressão de performance.
*   **Considerações Éticas para Menores:** Se houver indícios de exaustão severa, burnout ou menções a dores crônicas, o agente é instruído a incluir: "Por favor, converse com seu responsável ou treinador sobre o que está sentindo. O descanso e sua saúde vêm sempre em primeiro lugar."

### 5.3 Agente de Scouting
*   **Papel:** Identificar talentos e progressões ao longo do tempo. Analisa tendências.
*   **Restrições:** Não compara diretamente os nomes de dois atletas da mesma equipe para o atleta final, focando apenas na comparação do atleta com ele mesmo no passado (ou com benchmarks genéricos de idade).
*   **Metodologia:** Observação longitudinal de dados mensais para identificar picos e quedas (Ex: "Aceleração constante nos últimos 3 meses").

## 6. RAG com pgvector

Para permitir consultas inteligentes ao histórico do atleta e contexto dinâmico, utilizamos a arquitetura RAG (Retrieval-Augmented Generation).

### 6.1 Arquitetura
*   **Conteúdo Indexado (Embeddings):** Relatórios de análise de partidas gerados anteriormente, anotações de treinos e resumos qualitativos de wellness.
*   **Modelo de Embedding:** Modelos da família `text-embedding-004` (Google).
*   **Dimensões:** 768 dimensões.
*   **Chunking Strategy:** Devido ao tamanho curto, cada relatório pós-jogo ou relatório semanal atua como um chunk individual. Textos mais longos seriam separados por cabeçalhos (ex: análise técnica vs mental).

### 6.2 Indexação
*   **Geração:** Ocorre assincronamente assim que o relatório de pós-jogo/semanal é salvo no Supabase (acionado via webhook para o n8n ou Edge Function).
*   **Metadados:** Junto ao vetor no banco PostgreSQL (pgvector), armazenamos: `athlete_id`, `date`, `document_type`, `tags_or_opponents`.
*   **Tipo de Índice:** `HNSW` (Hierarchical Navigable Small World) para performance de busca escalável em produção, superando o `IVFFlat` em recall e velocidade de consulta.

### 6.3 Retrieval
*   **Consultas de Similaridade:** Utiliza distância de cosseno ou produto interno (`<=>` no pgvector).
*   **Top-K:** Puxamos os top-5 ou top-10 chunks mais relevantes.
*   **Filtragem:** A regra de ouro (Hard Filter) no SQL é `WHERE athlete_id = 'user_id'`. Os embeddings jamais misturam dados de usuários. Filtros de tempo limitam buscas (ex: últimos 6 meses).
*   **Re-ranking:** Usamos filtragem baseada em recência (dados mais novos ganham bônus de relevância no algoritmo de consulta).

### 6.4 Generation
*   **Injeção de Contexto:** Os chunks recuperados são mapeados para strings e injetados na variável `{{retrieved_context}}` do prompt (ver 3.6).
*   **Gestão de Contexto:** O texto total injetado é truncado para se adequar facilmente na janela de tokens do `gemini-2.0-flash-lite`.
*   **Citações:** A IA é forçada (via prompt e Zod schema) a preencher o array `supporting_data` provando de qual parte do contexto tirou sua afirmação.

## 7. Pipeline de Processamento

O fluxo garante estabilidade, validação e recuperação de falhas.

```
Input do Atleta (Formulário)
  → Envio via webhook para middleware (Edge/n8n)
  → Validação inicial Zod (Entrada)
  → Prompt Construction (Injeção de variáveis)
  → Google Gemini API Call (Geração JSON estruturado)
  → Response Parsing (Validação Zod do JSON de saída)
  → Storage (Salvar dados no Supabase DB)
  → Disparo Assíncrono para Embedding (pgvector)
  → Push Notification enviada ao Atleta ("Sua análise chegou!")
  → Error Handling (Em caso de erro na API: Retry com Backoff. Se falhar: Fallback básico).
```

### 7.1 Implementação

Abaixo, exemplo do wrapper TypeScript que processa o pipeline de geração seguro.

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function processAIPipeline<T>(
  promptText: string, 
  schema: z.ZodSchema<T>, 
  modelName: string = 'gemini-2.0-flash',
  maxRetries: number = 3
): Promise<T> {
  const model = genAI.getGenerativeModel({ 
    model: modelName,
    generationConfig: { 
      responseMimeType: "application/json",
      temperature: 0.2
    }
  });

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Chamada a API
      const result = await model.generateContent(promptText);
      const textResponse = result.response.text();
      
      // Parse e validação do JSON via Zod
      const rawJson = JSON.parse(textResponse);
      const validatedData = schema.parse(rawJson);
      
      return validatedData; // Retorna tipado T se sucesso
      
    } catch (error) {
      console.warn(`[AI Pipeline] Tentativa ${attempt} falhou:`, error);
      
      if (attempt === maxRetries) {
        throw new Error("Pipeline IA falhou permanentemente após o número máximo de retentativas.");
      }
      
      // Exponential backoff delay (1s, 2s, 4s...)
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error("Unreachable state");
}
```

## 8. Gestão de Custos

*   **Tokens:** Média de 600 tokens totais (in+out) por análise pós-jogo usando `gemini-2.0-flash`.
*   **Estratégias de Otimização:** 
    *   Tarefas RAG muito pontuais ("Qual minha avaliação no último jogo?") rodam em `gemini-2.0-flash-lite`, minimizando custos quase a zero.
    *   Relatórios Mensais que requerem profundo cruzamento temporal rodam no modelo `pro`.
*   **Rate Limiting:** Implementado no Supabase/Edge Functions (ex: limite máximo de 3 relatórios pós-jogo gerados por dia por atleta para mitigar spam e proteger o orçamento).

## 9. Cache e Otimização

*   **Cache por Hashing:** Se as inputs principais (textos e notas do relatório) passarem por um Hash MD5 e forem idênticas nas últimas 24h (ex: usuário deu refresh forçado), devolvemos a resposta da tabela em vez de re-chamar o Gemini.
*   **Processamento em Lote:** O Relatório Semanal de todos os atletas não é feito ao vivo, mas via Cron Job no domingo à noite, distribuindo a carga de rede e simplificando limites de cota de API do GCP.
*   **Embeddings Pré-Computados:** Os vetores são gerados uma única vez na criação do registro e cacheados no Supabase.

## 10. Testes de IA

*   **Framework de Avaliação:** Temos um "Golden Dataset" de 30 relatórios simulados (diferentes posições e tons). Qualquer modificação num prompt da seção 3 exige rodar esse dataset e garantir que a saída atende às expectativas de formato e tom.
*   **Regressão:** A validação estrita via Zod no TypeScript atua como barreira imediata. Se o modelo "alucinar" o JSON mudando os tipos ou quebrando a sintaxe, os testes automatizados ou o Retry resolverão.
*   **Métricas de Qualidade:** Mensuramos o índice de sucesso da validação do schema JSON (buscando 99.9% de parses bem sucedidos de primeira) e aceitação implícita do treinador.

## 11. Ética e Responsabilidade

Ao aplicar GenAI com menores de idade, o AthleteOS compromete-se com restrições pesadas:
*   **A IA Apoia, Não Diagnostica:** Qualquer menção a lesões ou dor na mente engatilha o modelo a sugerir que um médico ou responsável seja procurado.
*   **Tom Constante:** O prompt sempre determina que as palavras-chave são suporte, encorajamento e Growth Mindset. Jamais "você não tem habilidade", mas "precisamos praticar mais esta habilidade".
*   **Sem Fine-Tuning Privado Externo:** Os dados enviados via API para o Google não são usados pela Google para treinar modelos de base.
*   **Transparência:** O aplicativo possui badges claros (✨ gerado por IA) informando os jovens que aquilo é o resumo de um sistema, orientando-os sempre a falar com seus treinadores.
*   **Human Override:** Treinadores podem editar ou excluir análises automáticas de seus atletas se julgarem necessário.

## 12. Evolução Futura

*   **Visão Computacional Acessível:** Integrar no futuro upload de vídeo curto (celular) para que a IA (Gemini multimodal) avalie mecanicamente o posicionamento do corpo num chute.
*   **Coach em Tempo Real (Áudio):** Permitir o input dos relatórios apenas falando, sem digitar, com o modelo sumarizando e respondendo em áudio.
*   **Modelos Menores e Locais:** Avaliar o uso futuro de SLMs (Small Language Models) auto-hospedados caso a volumetria de atletas cresça muito, cortando custos de API para tarefas simples.
*   **Multi-idioma:** Tradução automática do RAG caso times que falem outras línguas venham para a base (inglês/espanhol).

*Documento gerado como parte da AthleteOS Engineering Bible. Volume 5 de 10 — Inteligência Artificial. AthleteOS © 2026*
