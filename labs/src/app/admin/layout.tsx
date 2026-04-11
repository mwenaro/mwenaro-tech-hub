import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { LayoutDashboard, Users, FileText, FolderKanban, UserCog, LogOut, Rocket } from 'lucide-react';
import { Button } from '@mwenaro/ui';
import { AIProvider } from '@/context/AIContext';
import { AIScribe } from '@/components/dashboard/ai-scribe';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'admin') {
    redirect('/dashboard');
  }

  const navItems = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/clients', icon: Users, label: 'Clients' },
    { href: '/admin/proposals', icon: FileText, label: 'Proposals' },
    { href: '/admin/projects', icon: FolderKanban, label: 'Projects' },
    { href: '/admin/team', icon: UserCog, label: 'Team' },
  ];

  return (
    <AIProvider>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex">
        <aside className="w-64 bg-white dark:bg-zinc-900 border-r dark:border-zinc-800 hidden md:flex flex-col fixed h-full">
          <div className="p-6 border-b dark:border-zinc-800">
            <Link href="/admin/dashboard" className="font-bold text-2xl text-primary flex items-center gap-2">
              <Rocket className="w-6 h-6" />
              Labs
            </Link>
            <p className="text-xs text-zinc-500 mt-1">Admin Portal</p>
          </div>
          
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t dark:border-zinc-800 space-y-2">
            <Link 
              href="/" 
              className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              <Rocket size={16} />
              View Site
            </Link>
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-zinc-500">Admin</p>
              </div>
            </div>
            <form action="/api/auth/logout" method="POST">
              <Button type="submit" variant="ghost" size="sm" className="w-full justify-start">
                <LogOut size={18} className="mr-2" />
                Sign Out
              </Button>
            </form>
          </div>
        </aside>

        <main className="flex-1 md:ml-64">
          <div className="p-6 md:p-8">
            {children}
          </div>
        </main>
        
        <AIScribe />
      </div>
    </AIProvider>
  );
}
