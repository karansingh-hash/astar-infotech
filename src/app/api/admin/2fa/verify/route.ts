import { NextResponse } from 'next/server'
import { requireAdmin, validateLength } from '@/lib/security'
import {
  verifyTOTP,
  getTOTPSecret,
  enableTwoFactor,
  isTwoFactorEnabled,
} from '@/lib/totp'

/**
 * Verify 2FA: Confirm a TOTP code and enable 2FA
 * Requires admin auth
 */
export async function POST(request: Request) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const body = await request.json()
    const { token } = body

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Verification code is required.' },
        { status: 400 }
      )
    }

    if (!validateLength(token.replace(/\D/g, ''), 6, 6)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 6-digit code.' },
        { status: 400 }
      )
    }

    // Check if already enabled
    const alreadyEnabled = await isTwoFactorEnabled()
    if (alreadyEnabled) {
      return NextResponse.json(
        { success: false, error: 'Two-factor authentication is already enabled.' },
        { status: 400 }
      )
    }

    // Get the secret
    const secret = await getTOTPSecret()
    if (!secret) {
      return NextResponse.json(
        { success: false, error: 'No 2FA setup found. Please set up 2FA first.' },
        { status: 400 }
      )
    }

    // Verify the token
    const isValid = verifyTOTP(token, secret)
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid verification code. Please try again.' },
        { status: 401 }
      )
    }

    // Enable 2FA
    await enableTwoFactor()

    return NextResponse.json({
      success: true,
      message: 'Two-factor authentication enabled successfully!',
    })
  } catch (error) {
    console.error('2FA verify error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to verify two-factor authentication.' },
      { status: 500 }
    )
  }
}
