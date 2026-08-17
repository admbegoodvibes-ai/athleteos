'use server';

import { createAdminClient } from '@/lib/supabase/admin';

export async function getClubAnalytics() {
  const supabase = createAdminClient();

  // MVP: Fetch global metrics (assuming all public athletes belong to the club ecosystem for now)
  // In a full multi-tenant setup, we'd filter by organization_id of the logged-in coach.

  const { count: totalAthletes } = await supabase
    .from('athletes')
    .select('*', { count: 'exact', head: true });

  const { count: totalEvaluations } = await supabase
    .from('evaluations')
    .select('*', { count: 'exact', head: true });

  const { data: pdiGoals } = await supabase
    .from('pdi_goals')
    .select('status');
    
  const activePDIs = pdiGoals?.filter((g: any) => g.status === 'active').length || 0;
  const completedPDIs = pdiGoals?.filter((g: any) => g.status === 'completed').length || 0;

  const { data: scores } = await supabase
    .from('evaluation_scores')
    .select('score');

  let avgScore = 0;
  if (scores && scores.length > 0) {
    const sum = scores.reduce((acc, curr) => acc + Number(curr.score), 0);
    avgScore = sum / scores.length;
  }

  // Top athletes (mocking based on simple count of evaluations for now to avoid complex SQL joins in MVP)
  const { data: topAthletesData } = await supabase
    .from('athletes')
    .select('id, full_name, avatar_url, position')
    .limit(5);

  return {
    totalAthletes: totalAthletes || 0,
    totalEvaluations: totalEvaluations || 0,
    activePDIs,
    completedPDIs,
    avgClubScore: avgScore.toFixed(1),
    topAthletes: topAthletesData || [],
  };
}
