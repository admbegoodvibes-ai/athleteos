'use client';

import Link from 'next/link';
import { Activity, ShieldCheck, Users, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ClubesPage() {
  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-100">
      {/* Navbar */}
      <header className="w-full px-6 py-6 flex justify-between items-center max-w-7xl mx-auto z-50">
        <Link href="/" className="font-bold text-2xl tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <Activity className="w-5 h-5 text-slate-900" />
          </div>
          ATHLETE<span className="font-light">OS</span>
        </Link>
        
        <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
          <Link href="/para-atletas" className="hover:text-white transition-colors">Para Atletas</Link>
          <Link href="/clubes" className="text-white font-bold transition-colors">Clubes e Escolinhas</Link>
          <Link href="/metodologia" className="hover:text-white transition-colors">Metodologia</Link>
          <Link href="/sobre" className="hover:text-white transition-colors">Sobre</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/demo">
             <Button className="bg-[#06b6d4] hover:bg-[#0891b2] text-white rounded-full px-6 font-semibold shadow-lg">
               Solicitar Demo
             </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center">
        {/* Hero */}
        <div className="text-center max-w-3xl mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Gestão de Elite para o seu <span className="text-[#06b6d4]">Clube Formador.</span>
          </h1>
          <p className="text-xl text-slate-400 mb-8">
            Transforme a forma como você avalia seus elencos, gerencia seus treinadores e se comunica com os pais. Tudo centralizado no AthleteOS.
          </p>
          <div className="flex justify-center gap-4">
             <Link href="/demo">
                <Button size="lg" className="bg-[#06b6d4] hover:bg-[#0891b2] text-white rounded-full px-8 h-14 text-lg font-bold shadow-xl">
                  Agendar Demonstração
                </Button>
             </Link>
             <Link href="/dashboard">
                <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-full px-8 h-14 text-lg font-bold">
                  Ver Dashboard
                </Button>
             </Link>
          </div>
        </div>

        {/* Dashboard Preview / Features */}
        <div className="w-full aspect-video md:aspect-[21/9] bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative mb-20">
           <img 
              src="/images/clubes_dashboard_1786452794019.jpg" 
              alt="AthleteOS Club Dashboard Preview" 
              className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent pointer-events-none"></div>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full">
           <div className="flex flex-col gap-4">
              <Users className="w-10 h-10 text-[#06b6d4]" />
              <h3 className="text-2xl font-bold text-white">Gestão de Elenco</h3>
              <p className="text-slate-400">Acompanhe o tempo de jogo de cada atleta, garantindo que ninguém fique de fora da metodologia de desenvolvimento do clube.</p>
           </div>
           <div className="flex flex-col gap-4">
              <BarChart3 className="w-10 h-10 text-[#06b6d4]" />
              <h3 className="text-2xl font-bold text-white">Analytics Avançado</h3>
              <p className="text-slate-400">Visualize a progressão de habilidades por posição e monitore o índice de consistência de evolução ao longo da temporada.</p>
           </div>
           <div className="flex flex-col gap-4">
              <ShieldCheck className="w-10 h-10 text-[#06b6d4]" />
              <h3 className="text-2xl font-bold text-white">Engajamento Seguro</h3>
              <p className="text-slate-400">Compartilhe relatórios e vídeos diretamente com os pais, criando transparência sem interrupções no processo do treinador.</p>
           </div>
        </div>
      </main>
    </div>
  );
}
