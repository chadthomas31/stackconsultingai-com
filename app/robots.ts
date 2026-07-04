import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard',
          '/invoices',
          '/messages',
          '/projects',
          '/login',
          '/register',
          '/wifi',
          '/assessment',
        ],
      },
    ],
    sitemap: 'https://stackconsultingai.com/sitemap.xml',
  }
}
