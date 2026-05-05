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
      url: `${DOMAIN}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${DOMAIN}/blog/hooks`,
      lastModified: new Date('2024-01-22'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${DOMAIN}/blog/principles`,
      lastModified: new Date('2026-05-05'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${DOMAIN}/blog/principles/ccp`,
      lastModified: new Date('2026-05-05'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]
}
