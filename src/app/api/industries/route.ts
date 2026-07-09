import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const SEED_INDUSTRIES = [
  { title: 'Healthcare & Clinics', icon: 'Stethoscope', color: 'text-blue-400', bgColor: 'bg-blue-500/10', order: 1 },
  { title: 'Real Estate', icon: 'Building2', color: 'text-orange-400', bgColor: 'bg-orange-500/10', order: 2 },
  { title: 'Manufacturing & Export', icon: 'Factory', color: 'text-red-400', bgColor: 'bg-red-500/10', order: 3 },
  { title: 'Retail & E-Commerce', icon: 'Store', color: 'text-pink-400', bgColor: 'bg-pink-500/10', order: 4 },
  { title: 'Schools & Coaching', icon: 'GraduationCap', color: 'text-amber-400', bgColor: 'bg-amber-500/10', order: 5 },
  { title: 'Restaurants & Hotels', icon: 'UtensilsCrossed', color: 'text-cyan-400', bgColor: 'bg-cyan-500/10', order: 6 },
  { title: 'Legal & CA Firms', icon: 'Scale', color: 'text-blue-400', bgColor: 'bg-blue-500/10', order: 7 },
  { title: 'Consultants & Coaches', icon: 'Briefcase', color: 'text-amber-400', bgColor: 'bg-amber-500/10', order: 8 },
  { title: 'Service Businesses', icon: 'Wrench', color: 'text-gray-400', bgColor: 'bg-gray-500/10', order: 9 },
  { title: 'Startups', icon: 'Rocket', color: 'text-red-400', bgColor: 'bg-red-500/10', order: 10 },
  { title: 'Jewellery & Fashion', icon: 'Gem', color: 'text-purple-400', bgColor: 'bg-purple-500/10', order: 11 },
  { title: 'Construction & Interior', icon: 'HardHat', color: 'text-orange-400', bgColor: 'bg-orange-500/10', order: 12 },
]

export async function GET() {
  try {
    let industries = await db.industry.findMany({
      orderBy: { order: 'asc' },
    })

    // Auto-seed if empty
    if (industries.length === 0) {
      await db.industry.createMany({ data: SEED_INDUSTRIES })
      industries = await db.industry.findMany({ orderBy: { order: 'asc' } })
    }

    return NextResponse.json({ industries })
  } catch (error) {
    console.error('Fetch industries error:', error)
    return NextResponse.json({ error: 'Failed to fetch industries.' }, { status: 500 })
  }
}
