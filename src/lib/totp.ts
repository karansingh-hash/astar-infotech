import speakeasy from 'speakeasy'
import QRCode from 'qrcode'
import { db } from '@/lib/db'

const ISSUER = 'A-Star Infotech'
const ACCOUNT_NAME = 'admin@astarinfotech.in'

/**
 * Generate a new TOTP secret (base32 encoded)
 */
export function generateTOTPSecret(): string {
  const secret = speakeasy.generateSecret({
    length: 20,
    name: ACCOUNT_NAME,
    issuer: ISSUER,
  })
  return secret.base32
}

/**
 * Generate the otpauth:// URI for QR code scanning
 */
export function generateOTPAuthURI(secret: string): string {
  return speakeasy.otpauthURL({
    secret,
    label: ACCOUNT_NAME,
    issuer: ISSUER,
    encoding: 'base32',
  })
}

/**
 * Generate a QR code as a data URL (base64 PNG)
 */
export async function generateQRCodeDataUrl(otpauthUri: string): Promise<string> {
  return QRCode.toDataURL(otpauthUri, {
    width: 240,
    margin: 1,
    color: { dark: '#000000', light: '#ffffff' },
    errorCorrectionLevel: 'M',
  })
}

/**
 * Verify a TOTP token against a secret
 * Allows 1 step before/after for clock drift (30s window each way)
 */
export function verifyTOTP(token: string, secret: string): boolean {
  try {
    // Remove spaces and non-digits
    const cleanToken = token.replace(/\D/g, '')
    if (cleanToken.length !== 6) return false
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: cleanToken,
      window: 1, // allow 1 step before/after (30s each way)
    })
  } catch {
    return false
  }
}

// ─── Database-backed 2FA state ───

const TWO_FACTOR_ENABLED_KEY = 'twoFactorEnabled'
const TOTP_SECRET_KEY = 'totpSecret'

/**
 * Check if 2FA is currently enabled
 */
export async function isTwoFactorEnabled(): Promise<boolean> {
  try {
    const setting = await db.siteSetting.findUnique({ where: { key: TWO_FACTOR_ENABLED_KEY } })
    return setting?.value === 'true'
  } catch {
    return false
  }
}

/**
 * Get the stored TOTP secret
 */
export async function getTOTPSecret(): Promise<string | null> {
  try {
    const setting = await db.siteSetting.findUnique({ where: { key: TOTP_SECRET_KEY } })
    return setting?.value || null
  } catch {
    return null
  }
}

/**
 * Save the TOTP secret to database
 */
export async function setTOTPSecret(secret: string): Promise<void> {
  await db.siteSetting.upsert({
    where: { key: TOTP_SECRET_KEY },
    update: { value: secret },
    create: { key: TOTP_SECRET_KEY, value: secret },
  })
}

/**
 * Enable 2FA (called after secret is saved and first code verified)
 */
export async function enableTwoFactor(): Promise<void> {
  await db.siteSetting.upsert({
    where: { key: TWO_FACTOR_ENABLED_KEY },
    update: { value: 'true' },
    create: { key: TWO_FACTOR_ENABLED_KEY, value: 'true' },
  })
}

/**
 * Disable 2FA and remove the secret
 */
export async function disableTwoFactor(): Promise<void> {
  await db.siteSetting.upsert({
    where: { key: TWO_FACTOR_ENABLED_KEY },
    update: { value: 'false' },
    create: { key: TWO_FACTOR_ENABLED_KEY, value: 'false' },
  })
  // Also remove the secret for security
  await db.siteSetting.deleteMany({ where: { key: TOTP_SECRET_KEY } }).catch(() => {})
}
