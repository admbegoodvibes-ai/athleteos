CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID REFERENCES public.athletes(id) ON DELETE CASCADE,
  opponent TEXT,
  match_date DATE NOT NULL,
  competition TEXT,
  venue TEXT,
  category category_type,
  minutes_played INTEGER,
  self_rating INTEGER CHECK (self_rating >= 1 AND self_rating <= 10),
  positive_points TEXT,
  improvement_points TEXT,
  emotional_note TEXT,
  status match_status DEFAULT 'pending_analysis',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_matches_athlete_date ON public.matches(athlete_id, match_date);

CREATE TABLE public.match_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
  event_type event_type NOT NULL,
  minute INTEGER CHECK (minute >= 0),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.training_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID REFERENCES public.athletes(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  session_type session_type,
  duration_minutes INTEGER,
  planned_rpe INTEGER CHECK (planned_rpe >= 1 AND planned_rpe <= 10),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.training_feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.training_sessions(id) ON DELETE CASCADE,
  athlete_id UUID REFERENCES public.athletes(id) ON DELETE CASCADE,
  perceived_rpe INTEGER CHECK (perceived_rpe >= 1 AND perceived_rpe <= 10),
  srpe_calculated INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.wellness_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID REFERENCES public.athletes(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 5),
  fatigue_level INTEGER CHECK (fatigue_level >= 1 AND fatigue_level <= 5),
  muscle_soreness INTEGER CHECK (muscle_soreness >= 1 AND muscle_soreness <= 5),
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 5),
  mood INTEGER CHECK (mood >= 1 AND mood <= 5),
  wellness_score NUMERIC(5,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(athlete_id, log_date)
);

CREATE TABLE public.workload_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID REFERENCES public.athletes(id) ON DELETE CASCADE,
  metric_date DATE NOT NULL,
  acute_load_7d INTEGER,
  chronic_load_28d INTEGER,
  acwr NUMERIC(5,2),
  acwr_zone acwr_zone,
  ewma_acute NUMERIC(10,2),
  ewma_chronic NUMERIC(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(athlete_id, metric_date)
);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wellness_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workload_metrics ENABLE ROW LEVEL SECURITY;
