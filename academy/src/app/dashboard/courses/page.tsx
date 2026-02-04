import { getEnrolledCourses } from '@/lib/enrollment'
import { EnrolledCourseCard } from '@/components/dashboard/enrolled-course-card'
import { createClient } from '@/lib/supabase/server'
import { getUserProgress } from '@/lib/progress'
import { redirect } from 'next/navigation'

export default async function DashboardCoursesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const enrolledCourses = await getEnrolledCourses()
    const allProgress = await getUserProgress()
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
            return { ...course, progress: progressPercentage }
        })
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coursesWithProgress.map((course) => (
                    <EnrolledCourseCard
                        key={course.id}
                        course={course}
                        progress={course.progress}
                    />
                ))}
                {coursesWithProgress.length === 0 && (
                    <p className="text-muted-foreground">You are not enrolled in any courses yet.</p>
                )}
            </div>
        </div>
    )
}
