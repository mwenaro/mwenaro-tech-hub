import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { LayoutDashboard, Users, FileText, FolderKanban, UserCog, Settings, LogOut } from 'lucide-react';
import { Button } from '@mwenaro/ui';

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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-50 border-b bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="font-bold text-xl text-primary">
              Labs Admin
            </Link>
            <nav className="hidden md:flex items-center gap-2 ml-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-700">
              View Site
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-zinc-500">Admin</p>
              </div>
            </div>
            <form action="/api/auth/logout" method="POST">
              <Button type="submit" variant="ghost" size="sm">
                <LogOut size={18} />
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}