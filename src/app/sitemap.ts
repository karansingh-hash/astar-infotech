import type { MetadataRoute } from "next"
import { SITE, SERVICES } from "@/lib/seo-data"

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
      videos: [
        {
          title: "A-Star Infotech — Web Development Services",
          thumbnail_loc: "https://www.astarinfotech.in/og-image.png",
          description: "Background video showcasing A-Star Infotech web development services in Jaipur, India. Features modern web design, e-commerce, SEO, and responsive website development.",
          content_loc: "https://www.astarinfotech.in/services-bg.mp4",
          player_loc: "https://www.astarinfotech.in/#services",
          duration: 30,
          rating: 5.0,
          view_count: 1200,
          publication_date: "2026-07-11",
          family_friendly: "yes",
          requires_subscription: "no",
          live: "no",
        },
      ],
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
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }))

  return [...homeUrls, ...servicesIndex, ...faqUrl, ...serviceUrls]
}
