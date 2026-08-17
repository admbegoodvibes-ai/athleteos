-- Sprint 16: Avaliação Multidimensional

-- 1. Criação das Tabelas de Avaliação
CREATE TABLE IF NOT EXISTS public.evaluation_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL, -- Ex: 'Avaliação Base Sub-17'
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE, -- opcional se quiser templates globais, mas seguindo Blueprint é por clube
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.evaluation_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES public.evaluation_templates(id) ON DELETE CASCADE,
  domain TEXT NOT NULL, -- Ex: 'Técnico', 'Tático', 'Físico', 'Mental'
  competence TEXT NOT NULL, -- Ex: 'Passe'
  indicator TEXT NOT NULL, -- Ex: 'Precisão'
  weight NUMERIC DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.evaluations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  athlete_id UUID REFERENCES public.athletes(id) ON DELETE CASCADE,
  evaluator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  template_id UUID REFERENCES public.evaluation_templates(id) ON DELETE SET NULL,
  date DATE DEFAULT CURRENT_DATE,
  context TEXT, -- Ex: 'Treino', 'Jogo Oficial'
  general_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.evaluation_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  evaluation_id UUID REFERENCES public.evaluations(id) ON DELETE CASCADE,
  item_id UUID REFERENCES public.evaluation_items(id) ON DELETE CASCADE,
  score NUMERIC NOT NULL, -- Ex: 1 a 10
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.evaluation_evidence (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  score_id UUID REFERENCES public.evaluation_scores(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Inserir Template Padrão Global (Para facilitar o MVP B2C/B2B)
INSERT INTO public.evaluation_templates (name) VALUES ('Avaliação Padrão Universal')
ON CONFLICT DO NOTHING;

DO $$
DECLARE
    v_template_id UUID;
BEGIN
    SELECT id INTO v_template_id FROM public.evaluation_templates WHERE name = 'Avaliação Padrão Universal' LIMIT 1;
    
    IF v_template_id IS NOT NULL THEN
      -- Técnico
      INSERT INTO public.evaluation_items (template_id, domain, competence, indicator) VALUES 
        (v_template_id, 'Técnico', 'Passe', 'Precisão e Velocidade'),
        (v_template_id, 'Técnico', 'Finalização', 'Pontaria e Potência'),
        (v_template_id, 'Técnico', 'Drible', '1x1 Ofensivo');
      
      -- Tático
      INSERT INTO public.evaluation_items (template_id, domain, competence, indicator) VALUES 
        (v_template_id, 'Tático', 'Posicionamento', 'Leitura de Espaços'),
        (v_template_id, 'Tático', 'Transição', 'Recomposição Defensiva');
        
      -- Físico
      INSERT INTO public.evaluation_items (template_id, domain, competence, indicator) VALUES 
        (v_template_id, 'Físico', 'Velocidade', 'Sprint Curto'),
        (v_template_id, 'Físico', 'Resistência', 'V02 Max');
        
      -- Mental/Cognitivo
      INSERT INTO public.evaluation_items (template_id, domain, competence, indicator) VALUES 
        (v_template_id, 'Mental', 'Tomada de Decisão', 'Escolha de Jogada'),
        (v_template_id, 'Mental', 'Comportamental', 'Foco e Liderança');
    END IF;
END $$;

-- 2. Habilitar RLS (Row Level Security)
ALTER TABLE public.evaluation_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_evidence ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de Segurança (Policies para MVP)
-- Permitir leitura livre dos templates e itens globais
CREATE POLICY "Todos veem templates globais" ON public.evaluation_templates FOR SELECT USING (true);
CREATE POLICY "Todos veem itens globais" ON public.evaluation_items FOR SELECT USING (true);

-- Permitir que atletas vejam suas próprias avaliações
CREATE POLICY "Atletas veem suas avaliacoes" ON public.evaluations FOR SELECT USING (athlete_id IN (SELECT id FROM public.athletes WHERE user_id = auth.uid()));
CREATE POLICY "Scores das avaliacoes" ON public.evaluation_scores FOR SELECT USING (evaluation_id IN (SELECT id FROM public.evaluations WHERE athlete_id IN (SELECT id FROM public.athletes WHERE user_id = auth.uid())));

-- Permitir que coaches/admins/scouts de qualquer organização vejam avaliações (simplificado no MVP, no futuro trancar via organization_id)
CREATE POLICY "Coaches veem avaliacoes" ON public.evaluations FOR SELECT USING (true);
CREATE POLICY "Coaches veem scores" ON public.evaluation_scores FOR SELECT USING (true);
