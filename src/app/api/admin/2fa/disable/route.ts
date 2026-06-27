import { NextResponse } from 'next/server'
import { requireAdmin, validateLength, verifyAdminPassword } from '@/lib/security'
import { verifyTOTP, getTOTPSecret, disableTwoFactor, isTwoFactorEnabled } from '@/lib/totp'

/**
 * Disable 2FA: Requires current password AND a valid TOTP code
 * Double security to prevent accidental/malicious disable
 */
export async function POST(request: Request) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const body = await request.json()
    const { password, token } = body

    // Validate password
    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Current password is required to disable 2FA.' },
        { status: 400 }
      )
    }

    // Validate token
    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Google Authenticator code is required to disable 2FA.' },
        { status: 400 }
      )
    }

    if (!validateLength(token.replace(/\D/g, ''), 6, 6)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 6-digit code.' },
        { status: 400 }
      )
    }

    // Verify password
    const passwordValid = await verifyAdminPassword(password)
    if (!passwordValid) {
      return NextResponse.json(
        { success: false, error: 'Current password is incorrect.' },
        { status: 401 }
      )
    }

    // Check 2FA is enabled
    const enabled = await isTwoFactorEnabled()
    if (!enabled) {
      return NextResponse.json(
        { success: false, error: 'Two-factor authentication is not enabled.' },
        { status: 400 }
      )
    }

    // Verify TOTP code
    const secret = await getTOTPSecret()
    if (!secret) {
      return NextResponse.json(
        { success: false, error: 'No 2FA secret found.' },
        { status: 400 }
      )
    }

    const tokenValid = verifyTOTP(token, secret)
    if (!tokenValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid Google Authenticator code.' },
        { status: 401 }
      )
    }

    // Disable 2FA
    await disableTwoFactor()

    return NextResponse.json({
      success: true,
      message: 'Two-factor authentication disabled successfully.',
    })
  } catch (error) {
    console.error('2FA disable error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to disable two-factor authentication.' },
      { status: 500 }
    )
  }
}
