import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const industries = await db.industry.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json({ industries })
  } catch (error) {
    console.error('Fetch industries error:', error)
    return NextResponse.json({ error: 'Failed to fetch industries.' }, { status: 500 })
  }
}
