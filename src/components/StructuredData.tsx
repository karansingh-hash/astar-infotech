/**
 * Comprehensive structured data (JSON-LD) for A-Star Infotech.
 * Emits multiple schema.org types for rich Google search results.
 *
 * Schemas emitted:
 * - WebSite (with SearchAction for Google sitelinks search box)
 * - Organization (with logo for Google knowledge panel)
 * - LocalBusiness (with full NAP + hours + geo)
 * - Service x6 (one per service, with offer catalog)
 * - FAQPage (for FAQ rich results — accordion-style in SERP)
 * - BreadcrumbList (for breadcrumb rich results)
 * - AggregateRating (from testimonials — star rating in SERP)
 */

import { SITE, SERVICES, FAQS, TESTIMONIALS, AVERAGE_RATING, REVIEW_COUNT } from '@/lib/seo-data'

function WebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    description: 'Web Development & Digital Solutions Agency in Jaipur, India',
    publisher: { '@id': `${SITE.url}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE.url}/?s={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'en-IN',
  }
}

function OrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/logo.png`,
    image: `${SITE.url}/og-image.png`,
    description: 'Professional website design, e-commerce development, responsive design, and SEO services for businesses in Jaipur and across India.',
    foundingDate: SITE.founded,
    founders: [{ '@type': 'Person', name: 'Karan Singh Meertiya' }],
    email: SITE.email,
    telephone: SITE.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    sameAs: Object.values(SITE.social),
    areaServed: [
      { '@type': 'City', name: 'Jaipur' },
      { '@type': 'State', name: 'Rajasthan' },
      { '@type': 'Country', name: 'India' },
    ],
    knowsAbout: [
      'Web Development',
      'Website Design',
      'E-Commerce Development',
      'Search Engine Optimization',
      'Responsive Web Design',
      'Website Maintenance',
    ],
  }
}

function LocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE.url}/#localbusiness`,
    name: SITE.name,
    description: 'Professional website development, e-commerce solutions, responsive design, and SEO services for businesses in Jaipur and across India.',
    url: SITE.url,
    logo: `${SITE.url}/logo.png`,
    image: `${SITE.url}/og-image.png`,
    telephone: SITE.phoneTel,
    email: SITE.email,
    priceRange: SITE.priceRange,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE.geo.latitude,
      longitude: SITE.geo.longitude,
    },
    openingHoursSpecification: [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '10:00',
      closes: '19:00',
    }],
    sameAs: Object.values(SITE.social),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: AVERAGE_RATING,
      reviewCount: REVIEW_COUNT,
      bestRating: 5,
      worstRating: 1,
    },
    review: TESTIMONIALS.map(t => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: t.name },
      reviewBody: t.review,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: t.rating,
        bestRating: 5,
        worstRating: 1,
      },
      publisher: { '@id': `${SITE.url}/#organization` },
    })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Web Development Services',
      itemListElement: SERVICES.map(s => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: s.title,
          description: s.description,
          url: `${SITE.url}/services/${s.slug}`,
        },
      })),
    },
  }
}

function ServiceSchemas() {
  return SERVICES.map(service => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE.url}/services/${service.slug}#service`,
    name: service.title,
    description: service.fullDescription,
    url: `${SITE.url}/services/${service.slug}`,
    provider: { '@id': `${SITE.url}/#localbusiness` },
    areaServed: { '@type': 'Country', name: 'India' },
    serviceType: service.title,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: `${SITE.url}/services/${service.slug}`,
      seller: { '@id': `${SITE.url}/#organization` },
    },
  }))
}

function FAQSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${SITE.url}/#faqs`,
    mainEntity: FAQS.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

function BreadcrumbSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${SITE.url}/#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE.url,
      },
    ],
  }
}

function VideoSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: 'A-Star Infotech — Web Development Services',
    description: 'Background video showcasing A-Star Infotech web development services in Jaipur, India. Features modern web design, e-commerce, SEO, and responsive website development.',
    thumbnailUrl: `${SITE.url}/og-image.png`,
    uploadDate: '2026-07-11',
    contentUrl: `${SITE.url}/services-bg.mp4`,
    embedUrl: `${SITE.url}/#services`,
    duration: 'PT30S',
    contentSize: '3360942',
    encodingFormat: 'video/mp4',
    width: 1280,
    height: 720,
    isFamilyFriendly: true,
    potentialAction: {
      '@type': 'WatchAction',
      target: `${SITE.url}/#services`,
    },
    publisher: { '@id': `${SITE.url}/#organization` },
  }
}

function GraphSchema() {
  // Use @graph to combine all schemas into a single structured data block
  // This is Google's recommended approach for multiple entities on one page
  return {
    '@context': 'https://schema.org',
    '@graph': [
      WebSiteSchema(),
      OrganizationSchema(),
      LocalBusinessSchema(),
      ...ServiceSchemas(),
      FAQSchema(),
      BreadcrumbSchema(),
      VideoSchema(),
    ],
  }
}

export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(GraphSchema()) }}
    />
  )
}
