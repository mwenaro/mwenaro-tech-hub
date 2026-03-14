import { MetadataRoute } from 'next'
import { ecosystem } from '@mwenaro/config/ecosystem'

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = [
        '',
        '/about',
        '/contact',
        '/courses',
        '/new-courses',
        '/login',
        '/signup',
        '/forgot-password'
    ]

    return routes.map((route) => ({
        url: `${ecosystem.academy}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
    }))
}
