import type { Metadata } from 'next'
import { SITE, FAQS } from '@/lib/seo-data'

export const metadata: Metadata = {
  title: 'FAQ — Frequently Asked Questions | A-Star Infotech',
  description: 'Get answers to common questions about web development, pricing, timelines, SEO, e-commerce, and more. A-Star Infotech serves Jaipur, Rajasthan, and all of India.',
  keywords: [
    'web development FAQ',
    'website design questions',
    'web development pricing India',
    'how much does a website cost',
    'website timeline',
    'A-Star Infotech FAQ',
  ],
  alternates: { canonical: `${SITE.url}/faq` },
  openGraph: {
    title: 'FAQ — Frequently Asked Questions | A-Star Infotech',
    description: 'Get answers to common questions about web development, pricing, timelines, SEO, and more.',
    url: `${SITE.url}/faq`,
    type: 'article',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'A-Star Infotech FAQ' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ | A-Star Infotech',
    description: 'Answers to common questions about our web development services in Jaipur, India.',
    images: ['/og-image.png'],
  },
}

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children
}
