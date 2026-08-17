'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function addVideo(athleteId: string, url: string, title?: string) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Not authenticated' };
  }

  const supabaseAdmin = createAdminClient();

  const { error } = await supabaseAdmin
    .from('media_assets')
    .insert({
      athlete_id: athleteId,
      asset_type: 'video',
      storage_path: url,
      title,
      is_public: true,
    });

  if (error) {
    console.error('Add video error:', error);
    return { error: error.message };
  }

  // revalidate paths
  const { data: athlete } = await supabaseAdmin.from('athletes').select('slug').eq('id', athleteId).single();
  if (athlete?.slug) {
    revalidatePath(`/p/${athlete.slug}`, 'page');
  }
  revalidatePath('/athletes');

  return { success: true };
}

export async function removeVideo(videoId: string, athleteId: string) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Not authenticated' };
  }

  const supabaseAdmin = createAdminClient();

  const { error } = await supabaseAdmin
    .from('media_assets')
    .delete()
    .eq('id', videoId)
    .eq('athlete_id', athleteId); // extra security

  if (error) {
    return { error: error.message };
  }

  const { data: athlete } = await supabaseAdmin.from('athletes').select('slug').eq('id', athleteId).single();
  if (athlete?.slug) {
    revalidatePath(`/p/${athlete.slug}`, 'page');
  }
  revalidatePath('/athletes');

  return { success: true };
}

export async function addVideoEvent(videoId: string, athleteId: string, timestampSeconds: number, eventType: string, description?: string) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Not authenticated' };
  }

  const supabaseAdmin = createAdminClient();
  
  const { error } = await supabaseAdmin
    .from('video_events')
    .insert({
      video_id: videoId,
      timestamp_seconds: timestampSeconds,
      event_type: eventType,
      description: description || null
    });

  if (error) {
    console.error('Add video event error:', error);
    return { error: error.message };
  }

  const { data: athlete } = await supabaseAdmin.from('athletes').select('slug').eq('id', athleteId).single();
  if (athlete?.slug) {
    revalidatePath(`/p/${athlete.slug}`, 'page');
  }
  revalidatePath('/athletes');

  return { success: true };
}

export async function removeVideoEvent(eventId: string, athleteId: string) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Not authenticated' };
  }

  const supabaseAdmin = createAdminClient();

  const { error } = await supabaseAdmin
    .from('video_events')
    .delete()
    .eq('id', eventId);

  if (error) {
    return { error: error.message };
  }

  const { data: athlete } = await supabaseAdmin.from('athletes').select('slug').eq('id', athleteId).single();
  if (athlete?.slug) {
    revalidatePath(`/p/${athlete.slug}`, 'page');
  }
  revalidatePath('/athletes');

  return { success: true };
}
