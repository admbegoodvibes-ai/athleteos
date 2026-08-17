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
