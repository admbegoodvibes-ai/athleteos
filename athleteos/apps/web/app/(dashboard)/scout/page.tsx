import { getScoutAthletes } from '@/app/actions/scout';
import { ScoutDashboard } from '@/components/scout/scout-dashboard';

export const metadata = {
  title: 'Portal do Olheiro | AthleteOS',
  description: 'Descubra talentos e filtre por estatísticas.',
};

export default async function ScoutPage() {
  const athletes = await getScoutAthletes();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Portal do Olheiro</h1>
        <p className="text-slate-400 mt-2">
          Busque e filtre atletas em toda a plataforma AthleteOS. Utilize nossos filtros avançados para encontrar o perfil ideal.
        </p>
      </div>
      
      <ScoutDashboard initialAthletes={athletes} />
    </div>
  );
}
