CREATE INDEX idx_ai_reports_content_gin ON public.ai_reports USING GIN (content);
CREATE INDEX idx_notifications_data_gin ON public.notifications USING GIN (data);
CREATE INDEX idx_matches_analyzed ON public.matches (athlete_id) WHERE status = 'analyzed';
CREATE INDEX idx_wellness_athlete_date ON public.wellness_logs (athlete_id, log_date);
CREATE INDEX idx_training_athlete_date ON public.training_sessions (athlete_id, session_date);
CREATE INDEX idx_notifications_user_unread ON public.notifications (user_id) WHERE is_read = false;
CREATE INDEX idx_audit_table ON public.audit_logs (table_name, created_at);
