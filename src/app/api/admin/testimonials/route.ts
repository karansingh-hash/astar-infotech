import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { requireAdmin, sanitizeString, validateLength } from '@/lib/security'

// Whitelisted fields for testimonial creation/update
const TESTIMONIAL_STRING_FIELDS = ['name', 'company', 'review'] as const
const TESTIMONIAL_MAX_LENGTHS: Record<string, number> = {
  name: 200,
  company: 200,
  review: 5000,
}

// POST - Create testimonial
export async function POST(request: Request) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.review) {
      return NextResponse.json({ error: 'Name and review are required' }, { status: 400 })
    }

    // Whitelist and sanitize string fields
    const sanitizedData: Record<string, string | number> = {}
    for (const field of TESTIMONIAL_STRING_FIELDS) {
      if (data[field] !== undefined && data[field] !== null) {
        const value = String(data[field])
        if (!validateLength(value, 1, TESTIMONIAL_MAX_LENGTHS[field])) {
          return NextResponse.json(
            { error: `${field} must be between 1 and ${TESTIMONIAL_MAX_LENGTHS[field]} characters` },
            { status: 400 }
          )
        }
        sanitizedData[field] = sanitizeString(value, TESTIMONIAL_MAX_LENGTHS[field])
      }
    }

    // Validate rating
    const rating = typeof data.rating === 'number' && data.rating >= 1 && data.rating <= 5
      ? data.rating
      : 5

    // Handle numeric order field
    const order = typeof data.order === 'number' ? data.order : 0

    const createData = {
      name: sanitizedData.name as string,
      company: (sanitizedData.company as string) || '',
      review: sanitizedData.review as string,
      rating,
      order,
    }

    const testimonial = await db.testimonial.create({ data: createData })

    revalidatePath('/', 'layout')
    return NextResponse.json({ testimonial }, { status: 201 })
  } catch (error) {
    console.error('Create testimonial error:', error)
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 })
  }
}

// PUT - Update testimonial
export async function PUT(request: Request) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const data = await request.json()
    const { id } = data

    if (!id) {
      return NextResponse.json({ error: 'Testimonial ID is required' }, { status: 400 })
    }

    // Whitelist and sanitize — only pick allowed fields
    const updateData: Record<string, string | number> = {}
    for (const field of TESTIMONIAL_STRING_FIELDS) {
      if (data[field] !== undefined && data[field] !== null) {
        const value = String(data[field])
        if (!validateLength(value, 1, TESTIMONIAL_MAX_LENGTHS[field])) {
          return NextResponse.json(
            { error: `${field} must be between 1 and ${TESTIMONIAL_MAX_LENGTHS[field]} characters` },
            { status: 400 }
          )
        }
        updateData[field] = sanitizeString(value, TESTIMONIAL_MAX_LENGTHS[field])
      }
    }

    // Validate rating if provided
    if (data.rating !== undefined) {
      updateData.rating = typeof data.rating === 'number' && data.rating >= 1 && data.rating <= 5
        ? data.rating
        : 5
    }

    if (data.order !== undefined) {
      updateData.order = typeof data.order === 'number' ? data.order : 0
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const testimonial = await db.testimonial.update({
      where: { id },
      data: updateData,
    })

    revalidatePath('/', 'layout')
    return NextResponse.json({ testimonial })
  } catch (error) {
    console.error('Update testimonial error:', error)
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 })
  }
}

// DELETE - Delete testimonial
export async function DELETE(request: Request) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Testimonial ID is required' }, { status: 400 })
    }

    await db.testimonial.delete({ where: { id } })

    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete testimonial error:', error)
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 })
  }
}
