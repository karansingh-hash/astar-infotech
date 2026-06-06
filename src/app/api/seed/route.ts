import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Push schema and seed data
    // First, check if database already has data
    const existingContacts = await db.contact.count()

    if (existingContacts > 0) {
      return NextResponse.json({
        success: true,
        message: 'Database already has data. Seeding skipped.',
        contactsCount: existingContacts,
      })
    }

    // Create sample contacts to verify database works
    const sampleContact = await db.contact.create({
      data: {
        name: 'A-Star Infotech',
        email: 'astarinfotech.dev@gmail.com',
        phone: '+91 8560074448',
        message: 'Welcome to A-Star Infotech! This is a test message to verify the database is working correctly.',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully! Your website is ready to receive contact form submissions.',
      sampleContactId: sampleContact.id,
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to seed database. Make sure DATABASE_URL is set correctly and the database is accessible.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
