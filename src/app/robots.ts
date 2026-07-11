import type { MetadataRoute } from "next"
import { SITE } from "@/lib/seo-data"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin"],
      },
      // Allow social media crawlers full access for better sharing
      {
        userAgent: ["Googlebot", "Bingbot", "Slurp", "DuckDuckBot", "Baiduspider", "YandexBot"],
        allow: "/",
      },
      {
        userAgent: ["facebookexternalhit", "Twitterbot", "LinkedInBot", "WhatsApp", "TelegramBot"],
        allow: "/",
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  }
}
