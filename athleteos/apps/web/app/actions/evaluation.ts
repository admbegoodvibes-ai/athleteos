'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function getEvaluationTemplates() {
  const supabase = createAdminClient();
  const { data: templates } = await supabase
    .from('evaluation_templates')
    .select(`
      *,
      evaluation_items (*)
    `);
  return templates || [];
}

export async function submitEvaluation(payload: any) {
  const supabase = createAdminClient();
  
  const { athleteId, evaluatorId, templateId, context, generalNotes, scores } = payload;

  // 1. Insert Evaluation
  const { data: evaluation, error: evalError } = await supabase
    .from('evaluations')
    .insert({
      athlete_id: athleteId,
      evaluator_id: evaluatorId,
      template_id: templateId,
      context,
      general_notes: generalNotes
    })
    .select()
    .single();

  if (evalError) return { error: evalError.message };

  // 2. Insert Scores
  const scoreInserts = scores.map((s: any) => ({
    evaluation_id: evaluation.id,
    item_id: s.itemId,
    score: s.score,
    notes: s.notes
  }));

  const { error: scoreError } = await supabase
    .from('evaluation_scores')
    .insert(scoreInserts);

  if (scoreError) return { error: scoreError.message };

  revalidatePath(`/p/[slug]`);
  return { success: true };
}

export async function getAthleteEvaluations(athleteId: string) {
  const supabase = createAdminClient();
  const { data: evaluations } = await supabase
    .from('evaluations')
    .select(`
      *,
      evaluation_scores (
        score,
        notes,
        evaluation_items (domain, competence, indicator)
      )
    `)
    .eq('athlete_id', athleteId)
    .order('created_at', { ascending: false });
    
  return evaluations || [];
}
