'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button } from '@mwenaro/ui';
import { FileText, Search, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

interface Proposal {
  _id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  proposalDetails: {
    budget: { min: number; max: number };
    timeline: string;
  };
  clientId: { name: string; email: string };
  createdAt: string;
}

const statusColors: Record<string, string> = {
  submitted: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  under_review: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  accepted: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function AdminProposalsPage() {
  const router = useRouter();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'submitted' | 'under_review'>('all');

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const res = await fetch('/api/admin/proposals');
        const data = await res.json();
        setProposals(data.proposals || []);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  const filteredProposals = proposals.filter(p => 
    filter === 'all' ? true : p.status === filter
  );

  const handleReview = async (id: string, action: 'accept' | 'reject') => {
    try {
      const res = await fetch(`/api/admin/proposals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        setProposals(proposals.map(p => 
          p._id === id ? { ...p, status: action === 'accept' ? 'accepted' : 'rejected' } : p
        ));
      }
    } catch (error) {
      console.error('Review error:', error);
    }
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Proposals</h1>
        <p className="text-zinc-500 mt-1">Review incoming project proposals</p>
      </div>

      <div className="flex gap-2 mb-6">
        {(['all', 'submitted', 'under_review'] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f === 'submitted' ? 'Submitted' : 'Under Review'}
          </Button>
        ))}
      </div>

      {filteredProposals.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-zinc-300 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No proposals found</h3>
          <p className="text-zinc-500">New proposals will appear here</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredProposals.map((proposal) => (
            <Card key={proposal._id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold">{proposal.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[proposal.status]}`}>
                      {proposal.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500 mb-3 line-clamp-2">{proposal.description}</p>
                  <div className="flex items-center gap-4 text-sm text-zinc-500">
                    <span>By: {proposal.clientId?.name || 'Unknown'}</span>
                    <span>Type: {proposal.type}</span>
                    <span>Budget: ${proposal.proposalDetails.budget.min} - ${proposal.proposalDetails.budget.max}</span>
                    <span>Timeline: {proposal.proposalDetails.timeline || 'Not specified'}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-2">
                    Submitted {new Date(proposal.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  {['submitted', 'under_review'].includes(proposal.status) && (
                    <>
                      <Button size="sm" onClick={() => handleReview(proposal._id, 'accept')}>
                        <CheckCircle size={16} className="mr-1" /> Accept
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleReview(proposal._id, 'reject')}>
                        <XCircle size={16} className="mr-1" /> Reject
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => router.push(`/admin/proposals/${proposal._id}`)}>
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}