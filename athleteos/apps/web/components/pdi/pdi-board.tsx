'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { createPDIGoal, togglePDIAction } from '@/app/actions/pdi';
import { Loader2, Plus, Target, CheckCircle2, Circle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface PdiBoardProps {
  athleteId: string;
  userId: string;
  initialGoals: any[];
}

export function PdiBoard({ athleteId, userId, initialGoals }: PdiBoardProps) {
  const [goals, setGoals] = useState(initialGoals);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [actions, setActions] = useState<string[]>(['']);

  const handleAddActionField = () => setActions([...actions, '']);
  const handleActionChange = (index: number, val: string) => {
    const newActions = [...actions];
    newActions[index] = val;
    setActions(newActions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const validActions = actions.filter(a => a.trim() !== '');
    
    const res = await createPDIGoal({
      athleteId,
      creatorId: userId,
      title,
      description,
      actions: validActions
    });

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success('Meta criada com sucesso!');
      setIsOpen(false);
      // Reload page for MVP simplicity
      window.location.reload();
    }
    setIsSubmitting(false);
  };

  const handleToggleAction = async (actionId: string, currentStatus: boolean) => {
    const res = await togglePDIAction(actionId, !currentStatus);
    if (res.error) toast.error(res.error);
    else {
      // Update local state
      const updatedGoals = goals.map(g => ({
        ...g,
        pdi_actions: g.pdi_actions.map((a: any) => 
          a.id === actionId ? { ...a, is_completed: !currentStatus } : a
        )
      }));
      setGoals(updatedGoals);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-emerald-400" />
            Meu PDI
          </h2>
          <p className="text-slate-400">Acompanhe suas metas de evolução e marque as ações concluídas.</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2">
              <Plus className="w-4 h-4" /> Nova Meta
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-950 border-slate-800 text-slate-200">
            <DialogHeader>
              <DialogTitle>Criar Nova Meta (PDI)</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Título da Meta (Ex: Melhorar Passe)</Label>
                <Input required value={title} onChange={e => setTitle(e.target.value)} className="bg-slate-900 border-slate-800" />
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} className="bg-slate-900 border-slate-800" />
              </div>
              <div className="space-y-2">
                <Label>Ações Práticas</Label>
                {actions.map((action, idx) => (
                  <Input 
                    key={idx} 
                    value={action} 
                    onChange={e => handleActionChange(idx, e.target.value)} 
                    placeholder={`Ação ${idx + 1}...`} 
                    className="bg-slate-900 border-slate-800 mb-2"
                  />
                ))}
                <Button type="button" variant="ghost" onClick={handleAddActionField} className="text-emerald-400 hover:text-emerald-300 w-full">
                  + Adicionar Ação
                </Button>
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-500">
                {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Salvar Meta
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.length === 0 ? (
          <div className="col-span-full p-12 text-center border border-slate-800 rounded-2xl bg-slate-900/50">
            <Target className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-300">Nenhuma meta definida</h3>
            <p className="text-slate-500 mt-2">Crie seu primeiro objetivo para começar a evoluir.</p>
          </div>
        ) : (
          goals.map(goal => {
            const totalActions = goal.pdi_actions.length;
            const completedActions = goal.pdi_actions.filter((a: any) => a.is_completed).length;
            const progress = totalActions === 0 ? 0 : Math.round((completedActions / totalActions) * 100);

            return (
              <Card key={goal.id} className="bg-slate-900 border-slate-800 hover:border-emerald-500/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-white">{goal.title}</h3>
                      {goal.description && <p className="text-sm text-slate-400 mt-1">{goal.description}</p>}
                    </div>
                    <span className="text-xs font-bold bg-slate-800 text-emerald-400 px-2 py-1 rounded-full">
                      {progress}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 rounded-full h-2 mb-6 overflow-hidden">
                    <div className="bg-emerald-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    {goal.pdi_actions.map((action: any) => (
                      <div 
                        key={action.id} 
                        className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                          action.is_completed ? 'bg-emerald-950/20 border-emerald-900/50' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                        onClick={() => handleToggleAction(action.id, action.is_completed)}
                      >
                        {action.is_completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
                        )}
                        <span className={`text-sm ${action.is_completed ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                          {action.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
