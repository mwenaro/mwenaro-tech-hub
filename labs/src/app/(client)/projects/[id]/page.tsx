'use client';

import { useEffect, useState, type FormEvent, type ChangeEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Button } from '@mwenaro/ui';
import { ArrowLeft, Clock, CheckCircle, AlertCircle, DollarSign, MessageSquare, Calendar, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Project {
  _id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  proposalDetails: {
    problem: string;
    targetUsers: string;
    features: { name: string; description: string; priority: string }[];
    budget: { min: number; max: number; currency: string };
    timeline: string;
  };
  pricing: {
    model: string;
    totalAmount: number;
    currency: string;
  };
  milestones: {
    _id: string;
    name: string;
    description: string;
    amount: number;
    status: string;
    dueDate: string;
  }[];
  clientUpdates: { title: string; description: string; createdAt: string }[];
  timeline: {
    startDate: string;
    endDate: string;
    estimatedCompletion: string;
  };
  activities: { type: string; content: string; createdAt: string }[];
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  _id: string;
  userId: { name: string; role: string };
  content: string;
  reactions: { userId: string; emoji: string }[];
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

const priorityLabels: Record<string, string> = {
  must_have: 'Must Have',
  nice_to_have: 'Nice to Have',
  can_wait: 'Can Wait',
};

const priorityColors: Record<string, string> = {
  must_have: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  nice_to_have: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  can_wait: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'updates' | 'comments' | 'activity'>('overview');
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${params.id}`);
      const data = await res.json();

      if (data.error) {
        router.push('/dashboard');
        return;
      }

      setProject(data.project);
      setComments(data.comments || []);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [params.id, router]);

  const handleAddComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await fetch(`/api/projects/${params.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      });

      if (res.ok) {
        const data = await res.json();
        setComments([data.comment, ...comments]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Comment error:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-zinc-500 hover:text-zinc-700">
          <ArrowLeft size={18} /> Back to Projects
        </button>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{project.title}</h1>
          <p className="text-zinc-500 mt-1 capitalize">{project.type} Project</p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[project.status]}`}>
          {statusLabels[project.status]}
        </span>
      </div>

      <div className="flex gap-2 mb-6 border-b">
        {(['overview', 'milestones', 'updates', 'comments', 'activity'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'text-primary border-b-2 border-primary'
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">Project Description</h2>
              <p className="text-zinc-600 dark:text-zinc-400">{project.description}</p>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">Problem & Goals</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-zinc-500 mb-1">Problem Solved</p>
                  <p>{project.proposalDetails.problem || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-500 mb-1">Target Users</p>
                  <p>{project.proposalDetails.targetUsers || 'Not specified'}</p>
                </div>
              </div>
            </Card>

            {project.proposalDetails.features.length > 0 && (
              <Card className="p-6">
                <h2 className="text-lg font-bold mb-4">Features ({project.proposalDetails.features.length})</h2>
                <div className="space-y-3">
                  {project.proposalDetails.features.map((feature, i) => (
                    <div key={i} className="flex items-start justify-between p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                      <div>
                        <p className="font-medium">{feature.name}</p>
                        <p className="text-sm text-zinc-500">{feature.description}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[feature.priority]}`}>
                        {priorityLabels[feature.priority]}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-bold mb-4">Project Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="text-zinc-400" size={18} />
                  <div>
                    <p className="text-sm text-zinc-500">Budget</p>
                    <p className="font-medium">
                      ${project.proposalDetails.budget.min} - ${project.proposalDetails.budget.max}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="text-zinc-400" size={18} />
                  <div>
                    <p className="text-sm text-zinc-500">Timeline</p>
                    <p className="font-medium">{project.proposalDetails.timeline || 'Not specified'}</p>
                  </div>
                </div>
                {project.pricing.totalAmount > 0 && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="text-zinc-400" size={18} />
                    <div>
                      <p className="text-sm text-zinc-500">Agreed Price</p>
                      <p className="font-medium">${project.pricing.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>
                )}
                {project.timeline?.startDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="text-zinc-400" size={18} />
                    <div>
                      <p className="text-sm text-zinc-500">Duration</p>
                      <p className="font-medium">
                        {new Date(project.timeline.startDate).toLocaleDateString()} - {project.timeline.endDate ? new Date(project.timeline.endDate).toLocaleDateString() : 'TBD'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'milestones' && (
        <div className="space-y-6">
          {project.milestones.length === 0 ? (
            <Card className="p-12 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-zinc-300 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Milestones Yet</h3>
              <p className="text-zinc-500">Milestones will be created once your project is accepted</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.milestones.map((milestone, i) => (
                <Card key={milestone._id} className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                        {i + 1}
                      </div>
                      <h3 className="font-bold">{milestone.name}</h3>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      milestone.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      milestone.status === 'in_progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                    }`}>
                      {milestone.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500 mb-3">{milestone.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500">${milestone.amount.toLocaleString()}</span>
                    {milestone.dueDate && (
                      <span className="text-zinc-400">
                        Due {new Date(milestone.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'updates' && (
        <div className="space-y-6">
          {project.clientUpdates.length === 0 ? (
            <Card className="p-12 text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-zinc-300 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Updates Yet</h3>
              <p className="text-zinc-500">Project updates will appear here</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {project.clientUpdates.map((update, i) => (
                <Card key={i} className="p-6">
                  <h3 className="font-bold mb-2">{update.title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">{update.description}</p>
                  <p className="text-sm text-zinc-400 mt-3">
                    {new Date(update.createdAt).toLocaleDateString()}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'comments' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Discussion</h2>
            <form onSubmit={handleAddComment} className="mb-6">
              <div className="flex gap-2">
                <Textarea
                  value={newComment}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  rows={2}
                  className="flex-1"
                />
                <Button type="submit" disabled={!newComment.trim() || submittingComment}>
                  <Send size={18} />
                </Button>
              </div>
            </form>

            {comments.length === 0 ? (
              <p className="text-center text-zinc-500 py-8">No comments yet. Start the conversation!</p>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment._id} className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {comment.userId?.name?.charAt(0) || '?'}
                      </div>
                      <span className="font-medium">{comment.userId?.name || 'Unknown'}</span>
                      <span className="text-xs text-zinc-400">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="space-y-4">
          {project.activities.length === 0 ? (
            <Card className="p-12 text-center">
              <Clock className="mx-auto h-12 w-12 text-zinc-300 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Activity</h3>
              <p className="text-zinc-500">Project activity will appear here</p>
            </Card>
          ) : (
            project.activities.slice().reverse().map((activity, i) => (
              <Card key={i} className="p-4">
                <p className="text-sm">{activity.content}</p>
                <p className="text-xs text-zinc-400 mt-2">
                  {new Date(activity.createdAt).toLocaleDateString()}
                </p>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}