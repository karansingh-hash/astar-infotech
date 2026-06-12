import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { validateSession } from '@/lib/admin-auth'

async function checkAuth(request: Request): Promise<boolean> {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  if (!token) return false
  return validateSession(token)
}

// POST - Create testimonial
export async function POST(request: Request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const testimonial = await db.testimonial.create({
      data: {
        name: data.name,
        company: data.company,
        review: data.review,
        rating: data.rating || 5,
        order: data.order || 0,
      },
    })
    return NextResponse.json({ testimonial }, { status: 201 })
  } catch (error) {
    console.error('Create testimonial error:', error)
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 })
  }
}

// PUT - Update testimonial
export async function PUT(request: Request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const { id, ...updateData } = data

    if (!id) {
      return NextResponse.json({ error: 'Testimonial ID is required' }, { status: 400 })
    }

    const testimonial = await db.testimonial.update({
      where: { id },
      data: updateData,
    })
    return NextResponse.json({ testimonial })
  } catch (error) {
    console.error('Update testimonial error:', error)
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 })
  }
}

// DELETE - Delete testimonial
export async function DELETE(request: Request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Testimonial ID is required' }, { status: 400 })
    }

    await db.testimonial.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete testimonial error:', error)
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 })
  }
}
