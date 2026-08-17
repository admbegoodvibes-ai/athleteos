'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addVideo, removeVideo } from '@/app/actions/media';
import { toast } from 'sonner';
import { Loader2, PlayCircle, Trash2, ListVideo, Sparkles, Lock, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { VideoAnnotator } from '@/components/video/video-annotator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface VideoManagerProps {
  athleteId: string;
  isPro?: boolean;
}

export function VideoManager({ athleteId, isPro = false }: VideoManagerProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [annotatingVideo, setAnnotatingVideo] = useState<any>(null);
  const [showUpsell, setShowUpsell] = useState(false);

  const fetchVideos = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('media_assets')
      .select('*')
      .eq('athlete_id', athleteId)
      .eq('asset_type', 'video')
      .order('created_at', { ascending: false });
      
    if (data) {
      setVideos(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchVideos();
  }, [athleteId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      toast.error('Por favor, insira um link válido do YouTube.');
      return;
    }
    setIsSubmitting(true);
    const result = await addVideo(athleteId, url, title);
    if (result.error) {
      toast.error('Erro ao adicionar vídeo: ' + result.error);
    } else {
      toast.success('Vídeo adicionado com sucesso!');
      setUrl('');
      setTitle('');
      fetchVideos();
    }
    setIsSubmitting(false);
  };

  const handleRemove = async (videoId: string) => {
    if (!confirm('Deseja realmente remover este vídeo?')) return;
    const result = await removeVideo(videoId, athleteId);
    if (result.error) {
      toast.error('Erro ao remover vídeo.');
    } else {
      toast.success('Vídeo removido!');
      fetchVideos();
    }
  };

  return (
    <div className="space-y-6">
      {/* UPSell Banner */}
      <div 
        onClick={() => !isPro && setShowUpsell(true)}
        className={`relative overflow-hidden p-6 rounded-xl border ${isPro ? 'bg-emerald-950/20 border-emerald-500/20' : 'bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border-indigo-500/30 cursor-pointer hover:border-indigo-400/50 transition-all group'}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className={`w-5 h-5 ${isPro ? 'text-emerald-400' : 'text-indigo-400'}`} />
              Editor de Inteligência Artificial (PLUS)
            </h3>
            <p className="text-sm text-slate-300 mt-1">
              Faça upload do jogo completo e deixe nossa IA cortar os melhores momentos automaticamente.
            </p>
          </div>
          {!isPro && (
            <div className="flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg group-hover:scale-105 transition-transform">
              <Lock className="w-4 h-4" />
              Desbloquear
            </div>
          )}
        </div>
      </div>
      <form onSubmit={handleAdd} className="space-y-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
        <div className="space-y-2">
          <Label htmlFor="videoTitle">Título do Vídeo (Opcional)</Label>
          <Input 
            id="videoTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-slate-950/50 border-slate-800"
            placeholder="Ex: Melhores Momentos 2026"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="videoUrl">Link do YouTube</Label>
          <Input 
            id="videoUrl"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-slate-950/50 border-slate-800"
            placeholder="https://www.youtube.com/watch?v=..."
            required
          />
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white border-0">
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlayCircle className="mr-2 h-4 w-4" />}
          Adicionar Vídeo
        </Button>
      </form>

      <div className="space-y-4">
        <h3 className="font-medium text-slate-300">Vídeos Adicionados ({videos.length})</h3>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          </div>
        ) : videos.length === 0 ? (
          <p className="text-slate-500 text-sm">Nenhum vídeo cadastrado.</p>
        ) : (
          <div className="space-y-3">
            {videos.map(video => (
              <div key={video.id} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-slate-800">
                <div className="flex items-center gap-3 overflow-hidden">
                  <PlayCircle className="h-8 w-8 text-emerald-500 flex-shrink-0" />
                  <div className="truncate">
                    <p className="text-sm font-medium text-slate-200 truncate">{video.title || 'Vídeo sem título'}</p>
                    <a href={video.url} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline truncate block">
                      {video.url}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" type="button" onClick={() => setAnnotatingVideo(video)} className="text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20">
                    <ListVideo className="h-4 w-4 mr-2" />
                    Anotar Lances
                  </Button>
                  <Button variant="ghost" size="icon" type="button" onClick={() => handleRemove(video.id)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {annotatingVideo && (
        <VideoAnnotator 
          video={annotatingVideo}
          athleteId={athleteId}
          isOpen={!!annotatingVideo}
          onClose={() => setAnnotatingVideo(null)}
        />
      )}

      <Dialog open={showUpsell} onOpenChange={setShowUpsell}>
        <DialogContent className="sm:max-w-[600px] bg-slate-950 border border-slate-800 text-slate-100">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-400" />
              Desbloqueie o Editor IA (Plano PLUS)
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-base mt-2">
              Imagine não precisar mais assistir a jogos inteiros para cortar os lances do seu filho. Com o Plano PLUS, você envia o vídeo do jogo e nossa IA cria a vitrine perfeita em minutos.
            </DialogDescription>
          </DialogHeader>
          
          <div className="aspect-video bg-black rounded-lg border border-slate-800 my-4 flex items-center justify-center overflow-hidden relative">
            {/* Fake Video Preview */}
            <div className="absolute inset-0 bg-indigo-950/20 flex flex-col items-center justify-center text-center p-6">
              <PlayCircle className="w-16 h-16 text-indigo-500/80 mb-4 animate-pulse" />
              <p className="text-indigo-200 font-semibold">[ Vídeo de Apresentação da Inteligência Artificial ]</p>
              <p className="text-sm text-indigo-300/60 mt-2">Veja como clubes europeus economizam 10h de análise por jogo.</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpsell(false)} className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
              Talvez Depois
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 font-bold">
              Fazer Upgrade <ArrowRight className="w-4 h-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
