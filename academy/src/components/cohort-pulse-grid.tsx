'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
    Users, 
    TrendingUp, 
    AlertCircle, 
    CheckCircle2,
    BookOpen,
    ArrowUpRight
} from 'lucide-react'
import { CohortAnalytics } from '@/lib/instructor'

interface CohortPulseGridProps {
    cohorts: CohortAnalytics[]
}

export function CohortPulseGrid({ cohorts }: CohortPulseGridProps) {
    if (cohorts.length === 0) {
        return (
            <div className="h-64 flex flex-col items-center justify-center text-zinc-400 bg-zinc-50 dark:bg-zinc-900/20 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                <Users className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-bold text-lg text-zinc-900 dark:text-zinc-100">No active cohorts</p>
                <p className="text-sm">Assigned cohorts will appear here.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cohorts.map((cohort) => (
                <Card key={cohort.id} className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
                    {/* Background Accent */}
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                        <TrendingUp className="w-32 h-32 text-primary" />
                    </div>

                    <div className="relative z-10 space-y-6">
                        {/* Header */}
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-black text-[10px] uppercase tracking-wider h-6">
                                    {cohort.name}
                                </Badge>
                                <Badge variant="outline" className="text-[10px] font-bold border-zinc-200 dark:border-zinc-800">
                                    {cohort.student_count} Students
                                </Badge>
                            </div>
                            <h3 className="text-xl font-black text-zinc-900 dark:text-white truncate pr-8">
                                {cohort.course_title}
                            </h3>
                        </div>

                        {/* Progress Stats */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-500">
                                    <span>Average Progress</span>
                                    <span className="text-zinc-900 dark:text-white">{cohort.avg_progress}%</span>
                                </div>
                                <Progress value={cohort.avg_progress} className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Avg Grade</p>
                                    <div className="flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4 text-blue-500" />
                                        <p className="text-lg font-black text-zinc-900 dark:text-white">{cohort.avg_grade}%</p>
                                    </div>
                                </div>
                                <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Completion</p>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        <p className="text-lg font-black text-zinc-900 dark:text-white">{cohort.completion_rate}%</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Status */}
                        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
                            <div className="flex items-center gap-2">
                                {cohort.at_risk_count > 0 ? (
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-500 rounded-full">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        <span className="text-[11px] font-black uppercase">{cohort.at_risk_count} At Risk</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 rounded-full">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span className="text-[11px] font-black uppercase">Cohort Healthy</span>
                                    </div>
                                )}
                            </div>
                            
                            <button className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-primary hover:text-white transition-colors">
                                <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    )
}

function GraduationCap(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
    )
}
