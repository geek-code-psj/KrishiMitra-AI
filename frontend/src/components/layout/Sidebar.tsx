'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Mic,
  Droplets,
  TrendingUp,
  Cloud,
  User,
  Settings,
  Leaf,
  IndianRupee,
  CreditCard,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Voice Assistant', href: '/voice', icon: Mic },
  { name: 'Irrigation', href: '/irrigation', icon: Droplets },
  { name: 'Predictions', href: '/predictions', icon: TrendingUp },
  { name: 'Prices', href: '/prices', icon: IndianRupee },
  { name: 'Credit', href: '/credit', icon: CreditCard },
  { name: 'Climate', href: '/climate', icon: Cloud },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex h-16 items-center gap-2 border-b border-zinc-200 px-6 dark:border-zinc-800">
        <Leaf className="h-8 w-8 text-emerald-600" />
        <div>
          <h1 className="text-lg font-bold text-emerald-700 dark:text-emerald-500">
            KrishiMitra
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">AI Assistant</p>
        </div>
      </div>

      <nav className="space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 border-t border-zinc-200 p-4 dark:border-zinc-800">
        <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
            Need Help?
          </p>
          <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
            Ask our AI assistant in your language
          </p>
        </div>
      </div>
    </aside>
  );
}