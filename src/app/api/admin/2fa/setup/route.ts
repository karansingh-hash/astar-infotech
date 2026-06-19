import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/security'
import {
  generateTOTPSecret,
  generateOTPAuthURI,
  generateQRCodeDataUrl,
  setTOTPSecret,
  isTwoFactorEnabled,
} from '@/lib/totp'

/**
 * Setup 2FA: Generate a new TOTP secret and return QR code
 * Requires admin authentication
 */
export async function POST(request: Request) {
  // Require admin auth
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    // If 2FA already enabled, don't allow re-setup (must disable first)
    const enabled = await isTwoFactorEnabled()
    if (enabled) {
      return NextResponse.json(
        { success: false, error: 'Two-factor authentication is already enabled. Disable it first to set up again.' },
        { status: 400 }
      )
    }

    // Generate new secret
    const secret = generateTOTPSecret()
    await setTOTPSecret(secret)

    // Generate QR code
    const otpauthUri = generateOTPAuthURI(secret)
    const qrCodeDataUrl = await generateQRCodeDataUrl(otpauthUri)

    return NextResponse.json({
      success: true,
      secret, // shown for manual entry
      qrCode: qrCodeDataUrl,
      otpauthUri,
      message: 'Scan the QR code with Google Authenticator, then verify with a code.',
    })
  } catch (error) {
    console.error('2FA setup error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to set up two-factor authentication.' },
      { status: 500 }
    )
  }
}
