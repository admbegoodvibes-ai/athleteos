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
