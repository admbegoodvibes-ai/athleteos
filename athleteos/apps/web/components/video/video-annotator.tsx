'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Trash2, Clock, Play } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { addVideoEvent, removeVideoEvent } from '@/app/actions/media';
import YouTube from 'react-youtube';

interface VideoAnnotatorProps {
  video: any;
  athleteId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function VideoAnnotator({ video, athleteId, isOpen, onClose }: VideoAnnotatorProps) {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [eventType, setEventType] = useState('Gol');
  const [description, setDescription] = useState('');
  const [currentTime, setCurrentTime] = useState(0);

  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen && video?.id) {
      fetchEvents();
    }
  }, [isOpen, video]);

  const fetchEvents = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('video_events')
      .select('*')
      .eq('video_id', video.id)
      .order('timestamp_seconds', { ascending: true });
    
    if (data) setEvents(data);
    setIsLoading(false);
  };

  const extractYoutubeId = (url: string) => {
    if (!url) return null;
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com')) {
        return urlObj.searchParams.get('v');
      }
      if (urlObj.hostname.includes('youtu.be')) {
        return urlObj.pathname.slice(1);
      }
    } catch (e) {
      return null;
    }
    return null;
  };

  const videoId = extractYoutubeId(video?.url || '');

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleAddEvent = async () => {
    setIsSubmitting(true);
    // Get current time from player if possible
    let timeToSave = currentTime;
    if (playerRef.current) {
      timeToSave = Math.floor(playerRef.current.getCurrentTime());
    }

    const result = await addVideoEvent(video.id, athleteId, timeToSave, eventType, description);
    if (result.error) {
      toast.error('Erro ao salvar lance: ' + result.error);
    } else {
      toast.success('Lance salvo com sucesso!');
      setDescription('');
      fetchEvents();
    }
    setIsSubmitting(false);
  };

  const handleRemoveEvent = async (eventId: string) => {
    const result = await removeVideoEvent(eventId, athleteId);
    if (result.error) {
      toast.error('Erro ao remover lance: ' + result.error);
    } else {
      toast.success('Lance removido!');
      fetchEvents();
    }
  };

  const jumpToTime = (seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds, true);
      playerRef.current.playVideo();
    }
  };

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl bg-slate-950 border-slate-800 text-slate-200 h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-emerald-400 text-xl font-bold">Editor de Lances (Event Tagging)</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
          {/* Video Player Column */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="bg-black rounded-xl overflow-hidden aspect-video border border-slate-800">
              {videoId ? (
                <YouTube 
                  videoId={videoId} 
                  opts={opts} 
                  onReady={(e: any) => playerRef.current = e.target}
                  className="w-full h-full"
                  iframeClassName="w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500">
                  URL de vídeo inválida
                </div>
              )}
            </div>

            {/* Add Event Form */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                Marcar Lance no Tempo Atual
              </h3>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Select value={eventType} onValueChange={setEventType}>
                    <SelectTrigger className="bg-slate-950/50 border-slate-700">
                      <SelectValue placeholder="Tipo de Lance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gol">Gol</SelectItem>
                      <SelectItem value="Assistência">Assistência</SelectItem>
                      <SelectItem value="Desarme">Desarme</SelectItem>
                      <SelectItem value="Drible">Drible</SelectItem>
                      <SelectItem value="Passe Chave">Passe Chave</SelectItem>
                      <SelectItem value="Defesa (Goleiro)">Defesa (Goleiro)</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-[2]">
                  <Input 
                    placeholder="Descrição rápida (opcional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-slate-950/50 border-slate-700"
                  />
                </div>
                <Button 
                  onClick={handleAddEvent}
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar Lance'}
                </Button>
              </div>
            </div>
          </div>

          {/* Timeline Column */}
          <div className="w-full md:w-80 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-slate-900/50">
              <h3 className="font-semibold text-white">Timeline de Eventos</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {isLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-emerald-500" /></div>
              ) : events.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">Nenhum lance marcado neste vídeo ainda.</p>
              ) : (
                events.map(event => (
                  <div key={event.id} className="flex items-start justify-between gap-3 p-3 bg-slate-950/50 border border-slate-800 rounded-lg group">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-slate-800 text-emerald-400 text-xs font-bold rounded font-mono">
                          {formatTime(event.timestamp_seconds)}
                        </span>
                        <span className="text-sm font-semibold text-slate-200 truncate">{event.event_type}</span>
                      </div>
                      {event.description && (
                        <p className="text-xs text-slate-400 truncate">{event.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-7 w-7 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                        onClick={() => jumpToTime(event.timestamp_seconds)}
                      >
                        <Play className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        onClick={() => handleRemoveEvent(event.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
