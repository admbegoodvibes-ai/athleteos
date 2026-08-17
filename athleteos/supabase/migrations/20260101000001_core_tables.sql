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
