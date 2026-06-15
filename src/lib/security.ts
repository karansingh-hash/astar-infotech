import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// ─── Password Hashing ───
const SALT_ROUNDS = 12

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// ─── Admin Authentication ───
const ENV_PASSWORD = process.env.ADMIN_PASSWORD || 'astar@2024'

/**
 * Get the effective admin password hash.
 * DB stored password takes priority (key: 'adminPasswordHash').
 * If no hash exists, we hash the env password on-the-fly for comparison.
 * Also supports legacy plaintext passwords for migration.
 */
export async function getEffectivePasswordHash(): Promise<string> {
  try {
    // First check for hashed password
    const hashSetting = await db.siteSetting.findUnique({ where: { key: 'adminPasswordHash' } })
    if (hashSetting?.value) return hashSetting.value

    // Legacy: check for plaintext password and migrate it
    const plainSetting = await db.siteSetting.findUnique({ where: { key: 'adminPassword' } })
    if (plainSetting?.value) {
      // Migrate plaintext to hash
      const hash = await hashPassword(plainSetting.value)
      await db.siteSetting.upsert({
        where: { key: 'adminPasswordHash' },
        update: { value: hash },
        create: { key: 'adminPasswordHash', value: hash },
      })
      // Remove the plaintext password from DB
      await db.siteSetting.deleteMany({ where: { key: 'adminPassword' } })
      return hash
    }

    // Fallback: hash the env password
    return await hashPassword(ENV_PASSWORD)
  } catch {
    return await hashPassword(ENV_PASSWORD)
  }
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const hash = await getEffectivePasswordHash()
  return verifyPassword(password, hash)
}

export async function setAdminPassword(newPassword: string): Promise<void> {
  const hash = await hashPassword(newPassword)
  await db.siteSetting.upsert({
    where: { key: 'adminPasswordHash' },
    update: { value: hash },
    create: { key: 'adminPasswordHash', value: hash },
  })
  // Remove any legacy plaintext passwords
  await db.siteSetting.deleteMany({ where: { key: 'adminPassword' } })
}

// ─── Session Token Management ───
const ACTIVE_TOKENS = new Map<string, { createdAt: number }>()
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export function generateToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
}

export function createSession(token: string): void {
  ACTIVE_TOKENS.set(token, { createdAt: Date.now() })
}

export function validateSession(token: string): boolean {
  const session = ACTIVE_TOKENS.get(token)
  if (!session) return false
  if (Date.now() - session.createdAt > SESSION_DURATION) {
    ACTIVE_TOKENS.delete(token)
    return false
  }
  return true
}

export function destroySession(token: string): void {
  ACTIVE_TOKENS.delete(token)
}

// Clean up expired sessions periodically
setInterval(() => {
  const now = Date.now()
  for (const [token, session] of ACTIVE_TOKENS.entries()) {
    if (now - session.createdAt > SESSION_DURATION) {
      ACTIVE_TOKENS.delete(token)
    }
  }
}, 60 * 60 * 1000) // Every hour

// ─── Admin Auth Middleware ───
export function requireAdmin(request: Request): NextResponse | null {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }
  const token = authHeader.substring(7)
  if (!validateSession(token)) {
    return NextResponse.json({ error: 'Invalid or expired session.' }, { status: 401 })
  }
  return null // Auth passed
}

// ─── Rate Limiting ───
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(key: string, maxRequests: number, windowMs: number): NextResponse | null {
  const now = Date.now()
  const entry = rateLimitMap.get(key)
  
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs })
    return null
  }
  
  if (entry.count >= maxRequests) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    )
  }
  
  entry.count++
  return null
}

export function getClientIP(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
    || request.headers.get('x-real-ip') 
    || 'unknown'
}

// ─── Input Sanitization ───
export function sanitizeString(input: string, maxLength: number = 1000): string {
  if (typeof input !== 'string') return ''
  return input
    .substring(0, maxLength)
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .trim()
}

export function sanitizeForHTML(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// ─── Input Validation ───
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254
}

export function validatePhone(phone: string): boolean {
  return /^\+?[0-9\s\-()]{7,20}$/.test(phone)
}

export function validateLength(value: string, min: number, max: number): boolean {
  return value.length >= min && value.length <= max
}
