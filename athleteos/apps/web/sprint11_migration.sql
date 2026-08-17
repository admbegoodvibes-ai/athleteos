-- Sprint 11: Adicionar colunas de redes sociais
ALTER TABLE public.athletes ADD COLUMN IF NOT EXISTS instagram_url TEXT;
ALTER TABLE public.athletes ADD COLUMN IF NOT EXISTS youtube_url TEXT;
