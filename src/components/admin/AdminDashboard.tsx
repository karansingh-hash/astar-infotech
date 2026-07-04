'use client'

import { useState, useEffect, FormEvent } from 'react'
import {
  Menu, X, Code2, Globe, ShoppingCart, Smartphone, Settings, Search,
  Star, MapPin, Phone, Mail, Clock, Users, Award, Zap,
  Heart, ChevronRight, Send, ExternalLink, Facebook, Instagram,
  Linkedin, Youtube, MessageCircle, Sparkles, Target,
  Shield, Rocket, Eye, Trash2, Inbox, Lock, LayoutDashboard,
  BarChart3, LogOut, Calendar, MailCheck, PhoneCall, Briefcase,
  Plus, Pencil, Wrench, Save, Sun, Moon, EyeOff, KeyRound, ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useTheme } from 'next-themes'

/* ── Admin Types & Constants ── */
type AdminTab = 'dashboard' | 'inquiries' | 'services' | 'portfolio' | 'testimonials' | 'statistics' | 'settings'

interface ContactItem { id: string; name: string; email: string; phone: string | null; message: string; createdAt: string }
interface ServiceItem { id: string; title: string; description: string; icon: string; color: string; bgColor: string; image: string; order: number }
interface PortfolioItem { id: string; title: string; category: string; description: string; tech: string; color: string; image: string; order: number }
interface TestimonialItem { id: string; name: string; company: string; review: string; rating: number; order: number }
interface StatItem { id: string; value: string; label: string; order: number }
interface DashboardData { totalContacts: number; totalServices: number; totalPortfolio: number; totalTestimonials: number; todayContacts: number; weekContacts: number; monthContacts: number; recentContacts: ContactItem[] }
interface SiteSettings { companyName: string; address: string; phone: string; email: string; secondaryEmail: string; hours: string; facebook: string; instagram: string; linkedin: string; youtube: string; brandColor: string; heroBadge: string; heroHeading: string; heroSubtitle: string; aboutHeading: string; aboutDescription1: string; aboutDescription2: string; aboutVision: string; aboutMission: string; aboutValues: string; whyChooseUsIntro: string }

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
  heroBadge: '',
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

const TAB_CONFIG: { key: AdminTab; label: string; icon: React.ElementType }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'inquiries', label: 'Inquiries', icon: Inbox },
  { key: 'services', label: 'Services', icon: Globe },
  { key: 'portfolio', label: 'Portfolio', icon: Briefcase },
  { key: 'testimonials', label: 'Testimonials', icon: Star },
  { key: 'statistics', label: 'Statistics', icon: BarChart3 },
  { key: 'settings', label: 'Site Settings', icon: Wrench },
]

export default function AdminDashboard({ mode = 'modal', externalOpen, onExternalClose }: { mode?: 'modal' | 'page'; externalOpen?: boolean; onExternalClose?: () => void }) {
  const isPage = mode === 'page'
  const [isOpen, setIsOpen] = useState(mode === 'page')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminToken, setAdminToken] = useState<string>('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false)
  const [totpCode, setTotpCode] = useState('')
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [resetTotpCode, setResetTotpCode] = useState('')
  const [resetNewPassword, setResetNewPassword] = useState('')
  const [resetConfirmPassword, setResetConfirmPassword] = useState('')
  const [showResetNewPassword, setShowResetNewPassword] = useState(false)
  const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false)
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false)
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
  const [serviceForm, setServiceForm] = useState({ title: '', description: '', icon: '', color: '', bgColor: '', image: '', order: 0 })
  const [portfolioForm, setPortfolioForm] = useState({ title: '', category: '', description: '', tech: '', color: '', image: '', order: 0 })
  const [testimonialForm, setTestimonialForm] = useState({ name: '', company: '', review: '', rating: 5, order: 0 })
  const [statForm, setStatForm] = useState({ value: '', label: '', order: 0 })
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [passwordVis, setPasswordVis] = useState({ current: false, new: false, confirm: false })
  const [changingPassword, setChangingPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [twoFactorSetup, setTwoFactorSetup] = useState<{ qrCode: string; secret: string } | null>(null)
  const [twoFactorVerifyCode, setTwoFactorVerifyCode] = useState('')
  const [twoFactorLoading, setTwoFactorLoading] = useState(false)
  const [disable2faForm, setDisable2faForm] = useState({ password: '', code: '' })

  useEffect(() => {
    const token = sessionStorage.getItem('admin_token')
    if (token) {
      // Validate existing token
      fetch('/api/admin/auth', { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } })
        .then(r => { if (r.ok) { setAdminToken(token); setIsAuthenticated(true) } else { sessionStorage.removeItem('admin_token') } })
        .catch(() => sessionStorage.removeItem('admin_token'))
    }
  }, [])
  useEffect(() => { if (mode === 'page' || externalOpen) setIsOpen(true) }, [externalOpen, mode])
  useEffect(() => {
    if (!isOpen || !isAuthenticated) return
    if (activeTab === 'dashboard') fetchDashboard()
    if (activeTab === 'inquiries') fetchContacts()
    if (activeTab === 'services') fetchServices()
    if (activeTab === 'portfolio') fetchPortfolio()
    if (activeTab === 'testimonials') fetchTestimonials()
    if (activeTab === 'statistics') { fetchDashboard(); fetchStats() }
    if (activeTab === 'settings') { fetchSettings(); fetchTwoFactorStatus() }
  }, [isOpen, isAuthenticated, activeTab])

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    // Reset mode handles its own submission via handleResetPassword
    if (showResetPassword) return
    if (requiresTwoFactor) {
      // Step 2: Verify TOTP code
      if (!totpCode.trim() || totpCode.replace(/\D/g, '').length !== 6) { toast.error('Invalid Code', { description: 'Please enter the 6-digit code from Google Authenticator.' }); return }
      setAuthLoading(true)
      try {
        const res = await fetch('/api/admin/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password, totpCode }) })
        const data = await res.json()
        if (res.ok && data.success && data.token) {
          setAdminToken(data.token); setIsAuthenticated(true); sessionStorage.setItem('admin_token', data.token); setPassword(''); setTotpCode(''); setRequiresTwoFactor(false); toast.success('Login Successful', { description: 'Welcome to the Admin Panel!' })
        } else toast.error('Login Failed', { description: data.error || 'Invalid authentication code.' })
      } catch { toast.error('Error', { description: 'Failed to connect to server.' }) } finally { setAuthLoading(false) }
      return
    }
    if (!password.trim()) return; setAuthLoading(true)
    try {
      const res = await fetch('/api/admin/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
      const data = await res.json()
      if (res.ok && data.success && data.token) {
        setAdminToken(data.token); setIsAuthenticated(true); sessionStorage.setItem('admin_token', data.token); setPassword(''); toast.success('Login Successful', { description: 'Welcome to the Admin Panel!' })
      } else if (data.requiresTwoFactor) {
        // 2FA required — show TOTP input
        setRequiresTwoFactor(true); setAuthLoading(false); toast.info('Two-Factor Authentication', { description: 'Enter the code from your Google Authenticator app.' })
      } else toast.error('Login Failed', { description: data.error || 'Invalid password.' })
    } catch { toast.error('Error', { description: 'Failed to connect to server.' }) } finally { setAuthLoading(false) }
  }
  const handleLogout = async () => {
    try { await fetch('/api/admin/auth', { method: 'DELETE', headers: { 'Authorization': `Bearer ${adminToken}` } }) } catch {}
    setIsAuthenticated(false); setAdminToken(''); sessionStorage.removeItem('admin_token'); setIsOpen(false); setActiveTab('dashboard'); setSidebarOpen(false); setRequiresTwoFactor(false); setTotpCode(''); setShowResetPassword(false); setResetTotpCode(''); setResetNewPassword(''); setResetConfirmPassword(''); setContacts([]); setServices([]); setPortfolio([]); setTestimonials([]); setStats([]); setDashboard(null); onExternalClose?.(); toast.success('Logged Out', { description: 'You have been logged out successfully.' })
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

  const openServiceDialog = (mode: 'add' | 'edit', item?: ServiceItem) => { if (mode === 'edit' && item) { setServiceForm({ title: item.title, description: item.description, icon: item.icon, color: item.color, bgColor: item.bgColor, image: item.image || '', order: item.order }); setServiceDialog({ open: true, mode: 'edit', item }) } else { setServiceForm({ title: '', description: '', icon: 'Globe', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', image: '', order: services.length }); setServiceDialog({ open: true, mode: 'add', item: null }) } }
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

  // ─── 2FA Handlers ───
  const fetchTwoFactorStatus = async () => {
    try {
      const r = await fetch('/api/admin/2fa/status', { headers: { 'Authorization': `Bearer ${adminToken}` } })
      if (r.ok) { const d = await r.json(); setTwoFactorEnabled(d.enabled) }
    } catch {}
  }
  const handleSetup2FA = async () => {
    setTwoFactorLoading(true)
    try {
      const r = await fetch('/api/admin/2fa/setup', { method: 'POST', headers: authHeaders() })
      const d = await r.json()
      if (r.ok && d.success) { setTwoFactorSetup({ qrCode: d.qrCode, secret: d.secret }); toast.info('Scan QR Code', { description: 'Open Google Authenticator and scan this code.' }) }
      else toast.error('Error', { description: d.error || 'Failed to set up 2FA.' })
    } catch { toast.error('Error', { description: 'Failed to connect to server.' }) }
    finally { setTwoFactorLoading(false) }
  }
  const handleVerify2FA = async () => {
    if (twoFactorVerifyCode.replace(/\D/g, '').length !== 6) { toast.error('Invalid Code', { description: 'Enter the 6-digit code.' }); return }
    setTwoFactorLoading(true)
    try {
      const r = await fetch('/api/admin/2fa/verify', { method: 'POST', headers: authHeaders(), body: JSON.stringify({ token: twoFactorVerifyCode }) })
      const d = await r.json()
      if (r.ok && d.success) { setTwoFactorEnabled(true); setTwoFactorSetup(null); setTwoFactorVerifyCode(''); toast.success('2FA Enabled', { description: 'Two-factor authentication is now active!' }) }
      else toast.error('Error', { description: d.error || 'Invalid code.' })
    } catch { toast.error('Error', { description: 'Failed to connect to server.' }) }
    finally { setTwoFactorLoading(false) }
  }
  const handleDisable2FA = async () => {
    if (!disable2faForm.password || disable2faForm.code.replace(/\D/g, '').length !== 6) { toast.error('Error', { description: 'Password and 6-digit code required.' }); return }
    setTwoFactorLoading(true)
    try {
      const r = await fetch('/api/admin/2fa/disable', { method: 'POST', headers: authHeaders(), body: JSON.stringify({ password: disable2faForm.password, token: disable2faForm.code }) })
      const d = await r.json()
      if (r.ok && d.success) { setTwoFactorEnabled(false); setDisable2faForm({ password: '', code: '' }); toast.success('2FA Disabled', { description: 'Two-factor authentication has been turned off.' }) }
      else toast.error('Error', { description: d.error || 'Failed to disable 2FA.' })
    } catch { toast.error('Error', { description: 'Failed to connect to server.' }) }
    finally { setTwoFactorLoading(false) }
  }

  // ─── Reset Admin Password via Google Authenticator ───
  const handleResetPassword = async () => {
    const cleanCode = resetTotpCode.replace(/\D/g, '')
    if (cleanCode.length !== 6) { toast.error('Invalid Code', { description: 'Please enter the 6-digit code from Google Authenticator.' }); return }
    if (resetNewPassword.length < 8 || resetNewPassword.length > 128) { toast.error('Invalid Password', { description: 'New password must be at least 8 characters long.' }); return }
    if (resetNewPassword !== resetConfirmPassword) { toast.error('Passwords Do Not Match', { description: 'The new password and confirmation do not match.' }); return }
    setResetPasswordLoading(true)
    try {
      const r = await fetch('/api/admin/password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ totpCode: cleanCode, newPassword: resetNewPassword }),
      })
      const d = await r.json()
      if (r.ok && d.success) {
        toast.success('Password Reset Successful', { description: 'Your admin password has been updated. You can now log in with your new password and Google Authenticator code.' })
        // Return to the password login screen
        setShowResetPassword(false)
        setRequiresTwoFactor(false)
        setResetTotpCode('')
        setResetNewPassword('')
        setResetConfirmPassword('')
        setPassword('')
      } else {
        toast.error('Reset Failed', { description: d.error || 'Failed to reset password.' })
      }
    } catch { toast.error('Error', { description: 'Failed to connect to server.' }) }
    finally { setResetPasswordLoading(false) }
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
        <div className={isPage ? 'min-h-screen flex items-center justify-center p-4' : 'fixed inset-0 z-[9999] bg-background flex items-center justify-center p-4'}>
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
                {showResetPassword ? (
                  <div className="space-y-3">
                    <div className="bg-neon/5 border border-neon/20 rounded-lg p-3 flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-neon shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Reset Admin Password</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Forgot your password? Enter your Google Authenticator code and a new password to regain access to the admin panel.</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="reset-totp" className="text-sm font-medium text-foreground">Google Authenticator Code</label>
                      <Input
                        id="reset-totp"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        placeholder="000000"
                        value={resetTotpCode}
                        onChange={(e) => setResetTotpCode(e.target.value.replace(/\D/g, ''))}
                        autoFocus
                        disabled={resetPasswordLoading}
                        className="futuristic-input h-12 text-center text-2xl tracking-[0.5em] font-mono"
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleResetPassword() } }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="reset-newpw" className="text-sm font-medium text-foreground">New Password</label>
                      <div className="relative">
                        <Input
                          id="reset-newpw"
                          type={showResetNewPassword ? 'text' : 'password'}
                          placeholder="Enter new password (min 8 chars)"
                          value={resetNewPassword}
                          onChange={(e) => setResetNewPassword(e.target.value)}
                          disabled={resetPasswordLoading}
                          className="futuristic-input h-11 pr-11"
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleResetPassword() } }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowResetNewPassword((s) => !s)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-neon transition-colors focus:outline-none focus:text-neon"
                          tabIndex={-1}
                          aria-label={showResetNewPassword ? 'Hide password' : 'Show password'}
                        >
                          {showResetNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="reset-confirmpw" className="text-sm font-medium text-foreground">Confirm New Password</label>
                      <div className="relative">
                        <Input
                          id="reset-confirmpw"
                          type={showResetConfirmPassword ? 'text' : 'password'}
                          placeholder="Re-enter new password"
                          value={resetConfirmPassword}
                          onChange={(e) => setResetConfirmPassword(e.target.value)}
                          disabled={resetPasswordLoading}
                          className="futuristic-input h-11 pr-11"
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleResetPassword() } }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowResetConfirmPassword((s) => !s)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-neon transition-colors focus:outline-none focus:text-neon"
                          tabIndex={-1}
                          aria-label={showResetConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                          {showResetConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <Button type="button" onClick={handleResetPassword} className="w-full glow-button bg-neon/20 hover:bg-neon/30 text-neon border border-neon/30 h-11" disabled={resetPasswordLoading || resetTotpCode.replace(/\D/g, '').length !== 6 || !resetNewPassword.trim() || !resetConfirmPassword.trim()}>
                      {resetPasswordLoading ? <><span className="animate-spin mr-2 inline-block w-4 h-4 border-2 border-neon border-t-transparent rounded-full" />Resetting...</> : <><ShieldCheck className="w-4 h-4 mr-2" />Reset Password</>}
                    </Button>
                    <button type="button" onClick={() => { setShowResetPassword(false); setResetTotpCode(''); setResetNewPassword(''); setResetConfirmPassword('') }} className="text-xs text-muted-foreground hover:text-neon transition-colors w-full text-left">
                      ← Back to login
                    </button>
                  </div>
                ) : !requiresTwoFactor ? (
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
                    <button type="button" onClick={() => { setShowResetPassword(true); setPassword(''); setRequiresTwoFactor(false) }} className="text-xs text-neon/80 hover:text-neon transition-colors w-full text-left">
                      Forgot password? Reset with Google Authenticator →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-neon/5 border border-neon/20 rounded-lg p-3 flex items-start gap-3">
                      <Smartphone className="w-5 h-5 text-neon shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Enter the 6-digit code from your Google Authenticator app.</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="totp-code" className="text-sm font-medium text-foreground">Authenticator Code</label>
                      <Input
                        id="totp-code"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        placeholder="000000"
                        value={totpCode}
                        onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                        autoFocus
                        disabled={authLoading}
                        className="futuristic-input h-12 text-center text-2xl tracking-[0.5em] font-mono"
                      />
                    </div>
                    <button type="button" onClick={() => { setRequiresTwoFactor(false); setTotpCode('') }} className="text-xs text-muted-foreground hover:text-neon transition-colors w-full text-left">
                      ← Back to password
                    </button>
                  </div>
                )}
                {!showResetPassword && (
                <Button type="submit" className="w-full glow-button bg-neon/20 hover:bg-neon/30 text-neon border border-neon/30 h-11" disabled={authLoading || (!requiresTwoFactor ? !password.trim() : totpCode.replace(/\D/g, '').length !== 6)}>
                  {authLoading ? <><span className="animate-spin mr-2 inline-block w-4 h-4 border-2 border-neon border-t-transparent rounded-full" />Verifying...</> : <>{requiresTwoFactor ? <><ShieldCheck className="w-4 h-4 mr-2" />Verify Code</> : <><Lock className="w-4 h-4 mr-2" />Login</>}</>}
                </Button>
                )}
              </form>
              {!isPage && <Button variant="ghost" className="w-full mt-3 text-muted-foreground" onClick={() => { setIsOpen(false); setPassword(''); setRequiresTwoFactor(false); setTotpCode(''); setShowResetPassword(false); setResetTotpCode(''); setResetNewPassword(''); setResetConfirmPassword('') }}>Cancel</Button>}
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  return (
    <>
      <div className={isPage ? 'min-h-screen bg-background flex' : 'fixed inset-0 z-[9999] bg-background flex'}>
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
            <button onClick={() => isPage ? (window.location.href = '/') : (setIsOpen(false), setSidebarOpen(false), onExternalClose?.())} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-neon/5 hover:text-foreground transition-colors"><Eye className="w-5 h-5" />View Website</button>
          </div>
        </aside>
        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b border-border bg-dark-surface shrink-0 flex items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2.5 -ml-2 rounded-md hover:bg-neon/5 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Open sidebar"><Menu className="w-5 h-5 text-foreground" /></button>
              <h1 className="text-lg font-semibold text-foreground capitalize">{activeTab === 'inquiries' ? 'Inquiries' : activeTab}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => isPage ? (window.location.href = '/') : (setIsOpen(false), onExternalClose?.())} className="text-muted-foreground hidden sm:flex hover:bg-neon/5"><Eye className="w-4 h-4 mr-1.5" />View Website</Button>
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2.5 rounded-lg hover:bg-neon/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Toggle theme"
                  title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-foreground" />}
                </button>
              )}
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-lg hover:bg-red-500/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
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
                              <div className="flex items-center gap-2 sm:gap-4 mt-2 text-xs text-muted-foreground ml-0 sm:ml-11 flex-wrap">
                                <span className="flex items-center gap-1"><MailCheck className="w-3.5 h-3.5" /><a href={`mailto:${c.email}`} className="hover:text-neon transition-colors break-all">{c.email}</a></span>
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
                      <div className="space-y-2"><Label htmlFor="svc-image">Image URL</Label><Input id="svc-image" value={serviceForm.image} onChange={e => setServiceForm(p => ({ ...p, image: e.target.value }))} placeholder="/service-web-design.png" className="futuristic-input" /></div>
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
                            { icon: Mail, label: 'Secondary Email', key: 'secondaryEmail' as const, placeholder: 'secondary@example.com', type: 'input' },
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
                            { icon: Sparkles, label: 'Badge Text', key: 'heroBadge' as const, placeholder: 'Optional small badge text shown above the hero heading', type: 'input' },
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
                    {/* ─── Two-Factor Authentication Card ─── */}
                    <Card className="glass-card border-neon/20 mt-6">
                      <CardContent className="p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-neon" />Two-Factor Authentication (2FA)</h3>
                        <p className="text-sm text-muted-foreground mb-4">Add an extra layer of security. After enabling, you&rsquo;ll need a 6-digit code from Google Authenticator on every login.</p>
                        {/* Status badge */}
                        <div className="flex items-center gap-2 mb-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${twoFactorEnabled ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${twoFactorEnabled ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                            {twoFactorEnabled ? 'Enabled' : 'Not Enabled'}
                          </span>
                        </div>
                        {/* If not enabled and no setup in progress: show Enable button */}
                        {!twoFactorEnabled && !twoFactorSetup && (
                          <Button className="glow-button bg-neon/20 hover:bg-neon/30 text-neon border border-neon/30 min-h-[44px]" onClick={handleSetup2FA} disabled={twoFactorLoading}>
                            {twoFactorLoading ? <><span className="animate-spin mr-2 inline-block w-4 h-4 border-2 border-neon border-t-transparent rounded-full" />Loading...</> : <><Smartphone className="w-4 h-4 mr-2" />Enable 2FA</>}
                          </Button>
                        )}
                        {/* If setup in progress: show QR code + verify */}
                        {!twoFactorEnabled && twoFactorSetup && (
                          <div className="space-y-4">
                            <div className="bg-white p-3 rounded-lg inline-block">
                              <img src={twoFactorSetup.qrCode} alt="2FA QR Code" className="w-40 h-40 sm:w-48 sm:h-48" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">Can&rsquo;t scan? Enter this key manually in Google Authenticator:</p>
                              <code className="block bg-dark-card border border-border rounded px-3 py-2 text-xs font-mono text-neon break-all">{twoFactorSetup.secret}</code>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground">Enter 6-digit code from app to confirm</label>
                              <Input type="text" inputMode="numeric" maxLength={6} placeholder="000000" value={twoFactorVerifyCode} onChange={e => setTwoFactorVerifyCode(e.target.value.replace(/\D/g, ''))} className="futuristic-input h-12 text-center text-2xl tracking-[0.5em] font-mono" disabled={twoFactorLoading} />
                            </div>
                            <div className="flex gap-2">
                              <Button className="glow-button bg-neon/20 hover:bg-neon/30 text-neon border border-neon/30" onClick={handleVerify2FA} disabled={twoFactorLoading || twoFactorVerifyCode.length !== 6}>
                                {twoFactorLoading ? <><span className="animate-spin mr-2 inline-block w-4 h-4 border-2 border-neon border-t-transparent rounded-full" />Verifying...</> : <><ShieldCheck className="w-4 h-4 mr-2" />Confirm &amp; Enable</>}
                              </Button>
                              <Button variant="ghost" className="text-muted-foreground" onClick={() => { setTwoFactorSetup(null); setTwoFactorVerifyCode('') }} disabled={twoFactorLoading}>Cancel</Button>
                            </div>
                          </div>
                        )}
                        {/* If enabled: show Disable section */}
                        {twoFactorEnabled && (
                          <div className="space-y-3 border-t border-border pt-4">
                            <p className="text-sm font-medium text-foreground">Disable 2FA (requires password + current code)</p>
                            <Input type="password" placeholder="Current admin password" value={disable2faForm.password} onChange={e => setDisable2faForm(f => ({ ...f, password: e.target.value }))} className="futuristic-input h-11" disabled={twoFactorLoading} />
                            <Input type="text" inputMode="numeric" maxLength={6} placeholder="6-digit authenticator code" value={disable2faForm.code} onChange={e => setDisable2faForm(f => ({ ...f, code: e.target.value.replace(/\D/g, '') }))} className="futuristic-input h-11 text-center text-lg tracking-[0.3em] font-mono" disabled={twoFactorLoading} />
                            <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 min-h-[44px]" onClick={handleDisable2FA} disabled={twoFactorLoading || !disable2faForm.password || disable2faForm.code.length !== 6}>
                              {twoFactorLoading ? <><span className="animate-spin mr-2 inline-block w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full" />Disabling...</> : <><Shield className="w-4 h-4 mr-2" />Disable 2FA</>}
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
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
