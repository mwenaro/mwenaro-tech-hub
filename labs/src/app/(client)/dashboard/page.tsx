'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button } from '@mwenaro/ui';
import { Plus, FolderKanban, Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
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

export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, projectsRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/projects'),
        ]);

        const userData = await userRes.json();
        const projectsData = await projectsRes.json();

        if (!userData.user) {
          router.push('/login');
          return;
        }

        setUser(userData.user);
        setProjects(projectsData.projects || []);
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

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-zinc-500 mt-1">Track and manage your projects</p>
        </div>
        <Link href="/projects/new">
          <Button>
            <Plus size={18} className="mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <FolderKanban className="text-primary" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-zinc-500">Total Projects</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Clock className="text-primary" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.active}</p>
              <p className="text-sm text-zinc-500">Active</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.completed}</p>
              <p className="text-sm text-zinc-500">Completed</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <AlertCircle className="text-yellow-600 dark:text-yellow-400" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-sm text-zinc-500">Pending</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Your Projects</h2>
        <Link href="/projects" className="text-sm text-primary hover:underline flex items-center gap-1">
          View all <ArrowRight size={16} />
        </Link>
      </div>

      {projects.length === 0 ? (
        <Card className="p-12 text-center">
          <FolderKanban className="mx-auto h-12 w-12 text-zinc-300 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
          <p className="text-zinc-500 mb-6">Start by submitting your first project idea</p>
          <Link href="/projects/new">
            <Button>Submit Your First Project</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.slice(0, 6).map((project) => (
            <Link key={project._id} href={`/projects/${project._id}`}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{project.title}</h3>
                    <p className="text-sm text-zinc-500 capitalize">{project.type}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
                    {statusLabels[project.status]}
                  </span>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-4">
                  {project.description}
                </p>
                <p className="text-xs text-zinc-400">
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}