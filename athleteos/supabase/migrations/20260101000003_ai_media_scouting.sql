CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE public.ai_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID REFERENCES public.athletes(id) ON DELETE CASCADE,
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
  report_type report_type,
  content JSONB,
  strengths TEXT[],
  improvements TEXT[],
  training_focus TEXT[],
  score NUMERIC,
  model_used TEXT,
  tokens_used INTEGER,
  processing_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(match_id)
);

CREATE TABLE public.ai_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID REFERENCES public.athletes(id) ON DELETE CASCADE,
  source_type ai_source_type,
  source_id UUID,
  embedding VECTOR(768),
  content_text TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX ON public.ai_embeddings USING hnsw (embedding vector_l2_ops);

CREATE TABLE public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID REFERENCES public.athletes(id) ON DELETE CASCADE,
  asset_type asset_type,
  storage_path TEXT NOT NULL,
  original_filename TEXT,
  file_size_bytes BIGINT,
  mime_type TEXT,
  thumbnail_path TEXT,
  title TEXT,
  description TEXT,
  match_id UUID REFERENCES public.matches(id) ON DELETE SET NULL,
  training_session_id UUID REFERENCES public.training_sessions(id) ON DELETE SET NULL,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.video_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_asset_id UUID REFERENCES public.media_assets(id) ON DELETE CASCADE,
  tag_type tag_type,
  start_timestamp_sec INTEGER,
  end_timestamp_sec INTEGER,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.scouting_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scout_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  athlete_id UUID REFERENCES public.athletes(id) ON DELETE CASCADE,
  technical_score INTEGER CHECK (technical_score >= 1 AND technical_score <= 10),
  tactical_score INTEGER CHECK (tactical_score >= 1 AND tactical_score <= 10),
  physical_score INTEGER CHECK (physical_score >= 1 AND physical_score <= 10),
  mental_score INTEGER CHECK (mental_score >= 1 AND mental_score <= 10),
  overall_score NUMERIC(5,2),
  highlights TEXT,
  limitations TEXT,
  projection TEXT,
  pro_comparison TEXT,
  recommendation recommendation_type,
  is_private BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.scout_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scout_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  athlete_id UUID REFERENCES public.athletes(id) ON DELETE CASCADE,
  message TEXT,
  contact_email TEXT,
  status scout_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ai_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scouting_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scout_interests ENABLE ROW LEVEL SECURITY;
