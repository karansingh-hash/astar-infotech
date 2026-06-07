import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const settings = await db.siteSetting.findMany()
    const settingsMap: Record<string, string> = {}
    for (const s of settings) {
      settingsMap[s.key] = s.value
    }
    return NextResponse.json({ settings: settingsMap })
  } catch (error) {
    console.error('Fetch settings error:', error)
    return NextResponse.json({ error: 'Failed to fetch settings.' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { settings } = body as { settings: Record<string, string> }

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Settings object is required.' }, { status: 400 })
    }

    const results = []
    for (const [key, value] of Object.entries(settings)) {
      const result = await db.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
      results.push(result)
    }

    return NextResponse.json({ success: true, updated: results.length })
  } catch (error) {
    console.error('Update settings error:', error)
    return NextResponse.json({ error: 'Failed to update settings.' }, { status: 500 })
  }
}
