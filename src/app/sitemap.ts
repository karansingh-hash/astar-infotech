import type { MetadataRoute } from "next"
import { SERVICES, SITE } from "@/lib/seo-data"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE.url
  const now = new Date()

  // Homepage + section anchors (high priority, weekly updates)
  const homeUrls: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ]

  // Services index page (high priority for keyword targeting)
  const servicesIndex: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/services`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ]

  // FAQ page (high priority for long-tail keyword traffic)
  const faqUrl: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/faq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ]

  // Individual service pages (high priority — each targets specific keywords)
  const serviceUrls: MetadataRoute.Sitemap = SERVICES.map(service => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.9,
  }))

  return [...homeUrls, ...servicesIndex, ...faqUrl, ...serviceUrls]
}
