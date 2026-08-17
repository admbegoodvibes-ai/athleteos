'use client';

import Link from 'next/link';
import { Activity, Target, Brain, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MetodologiaPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navbar */}
      <header className="w-full px-6 py-6 flex justify-between items-center max-w-7xl mx-auto bg-slate-50/80 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="font-bold text-2xl tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#0891b2] flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          ATHLETE<span className="font-light">OS</span>
        </Link>
        
        <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
          <Link href="/para-atletas" className="hover:text-[#0891b2] transition-colors">Para Atletas</Link>
          <Link href="/clubes" className="hover:text-[#0891b2] transition-colors">Clubes e Escolinhas</Link>
          <Link href="/metodologia" className="text-[#0891b2] font-bold transition-colors">Metodologia</Link>
          <Link href="/sobre" className="hover:text-[#0891b2] transition-colors">Sobre</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-[#0891b2] transition-colors hidden sm:block">
            Login
          </Link>
          <Link href="/register">
             <Button className="bg-[#06b6d4] hover:bg-[#0891b2] text-white rounded-full px-6 font-semibold shadow-lg">
               Começar Agora
             </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center">
        {/* Hero */}
        <div className="text-center max-w-3xl mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-bold mb-6">
            <Zap className="w-4 h-4" /> Padrão OATHIA
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
            A Ciência por trás do <span className="text-[#06b6d4]">Desenvolvimento.</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Nossa metodologia proprietária baseada em dados reais e vídeo para medir exatamente o que importa no futebol moderno.
          </p>
        </div>

        {/* OATHIA Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
           {/* O */}
           <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="text-4xl font-extrabold text-slate-200 mb-4">01</div>
              <h3 className="text-2xl font-bold text-[#06b6d4] mb-2">Observação</h3>
              <p className="text-slate-600">Captação de vídeo de alta qualidade e identificação dos momentos chave da partida que definem a performance do atleta.</p>
           </div>
           {/* A */}
           <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="text-4xl font-extrabold text-slate-200 mb-4">02</div>
              <h3 className="text-2xl font-bold text-[#06b6d4] mb-2">Análise</h3>
              <p className="text-slate-600">Extração de dados técnicos e táticos usando inteligência artificial para criar estatísticas confiáveis (OATHIA Data Standard).</p>
           </div>
           {/* T */}
           <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="text-4xl font-extrabold text-slate-200 mb-4">03</div>
              <h3 className="text-2xl font-bold text-[#06b6d4] mb-2">Técnica</h3>
              <p className="text-slate-600">Avaliação detalhada dos fundamentos: passe, domínio, finalização e duelos defensivos por posição.</p>
           </div>
           {/* H */}
           <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="text-4xl font-extrabold text-slate-200 mb-4">04</div>
              <h3 className="text-2xl font-bold text-[#06b6d4] mb-2">Habilidade</h3>
              <p className="text-slate-600">Mensuração da capacidade de resolver problemas em espaços curtos e tomada de decisão sob pressão.</p>
           </div>
           {/* I */}
           <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="text-4xl font-extrabold text-slate-200 mb-4">05</div>
              <h3 className="text-2xl font-bold text-[#06b6d4] mb-2">Inteligência</h3>
              <p className="text-slate-600">Leitura de jogo tática, posicionamento sem bola e compreensão das fases do jogo (transições e organização).</p>
           </div>
           {/* A */}
           <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="text-4xl font-extrabold text-slate-200 mb-4">06</div>
              <h3 className="text-2xl font-bold text-[#06b6d4] mb-2">Atitude</h3>
              <p className="text-slate-600">Índice de consistência comportamental: engajamento nos treinos, resposta a feedbacks e resiliência em campo.</p>
           </div>
        </div>
      </main>
    </div>
  );
}
