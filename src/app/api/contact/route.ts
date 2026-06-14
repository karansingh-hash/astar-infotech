import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendContactNotification, sendAutoReply } from '@/lib/email'
import { sendWhatsAppNotification } from '@/lib/whatsapp'
import {
  rateLimit,
  getClientIP,
  sanitizeString,
  sanitizeForHTML,
  validateEmail,
  validatePhone,
  validateLength,
} from '@/lib/security'

export async function POST(request: Request) {
  try {
    // Rate limit: 3 submissions per minute per IP
    const ip = getClientIP(request)
    const rateLimitResult = rateLimit(`contact:${ip}`, 3, 60_000)
    if (rateLimitResult) return rateLimitResult

    const body = await request.json()
    const { name, email, phone, message } = body

    // Validation with length limits
    if (!name || typeof name !== 'string' || !validateLength(name.trim(), 2, 100)) {
      return NextResponse.json(
        { error: 'Name must be between 2 and 100 characters.' },
        { status: 400 }
      )
    }

    if (!email || typeof email !== 'string' || !validateEmail(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      )
    }

    if (!message || typeof message !== 'string' || !validateLength(message.trim(), 10, 5000)) {
      return NextResponse.json(
        { error: 'Message must be between 10 and 5000 characters.' },
        { status: 400 }
      )
    }

    if (phone && typeof phone === 'string' && !validatePhone(phone)) {
      return NextResponse.json(
        { error: 'Please provide a valid phone number.' },
        { status: 400 }
      )
    }

    const contactData = {
      name: sanitizeString(name, 100),
      email: sanitizeString(email, 254).toLowerCase(),
      phone: phone ? sanitizeString(phone, 20) : '',
      message: sanitizeString(message, 5000),
    }

    // Save to database
    const contact = await db.contact.create({
      data: {
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone || null,
        message: contactData.message,
      },
    })

    // Send notifications in the background (don't block the response)
    // Use sanitized HTML-safe data for email templates
    const htmlSafeData = {
      name: sanitizeForHTML(contactData.name),
      email: sanitizeForHTML(contactData.email),
      phone: sanitizeForHTML(contactData.phone),
      message: sanitizeForHTML(contactData.message),
    }

    // 1. Send email notification to business owner
    try {
      await sendContactNotification(htmlSafeData)
      console.log('✅ Email notification sent to business owner')
    } catch (error) {
      console.error('❌ Failed to send email notification:', error)
    }

    // 2. Send auto-reply email to the customer
    try {
      await sendAutoReply(htmlSafeData)
      console.log('✅ Auto-reply email sent to customer')
    } catch (error) {
      console.error('❌ Failed to send auto-reply email:', error)
    }

    // 3. Send WhatsApp notification to business owner
    try {
      await sendWhatsAppNotification(contactData)
      console.log('✅ WhatsApp notification sent')
    } catch (error) {
      console.error('❌ Failed to send WhatsApp notification:', error)
    }

    // Don't expose notification results to prevent information leakage
    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your message! We will get back to you within 24 hours.',
        id: contact.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    )
  }
}

// GET /api/contact - disabled (use /api/contacts with auth instead)
export async function GET() {
  return NextResponse.json({ error: 'Not found.' }, { status: 404 })
}
