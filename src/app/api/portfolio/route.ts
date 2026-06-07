import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

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
    const body = await request.json()
    const { title, category, description, tech, color, image, order } = body

    if (!title || !category || !description) {
      return NextResponse.json({ error: 'Title, category, and description are required.' }, { status: 400 })
    }

    const item = await db.portfolio.create({
      data: {
        title: title.trim(),
        category: category.trim(),
        description: description.trim(),
        tech: tech || '',
        color: color || 'from-emerald-500 to-emerald-700',
        image: image || '/portfolio-freshmart.png',
        order: order || 0,
      },
    })

    return NextResponse.json({ success: true, portfolio: item }, { status: 201 })
  } catch (error) {
    console.error('Create portfolio error:', error)
    return NextResponse.json({ error: 'Failed to create portfolio item.' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, title, category, description, tech, color, image, order } = body

    if (!id) {
      return NextResponse.json({ error: 'Portfolio ID is required.' }, { status: 400 })
    }

    const existing = await db.portfolio.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Portfolio item not found.' }, { status: 404 })
    }

    const item = await db.portfolio.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(category !== undefined && { category: category.trim() }),
        ...(description !== undefined && { description: description.trim() }),
        ...(tech !== undefined && { tech }),
        ...(color !== undefined && { color }),
        ...(image !== undefined && { image }),
        ...(order !== undefined && { order }),
      },
    })

    return NextResponse.json({ success: true, portfolio: item })
  } catch (error) {
    console.error('Update portfolio error:', error)
    return NextResponse.json({ error: 'Failed to update portfolio item.' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'Portfolio ID is required.' }, { status: 400 })
    }

    await db.portfolio.delete({ where: { id } })
    return NextResponse.json({ success: true, message: 'Portfolio item deleted.' })
  } catch (error) {
    console.error('Delete portfolio error:', error)
    return NextResponse.json({ error: 'Failed to delete portfolio item.' }, { status: 500 })
  }
}
