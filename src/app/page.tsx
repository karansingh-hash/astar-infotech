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
  Plus, Pencil, Wrench, Save, Sun, Moon, EyeOff, KeyRound,
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

function AdminPanel({ externalOpen, onExternalClose }: { externalOpen?: boolean; onExternalClose?: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminToken, setAdminToken] = useState<string>('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const [contacts, setContacts] = useState<ContactItem[]>([])
  const [services, setServices] = useState<ServiceItem[]>([])
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([])
  const [stats, setStats] = useState<StatItem[]>([])
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({ companyName: '', address: '', phone: '', email: '', secondaryEmail: '', hours: '', facebook: '', instagram: '', linkedin: '', youtube: '', brandColor: '', heroBadge: '', heroHeading: '', heroSubtitle: '', aboutHeading: '', aboutDescription1: '', aboutDescription2: '', aboutVision: '', aboutMission: '', aboutValues: '', whyChooseUsIntro: '' })
  const [contactsLoading, setContactsLoading] = useState(false)
  const [servicesLoading, setServicesLoading] = useState(false)
  const [portfolioLoading, setPortfolioLoading] = useState(false)
  const [testimonialsLoading, setTestimonialsLoading] = useState(false)
  const [statsLoading, setStatsLoading] = useState(false)
  const [dashboardLoading, setDashboardLoading] = useState(false)
  const [settingsLoading, setSettingsLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [serviceDialog, setServiceDialog] = useState<{ open: boolean; mode: 'add' | 'edit'; item: ServiceItem | null }>({ open: false, mode: 'add', item: null })
  const [portfolioDialog, setPortfolioDialog] = useState<{ open: boolean; mode: 'add' | 'edit'; item: PortfolioItem | null }>({ open: false, mode: 'add', item: null })
  const [testimonialDialog, setTestimonialDialog] = useState<{ open: boolean; mode: 'add' | 'edit'; item: TestimonialItem | null }>({ open: false, mode: 'add', item: null })
  const [statDialog, setStatDialog] = useState<{ open: boolean; mode: 'add' | 'edit'; item: StatItem | null }>({ open: false, mode: 'add', item: null })
  const [serviceForm, setServiceForm] = useState({ title: '', description: '', icon: '', color: '', bgColor: '', order: 0 })
  const [portfolioForm, setPortfolioForm] = useState({ title: '', category: '', description: '', tech: '', color: '', image: '', order: 0 })
  const [testimonialForm, setTestimonialForm] = useState({ name: '', company: '', review: '', rating: 5, order: 0 })
  const [statForm, setStatForm] = useState({ value: '', label: '', order: 0 })
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [passwordVis, setPasswordVis] = useState({ current: false, new: false, confirm: false })
  const [changingPassword, setChangingPassword] = useState(false)

  useEffect(() => {
    const token = sessionStorage.getItem('admin_token')
    if (token) {
      // Validate existing token
      fetch('/api/admin/auth', { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } })
        .then(r => { if (r.ok) { setAdminToken(token); setIsAuthenticated(true) } else { sessionStorage.removeItem('admin_token') } })
        .catch(() => sessionStorage.removeItem('admin_token'))
    }
  }, [])
  useEffect(() => { if (externalOpen) setIsOpen(true) }, [externalOpen])
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

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault(); if (!password.trim()) return; setAuthLoading(true)
    try {
      const res = await fetch('/api/admin/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
      const data = await res.json()
      if (res.ok && data.success && data.token) {
        setAdminToken(data.token); setIsAuthenticated(true); sessionStorage.setItem('admin_token', data.token); setPassword(''); toast.success('Login Successful', { description: 'Welcome to the Admin Panel!' })
      } else toast.error('Login Failed', { description: data.error || 'Invalid password.' })
    } catch { toast.error('Error', { description: 'Failed to connect to server.' }) } finally { setAuthLoading(false) }
  }
  const handleLogout = async () => {
    try { await fetch('/api/admin/auth', { method: 'DELETE', headers: { 'Authorization': `Bearer ${adminToken}` } }) } catch {}
    setIsAuthenticated(false); setAdminToken(''); sessionStorage.removeItem('admin_token'); setIsOpen(false); setActiveTab('dashboard'); setSidebarOpen(false); setContacts([]); setServices([]); setPortfolio([]); setTestimonials([]); setStats([]); setDashboard(null); onExternalClose?.(); toast.success('Logged Out', { description: 'You have been logged out successfully.' })
  }

  const authHeaders = () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` })
  const fetchDashboard = async () => { setDashboardLoading(true); try { const r = await fetch('/api/dashboard', { headers: authHeaders() }); if (r.status === 401) { handleLogout(); return } setDashboard(await r.json()) } catch { toast.error('Error', { description: 'Failed to fetch dashboard data.' }) } finally { setDashboardLoading(false) } }
  const fetchContacts = async () => { setContactsLoading(true); try { const r = await fetch('/api/contacts', { headers: authHeaders() }); if (r.status === 401) { handleLogout(); return } const d = await r.json(); setContacts(d.contacts || []) } catch { toast.error('Error', { description: 'Failed to fetch contacts.' }) } finally { setContactsLoading(false) } }
  const fetchServices = async () => { setServicesLoading(true); try { const r = await fetch('/api/services'); const d = await r.json(); setServices(d.services || []) } catch { toast.error('Error', { description: 'Failed to fetch services.' }) } finally { setServicesLoading(false) } }
  const fetchPortfolio = async () => { setPortfolioLoading(true); try { const r = await fetch('/api/portfolio'); const d = await r.json(); setPortfolio(d.portfolio || []) } catch { toast.error('Error', { description: 'Failed to fetch portfolio.' }) } finally { setPortfolioLoading(false) } }
  const fetchTestimonials = async () => { setTestimonialsLoading(true); try { const r = await fetch('/api/testimonials'); const d = await r.json(); setTestimonials(d.testimonials || []) } catch { toast.error('Error', { description: 'Failed to fetch testimonials.' }) } finally { setTestimonialsLoading(false) } }
  const fetchStats = async () => { setStatsLoading(true); try { const r = await fetch('/api/stats'); const d = await r.json(); setStats(d.stats || []) } catch { toast.error('Error', { description: 'Failed to fetch stats.' }) } finally { setStatsLoading(false) } }
  const fetchSettings = async () => { setSettingsLoading(true); try { const r = await fetch('/api/settings'); const d = await r.json(); if (d.settings) setSiteSettings({ companyName: d.settings.companyName || '', address: d.settings.address || '', phone: d.settings.phone || '', email: d.settings.email || '', secondaryEmail: d.settings.secondaryEmail || '', hours: d.settings.hours || '', facebook: d.settings.facebook || '', instagram: d.settings.instagram || '', linkedin: d.settings.linkedin || '', youtube: d.settings.youtube || '', brandColor: d.settings.brandColor || '', heroBadge: d.settings.heroBadge || DEFAULT_SETTINGS.heroBadge, heroHeading: d.settings.heroHeading || DEFAULT_SETTINGS.heroHeading, heroSubtitle: d.settings.heroSubtitle || DEFAULT_SETTINGS.heroSubtitle, aboutHeading: d.settings.aboutHeading || DEFAULT_SETTINGS.aboutHeading, aboutDescription1: d.settings.aboutDescription1 || DEFAULT_SETTINGS.aboutDescription1, aboutDescription2: d.settings.aboutDescription2 || DEFAULT_SETTINGS.aboutDescription2, aboutVision: d.settings.aboutVision || DEFAULT_SETTINGS.aboutVision, aboutMission: d.settings.aboutMission || DEFAULT_SETTINGS.aboutMission, aboutValues: d.settings.aboutValues || DEFAULT_SETTINGS.aboutValues, whyChooseUsIntro: d.settings.whyChooseUsIntro || DEFAULT_SETTINGS.whyChooseUsIntro }) } catch { toast.error('Error', { description: 'Failed to fetch settings.' }) } finally { setSettingsLoading(false) } }

  const handleDeleteContact = async (id: string) => { setDeletingId(id); try { const r = await fetch('/api/contacts', { method: 'DELETE', headers: authHeaders(), body: JSON.stringify({ id }) }); if (r.status === 401) { handleLogout(); return } if (r.ok) { setContacts(p => p.filter(c => c.id !== id)); toast.success('Deleted', { description: 'Contact has been deleted.' }) } else { const d = await r.json(); toast.error('Error', { description: d.error || 'Failed to delete.' }) } } catch { toast.error('Error', { description: 'Failed to delete contact.' }) } finally { setDeletingId(null) } }

  const apiCall = async (url: string, method: string, body?: unknown) => { const r = await fetch(url, { method, headers: authHeaders(), body: body ? JSON.stringify(body) : undefined }); if (r.status === 401) { handleLogout(); throw new Error('Session expired. Please log in again.') } const d = await r.json(); if (!r.ok) throw new Error(d.error || 'Request failed'); return d }

  const openServiceDialog = (mode: 'add' | 'edit', item?: ServiceItem) => { if (mode === 'edit' && item) { setServiceForm({ title: item.title, description: item.description, icon: item.icon, color: item.color, bgColor: item.bgColor, order: item.order }); setServiceDialog({ open: true, mode: 'edit', item }) } else { setServiceForm({ title: '', description: '', icon: 'Globe', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', order: services.length }); setServiceDialog({ open: true, mode: 'add', item: null }) } }
  const handleSaveService = async () => { setSaving(true); try { if (serviceDialog.mode === 'add') { await apiCall('/api/services', 'POST', serviceForm); toast.success('Service Added') } else { await apiCall('/api/services', 'PUT', { id: serviceDialog.item?.id, ...serviceForm }); toast.success('Service Updated') } setServiceDialog({ open: false, mode: 'add', item: null }); fetchServices() } catch (e) { toast.error('Error', { description: e instanceof Error ? e.message : 'Failed to save.' }) } finally { setSaving(false) } }
  const handleDeleteService = async (id: string) => { setDeletingId(id); try { await apiCall('/api/services', 'DELETE', { id }); setServices(p => p.filter(s => s.id !== id)); toast.success('Deleted') } catch (e) { toast.error('Error', { description: e instanceof Error ? e.message : 'Failed.' }) } finally { setDeletingId(null) } }

  const openPortfolioDialog = (mode: 'add' | 'edit', item?: PortfolioItem) => { if (mode === 'edit' && item) { setPortfolioForm({ title: item.title, category: item.category, description: item.description, tech: item.tech, color: item.color, image: item.image, order: item.order }); setPortfolioDialog({ open: true, mode: 'edit', item }) } else { setPortfolioForm({ title: '', category: '', description: '', tech: '', color: 'from-emerald-500 to-emerald-700', image: '', order: portfolio.length }); setPortfolioDialog({ open: true, mode: 'add', item: null }) } }
  const handleSavePortfolio = async () => { setSaving(true); try { if (portfolioDialog.mode === 'add') { await apiCall('/api/portfolio', 'POST', portfolioForm); toast.success('Portfolio Item Added') } else { await apiCall('/api/portfolio', 'PUT', { id: portfolioDialog.item?.id, ...portfolioForm }); toast.success('Portfolio Updated') } setPortfolioDialog({ open: false, mode: 'add', item: null }); fetchPortfolio() } catch (e) { toast.error('Error', { description: e instanceof Error ? e.message : 'Failed.' }) } finally { setSaving(false) } }
  const handleDeletePortfolio = async (id: string) => { setDeletingId(id); try { await apiCall('/api/portfolio', 'DELETE', { id }); setPortfolio(p => p.filter(x => x.id !== id)); toast.success('Deleted') } catch (e) { toast.error('Error', { description: e instanceof Error ? e.message : 'Failed.' }) } finally { setDeletingId(null) } }

  const openTestimonialDialog = (mode: 'add' | 'edit', item?: TestimonialItem) => { if (mode === 'edit' && item) { setTestimonialForm({ name: item.name, company: item.company, review: item.review, rating: item.rating, order: item.order }); setTestimonialDialog({ open: true, mode: 'edit', item }) } else { setTestimonialForm({ name: '', company: '', review: '', rating: 5, order: testimonials.length }); setTestimonialDialog({ open: true, mode: 'add', item: null }) } }
  const handleSaveTestimonial = async () => { setSaving(true); try { if (testimonialDialog.mode === 'add') { await apiCall('/api/testimonials', 'POST', testimonialForm); toast.success('Testimonial Added') } else { await apiCall('/api/testimonials', 'PUT', { id: testimonialDialog.item?.id, ...testimonialForm }); toast.success('Testimonial Updated') } setTestimonialDialog({ open: false, mode: 'add', item: null }); fetchTestimonials() } catch (e) { toast.error('Error', { description: e instanceof Error ? e.message : 'Failed.' }) } finally { setSaving(false) } }
  const handleDeleteTestimonial = async (id: string) => { setDeletingId(id); try { await apiCall('/api/testimonials', 'DELETE', { id }); setTestimonials(p => p.filter(t => t.id !== id)); toast.success('Deleted') } catch (e) { toast.error('Error', { description: e instanceof Error ? e.message : 'Failed.' }) } finally { setDeletingId(null) } }

  const openStatDialog = (mode: 'add' | 'edit', item?: StatItem) => { if (mode === 'edit' && item) { setStatForm({ value: item.value, label: item.label, order: item.order }); setStatDialog({ open: true, mode: 'edit', item }) } else { setStatForm({ value: '', label: '', order: stats.length }); setStatDialog({ open: true, mode: 'add', item: null }) } }
  const handleSaveStat = async () => { setSaving(true); try { if (statDialog.mode === 'add') { await apiCall('/api/stats', 'POST', statForm); toast.success('Stat Added') } else { await apiCall('/api/stats', 'PUT', { id: statDialog.item?.id, ...statForm }); toast.success('Stat Updated') } setStatDialog({ open: false, mode: 'add', item: null }); fetchStats() } catch (e) { toast.error('Error', { description: e instanceof Error ? e.message : 'Failed.' }) } finally { setSaving(false) } }
  const handleDeleteStat = async (id: string) => { setDeletingId(id); try { await apiCall('/api/stats', 'DELETE', { id }); setStats(p => p.filter(s => s.id !== id)); toast.success('Deleted') } catch (e) { toast.error('Error', { description: e instanceof Error ? e.message : 'Failed.' }) } finally { setDeletingId(null) } }

  const handleSaveSettings = async () => { setSaving(true); try { await apiCall('/api/settings', 'PUT', { settings: siteSettings }); toast.success('Settings Saved', { description: 'Business information has been updated.' }) } catch (e) { toast.error('Error', { description: e instanceof Error ? e.message : 'Failed to save settings.' }) } finally { setSaving(false) } }

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) { toast.error('Error', { description: 'All fields are required.' }); return }
    if (passwordForm.newPassword.length < 8) { toast.error('Error', { description: 'New password must be at least 8 characters.' }); return }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { toast.error('Error', { description: 'Passwords do not match.' }); return }
    setChangingPassword(true)
    try {
      const res = await fetch('/api/admin/auth', { method: 'PUT', headers: authHeaders(), body: JSON.stringify({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword }) })
      const data = await res.json()
      if (res.ok && data.success) {
        toast.success('Password Changed', { description: 'Your admin password has been updated successfully. Use the new password next time you log in.' })
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setPasswordVis({ current: false, new: false, confirm: false })
      } else {
        toast.error('Error', { description: data.error || 'Failed to change password.' })
      }
    } catch { toast.error('Error', { description: 'Failed to change password. Please try again.' }) }
    finally { setChangingPassword(false) }
  }

  // Neon spinner component
  const Spinner = () => <div className="flex items-center justify-center py-20"><div className="animate-spin w-10 h-10 border-4 border-neon/30 border-t-neon rounded-full" /></div>
  const SectionHeader = ({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) => (
    <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div><h2 className="text-xl font-semibold text-foreground">{title}</h2><p className="text-sm text-muted-foreground mt-1">{subtitle}</p></div>
      {action}
    </div>
  )

  if (!isOpen) return null

  if (!isAuthenticated) {
    return (
      <>
        <div className="fixed inset-0 z-[9999] bg-background flex items-center justify-center p-4">
          <div className="absolute top-20 right-20 w-72 h-72 bg-neon/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
          <Card className="w-full max-w-md glass-card border-neon/20 relative">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-neon/10 border border-neon/30 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-neon/10">
                  <Lock className="w-8 h-8 text-neon" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Admin Panel</h2>
                <p className="text-sm text-muted-foreground mt-1">A-Star Infotech</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="admin-password" className="text-sm font-medium text-foreground">Password</label>
                  <div className="relative">
                    <Input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter admin password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoFocus
                      disabled={authLoading}
                      className="futuristic-input h-11 pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-neon transition-colors focus:outline-none focus:text-neon"
                      tabIndex={-1}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full glow-button bg-neon/20 hover:bg-neon/30 text-neon border border-neon/30 h-11" disabled={authLoading || !password.trim()}>
                  {authLoading ? <><span className="animate-spin mr-2 inline-block w-4 h-4 border-2 border-neon border-t-transparent rounded-full" />Verifying...</> : <><Lock className="w-4 h-4 mr-2" />Login</>}
                </Button>
              </form>
              <Button variant="ghost" className="w-full mt-3 text-muted-foreground" onClick={() => { setIsOpen(false); setPassword('') }}>Cancel</Button>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="fixed inset-0 z-[9999] bg-background flex">
        {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}
        <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-dark-surface border-r border-border flex flex-col shrink-0 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="p-5 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-neon/10 border border-neon/30 rounded-xl flex items-center justify-center"><LayoutDashboard className="w-5 h-5 text-neon" /></div>
              <div><div className="font-bold text-sm text-foreground">A-Star Infotech</div><div className="text-xs text-neon">Admin Panel</div></div>
            </div>
          </div>
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {TAB_CONFIG.map(tab => (
              <button key={tab.key} onClick={() => { setActiveTab(tab.key); setSidebarOpen(false) }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.key ? 'bg-neon/10 text-neon border border-neon/20' : 'text-muted-foreground hover:bg-neon/5 hover:text-foreground'}`}>
                <tab.icon className="w-5 h-5" />{tab.label}
                {tab.key === 'inquiries' && dashboard && dashboard.totalContacts > 0 && <Badge className="ml-auto bg-neon/20 text-neon border-neon/30 text-xs px-1.5 py-0.5">{dashboard.totalContacts}</Badge>}
              </button>
            ))}
          </nav>
          <div className="p-3 border-t border-border">
            <button onClick={() => { setIsOpen(false); setSidebarOpen(false); onExternalClose?.() }} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-neon/5 hover:text-foreground transition-colors"><Eye className="w-5 h-5" />View Website</button>
          </div>
        </aside>
        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b border-border bg-dark-surface shrink-0 flex items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-md hover:bg-neon/5 transition-colors" aria-label="Open sidebar"><Menu className="w-5 h-5 text-foreground" /></button>
              <h1 className="text-lg font-semibold text-foreground capitalize">{activeTab === 'inquiries' ? 'Inquiries' : activeTab}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => { setIsOpen(false); onExternalClose?.() }} className="text-muted-foreground hidden sm:flex hover:bg-neon/5"><Eye className="w-4 h-4 mr-1.5" />View Website</Button>
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded-lg hover:bg-neon/10 transition-colors"
                  aria-label="Toggle theme"
                  title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-foreground" />}
                </button>
              )}
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                aria-label="Logout"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-red-400/80 hover:text-red-400" />
              </button>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">

            {/* Dashboard */}
            {activeTab === 'dashboard' && (
              <div>
                <SectionHeader title="Dashboard" subtitle="Overview of your website activity" />
                {dashboardLoading ? <Spinner /> : (
                  <>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      {[
                        { label: 'Total Contacts', value: dashboard?.totalContacts ?? 0, icon: Users, color: 'text-neon', bg: 'bg-neon/10' },
                        { label: 'Today', value: dashboard?.todayContacts ?? 0, icon: Calendar, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                        { label: 'This Week', value: dashboard?.weekContacts ?? 0, icon: BarChart3, color: 'text-neon', bg: 'bg-neon/10' },
                        { label: 'This Month', value: dashboard?.monthContacts ?? 0, icon: BarChart3, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                      ].map((item, i) => (
                        <Card key={i} className="glass-card border-border">
                          <CardContent className="p-4 md:p-6">
                            <div className="flex items-center justify-between">
                              <div><p className="text-xs md:text-sm text-muted-foreground">{item.label}</p><p className="text-2xl md:text-3xl font-bold text-foreground mt-1">{item.value}</p></div>
                              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl ${item.bg} flex items-center justify-center`}><item.icon className={`w-5 h-5 md:w-6 md:h-6 ${item.color}`} /></div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {[
                        { label: 'Services', value: dashboard?.totalServices ?? 0, icon: Globe },
                        { label: 'Portfolio', value: dashboard?.totalPortfolio ?? 0, icon: Briefcase },
                        { label: 'Testimonials', value: dashboard?.totalTestimonials ?? 0, icon: Star },
                      ].map((item, i) => (
                        <Card key={i} className={`glass-card border-border ${i === 2 ? 'col-span-2 lg:col-span-1' : ''}`}>
                          <CardContent className="p-4 md:p-6">
                            <div className="flex items-center justify-between">
                              <div><p className="text-xs md:text-sm text-muted-foreground">{item.label}</p><p className="text-2xl md:text-3xl font-bold text-foreground mt-1">{item.value}</p></div>
                              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-neon/10 flex items-center justify-center"><item.icon className="w-5 h-5 md:w-6 md:h-6 text-neon" /></div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <Card className="glass-card border-border mb-6">
                      <CardContent className="p-4 md:p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Contacts</h3>
                        {!dashboard?.recentContacts?.length ? <p className="text-sm text-muted-foreground text-center py-8">No contact activity yet</p> : (
                          <div className="space-y-3 max-h-64 overflow-y-auto">
                            {dashboard.recentContacts.map(c => (
                              <div key={c.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                                <div className="w-8 h-8 rounded-full bg-neon/10 border border-neon/20 flex items-center justify-center text-neon font-semibold text-xs shrink-0">{c.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</div>
                                <div className="flex-1 min-w-0"><p className="text-sm font-medium text-foreground truncate">{c.name}</p><p className="text-xs text-muted-foreground truncate">{c.email}</p></div>
                                <p className="text-xs text-muted-foreground shrink-0">{new Date(c.createdAt).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short' })}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    <Card className="glass-card border-border">
                      <CardContent className="p-4 md:p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {[
                            { label: 'View Inquiries', icon: Inbox, tab: 'inquiries' as AdminTab },
                            { label: 'Manage Services', icon: Globe, tab: 'services' as AdminTab },
                            { label: 'Manage Portfolio', icon: Briefcase, tab: 'portfolio' as AdminTab },
                            { label: 'Edit Settings', icon: Wrench, tab: 'settings' as AdminTab },
                          ].map(a => (
                            <button key={a.tab} onClick={() => setActiveTab(a.tab)} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-neon/30 hover:bg-neon/5 transition-all duration-200">
                              <div className="w-10 h-10 rounded-lg bg-neon/10 flex items-center justify-center"><a.icon className="w-5 h-5 text-neon" /></div>
                              <span className="text-xs font-medium text-foreground text-center">{a.label}</span>
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            )}

            {/* Inquiries */}
            {activeTab === 'inquiries' && (
              <div>
                <SectionHeader title="Contact Submissions" subtitle="Manage all contact form inquiries" action={<Button variant="outline" size="sm" onClick={fetchContacts} disabled={contactsLoading} className="border-neon/30 text-neon hover:bg-neon/10">{contactsLoading ? <span className="animate-spin mr-1.5 inline-block w-3.5 h-3.5 border-2 border-neon border-t-transparent rounded-full" /> : null}Refresh</Button>} />
                {contactsLoading ? <Spinner /> : contacts.length === 0 ? (
                  <div className="text-center py-20"><Inbox className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" /><h3 className="text-lg font-medium text-muted-foreground">No contacts yet</h3></div>
                ) : (
                  <div className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
                    {contacts.map(c => (
                      <Card key={c.id} className="glass-card border-border hover:border-neon/20 transition-colors">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <div className="w-9 h-9 rounded-full bg-neon/10 border border-neon/20 flex items-center justify-center text-neon font-semibold text-xs shrink-0">{c.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</div>
                                <span className="font-semibold text-foreground">{c.name}</span>
                                {c.phone && <a href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-neon hover:text-neon/80 bg-neon/10 px-2 py-0.5 rounded-full"><MessageCircle className="w-3 h-3" />WhatsApp</a>}
                              </div>
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground ml-0 sm:ml-11 flex-wrap">
                                <span className="flex items-center gap-1"><MailCheck className="w-3.5 h-3.5" /><a href={`mailto:${c.email}`} className="hover:text-neon transition-colors">{c.email}</a></span>
                                {c.phone && <span className="flex items-center gap-1"><PhoneCall className="w-3.5 h-3.5" />{c.phone}</span>}
                                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(c.createdAt).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                              </div>
                              <p className="mt-3 text-sm text-foreground/80 bg-dark-surface rounded-lg p-3 ml-0 sm:ml-11 leading-relaxed border border-border">{c.message}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteContact(c.id)} disabled={deletingId === c.id} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 shrink-0">
                              {deletingId === c.id ? <span className="animate-spin inline-block w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full" /> : <Trash2 className="w-4 h-4" />}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Services */}
            {activeTab === 'services' && (
              <div>
                <SectionHeader title="Services" subtitle="Manage your service offerings" action={<Button size="sm" className="glow-button bg-neon/20 hover:bg-neon/30 text-neon border border-neon/30" onClick={() => openServiceDialog('add')}><Plus className="w-4 h-4 mr-1.5" />Add Service</Button>} />
                {servicesLoading ? <Spinner /> : services.length === 0 ? (
                  <div className="text-center py-20"><Globe className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" /><h3 className="text-lg font-medium text-muted-foreground">No services yet</h3></div>
                ) : (
                  <div className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
                    {services.sort((a, b) => a.order - b.order).map(s => (
                      <Card key={s.id} className="glass-card border-border hover:border-neon/20 transition-colors">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl ${s.bgColor || 'bg-neon/10'} flex items-center justify-center shrink-0`}><Globe className={`w-5 h-5 ${s.color || 'text-neon'}`} /></div>
                                <div><h3 className="font-semibold text-foreground">{s.title}</h3><p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{s.description}</p></div>
                              </div>
                              <div className="flex items-center gap-3 mt-2 ml-13 text-xs text-muted-foreground">
                                <Badge variant="secondary" className="text-xs bg-neon/10 text-neon border-neon/20">Icon: {s.icon}</Badge>
                                <Badge variant="secondary" className="text-xs bg-dark-card text-muted-foreground border-border">Order: {s.order}</Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <Button variant="ghost" size="sm" onClick={() => openServiceDialog('edit', s)} className="text-neon hover:text-neon/80 hover:bg-neon/10"><Pencil className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteService(s.id)} disabled={deletingId === s.id} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">{deletingId === s.id ? <span className="animate-spin inline-block w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full" /> : <Trash2 className="w-4 h-4" />}</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                <Dialog open={serviceDialog.open} onOpenChange={o => setServiceDialog(p => ({ ...p, open: o }))}>
                  <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-dark-surface border-neon/20">
                    <DialogHeader><DialogTitle>{serviceDialog.mode === 'add' ? 'Add Service' : 'Edit Service'}</DialogTitle><DialogDescription>{serviceDialog.mode === 'add' ? 'Create a new service item.' : 'Update the service details.'}</DialogDescription></DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="space-y-2"><Label htmlFor="svc-title">Title</Label><Input id="svc-title" value={serviceForm.title} onChange={e => setServiceForm(p => ({ ...p, title: e.target.value }))} placeholder="Service title" className="futuristic-input" /></div>
                      <div className="space-y-2"><Label htmlFor="svc-desc">Description</Label><Textarea id="svc-desc" value={serviceForm.description} onChange={e => setServiceForm(p => ({ ...p, description: e.target.value }))} placeholder="Service description" rows={3} className="futuristic-input" /></div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="svc-icon">Icon Name</Label><Input id="svc-icon" value={serviceForm.icon} onChange={e => setServiceForm(p => ({ ...p, icon: e.target.value }))} placeholder="Globe" className="futuristic-input" /></div>
                        <div className="space-y-2"><Label htmlFor="svc-order">Order</Label><Input id="svc-order" type="number" value={serviceForm.order} onChange={e => setServiceForm(p => ({ ...p, order: parseInt(e.target.value) || 0 }))} className="futuristic-input" /></div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="svc-color">Color Class</Label><Input id="svc-color" value={serviceForm.color} onChange={e => setServiceForm(p => ({ ...p, color: e.target.value }))} placeholder="text-emerald-400" className="futuristic-input" /></div>
                        <div className="space-y-2"><Label htmlFor="svc-bg">Background Class</Label><Input id="svc-bg" value={serviceForm.bgColor} onChange={e => setServiceForm(p => ({ ...p, bgColor: e.target.value }))} placeholder="bg-emerald-500/10" className="futuristic-input" /></div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setServiceDialog(p => ({ ...p, open: false }))} className="border-neon/20">Cancel</Button>
                      <Button className="glow-button bg-neon/20 hover:bg-neon/30 text-neon border border-neon/30" onClick={handleSaveService} disabled={saving || !serviceForm.title.trim()}>{saving ? <span className="animate-spin mr-2 inline-block w-4 h-4 border-2 border-neon border-t-transparent rounded-full" /> : null}{serviceDialog.mode === 'add' ? 'Add Service' : 'Save Changes'}</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {/* Portfolio */}
            {activeTab === 'portfolio' && (
              <div>
                <SectionHeader title="Portfolio" subtitle="Manage your portfolio items" action={<Button size="sm" className="glow-button bg-neon/20 hover:bg-neon/30 text-neon border border-neon/30" onClick={() => openPortfolioDialog('add')}><Plus className="w-4 h-4 mr-1.5" />Add Portfolio Item</Button>} />
                {portfolioLoading ? <Spinner /> : portfolio.length === 0 ? (
                  <div className="text-center py-20"><Briefcase className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" /><h3 className="text-lg font-medium text-muted-foreground">No portfolio items yet</h3></div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
                    {portfolio.sort((a, b) => a.order - b.order).map(item => (
                      <Card key={item.id} className="glass-card border-border hover:border-neon/20 overflow-hidden">
                        <div className={`h-24 bg-gradient-to-r ${item.color} flex items-end p-4 relative`}>
                          {item.image && <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover opacity-30" />}
                          <div className="relative z-10"><Badge className="bg-white/20 text-white border-0 text-xs mb-1">{item.category}</Badge><h3 className="font-bold text-white text-sm">{item.title}</h3></div>
                          <div className="absolute top-2 right-2 flex gap-1 z-10">
                            <button onClick={() => openPortfolioDialog('edit', item)} className="w-7 h-7 rounded-md bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleDeletePortfolio(item.id)} disabled={deletingId === item.id} className="w-7 h-7 rounded-md bg-red-500/30 hover:bg-red-500/60 flex items-center justify-center text-white transition-colors">{deletingId === item.id ? <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" /> : <Trash2 className="w-3.5 h-3.5" />}</button>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                          {item.tech && <div className="mt-2 flex flex-wrap gap-1">{item.tech.split(',').map(t => <Badge key={t.trim()} variant="secondary" className="text-xs bg-neon/10 text-neon border-neon/20">{t.trim()}</Badge>)}</div>}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                <Dialog open={portfolioDialog.open} onOpenChange={o => setPortfolioDialog(p => ({ ...p, open: o }))}>
                  <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-dark-surface border-neon/20">
                    <DialogHeader><DialogTitle>{portfolioDialog.mode === 'add' ? 'Add Portfolio Item' : 'Edit Portfolio Item'}</DialogTitle><DialogDescription>{portfolioDialog.mode === 'add' ? 'Create a new portfolio item.' : 'Update the portfolio item.'}</DialogDescription></DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="pf-title">Title</Label><Input id="pf-title" value={portfolioForm.title} onChange={e => setPortfolioForm(p => ({ ...p, title: e.target.value }))} placeholder="Project title" className="futuristic-input" /></div>
                        <div className="space-y-2"><Label htmlFor="pf-category">Category</Label><Input id="pf-category" value={portfolioForm.category} onChange={e => setPortfolioForm(p => ({ ...p, category: e.target.value }))} placeholder="E-Commerce" className="futuristic-input" /></div>
                      </div>
                      <div className="space-y-2"><Label htmlFor="pf-desc">Description</Label><Textarea id="pf-desc" value={portfolioForm.description} onChange={e => setPortfolioForm(p => ({ ...p, description: e.target.value }))} placeholder="Project description" rows={3} className="futuristic-input" /></div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="pf-tech">Tech (comma-separated)</Label><Input id="pf-tech" value={portfolioForm.tech} onChange={e => setPortfolioForm(p => ({ ...p, tech: e.target.value }))} placeholder="Next.js, React" className="futuristic-input" /></div>
                        <div className="space-y-2"><Label htmlFor="pf-image">Image URL</Label><Input id="pf-image" value={portfolioForm.image} onChange={e => setPortfolioForm(p => ({ ...p, image: e.target.value }))} placeholder="/portfolio-image.png" className="futuristic-input" /></div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="pf-color">Gradient Class</Label><Input id="pf-color" value={portfolioForm.color} onChange={e => setPortfolioForm(p => ({ ...p, color: e.target.value }))} placeholder="from-emerald-500 to-emerald-700" className="futuristic-input" /></div>
                        <div className="space-y-2"><Label htmlFor="pf-order">Order</Label><Input id="pf-order" type="number" value={portfolioForm.order} onChange={e => setPortfolioForm(p => ({ ...p, order: parseInt(e.target.value) || 0 }))} className="futuristic-input" /></div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setPortfolioDialog(p => ({ ...p, open: false }))} className="border-neon/20">Cancel</Button>
                      <Button className="glow-button bg-neon/20 hover:bg-neon/30 text-neon border border-neon/30" onClick={handleSavePortfolio} disabled={saving || !portfolioForm.title.trim()}>{saving ? <span className="animate-spin mr-2 inline-block w-4 h-4 border-2 border-neon border-t-transparent rounded-full" /> : null}{portfolioDialog.mode === 'add' ? 'Add Item' : 'Save Changes'}</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {/* Testimonials */}
            {activeTab === 'testimonials' && (
              <div>
                <SectionHeader title="Testimonials" subtitle="Manage client testimonials" action={<Button size="sm" className="glow-button bg-neon/20 hover:bg-neon/30 text-neon border border-neon/30" onClick={() => openTestimonialDialog('add')}><Plus className="w-4 h-4 mr-1.5" />Add Testimonial</Button>} />
                {testimonialsLoading ? <Spinner /> : testimonials.length === 0 ? (
                  <div className="text-center py-20"><Star className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" /><h3 className="text-lg font-medium text-muted-foreground">No testimonials yet</h3></div>
                ) : (
                  <div className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
                    {testimonials.sort((a, b) => a.order - b.order).map(item => (
                      <Card key={item.id} className="glass-card border-border hover:border-neon/20 transition-colors">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-9 h-9 rounded-full bg-neon/10 border border-neon/20 flex items-center justify-center text-neon font-semibold text-xs shrink-0">{item.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</div>
                                <div><span className="font-semibold text-foreground">{item.name}</span><span className="text-sm text-muted-foreground ml-2">{item.company}</span></div>
                              </div>
                              <div className="flex gap-0.5 mb-2">{Array.from({ length: item.rating }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}</div>
                              <p className="text-sm text-muted-foreground italic line-clamp-3">&ldquo;{item.review}&rdquo;</p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <Button variant="ghost" size="sm" onClick={() => openTestimonialDialog('edit', item)} className="text-neon hover:text-neon/80 hover:bg-neon/10"><Pencil className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteTestimonial(item.id)} disabled={deletingId === item.id} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">{deletingId === item.id ? <span className="animate-spin inline-block w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full" /> : <Trash2 className="w-4 h-4" />}</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                <Dialog open={testimonialDialog.open} onOpenChange={o => setTestimonialDialog(p => ({ ...p, open: o }))}>
                  <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-dark-surface border-neon/20">
                    <DialogHeader><DialogTitle>{testimonialDialog.mode === 'add' ? 'Add Testimonial' : 'Edit Testimonial'}</DialogTitle><DialogDescription>{testimonialDialog.mode === 'add' ? 'Create a new testimonial.' : 'Update the testimonial.'}</DialogDescription></DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="tm-name">Name</Label><Input id="tm-name" value={testimonialForm.name} onChange={e => setTestimonialForm(p => ({ ...p, name: e.target.value }))} placeholder="Client name" className="futuristic-input" /></div>
                        <div className="space-y-2"><Label htmlFor="tm-company">Company</Label><Input id="tm-company" value={testimonialForm.company} onChange={e => setTestimonialForm(p => ({ ...p, company: e.target.value }))} placeholder="Company name" className="futuristic-input" /></div>
                      </div>
                      <div className="space-y-2"><Label htmlFor="tm-review">Review</Label><Textarea id="tm-review" value={testimonialForm.review} onChange={e => setTestimonialForm(p => ({ ...p, review: e.target.value }))} placeholder="Client review text" rows={4} className="futuristic-input" /></div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="tm-rating">Rating (1-5)</Label><Input id="tm-rating" type="number" min={1} max={5} value={testimonialForm.rating} onChange={e => setTestimonialForm(p => ({ ...p, rating: parseInt(e.target.value) || 5 }))} className="futuristic-input" /></div>
                        <div className="space-y-2"><Label htmlFor="tm-order">Order</Label><Input id="tm-order" type="number" value={testimonialForm.order} onChange={e => setTestimonialForm(p => ({ ...p, order: parseInt(e.target.value) || 0 }))} className="futuristic-input" /></div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setTestimonialDialog(p => ({ ...p, open: false }))} className="border-neon/20">Cancel</Button>
                      <Button className="glow-button bg-neon/20 hover:bg-neon/30 text-neon border border-neon/30" onClick={handleSaveTestimonial} disabled={saving || !testimonialForm.name.trim()}>{saving ? <span className="animate-spin mr-2 inline-block w-4 h-4 border-2 border-neon border-t-transparent rounded-full" /> : null}{testimonialDialog.mode === 'add' ? 'Add Testimonial' : 'Save Changes'}</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {/* Statistics */}
            {activeTab === 'statistics' && (
              <div>
                <SectionHeader title="Statistics" subtitle="Contact statistics and editable site stats" />
                <div className="mb-8">
                  <h3 className="text-base font-semibold text-foreground mb-4">Contact Statistics</h3>
                  {dashboardLoading ? <Spinner /> : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { label: 'Total Contacts', value: dashboard?.totalContacts ?? 0, icon: Users, color: 'text-neon', bg: 'bg-neon/10' },
                        { label: 'Today', value: dashboard?.todayContacts ?? 0, icon: Calendar, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                        { label: 'This Week', value: dashboard?.weekContacts ?? 0, icon: BarChart3, color: 'text-neon', bg: 'bg-neon/10' },
                        { label: 'This Month', value: dashboard?.monthContacts ?? 0, icon: BarChart3, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                      ].map((item, i) => (
                        <Card key={i} className="glass-card border-border"><CardContent className="p-4 md:p-6"><div className="flex items-center justify-between"><div><p className="text-xs md:text-sm text-muted-foreground">{item.label}</p><p className="text-2xl md:text-3xl font-bold text-foreground mt-1">{item.value}</p></div><div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl ${item.bg} flex items-center justify-center`}><item.icon className={`w-5 h-5 md:w-6 md:h-6 ${item.color}`} /></div></div></CardContent></Card>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-foreground">Site Stats</h3>
                    <Button size="sm" className="glow-button bg-neon/20 hover:bg-neon/30 text-neon border border-neon/30" onClick={() => openStatDialog('add')}><Plus className="w-4 h-4 mr-1.5" />Add Stat</Button>
                  </div>
                  {statsLoading ? <Spinner /> : stats.length === 0 ? (
                    <div className="text-center py-12"><BarChart3 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" /><p className="text-sm text-muted-foreground">No site stats yet</p></div>
                  ) : (
                    <div className="space-y-3">
                      {stats.sort((a, b) => a.order - b.order).map(stat => (
                        <Card key={stat.id} className="glass-card border-border hover:border-neon/20 transition-colors">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between gap-3 sm:gap-4">
                              <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-neon/10 border border-neon/20 flex items-center justify-center shrink-0"><span className="text-lg sm:text-xl font-bold text-neon">{stat.value}</span></div>
                                <div><p className="font-semibold text-foreground text-sm sm:text-base">{stat.label}</p><p className="text-xs text-muted-foreground">Order: {stat.order}</p></div>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <Button variant="ghost" size="sm" onClick={() => openStatDialog('edit', stat)} className="text-neon hover:text-neon/80 hover:bg-neon/10"><Pencil className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteStat(stat.id)} disabled={deletingId === stat.id} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">{deletingId === stat.id ? <span className="animate-spin inline-block w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full" /> : <Trash2 className="w-4 h-4" />}</Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
                <Dialog open={statDialog.open} onOpenChange={o => setStatDialog(p => ({ ...p, open: o }))}>
                  <DialogContent className="sm:max-w-md bg-dark-surface border-neon/20">
                    <DialogHeader><DialogTitle>{statDialog.mode === 'add' ? 'Add Stat' : 'Edit Stat'}</DialogTitle><DialogDescription>{statDialog.mode === 'add' ? 'Create a new site stat.' : 'Update the stat.'}</DialogDescription></DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="space-y-2"><Label htmlFor="st-value">Value</Label><Input id="st-value" value={statForm.value} onChange={e => setStatForm(p => ({ ...p, value: e.target.value }))} placeholder="150+" className="futuristic-input" /></div>
                      <div className="space-y-2"><Label htmlFor="st-label">Label</Label><Input id="st-label" value={statForm.label} onChange={e => setStatForm(p => ({ ...p, label: e.target.value }))} placeholder="Projects Delivered" className="futuristic-input" /></div>
                      <div className="space-y-2"><Label htmlFor="st-order">Order</Label><Input id="st-order" type="number" value={statForm.order} onChange={e => setStatForm(p => ({ ...p, order: parseInt(e.target.value) || 0 }))} className="futuristic-input" /></div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setStatDialog(p => ({ ...p, open: false }))} className="border-neon/20">Cancel</Button>
                      <Button className="glow-button bg-neon/20 hover:bg-neon/30 text-neon border border-neon/30" onClick={handleSaveStat} disabled={saving || !statForm.value.trim() || !statForm.label.trim()}>{saving ? <span className="animate-spin mr-2 inline-block w-4 h-4 border-2 border-neon border-t-transparent rounded-full" /> : null}{statDialog.mode === 'add' ? 'Add Stat' : 'Save Changes'}</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {/* Settings */}
            {activeTab === 'settings' && (
              <div>
                <SectionHeader title="Site Settings" subtitle="Manage your business information" />
                {settingsLoading ? <Spinner /> : (
                  <>
                    <Card className="glass-card border-border">
                      <CardContent className="p-4 sm:p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4 sm:mb-6">Business Information</h3>
                        <div className="space-y-5">
                          {[
                            { icon: Globe, label: 'Company Name', key: 'companyName' as const, placeholder: 'A-Star Infotech', type: 'input' },
                            { icon: MapPin, label: 'Address', key: 'address' as const, placeholder: 'Full business address', type: 'textarea' },
                            { icon: Phone, label: 'Phone', key: 'phone' as const, placeholder: '+91 0000000000', type: 'input' },
                            { icon: Mail, label: 'Primary Email', key: 'email' as const, placeholder: 'contact@astarinfotech.in', type: 'input' },
                            { icon: Mail, label: 'Secondary Email', key: 'secondaryEmail' as const, placeholder: 'infootechastar@gmail.com', type: 'input' },
                            { icon: Clock, label: 'Business Hours', key: 'hours' as const, placeholder: 'Mon – Sat: 10:00 AM – 7:00 PM', type: 'input' },
                          ].map(field => (
                            <div key={field.key} className="flex items-start gap-4">
                              <div className="w-10 h-10 shrink-0 rounded-lg bg-neon/10 border border-neon/20 flex items-center justify-center"><field.icon className="w-5 h-5 text-neon" /></div>
                              <div className="flex-1 space-y-2">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{field.label}</Label>
                                {field.type === 'textarea' ? (
                                  <Textarea value={siteSettings[field.key]} onChange={e => setSiteSettings(p => ({ ...p, [field.key]: e.target.value }))} placeholder={field.placeholder} rows={2} className="futuristic-input" />
                                ) : (
                                  <Input value={siteSettings[field.key]} onChange={e => setSiteSettings(p => ({ ...p, [field.key]: e.target.value }))} placeholder={field.placeholder} className="futuristic-input" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="glass-card border-border mt-4 sm:mt-6">
                      <CardContent className="p-4 sm:p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4 sm:mb-6 flex items-center gap-2"><Sparkles className="w-5 h-5 text-neon" />Hero Section</h3>
                        <div className="space-y-5">
                          {[
                            { icon: Sparkles, label: 'Badge Text', key: 'heroBadge' as const, placeholder: 'Building Smart Websites for Growing Businesses', type: 'input' },
                            { icon: Target, label: 'Main Heading', key: 'heroHeading' as const, placeholder: 'Transform Your Digital Presence With Us', type: 'input' },
                            { icon: Globe, label: 'Subtitle', key: 'heroSubtitle' as const, placeholder: 'We craft stunning, high-performance websites...', type: 'textarea' },
                          ].map(field => (
                            <div key={field.key} className="flex items-start gap-4">
                              <div className="w-10 h-10 shrink-0 rounded-lg bg-neon/10 border border-neon/20 flex items-center justify-center"><field.icon className="w-5 h-5 text-neon" /></div>
                              <div className="flex-1 space-y-2">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{field.label}</Label>
                                {field.type === 'textarea' ? <Textarea value={siteSettings[field.key]} onChange={e => setSiteSettings(p => ({ ...p, [field.key]: e.target.value }))} placeholder={field.placeholder} className="futuristic-input" rows={3} /> : <Input value={siteSettings[field.key]} onChange={e => setSiteSettings(p => ({ ...p, [field.key]: e.target.value }))} placeholder={field.placeholder} className="futuristic-input" />}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="glass-card border-border mt-4 sm:mt-6">
                      <CardContent className="p-4 sm:p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4 sm:mb-6 flex items-center gap-2"><Target className="w-5 h-5 text-neon" />About Section</h3>
                        <div className="space-y-5">
                          {[
                            { icon: Target, label: 'Heading', key: 'aboutHeading' as const, placeholder: 'We Build Digital Experiences That Matter', type: 'input' },
                            { icon: Globe, label: 'Description (Paragraph 1)', key: 'aboutDescription1' as const, placeholder: 'A-Star Infotech is a forward-thinking...', type: 'textarea' },
                            { icon: Globe, label: 'Description (Paragraph 2)', key: 'aboutDescription2' as const, placeholder: 'From startups finding their voice...', type: 'textarea' },
                            { icon: Eye, label: 'Vision', key: 'aboutVision' as const, placeholder: 'To be the most trusted digital partner...', type: 'textarea' },
                            { icon: Rocket, label: 'Mission', key: 'aboutMission' as const, placeholder: 'To deliver high-quality, affordable web solutions...', type: 'textarea' },
                            { icon: Heart, label: 'Core Values (comma-separated)', key: 'aboutValues' as const, placeholder: 'Innovation, Integrity, Excellence, Collaboration, Transparency', type: 'input' },
                          ].map(field => (
                            <div key={field.key} className="flex items-start gap-4">
                              <div className="w-10 h-10 shrink-0 rounded-lg bg-neon/10 border border-neon/20 flex items-center justify-center"><field.icon className="w-5 h-5 text-neon" /></div>
                              <div className="flex-1 space-y-2">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{field.label}</Label>
                                {field.type === 'textarea' ? <Textarea value={siteSettings[field.key]} onChange={e => setSiteSettings(p => ({ ...p, [field.key]: e.target.value }))} placeholder={field.placeholder} className="futuristic-input" rows={3} /> : <Input value={siteSettings[field.key]} onChange={e => setSiteSettings(p => ({ ...p, [field.key]: e.target.value }))} placeholder={field.placeholder} className="futuristic-input" />}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="glass-card border-border mt-4 sm:mt-6">
                      <CardContent className="p-4 sm:p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4 sm:mb-6 flex items-center gap-2"><Shield className="w-5 h-5 text-neon" />Why Choose Us Section</h3>
                        <div className="space-y-5">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 shrink-0 rounded-lg bg-neon/10 border border-neon/20 flex items-center justify-center"><Globe className="w-5 h-5 text-neon" /></div>
                            <div className="flex-1 space-y-2">
                              <Label className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Introduction Text</Label>
                              <Textarea value={siteSettings.whyChooseUsIntro} onChange={e => setSiteSettings(p => ({ ...p, whyChooseUsIntro: e.target.value }))} placeholder="We're not just another web development agency..." className="futuristic-input" rows={3} />
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-4 bg-neon/5 p-3 rounded-lg border border-neon/10">💡 To edit the individual "Why Choose Us" items and performance metrics, use the <strong>Statistics</strong> tab in the sidebar. The 6 feature cards (Experienced Team, Fast Delivery, etc.) and progress bars are managed there.</p>
                      </CardContent>
                    </Card>
                    <Card className="glass-card border-border mt-4 sm:mt-6">
                      <CardContent className="p-4 sm:p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4 sm:mb-6">Social Media Links</h3>
                        <div className="space-y-5">
                          {[
                            { icon: Facebook, label: 'Facebook URL', key: 'facebook' as const, placeholder: 'https://facebook.com/yourpage', iconColor: 'text-blue-400', iconBg: 'bg-blue-500/10 border-blue-500/20' },
                            { icon: Instagram, label: 'Instagram URL', key: 'instagram' as const, placeholder: 'https://instagram.com/yourprofile', iconColor: 'text-pink-400', iconBg: 'bg-pink-500/10 border-pink-500/20' },
                            { icon: Linkedin, label: 'LinkedIn URL', key: 'linkedin' as const, placeholder: 'https://linkedin.com/company/yourcompany', iconColor: 'text-sky-400', iconBg: 'bg-sky-500/10 border-sky-500/20' },
                            { icon: Youtube, label: 'YouTube URL', key: 'youtube' as const, placeholder: 'https://youtube.com/@yourchannel', iconColor: 'text-red-400', iconBg: 'bg-red-500/10 border-red-500/20' },
                          ].map(field => (
                            <div key={field.key} className="flex items-start gap-4">
                              <div className={`w-10 h-10 shrink-0 rounded-lg ${field.iconBg} border flex items-center justify-center`}><field.icon className={`w-5 h-5 ${field.iconColor}`} /></div>
                              <div className="flex-1 space-y-2">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{field.label}</Label>
                                <Input value={siteSettings[field.key]} onChange={e => setSiteSettings(p => ({ ...p, [field.key]: e.target.value }))} placeholder={field.placeholder} className="futuristic-input" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="glass-card border-border mt-4 sm:mt-6">
                      <CardContent className="p-4 sm:p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4 sm:mb-6">Brand Color</h3>
                        <div className="space-y-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 shrink-0 rounded-xl border-2 border-neon/20 shadow-sm" style={{ backgroundColor: siteSettings.brandColor || '#059669' }} />
                            <div className="flex-1 space-y-2">
                              <Label className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Hex Color Code</Label>
                              <div className="flex items-center gap-3">
                                <Input value={siteSettings.brandColor} onChange={e => setSiteSettings(p => ({ ...p, brandColor: e.target.value }))} placeholder="#059669" className="flex-1 futuristic-input" />
                                <input type="color" value={siteSettings.brandColor || '#059669'} onChange={e => setSiteSettings(p => ({ ...p, brandColor: e.target.value }))} className="w-10 h-10 rounded-lg border border-neon/20 cursor-pointer p-0.5 bg-transparent" aria-label="Color picker" />
                              </div>
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-3 block">Preset Colors</Label>
                            <div className="flex flex-wrap gap-3">
                              {[{ color: '#059669', label: 'Emerald' }, { color: '#06b6d4', label: 'Cyan' }, { color: '#7c3aed', label: 'Violet' }, { color: '#dc2626', label: 'Red' }, { color: '#ea580c', label: 'Orange' }, { color: '#ca8a04', label: 'Amber' }, { color: '#0d9488', label: 'Teal' }, { color: '#be185d', label: 'Pink' }].map(preset => (
                                <button key={preset.color} type="button" onClick={() => setSiteSettings(p => ({ ...p, brandColor: preset.color }))} className="group relative w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon/50" style={{ backgroundColor: preset.color, borderColor: siteSettings.brandColor === preset.color ? '#fff' : 'transparent' }} aria-label={`Select ${preset.label} color`} title={preset.label}>
                                  {siteSettings.brandColor === preset.color && <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">✓</span>}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="glass-card border-border mt-4 sm:mt-6">
                      <CardContent className="p-4 sm:p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2"><KeyRound className="w-5 h-5 text-neon" />Change Password</h3>
                        <p className="text-xs text-muted-foreground mb-4 sm:mb-5">Update your admin panel password. Changes take effect immediately.</p>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Current Password</Label>
                            <div className="relative">
                              <Input type={passwordVis.current ? 'text' : 'password'} placeholder="Enter current password" value={passwordForm.currentPassword} onChange={e => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))} className="futuristic-input h-11 pr-10" />
                              <button type="button" onClick={() => setPasswordVis(v => ({ ...v, current: !v.current }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Toggle visibility">
                                {passwordVis.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-medium">New Password</Label>
                            <div className="relative">
                              <Input type={passwordVis.new ? 'text' : 'password'} placeholder="Enter new password (min 6 characters)" value={passwordForm.newPassword} onChange={e => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))} className="futuristic-input h-11 pr-10" />
                              <button type="button" onClick={() => setPasswordVis(v => ({ ...v, new: !v.new }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Toggle visibility">
                                {passwordVis.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Confirm New Password</Label>
                            <div className="relative">
                              <Input type={passwordVis.confirm ? 'text' : 'password'} placeholder="Confirm new password" value={passwordForm.confirmPassword} onChange={e => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))} className="futuristic-input h-11 pr-10" />
                              <button type="button" onClick={() => setPasswordVis(v => ({ ...v, confirm: !v.confirm }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Toggle visibility">
                                {passwordVis.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                            {passwordForm.confirmPassword && passwordForm.newPassword && passwordForm.confirmPassword !== passwordForm.newPassword && (
                              <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
                            )}
                          </div>
                          <Button className="glow-button bg-neon/20 hover:bg-neon/30 text-neon border border-neon/30 min-h-[44px]" onClick={handleChangePassword} disabled={changingPassword || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword || passwordForm.newPassword !== passwordForm.confirmPassword}>
                            {changingPassword ? <><span className="animate-spin mr-2 inline-block w-4 h-4 border-2 border-neon border-t-transparent rounded-full" />Changing...</> : <><Shield className="w-4 h-4 mr-2" />Change Password</>}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    <div className="mt-4 sm:mt-6">
                      <Button className="glow-button bg-neon/20 hover:bg-neon/30 text-neon border border-neon/30 min-h-[44px]" onClick={handleSaveSettings} disabled={saving}>
                        {saving ? <><span className="animate-spin mr-2 inline-block w-4 h-4 border-2 border-neon border-t-transparent rounded-full" />Saving...</> : <><Save className="w-4 h-4 mr-2" />Save All Settings</>}
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
   Main Page Component - Futuristic Dark Theme
   ──────────────────────────────────────────── */

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
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
              <button
                onClick={() => setAdminOpen(true)}
                className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-foreground/60 hover:text-foreground hover:bg-neon/10 border border-border hover:border-neon/30 transition-all"
                aria-label="Admin Panel"
                title="Admin Panel"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </nav>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-md text-foreground hover:bg-neon/10 transition-colors" aria-label="Toggle menu">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }} transition={{ type: 'tween', duration: 0.3 }} className="fixed inset-0 z-[60] md:hidden bg-background/98 backdrop-blur-xl flex flex-col">
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
                    <button
                      onClick={() => { setAdminOpen(true); setMobileMenuOpen(false) }}
                      className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg hover:bg-neon/10 transition-colors text-foreground/60"
                      aria-label="Admin Panel"
                    >
                      <Lock className="w-5 h-5" /><span className="text-sm font-medium">Admin</span>
                    </button>
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
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Badge className="mb-4 sm:mb-6 bg-neon/10 text-neon border-neon/20 hover:bg-neon/20 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm"><Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 mr-1.5" />{siteSettings.heroBadge}</Badge>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight">
              {siteSettings.heroHeading}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-foreground/80 max-w-2xl leading-relaxed">
              {siteSettings.heroSubtitle}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a href="#contact"><Button size="lg" className="glow-button bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 sm:px-8 h-12 sm:h-13 text-sm sm:text-base shadow-lg shadow-amber-500/25">Start Your Project<ArrowRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5" /></Button></a>
              <a href="#portfolio"><Button size="lg" variant="outline" className="border-foreground/20 text-foreground bg-foreground/5 hover:bg-foreground/10 hover:text-foreground hover:border-foreground/40 px-6 sm:px-8 h-12 sm:h-13 text-sm sm:text-base backdrop-blur-sm">View Our Work<ExternalLink className="ml-2 w-4 h-4" /></Button></a>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="mt-10 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 sm:gap-8">
              {statItems.map(stat => (
                <div key={stat.label} className="text-center sm:text-left">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-neon animate-neon-pulse">{stat.value}</div>
                  <div className="text-[11px] sm:text-xs md:text-sm text-muted-foreground mt-0.5 sm:mt-1">{stat.label}</div>
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
            <div className="lg:col-span-3">
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
                  <div className="space-y-4 sm:space-y-5">
                    {[
                      { icon: MapPin, label: 'Office Address', value: siteSettings.address, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteSettings.address)}` },
                      { icon: Phone, label: 'Phone Number', value: siteSettings.phone, href: `tel:${siteSettings.phone}` },
                      { icon: Mail, label: 'Email', value: siteSettings.email, href: `mailto:${siteSettings.email}` },

                      { icon: Clock, label: 'Business Hours', value: siteSettings.hours, href: '' },
                    ].map((item, i) => (
                      <a key={i} href={item.href || undefined} target={item.href && item.href.startsWith('http') ? '_blank' : undefined} rel={item.href && item.href.startsWith('http') ? 'noopener noreferrer' : undefined} className="flex items-start gap-3 sm:gap-4 group cursor-pointer">
                        <div className="w-10 h-10 shrink-0 rounded-lg bg-neon/10 border border-neon/20 flex items-center justify-center group-hover:bg-neon/20 group-hover:border-neon/30 transition-colors"><item.icon className="w-5 h-5 text-neon" /></div>
                        <div><div className="font-medium text-foreground text-xs sm:text-sm">{item.label}</div><div className="text-xs sm:text-sm text-muted-foreground mt-0.5 group-hover:text-neon transition-colors">{item.value}</div></div>
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
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Follow Us</h3>
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
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="py-12 sm:py-16 lg:py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
            {/* Company Info */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-5">
                <img src="/logo.png" alt="A-Star Infotech Logo" className="w-10 h-10 rounded-lg object-contain" />
                <div>
                  <div className="font-bold text-foreground text-lg leading-tight">A-Star</div>
                  <div className="text-xs text-neon font-medium tracking-wider uppercase">Infotech</div>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">Building smart websites for growing businesses. Your trusted partner for all digital solutions.</p>
              <div className="mt-5 flex gap-3">
                {siteSettings.facebook && <a href={siteSettings.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-dark-card hover:bg-neon/10 border border-border hover:border-neon/30 flex items-center justify-center transition-all duration-200" aria-label="Facebook"><Facebook className="w-4 h-4 text-muted-foreground hover:text-neon" /></a>}
                {siteSettings.instagram && <a href={siteSettings.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-dark-card hover:bg-neon/10 border border-border hover:border-neon/30 flex items-center justify-center transition-all duration-200" aria-label="Instagram"><Instagram className="w-4 h-4 text-muted-foreground hover:text-neon" /></a>}
                {siteSettings.linkedin && <a href={siteSettings.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-dark-card hover:bg-neon/10 border border-border hover:border-neon/30 flex items-center justify-center transition-all duration-200" aria-label="LinkedIn"><Linkedin className="w-4 h-4 text-muted-foreground hover:text-neon" /></a>}
                {siteSettings.youtube && <a href={siteSettings.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-dark-card hover:bg-neon/10 border border-border hover:border-neon/30 flex items-center justify-center transition-all duration-200" aria-label="YouTube"><Youtube className="w-4 h-4 text-muted-foreground hover:text-neon" /></a>}
              </div>
            </div>
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-3">
                {NAV_LINKS.map(link => (
                  <li key={link.href}>
                    <a href={link.href} className="text-sm text-muted-foreground hover:text-neon transition-colors inline-flex items-center gap-2 group">
                      <ChevronRight className="w-3 h-3 text-neon/0 group-hover:text-neon/60 transition-colors" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Our Services */}
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Our Services</h4>
              <ul className="space-y-3">
                {services.map(s => (
                  <li key={s.title}>
                    <a href="#services" className="text-sm text-muted-foreground hover:text-neon transition-colors inline-flex items-center gap-2 group">
                      <ChevronRight className="w-3 h-3 text-neon/0 group-hover:text-neon/60 transition-colors" />
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Contact Info */}
            <div className="sm:col-span-2 lg:col-span-1">
              <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Contact Info</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteSettings.address)}`} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 group">
                    <div className="w-8 h-8 rounded-lg bg-neon/5 border border-border flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-neon/10 group-hover:border-neon/20 transition-colors">
                      <MapPin className="w-3.5 h-3.5 text-neon/60 group-hover:text-neon transition-colors" />
                    </div>
                    <span className="text-sm text-muted-foreground leading-relaxed pt-1 group-hover:text-neon transition-colors">{siteSettings.address}</span>
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neon/5 border border-border flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5 text-neon/60" />
                  </div>
                  <a href={`tel:${siteSettings.phone}`} className="text-sm text-muted-foreground hover:text-neon transition-colors pt-0.5">{siteSettings.phone}</a>
                </li>
                <li className="flex items-center gap-3">
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
          <div className="border-t border-border py-6 sm:py-8 flex flex-col sm:flex-row justify-between items-center gap-4 sm:pr-16">
            <p className="text-sm text-muted-foreground/70">&copy; {new Date().getFullYear()} A-Star Infotech. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-muted-foreground/70">
              <button onClick={() => window.openLegal?.('privacy')} className="hover:text-neon transition-colors">Privacy Policy</button>
              <span className="text-foreground/10">|</span>
              <button onClick={() => window.openLegal?.('terms')} className="hover:text-neon transition-colors">Terms of Service</button>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Button */}
      <a href="https://wa.me/918560074448?text=Hello%20A-Star%20Infotech!%20I%20am%20interested%20in%20your%20web%20development%20services." target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 whatsapp-pulse" aria-label="Chat on WhatsApp">
        <div className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:scale-110 transition-transform"><MessageCircle className="w-7 h-7 text-white" /></div>
      </a>

      <AdminPanel externalOpen={adminOpen} onExternalClose={() => setAdminOpen(false)} />

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
