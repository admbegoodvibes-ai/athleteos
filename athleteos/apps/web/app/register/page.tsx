'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@athleteos/ui/components/button';
import Link from 'next/link';

const STEPS = [
  {
    id: 'goals',
    question: 'O que você mais deseja descobrir na sua conta gratuita?',
    subtitle: 'Escolha quantas opções desejar',
    type: 'multiple',
    options: [
      { id: 'A', label: 'Análise Tática – KPIs e Mapas de Jogo' },
      { id: 'B', label: 'Ferramenta de Feedback – Enviar clipes para atletas' },
      { id: 'C', label: 'Desenvolvimento – Análise Individual (PDI)' },
      { id: 'D', label: 'Comparativos – Minutos jogados e Top Performers' },
    ]
  },
  {
    id: 'tools',
    question: 'Quais ferramentas você usa atualmente para filmar e analisar os jogos?',
    subtitle: 'Escolha quantas opções desejar',
    type: 'multiple',
    options: [
      { id: 'A', label: 'Veo' },
      { id: 'B', label: 'Pixellot' },
      { id: 'C', label: 'Hudl' },
      { id: 'D', label: 'Câmera Própria (Celular / Filmadora)' },
      { id: 'E', label: 'Nenhuma ainda' },
    ]
  },
  {
    id: 'age',
    question: 'Qual categoria a sua equipe foca atualmente?',
    subtitle: 'Selecione a opção principal',
    type: 'single',
    options: [
      { id: 'A', label: 'Sub-9 a Sub-11' },
      { id: 'B', label: 'Sub-12 a Sub-14' },
      { id: 'C', label: 'Sub-15 a Sub-17' },
      { id: 'D', label: 'Sub-18 a Sub-20' },
      { id: 'E', label: 'Profissional' },
    ]
  },
  {
    id: 'club',
    question: 'Qual clube ou escolinha você treina/representa?',
    type: 'text',
    placeholder: 'Digite o nome do clube...'
  },
  {
    id: 'personal',
    question: 'Para finalizar, como podemos falar com você?',
    subtitle: 'Prometemos não enviar spam.',
    type: 'form'
  }
];

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const handleMultipleSelect = (optionId: string) => {
    const stepId = STEPS[currentStep].id;
    const currentAnswers = answers[stepId] || [];
    if (currentAnswers.includes(optionId)) {
      setAnswers({ ...answers, [stepId]: currentAnswers.filter((id: string) => id !== optionId) });
    } else {
      setAnswers({ ...answers, [stepId]: [...currentAnswers, optionId] });
    }
  };

  const handleSingleSelect = (optionId: string) => {
    const stepId = STEPS[currentStep].id;
    setAnswers({ ...answers, [stepId]: optionId });
  };

  const handleTextChange = (value: string) => {
    setAnswers({ ...answers, [STEPS[currentStep].id]: value });
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Finalizar Cadastro - Aqui entraria a chamada pro Supabase + Redirect pro Calendly
      window.location.href = '/login'; // Temporário
    }
  };

  const step = STEPS[currentStep];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900">
      {/* Header Minimalista */}
      <header className="w-full p-6 flex justify-center items-center border-b border-slate-100">
         <div className="font-bold text-2xl tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#0891b2] flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-white"></div>
          </div>
          ATHLETE<span className="font-light">OS</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Número da Pergunta e Título */}
              <div className="flex items-start gap-4 mb-8">
                <div className="mt-1 flex-shrink-0 w-6 h-6 bg-slate-900 text-white rounded text-xs font-bold flex items-center justify-center">
                  {currentStep + 1}
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-medium text-slate-800">
                    {step.question}
                    <span className="text-red-500 ml-1">*</span>
                  </h2>
                  {step.subtitle && (
                    <p className="text-slate-500 mt-2 text-sm">{step.subtitle}</p>
                  )}
                </div>
              </div>

              {/* Inputs baseado no Tipo da Pergunta */}
              <div className="pl-10 space-y-3">
                {/* MULTIPLE CHOICE / SINGLE CHOICE */}
                {(step.type === 'multiple' || step.type === 'single') && step.options?.map((opt) => {
                  const isSelected = step.type === 'multiple' 
                    ? (answers[step.id] || []).includes(opt.id)
                    : answers[step.id] === opt.id;

                  return (
                    <div 
                      key={opt.id} 
                      onClick={() => step.type === 'multiple' ? handleMultipleSelect(opt.id) : handleSingleSelect(opt.id)}
                      className={`flex items-center gap-4 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                        isSelected ? 'border-[#06b6d4] bg-[#06b6d4]/5' : 'border-transparent bg-slate-100 hover:bg-slate-200'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                        isSelected ? 'bg-[#06b6d4] text-white' : 'bg-white text-slate-500 border border-slate-300'
                      }`}>
                        {opt.id}
                      </div>
                      <span className={`font-medium ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>
                        {opt.label}
                      </span>
                    </div>
                  );
                })}

                {/* TEXT INPUT */}
                {step.type === 'text' && (
                  <input
                    type="text"
                    placeholder={step.placeholder}
                    value={answers[step.id] || ''}
                    onChange={(e) => handleTextChange(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && nextStep()}
                    className="w-full text-xl md:text-2xl border-b-2 border-slate-200 bg-transparent py-4 outline-none focus:border-[#06b6d4] transition-colors placeholder:text-slate-300"
                    autoFocus
                  />
                )}

                {/* FORM INPUT */}
                {step.type === 'form' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Nome Completo *</label>
                      <input type="text" placeholder="Ex: João Silva" className="w-full border-b-2 border-slate-200 py-2 outline-none focus:border-[#06b6d4]" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Telefone</label>
                      <input type="tel" placeholder="(11) 99999-9999" className="w-full border-b-2 border-slate-200 py-2 outline-none focus:border-[#06b6d4]" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">E-mail Profissional *</label>
                      <input type="email" placeholder="nome@clube.com" className="w-full border-b-2 border-slate-200 py-2 outline-none focus:border-[#06b6d4]" />
                    </div>
                  </div>
                )}
              </div>

              {/* Botão de Avançar */}
              <div className="pl-10 mt-10">
                <Button 
                  onClick={nextStep}
                  className="bg-[#06b6d4] hover:bg-[#0891b2] text-white rounded-full px-8 h-12 text-lg font-bold shadow-lg flex items-center gap-2"
                >
                  {currentStep === STEPS.length - 1 ? 'Agendar Demo' : 'OK'} 
                  {currentStep !== STEPS.length - 1 && <ArrowRight className="w-5 h-5" />}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
