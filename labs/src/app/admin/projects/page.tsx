'use client';

import { useEffect, useState } from 'react';
import { Card, Button } from '@mwenaro/ui';
import { FolderKanban, Search, Filter, Plus, MoreVertical, Users, Calendar, DollarSign } from 'lucide-react';

interface Project {
  _id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  pricing: { totalAmount: number; model: string };
  timeline: { startDate: string; endDate: string };
  clientId: { name: string; email: string; company: string };
  assignedTeam: { lead: { name: string } };
  createdAt: string;
}

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

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`/api/admin/projects${filter !== 'all' ? `?status=${filter}` : ''}`);
        const data = await res.json();
        setProjects(data.projects || []);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [filter]);

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.clientId?.name?.toLowerCase().includes(search.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-zinc-500 mt-1">Manage all projects</p>
        </div>
      </div>

      <Card className="p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border bg-background"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border bg-background"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="accepted">Accepted</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </Card>

      {filteredProjects.length === 0 ? (
        <Card className="p-12 text-center">
          <FolderKanban className="mx-auto h-12 w-12 text-zinc-300 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No projects found</h3>
          <p className="text-zinc-500">Projects will appear here</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project._id} className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-lg">{project.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
                  {project.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-zinc-500 mb-4 line-clamp-2">{project.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Users size={14} />
                  <span>{project.clientId?.name || 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-500">
                  <DollarSign size={14} />
                  <span>${project.pricing.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-500">
                  <Calendar size={14} />
                  <span>{project.timeline.startDate ? new Date(project.timeline.startDate).toLocaleDateString() : 'Not set'}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}