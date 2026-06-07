import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const testimonials = await db.testimonial.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json({ testimonials })
  } catch (error) {
    console.error('Fetch testimonials error:', error)
    return NextResponse.json({ error: 'Failed to fetch testimonials.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, company, review, rating, order } = body

    if (!name || !company || !review) {
      return NextResponse.json({ error: 'Name, company, and review are required.' }, { status: 400 })
    }

    const testimonial = await db.testimonial.create({
      data: {
        name: name.trim(),
        company: company.trim(),
        review: review.trim(),
        rating: rating || 5,
        order: order || 0,
      },
    })

    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true, testimonial }, { status: 201 })
  } catch (error) {
    console.error('Create testimonial error:', error)
    return NextResponse.json({ error: 'Failed to create testimonial.' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, name, company, review, rating, order } = body

    if (!id) {
      return NextResponse.json({ error: 'Testimonial ID is required.' }, { status: 400 })
    }

    const existing = await db.testimonial.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Testimonial not found.' }, { status: 404 })
    }

    const testimonial = await db.testimonial.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(company !== undefined && { company: company.trim() }),
        ...(review !== undefined && { review: review.trim() }),
        ...(rating !== undefined && { rating }),
        ...(order !== undefined && { order }),
      },
    })

    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true, testimonial })
  } catch (error) {
    console.error('Update testimonial error:', error)
    return NextResponse.json({ error: 'Failed to update testimonial.' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'Testimonial ID is required.' }, { status: 400 })
    }

    await db.testimonial.delete({ where: { id } })
    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true, message: 'Testimonial deleted.' })
  } catch (error) {
    console.error('Delete testimonial error:', error)
    return NextResponse.json({ error: 'Failed to delete testimonial.' }, { status: 500 })
  }
}
