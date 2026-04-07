'use client'

import { useState } from 'react'
import { joinAffiliateProgram, requestWithdrawal } from './actions'
import { toast } from 'sonner'
import { Copy, Users, Link as LinkIcon, DollarSign, Wallet, ArrowUpRight } from 'lucide-react'

export function AffiliateDashboardClient({ isAffiliate, stats, referrals, earnings, withdrawals }: any) {
    const [isJoining, setIsJoining] = useState(false)
    const [amount, setAmount] = useState('')
    const [mpesaNumber, setMpesaNumber] = useState('')
    const [isWithdrawing, setIsWithdrawing] = useState(false)

    const handleJoin = async () => {
        setIsJoining(true)
        const res = await joinAffiliateProgram()
        if (res.error) toast.error(res.error)
        else toast.success('Welcome to the Affiliate Program!')
        setIsJoining(false)
    }

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsWithdrawing(true)
        const res = await requestWithdrawal(Number(amount), mpesaNumber)
        if (res.error) toast.error(res.error)
        else {
            toast.success('Withdrawal request submitted.')
            setAmount('')
            setMpesaNumber('')
        }
        setIsWithdrawing(false)
    }

    const copyLink = () => {
        navigator.clipboard.writeText(stats?.link || '')
        toast.success("Affiliate link copied!")
    }

    if (!isAffiliate) {
        return (
            <div className="max-w-4xl mx-auto p-4 md:p-8 text-center pt-20">
                <div className="inline-flex items-center justify-center p-4 bg-indigo-100 text-indigo-600 rounded-full mb-6">
                    <DollarSign className="w-12 h-12" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Earn with Mwenaro Academy</h1>
                <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
                    Invite your friends to learn coding at Mwenaro Academy. When they make their first major course payment, you earn 2,000 KES directly to your M-Pesa.
                </p>
                <button 
                    onClick={handleJoin} 
                    disabled={isJoining}
                    className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
                >
                    {isJoining ? 'Creating account...' : 'Become an Partner'}
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Partner Dashboard</h1>
                <p className="text-muted-foreground mt-1">Track your invites and earnings.</p>
            </div>

            {/* Link Section */}
            <div className="bg-white dark:bg-zinc-900 border rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <LinkIcon className="w-5 h-5 text-indigo-500" />
                        Your Invite Link
                    </h3>
                    <p className="text-sm text-muted-foreground">Share this link to claim credit for your referrals.</p>
                </div>
                <div className="flex w-full md:w-auto items-center gap-2">
                    <input 
                        type="text" 
                        readOnly 
                        value={stats.link} 
                        className="flex-1 md:w-[300px] bg-zinc-50 dark:bg-zinc-950 border px-3 py-2 rounded-lg text-sm"
                    />
                    <button onClick={copyLink} className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 rounded-lg transition">
                        <Copy className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-zinc-900 border rounded-xl p-6">
                    <p className="text-sm text-muted-foreground font-medium">Total Clicks</p>
                    <p className="text-3xl font-bold mt-2">{stats.clicks}</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 border rounded-xl p-6">
                    <p className="text-sm text-muted-foreground font-medium">Signups</p>
                    <p className="text-3xl font-bold mt-2">{stats.joins}</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 border rounded-xl p-6">
                    <p className="text-sm text-muted-foreground font-medium">Qualified Leads</p>
                    <p className="text-3xl font-bold mt-2 text-indigo-600 dark:text-indigo-400">{stats.qualified}</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 border rounded-xl p-6">
                    <p className="text-sm text-muted-foreground font-medium">Total Earned</p>
                    <p className="text-3xl font-bold mt-2 text-green-600 dark:text-green-400">KES {stats.totalEarned.toLocaleString()}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
                {/* Referrals Table */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="font-semibold text-xl flex items-center gap-2 border-b pb-2">
                        <Users className="w-5 h-5 text-indigo-500" />
                        Recent Invites
                    </h3>
                    <div className="bg-white dark:bg-zinc-900 border rounded-xl overflow-hidden">
                        {referrals?.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">No one has joined using your link yet.</div>
                        ) : (
                            <table className="w-full text-sm text-left">
                                <thead className="bg-zinc-50 dark:bg-zinc-950 border-b text-muted-foreground">
                                    <tr>
                                        <th className="px-5 py-3 font-medium">Name</th>
                                        <th className="px-5 py-3 font-medium">Date</th>
                                        <th className="px-5 py-3 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {referrals?.map((r: any) => (
                                        <tr key={r.id}>
                                            <td className="px-5 py-3 font-medium">{r.profiles?.full_name || 'Anonymous User'}</td>
                                            <td className="px-5 py-3 text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                                            <td className="px-5 py-3">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                    r.status === 'qualified' 
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' 
                                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                                                }`}>
                                                    {r.status === 'qualified' ? 'Qualified' : 'Pending Payment'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Wallet & Withdrawal */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-xl flex items-center gap-2 border-b pb-2">
                        <Wallet className="w-5 h-5 text-green-500" />
                        Wallet
                    </h3>
                    
                    <div className="bg-white dark:bg-zinc-900 border rounded-xl p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20">
                        <p className="text-sm text-indigo-800 dark:text-indigo-200 font-medium">Available Balance</p>
                        <p className="text-4xl font-bold mt-1 text-indigo-900 dark:text-indigo-100">
                            KES {stats.balance.toLocaleString()}
                        </p>
                        {stats.pendingWithdrawals > 0 && (
                            <p className="text-xs text-amber-600 mt-2">
                                + KES {stats.pendingWithdrawals.toLocaleString()} pending withdrawal
                            </p>
                        )}
                    </div>

                    <form onSubmit={handleWithdraw} className="bg-white dark:bg-zinc-900 border rounded-xl p-6 space-y-4">
                        <h4 className="font-medium text-sm text-foreground">Request Withdrawal</h4>
                        
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Amount (KES)</label>
                            <input 
                                type="number" 
                                required
                                min="2000"
                                max={stats.balance}
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                className="w-full bg-zinc-50 dark:bg-zinc-950 border px-3 py-2 rounded-lg text-sm"
                                placeholder="Min. 2000"
                            />
                        </div>
                        
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">M-Pesa Number</label>
                            <input 
                                type="tel" 
                                required
                                value={mpesaNumber}
                                onChange={e => setMpesaNumber(e.target.value)}
                                className="w-full bg-zinc-50 dark:bg-zinc-950 border px-3 py-2 rounded-lg text-sm"
                                placeholder="07XX XXX XXX"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={isWithdrawing || stats.balance < 2000}
                            className="w-full flex justify-center items-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-white disabled:opacity-50 transition"
                        >
                            {isWithdrawing ? 'Processing...' : 'Withdraw Funds'}
                            <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
