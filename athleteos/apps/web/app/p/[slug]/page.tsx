import { getPublicAthleteData } from '@/app/actions/public';
import { getAthleteEvaluations, getEvaluationTemplates } from '@/app/actions/evaluation';
import { notFound } from 'next/navigation';
const calculateAge = (dateString: string) => {
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
import Link from 'next/link';
import { PlayCircle, Award, Activity, Calendar, MapPin, Instagram, Youtube, TrendingUp } from 'lucide-react';
import { PerformanceChart } from '@/components/charts/performance-chart';
import { PublicVideoPlayer } from '@/components/video/public-video-player';
import { EvaluationRadar } from '@/components/charts/evaluation-radar';
import { EvaluationForm } from '@/components/forms/evaluation-form';
import { BrainCircuit } from 'lucide-react';

function extractYoutubeId(url: string) {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('youtube.com')) {
      if (urlObj.pathname === '/watch') return urlObj.searchParams.get('v');
      if (urlObj.pathname.startsWith('/embed/')) return urlObj.pathname.split('/')[2];
      if (urlObj.pathname.startsWith('/shorts/')) return urlObj.pathname.split('/')[2];
    }
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.substring(1);
    }
  } catch (e) {}
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default async function PublicProfilePage({ params }: { params: { slug: string } }) {
  const data = await getPublicAthleteData(params.slug);

  if (!data || !data.athlete) {
    notFound();
  }

  const { athlete, matches, trainings, videos, videoEvents, posProfile } = data;

  // Fetch evaluations
  const evaluations = await getAthleteEvaluations(athlete.id);
  const evaluationTemplates = await getEvaluationTemplates();

  const positionLabels: Record<string, string> = {
    goalkeeper: 'Goleiro',
    defender: 'Zagueiro',
    full_back: 'Lateral',
    midfielder: 'Meio-campo',
    forward: 'Atacante',
  };

  const footLabels: Record<string, string> = {
    left: 'Esquerdo',
    right: 'Direito',
    both: 'Ambidestro',
  };

  const validRatings = matches.filter(m => m.self_rating != null).map(m => m.self_rating as number);
  const averageRating = validRatings.length > 0 
    ? (validRatings.reduce((a, b) => a + b, 0) / validRatings.length).toFixed(1)
    : 'N/A';

  const totalTrainings = trainings.length;
  const totalMatches = matches.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-emerald-500/30">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 md:p-12 mb-12 shadow-2xl">
          <div className="absolute top-0 right-0 p-32 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center text-4xl font-bold text-slate-500 overflow-hidden shadow-inner">
              {athlete.avatar_url ? (
                <img src={`${athlete.avatar_url}?v=${Date.now()}`} alt={athlete.full_name?.substring(0, 2).toUpperCase() || 'Avatar'} className="w-full h-full object-cover" />
              ) : (
                athlete.full_name?.substring(0, 2).toUpperCase()
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-4">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400">
                {athlete.full_name}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-400 text-sm md:text-base font-medium">
                {athlete.position && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/50">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    {posProfile?.position_profiles?.name || positionLabels[athlete.position] || athlete.position}
                    {posProfile?.position_roles && (
                      <span className="text-slate-500 ml-1 font-normal">
                        ({(posProfile.position_roles as any).name})
                      </span>
                    )}
                  </span>
                )}
                {athlete.club && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/50">
                    <Award className="w-4 h-4 text-emerald-400" />
                    {athlete.club}
                  </span>
                )}
                {(athlete.city || athlete.state) && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/50">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    {[athlete.city, athlete.state].filter(Boolean).join(', ')}
                  </span>
                )}
                {athlete.date_of_birth && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/50">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    {calculateAge(athlete.date_of_birth)} anos
                  </span>
                )}
              </div>

              {/* Social Links */}
              {(athlete.instagram_url || athlete.youtube_url) && (
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
                  {athlete.instagram_url && (
                    <a href={athlete.instagram_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-pink-500/25">
                      <Instagram className="w-4 h-4" /> Instagram
                    </a>
                  )}
                  {athlete.youtube_url && (
                    <a href={athlete.youtube_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-red-500/25">
                      <Youtube className="w-4 h-4" /> YouTube
                    </a>
                  )}
                </div>
              )}
              
              {athlete.bio && (
                <p className="mt-6 text-slate-300 leading-relaxed max-w-2xl text-lg">
                  {athlete.bio}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center hover:border-emerald-500/30 transition-colors">
            <div className="text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Nota Média</div>
            <div className="text-4xl md:text-5xl font-black text-white">{averageRating}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center hover:border-emerald-500/30 transition-colors">
            <div className="text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Partidas</div>
            <div className="text-4xl md:text-5xl font-black text-white">{totalMatches}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center hover:border-emerald-500/30 transition-colors">
            <div className="text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Treinos</div>
            <div className="text-4xl md:text-5xl font-black text-white">{totalTrainings}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center hover:border-emerald-500/30 transition-colors flex flex-col justify-center">
            <div className="text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Pé Dominante</div>
            <div className="text-2xl font-bold text-white capitalize">{footLabels[athlete.dominant_foot] || athlete.dominant_foot || '-'}</div>
          </div>
        </div>

        {/* Performance Chart Section */}
        {matches.filter((m: any) => m.self_rating != null && m.self_rating > 0).length >= 2 && (
          <div className="mb-12 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none"></div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
              Evolução de Desempenho
            </h2>
            <p className="text-slate-400 text-sm mb-6">Acompanhamento das notas nas últimas partidas disputadas.</p>
            <PerformanceChart matches={matches} />
          </div>
        )}

        {/* Multidimensional Evaluation Section */}
        <div className="mb-12 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <BrainCircuit className="w-6 h-6 text-emerald-400" />
                Avaliação Multidimensional
              </h2>
              <p className="text-slate-400 text-sm mt-1">Média das notas dadas por treinadores e olheiros.</p>
            </div>
            {/* Botão visível para quem tem acesso de escrita. No MVP, mostramos para testar */}
            <EvaluationForm athleteId={athlete.id} evaluatorId={athlete.user_id} templates={evaluationTemplates} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <EvaluationRadar evaluations={evaluations} />
            
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-200">Últimas Avaliações</h3>
              {evaluations.length === 0 ? (
                <p className="text-slate-500">Nenhuma nota registrada.</p>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800">
                  {evaluations.slice(0, 5).map((ev: any) => (
                    <div key={ev.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-emerald-400 font-medium text-sm">
                          {new Date(ev.date).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="text-slate-500 text-xs bg-slate-900 px-2 py-1 rounded">
                          {ev.context || 'Geral'}
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm mb-3">
                        {ev.general_notes || 'Sem observações gerais.'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {ev.evaluation_scores?.slice(0, 3).map((s: any, idx: number) => (
                          <span key={idx} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded flex items-center gap-1 border border-slate-700">
                            <span className="text-emerald-400 font-bold">{s.score}</span> 
                            {s.evaluation_items?.competence}
                          </span>
                        ))}
                        {ev.evaluation_scores?.length > 3 && (
                          <span className="text-xs text-slate-500 flex items-center">
                            +{ev.evaluation_scores.length - 3} mais
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Videos Section */}
        {videos.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <PlayCircle className="w-6 h-6 text-emerald-400" />
              Vídeos em Destaque
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {videos.map((video: any) => {
                const events = videoEvents.filter((e: any) => e.video_id === video.id);
                return (
                  <PublicVideoPlayer key={video.id} video={video} events={events} />
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
