import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { validateSession } from '@/lib/admin-auth'

async function checkAuth(request: Request): Promise<boolean> {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  if (!token) return false
  return validateSession(token)
}

// POST - Create stat
export async function POST(request: Request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const stat = await db.stat.create({
      data: {
        value: data.value,
        label: data.label,
        order: data.order || 0,
      },
    })
    return NextResponse.json({ stat }, { status: 201 })
  } catch (error) {
    console.error('Create stat error:', error)
    return NextResponse.json({ error: 'Failed to create stat' }, { status: 500 })
  }
}

// PUT - Update stat
export async function PUT(request: Request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const { id, ...updateData } = data

    if (!id) {
      return NextResponse.json({ error: 'Stat ID is required' }, { status: 400 })
    }

    const stat = await db.stat.update({
      where: { id },
      data: updateData,
    })
    return NextResponse.json({ stat })
  } catch (error) {
    console.error('Update stat error:', error)
    return NextResponse.json({ error: 'Failed to update stat' }, { status: 500 })
  }
}

// DELETE - Delete stat
export async function DELETE(request: Request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Stat ID is required' }, { status: 400 })
    }

    await db.stat.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete stat error:', error)
    return NextResponse.json({ error: 'Failed to delete stat' }, { status: 500 })
  }
}
