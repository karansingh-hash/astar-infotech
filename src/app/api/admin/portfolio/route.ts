import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { validateSession } from '@/lib/admin-auth'

async function checkAuth(request: Request): Promise<boolean> {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  if (!token) return false
  return validateSession(token)
}

// POST - Create portfolio item
export async function POST(request: Request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const portfolio = await db.portfolio.create({
      data: {
        title: data.title,
        category: data.category,
        description: data.description,
        tech: typeof data.tech === 'string' ? data.tech : JSON.stringify(data.tech || []),
        color: data.color || 'from-emerald-500 to-emerald-700',
        image: data.image || '/portfolio-placeholder.png',
        order: data.order || 0,
      },
    })
    return NextResponse.json({ portfolio }, { status: 201 })
  } catch (error) {
    console.error('Create portfolio error:', error)
    return NextResponse.json({ error: 'Failed to create portfolio item' }, { status: 500 })
  }
}

// PUT - Update portfolio item
export async function PUT(request: Request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const { id, ...updateData } = data

    if (!id) {
      return NextResponse.json({ error: 'Portfolio ID is required' }, { status: 400 })
    }

    if (updateData.tech && typeof updateData.tech !== 'string') {
      updateData.tech = JSON.stringify(updateData.tech)
    }

    const portfolio = await db.portfolio.update({
      where: { id },
      data: updateData,
    })
    return NextResponse.json({ portfolio })
  } catch (error) {
    console.error('Update portfolio error:', error)
    return NextResponse.json({ error: 'Failed to update portfolio item' }, { status: 500 })
  }
}

// DELETE - Delete portfolio item
export async function DELETE(request: Request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Portfolio ID is required' }, { status: 400 })
    }

    await db.portfolio.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete portfolio error:', error)
    return NextResponse.json({ error: 'Failed to delete portfolio item' }, { status: 500 })
  }
}
