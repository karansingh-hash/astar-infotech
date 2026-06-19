import { NextResponse } from 'next/server'
import {
  verifyAdminPassword,
  rateLimit,
  getClientIP,
  validateLength,
} from '@/lib/security'
import { disableTwoFactor, isTwoFactorEnabled } from '@/lib/totp'

/**
 * Emergency 2FA Reset: Requires ONLY the admin password (no TOTP code).
 *
 * Use case: The admin enabled 2FA but lost access to their authenticator app
 * (e.g. phone lost, app reinstalled, or 2FA was enabled during testing and
 * the secret was never added to a real authenticator app). This endpoint lets
 * them reset 2FA so they can log back in and set it up fresh.
 *
 * Security: This requires knowledge of the admin password (first factor), so it
 * maintains single-factor security. Rate-limited to 3 attempts per minute per IP
 * to prevent brute force.
 */
export async function POST(request: Request) {
  try {
    // Rate limit: 3 attempts per minute per IP (stricter than login)
    const ip = getClientIP(request)
    const rateLimitResult = rateLimit(`2fa-reset:${ip}`, 3, 60_000)
    if (rateLimitResult) return rateLimitResult

    const body = await request.json()
    const { password } = body

    // Validate password presence
    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Admin password is required to reset 2FA.' },
        { status: 400 }
      )
    }

    if (!validateLength(password, 1, 128)) {
      return NextResponse.json(
        { success: false, error: 'Invalid password format.' },
        { status: 400 }
      )
    }

    // Verify the admin password
    const passwordValid = await verifyAdminPassword(password)
    if (!passwordValid) {
      return NextResponse.json(
        { success: false, error: 'Incorrect password. 2FA was not reset.' },
        { status: 401 }
      )
    }

    // Check 2FA is actually enabled (no point resetting if not)
    const enabled = await isTwoFactorEnabled()
    if (!enabled) {
      return NextResponse.json(
        {
          success: true,
          message: 'Two-factor authentication is not currently enabled. You can log in with just your password.',
        }
      )
    }

    // Disable 2FA and clear the secret
    await disableTwoFactor()

    return NextResponse.json({
      success: true,
      message: 'Two-factor authentication has been reset. You can now log in with just your password and set up 2FA again.',
    })
  } catch (error) {
    console.error('2FA reset error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to reset two-factor authentication. Please try again.' },
      { status: 500 }
    )
  }
}
