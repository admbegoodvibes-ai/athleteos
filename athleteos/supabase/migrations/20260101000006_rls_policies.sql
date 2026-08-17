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
