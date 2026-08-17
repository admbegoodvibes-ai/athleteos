import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AthleteForm } from '@/components/forms/athlete-form';
import { VideoManager } from '@/components/forms/video-manager';
import { MatchManager } from '@/components/forms/match-manager';
import { TrainingManager } from '@/components/forms/training-manager';
import { UserPlus, Link as LinkIcon, User, ExternalLink, Youtube, Trophy, Activity } from 'lucide-react';
import Link from 'next/link';

const getAge = (dateString: string) => {
  if (!dateString) return 'N/A';
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export default async function AthletesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: linkedAthletes } = await supabase
    .from('guardian_athletes')
    .select(`
      athlete_id,
      athletes (
        id,
        full_name,
        date_of_birth,
        position,
        dominant_foot,
        height_cm,
        weight_kg,
        slug,
        avatar_url
      )
    `)
    .eq('guardian_user_id', user.id);

  const athletes = (linkedAthletes || []).map(link => link.athletes).filter(Boolean);

  const positionLabels: Record<string, string> = {
    goalkeeper: 'Goleiro',
    defender: 'Defensor',
    midfielder: 'Meio-campo',
    forward: 'Atacante',
  };

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-100">Meus Atletas</h1>
          <p className="text-slate-400 text-lg mt-2">
            Gerencie e acompanhe o desenvolvimento dos seus atletas.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 bg-slate-950/50">
            <LinkIcon className="mr-2 h-4 w-4" />
            Vincular via Código
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-500 text-white border-0 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                <UserPlus className="mr-2 h-4 w-4" />
                Criar Novo Atleta
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-slate-950 border border-slate-800 text-slate-100 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-slate-100">Criar Perfil de Atleta</DialogTitle>
              </DialogHeader>
              <AthleteForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {athletes.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-500 bg-slate-900/30 rounded-2xl border border-slate-800/50 border-dashed backdrop-blur-sm">
            <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-xl font-medium text-slate-300">Nenhum atleta vinculado ainda.</p>
            <p className="text-slate-500 mt-2 max-w-md mx-auto">Crie um novo atleta gerenciado por você ou vincule um existente através do código de convite.</p>
          </div>
        ) : (
          athletes.map((athlete: any) => {
            const age = getAge(athlete.date_of_birth);
            return (
              <Card key={athlete.id} className="bg-slate-900/60 border-slate-800/50 backdrop-blur-xl shadow-xl hover:border-emerald-500/50 transition-colors group overflow-hidden relative">
                <div className="absolute top-0 left-0 w-1 bg-emerald-500 h-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-slate-100 flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)] overflow-hidden">
                      {athlete.avatar_url ? (
                        <img src={`${athlete.avatar_url}?v=${Date.now()}`} alt={athlete.full_name?.substring(0, 2).toUpperCase() || 'AT'} className="w-full h-full object-cover" />
                      ) : (
                        athlete.full_name?.substring(0, 2).toUpperCase() || 'AT'
                      )}
                    </div>
                    {athlete.full_name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/80">
                      <p className="text-slate-500 text-xs mb-1 uppercase tracking-wider font-semibold">Idade</p>
                      <p className="text-slate-200 font-medium">{age} anos</p>
                    </div>
                    <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/80">
                      <p className="text-slate-500 text-xs mb-1 uppercase tracking-wider font-semibold">Posição</p>
                      <p className="text-slate-200 font-medium">{positionLabels[athlete.position] || athlete.position || '-'}</p>
                    </div>
                    <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/80">
                      <p className="text-slate-500 text-xs mb-1 uppercase tracking-wider font-semibold">Altura / Peso</p>
                      <p className="text-slate-200 font-medium">{athlete.height_cm ? `${athlete.height_cm}cm` : '-'} / {athlete.weight_kg ? `${athlete.weight_kg}kg` : '-'}</p>
                    </div>
                    <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/80">
                      <p className="text-slate-500 text-xs mb-1 uppercase tracking-wider font-semibold">Pé Dominante</p>
                      <p className="text-slate-200 font-medium">
                        {athlete.dominant_foot === 'left' ? 'Esquerdo' : athlete.dominant_foot === 'right' ? 'Direito' : athlete.dominant_foot === 'both' ? 'Ambidestro' : '-'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    {athlete.slug && (
                      <Link href={`/p/${athlete.slug}`} target="_blank" className="flex-1">
                        <Button variant="outline" className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 transition-all">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Vitrine
                        </Button>
                      </Link>
                    )}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex-1 border-slate-700/50 text-slate-300 hover:bg-slate-800 transition-all">
                          Editar Perfil
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px] bg-slate-950 border border-slate-800 text-slate-100 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold text-slate-100">Editar Atleta</DialogTitle>
                        </DialogHeader>
                        <AthleteForm initialData={athlete} />
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon" className="border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:text-red-400 transition-all">
                          <Youtube className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px] bg-slate-950 border border-slate-800 text-slate-100 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold text-slate-100">Vídeos do Atleta</DialogTitle>
                        </DialogHeader>
                        <VideoManager athleteId={athlete.id} isPro={athlete.slug === 'thomas'} />
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon" className="border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:text-emerald-400 transition-all">
                          <Trophy className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[700px] bg-slate-950 border border-slate-800 text-slate-100 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold text-slate-100">Partidas do Atleta</DialogTitle>
                        </DialogHeader>
                        <MatchManager athleteId={athlete.id} isPro={athlete.slug === 'thomas'} />
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon" className="border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:text-emerald-400 transition-all">
                          <Activity className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[700px] bg-slate-950 border border-slate-800 text-slate-100 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold text-slate-100">Treinos do Atleta</DialogTitle>
                        </DialogHeader>
                        <TrainingManager athleteId={athlete.id} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  );
}
