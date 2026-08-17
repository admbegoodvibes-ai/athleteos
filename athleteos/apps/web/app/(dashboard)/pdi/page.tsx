import { getAthletePDI } from '@/app/actions/pdi';
import { PdiBoard } from '@/components/pdi/pdi-board';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Meu PDI | AthleteOS',
  description: 'Plano de Desenvolvimento Individual',
};

export default async function PdiPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/signin');
  }

  // Need athlete ID for the current user to fetch goals
  const { data: athlete } = await supabase
    .from('athletes')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!athlete) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-slate-400">
        Apenas perfis de atleta possuem PDI.
      </div>
    );
  }

  const goals = await getAthletePDI(athlete.id);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <PdiBoard athleteId={athlete.id} userId={user.id} initialGoals={goals} />
    </div>
  );
}
