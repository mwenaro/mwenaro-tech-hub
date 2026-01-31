import { getEnrolledCourses } from '@/lib/enrollment'
import { getStudentSessions } from '@/lib/sessions'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserProgress } from '@/lib/progress'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatsCards } from '@/components/dashboard/stats-cards'
import { EnrolledCourseCard } from '@/components/dashboard/enrolled-course-card'
import { UpcomingSessionCard } from '@/components/dashboard/upcoming-session-card'
import { ArrowRight, BookOpen, Calendar, Award } from "lucide-react"

export const revalidate = 0 // Ensure dynamic data

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Role-based redirection
    const role = user.user_metadata?.role
    if (role === 'admin') {
        redirect('/admin/dashboard')
    } else if (role === 'instructor') {
        redirect('/instructor/dashboard')
    }

    // Proceed as Learner
    const [enrolledCourses, upcomingSessions, allProgress] = await Promise.all([
        getEnrolledCourses(),
        getStudentSessions(),
        getUserProgress()
    ])

    // Fetch lesson counts for ONLY the enrolled courses to avoid any leakage
    const courseIds = enrolledCourses.map(c => c.id)

    let coursesWithProgress: any[] = []

    if (courseIds.length > 0) {
        const { data: lessonsData } = await supabase
            .from('lessons')
            .select('id, course_id')
            .in('course_id', courseIds)

        coursesWithProgress = enrolledCourses.map(course => {
            const courseLessons = lessonsData?.filter(l => l.course_id === course.id) || []
            const lessonCount = courseLessons.length

            const completedLessons = allProgress.filter(p =>
                p.is_completed && courseLessons.some(cl => cl.id === p.lesson_id)
            ).length

            const progressPercentage = lessonCount > 0 ? Math.round((completedLessons / lessonCount) * 100) : 0

            return {
                ...course,
                progress: progressPercentage
            }
        })
    }

    const firstName = user.user_metadata?.full_name?.split(' ')[0] || 'Learner'

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Welcome back, {firstName}!</h1>
                <p className="text-muted-foreground">
                    Track your progress and continue learning.
                </p>
            </div>

            <StatsCards courses={coursesWithProgress} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content: Enrolled Courses */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-foreground">
                            Continue Learning
                        </h2>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/courses">
                                View all <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {coursesWithProgress.length === 0 ? (
                            <Card className="border-dashed">
                                <CardContent className="py-12 text-center">
                                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="font-semibold text-foreground mb-2">No courses yet</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Start your learning journey by enrolling in a course
                                    </p>
                                    <Button asChild>
                                        <Link href="/courses">Browse Courses</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            coursesWithProgress.slice(0, 3).map((course) => (
                                <EnrolledCourseCard
                                    key={course.id}
                                    course={course}
                                    progress={course.progress}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Sidebar Content: Sessions & Actions */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-foreground">
                            Upcoming Sessions
                        </h2>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/dashboard/sessions">
                                <Calendar className="mr-1 h-4 w-4" />
                                All
                            </Link>
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {upcomingSessions.length === 0 ? (
                            <Card className="border-dashed">
                                <CardContent className="py-8 text-center">
                                    <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                                    <p className="text-sm text-muted-foreground">
                                        No upcoming sessions
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            upcomingSessions.slice(0, 3).map((session) => (
                                <UpcomingSessionCard
                                    key={session.id}
                                    id={session.id}
                                    title={session.title}
                                    courseName={session.cohort?.name}
                                    scheduledAt={session.start_time}
                                    durationMinutes={session.duration_minutes}
                                    meetingUrl={session.meeting_link}
                                />
                            ))
                        )}
                    </div>

                    {/* Quick Links */}
                    <Card className="mt-6">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <Link href="/courses">
                                    <BookOpen className="mr-2 h-4 w-4" />
                                    Browse Courses
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <Link href="/dashboard/certificates">
                                    <Award className="mr-2 h-4 w-4" />
                                    View Certificates
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
