import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendContactNotification, sendAutoReply } from '@/lib/email'
import { sendWhatsAppNotification } from '@/lib/whatsapp'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, message } = body

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters long.' },
        { status: 400 }
      )
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      )
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters long.' },
        { status: 400 }
      )
    }

    if (phone && typeof phone !== 'string') {
      return NextResponse.json(
        { error: 'Phone number must be a valid string.' },
        { status: 400 }
      )
    }

    const contactData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || '',
      message: message.trim(),
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
    const notificationResults = {
      email: false,
      autoReply: false,
      whatsapp: false,
    }

    // 1. Send email notification to business owner
    try {
      await sendContactNotification(contactData)
      notificationResults.email = true
      console.log('✅ Email notification sent to business owner')
    } catch (error) {
      console.error('❌ Failed to send email notification:', error)
    }

    // 2. Send auto-reply email to the customer
    try {
      await sendAutoReply(contactData)
      notificationResults.autoReply = true
      console.log('✅ Auto-reply email sent to customer')
    } catch (error) {
      console.error('❌ Failed to send auto-reply email:', error)
    }

    // 3. Send WhatsApp notification to business owner
    try {
      const waResult = await sendWhatsAppNotification(contactData)
      notificationResults.whatsapp = waResult.success
      if (waResult.error) {
        console.log('⚠️ WhatsApp notification:', waResult.error)
      } else {
        console.log('✅ WhatsApp notification sent')
      }
    } catch (error) {
      console.error('❌ Failed to send WhatsApp notification:', error)
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your message! We will get back to you within 24 hours.',
        id: contact.id,
        notifications: notificationResults,
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

export async function GET() {
  try {
    const contacts = await db.contact.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    return NextResponse.json({ contacts })
  } catch (error) {
    console.error('Fetch contacts error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contacts.' },
      { status: 500 }
    )
  }
}
