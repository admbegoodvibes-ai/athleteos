'use server';

import { createAdminClient } from '@/lib/supabase/admin';

export async function getScoutAthletes() {
  const supabase = createAdminClient();

  // Fetch all public athletes with their matches to calculate advanced stats
  const { data: athletes, error } = await supabase
    .from('athletes')
    .select(`
      *,
      matches (*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching scout athletes:', error);
    return [];
  }

  // Map the data to include calculated averages
  const enrichedAthletes = athletes.map(athlete => {
    const matches = athlete.matches || [];
    const totalMatches = matches.length;
    
    // Calculate Pass Accuracy Average
    const passAccuracies = matches.filter((m: any) => m.pass_accuracy_percentage > 0);
    const avgPassAccuracy = passAccuracies.length > 0 
      ? passAccuracies.reduce((acc: number, m: any) => acc + (m.pass_accuracy_percentage || 0), 0) / passAccuracies.length 
      : 0;

    // Calculate total goals
    const totalGoals = matches.reduce((acc: number, m: any) => acc + (m.goals || 0), 0);

    return {
      ...athlete,
      stats: {
        totalMatches,
        totalGoals,
        avgPassAccuracy: Math.round(avgPassAccuracy),
      }
    };
  });

  return enrichedAthletes;
}
