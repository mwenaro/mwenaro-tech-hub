'use client';

import { useEffect, useState } from 'react';
import { Card, Button } from '@mwenaro/ui';
import { LayoutDashboard, Users, FolderKanban, FileText, TrendingUp, DollarSign, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface Stats {
  totalClients: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalRevenue: number;
  pendingProposals: number;
}

interface RecentProject {
  _id: string;
  title: string;
  status: string;
  clientId: { name: string };
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalClients: 0,
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalRevenue: 0,
    pendingProposals: 0,
  });
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        setStats(data.stats || stats);
        setRecentProjects(data.recentProjects || []);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-zinc-500 mt-1">Overview of your Labs business</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link href="/admin/clients">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="text-primary" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalClients}</p>
                <p className="text-sm text-zinc-500">Total Clients</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/admin/projects">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FolderKanban className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.activeProjects}</p>
                <p className="text-sm text-zinc-500">Active Projects</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/admin/proposals">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <FileText className="text-yellow-600 dark:text-yellow-400" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pendingProposals}</p>
                <p className="text-sm text-zinc-500">Pending Proposals</p>
              </div>
            </div>
          </Card>
        </Link>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <DollarSign className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-zinc-500">Total Revenue</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Recent Projects</h2>
            <Link href="/admin/projects" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          {recentProjects.length === 0 ? (
            <p className="text-zinc-500 text-center py-8">No projects yet</p>
          ) : (
            <div className="space-y-3">
              {recentProjects.map((project) => (
                <div key={project._id} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                  <div>
                    <p className="font-medium">{project.title}</p>
                    <p className="text-sm text-zinc-500">{project.clientId?.name || 'Unknown client'}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    project.status === 'active' ? 'bg-primary/10 text-primary' :
                    project.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                  }`}>
                    {project.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/admin/proposals">
              <Button variant="outline" className="w-full justify-start">
                <FileText size={18} className="mr-2" /> Review Proposals
              </Button>
            </Link>
            <Link href="/admin/clients">
              <Button variant="outline" className="w-full justify-start">
                <Users size={18} className="mr-2" /> Invite New Client
              </Button>
            </Link>
            <Link href="/admin/team">
              <Button variant="outline" className="w-full justify-start">
                <Users size={18} className="mr-2" /> Manage Team
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}