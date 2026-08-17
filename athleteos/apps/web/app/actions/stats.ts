'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function addMatch(athleteId: string, matchData: any) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) return { error: 'Not authenticated' };

  const supabaseAdmin = createAdminClient();
  const { error } = await supabaseAdmin.from('matches').insert({
    athlete_id: athleteId,
    date: matchData.date,
    opponent: matchData.opponent,
    result: matchData.result,
    goals: matchData.goals || 0,
    assists: matchData.assists || 0,
    self_rating: matchData.self_rating,
    notes: matchData.notes,
    minutes_played: matchData.minutes_played || null,
    yellow_cards: matchData.yellow_cards || 0,
    red_cards: matchData.red_cards || 0,
    shots: matchData.shots || 0,
    shots_on_target: matchData.shots_on_target || 0,
    dribbles_successful: matchData.dribbles_successful || 0,
    passes_completed: matchData.passes_completed || 0,
    pass_accuracy_percentage: matchData.pass_accuracy_percentage || 0,
    crosses: matchData.crosses || 0,
    tackles: matchData.tackles || 0,
    interceptions: matchData.interceptions || 0,
    aerial_duels_won: matchData.aerial_duels_won || 0,
  });

  if (error) return { error: error.message };

  const { data: athlete } = await supabaseAdmin.from('athletes').select('slug').eq('id', athleteId).single();
  if (athlete?.slug) revalidatePath(`/p/${athlete.slug}`, 'page');
  revalidatePath('/athletes');

  return { success: true };
}

export async function removeMatch(matchId: string, athleteId: string) {
  const supabaseAdmin = createAdminClient();
  const { error } = await supabaseAdmin.from('matches').delete().eq('id', matchId).eq('athlete_id', athleteId);
  if (error) return { error: error.message };

  const { data: athlete } = await supabaseAdmin.from('athletes').select('slug').eq('id', athleteId).single();
  if (athlete?.slug) revalidatePath(`/p/${athlete.slug}`, 'page');
  revalidatePath('/athletes');

  return { success: true };
}

export async function addTraining(athleteId: string, trainingData: any) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) return { error: 'Not authenticated' };

  const supabaseAdmin = createAdminClient();
  const { error } = await supabaseAdmin.from('training_sessions').insert({
    athlete_id: athleteId,
    date: trainingData.date,
    type: trainingData.type,
    duration_minutes: trainingData.duration_minutes,
    focus_areas: trainingData.focus_areas,
    self_rating: trainingData.self_rating,
    notes: trainingData.notes,
  });

  if (error) return { error: error.message };

  const { data: athlete } = await supabaseAdmin.from('athletes').select('slug').eq('id', athleteId).single();
  if (athlete?.slug) revalidatePath(`/p/${athlete.slug}`, 'page');
  revalidatePath('/athletes');

  return { success: true };
}

export async function removeTraining(trainingId: string, athleteId: string) {
  const supabaseAdmin = createAdminClient();
  const { error } = await supabaseAdmin.from('training_sessions').delete().eq('id', trainingId).eq('athlete_id', athleteId);
  if (error) return { error: error.message };

  const { data: athlete } = await supabaseAdmin.from('athletes').select('slug').eq('id', athleteId).single();
  if (athlete?.slug) revalidatePath(`/p/${athlete.slug}`, 'page');
  revalidatePath('/athletes');

  return { success: true };
}
