import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://stackconsultingai.com'

  return [
    {
      url: baseUrl,
      lastModified: new Date('2026-03-18'),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date('2026-03-16'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/speed-checker`,
      lastModified: new Date('2026-03-16'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/tools/seo-audit`,
      lastModified: new Date('2026-03-16'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/tools/roi-calculator`,
      lastModified: new Date('2026-03-16'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/tools/timeline-estimator`,
      lastModified: new Date('2026-03-16'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/tools/tech-stack`,
      lastModified: new Date('2026-03-16'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/tools/cost-calculator`,
      lastModified: new Date('2026-03-16'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]
}
