'use client';

import { Bell, Search, User, Mic } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-4">
        {title && (
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
          </h2>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search..."
            className="h-9 w-64 rounded-lg border border-zinc-200 bg-zinc-50 pl-9 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </Button>

        <Button variant="ghost" size="icon" className="hidden md:flex">
          <Mic className="h-5 w-5" />
        </Button>

        <Button variant="outline" size="sm" className="gap-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Profile</span>
        </Button>
      </div>
    </header>
  );
}