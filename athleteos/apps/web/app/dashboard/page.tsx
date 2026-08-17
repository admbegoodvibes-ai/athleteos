'use client';

import { useState } from 'react';
import { Search, Bell, MessageSquare, ChevronDown, Activity, User, Users, CheckCircle, TrendingUp, Calendar, Heart } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// --- MOCK DATA: DEVELOPMENT ---
const consistencyData = [
  { name: '5 sem atrás', value: 48 },
  { name: '4 sem atrás', value: 52 },
  { name: '3 sem atrás', value: 50 },
  { name: '2 sem atrás', value: 76 },
  { name: 'Semana passada', value: 59 },
];
const skillProgressionData = [
  { name: 'Goleiros', lastWeek: 60, thisWeek: 62 },
  { name: 'Zagueiros', lastWeek: 75, thisWeek: 72 },
  { name: 'Meias', lastWeek: 55, thisWeek: 58 },
  { name: 'Atacantes', lastWeek: 68, thisWeek: 70 },
];
const rosterData = [
  { name: '> 50% dos minutos', value: 68 },
  { name: '< 50% dos minutos', value: 32 },
];

// --- MOCK DATA: COACHING ---
const sessionQualityData = [
  { name: 'Seg', qualidade: 8.5 },
  { name: 'Ter', qualidade: 8.8 },
  { name: 'Qua', qualidade: 7.9 },
  { name: 'Qui', qualidade: 9.2 },
  { name: 'Sex', qualidade: 9.5 },
];
const feedbackData = [
  { name: 'Feedbacks Dados', value: 85 },
  { name: 'Pendentes', value: 15 },
];
const coachScores = [
  { name: 'Tática', score: 8.5 },
  { name: 'Técnica', score: 7.8 },
  { name: 'Física', score: 9.0 },
  { name: 'Mental', score: 8.2 },
];

// --- MOCK DATA: ENGAGEMENT ---
const attendanceData = [
  { name: 'Mês 1', taxa: 92 },
  { name: 'Mês 2', taxa: 95 },
  { name: 'Mês 3', taxa: 94 },
  { name: 'Mês 4', taxa: 98 },
  { name: 'Mês 5', taxa: 97 },
];
const retentionData = [
  { name: 'Renovados', value: 94 },
  { name: 'Saídas', value: 6 },
];
const npsScores = [
  { name: 'Sub-11', nps: 88 },
  { name: 'Sub-13', nps: 92 },
  { name: 'Sub-15', nps: 85 },
  { name: 'Sub-17', nps: 90 },
];

const COLORS = ['#0ea5e9', '#e0f2fe']; // Blue and Light Blue
const COLORS_GREEN = ['#10b981', '#d1fae5']; // Green and Light Green
const COLORS_PURPLE = ['#8b5cf6', '#ede9fe']; // Purple and Light Purple

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('development');

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      {/* TOPBAR */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        {/* Left: Window controls mock & Search */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar..."
              className="w-full bg-slate-100 rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#06b6d4] transition-all"
            />
          </div>
        </div>

        {/* Right: Notifications & Profile */}
        <div className="flex items-center gap-4">
          <button className="text-slate-400 hover:text-slate-600 relative">
            <Bell className="w-5 h-5" />
          </button>
          <button className="text-slate-400 hover:text-slate-600 relative">
            <MessageSquare className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-slate-800 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              2
            </span>
          </button>
          
          <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
          
          {/* Selectors */}
          <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-slate-800">ATHLETEOS FC</p>
              <p className="text-[10px] text-slate-500">Admin</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
            <span className="text-xs font-bold text-slate-800">Sub-11</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
             <img src="https://github.com/shadcn.png" alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-6 md:p-8">
        {/* Header & Tabs */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">Painel de Controle</h1>
          <div className="flex items-center gap-1 border-b border-slate-200">
            <button 
              onClick={() => setActiveTab('development')}
              className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${
                activeTab === 'development' 
                  ? 'bg-[#cffafe] text-[#0891b2]' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              Desenvolvimento do Jogador
            </button>
            <button 
              onClick={() => setActiveTab('coaching')}
              className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${
                activeTab === 'coaching' 
                  ? 'bg-[#d1fae5] text-[#10b981]' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              Eficácia do Treinador
            </button>
            <button 
              onClick={() => setActiveTab('engagement')}
              className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${
                activeTab === 'engagement' 
                  ? 'bg-[#ede9fe] text-[#8b5cf6]' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              Engajamento e Retenção
            </button>
          </div>
        </div>

        {/* SECTION TITLE & FILTER */}
        <div className="flex justify-between items-end mb-6">
          <h2 className={`text-2xl font-bold ${
            activeTab === 'development' ? 'text-[#0891b2]' : 
            activeTab === 'coaching' ? 'text-[#10b981]' : 'text-[#8b5cf6]' 
          }`}>
            {activeTab === 'development' && "Desenvolvimento do Jogador"}
            {activeTab === 'coaching' && "Eficácia do Treinador"}
            {activeTab === 'engagement' && "Engajamento e Retenção"}
          </h2>
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 cursor-pointer shadow-sm">
            Últimos 30 dias
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* DYNAMIC CONTENT BASED ON TAB */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* ==========================================
              ABA 1: DESENVOLVIMENTO DO JOGADOR
          ========================================== */}
          {activeTab === 'development' && (
            <>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Jogadores sem minutos</h3>
                    <p className="text-xs text-slate-400">% de jogadores com 0 min na semana</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <Users className="w-4 h-4 text-slate-300" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <Users className="w-6 h-6 text-[#0891b2]" />
                  <span className="text-4xl font-extrabold text-[#0891b2]">4%</span>
                </div>
                <span className="inline-flex items-center text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">
                  ↘ -2%
                </span>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                 <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Média de minutos</h3>
                    <p className="text-xs text-slate-400">Média jogada por atleta</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <Activity className="w-4 h-4 text-slate-300" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <Activity className="w-6 h-6 text-[#0891b2]" />
                  <span className="text-4xl font-extrabold text-[#0891b2]">47 min</span>
                </div>
                <span className="inline-flex items-center text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">
                  ↗ +5%
                </span>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-1">
                 <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">Índice de Consistência</h3>
                    <p className="text-xs text-slate-500">% de jogadores melhorando</p>
                  </div>
                </div>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={consistencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={true} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} dy={10} />
                      <YAxis axisLine={true} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-1">
                 <div className="mb-6">
                  <h3 className="text-base font-bold text-slate-800">Habilidades por Posição</h3>
                  <p className="text-[10px] text-slate-500">Comparativo semanal (Média)</p>
                </div>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={skillProgressionData} margin={{ top: 10, right: 0, left: -30, bottom: 0 }} barGap={2}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                      <Tooltip cursor={{fill: '#f8fafc'}} />
                      <Bar dataKey="lastWeek" name="Semana passada" fill="#3b82f6" radius={[2, 2, 0, 0]} barSize={20} />
                      <Bar dataKey="thisWeek" name="Esta semana" fill="#10b981" radius={[2, 2, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {/* ==========================================
              ABA 2: EFICÁCIA DO TREINADOR
          ========================================== */}
          {activeTab === 'coaching' && (
            <>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Sessões Concluídas</h3>
                    <p className="text-xs text-slate-400">Treinos dados no cronograma</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <Calendar className="w-4 h-4 text-slate-300" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <CheckCircle className="w-6 h-6 text-[#10b981]" />
                  <span className="text-4xl font-extrabold text-[#10b981]">100%</span>
                </div>
                <span className="inline-flex items-center text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  12/12 treinos nesta semana
                </span>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                 <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">Taxa de Feedback (Vídeo)</h3>
                    <p className="text-xs text-slate-500">Comentários e avaliações dadas aos atletas</p>
                  </div>
                </div>
                <div className="flex-1 w-full flex items-center justify-center relative min-h-[100px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={feedbackData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value" stroke="none">
                        {feedbackData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS_GREEN[index % COLORS_GREEN.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-extrabold text-[#10b981]">85%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-1">
                 <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">Qualidade da Sessão</h3>
                    <p className="text-xs text-slate-500">Baseada na percepção dos atletas e carga GPS</p>
                  </div>
                </div>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sessionQualityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={true} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} dy={10} />
                      <YAxis domain={[0, 10]} axisLine={true} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                      <Tooltip />
                      <Line type="monotone" dataKey="qualidade" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-1">
                 <div className="mb-6">
                  <h3 className="text-base font-bold text-slate-800">Avaliação do Treinador</h3>
                  <p className="text-[10px] text-slate-500">Média de performance nos pilares</p>
                </div>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={coachScores} margin={{ top: 10, right: 0, left: -30, bottom: 0 }} barGap={2}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                      <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                      <Tooltip cursor={{fill: '#f8fafc'}} />
                      <Bar dataKey="score" name="Nota" fill="#10b981" radius={[2, 2, 0, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {/* ==========================================
              ABA 3: ENGAJAMENTO E RETENÇÃO
          ========================================== */}
          {activeTab === 'engagement' && (
            <>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">NPS (Satisfação)</h3>
                    <p className="text-xs text-slate-400">Avaliação média de Pais e Atletas</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <Heart className="w-4 h-4 text-slate-300" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <Heart className="w-6 h-6 text-[#8b5cf6]" />
                  <span className="text-4xl font-extrabold text-[#8b5cf6]">89</span>
                </div>
                <span className="inline-flex items-center text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">
                  ↗ +3pts Zona de Excelência
                </span>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                 <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">Retenção de Atletas</h3>
                    <p className="text-xs text-slate-500">% de renovação de matrículas nesta temporada</p>
                  </div>
                </div>
                <div className="flex-1 w-full flex items-center justify-center relative min-h-[100px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={retentionData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value" stroke="none">
                        {retentionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS_PURPLE[index % COLORS_PURPLE.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-extrabold text-[#8b5cf6]">94%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-1">
                 <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">Assiduidade Média (Presença)</h3>
                    <p className="text-xs text-slate-500">Frequência nos treinamentos (Últimos 5 meses)</p>
                  </div>
                </div>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={true} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} dy={10} />
                      <YAxis domain={[0, 100]} axisLine={true} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                      <Tooltip />
                      <Line type="monotone" dataKey="taxa" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-1">
                 <div className="mb-6">
                  <h3 className="text-base font-bold text-slate-800">NPS por Categoria</h3>
                  <p className="text-[10px] text-slate-500">Comparativo de satisfação entre as faixas etárias</p>
                </div>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={npsScores} margin={{ top: 10, right: 0, left: -30, bottom: 0 }} barGap={2}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                      <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                      <Tooltip cursor={{fill: '#f8fafc'}} />
                      <Bar dataKey="nps" name="NPS" fill="#8b5cf6" radius={[2, 2, 0, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}
