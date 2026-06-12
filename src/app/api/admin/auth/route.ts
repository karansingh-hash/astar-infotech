import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const ENV_PASSWORD = process.env.ADMIN_PASSWORD || 'astar@2024'

/** Get the effective admin password (DB override → env fallback) */
async function getEffectivePassword(): Promise<string> {
  try {
    const setting = await db.siteSetting.findUnique({ where: { key: 'adminPassword' } })
    return setting?.value || ENV_PASSWORD
  } catch {
    return ENV_PASSWORD
  }
}

/** Login — verify password */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { password } = body

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Password is required.' },
        { status: 400 }
      )
    }

    const effectivePassword = await getEffectivePassword()

    if (password === effectivePassword) {
      return NextResponse.json({
        success: true,
        message: 'Authentication successful.',
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid password.' },
      { status: 401 }
    )
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body.' },
      { status: 400 }
    )
  }
}

/** Change password — requires current password + new password */
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || typeof currentPassword !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Current password is required.' },
        { status: 400 }
      )
    }

    if (!newPassword || typeof newPassword !== 'string') {
      return NextResponse.json(
        { success: false, error: 'New password is required.' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 6 characters long.' },
        { status: 400 }
      )
    }

    // Verify current password
    const effectivePassword = await getEffectivePassword()
    if (currentPassword !== effectivePassword) {
      return NextResponse.json(
        { success: false, error: 'Current password is incorrect.' },
        { status: 401 }
      )
    }

    if (newPassword === currentPassword) {
      return NextResponse.json(
        { success: false, error: 'New password must be different from current password.' },
        { status: 400 }
      )
    }

    // Save new password to database (overrides env var)
    await db.siteSetting.upsert({
      where: { key: 'adminPassword' },
      update: { value: newPassword },
      create: { key: 'adminPassword', value: newPassword },
    })

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully.',
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to change password. Please try again.' },
      { status: 500 }
    )
  }
}
