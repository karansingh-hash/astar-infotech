'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  X,
  Lock,
  LogOut,
  LayoutDashboard,
  Users,
  Briefcase,
  Star,
  BarChart3,
  Settings,
  Mail,
  Phone,
  MapPin,
  Clock,
  Save,
  Plus,
  Trash2,
  Edit3,
  Check,
  ChevronLeft,
  Globe,
  Code2,
  ShoppingCart,
  Smartphone,
  Search,
  Award,
  Zap,
  Shield,
  Heart,
  Target,
  Rocket,
  Sparkles,
  MessageCircle,
  Inbox,
  RefreshCw,
  ExternalLink,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

/* ────────────────────────────────────────────
   Types
   ──────────────────────────────────────────── */

interface SiteSettings {
  [key: string]: string
}

interface ServiceItem {
  id: string
  icon: string
  title: string
  description: string
  color: string
  bg: string
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

interface ContactItem {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  createdAt: string
}

interface ContentData {
  settings: SiteSettings
  services: ServiceItem[]
  portfolio: PortfolioItem[]
  testimonials: TestimonialItem[]
  stats: StatItem[]
  contacts: ContactItem[]
}

type TabId = 'dashboard' | 'contacts' | 'services' | 'portfolio' | 'testimonials' | 'stats' | 'settings'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe, Code2, ShoppingCart, Smartphone, Settings, Search,
  Award, Zap, Shield, Heart, Target, Rocket, Sparkles,
}

const ICON_OPTIONS = ['Globe', 'Code2', 'ShoppingCart', 'Smartphone', 'Settings', 'Search', 'Award', 'Zap', 'Shield', 'Heart', 'Target', 'Rocket']

const COLOR_OPTIONS = [
  { label: 'Emerald', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Amber', color: 'text-amber-600', bg: 'bg-amber-50' },
]

const GRADIENT_OPTIONS = [
  'from-emerald-500 to-emerald-700',
  'from-amber-500 to-amber-700',
  'from-emerald-600 to-teal-700',
  'from-orange-500 to-amber-700',
  'from-teal-500 to-emerald-700',
  'from-amber-600 to-orange-700',
]

/* ────────────────────────────────────────────
   Admin Panel Component
   ──────────────────────────────────────────── */

export default function AdminPanel() {
  const [open, setOpen] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const [content, setContent] = useState<ContentData | null>(null)
  const [contentLoading, setContentLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  // Check for existing session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token')
    if (savedToken) {
      fetch('/api/admin/auth', {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) {
            setToken(savedToken)
            setAuthenticated(true)
          } else {
            localStorage.removeItem('admin_token')
          }
        })
        .catch(() => {
          localStorage.removeItem('admin_token')
        })
    }
  }, [])

  const loadContent = useCallback(async () => {
    if (!token) return
    setContentLoading(true)
    try {
      const res = await fetch('/api/admin/content', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setContent(data)
      }
    } catch (error) {
      console.error('Load content error:', error)
    } finally {
      setContentLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (authenticated && open) {
      loadContent()
    }
  }, [authenticated, open, loadContent])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (res.ok) {
        setToken(data.token)
        setAuthenticated(true)
        localStorage.setItem('admin_token', data.token)
        setPassword('')
      } else {
        setLoginError(data.error || 'Login failed')
      }
    } catch {
      setLoginError('Network error. Please try again.')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = async () => {
    if (token) {
      await fetch('/api/admin/auth', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {})
    }
    setToken(null)
    setAuthenticated(false)
    localStorage.removeItem('admin_token')
    setOpen(false)
  }

  const apiCall = async (url: string, method: string = 'GET', body?: unknown) => {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    }
    if (body) {
      headers['Content-Type'] = 'application/json'
    }
    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
    return res
  }

  // Save settings
  const saveSettings = async (settings: SiteSettings) => {
    setSaving(true)
    try {
      const res = await apiCall('/api/admin/content', 'PUT', { settings })
      if (res.ok) {
        toast({ title: 'Settings Saved', description: 'Your changes have been saved successfully.' })
        await loadContent()
      } else {
        toast({ title: 'Error', description: 'Failed to save settings', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error', description: 'Network error', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const TABS: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'contacts', label: 'Inquiries', icon: Inbox },
    { id: 'services', label: 'Services', icon: Settings },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'testimonials', label: 'Testimonials', icon: Star },
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
    { id: 'settings', label: 'Site Settings', icon: Settings },
  ]

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
          authenticated
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
            : 'bg-gray-800 hover:bg-gray-700 text-white'
        }`}
        aria-label="Admin Panel"
        title={authenticated ? 'Admin Panel (Logged In)' : 'Admin Panel'}
      >
        {authenticated ? <LayoutDashboard className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col">
      {/* Top bar */}
      <div className="h-14 border-b bg-emerald-900 text-white flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-lg object-contain" />
          <div>
            <span className="font-bold text-sm">A-Star Infotech</span>
            <span className="text-emerald-300 text-xs ml-2">Admin Panel</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-emerald-200 hover:text-white hover:bg-emerald-800"
            onClick={() => setOpen(false)}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Site
          </Button>
          {authenticated && (
            <Button
              variant="ghost"
              size="sm"
              className="text-emerald-200 hover:text-white hover:bg-emerald-800"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Not authenticated - show login */}
        {!authenticated ? (
          <div className="flex-1 flex items-center justify-center bg-muted/30 p-4">
            <Card className="w-full max-w-md shadow-xl">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-8 h-8 text-emerald-600" />
                </div>
                <CardTitle className="text-xl">Admin Login</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter your admin password to access the dashboard
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter admin password"
                      autoFocus
                    />
                    {loginError && (
                      <p className="text-sm text-red-500">{loginError}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    disabled={loginLoading}
                  >
                    {loginLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Login
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            {/* Sidebar */}
            <div className="w-56 border-r bg-muted/30 flex flex-col shrink-0">
              <nav className="flex-1 p-3 space-y-1">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                    {tab.id === 'contacts' && content?.contacts && content.contacts.length > 0 && (
                      <Badge className="ml-auto bg-emerald-100 text-emerald-700 text-xs">
                        {content.contacts.length}
                      </Badge>
                    )}
                  </button>
                ))}
              </nav>
              {/* Logout at bottom of sidebar */}
              <div className="p-3 border-t">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {contentLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                </div>
              ) : (
                <>
                  {activeTab === 'dashboard' && (
                    <DashboardTab content={content} onNavigate={setActiveTab} />
                  )}
                  {activeTab === 'contacts' && (
                    <ContactsTab contacts={content?.contacts || []} token={token!} onRefresh={loadContent} />
                  )}
                  {activeTab === 'services' && (
                    <ServicesTab services={content?.services || []} apiCall={apiCall} onRefresh={loadContent} saving={saving} setSaving={setSaving} />
                  )}
                  {activeTab === 'portfolio' && (
                    <PortfolioTab portfolio={content?.portfolio || []} apiCall={apiCall} onRefresh={loadContent} saving={saving} setSaving={setSaving} />
                  )}
                  {activeTab === 'testimonials' && (
                    <TestimonialsTab testimonials={content?.testimonials || []} apiCall={apiCall} onRefresh={loadContent} saving={saving} setSaving={setSaving} />
                  )}
                  {activeTab === 'stats' && (
                    <StatsTab stats={content?.stats || []} apiCall={apiCall} onRefresh={loadContent} saving={saving} setSaving={setSaving} />
                  )}
                  {activeTab === 'settings' && (
                    <SettingsTab settings={content?.settings || {}} onSave={saveSettings} saving={saving} />
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────
   Dashboard Tab
   ──────────────────────────────────────────── */

function DashboardTab({ content, onNavigate }: { content: ContentData | null; onNavigate: (tab: TabId) => void }) {
  const cards = [
    { label: 'Inquiries', count: content?.contacts.length || 0, icon: Inbox, tab: 'contacts' as TabId, color: 'bg-emerald-100 text-emerald-700' },
    { label: 'Services', count: content?.services.length || 0, icon: Settings, tab: 'services' as TabId, color: 'bg-amber-100 text-amber-700' },
    { label: 'Portfolio', count: content?.portfolio.length || 0, icon: Briefcase, tab: 'portfolio' as TabId, color: 'bg-emerald-100 text-emerald-700' },
    { label: 'Testimonials', count: content?.testimonials.length || 0, icon: Star, tab: 'testimonials' as TabId, color: 'bg-amber-100 text-amber-700' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <Card
            key={card.label}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onNavigate(card.tab)}
          >
            <CardContent className="p-5">
              <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center mb-3`}>
                <card.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-foreground">{card.count}</div>
              <div className="text-sm text-muted-foreground">{card.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent inquiries */}
      {content?.contacts && content.contacts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Inbox className="w-5 h-5 text-emerald-600" />
              Recent Inquiries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {content.contacts.slice(0, 5).map((contact) => (
                <div key={contact.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-xs shrink-0">
                    {contact.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-foreground">{contact.name}</span>
                      <span className="text-xs text-muted-foreground">{new Date(contact.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{contact.message}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => onNavigate('contacts')}>
              View All Inquiries
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

/* ────────────────────────────────────────────
   Contacts Tab
   ──────────────────────────────────────────── */

function ContactsTab({ contacts, token, onRefresh }: { contacts: ContactItem[]; token: string; onRefresh: () => void }) {
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/contacts?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        onRefresh()
      }
    } catch {
      // ignore
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Contact Inquiries</h1>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="w-4 h-4 mr-1" /> Refresh
        </Button>
      </div>

      {contacts.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Inbox className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">No inquiries yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {contacts.map((contact) => (
            <Card key={contact.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground">{contact.name}</span>
                      {contact.phone && (
                        <a
                          href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700"
                        >
                          <MessageCircle className="w-3 h-3" /> WhatsApp
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <a href={`mailto:${contact.email}`} className="hover:text-emerald-600">{contact.email}</a>
                      </span>
                      {contact.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {contact.phone}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-foreground/80 bg-muted/50 rounded-md p-2 whitespace-pre-wrap">
                      {contact.message}
                    </p>
                    <p className="mt-1.5 text-[11px] text-muted-foreground/70">
                      {new Date(contact.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                    onClick={() => handleDelete(contact.id)}
                    disabled={deleting === contact.id}
                  >
                    {deleting === contact.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

/* ────────────────────────────────────────────
   Services Tab
   ──────────────────────────────────────────── */

function ServicesTab({ services, apiCall, onRefresh, saving, setSaving }: {
  services: ServiceItem[]
  apiCall: (url: string, method: string, body?: unknown) => Promise<Response>
  onRefresh: () => void
  saving: boolean
  setSaving: (v: boolean) => void
}) {
  const [editing, setEditing] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ icon: 'Globe', title: '', description: '', color: 'text-emerald-600', bg: 'bg-emerald-50', order: 0 })

  const startEdit = (s: ServiceItem) => {
    setEditing(s.id)
    setForm({ icon: s.icon, title: s.title, description: s.description, color: s.color, bg: s.bg, order: s.order })
  }

  const handleSave = async (id: string) => {
    setSaving(true)
    try {
      const res = await apiCall('/api/admin/services', 'PUT', { id, ...form })
      if (res.ok) {
        setEditing(null)
        onRefresh()
      }
    } catch { /* ignore */ } finally {
      setSaving(false)
    }
  }

  const handleAdd = async () => {
    setSaving(true)
    try {
      const res = await apiCall('/api/admin/services', 'POST', form)
      if (res.ok) {
        setAdding(false)
        setForm({ icon: 'Globe', title: '', description: '', color: 'text-emerald-600', bg: 'bg-emerald-50', order: 0 })
        onRefresh()
      }
    } catch { /* ignore */ } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return
    setSaving(true)
    try {
      const res = await apiCall(`/api/admin/services?id=${id}`, 'DELETE')
      if (res.ok) onRefresh()
    } catch { /* ignore */ } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Services</h1>
        <Button
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
          onClick={() => { setAdding(true); setForm({ icon: 'Globe', title: '', description: '', color: 'text-emerald-600', bg: 'bg-emerald-50', order: services.length + 1 }) }}
        >
          <Plus className="w-4 h-4 mr-1" /> Add Service
        </Button>
      </div>

      <div className="space-y-3">
        {adding && (
          <ServiceForm form={form} setForm={setForm} onSave={handleAdd} onCancel={() => setAdding(false)} saving={saving} />
        )}
        {services.map((service) => (
          editing === service.id ? (
            <ServiceForm key={service.id} form={form} setForm={setForm} onSave={() => handleSave(service.id)} onCancel={() => setEditing(null)} saving={saving} />
          ) : (
            <Card key={service.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-lg ${service.bg} flex items-center justify-center shrink-0`}>
                      {ICON_MAP[service.icon] ? (() => { const Icon = ICON_MAP[service.icon]; return <Icon className={`w-5 h-5 ${service.color}`} /> })() : <Globe className={`w-5 h-5 ${service.color}`} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-foreground">{service.title}</div>
                      <p className="text-sm text-muted-foreground mt-0.5">{service.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">{service.icon}</Badge>
                        <Badge variant="outline" className="text-xs">Order: {service.order}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => startEdit(service)}>
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(service.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        ))}
      </div>
    </div>
  )
}

function ServiceForm({ form, setForm, onSave, onCancel, saving }: {
  form: { icon: string; title: string; description: string; color: string; bg: string; order: number }
  setForm: (f: typeof form) => void
  onSave: () => void
  onCancel: () => void
  saving: boolean
}) {
  return (
    <Card className="border-emerald-300">
      <CardContent className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Icon</Label>
            <select
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              {ICON_OPTIONS.map((icon) => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Color Scheme</Label>
            <select
              value={`${form.color}|${form.bg}`}
              onChange={(e) => {
                const [color, bg] = e.target.value.split('|')
                setForm({ ...form, color, bg })
              }}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              {COLOR_OPTIONS.map((opt) => (
                <option key={opt.label} value={`${opt.color}|${opt.bg}`}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Title</Label>
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Service title" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Description</Label>
          <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Service description" rows={2} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Order</Label>
          <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={onSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Check className="w-4 h-4 mr-1" />} Save
          </Button>
          <Button size="sm" variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </CardContent>
    </Card>
  )
}

/* ────────────────────────────────────────────
   Portfolio Tab
   ──────────────────────────────────────────── */

function PortfolioTab({ portfolio, apiCall, onRefresh, saving, setSaving }: {
  portfolio: PortfolioItem[]
  apiCall: (url: string, method: string, body?: unknown) => Promise<Response>
  onRefresh: () => void
  saving: boolean
  setSaving: (v: boolean) => void
}) {
  const [editing, setEditing] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ title: '', category: '', description: '', tech: '', color: 'from-emerald-500 to-emerald-700', image: '', order: 0 })

  const startEdit = (p: PortfolioItem) => {
    setEditing(p.id)
    setForm({ title: p.title, category: p.category, description: p.description, tech: p.tech, color: p.color, image: p.image, order: p.order })
  }

  const handleSave = async (id: string) => {
    setSaving(true)
    try {
      const res = await apiCall('/api/admin/portfolio', 'PUT', { id, ...form })
      if (res.ok) { setEditing(null); onRefresh() }
    } catch { /* ignore */ } finally { setSaving(false) }
  }

  const handleAdd = async () => {
    setSaving(true)
    try {
      const res = await apiCall('/api/admin/portfolio', 'POST', form)
      if (res.ok) { setAdding(false); setForm({ title: '', category: '', description: '', tech: '[]', color: 'from-emerald-500 to-emerald-700', image: '', order: 0 }); onRefresh() }
    } catch { /* ignore */ } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this portfolio item?')) return
    setSaving(true)
    try {
      const res = await apiCall(`/api/admin/portfolio?id=${id}`, 'DELETE')
      if (res.ok) onRefresh()
    } catch { /* ignore */ } finally { setSaving(false) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Portfolio</h1>
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => { setAdding(true); setForm({ title: '', category: '', description: '', tech: '[]', color: 'from-emerald-500 to-emerald-700', image: '', order: portfolio.length + 1 }) }}>
          <Plus className="w-4 h-4 mr-1" /> Add Project
        </Button>
      </div>

      <div className="space-y-3">
        {adding && (
          <PortfolioForm form={form} setForm={setForm} onSave={handleAdd} onCancel={() => setAdding(false)} saving={saving} />
        )}
        {portfolio.map((project) => (
          editing === project.id ? (
            <PortfolioForm key={project.id} form={form} setForm={setForm} onSave={() => handleSave(project.id)} onCancel={() => setEditing(null)} saving={saving} />
          ) : (
            <Card key={project.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-12 rounded-lg bg-gradient-to-r overflow-hidden shrink-0" style={{ backgroundImage: `url(${project.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{project.title}</span>
                      <Badge variant="secondary" className="text-xs">{project.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {(() => {
                        try {
                          return JSON.parse(project.tech).map((t: string) => (
                            <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>
                          ))
                        } catch { return null }
                      })()}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => startEdit(project)}><Edit3 className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(project.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        ))}
      </div>
    </div>
  )
}

function PortfolioForm({ form, setForm, onSave, onCancel, saving }: {
  form: { title: string; category: string; description: string; tech: string; color: string; image: string; order: number }
  setForm: (f: typeof form) => void
  onSave: () => void
  onCancel: () => void
  saving: boolean
}) {
  const [techInput, setTechInput] = useState(() => {
    try { return (JSON.parse(form.tech) as string[]).join(', ') } catch { return '' }
  })

  return (
    <Card className="border-emerald-300">
      <CardContent className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Project Title</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Project name" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Category</Label>
            <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="E-Commerce, Healthcare..." />
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Description</Label>
          <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Project description" rows={2} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Tech Stack (comma-separated)</Label>
          <Input value={techInput} onChange={(e) => { setTechInput(e.target.value); setForm({ ...form, tech: JSON.stringify(e.target.value.split(',').map(t => t.trim()).filter(Boolean)) }) }} placeholder="Next.js, React, Node.js" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Image Path</Label>
            <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="/portfolio-project.png" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Gradient</Label>
            <select value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm">
              {GRADIENT_OPTIONS.map((g) => (<option key={g} value={g}>{g}</option>))}
            </select>
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Order</Label>
          <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={onSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Check className="w-4 h-4 mr-1" />} Save
          </Button>
          <Button size="sm" variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </CardContent>
    </Card>
  )
}

/* ────────────────────────────────────────────
   Testimonials Tab
   ──────────────────────────────────────────── */

function TestimonialsTab({ testimonials, apiCall, onRefresh, saving, setSaving }: {
  testimonials: TestimonialItem[]
  apiCall: (url: string, method: string, body?: unknown) => Promise<Response>
  onRefresh: () => void
  saving: boolean
  setSaving: (v: boolean) => void
}) {
  const [editing, setEditing] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ name: '', company: '', review: '', rating: 5, order: 0 })

  const startEdit = (t: TestimonialItem) => {
    setEditing(t.id)
    setForm({ name: t.name, company: t.company, review: t.review, rating: t.rating, order: t.order })
  }

  const handleSave = async (id: string) => {
    setSaving(true)
    try {
      const res = await apiCall('/api/admin/testimonials', 'PUT', { id, ...form })
      if (res.ok) { setEditing(null); onRefresh() }
    } catch { /* ignore */ } finally { setSaving(false) }
  }

  const handleAdd = async () => {
    setSaving(true)
    try {
      const res = await apiCall('/api/admin/testimonials', 'POST', form)
      if (res.ok) { setAdding(false); setForm({ name: '', company: '', review: '', rating: 5, order: 0 }); onRefresh() }
    } catch { /* ignore */ } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return
    setSaving(true)
    try {
      const res = await apiCall(`/api/admin/testimonials?id=${id}`, 'DELETE')
      if (res.ok) onRefresh()
    } catch { /* ignore */ } finally { setSaving(false) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Testimonials</h1>
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => { setAdding(true); setForm({ name: '', company: '', review: '', rating: 5, order: testimonials.length + 1 }) }}>
          <Plus className="w-4 h-4 mr-1" /> Add Testimonial
        </Button>
      </div>

      <div className="space-y-3">
        {adding && (
          <TestimonialForm form={form} setForm={setForm} onSave={handleAdd} onCancel={() => setAdding(false)} saving={saving} />
        )}
        {testimonials.map((t) => (
          editing === t.id ? (
            <TestimonialForm key={t.id} form={form} setForm={setForm} onSave={() => handleSave(t.id)} onCancel={() => setEditing(null)} saving={saving} />
          ) : (
            <Card key={t.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{t.name}</span>
                      <span className="text-xs text-muted-foreground">{t.company}</span>
                      <div className="flex">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">&ldquo;{t.review}&rdquo;</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => startEdit(t)}><Edit3 className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(t.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        ))}
      </div>
    </div>
  )
}

function TestimonialForm({ form, setForm, onSave, onCancel, saving }: {
  form: { name: string; company: string; review: string; rating: number; order: number }
  setForm: (f: typeof form) => void
  onSave: () => void
  onCancel: () => void
  saving: boolean
}) {
  return (
    <Card className="border-emerald-300">
      <CardContent className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Client name" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Company</Label>
            <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company name" />
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Review</Label>
          <Textarea value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} placeholder="Client testimonial" rows={3} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Rating (1-5)</Label>
            <Input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Order</Label>
            <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={onSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Check className="w-4 h-4 mr-1" />} Save
          </Button>
          <Button size="sm" variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </CardContent>
    </Card>
  )
}

/* ────────────────────────────────────────────
   Stats Tab
   ──────────────────────────────────────────── */

function StatsTab({ stats, apiCall, onRefresh, saving, setSaving }: {
  stats: StatItem[]
  apiCall: (url: string, method: string, body?: unknown) => Promise<Response>
  onRefresh: () => void
  saving: boolean
  setSaving: (v: boolean) => void
}) {
  const [editing, setEditing] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ value: '', label: '', order: 0 })

  const startEdit = (s: StatItem) => {
    setEditing(s.id)
    setForm({ value: s.value, label: s.label, order: s.order })
  }

  const handleSave = async (id: string) => {
    setSaving(true)
    try {
      const res = await apiCall('/api/admin/stats', 'PUT', { id, ...form })
      if (res.ok) { setEditing(null); onRefresh() }
    } catch { /* ignore */ } finally { setSaving(false) }
  }

  const handleAdd = async () => {
    setSaving(true)
    try {
      const res = await apiCall('/api/admin/stats', 'POST', form)
      if (res.ok) { setAdding(false); setForm({ value: '', label: '', order: 0 }); onRefresh() }
    } catch { /* ignore */ } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this stat?')) return
    setSaving(true)
    try {
      const res = await apiCall(`/api/admin/stats?id=${id}`, 'DELETE')
      if (res.ok) onRefresh()
    } catch { /* ignore */ } finally { setSaving(false) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Statistics</h1>
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => { setAdding(true); setForm({ value: '', label: '', order: stats.length + 1 }) }}>
          <Plus className="w-4 h-4 mr-1" /> Add Stat
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {adding && (
          <Card className="border-emerald-300">
            <CardContent className="p-4 space-y-2">
              <Input value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder="Value (e.g. 150+)" />
              <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Label (e.g. Projects Delivered)" />
              <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} placeholder="Order" />
              <div className="flex gap-1">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1" onClick={handleAdd} disabled={saving}>
                  {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setAdding(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}
        {stats.map((s) => (
          editing === s.id ? (
            <Card key={s.id} className="border-emerald-300">
              <CardContent className="p-4 space-y-2">
                <Input value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
                <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
                <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
                <div className="flex gap-1">
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1" onClick={() => handleSave(s.id)} disabled={saving}>
                    {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card key={s.id} className="group cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-emerald-600">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
                <div className="mt-2 flex gap-1 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" className="h-7" onClick={() => startEdit(s)}><Edit3 className="w-3 h-3" /></Button>
                  <Button variant="ghost" size="sm" className="h-7 text-red-500" onClick={() => handleDelete(s.id)}><Trash2 className="w-3 h-3" /></Button>
                </div>
              </CardContent>
            </Card>
          )
        ))}
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────
   Settings Tab
   ──────────────────────────────────────────── */

function SettingsTab({ settings, onSave, saving }: { settings: SiteSettings; onSave: (s: SiteSettings) => void; saving: boolean }) {
  const [form, setForm] = useState<SiteSettings>(settings)

  useEffect(() => {
    setForm(settings)
  }, [settings])

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const fieldGroups = [
    {
      label: 'Hero Section',
      icon: Sparkles,
      fields: [
        { key: 'hero_badge', label: 'Badge Text', type: 'text' },
        { key: 'hero_title', label: 'Title', type: 'text' },
        { key: 'hero_description', label: 'Description', type: 'textarea' },
      ],
    },
    {
      label: 'About Section',
      icon: Target,
      fields: [
        { key: 'about_title', label: 'Title', type: 'text' },
        { key: 'about_paragraph1', label: 'Paragraph 1', type: 'textarea' },
        { key: 'about_paragraph2', label: 'Paragraph 2', type: 'textarea' },
        { key: 'about_vision', label: 'Vision', type: 'textarea' },
        { key: 'about_mission', label: 'Mission', type: 'textarea' },
        { key: 'about_values', label: 'Values (comma-separated)', type: 'text' },
        { key: 'about_years', label: 'Years Experience (e.g. 5+)', type: 'text' },
        { key: 'about_years_label', label: 'Years Label', type: 'text' },
      ],
    },
    {
      label: 'Section Headings',
      icon: BarChart3,
      fields: [
        { key: 'services_title', label: 'Services Title', type: 'text' },
        { key: 'services_description', label: 'Services Description', type: 'textarea' },
        { key: 'why_title', label: 'Why Choose Us Title', type: 'text' },
        { key: 'why_description', label: 'Why Choose Us Description', type: 'textarea' },
        { key: 'portfolio_title', label: 'Portfolio Title', type: 'text' },
        { key: 'portfolio_description', label: 'Portfolio Description', type: 'textarea' },
        { key: 'testimonials_title', label: 'Testimonials Title', type: 'text' },
        { key: 'testimonials_description', label: 'Testimonials Description', type: 'textarea' },
      ],
    },
    {
      label: 'CTA Section',
      icon: Rocket,
      fields: [
        { key: 'cta_title', label: 'CTA Title', type: 'text' },
        { key: 'cta_description', label: 'CTA Description', type: 'textarea' },
      ],
    },
    {
      label: 'Contact Information',
      icon: Phone,
      fields: [
        { key: 'contact_phone', label: 'Phone Number', type: 'text' },
        { key: 'contact_email', label: 'Email Address', type: 'text' },
        { key: 'contact_address', label: 'Address', type: 'textarea' },
        { key: 'contact_hours', label: 'Business Hours', type: 'text' },
        { key: 'whatsapp_number', label: 'WhatsApp Number (with country code, no +)', type: 'text' },
      ],
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Site Settings</h1>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => onSave(form)} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}
          Save All Settings
        </Button>
      </div>

      <div className="space-y-6">
        {fieldGroups.map((group) => (
          <Card key={group.label}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <group.icon className="w-4 h-4 text-emerald-600" />
                {group.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {group.fields.map((field) => (
                <div key={field.key} className="space-y-1">
                  <Label className="text-xs font-medium">{field.label}</Label>
                  {field.type === 'textarea' ? (
                    <Textarea
                      value={form[field.key] || ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      rows={2}
                      className="text-sm"
                    />
                  ) : (
                    <Input
                      value={form[field.key] || ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="text-sm"
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => onSave(form)} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}
          Save All Settings
        </Button>
      </div>
    </div>
  )
}
