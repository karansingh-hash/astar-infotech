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

// Legacy snake_case keys → current camelCase mapping.
// Used by runSettingsMigrationIfNeeded() to auto-migrate older DBs.
const LEGACY_KEY_MAP: Record<string, string> = {
  'hero_badge': 'heroBadge',
  'hero_title': 'heroHeading',
  'hero_description': 'heroSubtitle',
  'about_title': 'aboutHeading',
  'about_paragraph1': 'aboutDescription1',
  'about_paragraph2': 'aboutDescription2',
  'about_vision': 'aboutVision',
  'about_mission': 'aboutMission',
  'about_values': 'aboutValues',
  'why_description': 'whyChooseUsIntro',
  'contact_phone': 'phone',
  'contact_email': 'email',
  'contact_address': 'address',
  'contact_hours': 'hours',
}

// Legacy keys with no camelCase equivalent — just delete
const LEGACY_ORPHAN_KEYS = [
  'about_years', 'about_years_label',
  'services_title', 'services_description',
  'why_title',
  'portfolio_title', 'portfolio_description',
  'testimonials_title', 'testimonials_description',
  'cta_title', 'cta_description',
  'whatsapp_number',
]

/**
 * Auto-migrate legacy snake_case SiteSetting keys to camelCase.
 * Idempotent: safe to call on every request. Runs inside a try/catch so any
 * failure (e.g. race condition with another request) is silently ignored —
 * the next request will retry.
 *
 * This is what makes the live site self-heal after deploy without requiring
 * the user to manually run a migration script against their DB.
 */
async function runSettingsMigrationIfNeeded(): Promise<void> {
  try {
    // Fast path: if no legacy keys exist, skip entirely
    const legacyKeyCount = await db.siteSetting.count({
      where: { key: { in: [...Object.keys(LEGACY_KEY_MAP), ...LEGACY_ORPHAN_KEYS] } },
    })
    if (legacyKeyCount === 0) return

    // Migrate legacy → camelCase (don't overwrite existing camelCase values)
    for (const [oldKey, newKey] of Object.entries(LEGACY_KEY_MAP)) {
      const oldSetting = await db.siteSetting.findUnique({ where: { key: oldKey } })
      if (!oldSetting) continue
      const newExisting = await db.siteSetting.findUnique({ where: { key: newKey } })
      if (!newExisting && oldSetting.value) {
        await db.siteSetting.create({ data: { key: newKey, value: oldSetting.value } })
      }
      await db.siteSetting.delete({ where: { key: oldKey } }).catch(() => {})
    }

    // Delete orphan legacy keys
    await db.siteSetting.deleteMany({
      where: { key: { in: LEGACY_ORPHAN_KEYS } },
    }).catch(() => {})
  } catch {
    // Migration is best-effort — never let it break the settings GET
  }
}

export async function GET() {
  try {
    // Auto-migrate legacy snake_case keys on every GET (idempotent + safe)
    await runSettingsMigrationIfNeeded()

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
    const authError = await requireAdmin(request)
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

    const results: Array<{ id: string; key: string; value: string }> = []
    for (const [key, value] of Object.entries(filteredSettings)) {
      const result = await db.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
        select: { id: true, key: true, value: true },
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
