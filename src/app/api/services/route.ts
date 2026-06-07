import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

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
    const body = await request.json()
    const { title, description, icon, color, bgColor, order } = body

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required.' }, { status: 400 })
    }

    const service = await db.service.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        icon: icon || 'Globe',
        color: color || 'text-emerald-600',
        bgColor: bgColor || 'bg-emerald-50',
        order: order || 0,
      },
    })

    return NextResponse.json({ success: true, service }, { status: 201 })
  } catch (error) {
    console.error('Create service error:', error)
    return NextResponse.json({ error: 'Failed to create service.' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, title, description, icon, color, bgColor, order } = body

    if (!id) {
      return NextResponse.json({ error: 'Service ID is required.' }, { status: 400 })
    }

    const existing = await db.service.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Service not found.' }, { status: 404 })
    }

    const service = await db.service.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && { description: description.trim() }),
        ...(icon !== undefined && { icon }),
        ...(color !== undefined && { color }),
        ...(bgColor !== undefined && { bgColor }),
        ...(order !== undefined && { order }),
      },
    })

    return NextResponse.json({ success: true, service })
  } catch (error) {
    console.error('Update service error:', error)
    return NextResponse.json({ error: 'Failed to update service.' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'Service ID is required.' }, { status: 400 })
    }

    await db.service.delete({ where: { id } })
    return NextResponse.json({ success: true, message: 'Service deleted.' })
  } catch (error) {
    console.error('Delete service error:', error)
    return NextResponse.json({ error: 'Failed to delete service.' }, { status: 500 })
  }
}
