'use client';

import { useEffect, useState } from 'react';
import { Card, Button } from '@mwenaro/ui';
import { FolderKanban, Search, Plus, Users, Calendar, DollarSign, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

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
  pendingChanges?: {
    title?: string;
    description?: string;
    submittedAt?: string;
  };
  createdAt: string;
}

const statusColors: Record<string, string> = {
  draft: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  pending: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
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
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const params = new URLSearchParams();
        if (filter !== 'all') params.set('status', filter);
        if (filter === 'pending_changes') params.set('pendingChanges', 'true');
        
        const res = await fetch(`/api/admin/projects?${params}`);
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

  const handleApproveChanges = async (projectId: string) => {
    setProcessing(true);
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, action: 'approveChanges' }),
      });

      if (res.ok) {
        setProjects(projects.filter(p => p._id !== projectId));
        setShowPendingModal(false);
      }
    } catch (error) {
      console.error('Approve error:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleRejectChanges = async (projectId: string) => {
    if (!rejectReason.trim()) return;
    
    setProcessing(true);
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, action: 'rejectChanges', rejectReason }),
      });

      if (res.ok) {
        setProjects(projects.filter(p => p._id !== projectId));
        setShowPendingModal(false);
        setRejectReason('');
      }
    } catch (error) {
      console.error('Reject error:', error);
    } finally {
      setProcessing(false);
    }
  };

  const openPendingModal = (project: Project) => {
    setSelectedProject(project);
    setShowPendingModal(true);
  };

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
            <option value="pending">Pending Review</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="accepted">Accepted</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="pending_changes">Pending Client Changes</option>
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
            <Card key={project._id} className="p-6 relative">
              {project.pendingChanges?.submittedAt && (
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-xs font-medium flex items-center gap-1">
                    <AlertTriangle size={12} />
                    Changes Pending
                  </span>
                </div>
              )}
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-lg pr-20">{project.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
                  {project.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-zinc-500 mb-4 line-clamp-2">{project.description}</p>
              
              <div className="space-y-2 text-sm mb-4">
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
                  <span>{project.timeline?.startDate ? new Date(project.timeline.startDate).toLocaleDateString() : 'Not set'}</span>
                </div>
              </div>

              {project.pendingChanges?.submittedAt && (
                <Button size="sm" className="w-full" onClick={() => openPendingModal(project)}>
                  Review Changes
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}

      {showPendingModal && selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl p-6 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Review Pending Changes</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                <h3 className="font-bold mb-2">Current Project</h3>
                <p className="text-sm"><span className="font-medium">Title:</span> {selectedProject.title}</p>
                <p className="text-sm"><span className="font-medium">Description:</span> {selectedProject.description}</p>
              </div>

              {selectedProject.pendingChanges?.title && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-bold mb-2 text-green-700 dark:text-green-400">Proposed Changes</h3>
                  {selectedProject.pendingChanges.title && (
                    <p className="text-sm"><span className="font-medium">Title:</span> {selectedProject.pendingChanges.title}</p>
                  )}
                  {selectedProject.pendingChanges.description && (
                    <p className="text-sm"><span className="font-medium">Description:</span> {selectedProject.pendingChanges.description}</p>
                  )}
                  <p className="text-xs text-zinc-500 mt-2">
                    Submitted: {selectedProject.pendingChanges.submittedAt ? new Date(selectedProject.pendingChanges.submittedAt).toLocaleString() : 'Unknown'}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Reject Reason (optional)</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Reason for rejection..."
                  className="w-full p-3 rounded-lg border"
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleRejectChanges(selectedProject._id)}
                  disabled={processing || !rejectReason.trim()}
                >
                  <XCircle size={16} className="mr-2" />
                  Reject Changes
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => handleApproveChanges(selectedProject._id)}
                  disabled={processing}
                >
                  <CheckCircle size={16} className="mr-2" />
                  Approve Changes
                </Button>
              </div>
            </div>

            <Button variant="ghost" className="w-full mt-4" onClick={() => setShowPendingModal(false)}>
              Cancel
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
