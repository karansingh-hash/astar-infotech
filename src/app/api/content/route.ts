import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const [settings, services, portfolio, testimonials, stats] = await Promise.all([
      db.siteSetting.findMany(),
      db.service.findMany({ orderBy: { order: 'asc' } }),
      db.portfolio.findMany({ orderBy: { order: 'asc' } }),
      db.testimonial.findMany({ orderBy: { order: 'asc' } }),
      db.stat.findMany({ orderBy: { order: 'asc' } }),
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
    })
  } catch (error) {
    console.error('Fetch content error:', error)
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}
