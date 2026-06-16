import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { requireAdmin, sanitizeString, validateLength } from '@/lib/security'

// Whitelisted fields for service creation/update
const SERVICE_STRING_FIELDS = ['title', 'description', 'icon', 'color', 'bgColor'] as const
const SERVICE_MAX_LENGTHS: Record<string, number> = {
  title: 200,
  description: 2000,
  icon: 100,
  color: 100,
  bgColor: 100,
}

// POST - Create service
export async function POST(request: Request) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 })
    }

    // Whitelist and sanitize string fields
    const sanitizedData: Record<string, string | number> = {}
    for (const field of SERVICE_STRING_FIELDS) {
      if (data[field] !== undefined && data[field] !== null) {
        const value = String(data[field])
        if (!validateLength(value, 1, SERVICE_MAX_LENGTHS[field])) {
          return NextResponse.json(
            { error: `${field} must be between 1 and ${SERVICE_MAX_LENGTHS[field]} characters` },
            { status: 400 }
          )
        }
        sanitizedData[field] = sanitizeString(value, SERVICE_MAX_LENGTHS[field])
      }
    }

    // Handle numeric order field
    const order = typeof data.order === 'number' ? data.order : 0

    // Provide defaults for fields not supplied
    const createData = {
      title: sanitizedData.title as string,
      description: sanitizedData.description as string,
      icon: (sanitizedData.icon as string) || 'Globe',
      color: (sanitizedData.color as string) || 'text-emerald-600',
      bgColor: (sanitizedData.bgColor as string) || 'bg-emerald-50',
      order,
    }

    const service = await db.service.create({ data: createData })

    revalidatePath('/', 'layout')
    return NextResponse.json({ service }, { status: 201 })
  } catch (error) {
    console.error('Create service error:', error)
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 })
  }
}

// PUT - Update service
export async function PUT(request: Request) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const data = await request.json()
    const { id } = data

    if (!id) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 })
    }

    // Whitelist and sanitize — only pick allowed fields
    const updateData: Record<string, string | number> = {}
    for (const field of SERVICE_STRING_FIELDS) {
      if (data[field] !== undefined && data[field] !== null) {
        const value = String(data[field])
        if (!validateLength(value, 1, SERVICE_MAX_LENGTHS[field])) {
          return NextResponse.json(
            { error: `${field} must be between 1 and ${SERVICE_MAX_LENGTHS[field]} characters` },
            { status: 400 }
          )
        }
        updateData[field] = sanitizeString(value, SERVICE_MAX_LENGTHS[field])
      }
    }

    if (data.order !== undefined) {
      updateData.order = typeof data.order === 'number' ? data.order : 0
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const service = await db.service.update({
      where: { id },
      data: updateData,
    })

    revalidatePath('/', 'layout')
    return NextResponse.json({ service })
  } catch (error) {
    console.error('Update service error:', error)
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 })
  }
}

// DELETE - Delete service
export async function DELETE(request: Request) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 })
    }

    await db.service.delete({ where: { id } })

    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete service error:', error)
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 })
  }
}
