import { NextResponse } from 'next/server'
import {
  setAdminPassword,
  rateLimit,
  getClientIP,
  validateLength,
} from '@/lib/security'
import {
  isTwoFactorEnabled,
  verifyTOTP,
  getTOTPSecret,
} from '@/lib/totp'

/**
 * Reset Admin Password via Google Authenticator.
 *
 * Use case: The admin has forgotten their admin password but still has
 * access to their Google Authenticator app. By verifying a valid TOTP
 * code (the second factor), we trust their identity and let them set a
 * new admin password.
 *
 * Security:
 * - Requires 2FA to be enabled (otherwise there is no TOTP secret to
 *   verify against, and this recovery path does not apply).
 * - The provided TOTP code is verified against the stored secret with a
 *   ±30s window for clock drift.
 * - The new password is validated (8–128 chars) and stored as a bcrypt
 *   hash. 2FA remains enabled, so the admin still logs in with the new
 *   password + an authenticator code.
 * - Rate-limited to 3 attempts per minute per IP to prevent brute force
 *   on the TOTP code.
 */
export async function POST(request: Request) {
  try {
    // Rate limit: 3 attempts per minute per IP
    const ip = getClientIP(request)
    const rateLimitResult = rateLimit(`pw-reset:${ip}`, 3, 60_000)
    if (rateLimitResult) return rateLimitResult

    const body = await request.json()
    const { totpCode, newPassword } = body

    // Validate TOTP code presence
    if (!totpCode || typeof totpCode !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Google Authenticator code is required.' },
        { status: 400 }
      )
    }

    const cleanCode = totpCode.replace(/\D/g, '')
    if (cleanCode.length !== 6) {
      return NextResponse.json(
        { success: false, error: 'Authenticator code must be 6 digits.' },
        { status: 400 }
      )
    }

    // Validate new password presence
    if (!newPassword || typeof newPassword !== 'string') {
      return NextResponse.json(
        { success: false, error: 'A new password is required.' },
        { status: 400 }
      )
    }

    if (!validateLength(newPassword, 8, 128)) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 8 characters long.' },
        { status: 400 }
      )
    }

    // 2FA must be enabled for this recovery path to work
    const twoFactorEnabled = await isTwoFactorEnabled()
    if (!twoFactorEnabled) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Password reset via Google Authenticator is not available because two-factor authentication is not enabled. Please use your admin password to log in, or enable 2FA first.',
        },
        { status: 400 }
      )
    }

    // Verify the TOTP code against the stored secret
    const secret = await getTOTPSecret()
    if (!secret) {
      return NextResponse.json(
        { success: false, error: 'Authenticator secret not found. Please contact support.' },
        { status: 500 }
      )
    }

    const totpValid = verifyTOTP(cleanCode, secret)
    if (!totpValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid Google Authenticator code. Password was not changed.' },
        { status: 401 }
      )
    }

    // TOTP verified — update the admin password
    await setAdminPassword(newPassword)

    return NextResponse.json({
      success: true,
      message:
        'Your admin password has been reset successfully. You can now log in with your new password and Google Authenticator code.',
    })
  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to reset password. Please try again.' },
      { status: 500 }
    )
  }
}
