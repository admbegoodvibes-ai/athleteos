'use client';

import { useState } from 'react';
import { useForm as useHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createMatch } from '@/app/actions/matches';

const matchSchema = z.object({
  athlete_id: z.string().min(1, 'Selecione um atleta'),
  match_date: z.string().min(1, 'Data é obrigatória'),
  opponent: z.string().min(1, 'Adversário é obrigatório'),
  competition: z.string().min(1, 'Competição é obrigatória'),
  minutes_played: z.coerce.number().min(0).max(120),
  self_rating: z.coerce.number().min(1).max(10),
});

type MatchFormValues = z.infer<typeof matchSchema>;

interface MatchFormProps {
  athletes: { id: string; full_name: string }[];
  onSuccess?: () => void;
}

export function MatchForm({ athletes, onSuccess }: MatchFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useHookForm<MatchFormValues>({
    resolver: zodResolver(matchSchema),
    defaultValues: {
      athlete_id: athletes.length === 1 ? athletes[0].id : '',
      match_date: new Date().toISOString().split('T')[0],
    }
  });

  const onSubmit = async (data: MatchFormValues) => {
    setIsSubmitting(true);
    setError(null);
    const result = await createMatch(data);
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
        <label className="text-sm font-medium text-slate-300">Data da Partida</label>
        <Input type="date" {...register('match_date')} className="bg-slate-950 border-slate-800" />
        {errors.match_date && <span className="text-red-400 text-xs">{errors.match_date.message}</span>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Adversário</label>
        <Input placeholder="Ex: Flamengo" {...register('opponent')} className="bg-slate-950 border-slate-800" />
        {errors.opponent && <span className="text-red-400 text-xs">{errors.opponent.message}</span>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Competição</label>
        <Input placeholder="Ex: Campeonato Brasileiro" {...register('competition')} className="bg-slate-950 border-slate-800" />
        {errors.competition && <span className="text-red-400 text-xs">{errors.competition.message}</span>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Minutos Jogados</label>
          <Input type="number" min="0" max="120" {...register('minutes_played')} className="bg-slate-950 border-slate-800" />
          {errors.minutes_played && <span className="text-red-400 text-xs">{errors.minutes_played.message}</span>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Avaliação (1-10)</label>
          <Input type="number" min="1" max="10" {...register('self_rating')} className="bg-slate-950 border-slate-800" />
          {errors.self_rating && <span className="text-red-400 text-xs">{errors.self_rating.message}</span>}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium shadow-lg shadow-emerald-500/20">
        {isSubmitting ? 'Salvando...' : 'Salvar Partida'}
      </Button>
    </form>
  );
}
