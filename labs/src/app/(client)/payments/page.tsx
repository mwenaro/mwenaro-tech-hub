'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button } from '@mwenaro/ui';
import { CreditCard, CheckCircle, Clock, Download, ArrowRight, X, Banknote, Smartphone, Building } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Payment {
  _id: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  bankReference?: string;
  cashReference?: string;
  mobileMoneyReference?: string;
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

const methodLabels: Record<string, string> = {
  stripe: 'Card',
  mpesa: 'M-Pesa',
  bank_transfer: 'Bank Transfer',
  cash: 'Cash',
  mobile_money: 'Mobile Money',
};

const paymentMethods = [
  { id: 'cash', label: 'Cash', icon: Banknote, desc: 'Pay with cash at our office' },
  { id: 'mobile_money', label: 'Mobile Money', icon: Smartphone, desc: 'Send via M-Pesa, MTN, Airtel' },
  { id: 'bank_transfer', label: 'Bank Transfer', icon: Building, desc: 'Direct bank transfer' },
];

export default function PaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [reference, setReference] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  const handlePayClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
    setSelectedMethod('');
    setReference('');
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayment || !selectedMethod) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: selectedPayment._id,
          method: selectedMethod,
          reference,
        }),
      });

      if (res.ok) {
        setPayments(payments.map(p => 
          p._id === selectedPayment._id ? { ...p, status: 'pending', method: selectedMethod } : p
        ));
        setShowPaymentModal(false);
        alert('Payment proof submitted! We will verify and update your payment status.');
      }
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadReceipt = (payment: Payment) => {
    const receiptContent = `
PAYMENT RECEIPT
==============
Project: ${payment.projectId?.title || 'N/A'}
Amount: ${payment.currency} ${payment.amount.toLocaleString()}
Status: ${statusLabels[payment.status]}
Method: ${methodLabels[payment.method] || 'N/A'}
${payment.bankReference ? `Bank Ref: ${payment.bankReference}` : ''}
${payment.cashReference ? `Cash Ref: ${payment.cashReference}` : ''}
${payment.mobileMoneyReference ? `MM Ref: ${payment.mobileMoneyReference}` : ''}
Date Paid: ${payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : 'N/A'}
Date Created: ${new Date(payment.createdAt).toLocaleDateString()}
    `.trim();

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${payment._id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
                  <th className="text-left p-4 font-medium text-sm text-zinc-500">Method</th>
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
                      {methodLabels[payment.method] || '-'}
                    </td>
                    <td className="p-4 text-sm text-zinc-500">
                      {payment.dueDate ? new Date(payment.dueDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="p-4 text-sm text-zinc-500">
                      {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="p-4">
                      {payment.status === 'pending' ? (
                        <Button size="sm" onClick={() => handlePayClick(payment)}>
                          Pay Now <ArrowRight size={16} className="ml-1" />
                        </Button>
                      ) : payment.status === 'paid' ? (
                        <Button size="sm" variant="ghost" onClick={() => handleDownloadReceipt(payment)}>
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

      {showPaymentModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Make Payment</h2>
              <button onClick={() => setShowPaymentModal(false)} className="text-zinc-400 hover:text-zinc-600">
                <X size={24} />
              </button>
            </div>

            <div className="mb-6 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
              <p className="text-sm text-zinc-500">Amount Due</p>
              <p className="text-2xl font-bold">${selectedPayment.amount.toLocaleString()}</p>
              <p className="text-sm text-zinc-500">{selectedPayment.projectId?.title}</p>
            </div>

            <form onSubmit={handleSubmitPayment} className="space-y-4">
              <div>
                <Label className="mb-2 block">Select Payment Method</Label>
                <div className="space-y-2">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedMethod(method.id)}
                      className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                        selectedMethod === method.id
                          ? 'border-primary bg-primary/10'
                          : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                      }`}
                    >
                      <method.icon className="w-6 h-6" />
                      <div className="text-left">
                        <p className="font-medium">{method.label}</p>
                        <p className="text-sm text-zinc-500">{method.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="reference">Reference/Transaction ID (Optional)</Label>
                <Input
                  id="reference"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Enter your transaction reference"
                />
              </div>

              <Button type="submit" className="w-full" disabled={!selectedMethod || submitting}>
                {submitting ? 'Submitting...' : 'Submit Payment Proof'}
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
