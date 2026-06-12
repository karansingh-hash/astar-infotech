import { db } from '@/lib/db'

const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export async function createSession(): Promise<string> {
  const array = new Uint8Array(32)
  if (typeof globalThis.crypto !== 'undefined' && globalThis.crypto.getRandomValues) {
    globalThis.crypto.getRandomValues(array)
  } else {
    // Fallback for environments without crypto
    for (let i = 0; i < 32; i++) {
      array[i] = Math.floor(Math.random() * 256)
    }
  }
  const token = Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('')
  const expiresAt = new Date(Date.now() + SESSION_DURATION)

  await db.adminSession.create({
    data: { token, expiresAt },
  })

  return token
}

export async function validateSession(token: string): Promise<boolean> {
  if (!token) return false

  const session = await db.adminSession.findUnique({
    where: { token },
  })

  if (!session) return false
  if (new Date() > session.expiresAt) {
    // Clean up expired session
    await db.adminSession.delete({ where: { token } }).catch(() => {})
    return false
  }

  return true
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
