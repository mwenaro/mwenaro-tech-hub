import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getInstructorStats, getInstructorPayments } from '@/lib/instructor'
import { Card } from '@/components/ui/card'
import { DollarSign, Clock, ArrowUpRight, FileCheck } from 'lucide-react'
import { format } from 'date-fns'

export const revalidate = 0

export default async function InstructorPaymentsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const role = user.user_metadata?.role || 'student'
    if (role !== 'instructor') redirect('/dashboard')

    const stats = await getInstructorStats(user.id)
    const payments = await getInstructorPayments(user.id)

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 p-8">
            <div className="max-w-7xl mx-auto space-y-12">
                
                {/* Header */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <DollarSign className="w-6 h-6 text-primary" />
                            </div>
                            <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">Revenue & Payouts</h1>
                        </div>
                        <p className="text-zinc-500 font-medium ml-1">Track your earnings and payout history.</p>
                    </div>
                </div>

                {/* Financial Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 rounded-2xl shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">Available now</span>
                        </div>
                        <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-1">Total Earnings</p>
                        <p className="text-4xl font-black">${stats.totalEarnings.toFixed(2)}</p>
                    </Card>

                    <Card className="p-6 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 rounded-2xl shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
                                <Clock className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold text-orange-500 bg-orange-500/10 px-2 py-1 rounded-lg flex items-center gap-1">
                                <ArrowUpRight className="w-3 h-3" /> Processing
                            </span>
                        </div>
                        <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-1">Pending Payouts</p>
                        <p className="text-4xl font-black">${stats.pendingPayouts.toFixed(2)}</p>
                    </Card>

                    <Card className="p-6 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 rounded-2xl shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                                <FileCheck className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-1">Total Course Revenue</p>
                        <p className="text-3xl font-black">${stats.totalRevenue.toFixed(2)}</p>
                        <p className="text-sm text-zinc-400 mt-2 font-medium">All-time sales from your courses</p>
                    </Card>
                </div>

                {/* History Table */}
                <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 rounded-3xl overflow-hidden shadow-sm">
                    <div className="p-8 border-b border-zinc-200 dark:border-zinc-800">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">Payout History</h2>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-zinc-50/50 dark:bg-zinc-950/50">
                                    <th className="text-left p-6 text-xs font-bold uppercase tracking-wider text-muted-foreground w-1/4">Date</th>
                                    <th className="text-left p-6 text-xs font-bold uppercase tracking-wider text-muted-foreground w-1/3">Description</th>
                                    <th className="text-center p-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                                    <th className="text-right p-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                                {payments.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-12 text-center text-muted-foreground italic font-medium">
                                            No payout history available yet.
                                        </td>
                                    </tr>
                                ) : (
                                    payments.map((payment) => (
                                        <tr key={payment.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                                            <td className="p-6 font-medium text-foreground">
                                                {format(new Date(payment.created_at), 'MMM d, yyyy')}
                                            </td>
                                            <td className="p-6 text-muted-foreground font-medium">
                                                {payment.description || 'Instructor Payout'} 
                                                {payment.period_start && payment.period_end && 
                                                    <span className="block text-xs text-zinc-400 mt-1 uppercase tracking-wide">
                                                        Period: {format(new Date(payment.period_start), 'MMM d')} - {format(new Date(payment.period_end), 'MMM d, yyyy')}
                                                    </span>
                                                }
                                            </td>
                                            <td className="p-6 text-center">
                                                <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
                                                    payment.status === 'paid' ? 'bg-green-500/10 text-green-500' :
                                                    payment.status === 'failed' ? 'bg-red-500/10 text-red-500' :
                                                    'bg-orange-500/10 text-orange-500'
                                                }`}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                            <td className="p-6 text-right font-black text-lg text-foreground">
                                                ${Number(payment.amount).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

            </div>
        </div>
    )
}
