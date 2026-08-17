'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addTraining, removeTraining } from '@/app/actions/stats';
import { toast } from 'sonner';
import { Loader2, Trash2, Activity } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface TrainingManagerProps {
  athleteId: string;
}

export function TrainingManager({ athleteId }: TrainingManagerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trainings, setTrainings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: '',
    duration_minutes: 90,
    focus_areas: '',
    self_rating: 7.0,
  });

  const fetchTrainings = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('training_sessions')
      .select('*')
      .eq('athlete_id', athleteId)
      .order('date', { ascending: false });
      
    if (data) setTrainings(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTrainings();
  }, [athleteId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await addTraining(athleteId, formData);
    if (result.error) {
      toast.error('Erro ao adicionar treino: ' + result.error);
    } else {
      toast.success('Treino adicionado com sucesso!');
      setFormData({...formData, type: '', focus_areas: ''});
      fetchTrainings();
    }
    setIsSubmitting(false);
  };

  const handleRemove = async (trainingId: string) => {
    if (!confirm('Deseja realmente remover este treino?')) return;
    const result = await removeTraining(trainingId, athleteId);
    if (result.error) {
      toast.error('Erro ao remover treino.');
    } else {
      toast.success('Treino removido!');
      fetchTrainings();
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="space-y-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="trainDate">Data</Label>
            <Input 
              id="trainDate" type="date" required
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="bg-slate-950/50 border-slate-800"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Treino</Label>
            <Input 
              id="type" required
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="bg-slate-950/50 border-slate-800" placeholder="Ex: Físico, Técnico"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="focus_areas">Foco Principal</Label>
            <Input 
              id="focus_areas"
              value={formData.focus_areas}
              onChange={(e) => setFormData({...formData, focus_areas: e.target.value})}
              className="bg-slate-950/50 border-slate-800" placeholder="Ex: Finalização"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="trainRating">Sua Nota</Label>
            <Input 
              id="trainRating" type="number" min="0" max="10" step="0.1" required
              value={formData.self_rating}
              onChange={(e) => setFormData({...formData, self_rating: parseFloat(e.target.value) || 0})}
              className="bg-slate-950/50 border-slate-800"
            />
          </div>
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white border-0">
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Activity className="mr-2 h-4 w-4" />}
          Adicionar Treino
        </Button>
      </form>

      <div className="space-y-4">
        <h3 className="font-medium text-slate-300">Histórico de Treinos ({trainings.length})</h3>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          </div>
        ) : trainings.length === 0 ? (
          <p className="text-slate-500 text-sm">Nenhum treino cadastrado.</p>
        ) : (
          <div className="space-y-3">
            {trainings.map(t => (
              <div key={t.id} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-slate-800">
                <div>
                  <p className="text-sm font-bold text-slate-200">{t.type} <span className="font-normal text-slate-400">- {t.focus_areas}</span></p>
                  <p className="text-xs text-slate-400">
                    {new Date(t.date).toLocaleDateString('pt-BR')} • Nota: <span className="text-white font-bold">{t.self_rating}</span>
                  </p>
                </div>
                <Button variant="ghost" size="icon" type="button" onClick={() => handleRemove(t.id)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
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
