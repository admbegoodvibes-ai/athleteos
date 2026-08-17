'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function getAthletePDI(athleteId: string) {
  const supabase = createAdminClient();
  const { data: goals } = await supabase
    .from('pdi_goals')
    .select(`
      *,
      pdi_actions (*)
    `)
    .eq('athlete_id', athleteId)
    .order('created_at', { ascending: false });
    
  return goals || [];
}

export async function createPDIGoal(payload: any) {
  const supabase = createAdminClient();
  const { athleteId, creatorId, title, description, targetDate, actions } = payload;

  // 1. Create Goal
  const { data: goal, error: goalError } = await supabase
    .from('pdi_goals')
    .insert({
      athlete_id: athleteId,
      creator_id: creatorId,
      title,
      description,
      target_date: targetDate || null
    })
    .select()
    .single();

  if (goalError) return { error: goalError.message };

  // 2. Create Actions
  if (actions && actions.length > 0) {
    const actionInserts = actions.map((a: string) => ({
      goal_id: goal.id,
      title: a
    }));

    const { error: actionError } = await supabase
      .from('pdi_actions')
      .insert(actionInserts);

    if (actionError) return { error: actionError.message };
  }

  revalidatePath('/pdi');
  return { success: true };
}

export async function togglePDIAction(actionId: string, isCompleted: boolean) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('pdi_actions')
    .update({
      is_completed: isCompleted,
      completed_at: isCompleted ? new Date().toISOString() : null
    })
    .eq('id', actionId);

  if (error) return { error: error.message };
  revalidatePath('/pdi');
  return { success: true };
}
