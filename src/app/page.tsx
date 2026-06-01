'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Menu,
  X,
  Code2,
  Globe,
  ShoppingCart,
  Smartphone,
  Settings,
  Search,
  ArrowRight,
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  Users,
  Award,
  Zap,
  Heart,
  ChevronRight,
  Send,
  ExternalLink,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  MessageCircle,
  ChevronUp,
  Sparkles,
  Target,
  Shield,
  Rocket,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

/* ────────────────────────────────────────────
   Data
   ──────────────────────────────────────────── */

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
]

const SERVICES = [
  {
    icon: Globe,
    title: 'Website Design',
    description:
      'Beautiful, modern designs that capture your brand identity and engage visitors from the first click.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: Code2,
    title: 'Website Development',
    description:
      'Robust, scalable web applications built with the latest technologies for peak performance and reliability.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    icon: ShoppingCart,
    title: 'E-Commerce Development',
    description:
      'Feature-rich online stores with secure payments, inventory management, and seamless shopping experiences.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: Smartphone,
    title: 'Responsive Websites',
    description:
      'Websites that look stunning on every device — from desktop monitors to the smallest smartphones.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    icon: Settings,
    title: 'Website Maintenance',
    description:
      'Ongoing support, updates, and optimization to keep your website running smoothly and securely.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: Search,
    title: 'SEO Services',
    description:
      'Data-driven SEO strategies that boost your visibility and drive organic traffic to your website.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
]

const WHY_CHOOSE_US = [
  {
    icon: Award,
    title: 'Experienced Team',
    description: 'Our skilled developers bring years of expertise to every project.',
  },
  {
    icon: Zap,
    title: 'Fast Delivery',
    description: 'We meet deadlines without compromising on quality or performance.',
  },
  {
    icon: Shield,
    title: 'Secure Solutions',
    description: 'Every website we build follows the latest security best practices.',
  },
  {
    icon: Heart,
    title: 'Client-Centric',
    description: 'Your vision drives our work — we listen, adapt, and deliver.',
  },
  {
    icon: Target,
    title: 'Result-Oriented',
    description: 'We focus on outcomes that grow your business and online presence.',
  },
  {
    icon: Rocket,
    title: 'Modern Technology',
    description: 'We use cutting-edge tools and frameworks for optimal results.',
  },
]

const PORTFOLIO = [
  {
    title: 'FreshMart Online Store',
    category: 'E-Commerce',
    description:
      'A fully-featured online grocery store with real-time inventory, secure checkout, and delivery tracking.',
    tech: ['Next.js', 'Stripe', 'PostgreSQL'],
    color: 'from-emerald-500 to-emerald-700',
  },
  {
    title: 'HealthPlus Clinic',
    category: 'Healthcare',
    description:
      'A responsive website for a multi-specialty clinic with appointment booking and patient portal.',
    tech: ['React', 'Node.js', 'MongoDB'],
    color: 'from-amber-500 to-amber-700',
  },
  {
    title: 'UrbanBite Restaurant',
    category: 'Restaurant',
    description:
      'A beautiful restaurant website with online ordering, table reservations, and menu management.',
    tech: ['Next.js', 'Prisma', 'Tailwind'],
    color: 'from-emerald-600 to-teal-700',
  },
  {
    title: 'EduSpark Academy',
    category: 'Education',
    description:
      'An e-learning platform with course management, video streaming, and student progress tracking.',
    tech: ['React', 'Firebase', 'TypeScript'],
    color: 'from-orange-500 to-amber-700',
  },
  {
    title: 'GreenLeaf Landscaping',
    category: 'Local Business',
    description:
      'A lead-generating website for a landscaping company with gallery, quote requests, and service pages.',
    tech: ['Next.js', 'Sanity CMS', 'Vercel'],
    color: 'from-teal-500 to-emerald-700',
  },
  {
    title: 'TechVault IT Solutions',
    category: 'IT Services',
    description:
      'A corporate website for an IT firm with service pages, case studies, and a knowledge base.',
    tech: ['React', 'GraphQL', 'AWS'],
    color: 'from-amber-600 to-orange-700',
  },
]

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    company: 'FreshMart Pvt. Ltd.',
    review:
      'A-Star Infotech transformed our online presence. Our e-commerce sales increased by 150% within the first three months. Their team is incredibly talented and responsive.',
    rating: 5,
  },
  {
    name: 'Rajesh Patel',
    company: 'HealthPlus Clinic',
    review:
      'The website they built for us is professional, fast, and easy to manage. Patient appointments have doubled since launch. Highly recommended!',
    rating: 5,
  },
  {
    name: 'Anita Desai',
    company: 'UrbanBite Restaurant',
    review:
      'From design to deployment, A-Star Infotech exceeded all our expectations. The online ordering system works flawlessly, and our customers love it.',
    rating: 5,
  },
  {
    name: 'Vikram Singh',
    company: 'EduSpark Academy',
    review:
      'Working with A-Star Infotech was a game-changer for our platform. They understood our vision and delivered a solution that truly supports our students.',
    rating: 5,
  },
  {
    name: 'Meera Joshi',
    company: 'GreenLeaf Landscaping',
    review:
      'Our new website generates leads every single day. A-Star Infotech really understands how to create sites that convert visitors into customers.',
    rating: 5,
  },
  {
    name: 'Arun Kumar',
    company: 'TechVault IT Solutions',
    review:
      'Professional, reliable, and creative — A-Star Infotech is the best web development partner we have ever worked with. They truly go above and beyond.',
    rating: 5,
  },
]

const STATS = [
  { value: '150+', label: 'Projects Delivered' },
  { value: '120+', label: 'Happy Clients' },
  { value: '5+', label: 'Years Experience' },
  { value: '99%', label: 'Client Satisfaction' },
]

/* ────────────────────────────────────────────
   Animated Section Wrapper
   ──────────────────────────────────────────── */

function AnimatedSection({
  children,
  className = '',
  id,
}: {
  children: React.ReactNode
  className?: string
  id?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id={id}
      ref={ref}
      className={className}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </section>
  )
}

/* ────────────────────────────────────────────
   Main Page Component
   ──────────────────────────────────────────── */

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      setShowScrollTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Something went wrong')
      }

      toast({
        title: 'Message Sent!',
        description:
          "Thank you for reaching out. We'll get back to you within 24 hours.",
      })

      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong'
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* ─── Header / Navigation ─── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-border/50'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <a href="#home" className="flex items-center gap-2 group">
              <img
                src="/logo.png"
                alt="A-Star Infotech Logo"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-contain shadow-md group-hover:shadow-lg transition-shadow"
              />
              <div className="flex flex-col">
                <span
                  className={`font-bold text-base sm:text-lg leading-tight transition-colors ${
                    scrolled ? 'text-foreground' : 'text-white'
                  }`}
                >
                  A-Star
                </span>
                <span
                  className={`text-[10px] sm:text-xs leading-tight font-medium tracking-wider uppercase transition-colors ${
                    scrolled ? 'text-emerald-600' : 'text-emerald-300'
                  }`}
                >
                  Infotech
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`px-3 lg:px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-emerald-50 hover:text-emerald-700 ${
                    scrolled
                      ? 'text-muted-foreground'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <a href="#contact">
                <Button
                  size="sm"
                  className="ml-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Get a Quote
                </Button>
              </a>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-md transition-colors ${
                scrolled
                  ? 'text-foreground hover:bg-muted'
                  : 'text-white hover:bg-white/10'
              }`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-border shadow-lg overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-md text-foreground font-medium hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <a href="#contact" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                    Get a Quote
                  </Button>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ─── Hero Section ─── */}
      <section
        id="home"
        className="relative min-h-screen flex items-center overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950" />
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: 'url(/hero-image.png)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/70 to-emerald-800/50" />

        {/* Decorative shapes */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-40">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-6 bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30 px-4 py-1.5 text-sm">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Building Smart Websites for Growing Businesses
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight"
            >
              Transform Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-amber-300">
                Digital Presence
              </span>{' '}
              With Us
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-emerald-100/80 max-w-2xl leading-relaxed"
            >
              We craft stunning, high-performance websites that help businesses
              grow. From design to development, SEO to e-commerce — we deliver
              digital solutions that drive results.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <a href="#contact">
                <Button
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 h-13 text-base shadow-lg shadow-amber-500/25"
                >
                  Start Your Project
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </a>
              <a href="#portfolio">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-emerald-400/30 text-emerald-100 hover:bg-emerald-800/50 hover:text-white px-8 h-13 text-base"
                >
                  View Our Work
                  <ExternalLink className="ml-2 w-4 h-4" />
                </Button>
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8"
            >
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center sm:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-emerald-300/70 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 border-2 border-emerald-400/40 rounded-full flex items-start justify-center p-1.5"
          >
            <motion.div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── About Section ─── */}
      <AnimatedSection
        id="about"
        className="py-20 sm:py-28 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/about-image.png"
                  alt="A-Star Infotech team collaborating"
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-6 -right-4 sm:right-4 bg-white rounded-xl shadow-xl p-4 sm:p-5 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Award className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-foreground">5+ Years</div>
                    <div className="text-sm text-muted-foreground">
                      Trusted Experience
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <Badge
                variant="secondary"
                className="mb-4 bg-emerald-50 text-emerald-700 border-emerald-200"
              >
                About Us
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                We Build Digital Experiences{' '}
                <span className="text-emerald-600">That Matter</span>
              </h2>
              <p className="mt-5 text-muted-foreground text-base sm:text-lg leading-relaxed">
                A-Star Infotech is a forward-thinking web development agency
                dedicated to empowering businesses with impactful digital
                solutions. We combine creativity, technology, and strategy to
                build websites that don&apos;t just look great — they deliver
                measurable results.
              </p>
              <p className="mt-4 text-muted-foreground text-base sm:text-lg leading-relaxed">
                From startups finding their voice to established brands seeking
                digital transformation, we partner with our clients every step
                of the way. Our mission is simple: help you succeed online.
              </p>

              {/* Vision & Mission */}
              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                <Card className="border-emerald-200 bg-emerald-50/50">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-emerald-600" />
                      <h3 className="font-semibold text-foreground">Our Vision</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      To be the most trusted digital partner for businesses
                      seeking growth through innovative web solutions.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-amber-200 bg-amber-50/50">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Rocket className="w-5 h-5 text-amber-600" />
                      <h3 className="font-semibold text-foreground">Our Mission</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      To deliver high-quality, affordable web solutions that
                      help businesses thrive in the digital age.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Values */}
              <div className="mt-6 flex flex-wrap gap-2">
                {['Innovation', 'Integrity', 'Excellence', 'Collaboration', 'Transparency'].map(
                  (value) => (
                    <Badge
                      key={value}
                      variant="outline"
                      className="px-3 py-1 text-emerald-700 border-emerald-300"
                    >
                      {value}
                    </Badge>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ─── Services Section ─── */}
      <AnimatedSection
        id="services"
        className="py-20 sm:py-28 bg-muted/30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <Badge
              variant="secondary"
              className="mb-4 bg-emerald-50 text-emerald-700 border-emerald-200"
            >
              Our Services
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Everything You Need to{' '}
              <span className="text-emerald-600">Succeed Online</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-base sm:text-lg">
              From concept to launch and beyond, we provide comprehensive web
              solutions tailored to your business goals.
            </p>
          </div>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, idx) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <Card className="group h-full border-border/50 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 sm:p-8">
                    <div
                      className={`w-12 h-12 rounded-xl ${service.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                    >
                      <service.icon className={`w-6 h-6 ${service.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                    <a
                      href="#contact"
                      className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      Learn More
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ─── Why Choose Us ─── */}
      <AnimatedSection className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <Badge
                variant="secondary"
                className="mb-4 bg-amber-50 text-amber-700 border-amber-200"
              >
                Why Choose Us
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                What Makes Us{' '}
                <span className="text-emerald-600">Stand Out</span>
              </h2>
              <p className="mt-5 text-muted-foreground text-base sm:text-lg leading-relaxed">
                We&apos;re not just another web development agency. We&apos;re your
                growth partners — committed to delivering solutions that make a
                real difference for your business.
              </p>

              <div className="mt-8 grid sm:grid-cols-2 gap-5">
                {WHY_CHOOSE_US.map((item, idx) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.4 }}
                    className="flex gap-4"
                  >
                    <div className="w-10 h-10 shrink-0 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Visual side */}
            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-8 sm:p-12">
                <div className="space-y-6">
                  {[
                    { label: 'Client Satisfaction', value: 99 },
                    { label: 'On-Time Delivery', value: 97 },
                    { label: 'Code Quality', value: 95 },
                    { label: 'Support Response', value: 98 },
                  ].map((item, idx) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-foreground">
                          {item.label}
                        </span>
                        <span className="text-emerald-600 font-semibold">
                          {item.value}%
                        </span>
                      </div>
                      <div className="h-2.5 bg-emerald-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.value}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + idx * 0.15, duration: 0.8, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating accent */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-amber-400 rounded-2xl flex items-center justify-center shadow-lg rotate-6">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ─── Portfolio Section ─── */}
      <AnimatedSection
        id="portfolio"
        className="py-20 sm:py-28 bg-muted/30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <Badge
              variant="secondary"
              className="mb-4 bg-emerald-50 text-emerald-700 border-emerald-200"
            >
              Our Portfolio
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Projects That{' '}
              <span className="text-emerald-600">Speak for Themselves</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-base sm:text-lg">
              Explore some of our recent work and see how we&apos;ve helped
              businesses across industries achieve their digital goals.
            </p>
          </div>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PORTFOLIO.map((project, idx) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                  {/* Gradient header */}
                  <div
                    className={`h-48 bg-gradient-to-br ${project.color} p-6 flex flex-col justify-end relative overflow-hidden`}
                  >
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                        {project.category}
                      </Badge>
                    </div>
                    {/* Decorative circles */}
                    <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
                    <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/5 rounded-full" />
                    <h3 className="text-xl font-bold text-white relative z-10">
                      {project.title}
                    </h3>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {project.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <Badge
                          key={t}
                          variant="secondary"
                          className="text-xs bg-emerald-50 text-emerald-700"
                        >
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a href="#contact">
              <Button
                size="lg"
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              >
                Discuss Your Project
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </a>
          </div>
        </div>
      </AnimatedSection>

      {/* ─── Testimonials Section ─── */}
      <AnimatedSection
        id="testimonials"
        className="py-20 sm:py-28 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <Badge
              variant="secondary"
              className="mb-4 bg-amber-50 text-amber-700 border-amber-200"
            >
              Testimonials
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              What Our Clients{' '}
              <span className="text-emerald-600">Say About Us</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-base sm:text-lg">
              Don&apos;t just take our word for it — hear from the businesses
              we&apos;ve helped succeed.
            </p>
          </div>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial, idx) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-border/50">
                  <CardContent className="p-6">
                    {/* Stars */}
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-sm sm:text-base italic">
                      &ldquo;{testimonial.review}&rdquo;
                    </p>
                    <div className="mt-5 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm">
                        {testimonial.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-sm">
                          {testimonial.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ─── CTA Banner ─── */}
      <AnimatedSection className="py-16 sm:py-20 bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-amber-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to Take Your Business Online?
          </h2>
          <p className="mt-4 text-emerald-100/90 text-lg max-w-2xl mx-auto">
            Let&apos;s build something amazing together. Get in touch today for a
            free consultation and discover how we can transform your digital
            presence.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <a href="#contact">
              <Button
                size="lg"
                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 h-13 shadow-lg shadow-amber-500/25"
              >
                Get Free Consultation
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
            <a
              href="https://wa.me/918560074448"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 h-13"
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                Chat on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </AnimatedSection>

      {/* ─── Contact Section ─── */}
      <AnimatedSection
        id="contact"
        className="py-20 sm:py-28 bg-muted/30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <Badge
              variant="secondary"
              className="mb-4 bg-emerald-50 text-emerald-700 border-emerald-200"
            >
              Contact Us
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Let&apos;s Start{' '}
              <span className="text-emerald-600">Your Project</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-base sm:text-lg">
              Have a project in mind? We&apos;d love to hear from you. Fill out
              the form below or reach us directly.
            </p>
          </div>

          <div className="mt-14 grid lg:grid-cols-5 gap-10 lg:gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <Card className="shadow-lg">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-6">
                    Send Us a Message
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label
                          htmlFor="name"
                          className="text-sm font-medium text-foreground"
                        >
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="email"
                          className="text-sm font-medium text-foreground"
                        >
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="phone"
                        className="text-sm font-medium text-foreground"
                      >
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 8560074448"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="message"
                        className="text-sm font-medium text-foreground"
                      >
                        Your Message <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Tell us about your project..."
                        rows={5}
                        required
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                      />
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-5">
                    Get In Touch
                  </h3>
                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 shrink-0 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground text-sm">
                          Office Address
                        </div>
                        <div className="text-sm text-muted-foreground mt-0.5">
                          D-49, Shiv Marg, Balaji Sagar-15,
                          <br />
                          Jaipur, Rajasthan
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 shrink-0 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground text-sm">
                          Phone Number
                        </div>
                        <div className="text-sm text-muted-foreground mt-0.5">
                          +91 8560074448
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 shrink-0 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground text-sm">
                          Email Address
                        </div>
                        <div className="text-sm text-muted-foreground mt-0.5">
                          hello@astarinfotech.com
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 shrink-0 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground text-sm">
                          Business Hours
                        </div>
                        <div className="text-sm text-muted-foreground mt-0.5">
                          Mon – Sat: 10:00 AM – 7:00 PM
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Map placeholder */}
              <Card className="shadow-lg overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-emerald-400 mx-auto" />
                    <p className="text-sm text-emerald-600 mt-2 font-medium">
                      A-Star Infotech
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Jaipur, Rajasthan
                    </p>
                  </div>
                </div>
              </Card>

              {/* Social Links */}
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Follow Us
                  </h3>
                  <div className="flex gap-3">
                    <a
                      href="https://facebook.com/astarinfotech"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors"
                      aria-label="Facebook"
                    >
                      <Facebook className="w-5 h-5 text-blue-600" />
                    </a>
                    <a
                      href="https://instagram.com/astarinfotech"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg bg-pink-50 hover:bg-pink-100 flex items-center justify-center transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-5 h-5 text-pink-600" />
                    </a>
                    <a
                      href="https://linkedin.com/company/astarinfotech"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg bg-sky-50 hover:bg-sky-100 flex items-center justify-center transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-5 h-5 text-sky-700" />
                    </a>
                    <a
                      href="https://youtube.com/@astarinfotech"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
                      aria-label="YouTube"
                    >
                      <Youtube className="w-5 h-5 text-red-600" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ─── Footer ─── */}
      <footer className="bg-emerald-950 text-emerald-100 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main footer */}
          <div className="py-12 sm:py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="/logo.png"
                  alt="A-Star Infotech Logo"
                  className="w-9 h-9 rounded-lg object-contain"
                />
                <div>
                  <div className="font-bold text-white text-lg leading-tight">
                    A-Star
                  </div>
                  <div className="text-xs text-emerald-400 font-medium tracking-wider uppercase">
                    Infotech
                  </div>
                </div>
              </div>
              <p className="text-emerald-300/70 text-sm leading-relaxed max-w-xs">
                Building smart websites for growing businesses. Your trusted
                partner for all digital solutions.
              </p>
              <div className="mt-4 flex gap-3">
                <a
                  href="https://facebook.com/astarinfotech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-emerald-900 hover:bg-emerald-800 flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com/astarinfotech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-emerald-900 hover:bg-emerald-800 flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com/company/astarinfotech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-emerald-900 hover:bg-emerald-800 flex items-center justify-center transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com/@astarinfotech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-emerald-900 hover:bg-emerald-800 flex items-center justify-center transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2.5">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-emerald-300/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold text-white mb-4">Our Services</h4>
              <ul className="space-y-2.5">
                {SERVICES.map((service) => (
                  <li key={service.title}>
                    <a
                      href="#services"
                      className="text-sm text-emerald-300/70 hover:text-white transition-colors"
                    >
                      {service.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-white mb-4">Contact Info</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-emerald-300/70">
                    D-49, Shiv Marg, Balaji Sagar-15, Jaipur, Rajasthan
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-sm text-emerald-300/70">
                    +91 8560074448
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-sm text-emerald-300/70">
                    hello@astarinfotech.com
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-emerald-800/50 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-emerald-300/50">
              © {new Date().getFullYear()} A-Star Infotech. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-emerald-300/50">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ─── WhatsApp Floating Button ─── */}
      <a
        href="https://wa.me/918560074448?text=Hello%20A-Star%20Infotech!%20I%20am%20interested%20in%20your%20web%20development%20services."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 whatsapp-pulse"
        aria-label="Chat on WhatsApp"
      >
        <div className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
          <MessageCircle className="w-7 h-7 text-white" />
        </div>
      </a>

      {/* ─── Scroll to Top Button ─── */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 left-6 z-50 w-12 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
