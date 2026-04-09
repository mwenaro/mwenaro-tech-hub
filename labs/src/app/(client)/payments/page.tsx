'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button } from '@mwenaro/ui';
import { CreditCard, CheckCircle, Clock, AlertCircle, Download, ArrowRight } from 'lucide-react';

interface Payment {
  _id: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  description: string;
  dueDate: string;
  paidAt: string;
  createdAt: string;
  projectId: {
    _id: string;
    title: string;
  };
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  paid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  refunded: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  cancelled: 'bg-zinc-100 text-zinc-500',
};

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  paid: 'Paid',
  failed: 'Failed',
  refunded: 'Refunded',
  cancelled: 'Cancelled',
};

export default function PaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch('/api/payments');
        const data = await res.json();
        setPayments(data.payments || []);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const stats = {
    total: payments.length,
    pending: payments.filter(p => p.status === 'pending').length,
    paid: payments.filter(p => p.status === 'paid').length,
    totalPending: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    totalPaid: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
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
        <h1 className="text-3xl font-bold">Payments</h1>
        <p className="text-zinc-500 mt-1">View and manage your project payments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <CreditCard className="text-zinc-600 dark:text-zinc-400" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-zinc-500">Total Payments</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <Clock className="text-yellow-600 dark:text-yellow-400" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-sm text-zinc-500">Pending</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.paid}</p>
              <p className="text-sm text-zinc-500">Completed</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <CreditCard className="text-primary" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">${stats.totalPending.toLocaleString()}</p>
              <p className="text-sm text-zinc-500">Pending Amount</p>
            </div>
          </div>
        </Card>
      </div>

      {payments.length === 0 ? (
        <Card className="p-12 text-center">
          <CreditCard className="mx-auto h-12 w-12 text-zinc-300 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No payments yet</h3>
          <p className="text-zinc-500">Payments will appear here once your project is accepted</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-50 dark:bg-zinc-900 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-sm text-zinc-500">Project</th>
                  <th className="text-left p-4 font-medium text-sm text-zinc-500">Amount</th>
                  <th className="text-left p-4 font-medium text-sm text-zinc-500">Status</th>
                  <th className="text-left p-4 font-medium text-sm text-zinc-500">Due Date</th>
                  <th className="text-left p-4 font-medium text-sm text-zinc-500">Paid Date</th>
                  <th className="text-left p-4 font-medium text-sm text-zinc-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment._id} className="border-b hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                    <td className="p-4">
                      <p className="font-medium">{payment.projectId?.title || 'Unknown Project'}</p>
                      <p className="text-sm text-zinc-500">{payment.description}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium">${payment.amount.toLocaleString()}</p>
                      <p className="text-sm text-zinc-500 uppercase">{payment.currency}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[payment.status]}`}>
                        {statusLabels[payment.status]}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-zinc-500">
                      {payment.dueDate ? new Date(payment.dueDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="p-4 text-sm text-zinc-500">
                      {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="p-4">
                      {payment.status === 'pending' ? (
                        <Button size="sm">
                          Pay Now <ArrowRight size={16} className="ml-1" />
                        </Button>
                      ) : payment.status === 'paid' ? (
                        <Button size="sm" variant="ghost">
                          <Download size={16} className="mr-1" /> Receipt
                        </Button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}