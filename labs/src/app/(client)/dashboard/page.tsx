'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button } from '@mwenaro/ui';
import { Plus, FolderKanban, Clock, CheckCircle, AlertCircle, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';

interface Project {
  _id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface Payment {
  amount: number;
  status: string;
}

import { useAIContext } from '@/context/AIContext';

export default function ClientDashboard() {
  const router = useRouter();
  const { setAIContext } = useAIContext();
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, projectsRes, paymentsRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/projects'),
          fetch('/api/payments'),
        ]);

        const userData = await userRes.json();
        const projectsData = await projectsRes.json();
        const paymentsData = await paymentsRes.json();

        if (!userData.user) {
          router.push('/login');
          return;
        }

        setUser(userData.user);
        setProjects(projectsData.projects || []);
        setPayments(paymentsData.payments || []);

        // Set AI Context for the Scribe
        setAIContext({
          user: userData.user,
          projectsSummary: {
            total: (projectsData.projects || []).length,
            active: (projectsData.projects || []).filter((p: any) => p.status === 'active').length,
          }
        });
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    pending: projects.filter(p => ['draft', 'submitted', 'under_review'].includes(p.status)).length,
  };

  const paymentStats = {
    totalPaid: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
    totalPending: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
  };

  const recentActivity = [
    ...projects.slice(0, 3).map(p => ({
      type: 'project',
      title: p.title,
      status: p.status,
      date: p.createdAt,
    })),
    ...payments.filter(p => p.status === 'paid').slice(0, 2).map(p => ({
      type: 'payment',
      title: `Payment of $${p.amount}`,
      status: 'completed',
      date: new Date().toISOString(),
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const statusColors: Record<string, string> = {
    draft: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
    submitted: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    under_review: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    accepted: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    active: 'bg-primary/10 text-primary',
    completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-zinc-100 text-zinc-500',
  };

  const statusLabels: Record<string, string> = {
    draft: 'Draft',
    submitted: 'Submitted',
    under_review: 'Under Review',
    accepted: 'Accepted',
    rejected: 'Rejected',
    active: 'Active',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const maxStat = Math.max(stats.active, stats.completed, stats.pending, 1);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-zinc-500 mt-1">Here's what's happening with your projects</p>
        </div>
        <Link href="/projects/new">
          <Button>
            <Plus size={18} className="mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <FolderKanban className="text-primary" size={24} />
            </div>
            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
              <TrendingUp size={14} />
              {stats.total > 0 ? '+' : ''}{stats.total}
            </span>
          </div>
          <p className="text-3xl font-bold">{stats.total}</p>
          <p className="text-sm text-zinc-500">Total Projects</p>
          <div className="mt-3 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${(stats.total / Math.max(stats.total, 1)) * 100}%` }} />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Clock className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.active}</p>
          <p className="text-sm text-zinc-500">Active Projects</p>
          <div className="mt-3 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: `${(stats.active / maxStat) * 100}%` }} />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.completed}</p>
          <p className="text-sm text-zinc-500">Completed</p>
          <div className="mt-3 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-green-500" style={{ width: `${(stats.completed / maxStat) * 100}%` }} />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <AlertCircle className="text-yellow-600 dark:text-yellow-400" size={24} />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.pending}</p>
          <p className="text-sm text-zinc-500">Pending</p>
          <div className="mt-3 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-500" style={{ width: `${(stats.pending / maxStat) * 100}%` }} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Project Progress</h2>
              <Link href="/projects" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>
            
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <FolderKanban className="mx-auto h-12 w-12 text-zinc-300 mb-4" />
                <p className="text-zinc-500">No projects yet</p>
                <Link href="/projects/new" className="text-primary text-sm hover:underline">
                  Submit your first project
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.slice(0, 4).map((project) => (
                  <Link key={project._id} href={`/projects/${project._id}`}>
                    <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{project.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
                          {statusLabels[project.status]}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-500">
                        <span className="capitalize">{project.type}</span>
                        <span>•</span>
                        <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="mt-3 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            project.status === 'completed' ? 'bg-green-500' :
                            project.status === 'active' ? 'bg-primary' :
                            project.status === 'accepted' ? 'bg-blue-500' :
                            'bg-yellow-500'
                          }`}
                          style={{ 
                            width: project.status === 'completed' ? '100%' :
                                   project.status === 'active' ? '75%' :
                                   project.status === 'accepted' ? '50%' : '25%'
                          }} 
                        />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Payment Summary</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-600" size={20} />
                  <div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Paid</p>
                    <p className="text-lg font-bold">${paymentStats.totalPaid.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="text-yellow-600" size={20} />
                  <div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Pending</p>
                    <p className="text-lg font-bold">${paymentStats.totalPending.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
            <Link href="/payments" className="block mt-4 text-center text-sm text-primary hover:underline">
              View payment details
            </Link>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
            {recentActivity.length === 0 ? (
              <p className="text-sm text-zinc-500 text-center py-4">No recent activity</p>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'payment' ? 'bg-green-500' : 'bg-primary'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.title}</p>
                      <p className="text-xs text-zinc-500">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
