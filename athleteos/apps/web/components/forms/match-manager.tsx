'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addMatch, removeMatch } from '@/app/actions/stats';
import { toast } from 'sonner';
import { Loader2, Trash2, Trophy, Lock, Sparkles, Sword, Shield, GitCommit } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface MatchManagerProps {
  athleteId: string;
  isPro?: boolean;
}

export function MatchManager({ athleteId, isPro = false }: MatchManagerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [matches, setMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('geral');

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    opponent: '',
    result: '',
    goals: 0,
    assists: 0,
    self_rating: 7.0,
    minutes_played: 90,
    yellow_cards: 0,
    red_cards: 0,
    shots: 0,
    shots_on_target: 0,
    dribbles_successful: 0,
    passes_completed: 0,
    pass_accuracy_percentage: 0,
    crosses: 0,
    tackles: 0,
    interceptions: 0,
    aerial_duels_won: 0,
  });

  const fetchMatches = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('matches')
      .select('*')
      .eq('athlete_id', athleteId)
      .order('date', { ascending: false });
      
    if (data) setMatches(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMatches();
  }, [athleteId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await addMatch(athleteId, formData);
    if (result.error) {
      toast.error('Erro ao adicionar partida: ' + result.error);
    } else {
      toast.success('Partida adicionada com sucesso!');
      setFormData({...formData, opponent: '', result: '', goals: 0, assists: 0});
      fetchMatches();
    }
    setIsSubmitting(false);
  };

  const handleRemove = async (matchId: string) => {
    if (!confirm('Deseja realmente remover esta partida?')) return;
    const result = await removeMatch(matchId, athleteId);
    if (result.error) {
      toast.error('Erro ao remover partida.');
    } else {
      toast.success('Partida removida!');
      fetchMatches();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
        {/* Custom Tabs Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-800 pb-4">
          <button 
            type="button"
            onClick={() => setActiveTab('geral')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'geral' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
          >Geral</button>
          <button 
            type="button"
            onClick={() => setActiveTab('ataque')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 ${activeTab === 'ataque' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
          >
            Ataque {!isPro && <Lock className="w-3 h-3 text-indigo-400" />}
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('defesa')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 ${activeTab === 'defesa' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
          >
            Defesa {!isPro && <Lock className="w-3 h-3 text-indigo-400" />}
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('passes')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 ${activeTab === 'passes' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
          >
            Passes {!isPro && <Lock className="w-3 h-3 text-indigo-400" />}
          </button>
        </div>

        <form onSubmit={handleAdd} className="space-y-4">
          
          {/* Tab: GERAL */}
          <div className={activeTab === 'geral' ? 'block' : 'hidden'}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="matchDate">Data</Label>
                <Input id="matchDate" type="date" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="bg-slate-950/50 border-slate-800" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="opponent">Adversário</Label>
                <Input id="opponent" required value={formData.opponent} onChange={(e) => setFormData({...formData, opponent: e.target.value})} className="bg-slate-950/50 border-slate-800" placeholder="Ex: Palmeiras" />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="result">Placar/Resultado</Label>
                <Input id="result" value={formData.result} onChange={(e) => setFormData({...formData, result: e.target.value})} className="bg-slate-950/50 border-slate-800" placeholder="Ex: V 2-1" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goals">Gols</Label>
                <Input id="goals" type="number" min="0" value={formData.goals} onChange={(e) => setFormData({...formData, goals: parseInt(e.target.value) || 0})} className="bg-slate-950/50 border-slate-800" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assists">Assist.</Label>
                <Input id="assists" type="number" min="0" value={formData.assists} onChange={(e) => setFormData({...formData, assists: parseInt(e.target.value) || 0})} className="bg-slate-950/50 border-slate-800" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating">Sua Nota</Label>
                <Input id="rating" type="number" min="0" max="10" step="0.1" required value={formData.self_rating} onChange={(e) => setFormData({...formData, self_rating: parseFloat(e.target.value) || 0})} className="bg-slate-950/50 border-slate-800" placeholder="Ex: 8.5" />
              </div>
            </div>
          </div>

          {/* Tab: ATAQUE, DEFESA, PASSES (LOCKED/PRO) */}
          {activeTab !== 'geral' && (
            <div className="relative">
              {!isPro && (
                <div className="absolute inset-0 z-10 bg-slate-900/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center p-6 border border-indigo-500/30 text-center">
                  <Sparkles className="w-12 h-12 text-indigo-400 mb-4" />
                  <h4 className="text-xl font-bold text-white mb-2">Painel Tático Avançado (PLUS)</h4>
                  <p className="text-slate-300 max-w-md mb-6">Acesso exclusivo ao mapa tático estilo Eyeball. Registre estatísticas granulares para atrair olheiros de times profissionais europeus.</p>
                  <Button type="button" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold gap-2">
                    <Lock className="w-4 h-4" /> Fazer Upgrade
                  </Button>
                </div>
              )}
              
              <div className={!isPro ? 'opacity-30 pointer-events-none' : ''}>
                {activeTab === 'ataque' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Finalizações (Total)</Label>
                      <Input type="number" min="0" value={formData.shots} onChange={(e) => setFormData({...formData, shots: parseInt(e.target.value) || 0})} className="bg-slate-950/50 border-slate-800" />
                    </div>
                    <div className="space-y-2">
                      <Label>No Alvo</Label>
                      <Input type="number" min="0" value={formData.shots_on_target} onChange={(e) => setFormData({...formData, shots_on_target: parseInt(e.target.value) || 0})} className="bg-slate-950/50 border-slate-800" />
                    </div>
                    <div className="space-y-2">
                      <Label>Dribles Certos</Label>
                      <Input type="number" min="0" value={formData.dribbles_successful} onChange={(e) => setFormData({...formData, dribbles_successful: parseInt(e.target.value) || 0})} className="bg-slate-950/50 border-slate-800" />
                    </div>
                  </div>
                )}
                {activeTab === 'defesa' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Desarmes</Label>
                      <Input type="number" min="0" value={formData.tackles} onChange={(e) => setFormData({...formData, tackles: parseInt(e.target.value) || 0})} className="bg-slate-950/50 border-slate-800" />
                    </div>
                    <div className="space-y-2">
                      <Label>Interceptações</Label>
                      <Input type="number" min="0" value={formData.interceptions} onChange={(e) => setFormData({...formData, interceptions: parseInt(e.target.value) || 0})} className="bg-slate-950/50 border-slate-800" />
                    </div>
                    <div className="space-y-2">
                      <Label>Duelos Aéreos Ganhos</Label>
                      <Input type="number" min="0" value={formData.aerial_duels_won} onChange={(e) => setFormData({...formData, aerial_duels_won: parseInt(e.target.value) || 0})} className="bg-slate-950/50 border-slate-800" />
                    </div>
                  </div>
                )}
                {activeTab === 'passes' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Passes Certos</Label>
                      <Input type="number" min="0" value={formData.passes_completed} onChange={(e) => setFormData({...formData, passes_completed: parseInt(e.target.value) || 0})} className="bg-slate-950/50 border-slate-800" />
                    </div>
                    <div className="space-y-2">
                      <Label>Precisão (%)</Label>
                      <Input type="number" min="0" max="100" value={formData.pass_accuracy_percentage} onChange={(e) => setFormData({...formData, pass_accuracy_percentage: parseInt(e.target.value) || 0})} className="bg-slate-950/50 border-slate-800" />
                    </div>
                    <div className="space-y-2">
                      <Label>Cruzamentos</Label>
                      <Input type="number" min="0" value={formData.crosses} onChange={(e) => setFormData({...formData, crosses: parseInt(e.target.value) || 0})} className="bg-slate-950/50 border-slate-800" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 text-white border-0 font-bold">
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trophy className="mr-2 h-4 w-4" />}
            Salvar Partida
          </Button>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-slate-300">Histórico de Partidas ({matches.length})</h3>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          </div>
        ) : matches.length === 0 ? (
          <p className="text-slate-500 text-sm">Nenhuma partida cadastrada.</p>
        ) : (
          <div className="space-y-3">
            {matches.map(m => (
              <div key={m.id} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-slate-800">
                <div>
                  <p className="text-sm font-bold text-slate-200">vs {m.opponent} <span className="text-emerald-400 ml-2">{m.result}</span></p>
                  <p className="text-xs text-slate-400">
                    {new Date(m.date).toLocaleDateString('pt-BR')} • Nota: <span className="text-white font-bold">{m.self_rating}</span> • Gols: {m.goals} • Assist: {m.assists}
                  </p>
                </div>
                <Button variant="ghost" size="icon" type="button" onClick={() => handleRemove(m.id)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
