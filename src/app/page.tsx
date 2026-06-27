'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Menu, X, Code2, Globe, ShoppingCart, Smartphone, Settings, Search,
  ArrowRight, Star, MapPin, Phone, Mail, Clock, Users, Award, Zap,
  Heart, ChevronRight, Send, ExternalLink, Facebook, Instagram,
  Linkedin, Youtube, MessageCircle, ChevronUp, Sparkles, Target,
  Shield, Rocket, Eye, Trash2, Inbox, Lock, LayoutDashboard,
  BarChart3, LogOut, Calendar, MailCheck, PhoneCall, Briefcase,
  Plus, Pencil, Wrench, Save, Sun, Moon, EyeOff, KeyRound, ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LegalModal } from '@/components/legal-modal'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useTheme } from 'next-themes'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

/* ── Data ── */
const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
]

const ICON_MAP: Record<string, React.ElementType> = {
  Globe, Code2, ShoppingCart, Smartphone, Settings, Search,
  Award, Zap, Shield, Heart, Target, Rocket, Star, Users,
  BarChart3, Briefcase, LayoutDashboard, Lock,
}

const DEFAULT_SERVICES = [
  { icon: 'Globe' as const, title: 'Website Design', description: 'Beautiful, modern designs that capture your brand identity and engage visitors from the first click.', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { icon: 'Code2' as const, title: 'Website Development', description: 'Robust, scalable web applications built with the latest technologies for peak performance and reliability.', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { icon: 'ShoppingCart' as const, title: 'E-Commerce Development', description: 'Feature-rich online stores with secure payments, inventory management, and seamless shopping experiences.', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { icon: 'Smartphone' as const, title: 'Responsive Websites', description: 'Websites that look stunning on every device — from desktop monitors to the smallest smartphones.', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { icon: 'Settings' as const, title: 'Website Maintenance', description: 'Ongoing support, updates, and optimization to keep your website running smoothly and securely.', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { icon: 'Search' as const, title: 'SEO Services', description: 'Data-driven SEO strategies that boost your visibility and drive organic traffic to your website.', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
]

const WHY_CHOOSE_US = [
  { icon: Award, title: 'Experienced Team', description: 'Our skilled developers bring years of expertise to every project.' },
  { icon: Zap, title: 'Fast Delivery', description: 'We meet deadlines without compromising on quality or performance.' },
  { icon: Shield, title: 'Secure Solutions', description: 'Every website we build follows the latest security best practices.' },
  { icon: Heart, title: 'Client-Centric', description: 'Your vision drives our work — we listen, adapt, and deliver.' },
  { icon: Target, title: 'Result-Oriented', description: 'We focus on outcomes that grow your business and online presence.' },
  { icon: Rocket, title: 'Modern Technology', description: 'We use cutting-edge tools and frameworks for optimal results.' },
]

const DEFAULT_PORTFOLIO = [
  { title: 'FreshMart Online Store', category: 'E-Commerce', description: 'A fully-featured online grocery store with real-time inventory, secure checkout, and delivery tracking.', tech: 'Next.js, Stripe, PostgreSQL', color: 'from-emerald-500 to-emerald-700', image: '/portfolio-freshmart.png' },
  { title: 'HealthPlus Clinic', category: 'Healthcare', description: 'A responsive website for a multi-specialty clinic with appointment booking and patient portal.', tech: 'React, Node.js, MongoDB', color: 'from-amber-500 to-amber-700', image: '/portfolio-healthplus.png' },
  { title: 'UrbanBite Restaurant', category: 'Restaurant', description: 'A beautiful restaurant website with online ordering, table reservations, and menu management.', tech: 'Next.js, Prisma, Tailwind', color: 'from-emerald-600 to-teal-700', image: '/portfolio-urbanbite.png' },
  { title: 'EduSpark Academy', category: 'Education', description: 'An e-learning platform with course management, video streaming, and student progress tracking.', tech: 'React, Firebase, TypeScript', color: 'from-orange-500 to-amber-700', image: '/portfolio-eduspark.png' },
  { title: 'GreenLeaf Landscaping', category: 'Local Business', description: 'A lead-generating website for a landscaping company with gallery, quote requests, and service pages.', tech: 'Next.js, Sanity CMS, Vercel', color: 'from-teal-500 to-emerald-700', image: '/portfolio-greenleaf.png' },
  { title: 'TechVault IT Solutions', category: 'IT Services', description: 'A corporate website for an IT firm with service pages, case studies, and a knowledge base.', tech: 'React, GraphQL, AWS', color: 'from-amber-600 to-orange-700', image: '/portfolio-techvault.png' },
]

const DEFAULT_TESTIMONIALS = [
  { name: 'Priya Sharma', company: 'FreshMart Pvt. Ltd.', review: 'A-Star Infotech transformed our online presence. Our e-commerce sales increased by 150% within the first three months. Their team is incredibly talented and responsive.', rating: 5 },
  { name: 'Rajesh Patel', company: 'HealthPlus Clinic', review: 'The website they built for us is professional, fast, and easy to manage. Patient appointments have doubled since launch. Highly recommended!', rating: 5 },
  { name: 'Anita Desai', company: 'UrbanBite Restaurant', review: 'From design to deployment, A-Star Infotech exceeded all our expectations. The online ordering system works flawlessly, and our customers love it.', rating: 5 },
  { name: 'Vikram Singh', company: 'EduSpark Academy', review: 'Working with A-Star Infotech was a game-changer for our platform. They understood our vision and delivered a solution that truly supports our students.', rating: 5 },
  { name: 'Meera Joshi', company: 'GreenLeaf Landscaping', review: 'Our new website generates leads every single day. A-Star Infotech really understands how to create sites that convert visitors into customers.', rating: 5 },
  { name: 'Arun Kumar', company: 'TechVault IT Solutions', review: 'Professional, reliable, and creative — A-Star Infotech is the best web development partner we have ever worked with. They truly go above and beyond.', rating: 5 },
]

const DEFAULT_STATS = [
  { value: '150+', label: 'Projects Delivered' },
  { value: '120+', label: 'Happy Clients' },
  { value: '5+', label: 'Years Experience' },
  { value: '99%', label: 'Client Satisfaction' },
]

const DEFAULT_SETTINGS = {
  companyName: 'A-Star Infotech',
  address: 'D-49, Shiv Marg, Balaji Sagar-15, Jaipur, Rajasthan',
  phone: '+91 8560074448',
  email: 'contact@astarinfotech.in',
  secondaryEmail: '',
  hours: 'Mon – Sat: 10:00 AM – 7:00 PM',
  facebook: 'https://facebook.com/astarinfotech',
  instagram: 'https://instagram.com/astarinfotech',
  linkedin: 'https://linkedin.com/company/astarinfotech',
  youtube: 'https://youtube.com/@astarinfotech',
  brandColor: '#059669',
  heroBadge: 'Building Smart Websites for Growing Businesses',
  heroHeading: 'Transform Your Digital Presence With Us',
  heroSubtitle: 'We craft stunning, high-performance websites that help businesses grow. From design to development, SEO to e-commerce — we deliver digital solutions that drive results.',
  aboutHeading: 'We Build Digital Experiences That Matter',
  aboutDescription1: 'A-Star Infotech is a forward-thinking web development agency dedicated to empowering businesses with impactful digital solutions. We combine creativity, technology, and strategy to build websites that don\'t just look great — they deliver measurable results.',
  aboutDescription2: 'From startups finding their voice to established brands seeking digital transformation, we partner with our clients every step of the way. Our mission is simple: help you succeed online.',
  aboutVision: 'To be the most trusted digital partner for businesses seeking growth through innovative web solutions.',
  aboutMission: 'To deliver high-quality, affordable web solutions that help businesses thrive in the digital age.',
  aboutValues: 'Innovation, Integrity, Excellence, Collaboration, Transparency',
  whyChooseUsIntro: 'We\'re not just another web development agency. We\'re your growth partners — committed to delivering solutions that make a real difference for your business.',
}

/* ── Animated Section Wrapper ── */
function AnimatedSection({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <section id={id} ref={ref} className={className}>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
        {children}
      </motion.div>
    </section>
  )
}

/* ── Admin Panel ── */
type AdminTab = 'dashboard' | 'inquiries' | 'services' | 'portfolio' | 'testimonials' | 'statistics' | 'settings'

interface ContactItem { id: string; name: string; email: string; phone: string | null; message: string; createdAt: string }
interface ServiceItem { id: string; title: string; description: string; icon: string; color: string; bgColor: string; order: number }
interface PortfolioItem { id: string; title: string; category: string; description: string; tech: string; color: string; image: string; order: number }
interface TestimonialItem { id: string; name: string; company: string; review: string; rating: number; order: number }
interface StatItem { id: string; value: string; label: string; order: number }
interface DashboardData { totalContacts: number; totalServices: number; totalPortfolio: number; totalTestimonials: number; todayContacts: number; weekContacts: number; monthContacts: number; recentContacts: ContactItem[] }
interface SiteSettings { companyName: string; address: string; phone: string; email: string; secondaryEmail: string; hours: string; facebook: string; instagram: string; linkedin: string; youtube: string; brandColor: string; heroBadge: string; heroHeading: string; heroSubtitle: string; aboutHeading: string; aboutDescription1: string; aboutDescription2: string; aboutVision: string; aboutMission: string; aboutValues: string; whyChooseUsIntro: string }

const TAB_CONFIG: { key: AdminTab; label: string; icon: React.ElementType }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'inquiries', label: 'Inquiries', icon: Inbox },
  { key: 'services', label: 'Services', icon: Globe },
  { key: 'portfolio', label: 'Portfolio', icon: Briefcase },
  { key: 'testimonials', label: 'Testimonials', icon: Star },
  { key: 'statistics', label: 'Statistics', icon: BarChart3 },
  { key: 'settings', label: 'Site Settings', icon: Wrench },
]


/* ────────────────────────────────────────────
   Main Page Component - Futuristic Dark Theme
   ──────────────────────────────────────────── */

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [services, setServices] = useState(DEFAULT_SERVICES)
  const [portfolioItems, setPortfolioItems] = useState(DEFAULT_PORTFOLIO)
  const [testimonialItems, setTestimonialItems] = useState(DEFAULT_TESTIMONIALS)
  const [statItems, setStatItems] = useState(DEFAULT_STATS)
  const [siteSettings, setSiteSettings] = useState(DEFAULT_SETTINGS)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    async function fetchData() {
      try {
        const [servicesRes, portfolioRes, testimonialsRes, statsRes, settingsRes] = await Promise.allSettled([
          fetch('/api/services'), fetch('/api/portfolio'), fetch('/api/testimonials'), fetch('/api/stats'), fetch('/api/settings'),
        ])
        if (servicesRes.status === 'fulfilled' && servicesRes.value.ok) { const d = await servicesRes.value.json(); if (d.services?.length > 0) setServices(d.services.map((s: { icon: string; title: string; description: string; color: string; bgColor: string }) => ({ icon: s.icon || 'Globe', title: s.title, description: s.description, color: s.color || 'text-emerald-400', bg: s.bgColor || 'bg-emerald-500/10' }))) }
        if (portfolioRes.status === 'fulfilled' && portfolioRes.value.ok) { const d = await portfolioRes.value.json(); if (d.portfolio?.length > 0) setPortfolioItems(d.portfolio.map((p: { title: string; category: string; description: string; tech: string; color: string; image: string }) => ({ title: p.title, category: p.category, description: p.description, tech: p.tech || '', color: p.color || 'from-emerald-500 to-emerald-700', image: p.image || '/portfolio-freshmart.png' }))) }
        if (testimonialsRes.status === 'fulfilled' && testimonialsRes.value.ok) { const d = await testimonialsRes.value.json(); if (d.testimonials?.length > 0) setTestimonialItems(d.testimonials.map((t: { name: string; company: string; review: string; rating: number }) => ({ name: t.name, company: t.company, review: t.review, rating: t.rating || 5 }))) }
        if (statsRes.status === 'fulfilled' && statsRes.value.ok) { const d = await statsRes.value.json(); if (d.stats?.length > 0) setStatItems(d.stats.map((s: { value: string; label: string }) => ({ value: s.value, label: s.label }))) }
        if (settingsRes.status === 'fulfilled' && settingsRes.value.ok) { const d = await settingsRes.value.json(); if (d.settings) setSiteSettings({ companyName: d.settings.companyName || DEFAULT_SETTINGS.companyName, address: d.settings.address || DEFAULT_SETTINGS.address, phone: d.settings.phone || DEFAULT_SETTINGS.phone, email: d.settings.email || DEFAULT_SETTINGS.email, secondaryEmail: d.settings.secondaryEmail || DEFAULT_SETTINGS.secondaryEmail, hours: d.settings.hours || DEFAULT_SETTINGS.hours, facebook: d.settings.facebook || DEFAULT_SETTINGS.facebook, instagram: d.settings.instagram || DEFAULT_SETTINGS.instagram, linkedin: d.settings.linkedin || DEFAULT_SETTINGS.linkedin, youtube: d.settings.youtube || DEFAULT_SETTINGS.youtube, brandColor: d.settings.brandColor || DEFAULT_SETTINGS.brandColor, heroBadge: d.settings.heroBadge || DEFAULT_SETTINGS.heroBadge, heroHeading: d.settings.heroHeading || DEFAULT_SETTINGS.heroHeading, heroSubtitle: d.settings.heroSubtitle || DEFAULT_SETTINGS.heroSubtitle, aboutHeading: d.settings.aboutHeading || DEFAULT_SETTINGS.aboutHeading, aboutDescription1: d.settings.aboutDescription1 || DEFAULT_SETTINGS.aboutDescription1, aboutDescription2: d.settings.aboutDescription2 || DEFAULT_SETTINGS.aboutDescription2, aboutVision: d.settings.aboutVision || DEFAULT_SETTINGS.aboutVision, aboutMission: d.settings.aboutMission || DEFAULT_SETTINGS.aboutMission, aboutValues: d.settings.aboutValues || DEFAULT_SETTINGS.aboutValues, whyChooseUsIntro: d.settings.whyChooseUsIntro || DEFAULT_SETTINGS.whyChooseUsIntro }) }
      } catch (error) { console.error('Failed to fetch site data:', error) }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const handleScroll = () => { setScrolled(window.scrollY > 20); setShowScrollTop(window.scrollY > 500) }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Brand color + neon dynamic application
  useEffect(() => {
    const hex = siteSettings.brandColor || '#059669'
    const root = document.documentElement
    const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16)
    const lighten = (f: number) => `#${Math.round(r + (255 - r) * (1 - f)).toString(16).padStart(2, '0')}${Math.round(g + (255 - g) * (1 - f)).toString(16).padStart(2, '0')}${Math.round(b + (255 - b) * (1 - f)).toString(16).padStart(2, '0')}`
    const darken = (f: number) => `#${Math.round(r * f).toString(16).padStart(2, '0')}${Math.round(g * f).toString(16).padStart(2, '0')}${Math.round(b * f).toString(16).padStart(2, '0')}`
    root.style.setProperty('--brand-50', lighten(0.1)); root.style.setProperty('--brand-100', lighten(0.2)); root.style.setProperty('--brand-200', lighten(0.4)); root.style.setProperty('--brand-300', lighten(0.6)); root.style.setProperty('--brand-400', lighten(0.8))
    root.style.setProperty('--brand-500', hex); root.style.setProperty('--brand-600', hex); root.style.setProperty('--brand-700', darken(0.85)); root.style.setProperty('--brand-800', darken(0.65)); root.style.setProperty('--brand-900', darken(0.45)); root.style.setProperty('--brand-950', darken(0.28))
    // Update neon color based on brand
    root.style.setProperty('--neon', hex)
    root.style.setProperty('--neon-dim', hex + '33')
    root.style.setProperty('--neon-glow', hex + '66')
  }, [siteSettings.brandColor])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setIsSubmitting(true)
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Something went wrong') }
      toast.success('Message Sent Successfully!', { description: "Thank you for reaching out! We've received your message and will get back to you within 24 hours." })
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (error: unknown) { toast.error('Error', { description: error instanceof Error ? error.message : 'Something went wrong' }) } finally { setIsSubmitting(false) }
  }

  const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }) }

  return (
    <div className="min-h-screen flex flex-col bg-background">

      {/* ─── Header ─── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-dark-surface/90 backdrop-blur-xl border-b border-border shadow-lg shadow-neon/5' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <a href="#home" className="flex items-center gap-2 group">
              <img src="/logo.png" alt="A-Star Infotech Logo" className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-contain shadow-md shadow-neon/10 group-hover:shadow-neon/20 transition-shadow" />
              <div className="flex flex-col">
                <span className="font-bold text-base sm:text-lg leading-tight text-foreground">A-Star</span>
                <span className="text-[10px] sm:text-xs leading-tight font-medium tracking-wider uppercase text-neon">Infotech</span>
              </div>
            </a>
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(link => (
                <a key={link.href} href={link.href} className="px-3 lg:px-4 py-2 rounded-md text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-neon/10 transition-colors">{link.label}</a>
              ))}
              <a href="#contact"><Button size="sm" className="ml-2 glow-button bg-neon/20 hover:bg-neon/30 text-neon border border-neon/30">Get a Quote</Button></a>
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded-lg hover:bg-neon/10 transition-colors ml-1"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5 text-foreground" /> : <Moon className="w-5 h-5 text-foreground" />}
                </button>
              )}
            </nav>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2.5 -mr-2 rounded-md text-foreground hover:bg-neon/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Toggle menu">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }} transition={{ type: 'tween', duration: 0.3 }} className="fixed inset-0 z-[60] md:hidden bg-background flex flex-col">
              <div className="flex items-center justify-between px-4 sm:px-6 h-16 sm:h-20 border-b border-border">
                <a href="#home" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                  <img src="/logo.png" alt="A-Star Infotech Logo" className="w-9 h-9 rounded-lg object-contain" />
                  <div className="flex flex-col"><span className="font-bold text-base leading-tight text-foreground">A-Star</span><span className="text-[10px] leading-tight font-medium tracking-wider uppercase text-neon">Infotech</span></div>
                </a>
                <button onClick={() => setMobileMenuOpen(false)} className="w-11 h-11 flex items-center justify-center rounded-lg text-foreground hover:bg-neon/10 transition-colors" aria-label="Close menu">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex-1 flex flex-col justify-center px-6">
                <div className="space-y-2">
                  {NAV_LINKS.map(link => <a key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block px-5 py-3.5 rounded-lg text-foreground text-lg font-medium hover:bg-neon/10 hover:text-neon transition-colors min-h-[44px] flex items-center">{link.label}</a>)}
                </div>
                <div className="mt-8">
                  <a href="#contact" onClick={() => setMobileMenuOpen(false)}><Button className="w-full glow-button bg-neon/20 hover:bg-neon/30 text-neon border border-neon/30 h-12 text-base">Get a Quote</Button></a>
                  <div className="flex gap-3 mt-4">
                    {mounted && (
                      <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg hover:bg-neon/10 transition-colors text-foreground"
                        aria-label="Toggle theme"
                      >
                        {theme === 'dark' ? <><Sun className="w-5 h-5" /><span className="text-sm font-medium">Light Mode</span></> : <><Moon className="w-5 h-5" /><span className="text-sm font-medium">Dark Mode</span></>}
                      </button>
                    )}
                  </div>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ─── Hero ─── */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-background">
        {/* Coding computer background image */}
        <div className="absolute inset-0">
          <img src="/coding-bg.png" alt="" className="w-full h-full object-cover object-center hero-bg-image" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 sm:via-background/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60 sm:to-background/40" />
        </div>
        <div className="absolute inset-0 hero-grid opacity-30" />
        <div className="absolute inset-0 scanline-overlay opacity-30" />
        <div className="absolute top-20 right-10 w-48 sm:w-72 h-48 sm:h-72 bg-neon/5 rounded-full blur-3xl animate-neon-pulse" />
        <div className="absolute bottom-20 left-10 w-64 sm:w-96 h-64 sm:h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 sm:py-32 lg:py-40">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Badge className="mb-4 sm:mb-6 bg-neon/10 text-neon border-neon/20 hover:bg-neon/20 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm"><Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 mr-1.5" />{siteSettings.heroBadge}</Badge>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight">
              {siteSettings.heroHeading}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mt-5 sm:mt-6 text-base sm:text-lg md:text-xl text-foreground/80 max-w-2xl leading-relaxed">
              {siteSettings.heroSubtitle}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a href="#contact" className="block"><Button size="lg" className="glow-button bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 sm:px-8 h-12 sm:h-13 text-sm sm:text-base shadow-lg shadow-amber-500/25 w-full sm:w-auto">Start Your Project<ArrowRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5" /></Button></a>
              <a href="#portfolio" className="block"><Button size="lg" variant="outline" className="border-foreground/20 text-foreground bg-foreground/5 hover:bg-foreground/10 hover:text-foreground hover:border-foreground/40 px-6 sm:px-8 h-12 sm:h-13 text-sm sm:text-base backdrop-blur-sm w-full sm:w-auto">View Our Work<ExternalLink className="ml-2 w-4 h-4" /></Button></a>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 sm:gap-8">
              {statItems.map(stat => (
                <div key={stat.label} className="text-center sm:text-left">
                  <div className="text-2xl sm:text-2xl md:text-3xl font-bold text-neon animate-neon-pulse">{stat.value}</div>
                  <div className="text-xs sm:text-xs md:text-sm text-muted-foreground mt-1 sm:mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:block">
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-6 h-10 border-2 border-neon/30 rounded-full flex items-start justify-center p-1.5">
            <motion.div className="w-1.5 h-1.5 bg-neon rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      <div className="section-divider" />

      {/* ─── About ─── */}
      <AnimatedSection id="about" className="py-16 sm:py-20 md:py-28 bg-background grid-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden border border-neon/20 shadow-xl shadow-neon/5">
                <img src="/about-image.png" alt="A-Star Infotech team collaborating" className="w-full h-auto object-cover max-w-full" />
              </div>
              <div className="absolute -bottom-4 sm:-bottom-6 right-2 sm:right-4 glass-card rounded-xl p-3 sm:p-5 border-neon/30">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-neon/10 border border-neon/20 flex items-center justify-center"><Award className="w-5 h-5 sm:w-6 sm:h-6 text-neon" /></div>
                  <div><div className="font-bold text-base sm:text-lg text-foreground">5+ Years</div><div className="text-xs sm:text-sm text-muted-foreground">Trusted Experience</div></div>
                </div>
              </div>
            </div>
            <div>
              <Badge variant="secondary" className="mb-4 bg-neon/10 text-neon border-neon/20">About Us</Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight">{siteSettings.aboutHeading}</h2>
              <p className="mt-4 sm:mt-5 text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed">{siteSettings.aboutDescription1}</p>
              <p className="mt-3 sm:mt-4 text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed">{siteSettings.aboutDescription2}</p>
              <div className="mt-6 sm:mt-8 grid sm:grid-cols-2 gap-3 sm:gap-4">
                <Card className="glass-card border-neon/20"><CardContent className="p-4 sm:p-5"><div className="flex items-center gap-2 mb-2"><Target className="w-5 h-5 text-neon" /><h3 className="font-semibold text-foreground text-sm sm:text-base">Our Vision</h3></div><p className="text-xs sm:text-sm text-muted-foreground">{siteSettings.aboutVision}</p></CardContent></Card>
                <Card className="glass-card border-amber-500/20"><CardContent className="p-4 sm:p-5"><div className="flex items-center gap-2 mb-2"><Rocket className="w-5 h-5 text-amber-400" /><h3 className="font-semibold text-foreground text-sm sm:text-base">Our Mission</h3></div><p className="text-xs sm:text-sm text-muted-foreground">{siteSettings.aboutMission}</p></CardContent></Card>
              </div>
              <div className="mt-4 sm:mt-6 flex flex-wrap gap-1.5 sm:gap-2">
                {siteSettings.aboutValues.split(',').map((v: string) => v.trim()).filter(Boolean).map((v: string) => <Badge key={v} variant="outline" className="px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm text-neon border-neon/30">{v}</Badge>)}
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <div className="section-divider" />

      {/* ─── Services ─── */}
      <AnimatedSection id="services" className="py-16 sm:py-20 md:py-28 bg-dark-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <Badge variant="secondary" className="mb-4 bg-neon/10 text-neon border-neon/20">Our Services</Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Everything You Need to <span className="gradient-text">Succeed Online</span></h2>
            <p className="mt-3 sm:mt-4 text-muted-foreground text-sm sm:text-base md:text-lg">From concept to launch and beyond, we provide comprehensive web solutions tailored to your business goals.</p>
          </div>
          <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {services.map((service, idx) => {
              const IconComp = ICON_MAP[service.icon] || Globe
              return (
                <motion.div key={service.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1, duration: 0.5 }}>
                  <Card className="group h-full glass-card neon-border border-border">
                    <CardContent className="p-4 sm:p-6 md:p-8">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${service.bg} flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform border border-border`}>
                        <IconComp className={`w-5 h-5 sm:w-6 sm:h-6 ${service.color}`} />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">{service.title}</h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{service.description}</p>
                      <a href="#contact" className="inline-flex items-center gap-1 mt-3 sm:mt-4 text-sm font-medium text-neon hover:text-neon/80 transition-colors min-h-[44px]">Learn More<ChevronRight className="w-4 h-4" /></a>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </AnimatedSection>

      <div className="section-divider" />

      {/* ─── Why Choose Us ─── */}
      <AnimatedSection className="py-16 sm:py-20 md:py-28 bg-background hex-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div>
              <Badge variant="secondary" className="mb-4 bg-amber-500/10 text-amber-400 border-amber-500/20">Why Choose Us</Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight">What Makes Us <span className="gradient-text">Stand Out</span></h2>
              <p className="mt-4 sm:mt-5 text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed">{siteSettings.whyChooseUsIntro}</p>
              <div className="mt-6 sm:mt-8 grid sm:grid-cols-2 gap-4 sm:gap-5">
                {WHY_CHOOSE_US.map((item, idx) => (
                  <motion.div key={item.title} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1, duration: 0.4 }} className="flex gap-3 sm:gap-4">
                    <div className="w-10 h-10 shrink-0 rounded-lg bg-neon/10 border border-neon/20 flex items-center justify-center"><item.icon className="w-5 h-5 text-neon" /></div>
                    <div><h3 className="font-semibold text-foreground text-sm sm:text-base">{item.title}</h3><p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">{item.description}</p></div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="glass-card rounded-2xl p-5 sm:p-8 md:p-12 border-neon/20">
                <div className="space-y-5 sm:space-y-6">
                  {[
                    { label: 'Client Satisfaction', value: 99 },
                    { label: 'On-Time Delivery', value: 97 },
                    { label: 'Code Quality', value: 95 },
                    { label: 'Support Response', value: 98 },
                  ].map((item, idx) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs sm:text-sm mb-2"><span className="font-medium text-foreground">{item.label}</span><span className="text-neon font-semibold">{item.value}%</span></div>
                      <div className="h-2 sm:h-2.5 bg-dark-card rounded-full overflow-hidden border border-border">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: `${item.value}%` }} viewport={{ once: true }} transition={{ delay: 0.3 + idx * 0.15, duration: 0.8, ease: 'easeOut' }} className="h-full bg-gradient-to-r from-neon to-cyan-400 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-16 h-16 sm:w-20 sm:h-20 bg-amber-500/20 border border-amber-500/30 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/10 rotate-6"><Users className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400" /></div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <div className="section-divider" />

      {/* ─── Portfolio ─── */}
      <AnimatedSection id="portfolio" className="py-16 sm:py-20 md:py-28 bg-dark-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <Badge variant="secondary" className="mb-4 bg-neon/10 text-neon border-neon/20">Our Portfolio</Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Projects That <span className="gradient-text">Speak for Themselves</span></h2>
            <p className="mt-3 sm:mt-4 text-muted-foreground text-sm sm:text-base md:text-lg">Explore some of our recent work and see how we&apos;ve helped businesses across industries achieve their digital goals.</p>
          </div>
          <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {portfolioItems.map((project, idx) => (
              <motion.div key={project.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1, duration: 0.5 }}>
                <Card className="group overflow-hidden glass-card neon-border border-border h-full">
                  <div className="h-36 sm:h-48 relative overflow-hidden">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4"><Badge className="bg-neon/20 text-neon border-neon/30 backdrop-blur-sm text-xs">{project.category}</Badge></div>
                    <h3 className="absolute bottom-3 left-4 sm:bottom-4 sm:left-6 text-base sm:text-xl font-bold text-foreground z-10">{project.title}</h3>
                  </div>
                  <CardContent className="p-4 sm:p-6">
                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{project.description}</p>
                    <div className="mt-3 sm:mt-4 flex flex-wrap gap-1 sm:gap-2">
                      {project.tech.split(',').map((t: string) => <Badge key={t.trim()} variant="secondary" className="text-[10px] sm:text-xs bg-neon/10 text-neon border-neon/20">{t.trim()}</Badge>)}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 sm:mt-12 text-center">
            <a href="#contact"><Button size="lg" variant="outline" className="border-neon/30 text-neon hover:bg-neon/10 min-h-[44px]">Discuss Your Project<ArrowRight className="ml-2 w-4 h-4" /></Button></a>
          </div>
        </div>
      </AnimatedSection>

      <div className="section-divider" />

      {/* ─── Testimonials ─── */}
      <AnimatedSection id="testimonials" className="py-16 sm:py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <Badge variant="secondary" className="mb-4 bg-amber-500/10 text-amber-400 border-amber-500/20">Testimonials</Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">What Our Clients <span className="gradient-text">Say About Us</span></h2>
            <p className="mt-3 sm:mt-4 text-muted-foreground text-sm sm:text-base md:text-lg">Don&apos;t just take our word for it — hear from the businesses we&apos;ve helped succeed.</p>
          </div>
          <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {testimonialItems.map((testimonial, idx) => (
              <motion.div key={testimonial.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1, duration: 0.5 }}>
                <Card className="h-full glass-card neon-border border-border">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex gap-0.5 mb-3 sm:mb-4">{Array.from({ length: testimonial.rating }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />)}</div>
                    <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm md:text-base italic">&ldquo;{testimonial.review}&rdquo;</p>
                    <div className="mt-4 sm:mt-5 flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neon/10 border border-neon/20 flex items-center justify-center text-neon font-semibold text-xs sm:text-sm">{testimonial.name.split(' ').map(n => n[0]).join('')}</div>
                      <div><div className="font-semibold text-foreground text-xs sm:text-sm">{testimonial.name}</div><div className="text-[11px] sm:text-xs text-muted-foreground">{testimonial.company}</div></div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ─── CTA Banner ─── */}
      <AnimatedSection className="py-12 sm:py-16 md:py-20 relative overflow-hidden bg-dark-surface">
        <div className="absolute inset-0 hero-grid opacity-50" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-48 sm:w-64 h-48 sm:h-64 bg-neon/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-36 sm:w-48 h-36 sm:h-48 bg-amber-500/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Ready to Take Your Business Online?</h2>
          <p className="mt-3 sm:mt-4 text-foreground/60 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">Let&apos;s build something amazing together. Get in touch today for a free consultation and discover how we can transform your digital presence.</p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <a href="#contact"><Button size="lg" className="glow-button bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 sm:px-8 h-12 sm:h-13 text-sm sm:text-base shadow-lg shadow-amber-500/25 min-h-[44px]">Get Free Consultation<ArrowRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5" /></Button></a>
            <a href="https://wa.me/918560074448" target="_blank" rel="noopener noreferrer"><Button size="lg" variant="outline" className="border-foreground/20 text-foreground bg-foreground/5 hover:bg-foreground/10 hover:text-foreground hover:border-foreground/40 px-6 sm:px-8 h-12 sm:h-13 text-sm sm:text-base backdrop-blur-sm min-h-[44px]"><MessageCircle className="mr-2 w-4 sm:w-5 h-4 sm:h-5" />Chat on WhatsApp</Button></a>
          </div>
        </div>
      </AnimatedSection>

      <div className="section-divider" />

      {/* ─── Contact ─── */}
      <AnimatedSection id="contact" className="py-16 sm:py-20 md:py-28 bg-background grid-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <Badge variant="secondary" className="mb-4 bg-neon/10 text-neon border-neon/20">Contact Us</Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Let&apos;s Start <span className="gradient-text">Your Project</span></h2>
            <p className="mt-3 sm:mt-4 text-muted-foreground text-sm sm:text-base md:text-lg">Have a project in mind? We&apos;d love to hear from you. Fill out the form below or reach us directly.</p>
          </div>
          <div className="mt-10 sm:mt-14 grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-10 lg:gap-12">
            <div className="lg:col-span-3 lg:self-start">
              <Card className="glass-card border-neon/20 shadow-lg shadow-neon/5">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6">Send Us a Message</h3>
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div className="space-y-2"><label htmlFor="name" className="text-sm font-medium text-foreground">Full Name <span className="text-red-400">*</span></label><Input id="name" placeholder="John Doe" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="futuristic-input h-11" /></div>
                      <div className="space-y-2"><label htmlFor="email" className="text-sm font-medium text-foreground">Email Address <span className="text-red-400">*</span></label><Input id="email" type="email" placeholder="john@example.com" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="futuristic-input h-11" /></div>
                    </div>
                    <div className="space-y-2"><label htmlFor="phone" className="text-sm font-medium text-foreground">Phone Number</label><Input id="phone" type="tel" placeholder="+91 0000000000" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="futuristic-input h-11" /></div>
                    <div className="space-y-2"><label htmlFor="message" className="text-sm font-medium text-foreground">Your Message <span className="text-red-400">*</span></label><Textarea id="message" placeholder="Tell us about your project..." rows={4} required value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="futuristic-input" /></div>
                    <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto glow-button bg-neon/20 hover:bg-neon/30 text-neon border border-neon/30 px-6 sm:px-8 min-h-[44px]">
                      {isSubmitting ? <><span className="animate-spin mr-2">⏳</span>Sending...</> : <>Send Message<Send className="ml-2 w-4 h-4" /></>}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <Card className="glass-card border-neon/20">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-5">Get In Touch</h3>
                  <div className="space-y-5 sm:space-y-5">
                    {[
                      { icon: MapPin, label: 'Office Address', value: siteSettings.address, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteSettings.address)}` },
                      { icon: Phone, label: 'Phone Number', value: siteSettings.phone, href: `tel:${siteSettings.phone}` },
                      { icon: Mail, label: 'Email', value: siteSettings.email, href: `mailto:${siteSettings.email}` },

                      { icon: Clock, label: 'Business Hours', value: siteSettings.hours, href: '' },
                    ].map((item, i) => (
                      <a key={i} href={item.href || undefined} target={item.href && item.href.startsWith('http') ? '_blank' : undefined} rel={item.href && item.href.startsWith('http') ? 'noopener noreferrer' : undefined} className="flex items-start gap-3 sm:gap-4 group min-h-[44px]">
                        <div className="w-11 h-11 shrink-0 rounded-lg bg-neon/10 border border-neon/20 flex items-center justify-center group-hover:bg-neon/20 group-hover:border-neon/30 transition-colors"><item.icon className="w-5 h-5 text-neon" /></div>
                        <div className="pt-1"><div className="font-medium text-foreground text-xs sm:text-sm">{item.label}</div><div className="text-xs sm:text-sm text-muted-foreground mt-0.5 group-hover:text-neon transition-colors break-words">{item.value}</div></div>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteSettings.address)}`} target="_blank" rel="noopener noreferrer" className="block">
                <Card className="glass-card border-neon/20 overflow-hidden hover:border-neon/40 transition-colors cursor-pointer group">
                  <div className="h-36 sm:h-48 bg-dark-surface flex items-center justify-center border border-border group-hover:bg-neon/5 transition-colors relative">
                    <div className="text-center"><MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-neon/40 mx-auto group-hover:text-neon group-hover:scale-110 transition-all" /><p className="text-xs sm:text-sm text-neon mt-2 font-medium">A-Star Infotech</p><p className="text-[11px] sm:text-xs text-muted-foreground">{siteSettings.address}</p><span className="inline-flex items-center gap-1 mt-2 text-[10px] sm:text-xs text-neon/60 group-hover:text-neon transition-colors">Open in Google Maps <ExternalLink className="w-3 h-3" /></span></div>
                  </div>
                </Card>
              </a>
              <Card className="glass-card border-neon/20">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-5">Follow Us</h3>
                  <div className="flex gap-3 flex-wrap">
                    {siteSettings.facebook && <a href={siteSettings.facebook} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 flex items-center justify-center transition-colors" aria-label="Facebook"><Facebook className="w-5 h-5 text-blue-400" /></a>}
                    {siteSettings.instagram && <a href={siteSettings.instagram} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-lg bg-pink-500/10 border border-pink-500/20 hover:bg-pink-500/20 flex items-center justify-center transition-colors" aria-label="Instagram"><Instagram className="w-5 h-5 text-pink-400" /></a>}
                    {siteSettings.linkedin && <a href={siteSettings.linkedin} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-lg bg-sky-500/10 border border-sky-500/20 hover:bg-sky-500/20 flex items-center justify-center transition-colors" aria-label="LinkedIn"><Linkedin className="w-5 h-5 text-sky-400" /></a>}
                    {siteSettings.youtube && <a href={siteSettings.youtube} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 flex items-center justify-center transition-colors" aria-label="YouTube"><Youtube className="w-5 h-5 text-red-400" /></a>}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ─── Footer ─── */}
      <footer className="bg-background border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 sm:py-12 lg:py-14 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
            {/* Company Info */}
            <div className="col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <img src="/logo.png" alt="A-Star Infotech Logo" className="w-10 h-10 rounded-lg object-contain" />
                <div>
                  <div className="font-bold text-foreground text-lg leading-tight">A-Star</div>
                  <div className="text-xs text-neon font-medium tracking-wider uppercase">Infotech</div>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">Building smart websites for growing businesses. Your trusted partner for all digital solutions.</p>
              <div className="mt-4 flex gap-2.5">
                {siteSettings.facebook && <a href={siteSettings.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-dark-card hover:bg-neon/10 border border-border hover:border-neon/30 flex items-center justify-center transition-all duration-200" aria-label="Facebook"><Facebook className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground hover:text-neon" /></a>}
                {siteSettings.instagram && <a href={siteSettings.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-dark-card hover:bg-neon/10 border border-border hover:border-neon/30 flex items-center justify-center transition-all duration-200" aria-label="Instagram"><Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground hover:text-neon" /></a>}
                {siteSettings.linkedin && <a href={siteSettings.linkedin} target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-dark-card hover:bg-neon/10 border border-border hover:border-neon/30 flex items-center justify-center transition-all duration-200" aria-label="LinkedIn"><Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground hover:text-neon" /></a>}
                {siteSettings.youtube && <a href={siteSettings.youtube} target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-dark-card hover:bg-neon/10 border border-border hover:border-neon/30 flex items-center justify-center transition-all duration-200" aria-label="YouTube"><Youtube className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground hover:text-neon" /></a>}
              </div>
            </div>
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-2.5 sm:mb-3 text-sm uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-1 sm:space-y-1.5">
                {NAV_LINKS.map(link => (
                  <li key={link.href}>
                    <a href={link.href} className="text-sm text-muted-foreground hover:text-neon transition-colors inline-flex items-center gap-2 group min-h-[28px] sm:min-h-[32px]">
                      <ChevronRight className="w-3 h-3 text-neon/0 group-hover:text-neon/60 transition-colors" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Our Services */}
            <div>
              <h4 className="font-semibold text-foreground mb-2.5 sm:mb-3 text-sm uppercase tracking-wider">Our Services</h4>
              <ul className="space-y-1 sm:space-y-1.5">
                {services.map(s => (
                  <li key={s.title}>
                    <a href="#services" className="text-sm text-muted-foreground hover:text-neon transition-colors inline-flex items-center gap-2 group min-h-[28px] sm:min-h-[32px]">
                      <ChevronRight className="w-3 h-3 text-neon/0 group-hover:text-neon/60 transition-colors" />
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Contact Info */}
            <div className="col-span-2 lg:col-span-1">
              <h4 className="font-semibold text-foreground mb-2.5 sm:mb-3 text-sm uppercase tracking-wider">Contact Info</h4>
              <ul className="space-y-2 sm:space-y-2.5">
                <li className="flex items-start gap-2.5">
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteSettings.address)}`} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2.5 group">
                    <div className="w-8 h-8 rounded-lg bg-neon/5 border border-border flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-neon/10 group-hover:border-neon/20 transition-colors">
                      <MapPin className="w-3.5 h-3.5 text-neon/60 group-hover:text-neon transition-colors" />
                    </div>
                    <span className="text-sm text-muted-foreground leading-relaxed pt-1 group-hover:text-neon transition-colors">{siteSettings.address}</span>
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-neon/5 border border-border flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5 text-neon/60" />
                  </div>
                  <a href={`tel:${siteSettings.phone}`} className="text-sm text-muted-foreground hover:text-neon transition-colors">{siteSettings.phone}</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-neon/5 border border-border flex items-center justify-center shrink-0">
                    <Mail className="w-3.5 h-3.5 text-neon/60" />
                  </div>
                  <div className="flex flex-col">
                    <a href={`mailto:${siteSettings.email}`} className="text-sm text-muted-foreground hover:text-neon transition-colors break-all">{siteSettings.email}</a>

                  </div>
                </li>
              </ul>
            </div>
          </div>
          {/* Bottom Bar */}
          <div className="border-t border-border py-4 sm:py-6 pb-20 sm:pb-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs sm:text-sm text-muted-foreground/70 text-center sm:text-left">&copy; {new Date().getFullYear()} A-Star Infotech. All rights reserved.</p>
            <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground/70">
              <button onClick={() => window.openLegal?.('privacy')} className="hover:text-neon transition-colors min-h-[36px] flex items-center">Privacy Policy</button>
              <span className="text-foreground/10 hidden sm:inline">|</span>
              <button onClick={() => window.openLegal?.('terms')} className="hover:text-neon transition-colors min-h-[36px] flex items-center">Terms of Service</button>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Button */}
      <a href="https://wa.me/918560074448?text=Hello%20A-Star%20Infotech!%20I%20am%20interested%20in%20your%20web%20development%20services." target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 whatsapp-pulse" aria-label="Chat on WhatsApp">
        <div className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:scale-110 transition-transform"><MessageCircle className="w-7 h-7 text-white" /></div>
      </a>

      <LegalModal contactInfo={{ address: siteSettings.address, phone: siteSettings.phone, email: siteSettings.email }} />

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} onClick={scrollToTop} className="fixed bottom-6 left-6 z-50 w-12 h-12 bg-neon/20 hover:bg-neon/30 text-neon border border-neon/30 rounded-full flex items-center justify-center shadow-lg shadow-neon/10 transition-colors" aria-label="Scroll to top">
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
