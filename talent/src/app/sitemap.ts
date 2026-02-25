import { MetadataRoute } from 'next'
import { ecosystem } from '@mwenaro/config/ecosystem'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: ecosystem.talent,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        }
    ]
}
