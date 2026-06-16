import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { requireAdmin, sanitizeString, validateLength } from '@/lib/security'

// Whitelisted fields for portfolio creation/update
const PORTFOLIO_STRING_FIELDS = ['title', 'category', 'description', 'tech', 'color', 'image'] as const
const PORTFOLIO_MAX_LENGTHS: Record<string, number> = {
  title: 200,
  category: 100,
  description: 5000,
  tech: 5000,
  color: 200,
  image: 500,
}

// POST - Create portfolio item
export async function POST(request: Request) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.category) {
      return NextResponse.json({ error: 'Title and category are required' }, { status: 400 })
    }

    // Whitelist and sanitize string fields
    const sanitizedData: Record<string, string> = {}
    for (const field of PORTFOLIO_STRING_FIELDS) {
      if (data[field] !== undefined && data[field] !== null) {
        let value = data[field]
        // Handle tech field which can be an array
        if (field === 'tech' && typeof value !== 'string') {
          value = JSON.stringify(value || [])
        }
        value = String(value)
        if (!validateLength(value, 1, PORTFOLIO_MAX_LENGTHS[field])) {
          return NextResponse.json(
            { error: `${field} must be between 1 and ${PORTFOLIO_MAX_LENGTHS[field]} characters` },
            { status: 400 }
          )
        }
        sanitizedData[field] = sanitizeString(value, PORTFOLIO_MAX_LENGTHS[field])
      }
    }

    // Handle numeric order field
    const order = typeof data.order === 'number' ? data.order : 0

    // Provide defaults for fields not supplied
    const createData = {
      title: sanitizedData.title as string,
      category: sanitizedData.category as string,
      description: sanitizedData.description || '',
      tech: sanitizedData.tech || '[]',
      color: sanitizedData.color || 'from-emerald-500 to-emerald-700',
      image: sanitizedData.image || '/portfolio-placeholder.png',
      order,
    }

    const portfolio = await db.portfolio.create({ data: createData })

    revalidatePath('/', 'layout')
    return NextResponse.json({ portfolio }, { status: 201 })
  } catch (error) {
    console.error('Create portfolio error:', error)
    return NextResponse.json({ error: 'Failed to create portfolio item' }, { status: 500 })
  }
}

// PUT - Update portfolio item
export async function PUT(request: Request) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const data = await request.json()
    const { id } = data

    if (!id) {
      return NextResponse.json({ error: 'Portfolio ID is required' }, { status: 400 })
    }

    // Whitelist and sanitize — only pick allowed fields
    const updateData: Record<string, string | number> = {}
    for (const field of PORTFOLIO_STRING_FIELDS) {
      if (data[field] !== undefined && data[field] !== null) {
        let value = data[field]
        // Handle tech field which can be an array
        if (field === 'tech' && typeof value !== 'string') {
          value = JSON.stringify(value)
        }
        value = String(value)
        if (!validateLength(value, 1, PORTFOLIO_MAX_LENGTHS[field])) {
          return NextResponse.json(
            { error: `${field} must be between 1 and ${PORTFOLIO_MAX_LENGTHS[field]} characters` },
            { status: 400 }
          )
        }
        updateData[field] = sanitizeString(value, PORTFOLIO_MAX_LENGTHS[field])
      }
    }

    if (data.order !== undefined) {
      updateData.order = typeof data.order === 'number' ? data.order : 0
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const portfolio = await db.portfolio.update({
      where: { id },
      data: updateData,
    })

    revalidatePath('/', 'layout')
    return NextResponse.json({ portfolio })
  } catch (error) {
    console.error('Update portfolio error:', error)
    return NextResponse.json({ error: 'Failed to update portfolio item' }, { status: 500 })
  }
}

// DELETE - Delete portfolio item
export async function DELETE(request: Request) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Portfolio ID is required' }, { status: 400 })
    }

    await db.portfolio.delete({ where: { id } })

    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete portfolio error:', error)
    return NextResponse.json({ error: 'Failed to delete portfolio item' }, { status: 500 })
  }
}
