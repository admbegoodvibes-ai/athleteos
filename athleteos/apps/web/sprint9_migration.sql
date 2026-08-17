-- Adicionar colunas de biografia e detalhes se não existirem
ALTER TABLE public.athletes ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.athletes ADD COLUMN IF NOT EXISTS club TEXT;
ALTER TABLE public.athletes ADD COLUMN IF NOT EXISTS category TEXT;

-- Tabela de media assets (se já existir, adiciona apenas o que falta)
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
  asset_type TEXT NOT NULL,
  url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Políticas para media_assets
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Media assets sao publicos" 
ON public.media_assets FOR SELECT 
USING ( is_public = true );

-- Quem for guardião pode gerenciar (simplificado temporariamente)
CREATE POLICY "Guardian gerencia media" 
ON public.media_assets FOR ALL 
USING ( auth.role() = 'authenticated' );
