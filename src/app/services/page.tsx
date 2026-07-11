import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { SERVICES, SITE } from '@/lib/seo-data'
import { StructuredData } from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'Our Web Development Services in Jaipur | A-Star Infotech',
  description: 'Explore our full range of web development services: website design, development, e-commerce, responsive websites, maintenance, and SEO. Serving Jaipur, Rajasthan, and all of India.',
  alternates: { canonical: `${SITE.url}/services` },
  openGraph: {
    title: 'Our Web Development Services | A-Star Infotech',
    description: 'Website design, development, e-commerce, responsive websites, maintenance, and SEO services in Jaipur, India.',
    url: `${SITE.url}/services`,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'A-Star Infotech Services' }],
  },
}

export default function ServicesIndexPage() {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Web Development Services',
    itemListElement: SERVICES.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: s.title,
      url: `${SITE.url}/services/${s.slug}`,
    })),
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StructuredData />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      {/* Header */}
      <header className="border-b border-border bg-dark-surface/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="A-Star Infotech logo" className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-contain" />
            <div className="flex flex-col">
              <span className="font-bold text-base sm:text-lg text-foreground">A-Star</span>
              <span className="text-[10px] sm:text-xs font-medium tracking-wider uppercase text-neon">Infotech</span>
            </div>
          </Link>
          <Link href="/#contact">
            <Button size="sm" className="bg-neon/20 hover:bg-neon/30 text-neon border border-neon/30 rounded-xl">
              Get a Quote
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-24 bg-dark-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-neon/10 text-neon border-neon/20">Our Services</Badge>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Web Development <span className="text-neon">Services</span> in Jaipur, India
          </h1>
          <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From concept to launch and beyond, we provide comprehensive web solutions tailored to your business goals.
            Serving businesses across Jaipur, Rajasthan, and all of India.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, i) => (
              <Link key={service.slug} href={`/services/${service.slug}`}>
                <Card className="bg-dark-surface border-neon/20 hover:border-neon/40 transition-colors h-full">
                  <CardContent className="p-6 md:p-8">
                    <span className="text-xs font-mono text-neon/70">{String(i + 1).padStart(2, '0')}</span>
                    <h2 className="text-xl font-bold text-foreground mt-2 mb-3">{service.title}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{service.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {service.tech.slice(0, 3).map(tech => (
                        <span key={tech} className="text-xs px-2 py-1 rounded-md bg-neon/5 border border-neon/10 text-neon/80">{tech}</span>
                      ))}
                      {service.tech.length > 3 && (
                        <span className="text-xs px-2 py-1 rounded-md bg-neon/5 border border-neon/10 text-neon/80">+{service.tech.length - 3} more</span>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm text-neon font-medium">
                      Learn More <ArrowRight className="w-4 h-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-neon via-brand-600 to-neon">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
            Not Sure Which Service You Need?
          </h2>
          <p className="text-white/80 text-sm md:text-lg mb-8 max-w-2xl mx-auto">
            Get in touch today for a free consultation. We&apos;ll help you choose the right service for your business goals.
          </p>
          <Link href="/#contact">
            <Button size="lg" className="bg-white hover:bg-white/90 text-neon font-semibold px-6 h-12 sm:h-14 rounded-xl min-h-[44px]">
              Get Free Consultation <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-surface border-t border-border py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/logo.png" alt="A-Star Infotech logo" className="w-9 h-9 rounded-lg object-contain" />
            <div className="font-bold text-foreground">A-Star Infotech</div>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} A-Star Infotech. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
