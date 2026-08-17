import Link from 'next/link'
import { Activity, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0891b2] to-[#06b6d4] overflow-hidden selection:bg-white/30 font-sans">
      {/* Navbar */}
      <header className="w-full px-6 py-6 flex justify-between items-center max-w-7xl mx-auto text-white">
        <div className="font-bold text-2xl tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <Activity className="w-5 h-5 text-[#0891b2]" />
          </div>
          ATHLETE<span className="font-light">OS</span>
        </div>
        
        <nav className="hidden md:flex gap-8 text-sm font-medium text-white/90">
          <Link href="/para-atletas" className="hover:text-white transition-colors">Para Atletas</Link>
          <Link href="/clubes" className="hover:text-white transition-colors">Clubes e Escolinhas</Link>
          <Link href="/metodologia" className="hover:text-white transition-colors">Metodologia</Link>
          <Link href="/sobre" className="hover:text-white transition-colors">Sobre</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-white/80 transition-colors hidden sm:block">
            Login
          </Link>
          <Link href="/register">
            <Button className="bg-[#06b6d4] hover:bg-[#0891b2] text-white rounded-full px-6 font-semibold shadow-lg">
              Começar Agora
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-12 md:pt-24 pb-20 flex flex-col lg:flex-row items-center gap-12">
        {/* Left Side - Text & CTA */}
        <div className="flex-1 text-left z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] mb-6">
            Descubra Talentos,<br />
            <span className="text-[#67e8f9]">Usando Vídeo e Dados.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-lg font-medium">
            A plataforma mais confiável para desenvolvimento técnico, análise tática e scouting no futebol de base.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto bg-[#06b6d4] hover:bg-[#0891b2] text-white rounded-full px-8 h-12 text-base font-bold shadow-xl border border-[#22d3ee]/50">
                Criar Conta Grátis
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-full px-8 h-12 text-base font-bold">
                Saiba Mais
              </Button>
            </Link>
          </div>

          {/* Social Proof Stats */}
          <div className="flex flex-wrap gap-8 text-sm text-white/80 font-medium items-center">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">+5,000</span> Atletas Base
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#67e8f9]"></div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">+50</span> Escolinhas
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#67e8f9]"></div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">Inteligência OATHIA</span>
            </div>
          </div>
        </div>

        {/* Right Side - Interactive Video Highlight */}
        <div className="flex-1 relative w-full h-[400px] md:h-[500px] flex items-center justify-center">
          <div className="relative w-full max-w-[600px] aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl group cursor-pointer border border-white/10">
            {/* Video Player overlaying the image */}
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              poster="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            >
               <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
            </video>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-white transition-all">
                  <Play className="w-6 h-6 text-white group-hover:text-[#0891b2] ml-1" />
                </div>
                <div>
                   <h3 className="text-white font-bold text-xl">Highlights Sub-15</h3>
                   <p className="text-white/80 text-sm font-medium">Análise Tática Automatizada</p>
                </div>
              </div>
              {/* Video Timeline Bar */}
              <div className="mt-6 h-1 bg-white/30 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-[#06b6d4] rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Worldview Section */}
      <section className="w-full bg-[#f8fafc] text-slate-900 py-24">
        <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse lg:flex-row items-center gap-16">
          {/* Left Side - Text */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-8">
               <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center shadow-lg">
                 <div className="w-6 h-6 bg-[#0ea5e9] rounded-full flex items-center justify-center">
                    <Play className="w-3 h-3 text-white ml-0.5" />
                 </div>
               </div>
               <div>
                 <h4 className="text-xl font-extrabold text-slate-900 leading-none tracking-tight">ATHLETEOS</h4>
                 <h4 className="text-lg font-light text-slate-500 leading-none tracking-[0.2em] uppercase mt-1">WORLDVIEW</h4>
               </div>
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.1]">
              Uma Nova Era <br/>do AthleteOS
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-md">
              A inteligência artificial que lê o jogo como os melhores olheiros do mundo. 
              Mapeamento de posicionamento, dominância de pé e perfil físico em tempo real.
            </p>
          </div>

          {/* Right Side - Image with AI Bounding Box */}
          <div className="flex-1 w-full relative">
            <div className="w-full aspect-[4/5] md:aspect-square bg-slate-200 rounded-3xl overflow-hidden relative shadow-2xl border border-slate-200">
               <img src="https://images.unsplash.com/photo-1518605368461-1ee7c5320673?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Worldview Analysis" className="w-full h-full object-cover" />
               
               {/* AI Bounding Box Overlay */}
               <div className="absolute inset-x-12 inset-y-12 md:inset-x-20 md:inset-y-16 border border-white/60 rounded-3xl bg-white/10 backdrop-blur-[2px] pointer-events-none flex flex-col justify-between p-6 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                  {/* Top corners */}
                  <div className="absolute -top-[1px] -left-[1px] w-6 h-6 border-t-4 border-l-4 border-white rounded-tl-3xl"></div>
                  <div className="absolute -top-[1px] -right-[1px] w-6 h-6 border-t-4 border-r-4 border-white rounded-tr-3xl"></div>
                  <div className="absolute -bottom-[1px] -left-[1px] w-6 h-6 border-b-4 border-l-4 border-white rounded-bl-3xl"></div>
                  <div className="absolute -bottom-[1px] -right-[1px] w-6 h-6 border-b-4 border-r-4 border-white rounded-br-3xl"></div>
                  
                  {/* Stats Top */}
                  <div className="flex justify-between text-white drop-shadow-md">
                     <div>
                        <p className="text-xs text-white/90 uppercase tracking-wider font-medium">Posição</p>
                        <p className="text-3xl font-extrabold">ATA</p>
                     </div>
                     <div className="text-right">
                        <p className="text-xs text-white/90 uppercase tracking-wider font-medium">Pé</p>
                        <p className="text-3xl font-extrabold">Dir</p>
                     </div>
                  </div>
                  
                  {/* Stats Bottom */}
                  <div className="flex justify-between items-end text-white drop-shadow-md">
                     <div>
                        <p className="text-xs text-white/90 uppercase tracking-wider font-medium">Nasc</p>
                        <p className="text-3xl font-extrabold">2013</p>
                     </div>
                     <div className="flex flex-col items-end gap-1">
                        <p className="text-xs text-white/90 uppercase tracking-wider font-medium">Brasil</p>
                        <div className="w-8 h-5 bg-white overflow-hidden shadow-sm rounded-sm relative">
                           {/* Bandeira do Brasil CSS */}
                           <div className="absolute inset-0 bg-[#009b3a]"></div>
                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-3.5 bg-[#fedf00]" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}></div>
                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#002776] rounded-full"></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>
      {/* Game Analysis Section */}
      <section className="w-full bg-white text-slate-900 py-24">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
          {/* Left Side - Image with Floating Cards */}
          <div className="flex-1 w-full relative">
            <div className="w-full aspect-square md:aspect-[4/3] bg-gradient-to-br from-[#2563eb] to-[#06b6d4] rounded-3xl overflow-hidden relative shadow-2xl flex items-center justify-center p-8">
               <img src="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Analysis" className="w-64 md:w-80 rounded-2xl shadow-lg relative z-10" />
               
               {/* Floating Badges */}
               <div className="absolute top-1/4 right-8 bg-white rounded-xl shadow-xl p-4 z-20 hidden md:block">
                 <p className="text-[10px] font-bold text-[#0ea5e9] mb-1">PLAYER RATING</p>
                 <div className="flex items-baseline gap-1">
                   <span className="text-3xl font-extrabold text-slate-800">7.5</span>
                   <span className="text-xs text-slate-400 font-bold">/10</span>
                 </div>
                 <div className="w-full h-1.5 bg-slate-100 mt-2 rounded-full overflow-hidden">
                   <div className="w-3/4 h-full bg-[#0ea5e9]"></div>
                 </div>
               </div>

               <div className="absolute bottom-1/4 left-4 bg-white rounded-xl shadow-xl p-4 z-20 w-56 hidden md:block">
                 <p className="text-[10px] font-bold text-slate-400 mb-3">EVENT LIST</p>
                 <div className="space-y-3">
                   <div className="flex justify-between items-center text-[10px] font-bold border-b border-slate-50 pb-2">
                     <span className="text-slate-500">00:23</span>
                     <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden"><div className="w-full h-full bg-[#0ea5e9]"></div></div>
                     <span className="text-slate-800">PASS</span>
                   </div>
                   <div className="flex justify-between items-center text-[10px] font-bold border-b border-slate-50 pb-2">
                     <span className="text-slate-500">06:14</span>
                     <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden"><div className="w-2/3 h-full bg-[#0ea5e9]"></div></div>
                     <span className="text-slate-800">TACKLE</span>
                   </div>
                 </div>
               </div>

                <div className="absolute top-1/4 right-8 bg-white rounded-xl shadow-xl p-4 z-20 hidden md:block">
                 <p className="text-[10px] font-bold text-[#0ea5e9] mb-1">NOTA DO ATLETA</p>
                 <div className="flex items-baseline gap-1">
                   <span className="text-3xl font-extrabold text-slate-800">7.5</span>
                   <span className="text-xs text-slate-400 font-bold">/10</span>
                 </div>
                 <div className="w-full h-1.5 bg-slate-100 mt-2 rounded-full overflow-hidden">
                   <div className="w-3/4 h-full bg-[#0ea5e9]"></div>
                 </div>
               </div>

               <div className="absolute bottom-1/4 left-4 bg-white rounded-xl shadow-xl p-4 z-20 w-56 hidden md:block">
                 <p className="text-[10px] font-bold text-slate-400 mb-3">LISTA DE EVENTOS</p>
                 <div className="space-y-3">
                   <div className="flex justify-between items-center text-[10px] font-bold border-b border-slate-50 pb-2">
                     <span className="text-slate-500">00:23</span>
                     <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden"><div className="w-full h-full bg-[#0ea5e9]"></div></div>
                     <span className="text-slate-800">PASSE</span>
                   </div>
                   <div className="flex justify-between items-center text-[10px] font-bold border-b border-slate-50 pb-2">
                     <span className="text-slate-500">06:14</span>
                     <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden"><div className="w-2/3 h-full bg-[#0ea5e9]"></div></div>
                     <span className="text-slate-800">DESARME</span>
                   </div>
                 </div>
               </div>

               <div className="absolute -bottom-6 right-12 w-28 h-28 bg-gradient-to-br from-[#7c3aed] to-[#f43f5e] rounded-full border-4 border-white shadow-xl flex items-center justify-center z-30">
                 <div className="text-center leading-none text-white font-bold text-xs">
                   DADOS<br/>OATHIA
                 </div>
               </div>
            </div>
          </div>
          
          {/* Right Side - Text */}
          <div className="flex-1">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-2">
              Análise de Vídeo e<br/>
              <span className="text-[#06b6d4]">Dados do Jogo</span>
            </h2>
            <h3 className="text-xl md:text-2xl font-semibold text-slate-800 mb-8">Vídeo e dados de nível Elite, de forma simples.</h3>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              O AthleteOS foi construído ao lado dos melhores do esporte. Trabalhamos com academias de ponta e clubes formadores para entender como os sistemas de elite identificam e desenvolvem talentos.
            </p>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Destilando esses insights em fundamentos práticos (OATHIA), criamos uma plataforma onde o feedback real é compartilhado, os jogadores são desafiados a crescer, e a evolução se torna visível para todos.
            </p>
            <p className="text-lg font-bold text-slate-800 mb-4">AthleteOS Discover é para muitos, não para poucos.</p>
            <p className="text-lg font-bold text-[#06b6d4]">Conexão. Progressão. Visibilidade.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
