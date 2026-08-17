'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogClose } from '@/components/ui/dialog';
import * as z from 'zod';
import { saveAthleteProfile } from '@/app/actions/profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

import { Textarea } from '@/components/ui/textarea';

const athleteSchema = z.object({
  fullName: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  dateOfBirth: z.string().nonempty('Data de nascimento é obrigatória'),
  position: z.enum(['goalkeeper', 'defender', 'center_back', 'full_back', 'midfielder', 'defensive_midfielder', 'attacking_midfielder', 'forward', 'winger', 'striker'], { required_error: 'Posição é obrigatória' }),
  dominantFoot: z.enum(['left', 'right', 'both'], { required_error: 'Pé dominante é obrigatório' }),
  height: z.string().regex(/^\d+$/, 'Altura deve ser um número'),
  weight: z.string().regex(/^\d+(\.\d+)?$/, 'Peso deve ser um número válido'),
  avatar_url: z.string().optional(),
  bio: z.string().optional(),
  club: z.string().optional(),
  category: z.string().optional(),
  instagram_url: z.string().optional().or(z.literal('')), 
  youtube_url: z.string().optional().or(z.literal('')), 
});

type AthleteFormValues = z.infer<typeof athleteSchema>;

interface AthleteFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export function AthleteForm({ initialData, onSuccess }: AthleteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  
  const form = useForm<AthleteFormValues>({
    resolver: zodResolver(athleteSchema),
    defaultValues: {
      fullName: initialData?.full_name || '',
      dateOfBirth: initialData?.date_of_birth || '',
      position: initialData?.position || undefined,
      dominantFoot: initialData?.dominant_foot || undefined,
      height: initialData?.height_cm?.toString() || '',
      weight: initialData?.weight_kg?.toString() || '',
      avatar_url: initialData?.avatar_url || '',
      bio: initialData?.bio || '',
      club: initialData?.club || '',
      category: initialData?.category || '',
      instagram_url: initialData?.instagram_url || '',
      youtube_url: initialData?.youtube_url || '',
    },
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const supabase = createClient();
      const safeName = file.name.replace(/[^a-zA-Z0-9.\-]/g, '_');
      const filePath = `${Date.now()}-${safeName}`;
      
      const { error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (error) {
        toast.error('Erro ao fazer upload da imagem.');
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      form.setValue('avatar_url', publicUrl);
    } catch (err) {
      toast.error('Erro ao fazer upload da imagem.');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: AthleteFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        id: initialData?.id,
        full_name: data.fullName,
        date_of_birth: data.dateOfBirth,
        height_cm: data.height,
        weight_kg: data.weight,
        dominant_foot: data.dominantFoot,
        instagram_url: data.instagram_url,
        youtube_url: data.youtube_url
      };
      const result = await saveAthleteProfile(payload);
      if (result.error) {
        toast.error('Erro ao salvar atleta: ' + result.error);
      } else {
        toast.success('Alterações salvas com sucesso!');
        form.reset();
        router.refresh();
        closeButtonRef.current?.click();
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      toast.error('Ocorreu um erro inesperado.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Nome Completo</Label>
        <Input
          id="fullName"
          {...form.register('fullName')}
          className="bg-slate-950/50 border-slate-800"
          placeholder="Nome do atleta"
        />
        {form.formState.errors.fullName && (
          <p className="text-sm text-red-500">{form.formState.errors.fullName.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="club">Clube Atual (Opcional)</Label>
          <Input
            id="club"
            {...form.register('club')}
            className="bg-slate-950/50 border-slate-800"
            placeholder="Ex: União Barbarense"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Categoria (Opcional)</Label>
          <Input
            id="category"
            {...form.register('category')}
            className="bg-slate-950/50 border-slate-800"
            placeholder="Ex: SUB-15"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="instagram_url">Instagram (Opcional)</Label>
          <Input
            id="instagram_url"
            {...form.register('instagram_url')}
            className="bg-slate-950/50 border-slate-800"
            placeholder="Link do Perfil"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="youtube_url">YouTube (Opcional)</Label>
          <Input
            id="youtube_url"
            {...form.register('youtube_url')}
            className="bg-slate-950/50 border-slate-800"
            placeholder="Link do Canal"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="avatar">Foto do Atleta (Opcional)</Label>
        <Input
          id="avatar"
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          disabled={isUploading || isSubmitting}
          className="bg-slate-950/50 border-slate-800"
        />
        {isUploading && <p className="text-sm text-emerald-500 flex items-center gap-2"><Loader2 className="h-3 w-3 animate-spin" /> Fazendo upload...</p>}
        {form.watch('avatar_url') && !isUploading && (
          <p className="text-sm text-emerald-500">Upload concluído!</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Biografia (Resumo do atleta)</Label>
        <Textarea
          id="bio"
          {...form.register('bio')}
          className="bg-slate-950/50 border-slate-800 resize-none"
          placeholder="Conte um pouco sobre a história, estilo de jogo e conquistas do atleta..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
        <Input
          id="dateOfBirth"
          type="date"
          {...form.register('dateOfBirth')}
          className="bg-slate-950/50 border-slate-800"
        />
        {form.formState.errors.dateOfBirth && (
          <p className="text-sm text-red-500">{form.formState.errors.dateOfBirth.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="position">Posição</Label>
          <Select onValueChange={(value) => form.setValue('position', value as any)}>
            <SelectTrigger className="bg-slate-950/50 border-slate-800">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="goalkeeper">Goleiro</SelectItem>
              <SelectItem value="center_back">Zagueiro</SelectItem>
              <SelectItem value="full_back">Lateral</SelectItem>
              <SelectItem value="defensive_midfielder">Volante</SelectItem>
              <SelectItem value="midfielder">Meio-campo (Central)</SelectItem>
              <SelectItem value="attacking_midfielder">Meia Armador</SelectItem>
              <SelectItem value="winger">Ponta</SelectItem>
              <SelectItem value="forward">Atacante / Segundo Atacante</SelectItem>
              <SelectItem value="striker">Centroavante</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.position && (
            <p className="text-sm text-red-500">{form.formState.errors.position.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dominantFoot">Pé Dominante</Label>
          <Select onValueChange={(value) => form.setValue('dominantFoot', value as any)}>
            <SelectTrigger className="bg-slate-950/50 border-slate-800">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Esquerdo</SelectItem>
              <SelectItem value="right">Direito</SelectItem>
              <SelectItem value="both">Ambidestro</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.dominantFoot && (
            <p className="text-sm text-red-500">{form.formState.errors.dominantFoot.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="height">Altura (cm)</Label>
          <Input
            id="height"
            type="number"
            {...form.register('height')}
            className="bg-slate-950/50 border-slate-800"
            placeholder="Ex: 175"
          />
          {form.formState.errors.height && (
            <p className="text-sm text-red-500">{form.formState.errors.height.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Peso (kg)</Label>
          <Input
            id="weight"
            type="number"
            step="0.1"
            {...form.register('weight')}
            className="bg-slate-950/50 border-slate-800"
            placeholder="Ex: 70.5"
          />
          {form.formState.errors.weight && (
            <p className="text-sm text-red-500">{form.formState.errors.weight.message}</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white border-0 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]"
      >
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {initialData ? 'Salvar Alterações' : 'Criar Atleta'}
      </Button>
      <DialogClose ref={closeButtonRef} className="hidden" />
    </form>
  );
}
