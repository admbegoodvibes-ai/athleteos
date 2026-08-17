'use client';

import { Users, Target, BrainCircuit, Activity, ChevronRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface ClubDashboardProps {
  analytics: {
    totalAthletes: number;
    totalEvaluations: number;
    activePDIs: number;
    completedPDIs: number;
    avgClubScore: string;
    topAthletes: any[];
  };
}

export function ClubDashboard({ analytics }: ClubDashboardProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
          Visão Gerencial do Clube
        </h1>
        <p className="text-slate-400">
          Acompanhe o desempenho, evolução e atividades de todos os atletas da base.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-sm font-medium text-slate-400">Atletas Ativos</span>
          </div>
          <p className="text-3xl font-bold text-white">{analytics.totalAthletes}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <BrainCircuit className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-sm font-medium text-slate-400">Nota Média Geral</span>
          </div>
          <p className="text-3xl font-bold text-white flex items-baseline gap-2">
            {analytics.avgClubScore} <span className="text-sm text-slate-500 font-normal">/10</span>
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Target className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-sm font-medium text-slate-400">PDIs em Andamento</span>
          </div>
          <p className="text-3xl font-bold text-white">{analytics.activePDIs}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Activity className="w-5 h-5 text-orange-400" />
            </div>
            <span className="text-sm font-medium text-slate-400">Avaliações Feitas</span>
          </div>
          <p className="text-3xl font-bold text-white">{analytics.totalEvaluations}</p>
        </div>
      </div>

      {/* Top Athletes Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Atletas em Destaque
          </h2>
          <Link href="/athletes" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 flex items-center">
            Ver todos <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-sm text-slate-400">
                <th className="pb-4 font-medium">Atleta</th>
                <th className="pb-4 font-medium">Posição</th>
                <th className="pb-4 font-medium text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {analytics.topAthletes.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-slate-500">
                    Nenhum atleta cadastrado ainda.
                  </td>
                </tr>
              ) : (
                analytics.topAthletes.map((athlete) => (
                  <tr key={athlete.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center font-bold text-slate-500">
                          {athlete.avatar_url ? (
                            <img src={athlete.avatar_url} alt={athlete.full_name} className="w-full h-full object-cover" />
                          ) : (
                            athlete.full_name?.substring(0, 2).toUpperCase()
                          )}
                        </div>
                        <span className="font-medium text-slate-200">{athlete.full_name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-slate-400 capitalize">{athlete.position || '-'}</td>
                    <td className="py-4 text-right">
                      <Link href={`/p/${athlete.id}`} className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors">
                        Ver Perfil
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
