import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { requireAdmin, sanitizeString, validateLength } from '@/lib/security'

const INDUSTRY_STRING_FIELDS = ['title', 'icon', 'color', 'bgColor'] as const
const INDUSTRY_MAX_LENGTHS: Record<string, number> = {
  title: 200,
  icon: 100,
  color: 100,
  bgColor: 100,
}

// POST - Create industry
export async function POST(request: Request) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const body = await request.json()
    const { title, icon, color, bgColor, order } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required.' }, { status: 400 })
    }

    if (!validateLength(title, 1, 200)) {
      return NextResponse.json({ error: 'Title must be between 1 and 200 characters.' }, { status: 400 })
    }

    const industry = await db.industry.create({
      data: {
        title: sanitizeString(title, 200),
        icon: sanitizeString(icon || 'Globe', 50),
        color: sanitizeString(color || 'text-emerald-600', 50),
        bgColor: sanitizeString(bgColor || 'bg-emerald-50', 50),
        order: typeof order === 'number' ? order : 0,
      },
    })

    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true, industry }, { status: 201 })
  } catch (error) {
    console.error('Create industry error:', error)
    return NextResponse.json({ error: 'Failed to create industry.' }, { status: 500 })
  }
}

// PUT - Update industry
export async function PUT(request: Request) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const body = await request.json()
    const { id, title, icon, color, bgColor, order } = body

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Industry ID is required.' }, { status: 400 })
    }

    const existing = await db.industry.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Industry not found.' }, { status: 404 })
    }

    const industry = await db.industry.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: sanitizeString(title, 200) }),
        ...(icon !== undefined && { icon: sanitizeString(icon, 50) }),
        ...(color !== undefined && { color: sanitizeString(color, 50) }),
        ...(bgColor !== undefined && { bgColor: sanitizeString(bgColor, 50) }),
        ...(order !== undefined && typeof order === 'number' && { order }),
      },
    })

    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true, industry })
  } catch (error) {
    console.error('Update industry error:', error)
    return NextResponse.json({ error: 'Failed to update industry.' }, { status: 500 })
  }
}

// DELETE - Delete industry
export async function DELETE(request: Request) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const body = await request.json()
    const { id } = body

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Industry ID is required.' }, { status: 400 })
    }

    await db.industry.delete({ where: { id } })
    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true, message: 'Industry deleted.' })
  } catch (error) {
    console.error('Delete industry error:', error)
    return NextResponse.json({ error: 'Failed to delete industry.' }, { status: 500 })
  }
}
