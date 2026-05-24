import { MetadataRoute } from 'next'
import { listIssues } from '@/lib/newsletter-issues-db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://stackconsultingai.com'

  const staticEntries: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date('2026-03-18'), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/tools`, lastModified: new Date('2026-03-16'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/tools/speed-checker`, lastModified: new Date('2026-03-16'), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/tools/seo-audit`, lastModified: new Date('2026-03-16'), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/tools/roi-calculator`, lastModified: new Date('2026-03-16'), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/tools/timeline-estimator`, lastModified: new Date('2026-03-16'), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/tools/tech-stack`, lastModified: new Date('2026-03-16'), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/tools/cost-calculator`, lastModified: new Date('2026-03-16'), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/services`, lastModified: new Date('2026-03-18'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services/web-development`, lastModified: new Date('2026-03-18'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services/business-automation`, lastModified: new Date('2026-03-18'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services/ecommerce`, lastModified: new Date('2026-03-18'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services/maintenance`, lastModified: new Date('2026-03-18'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services/guest-wifi`, lastModified: new Date('2026-05-13'), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/ai-readiness-audit`, lastModified: new Date('2026-04-27'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/ai-receptionist`, lastModified: new Date('2026-04-27'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/free-ai-site-audit`, lastModified: new Date('2026-05-22'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/ai-automation-small-business-guide`, lastModified: new Date('2026-05-22'), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/demos`, lastModified: new Date('2026-04-28'), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/portfolio`, lastModified: new Date('2026-04-28'), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/services/ai-consulting-orange-county`, lastModified: new Date('2026-04-25'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/services/ai-consulting-irvine`, lastModified: new Date('2026-04-25'), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/services/ai-consulting-newport-beach`, lastModified: new Date('2026-04-25'), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/services/ai-consulting-san-clemente`, lastModified: new Date('2026-04-25'), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/services/ai-consulting-mission-viejo`, lastModified: new Date('2026-04-25'), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/services/ai-consulting-costa-mesa`, lastModified: new Date('2026-04-25'), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/stack-report`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
  ]

  let issueEntries: MetadataRoute.Sitemap = []
  try {
    const issues = await listIssues()
    issueEntries = issues.map((i) => ({
      url: `${baseUrl}/stack-report/${i.slug}`,
      lastModified: new Date(i.published_at),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch {
    // Supabase unreachable during build — skip dynamic entries rather than failing
  }

  return [...staticEntries, ...issueEntries]
}
