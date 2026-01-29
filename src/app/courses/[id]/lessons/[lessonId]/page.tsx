import { getLesson, getCourseLessons } from '@/lib/lessons'
import { getCourse } from '@/lib/courses'
import { hasEnrolled } from '@/lib/enrollment'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface LessonPageProps {
    params: Promise<{
        id: string
        lessonId: string
    }>
}

export default async function LessonPage({ params }: LessonPageProps) {
    const { id: courseId, lessonId } = await params

    // Check enrollment first
    const isEnrolled = await hasEnrolled(courseId)
    if (!isEnrolled) {
        redirect(`/courses/${courseId}`)
    }

    const lesson = await getLesson(lessonId)
    if (!lesson) {
        notFound()
    }

    const course = await getCourse(courseId)

    // Navigation logic could go here (next/prev lesson)

    return (
        <div className="container py-8 px-4 max-w-4xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <Link href={`/courses/${courseId}`} className="text-sm font-medium text-muted-foreground hover:text-primary">
                    &larr; Back to Course
                </Link>
                <div className="text-sm text-muted-foreground">
                    {course?.title}
                </div>
            </div>

            <article className="prose prose-slate dark:prose-invert max-w-none">
                <h1 className="text-3xl font-bold mb-6">{lesson.title}</h1>
                <div className="p-6 border rounded-lg bg-card">
                    <p className="whitespace-pre-wrap">{lesson.content}</p>
                </div>
            </article>

            <div className="mt-12 flex justify-between">
                <Button variant="outline" disabled>Previous Lesson</Button>
                <Button>Next Lesson</Button>
            </div>
        </div>
    )
}
