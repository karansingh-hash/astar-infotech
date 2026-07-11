'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, HelpCircle, ArrowRight, Phone, Mail, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { FAQS, SITE } from '@/lib/seo-data'

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [mounted, setMounted] = useState(false)
  const answerRefs = useRef<(HTMLDivElement | null)[]>([])

  // Fix hydration: set open state only after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredFaqs = FAQS.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleFaq = (index: number) => {
    setOpenIndex(prev => prev === index ? null : index)
  }

  // Compute max-height for smooth CSS transition (reliable across all browsers)
  const getAnswerStyle = (index: number): React.CSSProperties => {
    const isOpen = mounted && openIndex === index
    if (isOpen && answerRefs.current[index]) {
      const scrollHeight = answerRefs.current[index]!.scrollHeight
      return {
        maxHeight: `${scrollHeight + 48}px`,
        opacity: 1,
        paddingTop: '0',
        paddingBottom: '1.5rem',
      }
    }
    return {
      maxHeight: '0px',
      opacity: 0,
      paddingTop: '0',
      paddingBottom: '0',
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
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
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/#home" className="px-3 py-2 rounded-md text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-neon/10 transition-colors">Home</Link>
            <Link href="/#about" className="px-3 py-2 rounded-md text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-neon/10 transition-colors">About</Link>
            <Link href="/#services" className="px-3 py-2 rounded-md text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-neon/10 transition-colors">Services</Link>
            <Link href="/#portfolio" className="px-3 py-2 rounded-md text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-neon/10 transition-colors">Portfolio</Link>
            <Link href="/faq" className="px-3 py-2 rounded-md text-sm font-medium text-neon bg-neon/10">FAQ</Link>
            <Link href="/#contact">
              <Button size="sm" className="ml-2 bg-neon/20 hover:bg-neon/30 text-neon border border-neon/30 rounded-xl">Get a Quote</Button>
            </Link>
          </nav>
          <Link href="/#contact" className="md:hidden">
            <Button size="sm" className="bg-neon/20 hover:bg-neon/30 text-neon border border-neon/30 rounded-xl">Quote</Button>
          </Link>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-sm text-muted-foreground">
        <nav className="flex items-center gap-2" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-neon transition-colors">Home</Link>
          <ChevronDown className="w-4 h-4 -rotate-90" />
          <span className="text-foreground font-medium">FAQ</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="py-12 md:py-20 bg-dark-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-neon/10 text-neon border-neon/20">Help Center</Badge>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            Frequently Asked <span className="text-neon">Questions</span>
          </h1>
          <p className="text-base md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
            Everything you need to know about our web development services in Jaipur, India.
            Can&apos;t find the answer you&apos;re looking for?{' '}
            <Link href="/#contact" className="text-neon hover:underline">Feel free to reach out</Link>.
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="futuristic-input neon-focus pl-12 h-12 rounded-xl text-foreground"
              aria-label="Search FAQ questions"
            />
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16 md:py-24 bg-background flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-16">
              <HelpCircle className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-lg">No questions found matching &ldquo;{searchQuery}&rdquo;</p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-4 text-neon hover:underline text-sm"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map((faq, i) => {
                const isOpen = mounted && openIndex === i
                return (
                  <div
                    key={i}
                    className={`glass-card neon-border border-border rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-neon/40 shadow-lg shadow-neon/5' : 'hover:border-neon/30'}`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(i)}
                      className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left min-h-[44px] cursor-pointer bg-transparent border-0"
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${i}`}
                    >
                      <span className="flex items-start gap-3 font-medium text-foreground text-sm md:text-base">
                        <HelpCircle className={`w-5 h-5 shrink-0 mt-0.5 transition-colors ${isOpen ? 'text-neon' : 'text-neon/60'}`} />
                        {faq.question}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-neon' : ''}`} />
                    </button>
                    <div
                      id={`faq-answer-${i}`}
                      ref={(el) => { answerRefs.current[i] = el }}
                      style={{
                        ...getAnswerStyle(i),
                        overflow: 'hidden',
                        transition: 'max-height 0.35s ease, opacity 0.3s ease, padding 0.3s ease',
                      }}
                    >
                      <p className="px-5 md:px-6 pl-12 md:pl-14 text-sm md:text-base text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Count + Still have questions CTA */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground mb-6">
              Showing {filteredFaqs.length} of {FAQS.length} questions
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
            <Card className="bg-dark-surface border-neon/20 max-w-2xl mx-auto">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">Still have questions?</h2>
                <p className="text-muted-foreground text-sm md:text-base mb-6">
                  Our team is here to help. Get in touch and we&apos;ll answer all your questions.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <Link href="/#contact">
                    <Button size="lg" className="bg-neon hover:bg-neon/90 text-dark-surface font-semibold px-6 h-12 rounded-xl min-h-[44px] w-full sm:w-auto">
                      Get in Touch <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                  <a href={`tel:${SITE.phoneTel}`}>
                    <Button size="lg" variant="outline" className="border-neon/30 text-neon hover:bg-neon/10 px-6 h-12 rounded-xl min-h-[44px] w-full sm:w-auto">
                      <Phone className="mr-2 w-4 h-4" /> Call Now
                    </Button>
                  </a>
                  <a href={`mailto:${SITE.email}`}>
                    <Button size="lg" variant="outline" className="border-neon/30 text-neon hover:bg-neon/10 px-6 h-12 rounded-xl min-h-[44px] w-full sm:w-auto">
                      <Mail className="mr-2 w-4 h-4" /> Email Us
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
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
