'use client';

import { Menu, Search, Bell, User as UserIcon, Settings, LogOut } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sidebar } from './sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

interface HeaderProps {
  userRole?: string;
  userEmail?: string;
  userName?: string;
}

export function Header({ userRole = 'athlete', userEmail = 'user@example.com', userName = 'User' }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden text-slate-400 hover:text-slate-200">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Abrir menu sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 border-r border-slate-800/50 bg-slate-950/95">
          <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
          <Sidebar userRole={userRole} className="w-full border-none" />
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1 items-center" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Buscar
          </label>
          <div className="relative w-full max-w-md flex items-center">
            <Search
              className="absolute left-3 h-4 w-4 text-slate-500"
              aria-hidden="true"
            />
            <Input
              id="search-field"
              className="block h-10 w-full rounded-full border-slate-800/50 bg-slate-900/50 pl-10 pr-3 text-slate-200 placeholder:text-slate-500 focus:border-emerald-500/50 focus:ring-emerald-500/20 sm:text-sm"
              placeholder="Buscar atletas, treinos..."
              type="search"
              name="search"
            />
          </div>
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-full transition-colors relative">
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="sr-only">Ver notificações</span>
          </Button>

          {/* Separator */}
          <div
            className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-800/50"
            aria-hidden="true"
          />

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full ml-2 ring-2 ring-slate-800/50 hover:ring-emerald-500/50 transition-all p-0">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="" alt={userName} />
                  <AvatarFallback className="bg-slate-800 text-emerald-400 font-medium">
                    {userName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-slate-950 border-slate-800 text-slate-200 shadow-xl" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-slate-200">{userName}</p>
                  <p className="text-xs leading-none text-slate-500">
                    {userEmail}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-800/50" />
              <DropdownMenuItem asChild className="hover:bg-slate-800 hover:text-slate-200 focus:bg-slate-800 focus:text-slate-200 cursor-pointer transition-colors">
                <Link href="/profile">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Meu Perfil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-slate-800 hover:text-slate-200 focus:bg-slate-800 focus:text-slate-200 cursor-pointer transition-colors">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-800/50" />
              <DropdownMenuItem className="text-red-400 hover:bg-red-500/10 hover:text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer transition-colors" asChild>
                <form action="/auth/signout" method="post" className="w-full">
                  <button type="submit" className="flex w-full items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
