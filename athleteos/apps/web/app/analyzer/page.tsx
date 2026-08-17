'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Activity, Play, Pause, FastForward, Rewind, MessageSquare, PenTool, Focus, Send } from 'lucide-react';

// Mock data for initial comments
const MOCK_COMMENTS = [
  { id: 1, time: 24, timestamp: '00:24', text: 'Excelente visão de jogo aqui, ótimo passe quebrando a linha.', author: 'Coach Silva' },
  { id: 2, time: 45, timestamp: '00:45', text: 'Ajuste corporal um pouco lento para receber a bola, tente já orientar o corpo antes.', author: 'Coach Silva' },
];

export default function AnalyzerPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState('');
  const [drawMode, setDrawMode] = useState(false);

  const formatTime = (timeInSeconds: number) => {
    const m = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const s = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const jumpToTime = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const addComment = () => {
    if (!newComment.trim()) return;
    
    const newC = {
      id: Date.now(),
      time: currentTime,
      timestamp: formatTime(currentTime),
      text: newComment,
      author: 'Treinador (Você)'
    };
    
    setComments([...comments, newC].sort((a, b) => a.time - b.time));
    setNewComment('');
    
    // Resume video if we were playing
    if (!isPlaying && videoRef.current) {
       videoRef.current.play();
       setIsPlaying(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-100 flex flex-col">
      {/* Navbar Minimalista */}
      <header className="w-full px-6 py-4 flex justify-between items-center border-b border-slate-800 bg-slate-950">
        <Link href="/dashboard" className="font-bold text-xl tracking-tighter flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#06b6d4] flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          ATHLETE<span className="font-light">OS</span> <span className="text-slate-500 text-sm ml-2 hidden sm:inline">| Video Analyzer</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-400">Partida: <span className="text-white font-semibold">Final Sub-15 vs Rival FC</span></div>
          <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden">
             <img src="https://github.com/shadcn.png" alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* ESQUERDA: Video Player */}
        <div className="flex-[2] bg-black p-4 flex flex-col">
          <div className="relative w-full flex-1 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 group">
             
             {/* Vídeo Simulando o Jogo */}
             <video
               ref={videoRef}
               src="https://www.w3schools.com/html/mov_bbb.mp4"
               className="w-full h-full object-contain"
               onTimeUpdate={handleTimeUpdate}
               onLoadedMetadata={handleLoadedMetadata}
               onClick={togglePlay}
             />

             {/* OVERLAY DE DESENHO (Simulação) */}
             {drawMode && (
                <div className="absolute inset-0 cursor-crosshair border-4 border-[#06b6d4]/50">
                   <div className="absolute top-4 left-4 bg-black/60 backdrop-blur text-white px-3 py-1 rounded text-xs">
                      Modo Desenho Ativo - Clique e arraste para circular
                   </div>
                   {/* Exemplo estático de desenho */}
                   <div className="absolute top-1/3 left-1/3 w-32 h-32 border-2 border-dashed border-[#0ea5e9] rounded-full animate-pulse"></div>
                </div>
             )}

             {/* Controles do Player Flutuantes */}
             <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-6 pt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-4">
                {/* Barra de Progresso Customizada */}
                <div className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer relative">
                   <div 
                     className="absolute top-0 left-0 h-full bg-[#06b6d4] rounded-full" 
                     style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                   ></div>
                   {/* Pinos de Comentários na Linha do Tempo */}
                   {comments.map(c => (
                      <div 
                        key={c.id} 
                        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_8px_rgba(250,204,21,0.8)]"
                        style={{ left: `${(c.time / (duration || 1)) * 100}%` }}
                        title={c.text}
                      ></div>
                   ))}
                </div>

                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-6">
                      <button onClick={togglePlay} className="text-white hover:text-[#06b6d4] transition-colors">
                         {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                      </button>
                      <div className="flex items-center gap-4 text-white/70">
                         <button className="hover:text-white transition-colors"><Rewind className="w-5 h-5" /></button>
                         <button className="hover:text-white transition-colors"><FastForward className="w-5 h-5" /></button>
                      </div>
                      <div className="text-sm font-medium tabular-nums">
                         {formatTime(currentTime)} <span className="text-white/40">/ {formatTime(duration)}</span>
                      </div>
                   </div>

                   <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setDrawMode(!drawMode)}
                        className={`p-2 rounded-lg transition-colors ${drawMode ? 'bg-[#06b6d4] text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                        title="Ferramenta de Desenho"
                      >
                         <PenTool className="w-5 h-5" />
                      </button>
                      <button 
                        className="p-2 bg-white/10 text-white/70 hover:bg-white/20 rounded-lg transition-colors"
                        title="Focar no Jogador (Tracking IA)"
                      >
                         <Focus className="w-5 h-5" />
                      </button>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* DIREITA: Painel de Comentários / Feedbacks */}
        <div className="flex-1 flex flex-col bg-slate-950 border-l border-slate-800">
           {/* Imagem Ilustrativa da Avaliação */}
           <div className="w-full h-48 bg-slate-800 relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Coach Evaluation" 
                className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
              <div className="absolute bottom-4 left-6">
                 <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
                    <MessageSquare className="w-5 h-5 text-[#06b6d4]" />
                    Avaliação do Treinador
                 </h2>
                 <p className="text-sm text-slate-300 mt-1">
                    Feedback técnico e tático OATHIA
                 </p>
              </div>
           </div>

           {/* Lista de Comentários */}
           <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {comments.map((comment) => (
                 <div 
                   key={comment.id} 
                   className="bg-slate-900 border border-slate-800 p-4 rounded-xl cursor-pointer hover:border-slate-700 transition-colors"
                   onClick={() => jumpToTime(comment.time)}
                 >
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-xs font-bold text-slate-400">{comment.author}</span>
                       <span className="text-xs font-bold bg-[#0891b2]/20 text-[#22d3ee] px-2 py-1 rounded">
                          {comment.timestamp}
                       </span>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">
                       {comment.text}
                    </p>
                 </div>
              ))}
           </div>

           {/* Input Box para novo feedback */}
           <div className="p-6 bg-slate-900 border-t border-slate-800">
              <div className="flex flex-col gap-3">
                 <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">
                       Adicionando feedback em: <span className="text-white font-bold">{formatTime(currentTime)}</span>
                    </span>
                    {isPlaying && (
                       <button 
                         onClick={() => {
                            videoRef.current?.pause();
                            setIsPlaying(false);
                         }}
                         className="text-xs font-bold text-yellow-500 hover:text-yellow-400"
                       >
                          Pausar Vídeo para Comentar
                       </button>
                    )}
                 </div>
                 <div className="relative">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Ex: Observe o espaço gerado pelo ponta direita..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 pr-12 text-sm text-white resize-none outline-none focus:border-[#06b6d4] transition-colors h-24"
                    />
                    <button 
                      onClick={addComment}
                      disabled={!newComment.trim()}
                      className="absolute bottom-4 right-4 p-2 bg-[#06b6d4] text-white rounded-lg hover:bg-[#0891b2] disabled:opacity-50 disabled:hover:bg-[#06b6d4] transition-colors"
                    >
                       <Send className="w-4 h-4" />
                    </button>
                 </div>
              </div>
           </div>
        </div>

      </main>
    </div>
  );
}
