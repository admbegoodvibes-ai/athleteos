-- Note: auth.users must be created first via Supabase Dashboard or Auth API.
-- The users below assume the UUIDs exist in auth.users.

INSERT INTO public.users (id, role, full_name, email)
VALUES 
  ('a1b2c3d4-0000-0000-0000-000000000001', 'athlete', 'Lucas Silva', 'lucas@example.com'),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'athlete', 'Pedro Santos', 'pedro@example.com'),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'coach', 'Mister Thomas', 'thomas@example.com'),
  ('a1b2c3d4-0000-0000-0000-000000000004', 'scout', 'Scout Master', 'scout@example.com')
ON CONFLICT DO NOTHING;

INSERT INTO public.athletes (id, user_id, full_name, position, category, is_public)
VALUES
  ('b1b2c3d4-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000001', 'Lucas Silva', 'forward', 'u17', true),
  ('b1b2c3d4-0000-0000-0000-000000000002', 'a1b2c3d4-0000-0000-0000-000000000002', 'Pedro Santos', 'midfielder', 'u20', true)
ON CONFLICT DO NOTHING;

INSERT INTO public.matches (id, athlete_id, opponent, match_date, minutes_played, self_rating, status)
VALUES
  (gen_random_uuid(), 'b1b2c3d4-0000-0000-0000-000000000001', 'Rival FC', '2026-08-01', 90, 8, 'analyzed'),
  (gen_random_uuid(), 'b1b2c3d4-0000-0000-0000-000000000001', 'City Team', '2026-08-08', 45, 6, 'pending_analysis'),
  (gen_random_uuid(), 'b1b2c3d4-0000-0000-0000-000000000001', 'United Club', '2026-08-15', 90, 9, 'analyzed'),
  (gen_random_uuid(), 'b1b2c3d4-0000-0000-0000-000000000001', 'State Academy', '2026-08-22', 70, 7, 'analyzed'),
  (gen_random_uuid(), 'b1b2c3d4-0000-0000-0000-000000000001', 'National Youth', '2026-08-29', 90, 8, 'pending_analysis')
ON CONFLICT DO NOTHING;

INSERT INTO public.training_sessions (id, athlete_id, session_date, session_type, duration_minutes, planned_rpe)
SELECT gen_random_uuid(), 'b1b2c3d4-0000-0000-0000-000000000001', '2026-08-01'::DATE + i, 'training', 90, 7
FROM generate_series(1, 10) i
ON CONFLICT DO NOTHING;

INSERT INTO public.wellness_logs (athlete_id, log_date, sleep_quality, fatigue_level, muscle_soreness, stress_level, mood)
SELECT 'b1b2c3d4-0000-0000-0000-000000000001', '2026-08-01'::DATE + i, 4, 3, 3, 2, 4
FROM generate_series(1, 7) i
ON CONFLICT DO NOTHING;

INSERT INTO public.workload_metrics (athlete_id, metric_date, acute_load_7d, chronic_load_28d, acwr, acwr_zone)
VALUES
  ('b1b2c3d4-0000-0000-0000-000000000001', '2026-08-07', 1500, 1450, 1.03, 'sweet_spot')
ON CONFLICT DO NOTHING;

INSERT INTO public.consent_records (user_id, consent_type, version, accepted)
VALUES
  ('a1b2c3d4-0000-0000-0000-000000000001', 'terms_of_service', '1.0', true),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'terms_of_service', '1.0', true)
ON CONFLICT DO NOTHING;
