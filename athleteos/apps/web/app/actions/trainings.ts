'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function createTraining(data: any) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Not authenticated' };
  }

  const supabaseAdmin = createAdminClient();

  const { error: dbError } = await supabaseAdmin
    .from('training_sessions')
    .insert({
      athlete_id: data.athlete_id,
      session_date: data.session_date,
      session_type: data.session_type,
      duration_minutes: parseInt(data.duration_minutes, 10),
      planned_rpe: parseInt(data.planned_rpe, 10),
    });

  if (dbError) {
    console.error('Training Insert Error:', dbError);
    return { error: dbError.message };
  }

  revalidatePath('/trainings');
  return { success: true };
}
