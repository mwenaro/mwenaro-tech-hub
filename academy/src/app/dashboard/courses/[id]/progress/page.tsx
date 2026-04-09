import { createClient } from "@/lib/supabase/server"
import { getCourse } from "@/lib/courses"
import { getStudentDetailedMastery } from "@/lib/instructor"
import { notFound, redirect } from "next/navigation"
import { LearnerProfileHeader } from "@/components/dashboard/learner-profile-header"
import { MasteryRoadmap } from "@/components/dashboard/mastery-roadmap"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

interface ProgressPageProps {
    params: Promise<{ id: string }>
}

export default async function StudentProgressPage({ params }: ProgressPageProps) {
    const { id: courseIdOrSlug } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const course = await getCourse(courseIdOrSlug)
    if (!course) notFound()

    const mastery = await getStudentDetailedMastery(user.id, course.id)

    // Calculate stats
    const totalLessons = mastery.length
    const completedLessons = mastery.filter(m => m.is_completed).length
    const avgScore = completedLessons > 0 
        ? Math.round(mastery.reduce((acc, m) => acc + (m.score || 0), 0) / completedLessons)
        : 0
    const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

    return (
        <div className="min-h-screen pb-20">
            <div className="max-w-6xl mx-auto p-4 md:p-8">
                <Link 
                    href="/dashboard/courses" 
                    className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors w-fit mb-8"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold uppercase tracking-widest">Back to My Courses</span>
                </Link>

                <div className="mb-12">
                    <h2 className="text-xl font-black text-primary/60 uppercase tracking-widest mb-2 italic">
                        Course Growth Tracker
                    </h2>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
                        {course.title}
                    </h1>
                </div>

                <LearnerProfileHeader
                    name={user.user_metadata?.full_name || "You"}
                    email={user.email!}
                    progressPercent={progressPercent}
                    avgScore={avgScore}
                    completedLessons={completedLessons}
                    totalLessons={totalLessons}
                    badgeText="Learner Roadmap"
                />

                <MasteryRoadmap mastery={mastery} />
            </div>
        </div>
    )
}
