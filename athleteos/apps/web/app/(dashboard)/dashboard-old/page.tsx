import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Calendar, Trophy, TrendingUp, Sparkles, Dumbbell } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getMyAthletes } from '@/app/actions/profile';
import { generateInsight } from '@/lib/ai-engine';
import { getClubAnalytics } from '@/app/actions/analytics';
import { ClubDashboard } from '@/components/dashboard/club-dashboard';
import { Suspense } from 'react';
import { AthleteInsights } from '@/components/dashboard/athlete-insights';
import { Loader2 } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const userName = user?.user_metadata?.full_name || 'Atleta';
  const supabaseAdmin = createAdminClient();

  // Check if user is a club admin or coach
  const { data: member } = await supabaseAdmin
    .from('organization_members')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle();

  const isClubStaff = member?.role === 'club_admin' || member?.role === 'coach';

  if (isClubStaff) {
    const analytics = await getClubAnalytics();
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ClubDashboard analytics={analytics} />
      </div>
    );
  }

  // -----------------------------------------------------
  // ATHLETE DASHBOARD LOGIC
  // -----------------------------------------------------

  // Puxar dados reais
  const athletes = await getMyAthletes();
  const athleteIds = athletes.map(a => a.id);
  
  const { data: matches } = athleteIds.length > 0 
    ? await supabaseAdmin.from('matches').select('*').in('athlete_id', athleteIds)
    : { data: [] };
    
  const { data: trainings } = athleteIds.length > 0
    ? await supabaseAdmin.from('training_sessions').select('*').in('athlete_id', athleteIds)
    : { data: [] };

  const safeMatches = matches || [];
  const safeTrainings = trainings || [];

  // Calculando Estatísticas
  const totalMatches = safeMatches.length;
  const avgRating = totalMatches > 0 
    ? (safeMatches.reduce((acc, m) => acc + (m.self_rating || 0), 0) / totalMatches).toFixed(1)
    : '-';
    
  const totalTrainings = safeTrainings.length;
  const totalTrainingMinutes = safeTrainings.reduce((acc, t) => acc + (t.duration_minutes || 0), 0);
  const totalTrainingHours = Math.floor(totalTrainingMinutes / 60);



  // Montando Feed Recente
  const feed = [
    ...safeMatches.map(m => ({ 
      title: `Partida: vs ${m.opponent}`, 
      time: new Date(m.match_date).toLocaleDateString('pt-BR'), 
      timestamp: new Date(m.match_date).getTime(),
      icon: Trophy, 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-500/10' 
    })),
    ...safeTrainings.map(t => ({ 
      title: `Treino: ${t.session_type || 'Geral'}`, 
      time: new Date(t.session_date).toLocaleDateString('pt-BR'), 
      timestamp: new Date(t.session_date).getTime(),
      icon: Dumbbell, 
      color: 'text-cyan-400', 
      bg: 'bg-cyan-500/10' 
    }))
  ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 4);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-500 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-100">
          Bem-vindo ao <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">AthleteOS</span>, {userName}!
        </h1>
        <p className="text-slate-400 text-lg">
          Aqui está o resumo do desempenho com base nos dados registrados.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-900/60 border-slate-800/50 backdrop-blur-xl hover:border-emerald-500/30 transition-all duration-300 shadow-lg hover:shadow-emerald-500/10 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-300 group-hover:text-emerald-400 transition-colors">Total de Partidas</CardTitle>
            <div className="p-2 bg-emerald-500/10 rounded-full group-hover:bg-emerald-500/20 transition-colors">
              <Trophy className="h-4 w-4 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">{totalMatches}</div>
            <p className="text-xs text-slate-500 mt-1">Registradas no sistema</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-slate-800/50 backdrop-blur-xl hover:border-cyan-500/30 transition-all duration-300 shadow-lg hover:shadow-cyan-500/10 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-300 group-hover:text-cyan-400 transition-colors">Média de Avaliação</CardTitle>
            <div className="p-2 bg-cyan-500/10 rounded-full group-hover:bg-cyan-500/20 transition-colors">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">{avgRating} <span className="text-slate-500 text-lg">/ 10</span></div>
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              Baseado em autoavaliações
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-slate-800/50 backdrop-blur-xl hover:border-emerald-500/30 transition-all duration-300 shadow-lg hover:shadow-emerald-500/10 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-300 group-hover:text-emerald-400 transition-colors">Total de Treinos</CardTitle>
            <div className="p-2 bg-emerald-500/10 rounded-full group-hover:bg-emerald-500/20 transition-colors">
              <Activity className="h-4 w-4 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">{totalTrainings}</div>
            <p className="text-xs text-slate-500 mt-1">Sessões registradas</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-slate-800/50 backdrop-blur-xl hover:border-cyan-500/30 transition-all duration-300 shadow-lg hover:shadow-cyan-500/10 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-300 group-hover:text-cyan-400 transition-colors">Horas de Treino</CardTitle>
            <div className="p-2 bg-cyan-500/10 rounded-full group-hover:bg-cyan-500/20 transition-colors">
              <Calendar className="h-4 w-4 text-cyan-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">{totalTrainingHours}h</div>
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Acumulado
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-2">
        <Suspense fallback={
          <Card className="col-span-4 bg-slate-900/60 border-slate-800/50 backdrop-blur-xl">
            <CardContent className="flex flex-col items-center justify-center p-16 space-y-4">
              <Loader2 className="h-10 w-10 text-purple-500 animate-spin" />
              <p className="text-purple-400 font-medium animate-pulse">O Cérebro da IA está processando seu desempenho...</p>
            </CardContent>
          </Card>
        }>
          <AthleteInsights 
            athleteId={athletes[0]?.id || ''}
            totalMatches={totalMatches}
            totalTrainings={totalTrainings}
            avgRating={String(avgRating)}
          />
        </Suspense>
        
        <Card className="col-span-3 bg-slate-900/60 border-slate-800/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-slate-100">Atividades Recentes</CardTitle>
            <CardDescription className="text-slate-400">Suas últimas partidas e treinos registrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {feed.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-8">Nenhuma atividade encontrada.</p>
              ) : (
                feed.map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-800/30 transition-colors cursor-pointer group border border-transparent hover:border-slate-800/50">
                    <div className={`p-2.5 rounded-full ${item.bg} group-hover:scale-110 transition-transform`}>
                      <item.icon className={`h-4 w-4 ${item.color}`} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-slate-200 group-hover:text-emerald-400 transition-colors">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
