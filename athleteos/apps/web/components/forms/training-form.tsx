'use client';

import { useState } from 'react';
import { useForm as useHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createTraining } from '@/app/actions/trainings';

const trainingSchema = z.object({
  athlete_id: z.string().min(1, 'Selecione um atleta'),
  session_date: z.string().min(1, 'Data é obrigatória'),
  session_type: z.string().min(1, 'Tipo de sessão é obrigatório'),
  duration_minutes: z.coerce.number().min(1, 'Duração é obrigatória'),
  planned_rpe: z.coerce.number().min(1).max(10),
});

type TrainingFormValues = z.infer<typeof trainingSchema>;

interface TrainingFormProps {
  athletes: { id: string; full_name: string }[];
  onSuccess?: () => void;
}

export function TrainingForm({ athletes, onSuccess }: TrainingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useHookForm<TrainingFormValues>({
    resolver: zodResolver(trainingSchema),
    defaultValues: {
      athlete_id: athletes.length === 1 ? athletes[0].id : '',
      session_date: new Date().toISOString().split('T')[0],
      session_type: 'training',
    }
  });

  const onSubmit = async (data: TrainingFormValues) => {
    setIsSubmitting(true);
    setError(null);
    const result = await createTraining(data);
    if (result?.error) {
      setError(result.error);
    } else {
      if (onSuccess) onSuccess();
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-md">{error}</div>}
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Atleta</label>
        <select 
          {...register('athlete_id')} 
          className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">Selecione um atleta...</option>
          {athletes.map(a => (
            <option key={a.id} value={a.id}>{a.full_name}</option>
          ))}
        </select>
        {errors.athlete_id && <span className="text-red-400 text-xs">{errors.athlete_id.message}</span>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Data da Sessão</label>
        <Input type="date" {...register('session_date')} className="bg-slate-950 border-slate-800" />
        {errors.session_date && <span className="text-red-400 text-xs">{errors.session_date.message}</span>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Tipo de Sessão</label>
        <select 
          {...register('session_type')} 
          className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="training">Treino</option>
          <option value="recovery">Recuperação</option>
          <option value="gym">Academia</option>
          <option value="match">Partida</option>
        </select>
        {errors.session_type && <span className="text-red-400 text-xs">{errors.session_type.message}</span>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Duração (minutos)</label>
          <Input type="number" min="0" {...register('duration_minutes')} className="bg-slate-950 border-slate-800" />
          {errors.duration_minutes && <span className="text-red-400 text-xs">{errors.duration_minutes.message}</span>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">RPE Planejado (1-10)</label>
          <Input type="number" min="1" max="10" {...register('planned_rpe')} className="bg-slate-950 border-slate-800" />
          {errors.planned_rpe && <span className="text-red-400 text-xs">{errors.planned_rpe.message}</span>}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium shadow-lg shadow-emerald-500/20">
        {isSubmitting ? 'Salvando...' : 'Salvar Treino'}
      </Button>
    </form>
  );
}
