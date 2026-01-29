import { getCourseLessons } from '@/lib/lessons'
import { getCourse } from '@/lib/courses'
import { hasEnrolled, enrollUser } from '@/lib/enrollment'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface CoursePageProps {
    params: Promise<{
        id: string
    }>
}

export default async function CoursePage({ params }: CoursePageProps) {
    const { id } = await params
    const course = await getCourse(id)
    const lessons = await getCourseLessons(id)
    const isEnrolled = await hasEnrolled(id)

    if (!course) {
        notFound()
    }

    return (
        <div className="container py-12 px-4">
            <Link href="/courses" className="text-muted-foreground hover:text-primary mb-6 inline-block">
                &larr; Back to Courses
            </Link>
            <div className="grid gap-8 lg:grid-cols-2">
                <div>
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                        <Image
                            src={course.image_url || 'https://placehold.co/600x400/png'}
                            alt={course.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <h1 className="text-4xl font-bold">{course.title}</h1>
                        <p className="mt-4 text-2xl font-bold text-primary">
                            ${course.price.toFixed(2)}
                        </p>
                    </div>

                    <div className="prose max-w-none text-muted-foreground">
                        <p>{course.description}</p>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row">
                        {isEnrolled ? (
                            <Link href="/dashboard">
                                <Button size="lg" className="w-full sm:w-auto">
                                    Go to Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <form action={enrollUser.bind(null, course.id)}>
                                <Button size="lg" className="w-full sm:w-auto" type="submit">
                                    Enroll Now
                                </Button>
                            </form>
                        )}
                    </div>

                    <div className="mt-8 border-t pt-8">
                        <h2 className="text-2xl font-bold mb-4">Course Syllabus</h2>
                        {lessons.length === 0 ? (
                            <p className="text-muted-foreground">No lessons available yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {lessons.map((lesson, index) => (
                                    <div key={lesson.id} className="flex items-center justify-between p-4 border rounded-lg bg-card text-card-foreground">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                                                {index + 1}
                                            </div>
                                            <span className="font-medium">{lesson.title}</span>
                                        </div>
                                        {isEnrolled ? (
                                            <Link href={`/courses/${course.id}/lessons/${lesson.id}`}>
                                                <Button size="sm" variant="secondary">Start</Button>
                                            </Link>
                                        ) : (
                                            <Button size="sm" variant="ghost" disabled>
                                                <span className="mr-2">🔒</span> Locked
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
