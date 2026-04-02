import { Sidebar } from '@/components/layout/Sidebar';

export const dynamic = 'force-dynamic';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
      <Sidebar />
      <main className="flex-1 pl-64">
        {children}
      </main>
    </div>
  );
}