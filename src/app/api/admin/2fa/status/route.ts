import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/security'
import { isTwoFactorEnabled } from '@/lib/totp'

/**
 * Get 2FA status: Check if 2FA is enabled
 * Requires admin auth
 */
export async function GET(request: Request) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const enabled = await isTwoFactorEnabled()
    return NextResponse.json({ success: true, enabled })
  } catch (error) {
    console.error('2FA status error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get 2FA status.' },
      { status: 500 }
    )
  }
}
