import { Card } from '@/components/ui/card'
import {
    TrendingUp,
    ArrowUpRight,
    Zap,
    Users,
    ShieldCheck,
    Activity,
    BrainCircuit,
    BarChart3,
    Terminal,
    Cpu,
    Globe,
    CpuIcon
} from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { getAnalyticsData } from '@/lib/admin'

export const revalidate = 0 // Ensure fresh data

export default async function AnalyticsPage() {
    const { enrollmentData, auditLogs, stats: rawStats } = await getAnalyticsData()

    // Map icons to stats
    const iconMap: Record<string, any> = {
        'Avg AI Rating': BrainCircuit,
        'Grading Accuracy': ShieldCheck,
        'Pending Reviews': Activity,
        'Neural Uptime': Zap
    }

    const stats = rawStats.map(s => ({
        ...s,
        icon: iconMap[s.label] || Activity
    }))

    // Calculate monthly enrollment counts for the chart
    const monthCounts = new Array(6).fill(0)
    enrollmentData.forEach(e => {
        const monthsAgo = Math.floor((new Date().getTime() - new Date(e.enrolled_at).getTime()) / (1000 * 60 * 60 * 24 * 30))
        if (monthsAgo >= 0 && monthsAgo < 6) {
            monthCounts[5 - monthsAgo]++
        }
    })

    const maxCount = Math.max(...monthCounts, 1)
    const chartPoints = monthCounts.map((count, i) => {
        const x = (i / 5) * 100
        const y = 100 - (count / maxCount) * 80 // Leave 20% margin top/bottom
        return `${x},${y}`
    }).join(' ')

    // Month labels for 6 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const currentMonth = new Date().getMonth()
    const labels = Array.from({ length: 6 }, (_, i) => months[(currentMonth - 5 + i + 12) % 12])

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">Platform Core</span>
                            <div className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">v2.4.0 Live</span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tight text-zinc-900 dark:text-white mb-2">System Intelligence</h1>
                        <p className="text-zinc-500 font-medium max-w-xl">Deep analytics and real-time neural audit of the Mwenaro learning infrastructure.</p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                        <div className="bg-white dark:bg-zinc-900 px-4 py-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center gap-3 shadow-sm">
                            <div className="relative">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-500 animate-ping opacity-50" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 leading-none mb-1">Global Node</span>
                                <span className="text-xs font-bold text-zinc-900 dark:text-white leading-none uppercase">n-africa-east-01</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performance Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map((stat) => (
                        <Card key={stat.label} className="group relative overflow-hidden border-none bg-white dark:bg-zinc-900/50 rounded-3xl p-6 shadow-xl shadow-zinc-200/50 dark:shadow-none transition-all hover:scale-[1.02]">
                            <div className="flex justify-between items-start relative z-10 mb-6">
                                <div className={`p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 ${stat.color} transition-colors group-hover:bg-primary group-hover:text-white`}>
                                    {stat.icon && <stat.icon className="w-6 h-6" />}
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase mb-1">Status</span>
                                    <span className={`text-[10px] font-black p-1 px-2 rounded-lg ${stat.trend === 'Critical' ? 'bg-orange-500/10 text-orange-500' : 'bg-green-500/10 text-green-500'}`}>
                                        {stat.trend}
                                    </span>
                                </div>
                            </div>
                            <div className="relative z-10">
                                <p className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                                <p className="text-4xl font-black tracking-tight">{stat.value}</p>
                            </div>
                            {/* Decorative background element */}
                            <div className="absolute bottom-0 right-0 p-2 opacity-[0.03] rotate-12 group-hover:opacity-[0.08] transition-opacity">
                                {stat.icon && <stat.icon className="w-24 h-24" />}
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    {/* Enrollment Growth Chart (Refined SVG Area) */}
                    <Card className="lg:col-span-2 p-8 border-none bg-white dark:bg-zinc-900/50 rounded-[2.5rem] shadow-xl shadow-zinc-200/50 dark:shadow-none overflow-hidden relative">
                        <div className="flex justify-between items-center mb-12 relative z-10">
                            <div>
                                <h2 className="text-2xl font-black flex items-center gap-3">
                                    <BarChart3 className="w-6 h-6 text-primary" />
                                    Growth Trajectory
                                </h2>
                                <p className="text-sm text-zinc-500 font-medium">Platform traction metrics across neural clusters</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                    <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">Enrollments</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative h-64 w-full">
                            {/* SVG Area Chart */}
                            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                {/* Grid lines */}
                                {[0, 25, 50, 75, 100].map(val => (
                                    <line key={val} x1="0" y1={val} x2="100" y2={val} stroke="currentColor" strokeOpacity="0.05" strokeWidth="0.5" />
                                ))}
                                
                                <path
                                    d={`M 0,100 L 0,${chartPoints.split(' ')[0].split(',')[1]} L ${chartPoints} L 100,100 Z`}
                                    fill="url(#chartGradient)"
                                    className="transition-all duration-1000"
                                />
                                <polyline
                                    fill="none"
                                    stroke="var(--primary)"
                                    strokeWidth="2"
                                    points={chartPoints}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="transition-all duration-1000"
                                />
                                {/* Data points */}
                                {chartPoints.split(' ').map((p, i) => (
                                    <circle key={i} cx={p.split(',')[0]} cy={p.split(',')[1]} r="1" fill="white" stroke="var(--primary)" strokeWidth="0.5" />
                                ))}
                            </svg>
                        </div>
                        <div className="flex justify-between mt-8 px-2">
                            {labels.map(l => (
                                <div key={l} className="flex flex-col items-center">
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">{l}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Infrastructure Status */}
                    <Card className="p-8 border-none bg-zinc-950 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-8 border border-white/10 group-hover:rotate-6 transition-transform">
                                <Cpu className="w-7 h-7 text-white" />
                            </div>
                            <h2 className="text-3xl font-black mb-2 tracking-tight">Neural Core</h2>
                            <p className="text-zinc-400 font-medium leading-relaxed mb-10 text-sm">
                                AI grading subsystem is operating within peak parameters. Neural alignment at {rawStats[1].value}.
                            </p>
                            
                            <div className="space-y-6 mt-auto">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black tracking-widest uppercase text-zinc-500">
                                        <span>Allocated Compute</span>
                                        <span>78%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: '78%' }} />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-3">
                                        <Globe className="w-4 h-4 text-zinc-500" />
                                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">Region</span>
                                    </div>
                                    <span className="text-xs font-black text-white px-2 py-1 rounded-lg bg-white/10 uppercase tracking-tighter">Global Hub</span>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/20 rounded-full blur-[80px]" />
                    </Card>
                </div>

                {/* Audit Log (Neural Terminal Style) */}
                <Card className="overflow-hidden border-none rounded-[2.5rem] bg-zinc-950 text-zinc-300 shadow-2xl shadow-primary/5">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-zinc-900/50">
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                                <div className="w-3 h-3 rounded-full bg-orange-500/20" />
                                <div className="w-3 h-3 rounded-full bg-green-500/20" />
                            </div>
                            <div className="h-4 w-px bg-white/10 mx-2" />
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-primary" />
                                Neural Audit Terminal
                            </h2>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Stream: Active</span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                                    <th className="text-left p-8">Identifier</th>
                                    <th className="text-left p-8">Neural Context</th>
                                    <th className="text-left p-8">AI Rating</th>
                                    <th className="text-left p-8">Adjustment</th>
                                    <th className="text-right p-8">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {auditLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-16 text-center text-zinc-500 font-bold italic uppercase tracking-widest">
                                            Initializing neural feedback loop...
                                        </td>
                                    </tr>
                                ) : (
                                    auditLogs.map(log => (
                                        <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="p-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-bold text-zinc-500 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                                        {log.student.charAt(0)}
                                                    </div>
                                                    <span className="font-bold text-white tracking-tight">{log.student}</span>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <span className="text-sm font-medium text-zinc-500 group-hover:text-zinc-300 transition-colors uppercase tracking-tighter">{log.lesson}</span>
                                            </td>
                                            <td className="p-8">
                                                <div className="flex items-center gap-2">
                                                    <BrainCircuit className="w-3.5 h-3.5 text-primary opacity-50" />
                                                    <span className="font-black text-primary text-lg tracking-tighter">{log.ai_rating}%</span>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                {log.adjustment === 0 ? (
                                                    <span className="px-3 py-1 rounded-lg bg-zinc-800/50 text-zinc-600 text-[10px] font-black uppercase tracking-widest leading-none">Aligned</span>
                                                ) : (
                                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${log.adjustment > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                        {log.adjustment > 0 ? `+${log.adjustment}` : log.adjustment}% Deviation
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-8 text-right">
                                                <span className="text-[10px] font-black text-zinc-500 group-hover:text-zinc-400 transition-colors uppercase tabular-nums">{log.date}</span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-6 bg-zinc-900/50 border-t border-white/5 text-center">
                        <button className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 hover:text-primary transition-colors">
                            Initialize Deep Neural Audit (v4.0)
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    )
}
