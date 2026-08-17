-- Sprint 12: Video Events Table for Annotations

CREATE TABLE IF NOT EXISTS public.video_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID NOT NULL REFERENCES public.media_assets(id) ON DELETE CASCADE,
  timestamp_seconds INTEGER NOT NULL,
  event_type TEXT NOT NULL, -- e.g., 'Gol', 'Desarme', 'Assistência'
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.video_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public video events read" ON public.video_events FOR SELECT USING (true);
CREATE POLICY "Authenticated video events all" ON public.video_events FOR ALL USING (auth.role() = 'authenticated');
