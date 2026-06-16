import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

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

// ─── Session Token Management (DB-backed) ───
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours
const MAX_ACTIVE_SESSIONS = 10 // Limit concurrent sessions

function generateSecureToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
}

export async function createSession(token?: string): Promise<string> {
  const sessionToken = token || generateSecureToken()
  const expiresAt = new Date(Date.now() + SESSION_DURATION)

  // Check active session count and evict oldest if needed
  const activeCount = await db.adminSession.count()
  if (activeCount >= MAX_ACTIVE_SESSIONS) {
    // Delete the oldest session
    const oldest = await db.adminSession.findFirst({ orderBy: { expiresAt: 'asc' } })
    if (oldest) {
      await db.adminSession.delete({ where: { id: oldest.id } }).catch(() => {})
    }
  }

  await db.adminSession.create({
    data: { token: sessionToken, expiresAt },
  })

  return sessionToken
}

export async function validateSession(token: string): Promise<boolean> {
  if (!token) return false

  try {
    const session = await db.adminSession.findUnique({ where: { token } })

    if (!session) return false
    if (new Date() > session.expiresAt) {
      // Clean up expired session
      await db.adminSession.delete({ where: { token } }).catch(() => {})
      return false
    }

    return true
  } catch {
    return false
  }
}

export async function destroySession(token: string): Promise<void> {
  try {
    await db.adminSession.delete({ where: { token } })
  } catch {
    // Ignore if session doesn't exist
  }
}

export async function cleanExpiredSessions(): Promise<void> {
  try {
    await db.adminSession.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    })
  } catch {
    // Ignore errors
  }
}

// ─── Admin Auth Middleware (async - uses DB) ───
export async function requireAdmin(request: Request): Promise<NextResponse | null> {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }
  const token = authHeader.substring(7)
  const isValid = await validateSession(token)
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid or expired session.' }, { status: 401 })
  }
  return null // Auth passed
}

// ─── Rate Limiting ───
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const MAX_RATE_LIMIT_ENTRIES = 10000

export function rateLimit(key: string, maxRequests: number, windowMs: number): NextResponse | null {
  const now = Date.now()

  // Periodic cleanup of rate limit map to prevent memory leak
  if (rateLimitMap.size > MAX_RATE_LIMIT_ENTRIES) {
    for (const [k, v] of rateLimitMap.entries()) {
      if (now > v.resetAt) rateLimitMap.delete(k)
    }
  }

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
