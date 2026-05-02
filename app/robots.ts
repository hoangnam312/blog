import { DOMAIN } from '@/utils/constant'
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${DOMAIN}/sitemap.xml`,
  }
}
