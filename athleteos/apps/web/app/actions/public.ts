'use server';

import { createAdminClient } from '@/lib/supabase/admin';

export async function getPublicAthleteData(slug: string) {
  const supabase = createAdminClient();

  // Fetch athlete
  const { data: athlete, error: athleteError } = await supabase
    .from('athletes')
    .select('*')
    .eq('slug', slug)
    .single();

  if (athleteError || !athlete) {
    return null;
  }

  // Fetch matches
  const { data: matches } = await supabase
    .from('matches')
    .select('*')
    .eq('athlete_id', athlete.id);

  // Fetch trainings
  const { data: trainings } = await supabase
    .from('training_sessions')
    .select('*')
    .eq('athlete_id', athlete.id);

  // Fetch public videos
  const { data: videos } = await supabase
    .from('media_assets')
    .select('*')
    .eq('athlete_id', athlete.id)
    .eq('asset_type', 'video')
    .eq('is_public', true);
    
  const videoIds = (videos || []).map((v: any) => v.id);
  let videoEvents = [];
  if (videoIds.length > 0) {
    const { data: events } = await supabase
      .from('video_events')
      .select('*')
      .in('video_id', videoIds)
      .order('timestamp_seconds', { ascending: true });
    videoEvents = events || [];
  }

  // Fetch athlete position profile
  const { data: posProfile } = await supabase
    .from('athlete_position_profiles')
    .select(`
      position_profiles(name),
      position_roles!athlete_position_profiles_primary_role_id_fkey(name)
    `)
    .eq('athlete_id', athlete.id)
    .maybeSingle();

  return {
    athlete,
    matches: matches || [],
    trainings: trainings || [],
    videos: videos || [],
    videoEvents,
    posProfile
  };
}
