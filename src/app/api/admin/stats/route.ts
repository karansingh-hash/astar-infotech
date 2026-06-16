import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { requireAdmin, sanitizeString, validateLength } from '@/lib/security'

// Whitelisted fields for stat creation/update
const STAT_STRING_FIELDS = ['value', 'label'] as const
const STAT_MAX_LENGTHS: Record<string, number> = {
  value: 100,
  label: 200,
}

// POST - Create stat
export async function POST(request: Request) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const data = await request.json()

    // Validate required fields
    if (!data.value || !data.label) {
      return NextResponse.json({ error: 'Value and label are required' }, { status: 400 })
    }

    // Whitelist and sanitize string fields
    const sanitizedData: Record<string, string | number> = {}
    for (const field of STAT_STRING_FIELDS) {
      if (data[field] !== undefined && data[field] !== null) {
        const value = String(data[field])
        if (!validateLength(value, 1, STAT_MAX_LENGTHS[field])) {
          return NextResponse.json(
            { error: `${field} must be between 1 and ${STAT_MAX_LENGTHS[field]} characters` },
            { status: 400 }
          )
        }
        sanitizedData[field] = sanitizeString(value, STAT_MAX_LENGTHS[field])
      }
    }

    // Handle numeric order field
    const order = typeof data.order === 'number' ? data.order : 0

    const createData = {
      value: sanitizedData.value as string,
      label: sanitizedData.label as string,
      order,
    }

    const stat = await db.stat.create({ data: createData })

    revalidatePath('/', 'layout')
    return NextResponse.json({ stat }, { status: 201 })
  } catch (error) {
    console.error('Create stat error:', error)
    return NextResponse.json({ error: 'Failed to create stat' }, { status: 500 })
  }
}

// PUT - Update stat
export async function PUT(request: Request) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const data = await request.json()
    const { id } = data

    if (!id) {
      return NextResponse.json({ error: 'Stat ID is required' }, { status: 400 })
    }

    // Whitelist and sanitize — only pick allowed fields
    const updateData: Record<string, string | number> = {}
    for (const field of STAT_STRING_FIELDS) {
      if (data[field] !== undefined && data[field] !== null) {
        const value = String(data[field])
        if (!validateLength(value, 1, STAT_MAX_LENGTHS[field])) {
          return NextResponse.json(
            { error: `${field} must be between 1 and ${STAT_MAX_LENGTHS[field]} characters` },
            { status: 400 }
          )
        }
        updateData[field] = sanitizeString(value, STAT_MAX_LENGTHS[field])
      }
    }

    if (data.order !== undefined) {
      updateData.order = typeof data.order === 'number' ? data.order : 0
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const stat = await db.stat.update({
      where: { id },
      data: updateData,
    })

    revalidatePath('/', 'layout')
    return NextResponse.json({ stat })
  } catch (error) {
    console.error('Update stat error:', error)
    return NextResponse.json({ error: 'Failed to update stat' }, { status: 500 })
  }
}

// DELETE - Delete stat
export async function DELETE(request: Request) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Stat ID is required' }, { status: 400 })
    }

    await db.stat.delete({ where: { id } })

    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete stat error:', error)
    return NextResponse.json({ error: 'Failed to delete stat' }, { status: 500 })
  }
}
