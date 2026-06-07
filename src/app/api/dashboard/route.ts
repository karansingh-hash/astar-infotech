import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const [
      totalContacts,
      totalServices,
      totalPortfolio,
      totalTestimonials,
      recentContacts,
    ] = await Promise.all([
      db.contact.count(),
      db.service.count(),
      db.portfolio.count(),
      db.testimonial.count(),
      db.contact.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ])

    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - now.getDay())
    weekStart.setHours(0, 0, 0, 0)

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    const [todayContacts, weekContacts, monthContacts] = await Promise.all([
      db.contact.count({ where: { createdAt: { gte: todayStart } } }),
      db.contact.count({ where: { createdAt: { gte: weekStart } } }),
      db.contact.count({ where: { createdAt: { gte: monthStart } } }),
    ])

    return NextResponse.json({
      totalContacts,
      totalServices,
      totalPortfolio,
      totalTestimonials,
      todayContacts,
      weekContacts,
      monthContacts,
      recentContacts,
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard data.' }, { status: 500 })
  }
}
