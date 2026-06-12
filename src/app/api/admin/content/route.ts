import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { validateSession } from '@/lib/admin-auth'

async function checkAuth(request: Request): Promise<string | null> {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  if (!token) return null
  const valid = await validateSession(token)
  return valid ? token : null
}

// GET all content for admin
export async function GET(request: Request) {
  const token = await checkAuth(request)
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const [settings, services, portfolio, testimonials, stats, contacts] = await Promise.all([
      db.siteSetting.findMany(),
      db.service.findMany({ orderBy: { order: 'asc' } }),
      db.portfolio.findMany({ orderBy: { order: 'asc' } }),
      db.testimonial.findMany({ orderBy: { order: 'asc' } }),
      db.stat.findMany({ orderBy: { order: 'asc' } }),
      db.contact.findMany({ orderBy: { createdAt: 'desc' } }),
    ])

    // Convert settings array to object
    const settingsObj: Record<string, string> = {}
    for (const s of settings) {
      settingsObj[s.key] = s.value
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
  const token = await checkAuth(request)
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { settings } = await request.json()

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Settings object is required' }, { status: 400 })
    }

    const updates = Object.entries(settings).map(([key, value]) =>
      db.siteSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    )

    await Promise.all(updates)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update settings error:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
