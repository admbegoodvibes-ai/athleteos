-- Sprint 15: Multi-Tenant Architecture (Clubes e Equipes)

-- 1. Criação das Tabelas Principais
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.organization_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('club_admin', 'coordinator', 'coach', 'analyst', 'scout')), 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(organization_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- Ex: 'Sub-17'
  age_group TEXT, -- Ex: 'U17'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- Ex: 'Sub-17 A'
  season TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.team_athletes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  athlete_id UUID REFERENCES public.athletes(id) ON DELETE CASCADE,
  joined_at DATE DEFAULT CURRENT_DATE,
  left_at DATE, -- Null significa que ainda está no time
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'injured', 'transferred', 'released')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(team_id, athlete_id, joined_at)
);

-- 2. Habilitar RLS (Row Level Security)
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_athletes ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de Segurança (Policies)

-- Organizações: Apenas membros podem ver a própria organização
CREATE POLICY "Membros veem suas organizacoes" ON public.organizations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.organization_members 
      WHERE organization_members.organization_id = organizations.id 
      AND organization_members.user_id = auth.uid()
    )
  );

-- Membros: Membros veem outros membros do mesmo clube
CREATE POLICY "Membros veem outros membros" ON public.organization_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.organization_members as om
      WHERE om.organization_id = organization_members.organization_id 
      AND om.user_id = auth.uid()
    )
  );

-- Categorias, Times e Atletas do Time seguem a mesma regra
CREATE POLICY "Membros veem categorias" ON public.categories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.organization_members 
      WHERE organization_members.organization_id = categories.organization_id 
      AND organization_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Membros veem times" ON public.teams
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.categories c
      JOIN public.organization_members om ON om.organization_id = c.organization_id
      WHERE c.id = teams.category_id
      AND om.user_id = auth.uid()
    )
  );

CREATE POLICY "Membros veem atletas dos times" ON public.team_athletes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.teams t
      JOIN public.categories c ON c.id = t.category_id
      JOIN public.organization_members om ON om.organization_id = c.organization_id
      WHERE t.id = team_athletes.team_id
      AND om.user_id = auth.uid()
    )
  );
