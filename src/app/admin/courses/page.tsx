import { getCourses } from '@/lib/courses'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { deleteCourse } from '@/lib/admin'
import { CreateCourseForm } from '@/components/create-course-form'

export default async function CoursesPage() {
    const courses = await getCourses()

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-black text-purple-600 dark:text-purple-400">Course Management</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* List */}
                    <div className="lg:col-span-2 space-y-4">
                        {courses.length === 0 ? (
                            <Card className="p-12 text-center text-muted-foreground italic">
                                No courses found.
                            </Card>
                        ) : (
                            courses.map(course => (
                                <Card key={course.id} className="p-6 flex justify-between items-center group hover:border-purple-300 transition-all">
                                    <div>
                                        <h3 className="text-xl font-bold">{course.title}</h3>
                                        <p className="text-muted-foreground text-sm line-clamp-1">{course.description}</p>
                                        <p className="text-sm font-bold mt-2 text-purple-600">${course.price}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href={`/admin/courses/${course.id}/lessons`}>
                                            <Button variant="outline" size="sm">Manage Lessons</Button>
                                        </Link>
                                        <form action={async () => {
                                            'use server'
                                            await deleteCourse(course.id)
                                        }}>
                                            <Button variant="destructive" size="sm">Delete</Button>
                                        </form>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>

                    {/* Create Form */}
                    <div className="lg:col-span-1">
                        <Card className="p-6 sticky top-8">
                            <h2 className="text-xl font-bold mb-4">Add New Course</h2>
                            <CreateCourseForm />
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
