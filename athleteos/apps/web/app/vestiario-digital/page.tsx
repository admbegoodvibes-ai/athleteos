'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import Link from 'next/link';

const SLIDES = [
  {
    id: 1,
    title: 'Onde feedbacks reais são compartilhados e atletas são desafiados a crescer.',
    subtitle: 'Apresentando o Vestiário Digital',
    color: 'from-[#2563eb] to-[#06b6d4]', // Blue to Cyan
    image: '/images/vestiario_locker_room_1786452342663.jpg'
  },
  {
    id: 2,
    title: 'Cada atleta aprende diferente. Escolha a melhor ferramenta para entregar a mensagem.',
    subtitle: 'Apresentando o Vestiário Digital',
    color: 'from-[#9333ea] to-[#ec4899]', // Purple to Pink
    image: '/images/vestiario_coach_tablet_1786452356229.jpg'
  },
  {
    id: 3,
    title: 'Grave o seu feedback e compartilhe na hora.',
    subtitle: 'Apresentando o Vestiário Digital',
    color: 'from-[#e11d48] to-[#f43f5e]', // Rose / Red
    image: '/images/vestiario_video_recording_1786452365495.jpg'
  },
  {
    id: 4,
    title: 'O Treino vira uma Conversa. Atletas engajados evoluem mais rápido.',
    subtitle: 'Apresentando o Vestiário Digital',
    color: 'from-[#10b981] to-[#84cc16]', // Green to Lime
    image: '/images/vestiario_players_chat_1786452377811.jpg'
  },
  {
    id: 5,
    title: 'Cada interação constrói um histórico de progresso rastreável.',
    subtitle: 'Apresentando o Vestiário Digital',
    color: 'from-[#4f46e5] to-[#8b5cf6]', // Indigo to Violet
    image: '/images/vestiario_progress_chart_1786452387165.jpg'
  },
  {
    id: 6,
    title: 'Permite que os pais acompanhem a jornada sem interromper o processo.',
    subtitle: 'Apresentando o Vestiário Digital',
    color: 'from-[#0284c7] to-[#38bdf8]', // Light Blue / Sky
    image: '/images/vestiario_parents_1786452398680.jpg'
  }
];

export default function LockerRoomPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <div className={`min-h-screen transition-colors duration-1000 ease-in-out bg-gradient-to-br ${SLIDES[currentIndex].color} flex flex-col font-sans overflow-hidden`}>
      {/* Navbar overlay */}
      <header className="w-full px-6 py-6 flex justify-between items-center max-w-7xl mx-auto text-white z-50">
        <Link href="/" className="font-bold text-2xl tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <Activity className="w-5 h-5 text-black" />
          </div>
          ATHLETE<span className="font-light">OS</span>
        </Link>
        
        <nav className="hidden md:flex gap-8 text-sm font-medium text-white/90">
          <Link href="/para-atletas" className="hover:text-white transition-colors">Para Atletas</Link>
          <Link href="/clubes" className="hover:text-white transition-colors">Clubes e Escolinhas</Link>
          <Link href="/metodologia" className="hover:text-white transition-colors">Metodologia</Link>
          <Link href="/sobre" className="hover:text-white transition-colors">Sobre</Link>
        </nav>
      </header>

      {/* Carousel Main Content */}
      <main className="flex-1 flex flex-col justify-center relative px-6 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center gap-12 lg:gap-24"
          >
            {/* Text Side */}
            <div className="flex-1 text-white">
              <h4 className="text-lg md:text-xl font-medium mb-4 text-white/90">
                {SLIDES[currentIndex].subtitle}
              </h4>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {SLIDES[currentIndex].title}
              </h1>
            </div>

            {/* Image / Graphic Side */}
            <div className="flex-1 relative w-full aspect-video md:aspect-[4/3]">
              {/* Floating UI Elements Mockup */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-4 md:p-8 flex items-center justify-center">
                 <img 
                   src={SLIDES[currentIndex].image} 
                   alt="Feature Mockup" 
                   className="w-full h-full object-cover rounded-xl shadow-inner"
                 />
                 {/* Decorative mock UI cards */}
                 <div className="absolute -right-6 -top-6 w-32 h-32 bg-white rounded-xl shadow-xl p-3 hidden md:block">
                   <div className="w-full h-2 bg-slate-100 rounded-full mb-2"></div>
                   <div className="w-2/3 h-2 bg-slate-100 rounded-full mb-4"></div>
                   <div className="w-full h-12 bg-slate-50 rounded-lg flex items-center justify-center">
                     <span className="text-2xl font-bold text-[#06b6d4]">8.7</span>
                   </div>
                 </div>
                 <div className="absolute -left-6 -bottom-6 w-40 h-24 bg-white rounded-xl shadow-xl p-3 flex flex-col gap-2 hidden md:flex">
                   <div className="flex items-center gap-2">
                     <div className="w-6 h-6 rounded-full bg-pink-100"></div>
                     <div className="w-20 h-2 bg-slate-100 rounded-full"></div>
                   </div>
                   <div className="flex items-center gap-2">
                     <div className="w-6 h-6 rounded-full bg-blue-100"></div>
                     <div className="w-16 h-2 bg-slate-100 rounded-full"></div>
                   </div>
                 </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation Controls */}
      <footer className="w-full pb-12 pt-6 flex justify-center items-center gap-4 z-20">
        <button 
          onClick={prevSlide}
          className="w-10 h-10 rounded-full border border-white/50 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2 md:gap-3">
          {SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => setCurrentIndex(index)}
              className={`h-1 transition-all rounded-full ${index === currentIndex ? 'w-8 bg-white' : 'w-4 md:w-8 bg-white/30'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button 
          onClick={nextSlide}
          className="w-10 h-10 rounded-full border border-white/50 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </footer>
    </div>
  );
}
