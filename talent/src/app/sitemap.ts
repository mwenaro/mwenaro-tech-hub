import { MetadataRoute } from 'next'
import { ecosystem } from '@mwenaro/config/ecosystem'

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = [
        '',
        '/about',
        '/contact',
    ]

    return routes.map((route) => ({
        url: `${ecosystem.talent}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
    }))
}
