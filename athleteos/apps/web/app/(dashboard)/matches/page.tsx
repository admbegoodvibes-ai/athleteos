import { getMyAthletes } from '@/app/actions/profile';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { MatchForm } from '@/components/forms/match-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, Trophy, Calendar, Clock, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function MatchesPage() {
  const athletes = await getMyAthletes();
  const athleteIds = athletes.map(a => a.id);
  
  const supabaseAdmin = createAdminClient();
  const { data: matches } = athleteIds.length > 0 
    ? await supabaseAdmin
        .from('matches')
        .select('*, athletes(full_name)')
        .in('athlete_id', athleteIds)
        .order('match_date', { ascending: false })
    : { data: [] };

  return (
    <div className="flex-1 p-8 pt-6 space-y-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center bg-slate-950/50 p-6 rounded-2xl border border-slate-800/50 backdrop-blur-xl">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center gap-2">
            <Trophy className="h-8 w-8 text-emerald-400" />
            Partidas
          </h2>
          <p className="text-slate-400">Acompanhe o desempenho nas partidas oficiais e amistosos.</p>
        </div>

        {athletes.length > 0 && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white shadow-lg shadow-emerald-500/20">
                <Plus className="mr-2 h-4 w-4" /> Adicionar Partida
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-slate-950 border-slate-800 text-slate-100">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                  Nova Partida
                </DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <MatchForm athletes={athletes} />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {(!athletes || athletes.length === 0) ? (
        <div className="text-center p-12 bg-slate-950/30 border border-slate-800/50 rounded-2xl">
          <p className="text-slate-400">Nenhum atleta vinculado ainda.</p>
        </div>
      ) : (!matches || matches.length === 0) ? (
        <div className="text-center p-12 bg-slate-950/30 border border-slate-800/50 rounded-2xl">
          <p className="text-slate-400">Nenhuma partida registrada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match: any) => (
            <Card key={match.id} className="bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-bold text-slate-200">
                    vs {match.opponent}
                  </CardTitle>
                  <div className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full border border-emerald-500/20">
                    {match.athletes?.full_name}
                  </div>
                </div>
                <p className="text-sm text-cyan-400 font-medium">{match.competition}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 pt-4 border-t border-slate-800/50">
                  <div className="flex items-center text-slate-400 text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-slate-500" />
                    {new Date(match.match_date).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex items-center text-slate-400 text-sm">
                    <Clock className="mr-2 h-4 w-4 text-slate-500" />
                    {match.minutes_played} minutos jogados
                  </div>
                  <div className="flex items-center text-slate-400 text-sm">
                    <Star className="mr-2 h-4 w-4 text-emerald-400" />
                    Avaliação: <span className="ml-1 font-semibold text-slate-200">{match.self_rating}/10</span>
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
