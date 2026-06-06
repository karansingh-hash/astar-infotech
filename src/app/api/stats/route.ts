import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const stats = await db.stat.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json({ stats })
  } catch (error) {
    console.error('Fetch stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { value, label, order } = body

    if (!value || !label) {
      return NextResponse.json({ error: 'Value and label are required.' }, { status: 400 })
    }

    const stat = await db.stat.create({
      data: {
        value: value.trim(),
        label: label.trim(),
        order: order || 0,
      },
    })

    return NextResponse.json({ success: true, stat }, { status: 201 })
  } catch (error) {
    console.error('Create stat error:', error)
    return NextResponse.json({ error: 'Failed to create stat.' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, value, label, order } = body

    if (!id) {
      return NextResponse.json({ error: 'Stat ID is required.' }, { status: 400 })
    }

    const existing = await db.stat.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Stat not found.' }, { status: 404 })
    }

    const stat = await db.stat.update({
      where: { id },
      data: {
        ...(value !== undefined && { value: value.trim() }),
        ...(label !== undefined && { label: label.trim() }),
        ...(order !== undefined && { order }),
      },
    })

    return NextResponse.json({ success: true, stat })
  } catch (error) {
    console.error('Update stat error:', error)
    return NextResponse.json({ error: 'Failed to update stat.' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'Stat ID is required.' }, { status: 400 })
    }

    await db.stat.delete({ where: { id } })
    return NextResponse.json({ success: true, message: 'Stat deleted.' })
  } catch (error) {
    console.error('Delete stat error:', error)
    return NextResponse.json({ error: 'Failed to delete stat.' }, { status: 500 })
  }
}
