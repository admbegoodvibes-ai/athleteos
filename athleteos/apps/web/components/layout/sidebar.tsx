'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  Activity,
  Settings,
  Users,
  LogOut,
  Target,
  Dumbbell,
  Trophy,
  Search,
  Building
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  userRole?: string;
  className?: string;
}

export function Sidebar({ userRole = 'athlete', className }: SidebarProps) {
  const pathname = usePathname();

  const routes = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['athlete', 'coach', 'scout', 'guardian'],
    },
    {
      href: '/organization',
      label: 'Meu Clube',
      icon: Building,
      roles: ['club_admin', 'coordinator', 'coach', 'scout', 'athlete'], // Liberado temporariamente pra facilitar testes
    },
    {
      href: '/pdi',
      label: 'Meu PDI',
      icon: Target,
      roles: ['athlete', 'coach'],
    },
    {
      href: '/profile',
      label: 'Meu Perfil',
      icon: User,
      roles: ['athlete', 'coach', 'scout', 'guardian'],
    },
    {
      href: '/athletes',
      label: 'Atletas',
      icon: Users,
      roles: ['coach', 'scout', 'guardian'],
    },
    {
      href: '/scout',
      label: 'Portal do Olheiro',
      icon: Search,
      roles: ['scout', 'coach', 'guardian', 'athlete'], // Liberando pra todos por enquanto pra MVP
    },
    {
      href: '/analyses',
      label: 'Análises',
      icon: Target,
      roles: ['scout', 'athlete', 'coach', 'guardian'],
    },
    {
      href: '/matches',
      label: 'Partidas',
      icon: Trophy,
      roles: ['athlete', 'coach', 'guardian'],
    },
    {
      href: '/trainings',
      label: 'Treinos',
      icon: Dumbbell,
      roles: ['athlete', 'coach', 'guardian'],
    },
  ];

  const filteredRoutes = routes.filter((route) =>
    route.roles.includes(userRole)
  );

  return (
    <div
      className={cn(
        'flex h-full w-64 flex-col bg-slate-950/80 backdrop-blur-md border-r border-slate-800/50',
        className
      )}
    >
      <div className="flex h-16 items-center px-6 border-b border-slate-800/50">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
            AthleteOS
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2 scrollbar-thin scrollbar-thumb-slate-800">
        {filteredRoutes.map((route) => {
          const isActive = pathname === route.href || pathname?.startsWith(`${route.href}/`);
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              )}
            >
              <route.icon className={cn('h-5 w-5', isActive ? 'text-emerald-400' : 'text-slate-400')} />
              {route.label}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800/50">
        <form action="/auth/signout" method="post">
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-colors"
          >
            <LogOut className="mr-2 h-5 w-5" />
            Sair
          </Button>
        </form>
      </div>
    </div>
  );
}
