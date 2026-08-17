-- Sprint 17: PDI (Plano de Desenvolvimento Individual)

-- 1. Criação das Tabelas
CREATE TABLE IF NOT EXISTS public.pdi_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  athlete_id UUID REFERENCES public.athletes(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  target_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.pdi_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID REFERENCES public.pdi_goals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilitar RLS (Row Level Security)
ALTER TABLE public.pdi_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pdi_actions ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de Segurança

-- PDI Goals: Atletas podem ver seus próprios objetivos, criadores podem ver os que criaram.
CREATE POLICY "Atletas veem seus objetivos" ON public.pdi_goals 
  FOR SELECT USING (athlete_id IN (SELECT id FROM public.athletes WHERE user_id = auth.uid()));

CREATE POLICY "Criadores veem os objetivos que criaram" ON public.pdi_goals
  FOR SELECT USING (creator_id = auth.uid());

-- PDI Actions: Mesma lógica, delegando para a tabela pai.
CREATE POLICY "Acesso as acoes do PDI" ON public.pdi_actions
  FOR SELECT USING (
    goal_id IN (
      SELECT id FROM public.pdi_goals 
      WHERE athlete_id IN (SELECT id FROM public.athletes WHERE user_id = auth.uid()) OR creator_id = auth.uid()
    )
  );

-- Permitir que atletas editem suas próprias ações para marcá-las como concluídas
CREATE POLICY "Atletas podem editar acoes do PDI" ON public.pdi_actions
  FOR UPDATE USING (
    goal_id IN (
      SELECT id FROM public.pdi_goals 
      WHERE athlete_id IN (SELECT id FROM public.athletes WHERE user_id = auth.uid())
    )
  );
