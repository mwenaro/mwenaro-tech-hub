import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getStudentDetailedMastery } from "@/lib/instructor"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
    CheckCircle2, 
    Circle, 
    Lock, 
    Clock, 
    Link as LinkIcon, 
    ChevronLeft,
    Trophy,
    Target,
    Activity
} from "lucide-react"
import Link from "next/link"
import { NudgeButton } from "@/components/dashboard/nudge-button"

interface LearnerDetailPageProps {
    params: { id: string }
    searchParams: { courseId?: string }
}

export default async function LearnerDetailPage({ params, searchParams }: LearnerDetailPageProps) {
    const studentId = params.id
    const courseId = searchParams.courseId

    if (!courseId) {
        return (
            <div className="p-8 text-center bg-red-500/10 border border-red-500/20 rounded-2xl m-8">
                <p className="font-bold text-red-500">Error: Course ID is required to view mastery details.</p>
                <Link href="/admin/learners" className="text-sm underline mt-2 inline-block">Back to Learners</Link>
            </div>
        )
    }

    const supabase = await createClient()
    const adminSupabase = createAdminClient()

    // 1. Fetch Student Profile
    const { data: profile, error: profileError } = await adminSupabase
        .from('profiles')
        .select('*')
        .eq('id', studentId)
        .single()

    if (profileError || !profile) {
        notFound()
    }

    // 2. Fetch Detailed Mastery
    const mastery = await getStudentDetailedMastery(studentId, courseId)

    // Calculate aggregate stats
    const totalLessons = mastery.length
    const completedLessons = mastery.filter(m => m.is_completed).length
    const avgScore = completedLessons > 0 
        ? Math.round(mastery.reduce((acc, m) => acc + (m.score || 0), 0) / completedLessons)
        : 0
    const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

    // 3. Fetch Enrollment to get Cohort Name
    const { data: enrollment } = await adminSupabase
        .from('enrollments')
        .select(`
            cohort_id,
            cohorts (name)
        `)
        .eq('user_id', studentId)
        .eq('course_id', courseId)
        .single()

    const cohortName = (enrollment?.cohorts as any)?.name || "Unknown Cohort"

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pb-20">
            <div className="max-w-6xl mx-auto p-8">
                {/* Back Link and Actions */}
                <div className="flex justify-between items-center mb-8">
                    <Link 
                        href="/admin/learners" 
                        className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors w-fit"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-bold uppercase tracking-widest">Back to Intelligence Center</span>
                    </Link>
                    
                    <NudgeButton 
                        userId={studentId} 
                        cohortName={cohortName} 
                        studentName={profile.full_name || "Student"} 
                    />
                </div>

                {/* Profile Banner */}
                <div className="mb-12 p-8 rounded-[2rem] bg-white/50 dark:bg-card/50 backdrop-blur-xl border border-white/20 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -mr-32 -mt-32 rounded-full" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <Avatar className="h-32 w-32 border-4 border-primary/20 shadow-2xl">
                            <AvatarFallback className="text-4xl font-black">
                                {profile.full_name?.charAt(0).toUpperCase() || profile.email.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                                <h1 className="text-4xl font-black tracking-tight">{profile.full_name || "Anonymous Learner"}</h1>
                                <Badge className="w-fit mx-auto md:mx-0 bg-primary/20 text-primary border-primary/10 px-3 py-1">
                                    Student Profile
                                </Badge>
                            </div>
                            <p className="text-muted-foreground text-lg mb-6">{profile.email}</p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                                    <p className="text-[10px] uppercase tracking-widest font-black text-primary/70 mb-1">Course Mastery</p>
                                    <p className="text-2xl font-black">{progressPercent}%</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/10">
                                    <p className="text-[10px] uppercase tracking-widest font-black text-green-500/70 mb-1">Avg Score</p>
                                    <p className="text-2xl font-black">{avgScore}%</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                                    <p className="text-[10px] uppercase tracking-widest font-black text-blue-500/70 mb-1">Lessons</p>
                                    <p className="text-2xl font-black">{completedLessons}/{totalLessons}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                                    <p className="text-[10px] uppercase tracking-widest font-black text-amber-500/70 mb-1">Activity</p>
                                    <p className="text-2xl font-black">Active</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mastery Roadmap */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 px-2 mb-8">
                        <div className="p-2 rounded-xl bg-primary/10">
                            <Target className="w-6 h-6 text-primary" />
                        </div>
                        <h2 className="text-3xl font-black tracking-tight">Mastery <span className="text-primary italic">Roadmap</span></h2>
                    </div>

                    <div className="grid gap-4">
                        {mastery.map((item, index) => (
                            <Card key={item.lesson_id} className={`p-6 bg-card/40 backdrop-blur-sm border-white/10 hover:border-primary/30 transition-all duration-300 relative overflow-hidden group ${!item.is_completed && 'opacity-70'}`}>
                                {item.is_completed && (
                                    <div className="absolute top-0 left-0 w-1 h-full bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                                )}
                                <div className="flex flex-col md:flex-row md:items-center gap-6">
                                    <div className={`flex items-center justify-center w-12 h-12 rounded-2xl border-2 transition-all duration-500 ${item.is_completed ? 'bg-primary/10 border-primary/20 text-primary scale-110' : 'bg-muted/10 border-white/5 text-muted-foreground'}`}>
                                        {item.is_completed ? (
                                            <CheckCircle2 className="w-6 h-6" />
                                        ) : (
                                            <Circle className="w-6 h-6" />
                                        )}
                                    </div>
                                    
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-3 mb-1 font-bold">
                                            <span className="text-xs text-primary/70 uppercase tracking-widest">Lesson {index + 1}</span>
                                            {item.is_completed ? (
                                                <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-[10px]">Mastered</Badge>
                                            ) : (
                                                <Badge className="bg-muted text-muted-foreground border-white/5 text-[10px]">Pending</Badge>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-black group-hover:text-primary transition-colors italic">{item.title}</h3>
                                    </div>

                                    <div className="flex items-center gap-8 pr-4">
                                        <div className="text-center">
                                            <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground mb-1">Quiz Score</p>
                                            <p className={`text-xl font-black ${item.score && item.score >= 80 ? 'text-green-500' : item.score && item.score >= 50 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                                                {item.score !== null ? `${item.score}%` : '—'}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground mb-1">Attempts</p>
                                            <p className="text-xl font-black">{item.attempts || 0}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground mb-1">Project</p>
                                            {item.project_submitted ? (
                                                <div className="flex items-center gap-1 text-primary">
                                                    <Trophy className="w-5 h-5" />
                                                    <span className="text-xl font-black">{item.project_rating || '—'}</span>
                                                </div>
                                            ) : (
                                                <CheckCircle2 className="w-5 h-5 text-muted/30" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
