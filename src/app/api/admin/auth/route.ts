import { NextResponse } from 'next/server'
import {
  verifyAdminPassword,
  setAdminPassword,
  createSession,
  validateSession,
  destroySession,
  rateLimit,
  getClientIP,
  validateLength,
} from '@/lib/security'

/** Login — verify password and issue session token */
export async function POST(request: Request) {
  try {
    // Rate limit: 5 attempts per minute per IP
    const ip = getClientIP(request)
    const rateLimitResult = rateLimit(`auth:${ip}`, 5, 60_000)
    if (rateLimitResult) return rateLimitResult

    const body = await request.json()
    const { password } = body

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Password is required.' },
        { status: 400 }
      )
    }

    if (!validateLength(password, 1, 128)) {
      return NextResponse.json(
        { success: false, error: 'Invalid password format.' },
        { status: 400 }
      )
    }

    const isValid = await verifyAdminPassword(password)

    if (isValid) {
      const token = await createSession()
      return NextResponse.json({
        success: true,
        message: 'Authentication successful.',
        token,
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

/** Validate session token */
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ valid: false }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const isValid = await validateSession(token)

    if (!isValid) {
      return NextResponse.json({ valid: false }, { status: 401 })
    }

    return NextResponse.json({ valid: true })
  } catch {
    return NextResponse.json({ valid: false }, { status: 401 })
  }
}

/** Logout — destroy session */
export async function DELETE(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      await destroySession(token)
    }
    return NextResponse.json({ success: true, message: 'Logged out.' })
  } catch {
    return NextResponse.json({ success: true, message: 'Logged out.' })
  }
}

/** Change password — requires current password + new password */
export async function PUT(request: Request) {
  try {
    // Rate limit: 3 attempts per minute per IP
    const ip = getClientIP(request)
    const rateLimitResult = rateLimit(`changepw:${ip}`, 3, 60_000)
    if (rateLimitResult) return rateLimitResult

    // Require active session
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Authentication required.' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    if (!(await validateSession(token))) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired session.' },
        { status: 401 }
      )
    }

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

    if (!validateLength(newPassword, 8, 128)) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 8 characters long.' },
        { status: 400 }
      )
    }

    // Verify current password
    const isValid = await verifyAdminPassword(currentPassword)
    if (!isValid) {
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

    // Save new hashed password to database
    await setAdminPassword(newPassword)

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
