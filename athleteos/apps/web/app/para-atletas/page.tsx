'use client';

import Link from 'next/link';
import { Activity, Star, TrendingUp, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ParaAtletasPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navbar */}
      <header className="w-full px-6 py-6 flex justify-between items-center max-w-7xl mx-auto bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="font-bold text-2xl tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#0891b2] flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          ATHLETE<span className="font-light">OS</span>
        </Link>
        
        <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
          <Link href="/para-atletas" className="text-[#0891b2] font-bold transition-colors">Para Atletas</Link>
          <Link href="/clubes" className="hover:text-[#0891b2] transition-colors">Clubes e Escolinhas</Link>
          <Link href="/metodologia" className="hover:text-[#0891b2] transition-colors">Metodologia</Link>
          <Link href="/sobre" className="hover:text-[#0891b2] transition-colors">Sobre</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-[#0891b2] transition-colors hidden sm:block">
            Login
          </Link>
          <Link href="/register">
             <Button className="bg-[#06b6d4] hover:bg-[#0891b2] text-white rounded-full px-6 font-semibold shadow-lg">
               Criar Conta
             </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center">
        {/* Hero */}
        <div className="text-center max-w-3xl mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6">
            O seu talento, <span className="text-[#06b6d4]">agora visível.</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Construa seu portfólio digital, receba feedback tático em vídeo do seu treinador e acompanhe a sua evolução técnica a cada partida.
          </p>
          <div className="flex justify-center gap-4">
             <Link href="/register">
                <Button size="lg" className="bg-[#06b6d4] hover:bg-[#0891b2] text-white rounded-full px-8 h-14 text-lg font-bold shadow-xl">
                  Começar Minha Jornada
                </Button>
             </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
           <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col items-center text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                 <Video className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Feedback em Vídeo</h3>
              <p className="text-slate-600">Assista aos seus melhores momentos com anotações e áudios gravados diretamente pelo seu treinador.</p>
           </div>
           <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col items-center text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                 <TrendingUp className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Evolução Clara</h3>
              <p className="text-slate-600">Acompanhe seu índice de consistência e veja seus gráficos de habilidade subirem semana após semana.</p>
           </div>
           <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col items-center text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-6">
                 <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Portfólio OATHIA</h3>
              <p className="text-slate-600">Um currículo digital vivo. Compartilhe seu perfil completo com olheiros e garanta sua visibilidade.</p>
           </div>
        </div>
      </main>
    </div>
  );
}
