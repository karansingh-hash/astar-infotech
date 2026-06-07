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
   Admin Panel Component (Futuristic Dark Theme)
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
