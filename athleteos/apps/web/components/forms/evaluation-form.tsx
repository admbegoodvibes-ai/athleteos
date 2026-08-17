'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { submitEvaluation } from '@/app/actions/evaluation';
import { Loader2, Plus, BrainCircuit } from 'lucide-react';

interface EvaluationFormProps {
  athleteId: string;
  evaluatorId: string;
  templates: any[];
}

export function EvaluationForm({ athleteId, evaluatorId, templates }: EvaluationFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [context, setContext] = useState('');
  const [generalNotes, setGeneralNotes] = useState('');
  const [scores, setScores] = useState<Record<string, { score: number, notes: string }>>({});

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  const handleScoreChange = (itemId: string, field: 'score' | 'notes', value: any) => {
    setScores(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate) return;

    const formattedScores = Object.entries(scores).map(([itemId, data]) => ({
      itemId,
      score: data.score,
      notes: data.notes || ''
    }));

    setIsSubmitting(true);
    const res = await submitEvaluation({
      athleteId,
      evaluatorId,
      templateId: selectedTemplate.id,
      context,
      generalNotes,
      scores: formattedScores
    });

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success('Avaliação salva com sucesso!');
      setIsOpen(false);
      // reset form
      setScores({});
      setContext('');
      setGeneralNotes('');
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2">
          <Plus className="w-4 h-4" /> Nova Avaliação
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-950 border-slate-800 text-slate-200 max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl text-emerald-400">
            <BrainCircuit className="w-6 h-6" />
            Avaliação Multidimensional
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Template de Avaliação</Label>
              <select 
                required 
                value={selectedTemplateId}
                onChange={e => setSelectedTemplateId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Selecione...</option>
                {templates.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Contexto (Ex: Treino, Jogo Oficial)</Label>
              <Input 
                required 
                value={context} 
                onChange={e => setContext(e.target.value)} 
                className="bg-slate-900 border-slate-800"
              />
            </div>
          </div>

          {selectedTemplate && (
            <div className="space-y-8">
              {/* Group items by domain */}
              {['Técnico', 'Tático', 'Físico', 'Mental'].map(domain => {
                const items = selectedTemplate.evaluation_items.filter((i: any) => i.domain === domain);
                if (items.length === 0) return null;

                return (
                  <div key={domain} className="space-y-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
                    <h3 className="text-lg font-bold text-slate-100 border-b border-slate-800 pb-2">Domínio {domain}</h3>
                    {items.map((item: any) => (
                      <div key={item.id} className="grid grid-cols-12 gap-4 items-start">
                        <div className="col-span-12 md:col-span-4">
                          <p className="font-medium text-emerald-400">{item.competence}</p>
                          <p className="text-xs text-slate-400">{item.indicator}</p>
                        </div>
                        <div className="col-span-12 md:col-span-3">
                          <Label className="text-xs mb-1 block text-slate-500">Nota (1 a 10)</Label>
                          <Input 
                            type="number" min="1" max="10" required
                            value={scores[item.id]?.score || ''}
                            onChange={e => handleScoreChange(item.id, 'score', parseInt(e.target.value))}
                            className="bg-slate-900 border-slate-800"
                          />
                        </div>
                        <div className="col-span-12 md:col-span-5">
                          <Label className="text-xs mb-1 block text-slate-500">Interpretação / Observação</Label>
                          <Input 
                            placeholder="Detalhes..."
                            value={scores[item.id]?.notes || ''}
                            onChange={e => handleScoreChange(item.id, 'notes', e.target.value)}
                            className="bg-slate-900 border-slate-800"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}

              <div className="space-y-2">
                <Label>Observações Gerais</Label>
                <Textarea 
                  value={generalNotes}
                  onChange={e => setGeneralNotes(e.target.value)}
                  className="bg-slate-900 border-slate-800"
                  rows={3}
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-500">
                {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Salvar Avaliação
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
