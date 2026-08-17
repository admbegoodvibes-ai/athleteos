'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function createMatch(data: any) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Not authenticated' };
  }

  const supabaseAdmin = createAdminClient();

  const { error: dbError } = await supabaseAdmin
    .from('matches')
    .insert({
      athlete_id: data.athlete_id,
      opponent: data.opponent,
      match_date: data.match_date,
      competition: data.competition,
      minutes_played: parseInt(data.minutes_played, 10),
      self_rating: parseInt(data.self_rating, 10),
    });

  if (dbError) {
    console.error('Match Insert Error:', dbError);
    return { error: dbError.message };
  }

  revalidatePath('/matches');
  return { success: true };
}
