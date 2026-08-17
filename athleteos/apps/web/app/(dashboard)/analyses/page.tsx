import { getMyAthletes } from '@/app/actions/profile';
import { getVideosForAthlete } from '@/app/actions/videos';
import { Target, Search, Plus, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { VideoForm } from '@/components/forms/video-form';
import { deleteVideo } from '@/app/actions/videos';

function extractYoutubeId(url: string) {
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

export default async function AnalysesPage() {
  const athletes = await getMyAthletes();
  
  if (!athletes || athletes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/10 border border-emerald-500/20">
          <Target className="h-12 w-12 text-emerald-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-100 mb-4">
          Central de <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">Análises</span>
        </h1>
        <p className="text-slate-400 max-w-md mb-8 text-lg">
          Você precisa ter atletas vinculados para acessar as análises de vídeo.
        </p>
      </div>
    );
  }

  // Fetch all videos for all athletes
  const athletesWithVideos = await Promise.all(
    athletes.map(async (athlete: any) => {
      const videos = await getVideosForAthlete(athlete.id);
      return { ...athlete, videos };
    })
  );

  return (
    <div className="p-8 animate-in fade-in zoom-in-95 duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20">
              <Target className="h-6 w-6 text-emerald-400" />
            </div>
            Central de <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">Análises</span>
          </h1>
          <p className="text-slate-400 mt-2">Gerencie e assista aos vídeos e lances dos seus atletas.</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium shadow-lg shadow-emerald-500/20">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Vídeo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-slate-950 border-slate-800 text-slate-200">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">Novo Vídeo</DialogTitle>
            </DialogHeader>
            <VideoForm athletes={athletes} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-12">
        {athletesWithVideos.map((athlete: any) => (
          <div key={athlete.id} className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-200 border-b border-slate-800 pb-2">
              {athlete.full_name}
            </h2>
            
            {athlete.videos.length === 0 ? (
              <div className="text-slate-500 bg-slate-900/50 rounded-xl p-8 text-center border border-slate-800 border-dashed">
                Nenhum vídeo adicionado para este atleta.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {athlete.videos.map((video: any) => {
                  const ytId = extractYoutubeId(video.storage_path);
                  
                  return (
                    <div key={video.id} className="group relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 shadow-md hover:shadow-emerald-500/10">
                      {ytId ? (
                        <a 
                          href={video.storage_path} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="group/video relative aspect-video w-full bg-slate-950 block overflow-hidden"
                        >
                          <img 
                            src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`} 
                            alt={video.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover/video:scale-105 opacity-80 group-hover/video:opacity-100"
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 group-hover/video:bg-black/20 transition-colors">
                            <PlayCircle className="h-12 w-12 text-white/90 drop-shadow-md mb-2" />
                            <span className="text-white text-xs font-medium bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
                              Assistir direto no YouTube
                            </span>
                          </div>
                        </a>
                      ) : (
                        <div className="aspect-video w-full bg-slate-800 flex flex-col items-center justify-center text-slate-500">
                          <PlayCircle className="h-12 w-12 opacity-50 mb-2" />
                          <span className="text-sm">Vídeo Indisponível</span>
                        </div>
                      )}
                      
                      <div className="p-4">
                        <h3 className="font-medium text-slate-200 line-clamp-1 group-hover:text-emerald-400 transition-colors">
                          {video.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 truncate">
                          Link: <a href={video.storage_path} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">{video.storage_path}</a>
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Adicionado em {new Date(video.created_at).toLocaleDateString('pt-BR')}
                        </p>
                        <form action={deleteVideo}>
                          <input type="hidden" name="id" value={video.id} />
                          <button type="submit" className="mt-2 text-xs text-red-500 hover:text-red-400 font-medium">Excluir Vídeo</button>
                        </form>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
