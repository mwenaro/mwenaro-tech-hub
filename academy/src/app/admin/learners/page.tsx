import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getInstructorStudents, getCohortAnalytics } from '@/lib/instructor'
import { LearnerTable } from '@/components/dashboard/learner-table'
import { Card } from '@/components/ui/card'
import { Users, TrendingUp, AlertCircle, GraduationCap } from 'lucide-react'

export default async function AdminLearnersPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.user_metadata?.role !== 'admin') {
        redirect('/dashboard')
    }

    // Since we're in admin context, getInstructorStudents(user.id) will fetch across all cohorts
    // because internal logic in getInstructorStudents handles the 'admin' role.
    const [students, analytics] = await Promise.all([
        getInstructorStudents(user.id),
        getCohortAnalytics()
    ])

    // Calculate aggregate stats
    const totalStudents = students.length
    const avgProgress = totalStudents > 0 
        ? Math.round(students.reduce((acc, s) => acc + s.progress, 0) / totalStudents)
        : 0
    const avgGrade = totalStudents > 0 
        ? Math.round(students.reduce((acc, s) => acc + s.average_grade, 0) / totalStudents)
        : 0
    const atRiskCount = students.filter(s => s.progress < 10 || s.average_grade < 40).length

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pb-20">
            <div className="max-w-7xl mx-auto p-8">
                {/* Header */}
                <div className="mb-12 p-10 rounded-[2.5rem] bg-white/50 dark:bg-card/50 backdrop-blur-xl border border-white/20 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -mr-32 -mt-32 rounded-full group-hover:bg-primary/20 transition-all duration-700" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                                <Users className="w-6 h-6 text-primary" />
                            </div>
                            <span className="text-sm font-black uppercase tracking-[0.3em] text-primary/70">Intelligence Module</span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                            Learner Success <span className="text-primary italic">Ecosystem</span>
                        </h1>
                        <p className="text-muted-foreground text-xl max-w-2xl font-medium leading-relaxed">
                            Monitor cognitive growth, tracking individual mastery trajectories and cohort-wide performance health.
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <Card className="p-8 bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/10 backdrop-blur-sm group hover:scale-[1.02] transition-all duration-500">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-2xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                                <Users className="w-6 h-6 text-blue-500" />
                            </div>
                            <span className="text-blue-500/50 text-xs font-bold uppercase tracking-widest">Active</span>
                        </div>
                        <p className="text-sm font-bold text-muted-foreground mb-1">Total Learners</p>
                        <p className="text-5xl font-black tracking-tighter">{totalStudents}</p>
                    </Card>

                    <Card className="p-8 bg-gradient-to-br from-primary/10 to-transparent border-primary/10 backdrop-blur-sm group hover:scale-[1.02] transition-all duration-500">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                <TrendingUp className="w-6 h-6 text-primary" />
                            </div>
                            <span className="text-primary/50 text-xs font-bold uppercase tracking-widest">+4.2%</span>
                        </div>
                        <p className="text-sm font-bold text-muted-foreground mb-1">Avg. Progress</p>
                        <p className="text-5xl font-black tracking-tighter">{avgProgress}%</p>
                    </Card>

                    <Card className="p-8 bg-gradient-to-br from-green-500/10 to-transparent border-green-500/10 backdrop-blur-sm group hover:scale-[1.02] transition-all duration-500">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-2xl bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                                <GraduationCap className="w-6 h-6 text-green-500" />
                            </div>
                            <span className="text-green-500/50 text-xs font-bold uppercase tracking-widest">Excellent</span>
                        </div>
                        <p className="text-sm font-bold text-muted-foreground mb-1">Avg. Grade</p>
                        <p className="text-5xl font-black tracking-tighter">{avgGrade}%</p>
                    </Card>

                    <Card className="p-8 bg-gradient-to-br from-red-500/10 to-transparent border-red-500/10 backdrop-blur-sm group hover:scale-[1.02] transition-all duration-500">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-2xl bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                                <AlertCircle className="w-6 h-6 text-red-500" />
                            </div>
                            {atRiskCount > 0 && <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />}
                        </div>
                        <p className="text-sm font-bold text-muted-foreground mb-1">At-Risk Learners</p>
                        <p className="text-5xl font-black tracking-tighter text-red-500">{atRiskCount}</p>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-2">
                        <div className="h-6 w-1 bg-primary rounded-full" />
                        <h2 className="text-2xl font-black tracking-tight">Active Mastery Tracking</h2>
                    </div>
                    <LearnerTable students={students} />
                </div>
            </div>
        </div>
    )
}
