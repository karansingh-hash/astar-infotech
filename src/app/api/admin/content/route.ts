import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { requireAdmin, sanitizeString } from '@/lib/security'

// Settings keys that are allowed to be updated via admin content API
const ALLOWED_SETTINGS_KEYS = new Set([
  'companyName', 'address', 'phone', 'email', 'secondaryEmail', 'hours',
  'facebook', 'instagram', 'linkedin', 'youtube', 'brandColor',
  'heroBadge', 'heroHeading', 'heroSubtitle',
  'aboutHeading', 'aboutDescription1', 'aboutDescription2',
  'aboutVision', 'aboutMission', 'aboutValues',
  'whyChooseUsIntro',
])

// Keys that should NEVER be exposed in API responses
const PRIVATE_KEYS = new Set(['adminPassword', 'adminPasswordHash'])

// GET all content for admin
export async function GET(request: Request) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const [settings, services, portfolio, testimonials, stats, contacts] = await Promise.all([
      db.siteSetting.findMany(),
      db.service.findMany({ orderBy: { order: 'asc' } }),
      db.portfolio.findMany({ orderBy: { order: 'asc' } }),
      db.testimonial.findMany({ orderBy: { order: 'asc' } }),
      db.stat.findMany({ orderBy: { order: 'asc' } }),
      db.contact.findMany({ orderBy: { createdAt: 'desc' } }),
    ])

    // Convert settings array to object, filtering out private keys
    const settingsObj: Record<string, string> = {}
    for (const s of settings) {
      if (!PRIVATE_KEYS.has(s.key)) {
        settingsObj[s.key] = s.value
      }
    }

    return NextResponse.json({
      settings: settingsObj,
      services,
      portfolio,
      testimonials,
      stats,
      contacts,
    })
  } catch (error) {
    console.error('Fetch content error:', error)
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}

// PUT update site settings
export async function PUT(request: Request) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const { settings } = await request.json()

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Settings object is required' }, { status: 400 })
    }

    // Only allow whitelisted keys — prevent writing to adminPassword, adminPasswordHash, etc.
    const filteredSettings: Record<string, string> = {}
    for (const [key, value] of Object.entries(settings)) {
      if (ALLOWED_SETTINGS_KEYS.has(key) && typeof value === 'string') {
        filteredSettings[key] = sanitizeString(value, 5000)
      }
    }

    const updates = Object.entries(filteredSettings).map(([key, value]) =>
      db.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )

    await Promise.all(updates)

    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update settings error:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
