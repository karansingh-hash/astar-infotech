import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { requireAdmin, sanitizeString, validateLength } from '@/lib/security'

export async function GET() {
  try {
    const portfolio = await db.portfolio.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json({ portfolio })
  } catch (error) {
    console.error('Fetch portfolio error:', error)
    return NextResponse.json({ error: 'Failed to fetch portfolio items.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const authError = await requireAdmin(request)
    if (authError) return authError

    const body = await request.json()
    const { title, category, description, tech, color, image, order } = body

    if (!title || !category || !description) {
      return NextResponse.json({ error: 'Title, category, and description are required.' }, { status: 400 })
    }

    if (!validateLength(title, 1, 200) || !validateLength(description, 1, 2000)) {
      return NextResponse.json({ error: 'Input length exceeds limits.' }, { status: 400 })
    }

    const item = await db.portfolio.create({
      data: {
        title: sanitizeString(title, 200),
        category: sanitizeString(category, 100),
        description: sanitizeString(description, 2000),
        tech: sanitizeString(tech || '', 200),
        color: sanitizeString(color || 'from-emerald-500 to-emerald-700', 100),
        image: sanitizeString(image || '/portfolio-freshmart.png', 500),
        order: typeof order === 'number' ? order : 0,
      },
    })

    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true, portfolio: item }, { status: 201 })
  } catch (error) {
    console.error('Create portfolio error:', error)
    return NextResponse.json({ error: 'Failed to create portfolio item.' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const authError = await requireAdmin(request)
    if (authError) return authError

    const body = await request.json()
    const { id, title, category, description, tech, color, image, order } = body

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Portfolio ID is required.' }, { status: 400 })
    }

    const existing = await db.portfolio.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Portfolio item not found.' }, { status: 404 })
    }

    const item = await db.portfolio.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: sanitizeString(title, 200) }),
        ...(category !== undefined && { category: sanitizeString(category, 100) }),
        ...(description !== undefined && { description: sanitizeString(description, 2000) }),
        ...(tech !== undefined && { tech: sanitizeString(tech, 200) }),
        ...(color !== undefined && { color: sanitizeString(color, 100) }),
        ...(image !== undefined && { image: sanitizeString(image, 500) }),
        ...(order !== undefined && typeof order === 'number' && { order }),
      },
    })

    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true, portfolio: item })
  } catch (error) {
    console.error('Update portfolio error:', error)
    return NextResponse.json({ error: 'Failed to update portfolio item.' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const authError = await requireAdmin(request)
    if (authError) return authError

    const body = await request.json()
    const { id } = body

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Portfolio ID is required.' }, { status: 400 })
    }

    await db.portfolio.delete({ where: { id } })
    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true, message: 'Portfolio item deleted.' })
  } catch (error) {
    console.error('Delete portfolio error:', error)
    return NextResponse.json({ error: 'Failed to delete portfolio item.' }, { status: 500 })
  }
}
