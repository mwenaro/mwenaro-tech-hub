'use client'

import { useState } from 'react'
import { QuizSubmission, grantRetrial } from '@/lib/progress'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    CheckCircle2,
    XCircle,
    Search,
    ChevronRight,
    ArrowLeft,
    Clock
} from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { format } from 'date-fns'

export function QuizzesManagementClient({ 
    initialSubmissions, 
    retrialRequests = [] 
}: { 
    initialSubmissions: QuizSubmission[],
    retrialRequests?: any[]
}) {
    const [searchQuery, setSearchQuery] = useState('')
    const [grantingId, setGrantingId] = useState<string | null>(null)

    const handleGrantRetrial = async (lessonId: string, userId: string) => {
        setGrantingId(`${lessonId}-${userId}`)
        try {
            const res = await grantRetrial(lessonId, userId)
            if (res.success) {
                toast.success('Extra attempts granted successfully!')
                // In a real app, we'd remove it from the list or revalidate
            } else {
                toast.error(res.message)
            }
        } catch (e) {
            toast.error('Failed to grant retrial')
        } finally {
            setGrantingId(null)
        }
    }

    const filtered = initialSubmissions.filter(s =>
        (s.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.lessons?.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.lessons?.phase_lessons?.[0]?.phases?.courses?.title.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    return (
            <Tabs defaultValue="submissions" className="w-full">
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-8">
                    <TabsList className="bg-zinc-100 dark:bg-zinc-800 p-1 rounded-2xl h-14 w-full md:w-auto">
                        <TabsTrigger 
                            value="submissions" 
                            className="rounded-xl px-8 h-full data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-lg data-[state=active]:text-primary font-black transition-all"
                        >
                            All Submissions
                        </TabsTrigger>
                        <TabsTrigger 
                            value="requests" 
                            className="rounded-xl px-8 h-full data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-lg data-[state=active]:text-primary font-black transition-all relative"
                        >
                            Retrial Requests
                            {retrialRequests.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full animate-pulse">
                                    {retrialRequests.length}
                                </span>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input
                            placeholder="Search students or lessons..."
                            className="pl-12 h-14 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm focus:ring-primary font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <TabsContent value="submissions">
                    <Card className="overflow-hidden border-zinc-200 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-900/50 shadow-2xl shadow-zinc-200/50 dark:shadow-none">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                                <th className="text-left p-6 text-xs font-bold uppercase tracking-wider text-zinc-400">Student Identity</th>
                                <th className="text-left p-6 text-xs font-bold uppercase tracking-wider text-zinc-400">Lesson / Course</th>
                                <th className="text-left p-6 text-xs font-bold uppercase tracking-wider text-zinc-400">Result</th>
                                <th className="text-left p-6 text-xs font-bold uppercase tracking-wider text-zinc-400">Attempt Date</th>
                                <th className="text-right p-6 text-xs font-bold uppercase tracking-wider text-zinc-400">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-zinc-500 italic">
                                        No quiz submissions found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((s) => (
                                    <tr key={s.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {s.profiles?.email?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-zinc-900 dark:text-zinc-100">{s.profiles?.full_name || 'Anonymous'}</p>
                                                    <p className="text-sm text-zinc-500 font-medium">{s.profiles?.email || 'No email'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="space-y-1">
                                                <p className="text-sm font-black text-primary uppercase tracking-tight">{s.lessons?.phase_lessons?.[0]?.phases?.courses?.title || 'Unknown Course'}</p>
                                                <p className="text-sm text-zinc-500 font-medium line-clamp-1">{s.lessons?.title}</p>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="flex flex-col">
                                                    <span className={`text-lg font-black ${s.passed ? 'text-green-500' : 'text-red-500'}`}>
                                                        {s.score}%
                                                    </span>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${s.passed ? 'text-green-500/60' : 'text-red-500/60'}`}>
                                                        {s.passed ? 'PASSED' : 'FAILED'}
                                                    </span>
                                                </div>
                                                {s.passed ? (
                                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                ) : (
                                                    <XCircle className="w-5 h-5 text-red-500" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                                {format(new Date(s.created_at), 'MMM d, yyyy')}
                                            </p>
                                            <p className="text-xs text-zinc-500 font-medium">
                                                {format(new Date(s.created_at), 'h:mm a')}
                                            </p>
                                        </td>
                                        <td className="p-6 text-right">
                                            <Link href={`/dashboard/quizzes?id=${s.id}`}>
                                                <Button variant="ghost" className="rounded-xl h-10 w-10 p-0 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                                    <ChevronRight className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </TabsContent>

        <TabsContent value="requests">
            <Card className="overflow-hidden border-zinc-200 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-900/50">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                                <th className="text-left p-6 text-xs font-bold uppercase tracking-wider text-zinc-400">Student Identity</th>
                                <th className="text-left p-6 text-xs font-bold uppercase tracking-wider text-zinc-400">Lesson Context</th>
                                <th className="text-left p-6 text-xs font-bold uppercase tracking-wider text-zinc-400">Current Status</th>
                                <th className="text-right p-6 text-xs font-bold uppercase tracking-wider text-zinc-400">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                            {retrialRequests.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-zinc-500 italic">
                                        No pending retrial requests.
                                    </td>
                                </tr>
                            ) : (
                                retrialRequests.map((r) => (
                                    <tr key={`${r.lesson_id}-${r.user_id}`} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 font-bold">
                                                    {r.profiles?.email?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-zinc-900 dark:text-zinc-100">{r.profiles?.full_name || 'Anonymous'}</p>
                                                    <p className="text-sm text-zinc-500 font-medium">{r.profiles?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="space-y-1">
                                                <p className="text-sm font-black text-primary uppercase tracking-tight">
                                                    {r.lessons?.phase_lessons?.[0]?.phases?.courses?.title || 'Unknown Course'}
                                                </p>
                                                <p className="text-sm text-zinc-500 font-medium">{r.lessons?.title}</p>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                                                    {r.quiz_attempts} Attempts Used
                                                </span>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                                                    STUCK AT {r.highest_quiz_score}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            <Button 
                                                onClick={() => handleGrantRetrial(r.lesson_id, r.user_id)}
                                                disabled={grantingId === `${r.lesson_id}-${r.user_id}`}
                                                className="rounded-xl px-6 bg-primary text-white font-black h-11"
                                            >
                                                {grantingId === `${r.lesson_id}-${r.user_id}` ? 'Granting...' : 'Grant 2 Extra Attempts'}
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </TabsContent>
    </Tabs>
    )
}
