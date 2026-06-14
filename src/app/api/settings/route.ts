import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { requireAdmin, sanitizeString } from '@/lib/security'

// Settings keys that are allowed to be read/updated
const ALLOWED_SETTINGS_KEYS = new Set([
  'companyName', 'address', 'phone', 'email', 'secondaryEmail', 'hours',
  'facebook', 'instagram', 'linkedin', 'youtube', 'brandColor',
  'heroBadge', 'heroHeading', 'heroSubtitle',
  'aboutHeading', 'aboutDescription1', 'aboutDescription2',
  'aboutVision', 'aboutMission', 'aboutValues',
  'whyChooseUsIntro',
])

// Keys that should NEVER be exposed to the public
const PRIVATE_KEYS = new Set(['adminPassword', 'adminPasswordHash'])

export async function GET() {
  try {
    const settings = await db.siteSetting.findMany()
    const settingsMap: Record<string, string> = {}
    for (const s of settings) {
      // Never expose private keys like passwords
      if (!PRIVATE_KEYS.has(s.key)) {
        settingsMap[s.key] = s.value
      }
    }
    return NextResponse.json({ settings: settingsMap })
  } catch (error) {
    console.error('Fetch settings error:', error)
    return NextResponse.json({ error: 'Failed to fetch settings.' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const authError = requireAdmin(request)
    if (authError) return authError

    const body = await request.json()
    const { settings } = body as { settings: Record<string, string> }

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Settings object is required.' }, { status: 400 })
    }

    // Only allow whitelisted keys — prevent writing to adminPassword etc.
    const filteredSettings: Record<string, string> = {}
    for (const [key, value] of Object.entries(settings)) {
      if (ALLOWED_SETTINGS_KEYS.has(key) && typeof value === 'string') {
        filteredSettings[key] = sanitizeString(value, 5000)
      }
    }

    const results = []
    for (const [key, value] of Object.entries(filteredSettings)) {
      const result = await db.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
      results.push(result)
    }

    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true, updated: results.length })
  } catch (error) {
    console.error('Update settings error:', error)
    return NextResponse.json({ error: 'Failed to update settings.' }, { status: 500 })
  }
}
