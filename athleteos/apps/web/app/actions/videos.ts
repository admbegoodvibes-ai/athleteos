'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function createVideo(data: any) {
  const supabaseAdmin = createAdminClient();

  const { error } = await supabaseAdmin
    .from('media_assets')
    .insert({
      asset_type: 'video',
      storage_path: data.url,
      title: data.title,
      athlete_id: data.athlete_id,
      is_public: true,
    });

  if (error) {
    console.error('Error creating video:', error);
    return { error: error.message };
  }

  revalidatePath('/analyses');
  return { success: true };
}

export async function getVideosForAthlete(athleteId: string) {
  const supabaseAdmin = createAdminClient();
  
  const { data, error } = await supabaseAdmin
    .from('media_assets')
    .select('*')
    .eq('athlete_id', athleteId)
    .eq('asset_type', 'video')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching videos:', error);
    return [];
  }

  return data || [];
}

export async function deleteVideo(formData: FormData) {
  const id = formData.get('id');
  if (!id) return;
  
  const supabaseAdmin = createAdminClient();
  await supabaseAdmin.from('media_assets').delete().eq('id', id);
  revalidatePath('/analyses');
}
