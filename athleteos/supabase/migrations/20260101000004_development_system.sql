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
