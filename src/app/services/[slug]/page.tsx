import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Check, Phone, Mail, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { SERVICES, SITE, TESTIMONIALS, STATS } from '@/lib/seo-data'
import { StructuredData } from '@/components/StructuredData'

type Params = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return SERVICES.map(s => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const service = SERVICES.find(s => s.slug === slug)
  if (!service) return { title: 'Service Not Found' }

  const title = `${service.title} in Jaipur, India | A-Star Infotech`
  const description = service.fullDescription
  const url = `${SITE.url}/services/${service.slug}`

  return {
    title,
    description,
    keywords: [...service.keywords, 'A-Star Infotech', 'Jaipur', 'Rajasthan', 'India'],
    alternates: { canonical: url },
    openGraph: {
      title: `${service.title} | A-Star Infotech`,
      description: service.description,
      url,
      type: 'article',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `${service.title} - A-Star Infotech` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${service.title} | A-Star Infotech`,
      description: service.description,
      images: ['/og-image.png'],
    },
  }
}

export default async function ServicePage({ params }: Params) {
  const { slug } = await params
  const serviceIndex = SERVICES.findIndex(s => s.slug === slug)
  if (serviceIndex === -1) notFound()

  const service = SERVICES[serviceIndex]
  const relatedServices = SERVICES.filter(s => s.slug !== slug).slice(0, 3)

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.fullDescription,
    url: `${SITE.url}/services/${service.slug}`,
    provider: {
      '@type': 'LocalBusiness',
      name: SITE.name,
      url: SITE.url,
      telephone: SITE.phoneTel,
      email: SITE.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: SITE.address.street,
        addressLocality: SITE.address.city,
        addressRegion: SITE.address.region,
        postalCode: SITE.address.postalCode,
        addressCountry: SITE.address.country,
      },
    },
    areaServed: { '@type': 'Country', name: 'India' },
    serviceType: service.title,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: `${SITE.url}/services/${service.slug}`,
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE.url}/#services` },
      { '@type': 'ListItem', position: 3, name: service.title, item: `${SITE.url}/services/${service.slug}` },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How much does ${service.title.toLowerCase()} cost in Jaipur?`,
        acceptedAnswer: { '@type': 'Answer', text: `Our ${service.title.toLowerCase()} services are priced based on project requirements. Contact us at ${SITE.phone} for a free quote tailored to your needs.` },
      },
      {
        '@type': 'Question',
        name: `How long does ${service.title.toLowerCase()} take?`,
        acceptedAnswer: { '@type': 'Answer', text: `Timeline for ${service.title.toLowerCase()} varies based on scope. Most projects are completed within 2-8 weeks. Contact us for a detailed timeline.` },
      },
    ],
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StructuredData />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

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

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-sm text-muted-foreground">
        <nav className="flex items-center gap-2 flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-neon transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/#services" className="hover:text-neon transition-colors">Services</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">{service.title}</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="py-12 md:py-20 bg-dark-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-neon/10 text-neon border-neon/20">A-Star Infotech Service</Badge>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              {service.title} <span className="text-neon">in Jaipur, India</span>
            </h1>
            <p className="text-base md:text-xl text-muted-foreground leading-relaxed mb-8">
              {service.fullDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/#contact">
                <Button size="lg" className="bg-neon hover:bg-neon/90 text-dark-surface font-semibold px-6 h-12 sm:h-14 rounded-xl min-h-[44px]">
                  Get Free Quote <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <a href={`tel:${SITE.phoneTel}`}>
                <Button size="lg" variant="outline" className="border-neon/30 text-neon hover:bg-neon/10 px-6 h-12 sm:h-14 rounded-xl min-h-[44px]">
                  <Phone className="mr-2 w-4 h-4" /> Call Now
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-4">
              What&apos;s Included in Our <span className="text-neon">{service.title}</span>
            </h2>
            <p className="text-muted-foreground text-sm md:text-lg">
              Comprehensive features designed to help your business succeed online.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.features.map((feature, i) => (
              <Card key={i} className="bg-dark-surface border-neon/20 hover:border-neon/40 transition-colors">
                <CardContent className="p-6 flex items-start gap-3">
                  <div className="w-10 h-10 shrink-0 rounded-lg bg-neon/10 border border-neon/20 flex items-center justify-center">
                    <Check className="w-5 h-5 text-neon" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm mb-1">{feature}</h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-16 md:py-24 bg-dark-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-4">
              Technologies We Use
            </h2>
            <p className="text-muted-foreground text-sm md:text-lg">
              Modern, industry-standard tools and frameworks for {service.title.toLowerCase()}.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {service.tech.map((tech, i) => (
              <span key={i} className="px-5 py-3 rounded-xl bg-neon/10 border border-neon/20 text-neon font-medium text-sm">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-5xl font-bold text-neon mb-2">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-dark-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-4">
              What Our Clients Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.slice(0, 3).map((t, i) => (
              <Card key={i} className="bg-background border-neon/20">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <span key={j} className="text-amber-400">★</span>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic mb-4">&ldquo;{t.review}&rdquo;</p>
                  <div>
                    <div className="font-semibold text-foreground text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-neon via-brand-600 to-neon">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
            Ready to Start Your {service.title} Project?
          </h2>
          <p className="text-white/80 text-sm md:text-lg mb-8 max-w-2xl mx-auto">
            Get in touch today for a free consultation. We&apos;ll discuss your requirements and provide a custom quote.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/#contact">
              <Button size="lg" className="bg-white hover:bg-white/90 text-neon font-semibold px-6 h-12 sm:h-14 rounded-xl min-h-[44px]">
                Get Free Consultation <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <a href={`mailto:${SITE.email}`}>
              <Button size="lg" variant="outline" className="border-white/30 text-white bg-white/10 hover:bg-white/20 px-6 h-12 sm:h-14 rounded-xl min-h-[44px]">
                <Mail className="mr-2 w-4 h-4" /> Email Us
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-4">
              Related Services
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedServices.map(s => (
              <Link key={s.slug} href={`/services/${s.slug}`}>
                <Card className="bg-dark-surface border-neon/20 hover:border-neon/40 transition-colors h-full">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-2">{s.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{s.description}</p>
                    <span className="inline-flex items-center gap-1 text-sm text-neon">
                      Learn More <ArrowRight className="w-4 h-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-surface border-t border-border py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="A-Star Infotech logo" className="w-9 h-9 rounded-lg object-contain" />
              <div>
                <div className="font-bold text-foreground">A-Star Infotech</div>
                <div className="text-xs text-muted-foreground">Web Development Agency in Jaipur</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground text-center md:text-right">
              <p>{SITE.address.street}, {SITE.address.city}, {SITE.address.region}</p>
              <p>
                <a href={`tel:${SITE.phoneTel}`} className="hover:text-neon">{SITE.phone}</a> ·{' '}
                <a href={`mailto:${SITE.email}`} className="hover:text-neon">{SITE.email}</a>
              </p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-border text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} A-Star Infotech. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
