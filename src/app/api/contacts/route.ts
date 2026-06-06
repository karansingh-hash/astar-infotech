import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * GET /api/contacts
 * Retrieve all contact form submissions (admin view)
 *
 * Query params:
 *   ?page=1     - Page number (default: 1)
 *   ?limit=20   - Results per page (default: 20)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, Number(searchParams.get('page')) || 1)
    const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit')) || 20))
    const skip = (page - 1) * limit

    const [contacts, total] = await Promise.all([
      db.contact.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.contact.count(),
    ])

    return NextResponse.json({
      contacts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Fetch contacts error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contacts.' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/contacts
 * Delete a contact submission by ID
 *
 * Body: { id: string }
 */
export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Contact ID is required.' },
        { status: 400 }
      )
    }

    const existing = await db.contact.findUnique({ where: { id } })

    if (!existing) {
      return NextResponse.json(
        { error: 'Contact not found.' },
        { status: 404 }
      )
    }

    await db.contact.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: 'Contact deleted successfully.',
    })
  } catch (error) {
    console.error('Delete contact error:', error)
    return NextResponse.json(
      { error: 'Failed to delete contact.' },
      { status: 500 }
    )
  }
}
