'use client';

import { useState } from 'react';
import { useForm as useHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createVideo } from '@/app/actions/videos';
import { Loader2 } from 'lucide-react';

const videoSchema = z.object({
  athlete_id: z.string().min(1, 'Selecione um atleta'),
  title: z.string().min(1, 'Título é obrigatório'),
  url: z.string().url('URL inválida').min(1, 'URL é obrigatória'),
});

type VideoFormValues = z.infer<typeof videoSchema>;

interface VideoFormProps {
  athletes: { id: string; full_name: string }[];
  onSuccess?: () => void;
}

export function VideoForm({ athletes, onSuccess }: VideoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useHookForm<VideoFormValues>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      athlete_id: athletes.length === 1 ? athletes[0].id : '',
      title: '',
      url: ''
    }
  });

  const onSubmit = async (data: VideoFormValues) => {
    setIsSubmitting(true);
    setError(null);
    const result = await createVideo(data);
    if (result?.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      if (onSuccess) onSuccess();
      window.location.reload();
    }
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
        <label className="text-sm font-medium text-slate-300">Título do Vídeo</label>
        <Input placeholder="Ex: Melhores Momentos 2023" {...register('title')} className="bg-slate-950 border-slate-800 text-slate-200" />
        {errors.title && <span className="text-red-400 text-xs">{errors.title.message}</span>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">URL do Youtube</label>
        <Input placeholder="https://www.youtube.com/watch?v=..." {...register('url')} className="bg-slate-950 border-slate-800 text-slate-200" />
        {errors.url && <span className="text-red-400 text-xs">{errors.url.message}</span>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium shadow-lg shadow-emerald-500/20">
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {isSubmitting ? 'Salvando...' : 'Adicionar Vídeo'}
      </Button>
    </form>
  );
}
