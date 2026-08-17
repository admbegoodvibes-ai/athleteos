-- Tabela de Partidas (Matches)
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  opponent TEXT,
  result TEXT, -- ex: 'V 2-1'
  minutes_played INTEGER,
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  self_rating NUMERIC(3,1), -- ex: 8.5
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Treinos (Training Sessions)
CREATE TABLE IF NOT EXISTS public.training_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  type TEXT, -- ex: 'Físico', 'Tático', 'Técnico'
  duration_minutes INTEGER,
  focus_areas TEXT,
  self_rating NUMERIC(3,1),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public matches read" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Authenticated matches all" ON public.matches FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public trainings read" ON public.training_sessions FOR SELECT USING (true);
CREATE POLICY "Authenticated trainings all" ON public.training_sessions FOR ALL USING (auth.role() = 'authenticated');
