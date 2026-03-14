import { getCourses } from '@/lib/courses'
import { CoursesClient } from '@/components/courses-client'

export const metadata = {
    title: "Courses",
    description: "Browse our comprehensive software engineering and data science bootcamps. Start learning and accelerate your tech career today.",
};

export const revalidate = 60

export default async function CoursesPage() {
    const courses = await getCourses()

    return <CoursesClient courses={courses} />
}
