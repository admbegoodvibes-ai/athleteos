import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';

export const metadata = {
  title: 'Dashboard - AthleteOS',
  description: 'Gerencie sua performance esportiva',
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Obter detalhes do usuário da sessão atual
  const userRole = user.user_metadata?.role || 'athlete';
  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário';
  const userEmail = user.email || '';

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-emerald-500/30">
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <Sidebar userRole={userRole} />
      </div>

      <div className="flex flex-1 flex-col lg:pl-64 h-full">
        <Header userRole={userRole} userEmail={userEmail} userName={userName} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900/50 via-slate-950 to-slate-950">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
