import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Keys that should NEVER be exposed to the public
const PRIVATE_KEYS = new Set(['adminPassword', 'adminPasswordHash'])

export async function GET() {
  try {
    const [settings, services, portfolio, testimonials, stats] = await Promise.all([
      db.siteSetting.findMany(),
      db.service.findMany({ orderBy: { order: 'asc' } }),
      db.portfolio.findMany({ orderBy: { order: 'asc' } }),
      db.testimonial.findMany({ orderBy: { order: 'asc' } }),
      db.stat.findMany({ orderBy: { order: 'asc' } }),
    ])

    // Convert settings array to object — filter out private keys
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
    })
  } catch (error) {
    console.error('Fetch content error:', error)
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}
