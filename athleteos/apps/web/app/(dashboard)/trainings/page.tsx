import { getMyAthletes } from '@/app/actions/profile';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { TrainingForm } from '@/components/forms/training-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, Dumbbell, Calendar, Clock, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function TrainingsPage() {
  const athletes = await getMyAthletes();
  const athleteIds = athletes.map(a => a.id);
  
  const supabaseAdmin = createAdminClient();
  const { data: sessions } = athleteIds.length > 0 
    ? await supabaseAdmin
        .from('training_sessions')
        .select('*, athletes(full_name)')
        .in('athlete_id', athleteIds)
        .order('session_date', { ascending: false })
    : { data: [] };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'training': return 'Treino';
      case 'recovery': return 'Recuperação';
      case 'gym': return 'Academia';
      case 'match': return 'Partida';
      default: return type;
    }
  };

  return (
    <div className="flex-1 p-8 pt-6 space-y-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center bg-slate-950/50 p-6 rounded-2xl border border-slate-800/50 backdrop-blur-xl">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center gap-2">
            <Dumbbell className="h-8 w-8 text-emerald-400" />
            Treinos
          </h2>
          <p className="text-slate-400">Registre e acompanhe as sessões de treinamento.</p>
        </div>

        {athletes.length > 0 && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white shadow-lg shadow-emerald-500/20">
                <Plus className="mr-2 h-4 w-4" /> Adicionar Treino
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-slate-950 border-slate-800 text-slate-100">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                  Novo Treino
                </DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <TrainingForm athletes={athletes} />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {(!athletes || athletes.length === 0) ? (
        <div className="text-center p-12 bg-slate-950/30 border border-slate-800/50 rounded-2xl">
          <p className="text-slate-400">Nenhum atleta vinculado ainda.</p>
        </div>
      ) : (!sessions || sessions.length === 0) ? (
        <div className="text-center p-12 bg-slate-950/30 border border-slate-800/50 rounded-2xl">
          <p className="text-slate-400">Nenhum treino registrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session: any) => (
            <Card key={session.id} className="bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-bold text-slate-200">
                    {getTypeLabel(session.session_type)}
                  </CardTitle>
                  <div className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full border border-emerald-500/20">
                    {session.athletes?.full_name}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 pt-4 border-t border-slate-800/50">
                  <div className="flex items-center text-slate-400 text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-slate-500" />
                    {new Date(session.session_date).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex items-center text-slate-400 text-sm">
                    <Clock className="mr-2 h-4 w-4 text-slate-500" />
                    {session.duration_minutes} minutos
                  </div>
                  <div className="flex items-center text-slate-400 text-sm">
                    <Activity className="mr-2 h-4 w-4 text-cyan-400" />
                    RPE Planejado: <span className="ml-1 font-semibold text-slate-200">{session.planned_rpe}/10</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
