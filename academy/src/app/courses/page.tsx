import { getCourses } from '@/lib/courses'
import { CoursesClient } from '@/components/courses-client'
import { CourseListSchema } from '@/components/structured-data'

export const metadata = {
    title: "All Courses | Mwenaro Academy - Software Engineering & Data Science",
    description: "Browse our comprehensive software engineering and data science bootcamps. Start learning with industry experts and accelerate your tech career in Africa.",
    alternates: {
        canonical: "/courses",
    },
};

export const revalidate = 60

export default async function CoursesPage() {
    const courses = await getCourses()

    return (
        <>
            <CourseListSchema courses={courses} />
            <CoursesClient courses={courses} />
        </>
    )
}
