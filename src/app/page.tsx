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
  Eye,
  Trash2,
  Inbox,
  XCircle,
  Lock,
  LayoutDashboard,
  BarChart3,
  LogOut,
  Calendar,
  MailCheck,
  PhoneCall,
  Briefcase,
  Plus,
  Pencil,
  Wrench,
  Save,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

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

/* ── Icon map: maps string icon names from DB to React components ── */
const ICON_MAP: Record<string, React.ElementType> = {
  Globe, Code2, ShoppingCart, Smartphone, Settings, Search,
  Award, Zap, Shield, Heart, Target, Rocket, Star, Users,
  BarChart3, Briefcase, LayoutDashboard, Lock,
}

const DEFAULT_SERVICES = [
  { icon: 'Globe' as const, title: 'Website Design', description: 'Beautiful, modern designs that capture your brand identity and engage visitors from the first click.', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: 'Code2' as const, title: 'Website Development', description: 'Robust, scalable web applications built with the latest technologies for peak performance and reliability.', color: 'text-amber-600', bg: 'bg-amber-50' },
  { icon: 'ShoppingCart' as const, title: 'E-Commerce Development', description: 'Feature-rich online stores with secure payments, inventory management, and seamless shopping experiences.', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: 'Smartphone' as const, title: 'Responsive Websites', description: 'Websites that look stunning on every device — from desktop monitors to the smallest smartphones.', color: 'text-amber-600', bg: 'bg-amber-50' },
  { icon: 'Settings' as const, title: 'Website Maintenance', description: 'Ongoing support, updates, and optimization to keep your website running smoothly and securely.', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: 'Search' as const, title: 'SEO Services', description: 'Data-driven SEO strategies that boost your visibility and drive organic traffic to your website.', color: 'text-amber-600', bg: 'bg-amber-50' },
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
  email: 'karansinghmeertiya@gmail.com',
  hours: 'Mon – Sat: 10:00 AM – 7:00 PM',
  facebook: 'https://facebook.com/astarinfotech',
  instagram: 'https://instagram.com/astarinfotech',
  linkedin: 'https://linkedin.com/company/astarinfotech',
  youtube: 'https://youtube.com/@astarinfotech',
  brandColor: '#059669',
}

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
   Admin Panel Component (Enhanced)
   ──────────────────────────────────────────── */

type AdminTab = 'dashboard' | 'inquiries' | 'services' | 'portfolio' | 'testimonials' | 'statistics' | 'settings'

interface ContactItem {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  createdAt: string
}

interface ServiceItem {
  id: string
  title: string
  description: string
  icon: string
  color: string
  bgColor: string
  order: number
}

interface PortfolioItem {
  id: string
  title: string
  category: string
  description: string
  tech: string
  color: string
  image: string
  order: number
}

interface TestimonialItem {
  id: string
  name: string
  company: string
  review: string
  rating: number
  order: number
}

interface StatItem {
  id: string
  value: string
  label: string
  order: number
}

interface DashboardData {
  totalContacts: number
  totalServices: number
  totalPortfolio: number
  totalTestimonials: number
  todayContacts: number
  weekContacts: number
  monthContacts: number
  recentContacts: ContactItem[]
}

interface SiteSettings {
  companyName: string
  address: string
  phone: string
  email: string
  hours: string
  facebook: string
  instagram: string
  linkedin: string
  youtube: string
  brandColor: string
}

const TAB_CONFIG: { key: AdminTab; label: string; icon: React.ElementType }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'inquiries', label: 'Inquiries', icon: Inbox },
  { key: 'services', label: 'Services', icon: Globe },
  { key: 'portfolio', label: 'Portfolio', icon: Briefcase },
  { key: 'testimonials', label: 'Testimonials', icon: Star },
  { key: 'statistics', label: 'Statistics', icon: BarChart3 },
  { key: 'settings', label: 'Site Settings', icon: Wrench },
]

function AdminPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Data states
  const [contacts, setContacts] = useState<ContactItem[]>([])
  const [services, setServices] = useState<ServiceItem[]>([])
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([])
  const [stats, setStats] = useState<StatItem[]>([])
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    companyName: '',
    address: '',
    phone: '',
    email: '',
    hours: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    youtube: '',
    brandColor: '',
  })

  // Loading states
  const [contactsLoading, setContactsLoading] = useState(false)
  const [servicesLoading, setServicesLoading] = useState(false)
  const [portfolioLoading, setPortfolioLoading] = useState(false)
  const [testimonialsLoading, setTestimonialsLoading] = useState(false)
  const [statsLoading, setStatsLoading] = useState(false)
  const [dashboardLoading, setDashboardLoading] = useState(false)
  const [settingsLoading, setSettingsLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Delete states
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Dialog states
  const [serviceDialog, setServiceDialog] = useState<{ open: boolean; mode: 'add' | 'edit'; item: ServiceItem | null }>({ open: false, mode: 'add', item: null })
  const [portfolioDialog, setPortfolioDialog] = useState<{ open: boolean; mode: 'add' | 'edit'; item: PortfolioItem | null }>({ open: false, mode: 'add', item: null })
  const [testimonialDialog, setTestimonialDialog] = useState<{ open: boolean; mode: 'add' | 'edit'; item: TestimonialItem | null }>({ open: false, mode: 'add', item: null })
  const [statDialog, setStatDialog] = useState<{ open: boolean; mode: 'add' | 'edit'; item: StatItem | null }>({ open: false, mode: 'add', item: null })

  // Form states
  const [serviceForm, setServiceForm] = useState({ title: '', description: '', icon: '', color: '', bgColor: '', order: 0 })
  const [portfolioForm, setPortfolioForm] = useState({ title: '', category: '', description: '', tech: '', color: '', image: '', order: 0 })
  const [testimonialForm, setTestimonialForm] = useState({ name: '', company: '', review: '', rating: 5, order: 0 })
  const [statForm, setStatForm] = useState({ value: '', label: '', order: 0 })

  // Check sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem('admin_auth')
    if (saved === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  // Fetch data when tab changes
  useEffect(() => {
    if (!isOpen || !isAuthenticated) return
    if (activeTab === 'dashboard') fetchDashboard()
    if (activeTab === 'inquiries') fetchContacts()
    if (activeTab === 'services') fetchServices()
    if (activeTab === 'portfolio') fetchPortfolio()
    if (activeTab === 'testimonials') fetchTestimonials()
    if (activeTab === 'statistics') { fetchDashboard(); fetchStats() }
    if (activeTab === 'settings') fetchSettings()
  }, [isOpen, isAuthenticated, activeTab])

  // ─── Auth ───
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    if (!password.trim()) return
    setAuthLoading(true)
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setIsAuthenticated(true)
        sessionStorage.setItem('admin_auth', 'true')
        setPassword('')
        toast.success('Login Successful', { description: 'Welcome to the Admin Panel!' })
      } else {
        toast.error('Login Failed', { description: data.error || 'Invalid password.' })
      }
    } catch {
      toast.error('Error', { description: 'Failed to connect to server.' })
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem('admin_auth')
    setIsOpen(false)
    setActiveTab('dashboard')
    setSidebarOpen(false)
    setContacts([])
    setServices([])
    setPortfolio([])
    setTestimonials([])
    setStats([])
    setDashboard(null)
    toast.success('Logged Out', { description: 'You have been logged out successfully.' })
  }

  // ─── Fetch Functions ───
  const fetchDashboard = async () => {
    setDashboardLoading(true)
    try {
      const res = await fetch('/api/dashboard')
      const data = await res.json()
      setDashboard(data)
    } catch {
      toast.error('Error', { description: 'Failed to fetch dashboard data.' })
    } finally {
      setDashboardLoading(false)
    }
  }

  const fetchContacts = async () => {
    setContactsLoading(true)
    try {
      const res = await fetch('/api/contacts')
      const data = await res.json()
      setContacts(data.contacts || [])
    } catch {
      toast.error('Error', { description: 'Failed to fetch contacts.' })
    } finally {
      setContactsLoading(false)
    }
  }

  const fetchServices = async () => {
    setServicesLoading(true)
    try {
      const res = await fetch('/api/services')
      const data = await res.json()
      setServices(data.services || [])
    } catch {
      toast.error('Error', { description: 'Failed to fetch services.' })
    } finally {
      setServicesLoading(false)
    }
  }

  const fetchPortfolio = async () => {
    setPortfolioLoading(true)
    try {
      const res = await fetch('/api/portfolio')
      const data = await res.json()
      setPortfolio(data.portfolio || [])
    } catch {
      toast.error('Error', { description: 'Failed to fetch portfolio.' })
    } finally {
      setPortfolioLoading(false)
    }
  }

  const fetchTestimonials = async () => {
    setTestimonialsLoading(true)
    try {
      const res = await fetch('/api/testimonials')
      const data = await res.json()
      setTestimonials(data.testimonials || [])
    } catch {
      toast.error('Error', { description: 'Failed to fetch testimonials.' })
    } finally {
      setTestimonialsLoading(false)
    }
  }

  const fetchStats = async () => {
    setStatsLoading(true)
    try {
      const res = await fetch('/api/stats')
      const data = await res.json()
      setStats(data.stats || [])
    } catch {
      toast.error('Error', { description: 'Failed to fetch stats.' })
    } finally {
      setStatsLoading(false)
    }
  }

  const fetchSettings = async () => {
    setSettingsLoading(true)
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      if (data.settings) {
        setSiteSettings({
          companyName: data.settings.companyName || '',
          address: data.settings.address || '',
          phone: data.settings.phone || '',
          email: data.settings.email || '',
          hours: data.settings.hours || '',
          facebook: data.settings.facebook || '',
          instagram: data.settings.instagram || '',
          linkedin: data.settings.linkedin || '',
          youtube: data.settings.youtube || '',
          brandColor: data.settings.brandColor || '',
        })
      }
    } catch {
      toast.error('Error', { description: 'Failed to fetch settings.' })
    } finally {
      setSettingsLoading(false)
    }
  }

  // ─── Delete Contact ───
  const handleDeleteContact = async (id: string) => {
    setDeletingId(id)
    try {
      const res = await fetch('/api/contacts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        setContacts((prev) => prev.filter((c) => c.id !== id))
        toast.success('Deleted', { description: 'Contact has been deleted.' })
      } else {
        const data = await res.json()
        toast.error('Error', { description: data.error || 'Failed to delete.' })
      }
    } catch {
      toast.error('Error', { description: 'Failed to delete contact.' })
    } finally {
      setDeletingId(null)
    }
  }

  // ─── Generic CRUD helpers ───
  const apiCall = async (url: string, method: string, body?: unknown) => {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Request failed')
    return data
  }

  // ─── Services CRUD ───
  const openServiceDialog = (mode: 'add' | 'edit', item?: ServiceItem) => {
    if (mode === 'edit' && item) {
      setServiceForm({ title: item.title, description: item.description, icon: item.icon, color: item.color, bgColor: item.bgColor, order: item.order })
      setServiceDialog({ open: true, mode: 'edit', item })
    } else {
      setServiceForm({ title: '', description: '', icon: 'Globe', color: 'text-emerald-600', bgColor: 'bg-emerald-50', order: services.length })
      setServiceDialog({ open: true, mode: 'add', item: null })
    }
  }

  const handleSaveService = async () => {
    setSaving(true)
    try {
      if (serviceDialog.mode === 'add') {
        await apiCall('/api/services', 'POST', serviceForm)
        toast.success('Service Added', { description: 'New service has been created.' })
      } else {
        await apiCall('/api/services', 'PUT', { id: serviceDialog.item?.id, ...serviceForm })
        toast.success('Service Updated', { description: 'Service has been updated.' })
      }
      setServiceDialog({ open: false, mode: 'add', item: null })
      fetchServices()
    } catch (err) {
      toast.error('Error', { description: err instanceof Error ? err.message : 'Failed to save service.' })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteService = async (id: string) => {
    setDeletingId(id)
    try {
      await apiCall('/api/services', 'DELETE', { id })
      setServices((prev) => prev.filter((s) => s.id !== id))
      toast.success('Deleted', { description: 'Service has been deleted.' })
    } catch (err) {
      toast.error('Error', { description: err instanceof Error ? err.message : 'Failed to delete.' })
    } finally {
      setDeletingId(null)
    }
  }

  // ─── Portfolio CRUD ───
  const openPortfolioDialog = (mode: 'add' | 'edit', item?: PortfolioItem) => {
    if (mode === 'edit' && item) {
      setPortfolioForm({ title: item.title, category: item.category, description: item.description, tech: item.tech, color: item.color, image: item.image, order: item.order })
      setPortfolioDialog({ open: true, mode: 'edit', item })
    } else {
      setPortfolioForm({ title: '', category: '', description: '', tech: '', color: 'from-emerald-500 to-emerald-700', image: '', order: portfolio.length })
      setPortfolioDialog({ open: true, mode: 'add', item: null })
    }
  }

  const handleSavePortfolio = async () => {
    setSaving(true)
    try {
      if (portfolioDialog.mode === 'add') {
        await apiCall('/api/portfolio', 'POST', portfolioForm)
        toast.success('Portfolio Item Added', { description: 'New portfolio item has been created.' })
      } else {
        await apiCall('/api/portfolio', 'PUT', { id: portfolioDialog.item?.id, ...portfolioForm })
        toast.success('Portfolio Updated', { description: 'Portfolio item has been updated.' })
      }
      setPortfolioDialog({ open: false, mode: 'add', item: null })
      fetchPortfolio()
    } catch (err) {
      toast.error('Error', { description: err instanceof Error ? err.message : 'Failed to save portfolio item.' })
    } finally {
      setSaving(false)
    }
  }

  const handleDeletePortfolio = async (id: string) => {
    setDeletingId(id)
    try {
      await apiCall('/api/portfolio', 'DELETE', { id })
      setPortfolio((prev) => prev.filter((p) => p.id !== id))
      toast.success('Deleted', { description: 'Portfolio item has been deleted.' })
    } catch (err) {
      toast.error('Error', { description: err instanceof Error ? err.message : 'Failed to delete.' })
    } finally {
      setDeletingId(null)
    }
  }

  // ─── Testimonials CRUD ───
  const openTestimonialDialog = (mode: 'add' | 'edit', item?: TestimonialItem) => {
    if (mode === 'edit' && item) {
      setTestimonialForm({ name: item.name, company: item.company, review: item.review, rating: item.rating, order: item.order })
      setTestimonialDialog({ open: true, mode: 'edit', item })
    } else {
      setTestimonialForm({ name: '', company: '', review: '', rating: 5, order: testimonials.length })
      setTestimonialDialog({ open: true, mode: 'add', item: null })
    }
  }

  const handleSaveTestimonial = async () => {
    setSaving(true)
    try {
      if (testimonialDialog.mode === 'add') {
        await apiCall('/api/testimonials', 'POST', testimonialForm)
        toast.success('Testimonial Added', { description: 'New testimonial has been created.' })
      } else {
        await apiCall('/api/testimonials', 'PUT', { id: testimonialDialog.item?.id, ...testimonialForm })
        toast.success('Testimonial Updated', { description: 'Testimonial has been updated.' })
      }
      setTestimonialDialog({ open: false, mode: 'add', item: null })
      fetchTestimonials()
    } catch (err) {
      toast.error('Error', { description: err instanceof Error ? err.message : 'Failed to save testimonial.' })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteTestimonial = async (id: string) => {
    setDeletingId(id)
    try {
      await apiCall('/api/testimonials', 'DELETE', { id })
      setTestimonials((prev) => prev.filter((t) => t.id !== id))
      toast.success('Deleted', { description: 'Testimonial has been deleted.' })
    } catch (err) {
      toast.error('Error', { description: err instanceof Error ? err.message : 'Failed to delete.' })
    } finally {
      setDeletingId(null)
    }
  }

  // ─── Stats CRUD ───
  const openStatDialog = (mode: 'add' | 'edit', item?: StatItem) => {
    if (mode === 'edit' && item) {
      setStatForm({ value: item.value, label: item.label, order: item.order })
      setStatDialog({ open: true, mode: 'edit', item })
    } else {
      setStatForm({ value: '', label: '', order: stats.length })
      setStatDialog({ open: true, mode: 'add', item: null })
    }
  }

  const handleSaveStat = async () => {
    setSaving(true)
    try {
      if (statDialog.mode === 'add') {
        await apiCall('/api/stats', 'POST', statForm)
        toast.success('Stat Added', { description: 'New stat has been created.' })
      } else {
        await apiCall('/api/stats', 'PUT', { id: statDialog.item?.id, ...statForm })
        toast.success('Stat Updated', { description: 'Stat has been updated.' })
      }
      setStatDialog({ open: false, mode: 'add', item: null })
      fetchStats()
    } catch (err) {
      toast.error('Error', { description: err instanceof Error ? err.message : 'Failed to save stat.' })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteStat = async (id: string) => {
    setDeletingId(id)
    try {
      await apiCall('/api/stats', 'DELETE', { id })
      setStats((prev) => prev.filter((s) => s.id !== id))
      toast.success('Deleted', { description: 'Stat has been deleted.' })
    } catch (err) {
      toast.error('Error', { description: err instanceof Error ? err.message : 'Failed to delete.' })
    } finally {
      setDeletingId(null)
    }
  }

  // ─── Save Settings ───
  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      await apiCall('/api/settings', 'PUT', { settings: siteSettings })
      toast.success('Settings Saved', { description: 'Business information has been updated.' })
    } catch (err) {
      toast.error('Error', { description: err instanceof Error ? err.message : 'Failed to save settings.' })
    } finally {
      setSaving(false)
    }
  }

  // ─── Floating trigger button ───
  const triggerButton = (
    <button
      onClick={() => setIsOpen(true)}
      className="fixed bottom-6 left-20 z-50 w-12 h-12 bg-gray-800 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
      aria-label="Admin Panel"
      title="Admin Panel"
    >
      <Lock className="w-5 h-5" />
    </button>
  )

  if (!isOpen) return triggerButton

  // ─── Login Screen ───
  if (!isAuthenticated) {
    return (
      <>
        {triggerButton}
        <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 flex items-center justify-center p-4">
          <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl" />
          <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl border-0 relative">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Admin Panel</h2>
                <p className="text-sm text-muted-foreground mt-1">A-Star Infotech</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="admin-password" className="text-sm font-medium text-foreground">
                    Password
                  </label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoFocus
                    disabled={authLoading}
                    className="h-11"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-11"
                  disabled={authLoading || !password.trim()}
                >
                  {authLoading ? (
                    <>
                      <span className="animate-spin mr-2 inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Login
                    </>
                  )}
                </Button>
              </form>
              <Button
                variant="ghost"
                className="w-full mt-3 text-muted-foreground"
                onClick={() => { setIsOpen(false); setPassword('') }}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  // ─── Helper: Loading Spinner ───
  const Spinner = () => (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full" />
    </div>
  )

  // ─── Helper: Section header ───
  const SectionHeader = ({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) => (
    <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div>
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      </div>
      {action}
    </div>
  )

  // ─── Admin Dashboard ───
  return (
    <>
      <div className="fixed inset-0 z-[9999] bg-white flex">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-emerald-900 to-emerald-950 text-white flex flex-col shrink-0 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          {/* Sidebar Header */}
          <div className="p-5 border-b border-emerald-800/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-700 rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm">A-Star Infotech</div>
                <div className="text-xs text-emerald-400">Admin Panel</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {TAB_CONFIG.map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setSidebarOpen(false) }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-emerald-700/60 text-white shadow-sm'
                    : 'text-emerald-200/70 hover:bg-emerald-800/40 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
                {tab.key === 'inquiries' && dashboard && dashboard.totalContacts > 0 && (
                  <Badge className="ml-auto bg-emerald-500/30 text-emerald-200 border-0 text-xs px-1.5 py-0.5 min-w-[20px] text-center">
                    {dashboard.totalContacts}
                  </Badge>
                )}
              </button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-emerald-800/50 space-y-1">
            <button
              onClick={() => { setIsOpen(false); setSidebarOpen(false) }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-emerald-200/70 hover:bg-emerald-800/40 hover:text-white transition-colors"
            >
              <Eye className="w-5 h-5" />
              View Website
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-300/80 hover:bg-red-900/30 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <header className="h-16 border-b border-border bg-white shrink-0 flex items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
                aria-label="Open sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-semibold text-foreground capitalize">{activeTab === 'inquiries' ? 'Inquiries' : activeTab}</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hidden sm:flex"
              >
                <Eye className="w-4 h-4 mr-1.5" />
                View Website
              </Button>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/30">

            {/* ─── Dashboard Tab ─── */}
            {activeTab === 'dashboard' && (
              <div>
                <SectionHeader title="Dashboard" subtitle="Overview of your website activity" />
                {dashboardLoading ? <Spinner /> : (
                  <>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <Card className="border-border/50">
                        <CardContent className="p-4 md:p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs md:text-sm text-muted-foreground">Total Contacts</p>
                              <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">{dashboard?.totalContacts ?? 0}</p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                              <Users className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-border/50">
                        <CardContent className="p-4 md:p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs md:text-sm text-muted-foreground">Today</p>
                              <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">{dashboard?.todayContacts ?? 0}</p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                              <Calendar className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-border/50">
                        <CardContent className="p-4 md:p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs md:text-sm text-muted-foreground">This Week</p>
                              <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">{dashboard?.weekContacts ?? 0}</p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                              <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-border/50">
                        <CardContent className="p-4 md:p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs md:text-sm text-muted-foreground">This Month</p>
                              <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">{dashboard?.monthContacts ?? 0}</p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                              <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      <Card className="border-border/50">
                        <CardContent className="p-4 md:p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs md:text-sm text-muted-foreground">Services</p>
                              <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">{dashboard?.totalServices ?? 0}</p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                              <Globe className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-border/50">
                        <CardContent className="p-4 md:p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs md:text-sm text-muted-foreground">Portfolio</p>
                              <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">{dashboard?.totalPortfolio ?? 0}</p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                              <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-border/50 col-span-2 lg:col-span-1">
                        <CardContent className="p-4 md:p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs md:text-sm text-muted-foreground">Testimonials</p>
                              <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">{dashboard?.totalTestimonials ?? 0}</p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                              <Star className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Recent Contacts */}
                    <Card className="border-border/50 mb-6">
                      <CardContent className="p-4 md:p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Contacts</h3>
                        {!dashboard?.recentContacts || dashboard.recentContacts.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-8">No contact activity yet</p>
                        ) : (
                          <div className="space-y-3 max-h-64 overflow-y-auto">
                            {dashboard.recentContacts.map((contact) => (
                              <div key={contact.id} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold text-xs shrink-0">
                                  {contact.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground truncate">{contact.name}</p>
                                  <p className="text-xs text-muted-foreground truncate">{contact.email}</p>
                                </div>
                                <p className="text-xs text-muted-foreground shrink-0">
                                  {new Date(contact.createdAt).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short' })}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="border-border/50">
                      <CardContent className="p-4 md:p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {[
                            { label: 'View Inquiries', icon: Inbox, tab: 'inquiries' as AdminTab },
                            { label: 'Manage Services', icon: Globe, tab: 'services' as AdminTab },
                            { label: 'Manage Portfolio', icon: Briefcase, tab: 'portfolio' as AdminTab },
                            { label: 'Edit Settings', icon: Wrench, tab: 'settings' as AdminTab },
                          ].map((action) => (
                            <button
                              key={action.tab}
                              onClick={() => setActiveTab(action.tab)}
                              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border/50 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all duration-200"
                            >
                              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                                <action.icon className="w-5 h-5 text-emerald-600" />
                              </div>
                              <span className="text-xs font-medium text-foreground text-center">{action.label}</span>
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            )}

            {/* ─── Inquiries Tab ─── */}
            {activeTab === 'inquiries' && (
              <div>
                <SectionHeader
                  title="Contact Submissions"
                  subtitle="Manage all contact form inquiries"
                  action={
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchContacts}
                      disabled={contactsLoading}
                      className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    >
                      {contactsLoading ? (
                        <span className="animate-spin mr-1.5 inline-block w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full" />
                      ) : null}
                      Refresh
                    </Button>
                  }
                />

                {contactsLoading ? <Spinner /> : contacts.length === 0 ? (
                  <div className="text-center py-20">
                    <Inbox className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground">No contacts yet</h3>
                    <p className="text-sm text-muted-foreground/70 mt-1">Contact form submissions will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
                    {contacts.map((contact) => (
                      <Card key={contact.id} className="border-border/50 hover:border-emerald-200 transition-colors">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold text-xs shrink-0">
                                  {contact.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                                </div>
                                <span className="font-semibold text-foreground">{contact.name}</span>
                                {contact.phone && (
                                  <a
                                    href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full"
                                  >
                                    <MessageCircle className="w-3 h-3" />
                                    WhatsApp
                                  </a>
                                )}
                              </div>
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground ml-11">
                                <span className="flex items-center gap-1">
                                  <MailCheck className="w-3.5 h-3.5" />
                                  <a href={`mailto:${contact.email}`} className="hover:text-emerald-600 transition-colors">{contact.email}</a>
                                </span>
                                {contact.phone && (
                                  <span className="flex items-center gap-1">
                                    <PhoneCall className="w-3.5 h-3.5" />
                                    {contact.phone}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {new Date(contact.createdAt).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                              </div>
                              <p className="mt-3 text-sm text-foreground/80 bg-muted/50 rounded-lg p-3 ml-11 leading-relaxed">
                                {contact.message}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteContact(contact.id)}
                              disabled={deletingId === contact.id}
                              className="text-red-400 hover:text-red-600 hover:bg-red-50 shrink-0"
                            >
                              {deletingId === contact.id ? (
                                <span className="animate-spin inline-block w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─── Services Tab ─── */}
            {activeTab === 'services' && (
              <div>
                <SectionHeader
                  title="Services"
                  subtitle="Manage your service offerings"
                  action={
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => openServiceDialog('add')}
                    >
                      <Plus className="w-4 h-4 mr-1.5" />
                      Add Service
                    </Button>
                  }
                />

                {servicesLoading ? <Spinner /> : services.length === 0 ? (
                  <div className="text-center py-20">
                    <Globe className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground">No services yet</h3>
                    <p className="text-sm text-muted-foreground/70 mt-1">Add your first service item</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
                    {services.sort((a, b) => a.order - b.order).map((service) => (
                      <Card key={service.id} className="border-border/50 hover:border-emerald-200 transition-colors">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl ${service.bgColor} flex items-center justify-center shrink-0`}>
                                  <Globe className={`w-5 h-5 ${service.color}`} />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-foreground">{service.title}</h3>
                                  <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{service.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 mt-2 ml-13 text-xs text-muted-foreground">
                                <Badge variant="secondary" className="text-xs bg-emerald-50 text-emerald-700">Icon: {service.icon}</Badge>
                                <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground">Order: {service.order}</Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openServiceDialog('edit', service)}
                                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteService(service.id)}
                                disabled={deletingId === service.id}
                                className="text-red-400 hover:text-red-600 hover:bg-red-50"
                              >
                                {deletingId === service.id ? (
                                  <span className="animate-spin inline-block w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Service Dialog */}
                <Dialog open={serviceDialog.open} onOpenChange={(open) => setServiceDialog((prev) => ({ ...prev, open }))}>
                  <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{serviceDialog.mode === 'add' ? 'Add Service' : 'Edit Service'}</DialogTitle>
                      <DialogDescription>
                        {serviceDialog.mode === 'add' ? 'Create a new service item.' : 'Update the service details.'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="space-y-2">
                        <Label htmlFor="svc-title">Title</Label>
                        <Input id="svc-title" value={serviceForm.title} onChange={(e) => setServiceForm((p) => ({ ...p, title: e.target.value }))} placeholder="Service title" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="svc-desc">Description</Label>
                        <Textarea id="svc-desc" value={serviceForm.description} onChange={(e) => setServiceForm((p) => ({ ...p, description: e.target.value }))} placeholder="Service description" rows={3} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="svc-icon">Icon Name</Label>
                          <Input id="svc-icon" value={serviceForm.icon} onChange={(e) => setServiceForm((p) => ({ ...p, icon: e.target.value }))} placeholder="Globe" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="svc-order">Order</Label>
                          <Input id="svc-order" type="number" value={serviceForm.order} onChange={(e) => setServiceForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="svc-color">Color Class</Label>
                          <Input id="svc-color" value={serviceForm.color} onChange={(e) => setServiceForm((p) => ({ ...p, color: e.target.value }))} placeholder="text-emerald-600" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="svc-bg">Background Class</Label>
                          <Input id="svc-bg" value={serviceForm.bgColor} onChange={(e) => setServiceForm((p) => ({ ...p, bgColor: e.target.value }))} placeholder="bg-emerald-50" />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setServiceDialog((prev) => ({ ...prev, open: false }))}>Cancel</Button>
                      <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSaveService} disabled={saving || !serviceForm.title.trim()}>
                        {saving ? <span className="animate-spin mr-2 inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : null}
                        {serviceDialog.mode === 'add' ? 'Add Service' : 'Save Changes'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {/* ─── Portfolio Tab ─── */}
            {activeTab === 'portfolio' && (
              <div>
                <SectionHeader
                  title="Portfolio"
                  subtitle="Manage your portfolio items"
                  action={
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => openPortfolioDialog('add')}
                    >
                      <Plus className="w-4 h-4 mr-1.5" />
                      Add Portfolio Item
                    </Button>
                  }
                />

                {portfolioLoading ? <Spinner /> : portfolio.length === 0 ? (
                  <div className="text-center py-20">
                    <Briefcase className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground">No portfolio items yet</h3>
                    <p className="text-sm text-muted-foreground/70 mt-1">Add your first portfolio item</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
                    {portfolio.sort((a, b) => a.order - b.order).map((item) => (
                      <Card key={item.id} className="border-border/50 hover:border-emerald-200 transition-colors overflow-hidden">
                        <div className={`h-24 bg-gradient-to-r ${item.color} flex items-end p-4 relative`}>
                          {item.image && (
                            <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover opacity-30" />
                          )}
                          <div className="relative z-10">
                            <Badge className="bg-white/20 text-white border-0 text-xs mb-1">{item.category}</Badge>
                            <h3 className="font-bold text-white text-sm">{item.title}</h3>
                          </div>
                          <div className="absolute top-2 right-2 flex gap-1 z-10">
                            <button
                              onClick={() => openPortfolioDialog('edit', item)}
                              className="w-7 h-7 rounded-md bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeletePortfolio(item.id)}
                              disabled={deletingId === item.id}
                              className="w-7 h-7 rounded-md bg-red-500/30 hover:bg-red-500/60 flex items-center justify-center text-white transition-colors"
                            >
                              {deletingId === item.id ? (
                                <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                          {item.tech && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {item.tech.split(',').map((t) => (
                                <Badge key={t.trim()} variant="secondary" className="text-xs bg-emerald-50 text-emerald-700">{t.trim()}</Badge>
                              ))}
                            </div>
                          )}
                          <div className="mt-2 text-xs text-muted-foreground">Order: {item.order}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Portfolio Dialog */}
                <Dialog open={portfolioDialog.open} onOpenChange={(open) => setPortfolioDialog((prev) => ({ ...prev, open }))}>
                  <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{portfolioDialog.mode === 'add' ? 'Add Portfolio Item' : 'Edit Portfolio Item'}</DialogTitle>
                      <DialogDescription>
                        {portfolioDialog.mode === 'add' ? 'Create a new portfolio item.' : 'Update the portfolio item.'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="pf-title">Title</Label>
                          <Input id="pf-title" value={portfolioForm.title} onChange={(e) => setPortfolioForm((p) => ({ ...p, title: e.target.value }))} placeholder="Project title" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pf-category">Category</Label>
                          <Input id="pf-category" value={portfolioForm.category} onChange={(e) => setPortfolioForm((p) => ({ ...p, category: e.target.value }))} placeholder="E-Commerce" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pf-desc">Description</Label>
                        <Textarea id="pf-desc" value={portfolioForm.description} onChange={(e) => setPortfolioForm((p) => ({ ...p, description: e.target.value }))} placeholder="Project description" rows={3} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="pf-tech">Tech (comma-separated)</Label>
                          <Input id="pf-tech" value={portfolioForm.tech} onChange={(e) => setPortfolioForm((p) => ({ ...p, tech: e.target.value }))} placeholder="Next.js, React, Node.js" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pf-image">Image URL</Label>
                          <Input id="pf-image" value={portfolioForm.image} onChange={(e) => setPortfolioForm((p) => ({ ...p, image: e.target.value }))} placeholder="/portfolio-image.png" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="pf-color">Gradient Class</Label>
                          <Input id="pf-color" value={portfolioForm.color} onChange={(e) => setPortfolioForm((p) => ({ ...p, color: e.target.value }))} placeholder="from-emerald-500 to-emerald-700" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pf-order">Order</Label>
                          <Input id="pf-order" type="number" value={portfolioForm.order} onChange={(e) => setPortfolioForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))} />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setPortfolioDialog((prev) => ({ ...prev, open: false }))}>Cancel</Button>
                      <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSavePortfolio} disabled={saving || !portfolioForm.title.trim()}>
                        {saving ? <span className="animate-spin mr-2 inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : null}
                        {portfolioDialog.mode === 'add' ? 'Add Item' : 'Save Changes'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {/* ─── Testimonials Tab ─── */}
            {activeTab === 'testimonials' && (
              <div>
                <SectionHeader
                  title="Testimonials"
                  subtitle="Manage client testimonials"
                  action={
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => openTestimonialDialog('add')}
                    >
                      <Plus className="w-4 h-4 mr-1.5" />
                      Add Testimonial
                    </Button>
                  }
                />

                {testimonialsLoading ? <Spinner /> : testimonials.length === 0 ? (
                  <div className="text-center py-20">
                    <Star className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground">No testimonials yet</h3>
                    <p className="text-sm text-muted-foreground/70 mt-1">Add your first testimonial</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
                    {testimonials.sort((a, b) => a.order - b.order).map((item) => (
                      <Card key={item.id} className="border-border/50 hover:border-emerald-200 transition-colors">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold text-xs shrink-0">
                                  {item.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <span className="font-semibold text-foreground">{item.name}</span>
                                  <span className="text-sm text-muted-foreground ml-2">{item.company}</span>
                                </div>
                              </div>
                              <div className="flex gap-0.5 mb-2">
                                {Array.from({ length: item.rating }).map((_, i) => (
                                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                ))}
                              </div>
                              <p className="text-sm text-muted-foreground italic line-clamp-3">&ldquo;{item.review}&rdquo;</p>
                              <div className="mt-2 text-xs text-muted-foreground">Order: {item.order}</div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openTestimonialDialog('edit', item)}
                                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteTestimonial(item.id)}
                                disabled={deletingId === item.id}
                                className="text-red-400 hover:text-red-600 hover:bg-red-50"
                              >
                                {deletingId === item.id ? (
                                  <span className="animate-spin inline-block w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Testimonial Dialog */}
                <Dialog open={testimonialDialog.open} onOpenChange={(open) => setTestimonialDialog((prev) => ({ ...prev, open }))}>
                  <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{testimonialDialog.mode === 'add' ? 'Add Testimonial' : 'Edit Testimonial'}</DialogTitle>
                      <DialogDescription>
                        {testimonialDialog.mode === 'add' ? 'Create a new testimonial.' : 'Update the testimonial.'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="tm-name">Name</Label>
                          <Input id="tm-name" value={testimonialForm.name} onChange={(e) => setTestimonialForm((p) => ({ ...p, name: e.target.value }))} placeholder="Client name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tm-company">Company</Label>
                          <Input id="tm-company" value={testimonialForm.company} onChange={(e) => setTestimonialForm((p) => ({ ...p, company: e.target.value }))} placeholder="Company name" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tm-review">Review</Label>
                        <Textarea id="tm-review" value={testimonialForm.review} onChange={(e) => setTestimonialForm((p) => ({ ...p, review: e.target.value }))} placeholder="Client review text" rows={4} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="tm-rating">Rating (1-5)</Label>
                          <Input id="tm-rating" type="number" min={1} max={5} value={testimonialForm.rating} onChange={(e) => setTestimonialForm((p) => ({ ...p, rating: parseInt(e.target.value) || 5 }))} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tm-order">Order</Label>
                          <Input id="tm-order" type="number" value={testimonialForm.order} onChange={(e) => setTestimonialForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))} />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setTestimonialDialog((prev) => ({ ...prev, open: false }))}>Cancel</Button>
                      <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSaveTestimonial} disabled={saving || !testimonialForm.name.trim()}>
                        {saving ? <span className="animate-spin mr-2 inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : null}
                        {testimonialDialog.mode === 'add' ? 'Add Testimonial' : 'Save Changes'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {/* ─── Statistics Tab ─── */}
            {activeTab === 'statistics' && (
              <div>
                <SectionHeader title="Statistics" subtitle="Contact statistics and editable site stats" />

                {/* Contact Statistics */}
                <div className="mb-8">
                  <h3 className="text-base font-semibold text-foreground mb-4">Contact Statistics</h3>
                  {dashboardLoading ? <Spinner /> : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card className="border-border/50">
                        <CardContent className="p-4 md:p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs md:text-sm text-muted-foreground">Total Contacts</p>
                              <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">{dashboard?.totalContacts ?? 0}</p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                              <Users className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-border/50">
                        <CardContent className="p-4 md:p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs md:text-sm text-muted-foreground">Today</p>
                              <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">{dashboard?.todayContacts ?? 0}</p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                              <Calendar className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-border/50">
                        <CardContent className="p-4 md:p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs md:text-sm text-muted-foreground">This Week</p>
                              <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">{dashboard?.weekContacts ?? 0}</p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                              <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-border/50">
                        <CardContent className="p-4 md:p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs md:text-sm text-muted-foreground">This Month</p>
                              <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">{dashboard?.monthContacts ?? 0}</p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                              <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>

                {/* Site Stats CRUD */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-foreground">Site Stats</h3>
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => openStatDialog('add')}
                    >
                      <Plus className="w-4 h-4 mr-1.5" />
                      Add Stat
                    </Button>
                  </div>
                  {statsLoading ? <Spinner /> : stats.length === 0 ? (
                    <div className="text-center py-12">
                      <BarChart3 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">No site stats yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {stats.sort((a, b) => a.order - b.order).map((stat) => (
                        <Card key={stat.id} className="border-border/50 hover:border-emerald-200 transition-colors">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                                  <span className="text-xl font-bold text-emerald-700">{stat.value}</span>
                                </div>
                                <div>
                                  <p className="font-semibold text-foreground">{stat.label}</p>
                                  <p className="text-xs text-muted-foreground">Order: {stat.order}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openStatDialog('edit', stat)}
                                  className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteStat(stat.id)}
                                  disabled={deletingId === stat.id}
                                  className="text-red-400 hover:text-red-600 hover:bg-red-50"
                                >
                                  {deletingId === stat.id ? (
                                    <span className="animate-spin inline-block w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {/* Stat Dialog */}
                <Dialog open={statDialog.open} onOpenChange={(open) => setStatDialog((prev) => ({ ...prev, open }))}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>{statDialog.mode === 'add' ? 'Add Stat' : 'Edit Stat'}</DialogTitle>
                      <DialogDescription>
                        {statDialog.mode === 'add' ? 'Create a new site stat.' : 'Update the stat.'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="space-y-2">
                        <Label htmlFor="st-value">Value</Label>
                        <Input id="st-value" value={statForm.value} onChange={(e) => setStatForm((p) => ({ ...p, value: e.target.value }))} placeholder="150+" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="st-label">Label</Label>
                        <Input id="st-label" value={statForm.label} onChange={(e) => setStatForm((p) => ({ ...p, label: e.target.value }))} placeholder="Projects Delivered" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="st-order">Order</Label>
                        <Input id="st-order" type="number" value={statForm.order} onChange={(e) => setStatForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setStatDialog((prev) => ({ ...prev, open: false }))}>Cancel</Button>
                      <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSaveStat} disabled={saving || !statForm.value.trim() || !statForm.label.trim()}>
                        {saving ? <span className="animate-spin mr-2 inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : null}
                        {statDialog.mode === 'add' ? 'Add Stat' : 'Save Changes'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {/* ─── Site Settings Tab ─── */}
            {activeTab === 'settings' && (
              <div>
                <SectionHeader title="Site Settings" subtitle="Manage your business information" />

                {settingsLoading ? <Spinner /> : (
                  <>
                  <Card className="border-border/50">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-6">Business Information</h3>
                      <div className="space-y-5">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 shrink-0 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <Globe className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <Label htmlFor="set-company" className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Company Name</Label>
                            <Input id="set-company" value={siteSettings.companyName} onChange={(e) => setSiteSettings((p) => ({ ...p, companyName: e.target.value }))} placeholder="A-Star Infotech" />
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 shrink-0 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <Label htmlFor="set-address" className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Address</Label>
                            <Textarea id="set-address" value={siteSettings.address} onChange={(e) => setSiteSettings((p) => ({ ...p, address: e.target.value }))} placeholder="Full business address" rows={2} />
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 shrink-0 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <Phone className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <Label htmlFor="set-phone" className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Phone</Label>
                            <Input id="set-phone" value={siteSettings.phone} onChange={(e) => setSiteSettings((p) => ({ ...p, phone: e.target.value }))} placeholder="+91 8560074448" />
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 shrink-0 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <Mail className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <Label htmlFor="set-email" className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Email</Label>
                            <Input id="set-email" type="email" value={siteSettings.email} onChange={(e) => setSiteSettings((p) => ({ ...p, email: e.target.value }))} placeholder="contact@example.com" />
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 shrink-0 rounded-lg bg-amber-100 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-amber-600" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <Label htmlFor="set-hours" className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Business Hours</Label>
                            <Input id="set-hours" value={siteSettings.hours} onChange={(e) => setSiteSettings((p) => ({ ...p, hours: e.target.value }))} placeholder="Mon – Sat: 10:00 AM – 7:00 PM" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Social Media Links */}
                  <Card className="border-border/50 mt-6">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-6">Social Media Links</h3>
                      <div className="space-y-5">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 shrink-0 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Facebook className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <Label htmlFor="set-facebook" className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Facebook URL</Label>
                            <Input id="set-facebook" value={siteSettings.facebook} onChange={(e) => setSiteSettings((p) => ({ ...p, facebook: e.target.value }))} placeholder="https://facebook.com/yourpage" />
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 shrink-0 rounded-lg bg-pink-100 flex items-center justify-center">
                            <Instagram className="w-5 h-5 text-pink-600" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <Label htmlFor="set-instagram" className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Instagram URL</Label>
                            <Input id="set-instagram" value={siteSettings.instagram} onChange={(e) => setSiteSettings((p) => ({ ...p, instagram: e.target.value }))} placeholder="https://instagram.com/yourprofile" />
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 shrink-0 rounded-lg bg-sky-100 flex items-center justify-center">
                            <Linkedin className="w-5 h-5 text-sky-700" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <Label htmlFor="set-linkedin" className="text-xs text-muted-foreground uppercase tracking-wider font-medium">LinkedIn URL</Label>
                            <Input id="set-linkedin" value={siteSettings.linkedin} onChange={(e) => setSiteSettings((p) => ({ ...p, linkedin: e.target.value }))} placeholder="https://linkedin.com/company/yourcompany" />
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 shrink-0 rounded-lg bg-red-100 flex items-center justify-center">
                            <Youtube className="w-5 h-5 text-red-600" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <Label htmlFor="set-youtube" className="text-xs text-muted-foreground uppercase tracking-wider font-medium">YouTube URL</Label>
                            <Input id="set-youtube" value={siteSettings.youtube} onChange={(e) => setSiteSettings((p) => ({ ...p, youtube: e.target.value }))} placeholder="https://youtube.com/@yourchannel" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Brand Color */}
                  <Card className="border-border/50 mt-6">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-6">Brand Color</h3>
                      <div className="space-y-5">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-12 h-12 shrink-0 rounded-xl border-2 border-border shadow-sm"
                            style={{ backgroundColor: siteSettings.brandColor || '#059669' }}
                          />
                          <div className="flex-1 space-y-2">
                            <Label htmlFor="set-brandcolor" className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Hex Color Code</Label>
                            <div className="flex items-center gap-3">
                              <Input
                                id="set-brandcolor"
                                value={siteSettings.brandColor}
                                onChange={(e) => setSiteSettings((p) => ({ ...p, brandColor: e.target.value }))}
                                placeholder="#059669"
                                className="flex-1"
                              />
                              <input
                                type="color"
                                value={siteSettings.brandColor || '#059669'}
                                onChange={(e) => setSiteSettings((p) => ({ ...p, brandColor: e.target.value }))}
                                className="w-10 h-10 rounded-lg border border-border cursor-pointer p-0.5"
                                aria-label="Color picker"
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-3 block">Preset Colors</Label>
                          <div className="flex flex-wrap gap-3">
                            {[
                              { color: '#059669', label: 'Emerald' },
                              { color: '#2563eb', label: 'Blue' },
                              { color: '#7c3aed', label: 'Violet' },
                              { color: '#dc2626', label: 'Red' },
                              { color: '#ea580c', label: 'Orange' },
                              { color: '#ca8a04', label: 'Amber' },
                              { color: '#0d9488', label: 'Teal' },
                              { color: '#be185d', label: 'Pink' },
                            ].map((preset) => (
                              <button
                                key={preset.color}
                                type="button"
                                onClick={() => setSiteSettings((p) => ({ ...p, brandColor: preset.color }))}
                                className="group relative w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                style={{
                                  backgroundColor: preset.color,
                                  borderColor: siteSettings.brandColor === preset.color ? '#1f2937' : 'transparent',
                                }}
                                aria-label={`Select ${preset.label} color`}
                                title={preset.label}
                              >
                                {siteSettings.brandColor === preset.color && (
                                  <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">✓</span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Save Button */}
                  <div className="mt-6">
                    <Button
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={handleSaveSettings}
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <span className="animate-spin mr-2 inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save All Settings
                        </>
                      )}
                    </Button>
                  </div>
                  </>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
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
  // ── Dynamic data from database ──
  const [services, setServices] = useState(DEFAULT_SERVICES)
  const [portfolioItems, setPortfolioItems] = useState(DEFAULT_PORTFOLIO)
  const [testimonialItems, setTestimonialItems] = useState(DEFAULT_TESTIMONIALS)
  const [statItems, setStatItems] = useState(DEFAULT_STATS)
  const [siteSettings, setSiteSettings] = useState(DEFAULT_SETTINGS)

  // Fetch all data from API on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [servicesRes, portfolioRes, testimonialsRes, statsRes, settingsRes] = await Promise.allSettled([
          fetch('/api/services'),
          fetch('/api/portfolio'),
          fetch('/api/testimonials'),
          fetch('/api/stats'),
          fetch('/api/settings'),
        ])

        if (servicesRes.status === 'fulfilled' && servicesRes.value.ok) {
          const data = await servicesRes.value.json()
          if (data.services?.length > 0) {
            setServices(data.services.map((s: { icon: string; title: string; description: string; color: string; bgColor: string }) => ({
              icon: s.icon || 'Globe',
              title: s.title,
              description: s.description,
              color: s.color || 'text-emerald-600',
              bg: s.bgColor || 'bg-emerald-50',
            })))
          }
        }

        if (portfolioRes.status === 'fulfilled' && portfolioRes.value.ok) {
          const data = await portfolioRes.value.json()
          if (data.portfolio?.length > 0) {
            setPortfolioItems(data.portfolio.map((p: { title: string; category: string; description: string; tech: string; color: string; image: string }) => ({
              title: p.title,
              category: p.category,
              description: p.description,
              tech: p.tech || '',
              color: p.color || 'from-emerald-500 to-emerald-700',
              image: p.image || '/portfolio-freshmart.png',
            })))
          }
        }

        if (testimonialsRes.status === 'fulfilled' && testimonialsRes.value.ok) {
          const data = await testimonialsRes.value.json()
          if (data.testimonials?.length > 0) {
            setTestimonialItems(data.testimonials.map((t: { name: string; company: string; review: string; rating: number }) => ({
              name: t.name,
              company: t.company,
              review: t.review,
              rating: t.rating || 5,
            })))
          }
        }

        if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
          const data = await statsRes.value.json()
          if (data.stats?.length > 0) {
            setStatItems(data.stats.map((s: { value: string; label: string }) => ({
              value: s.value,
              label: s.label,
            })))
          }
        }

        if (settingsRes.status === 'fulfilled' && settingsRes.value.ok) {
          const data = await settingsRes.value.json()
          if (data.settings) {
            setSiteSettings({
              companyName: data.settings.companyName || DEFAULT_SETTINGS.companyName,
              address: data.settings.address || DEFAULT_SETTINGS.address,
              phone: data.settings.phone || DEFAULT_SETTINGS.phone,
              email: data.settings.email || DEFAULT_SETTINGS.email,
              hours: data.settings.hours || DEFAULT_SETTINGS.hours,
              facebook: data.settings.facebook || DEFAULT_SETTINGS.facebook,
              instagram: data.settings.instagram || DEFAULT_SETTINGS.instagram,
              linkedin: data.settings.linkedin || DEFAULT_SETTINGS.linkedin,
              youtube: data.settings.youtube || DEFAULT_SETTINGS.youtube,
              brandColor: data.settings.brandColor || DEFAULT_SETTINGS.brandColor,
            })
          }
        }
      } catch (error) {
        console.error('Failed to fetch site data:', error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      setShowScrollTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ── Brand color dynamic application ──
  useEffect(() => {
    const hex = siteSettings.brandColor || '#059669'
    const root = document.documentElement

    // Parse hex color
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)

    // Mix with white (factor: 0 = white, 1 = original)
    const lighten = (factor: number) => {
      const mr = Math.round(r + (255 - r) * (1 - factor))
      const mg = Math.round(g + (255 - g) * (1 - factor))
      const mb = Math.round(b + (255 - b) * (1 - factor))
      return `#${mr.toString(16).padStart(2, '0')}${mg.toString(16).padStart(2, '0')}${mb.toString(16).padStart(2, '0')}`
    }

    // Mix with black (factor: 0 = black, 1 = original)
    const darken = (factor: number) => {
      const mr = Math.round(r * factor)
      const mg = Math.round(g * factor)
      const mb = Math.round(b * factor)
      return `#${mr.toString(16).padStart(2, '0')}${mg.toString(16).padStart(2, '0')}${mb.toString(16).padStart(2, '0')}`
    }

    root.style.setProperty('--brand-50', lighten(0.1))
    root.style.setProperty('--brand-100', lighten(0.2))
    root.style.setProperty('--brand-200', lighten(0.4))
    root.style.setProperty('--brand-300', lighten(0.6))
    root.style.setProperty('--brand-400', lighten(0.8))
    root.style.setProperty('--brand-500', hex)
    root.style.setProperty('--brand-600', hex)
    root.style.setProperty('--brand-700', darken(0.85))
    root.style.setProperty('--brand-800', darken(0.65))
    root.style.setProperty('--brand-900', darken(0.45))
    root.style.setProperty('--brand-950', darken(0.28))
  }, [siteSettings.brandColor])

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

      const data = await res.json()

      toast.success('Message Sent Successfully!', {
        description:
          "Thank you for reaching out! We've received your message and will get back to you within 24 hours. A confirmation email has been sent to your inbox.",
      })

      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong'
      toast.error('Error', {
        description: message,
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
                    scrolled ? 'text-brand-600' : 'text-brand-300'
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
                  className={`px-3 lg:px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-brand-50 hover:text-brand-700 ${
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
                  className="ml-2 bg-brand-600 hover:bg-brand-700 text-white"
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
                    className="block px-4 py-3 rounded-md text-foreground font-medium hover:bg-brand-50 hover:text-brand-700 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <a href="#contact" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full mt-2 bg-brand-600 hover:bg-brand-700 text-white">
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
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950" />
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: 'url(/hero-image.png)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950/90 via-brand-900/70 to-brand-800/50" />

        {/* Decorative shapes */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-brand-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-40">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-6 bg-brand-500/20 text-brand-300 border-brand-500/30 hover:bg-brand-500/30 px-4 py-1.5 text-sm">
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
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-amber-300">
                Digital Presence
              </span>{' '}
              With Us
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-brand-100/80 max-w-2xl leading-relaxed"
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
                  className="border-white/40 text-white bg-white/10 hover:bg-white/20 hover:text-white hover:border-white/60 px-8 h-13 text-base backdrop-blur-sm"
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
              {statItems.map((stat) => (
                <div key={stat.label} className="text-center sm:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-brand-300/70 mt-1">
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
            className="w-6 h-10 border-2 border-brand-400/40 rounded-full flex items-start justify-center p-1.5"
          >
            <motion.div className="w-1.5 h-1.5 bg-brand-400 rounded-full" />
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
                  <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center">
                    <Award className="w-6 h-6 text-brand-600" />
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
                className="mb-4 bg-brand-50 text-brand-700 border-brand-200"
              >
                About Us
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                We Build Digital Experiences{' '}
                <span className="text-brand-600">That Matter</span>
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
                <Card className="border-brand-200 bg-brand-50/50">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-brand-600" />
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
                      className="px-3 py-1 text-brand-700 border-brand-300"
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
              className="mb-4 bg-brand-50 text-brand-700 border-brand-200"
            >
              Our Services
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Everything You Need to{' '}
              <span className="text-brand-600">Succeed Online</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-base sm:text-lg">
              From concept to launch and beyond, we provide comprehensive web
              solutions tailored to your business goals.
            </p>
          </div>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => {
                const IconComp = ICON_MAP[service.icon] || Globe
                return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <Card className="group h-full border-border/50 hover:border-brand-300 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 sm:p-8">
                    <div
                      className={`w-12 h-12 rounded-xl ${service.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                    >
                      <IconComp className={`w-6 h-6 ${service.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                    <a
                      href="#contact"
                      className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
                    >
                      Learn More
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            )
            })}
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
                <span className="text-brand-600">Stand Out</span>
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
                    <div className="w-10 h-10 shrink-0 rounded-lg bg-brand-100 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-brand-600" />
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
              <div className="bg-gradient-to-br from-brand-50 to-brand-100 rounded-2xl p-8 sm:p-12">
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
                        <span className="text-brand-600 font-semibold">
                          {item.value}%
                        </span>
                      </div>
                      <div className="h-2.5 bg-brand-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.value}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + idx * 0.15, duration: 0.8, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full"
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
              className="mb-4 bg-brand-50 text-brand-700 border-brand-200"
            >
              Our Portfolio
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Projects That{' '}
              <span className="text-brand-600">Speak for Themselves</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-base sm:text-lg">
              Explore some of our recent work and see how we&apos;ve helped
              businesses across industries achieve their digital goals.
            </p>
          </div>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((project, idx) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                  {/* Project Image */}
                  <div className="h-48 relative overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                        {project.category}
                      </Badge>
                    </div>
                    <h3 className="absolute bottom-4 left-6 text-xl font-bold text-white z-10">
                      {project.title}
                    </h3>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {project.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tech.split(',').map((t: string) => (
                        <Badge
                          key={t.trim()}
                          variant="secondary"
                          className="text-xs bg-brand-50 text-brand-700"
                        >
                          {t.trim()}
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
                className="border-brand-600 text-brand-600 hover:bg-brand-50"
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
              <span className="text-brand-600">Say About Us</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-base sm:text-lg">
              Don&apos;t just take our word for it — hear from the businesses
              we&apos;ve helped succeed.
            </p>
          </div>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonialItems.map((testimonial, idx) => (
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
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-semibold text-sm">
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
      <AnimatedSection className="py-16 sm:py-20 bg-gradient-to-r from-brand-700 via-brand-600 to-brand-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-amber-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to Take Your Business Online?
          </h2>
          <p className="mt-4 text-brand-100/90 text-lg max-w-2xl mx-auto">
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
                className="border-white/40 text-white bg-white/10 hover:bg-white/20 hover:text-white hover:border-white/60 px-8 h-13 backdrop-blur-sm"
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
              className="mb-4 bg-brand-50 text-brand-700 border-brand-200"
            >
              Contact Us
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Let&apos;s Start{' '}
              <span className="text-brand-600">Your Project</span>
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
                      className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white px-8"
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
                      <div className="w-10 h-10 shrink-0 rounded-lg bg-brand-100 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-brand-600" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground text-sm">
                          Office Address
                        </div>
                        <div className="text-sm text-muted-foreground mt-0.5">
                          {siteSettings.address}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 shrink-0 rounded-lg bg-brand-100 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-brand-600" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground text-sm">
                          Phone Number
                        </div>
                        <div className="text-sm text-muted-foreground mt-0.5">
                          {siteSettings.phone}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 shrink-0 rounded-lg bg-brand-100 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-brand-600" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground text-sm">
                          Email Address
                        </div>
                        <div className="text-sm text-muted-foreground mt-0.5">
                          {siteSettings.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 shrink-0 rounded-lg bg-brand-100 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-brand-600" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground text-sm">
                          Business Hours
                        </div>
                        <div className="text-sm text-muted-foreground mt-0.5">
                          {siteSettings.hours}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Map placeholder */}
              <Card className="shadow-lg overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-brand-100 to-brand-50 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-brand-400 mx-auto" />
                    <p className="text-sm text-brand-600 mt-2 font-medium">
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
                    {siteSettings.facebook && (
                      <a
                        href={siteSettings.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors"
                        aria-label="Facebook"
                      >
                        <Facebook className="w-5 h-5 text-blue-600" />
                      </a>
                    )}
                    {siteSettings.instagram && (
                      <a
                        href={siteSettings.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-lg bg-pink-50 hover:bg-pink-100 flex items-center justify-center transition-colors"
                        aria-label="Instagram"
                      >
                        <Instagram className="w-5 h-5 text-pink-600" />
                      </a>
                    )}
                    {siteSettings.linkedin && (
                      <a
                        href={siteSettings.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-lg bg-sky-50 hover:bg-sky-100 flex items-center justify-center transition-colors"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="w-5 h-5 text-sky-700" />
                      </a>
                    )}
                    {siteSettings.youtube && (
                      <a
                        href={siteSettings.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
                        aria-label="YouTube"
                      >
                        <Youtube className="w-5 h-5 text-red-600" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ─── Footer ─── */}
      <footer className="bg-brand-950 text-brand-100 mt-auto">
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
                  <div className="text-xs text-brand-400 font-medium tracking-wider uppercase">
                    Infotech
                  </div>
                </div>
              </div>
              <p className="text-brand-300/70 text-sm leading-relaxed max-w-xs">
                Building smart websites for growing businesses. Your trusted
                partner for all digital solutions.
              </p>
              <div className="mt-4 flex gap-3">
                {siteSettings.facebook && (
                  <a
                    href={siteSettings.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-brand-900 hover:bg-brand-800 flex items-center justify-center transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {siteSettings.instagram && (
                  <a
                    href={siteSettings.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-brand-900 hover:bg-brand-800 flex items-center justify-center transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {siteSettings.linkedin && (
                  <a
                    href={siteSettings.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-brand-900 hover:bg-brand-800 flex items-center justify-center transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {siteSettings.youtube && (
                  <a
                    href={siteSettings.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-brand-900 hover:bg-brand-800 flex items-center justify-center transition-colors"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
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
                      className="text-sm text-brand-300/70 hover:text-white transition-colors"
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
                {services.map((service) => (
                  <li key={service.title}>
                    <a
                      href="#services"
                      className="text-sm text-brand-300/70 hover:text-white transition-colors"
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
                  <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-brand-300/70">
                    {siteSettings.address}
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                  <span className="text-sm text-brand-300/70">
                    {siteSettings.phone}
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                  <span className="text-sm text-brand-300/70">
                    {siteSettings.email}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-brand-800/50 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-brand-300/50">
              © {new Date().getFullYear()} A-Star Infotech. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-brand-300/50">
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

      {/* ─── Admin Panel ─── */}
      <AdminPanel />

      {/* ─── Scroll to Top Button ─── */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 left-6 z-50 w-12 h-12 bg-brand-600 hover:bg-brand-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
