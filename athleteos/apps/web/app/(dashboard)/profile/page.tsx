import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Mail, User, Shield, Phone, Loader2 } from 'lucide-react';
import { updateUserProfile } from '@/app/actions/profile';
import { SubmitButton } from '@/components/submit-button';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const userName = user?.user_metadata?.full_name || 'Usuário';
  const userEmail = user?.email || 'Nenhum email cadastrado';
  const userPhone = user?.user_metadata?.phone || '';
  const userRole = user?.user_metadata?.role || 'athlete';

  const roleLabels: Record<string, string> = {
    athlete: 'Atleta',
    coach: 'Treinador',
    scout: 'Scout/Analista',
    guardian: 'Responsável',
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-100">Meu Perfil</h1>
        <p className="text-slate-400 text-lg">
          Gerencie suas informações pessoais e preferências.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-slate-900/60 border-slate-800/50 backdrop-blur-xl overflow-hidden shadow-xl">
            <div className="h-28 w-full bg-gradient-to-r from-emerald-600/40 via-teal-600/40 to-cyan-600/40 relative">
              <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px]"></div>
            </div>
            <CardContent className="relative pt-0 flex flex-col items-center pb-8">
              <div className="relative -mt-14 mb-4 group cursor-pointer">
                <Avatar className="h-28 w-28 border-4 border-slate-950 shadow-2xl transition-transform duration-300 group-hover:scale-105">
                  <AvatarFallback className="bg-slate-800 text-3xl text-emerald-400 font-bold">
                    {userName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-1 right-1 p-2 bg-emerald-500 rounded-full border-2 border-slate-950 text-white hover:bg-emerald-400 transition-colors shadow-lg">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              
              <h2 className="text-2xl font-bold text-slate-100 text-center">{userName}</h2>
              <div className="flex items-center gap-1.5 mt-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/20">
                <Shield className="h-3.5 w-3.5" />
                {roleLabels[userRole] || userRole}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="bg-slate-900/60 border-slate-800/50 backdrop-blur-xl shadow-xl">
            <CardHeader className="border-b border-slate-800/50 pb-6">
              <CardTitle className="text-xl text-slate-100 flex items-center gap-2">
                <User className="h-5 w-5 text-emerald-400" />
                Informações Pessoais
              </CardTitle>
              <CardDescription className="text-slate-400">
                Atualize seus dados cadastrais para manter seu perfil atualizado.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <form action={updateUserProfile as any} className="space-y-4">
                <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-slate-300 font-medium">
                    Nome Completo
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <Input 
                      id="name" 
                      name="fullName"
                      defaultValue={userName} 
                      className="bg-slate-950/50 border-slate-800 text-slate-200 pl-10 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50" 
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-slate-300 font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <Input 
                      id="email" 
                      type="email" 
                      defaultValue={userEmail} 
                      disabled
                      className="bg-slate-950/80 border-slate-800/50 text-slate-500 pl-10 cursor-not-allowed opacity-80" 
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Para alterar seu email cadastrado, entre em contato com o suporte da plataforma.</p>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="phone" className="text-slate-300 font-medium">
                    Telefone
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <Input 
                      id="phone" 
                      name="phone"
                      type="tel" 
                      defaultValue={userPhone}
                      placeholder="(00) 00000-0000" 
                      className="bg-slate-950/50 border-slate-800 text-slate-200 pl-10 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50" 
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end border-t border-slate-800/50 pt-6 mt-6">
                <SubmitButton />
              </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
