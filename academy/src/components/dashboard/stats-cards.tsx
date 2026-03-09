import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, CheckCircle, Clock, Zap, Target } from "lucide-react"
import type { Course } from "@/lib/courses"

interface StatsCardsProps {
    courses: (Course & { progress: number })[]
    streak?: number
    quizzesAttempted?: number
    learningHours?: number
}

export function StatsCards({ courses, streak = 0, quizzesAttempted = 0, learningHours = 0 }: StatsCardsProps) {
    const enrolledCount = courses.length
    const completedCount = courses.filter(c => c.progress === 100).length

    // Calculate next milestone for streak
    const milestones = [7, 30, 100, 365]
    const nextMilestone = milestones.find(m => m > streak) || milestones[milestones.length - 1]
    const streakProgress = Math.min((streak / nextMilestone) * 100, 100)

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Enrolled Courses */}
            <Card className="relative overflow-hidden border-none bg-zinc-950 text-white shadow-2xl group transition-all hover:scale-[1.02]">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <BookOpen className="h-24 w-24 text-white" />
                </div>
                <CardContent className="p-6 relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
                            <BookOpen className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Courses</span>
                    </div>
                    <div className="text-4xl font-black mb-1">{enrolledCount}</div>
                    <p className="text-sm font-bold text-zinc-500">Currently active</p>
                </CardContent>
            </Card>

            {/* Completed */}
            <Card className="relative overflow-hidden border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl transition-all hover:scale-[1.02]">
                <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Completed</span>
                    </div>
                    <div className="text-4xl font-black mb-1">{completedCount}</div>
                    <p className="text-sm font-bold text-zinc-500">Skills mastered</p>
                </CardContent>
            </Card>

            {/* Learning Hours */}
            <Card className="relative overflow-hidden border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl transition-all hover:scale-[1.02]">
                <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Clock className="h-4 w-4 text-blue-500" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Hours</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <div className="text-4xl font-black">{learningHours}</div>
                        <span className="text-lg font-bold text-zinc-400">hrs</span>
                    </div>
                    <p className="text-sm font-bold text-zinc-500">Time invested</p>
                </CardContent>
            </Card>

            {/* Day Streak */}
            <Card className="relative overflow-hidden border-none bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-2xl shadow-orange-500/20 transition-all hover:scale-[1.02]">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Zap className="h-24 w-24 text-white fill-current" />
                </div>
                <CardContent className="p-6 relative z-10 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                            <Zap className="h-4 w-4 text-white fill-current" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-orange-200">Daily Streak</span>
                    </div>
                    
                    <div className="flex items-baseline gap-1 mb-4">
                        <div className="text-4xl font-black">{streak}</div>
                        <span className="text-lg font-bold text-orange-200">days</span>
                    </div>

                    <div className="mt-auto pt-2">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider mb-2 text-orange-100">
                            <span>Next: {nextMilestone} Days</span>
                            <span>{Math.round(streakProgress)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-white transition-all duration-1000 ease-out"
                                style={{ width: `${streakProgress}%` }}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
