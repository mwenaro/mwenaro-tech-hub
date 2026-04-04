import { MetadataRoute } from 'next'
import { ecosystem } from '@mwenaro/config/ecosystem'
import { getCourses } from '@/lib/courses'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const courses = await getCourses()
    
    // Static Routes
    const staticRoutes = [
        '',
        '/about',
        '/contact',
        '/courses',
        '/new-courses',
    ].map((route) => ({
        url: `${ecosystem.academy}${route}`,
        lastModified: new Date(),
        changeFrequency: (route === '' ? 'daily' : 'weekly') as any,
        priority: route === '' ? 1 : 0.8,
    }))

    // Dynamic Course Routes
    const courseRoutes = courses.map((course) => ({
        url: `${ecosystem.academy}/courses/${course.slug || course.id}`,
        lastModified: new Date(course.created_at),
        changeFrequency: 'weekly' as any,
        priority: 0.7,
    }))

    return [...staticRoutes, ...courseRoutes]
}
