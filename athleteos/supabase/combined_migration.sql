CREATE TYPE user_role AS ENUM ('athlete', 'coach', 'scout', 'admin');
CREATE TYPE position_type AS ENUM ('goalkeeper', 'defender', 'midfielder', 'forward');
CREATE TYPE dominant_foot AS ENUM ('left', 'right', 'both');
CREATE TYPE category_type AS ENUM ('u15', 'u17', 'u20', 'pro');
CREATE TYPE relationship_type AS ENUM ('parent', 'agent', 'guardian');
CREATE TYPE match_status AS ENUM ('pending_analysis', 'analyzed', 'archived');
CREATE TYPE event_type AS ENUM ('goal', 'assist', 'yellow_card', 'red_card', 'substitution', 'highlight');
CREATE TYPE session_type AS ENUM ('training', 'recovery', 'gym', 'match');
CREATE TYPE acwr_zone AS ENUM ('danger_low', 'sweet_spot', 'danger_high');
CREATE TYPE report_type AS ENUM ('match_analysis', 'monthly_progress', 'scouting_summary');
CREATE TYPE ai_source_type AS ENUM ('video', 'match_data', 'training_data', 'profile');
CREATE TYPE asset_type AS ENUM ('video', 'image', 'document');
CREATE TYPE tag_type AS ENUM ('offensive', 'defensive', 'technical', 'tactical');
CREATE TYPE recommendation_type AS ENUM ('sign', 'monitor', 'reject');
CREATE TYPE scout_status AS ENUM ('pending', 'contacted', 'rejected', 'signed');
CREATE TYPE cycle_type AS ENUM ('weekly', 'monthly', 'quarterly', 'yearly');
CREATE TYPE idp_status AS ENUM ('active', 'completed', 'archived');
CREATE TYPE idp_category AS ENUM ('technical', 'tactical', 'physical', 'mental');
CREATE TYPE goal_status AS ENUM ('not_started', 'in_progress', 'achieved', 'abandoned');
CREATE TYPE phv_status AS ENUM ('pre', 'circa', 'post');
CREATE TYPE notification_type AS ENUM ('system', 'message', 'alert', 'reminder');
CREATE TYPE consent_type AS ENUM ('terms_of_service', 'privacy_policy', 'data_processing', 'marketing');
CREATE TYPE data_request_type AS ENUM ('export', 'deletion', 'correction');
CREATE TYPE data_request_status AS ENUM ('pending', 'processing', 'completed', 'rejected');
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'athlete',
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.athletes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  position position_type,
  secondary_position position_type,
  dominant_foot dominant_foot,
  height_cm NUMERIC(5,2),
  weight_kg NUMERIC(5,2),
  category category_type,
  club TEXT,
  city TEXT,
  state TEXT,
  bio TEXT,
  slug TEXT UNIQUE,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.coach_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  club TEXT,
  license_type TEXT,
  categories TEXT[],
  specialization TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.scout_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  organization TEXT,
  region TEXT,
  specialization TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.guardian_athletes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guardian_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  athlete_id UUID REFERENCES public.athletes(id) ON DELETE CASCADE,
  relationship relationship_type,
  invite_code TEXT UNIQUE,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(guardian_user_id, athlete_id)
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scout_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guardian_athletes ENABLE ROW LEVEL SECURITY;
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
CREATE TABLE public.individual_development_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID REFERENCES public.athletes(id) ON DELETE CASCADE,
  coach_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  cycle_type cycle_type,
  start_date DATE,
  end_date DATE,
  status idp_status DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.idp_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idp_id UUID REFERENCES public.individual_development_plans(id) ON DELETE CASCADE,
  category idp_category,
  description TEXT,
  target_metric TEXT,
  current_value TEXT,
  target_value TEXT,
  status goal_status DEFAULT 'not_started',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.maturation_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID REFERENCES public.athletes(id) ON DELETE CASCADE,
  measurement_date DATE NOT NULL,
  standing_height_cm NUMERIC(5,2),
  sitting_height_cm NUMERIC(5,2),
  weight_kg NUMERIC(5,2),
  leg_length_cm NUMERIC(5,2),
  growth_velocity_cm_month NUMERIC(5,2),
  phv_status phv_status,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  type notification_type,
  title TEXT,
  message TEXT,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action TEXT,
  table_name TEXT,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_name TEXT UNIQUE,
  is_enabled BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE,
  value JSONB,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.individual_development_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idp_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maturation_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION calc_wellness_score() RETURNS trigger AS $$
BEGIN
  NEW.wellness_score := (NEW.sleep_quality + NEW.fatigue_level + NEW.muscle_soreness + NEW.stress_level + NEW.mood) / 5.0;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calc_wellness_score_trigger
BEFORE INSERT OR UPDATE ON public.wellness_logs
FOR EACH ROW EXECUTE FUNCTION calc_wellness_score();


CREATE OR REPLACE FUNCTION calc_srpe() RETURNS trigger AS $$
DECLARE
  sess_duration INTEGER;
BEGIN
  SELECT duration_minutes INTO sess_duration FROM public.training_sessions WHERE id = NEW.session_id;
  IF sess_duration IS NOT NULL THEN
    NEW.srpe_calculated := sess_duration * NEW.perceived_rpe;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calc_srpe_trigger
BEFORE INSERT OR UPDATE ON public.training_feedbacks
FOR EACH ROW EXECUTE FUNCTION calc_srpe();


CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_athletes_updated_at BEFORE UPDATE ON public.athletes FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_idp_goals_updated_at BEFORE UPDATE ON public.idp_goals FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_feature_flags_updated_at BEFORE UPDATE ON public.feature_flags FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();


CREATE OR REPLACE FUNCTION audit_trigger_func() RETURNS trigger SECURITY DEFINER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (action, table_name, record_id, new_data)
    VALUES ('INSERT', TG_TABLE_NAME::TEXT, NEW.id, row_to_json(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_logs (action, table_name, record_id, old_data, new_data)
    VALUES ('UPDATE', TG_TABLE_NAME::TEXT, NEW.id, row_to_json(OLD), row_to_json(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs (action, table_name, record_id, old_data)
    VALUES ('DELETE', TG_TABLE_NAME::TEXT, OLD.id, row_to_json(OLD));
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_users AFTER INSERT OR UPDATE OR DELETE ON public.users FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
CREATE TRIGGER audit_athletes AFTER INSERT OR UPDATE OR DELETE ON public.athletes FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
CREATE TRIGGER audit_matches AFTER INSERT OR UPDATE OR DELETE ON public.matches FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
CREATE TRIGGER audit_wellness AFTER INSERT OR UPDATE OR DELETE ON public.wellness_logs FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
-- users
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Public can view athlete users" ON public.users FOR SELECT USING (role = 'athlete');
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- athletes
CREATE POLICY "Public can view public athletes" ON public.athletes FOR SELECT USING (is_public = true);
CREATE POLICY "Users can view their own athlete profile" ON public.athletes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Guardians can view their athletes" ON public.athletes FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.guardian_athletes ga WHERE ga.guardian_user_id = auth.uid() AND ga.athlete_id = public.athletes.id)
);
CREATE POLICY "Users can update their own athlete profile" ON public.athletes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own athlete profile" ON public.athletes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- coach_profiles
CREATE POLICY "Coaches view own" ON public.coach_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Coaches update own" ON public.coach_profiles FOR UPDATE USING (auth.uid() = user_id);

-- scout_profiles
CREATE POLICY "Scouts view own" ON public.scout_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Scouts update own" ON public.scout_profiles FOR UPDATE USING (auth.uid() = user_id);

-- guardian_athletes
CREATE POLICY "Guardians or athletes view own relation" ON public.guardian_athletes FOR SELECT USING (
  guardian_user_id = auth.uid() OR
  athlete_id IN (SELECT id FROM public.athletes WHERE user_id = auth.uid())
);

-- matches
CREATE POLICY "Athletes view own matches" ON public.matches FOR SELECT USING (
  athlete_id IN (SELECT id FROM public.athletes WHERE user_id = auth.uid())
);
CREATE POLICY "Athletes insert own matches" ON public.matches FOR INSERT WITH CHECK (
  athlete_id IN (SELECT id FROM public.athletes WHERE user_id = auth.uid())
);
CREATE POLICY "Athletes update own matches" ON public.matches FOR UPDATE USING (
  athlete_id IN (SELECT id FROM public.athletes WHERE user_id = auth.uid())
);

-- match_events
CREATE POLICY "Athletes view match events" ON public.match_events FOR SELECT USING (
  match_id IN (SELECT id FROM public.matches WHERE athlete_id IN (SELECT id FROM public.athletes WHERE user_id = auth.uid()))
);

-- training_sessions
CREATE POLICY "Athletes view own sessions" ON public.training_sessions FOR SELECT USING (
  athlete_id IN (SELECT id FROM public.athletes WHERE user_id = auth.uid())
);
CREATE POLICY "Athletes insert own sessions" ON public.training_sessions FOR INSERT WITH CHECK (
  athlete_id IN (SELECT id FROM public.athletes WHERE user_id = auth.uid())
);

-- training_feedbacks
CREATE POLICY "Athletes view own feedbacks" ON public.training_feedbacks FOR SELECT USING (
  athlete_id IN (SELECT id FROM public.athletes WHERE user_id = auth.uid())
);
CREATE POLICY "Athletes insert own feedbacks" ON public.training_feedbacks FOR INSERT WITH CHECK (
  athlete_id IN (SELECT id FROM public.athletes WHERE user_id = auth.uid())
);

-- wellness_logs
CREATE POLICY "Athletes view own wellness" ON public.wellness_logs FOR SELECT USING (
  athlete_id IN (SELECT id FROM public.athletes WHERE user_id = auth.uid())
);
CREATE POLICY "Guardians view athlete wellness" ON public.wellness_logs FOR SELECT USING (
  athlete_id IN (SELECT athlete_id FROM public.guardian_athletes WHERE guardian_user_id = auth.uid())
);
CREATE POLICY "Athletes insert own wellness" ON public.wellness_logs FOR INSERT WITH CHECK (
  athlete_id IN (SELECT id FROM public.athletes WHERE user_id = auth.uid())
);

-- workload_metrics
CREATE POLICY "Athletes view own workload" ON public.workload_metrics FOR SELECT USING (
  athlete_id IN (SELECT id FROM public.athletes WHERE user_id = auth.uid())
);

-- ai_reports
CREATE POLICY "Athletes view own ai reports" ON public.ai_reports FOR SELECT USING (
  athlete_id IN (SELECT id FROM public.athletes WHERE user_id = auth.uid())
);

-- media_assets
CREATE POLICY "Athletes view own media" ON public.media_assets FOR SELECT USING (
  athlete_id IN (SELECT id FROM public.athletes WHERE user_id = auth.uid())
);
CREATE POLICY "Public view public media" ON public.media_assets FOR SELECT USING (is_public = true);
CREATE POLICY "Athletes insert own media" ON public.media_assets FOR INSERT WITH CHECK (
  athlete_id IN (SELECT id FROM public.athletes WHERE user_id = auth.uid())
);

-- video_tags
CREATE POLICY "Users view tags via media" ON public.video_tags FOR SELECT USING (
  media_asset_id IN (SELECT id FROM public.media_assets WHERE is_public = true OR athlete_id IN (SELECT id FROM public.athletes WHERE user_id = auth.uid()))
);

-- scouting_reports
CREATE POLICY "Scouts insert reports" ON public.scouting_reports FOR INSERT WITH CHECK (auth.uid() = scout_user_id);
CREATE POLICY "Scouts or athletes view reports" ON public.scouting_reports FOR SELECT USING (
  scout_user_id = auth.uid() OR athlete_id IN (SELECT id FROM public.athletes WHERE user_id = auth.uid())
);

-- scout_interests
CREATE POLICY "Scouts insert interests" ON public.scout_interests FOR INSERT WITH CHECK (auth.uid() = scout_user_id);
CREATE POLICY "Scouts or athletes view interests" ON public.scout_interests FOR SELECT USING (
  scout_user_id = auth.uid() OR athlete_id IN (SELECT id FROM public.athletes WHERE user_id = auth.uid())
);

-- notifications
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_ai_reports_content_gin ON public.ai_reports USING GIN (content);
CREATE INDEX idx_notifications_data_gin ON public.notifications USING GIN (data);
CREATE INDEX idx_matches_analyzed ON public.matches (athlete_id) WHERE status = 'analyzed';
CREATE INDEX idx_wellness_athlete_date ON public.wellness_logs (athlete_id, log_date);
CREATE INDEX idx_training_athlete_date ON public.training_sessions (athlete_id, session_date);
CREATE INDEX idx_notifications_user_unread ON public.notifications (user_id) WHERE is_read = false;
CREATE INDEX idx_audit_table ON public.audit_logs (table_name, created_at);
CREATE TABLE public.consent_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  consent_type consent_type NOT NULL,
  version TEXT NOT NULL,
  accepted BOOLEAN NOT NULL,
  ip_address INET,
  user_agent TEXT,
  guardian_user_id UUID REFERENCES public.users(id),
  accepted_at TIMESTAMPTZ DEFAULT NOW(),
  revoked_at TIMESTAMPTZ
);

CREATE TABLE public.data_subject_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  request_type data_request_type NOT NULL,
  status data_request_status DEFAULT 'pending',
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  response_data JSONB,
  notes TEXT
);

CREATE TABLE public.data_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  accessed_by UUID NOT NULL REFERENCES public.users(id),
  table_name TEXT NOT NULL,
  record_id UUID,
  action TEXT NOT NULL,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_subject_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_access_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own consent" ON public.consent_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own consent" ON public.consent_records FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users view own requests" ON public.data_subject_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own requests" ON public.data_subject_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users view own access logs" ON public.data_access_logs FOR SELECT USING (auth.uid() = user_id);

CREATE INDEX idx_consent_user ON public.consent_records(user_id);
CREATE INDEX idx_data_requests_user ON public.data_subject_requests(user_id);
CREATE INDEX idx_data_access_user ON public.data_access_logs(user_id);

CREATE TRIGGER audit_consent_records AFTER INSERT OR UPDATE OR DELETE ON public.consent_records FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
