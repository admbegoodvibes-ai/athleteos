'use client';

import { useState, useRef } from 'react';
import YouTube from 'react-youtube';
import { Play } from 'lucide-react';

interface PublicVideoPlayerProps {
  video: any;
  events: any[];
}

export function PublicVideoPlayer({ video, events }: PublicVideoPlayerProps) {
  const playerRef = useRef<any>(null);

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

  const videoId = extractYoutubeId(video.storage_path || '');

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="aspect-video bg-black relative">
        {videoId ? (
          <YouTube 
            videoId={videoId} 
            opts={opts} 
            onReady={(e: any) => playerRef.current = e.target}
            className="absolute inset-0 w-full h-full"
            iframeClassName="w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500">URL inválida</div>
        )}
      </div>
      
      {/* Info and Timeline */}
      <div className="p-4 md:p-6">
        <h3 className="text-lg font-bold text-white mb-4">{video.title || 'Vídeo sem título'}</h3>
        
        {events.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">Momentos Chave</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {events.map((event) => (
                <button
                  key={event.id}
                  onClick={() => jumpToTime(event.timestamp_seconds)}
                  className="flex items-center gap-3 p-3 text-left bg-slate-950/50 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 rounded-xl transition-all group"
                >
                  <div className="bg-emerald-500/10 text-emerald-400 p-2 rounded-lg group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-mono text-xs font-bold">{formatTime(event.timestamp_seconds)}</span>
                      <span className="text-slate-200 text-sm font-semibold">{event.event_type}</span>
                    </div>
                    {event.description && (
                      <p className="text-slate-400 text-xs truncate max-w-[200px]">{event.description}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
