import { NextResponse } from 'next/server'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'astar@2024'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { password } = body

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Password is required.' },
        { status: 400 }
      )
    }

    if (password === ADMIN_PASSWORD) {
      return NextResponse.json({
        success: true,
        message: 'Authentication successful.',
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid password.' },
      { status: 401 }
    )
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body.' },
      { status: 400 }
    )
  }
}
