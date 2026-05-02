import { DOMAIN } from '@/utils/constant'
import type { MetadataRoute } from 'next'

  export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: DOMAIN,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${DOMAIN}/hooks`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${DOMAIN}/patterns`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${DOMAIN}/hooks/use-state`,
      lastModified: new Date('2024-01-15'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${DOMAIN}/hooks/use-effect`,
      lastModified: new Date('2024-01-22'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${DOMAIN}/patterns/compound-component`,
      lastModified: new Date('2024-02-05'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${DOMAIN}/patterns/render-props`,
      lastModified: new Date('2024-02-12'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]
}
