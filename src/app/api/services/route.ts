import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { requireAdmin, sanitizeString, validateLength } from '@/lib/security'

export async function GET() {
  try {
    const services = await db.service.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json({ services })
  } catch (error) {
    console.error('Fetch services error:', error)
    return NextResponse.json({ error: 'Failed to fetch services.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const authError = await requireAdmin(request)
    if (authError) return authError

    const body = await request.json()
    const { title, description, icon, color, bgColor, order } = body

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required.' }, { status: 400 })
    }

    if (!validateLength(title, 1, 200) || !validateLength(description, 1, 2000)) {
      return NextResponse.json({ error: 'Input length exceeds limits.' }, { status: 400 })
    }

    const service = await db.service.create({
      data: {
        title: sanitizeString(title, 200),
        description: sanitizeString(description, 2000),
        icon: sanitizeString(icon || 'Globe', 50),
        color: sanitizeString(color || 'text-emerald-600', 50),
        bgColor: sanitizeString(bgColor || 'bg-emerald-50', 50),
        order: typeof order === 'number' ? order : 0,
      },
    })

    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true, service }, { status: 201 })
  } catch (error) {
    console.error('Create service error:', error)
    return NextResponse.json({ error: 'Failed to create service.' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const authError = await requireAdmin(request)
    if (authError) return authError

    const body = await request.json()
    const { id, title, description, icon, color, bgColor, image, order } = body

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Service ID is required.' }, { status: 400 })
    }

    const existing = await db.service.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Service not found.' }, { status: 404 })
    }

    const service = await db.service.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: sanitizeString(title, 200) }),
        ...(description !== undefined && { description: sanitizeString(description, 2000) }),
        ...(icon !== undefined && { icon: sanitizeString(icon, 50) }),
        ...(color !== undefined && { color: sanitizeString(color, 50) }),
        ...(bgColor !== undefined && { bgColor: sanitizeString(bgColor, 50) }),
        ...(order !== undefined && typeof order === 'number' && { order }),
      },
    })

    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true, service })
  } catch (error) {
    console.error('Update service error:', error)
    return NextResponse.json({ error: 'Failed to update service.' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const authError = await requireAdmin(request)
    if (authError) return authError

    const body = await request.json()
    const { id } = body

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Service ID is required.' }, { status: 400 })
    }

    await db.service.delete({ where: { id } })
    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true, message: 'Service deleted.' })
  } catch (error) {
    console.error('Delete service error:', error)
    return NextResponse.json({ error: 'Failed to delete service.' }, { status: 500 })
  }
}
