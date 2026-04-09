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
    ChevronLeft
} from "lucide-react"
import Link from "next/link"
import { NudgeButton } from "@/components/dashboard/nudge-button"
import { LearnerProfileHeader } from "@/components/dashboard/learner-profile-header"
import { MasteryRoadmap } from "@/components/dashboard/mastery-roadmap"

interface LearnerDetailPageProps {
    params: { id: string }
    searchParams: { courseId?: string }
}

export default async function LearnerDetailPage({ params, searchParams }: LearnerDetailPageProps) {
    const { id: studentId } = await params
    const { courseId } = await searchParams

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
                <LearnerProfileHeader
                    name={profile.full_name}
                    email={profile.email}
                    progressPercent={progressPercent}
                    avgScore={avgScore}
                    completedLessons={completedLessons}
                    totalLessons={totalLessons}
                />

                {/* Mastery Roadmap */}
                <MasteryRoadmap 
                    mastery={mastery} 
                    userId={studentId} 
                    showReset={true} 
                />
            </div>
        </div>
    )
}
