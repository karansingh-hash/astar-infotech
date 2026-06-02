/**
 * WhatsApp notification utilities for A-Star Infotech
 *
 * Supports multiple methods:
 * 1. Fonnte API (FREE, easy setup) ← RECOMMENDED
 * 2. CallMeBot API (free, requires setup)
 * 3. UltraMsg API (free tier available)
 * 4. Fallback: WhatsApp Click-to-Chat link
 */

interface ContactData {
  name: string
  email: string
  phone?: string
  message: string
}

function formatMessage(data: ContactData): string {
  return [
    `🔔 *New Website Inquiry*`,
    ``,
    `👤 *Name:* ${data.name}`,
    `📧 *Email:* ${data.email}`,
    data.phone ? `📞 *Phone:* ${data.phone}` : '',
    ``,
    `💬 *Message:*`,
    `${data.message}`,
    ``,
    `_From A-Star Infotech Website_`,
  ]
    .filter(Boolean)
    .join('\n')
}

/**
 * METHOD 1: Fonnte.com (FREE WhatsApp API - RECOMMENDED)
 *
 * Setup (2 minutes):
 * 1. Go to https://fonnte.com
 * 2. Register with your WhatsApp number (+91 8560074448)
 * 3. Verify the number (you'll get a code on WhatsApp)
 * 4. Copy your API token from the dashboard
 * 5. Add it to .env as FONNTE_TOKEN=your-token-here
 *
 * Free tier: Up to 1000 messages/month
 */
async function sendViaFonnte(data: ContactData): Promise<boolean> {
  const token = process.env.FONNTE_TOKEN
  if (!token) return false

  try {
    const phone = process.env.BUSINESS_PHONE || '918560074448'
    const message = formatMessage(data)

    const response = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        target: phone,
        message: message,
      }),
      signal: AbortSignal.timeout(15000),
    })

    const result = await response.json()

    if (result.status === true || result.status === 'true') {
      console.log('✅ WhatsApp sent via Fonnte')
      return true
    }

    console.log('⚠️ Fonnte response:', JSON.stringify(result))
    return false
  } catch (error) {
    console.error('❌ Fonnte failed:', error)
    return false
  }
}

/**
 * METHOD 2: CallMeBot API (free)
 *
 * Setup:
 * 1. Add +34 644 52 74 88 to WhatsApp contacts
 * 2. Send "I allow callmebot to send me messages"
 * 3. You'll receive a short API key (like "470123")
 * 4. Add it to .env as CALLMEBOT_API_KEY=470123
 */
async function sendViaCallMeBot(data: ContactData): Promise<boolean> {
  const apiKey = process.env.CALLMEBOT_API_KEY
  if (!apiKey || apiKey === 'your-callmebot-api-key') return false

  try {
    const phone = process.env.BUSINESS_PHONE || '918560074448'
    const text = [
      `🔔 New Website Inquiry`,
      `👤 ${data.name}`,
      `📧 ${data.email}`,
      data.phone ? `📞 ${data.phone}` : '',
      `💬 ${data.message}`,
    ].filter(Boolean).join('\n')

    const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apiKey)}`

    const response = await fetch(url, { signal: AbortSignal.timeout(15000) })
    const responseText = await response.text()

    if (response.ok && !responseText.toLowerCase().includes('error')) {
      console.log('✅ WhatsApp sent via CallMeBot')
      return true
    }

    console.log('⚠️ CallMeBot response:', responseText)
    return false
  } catch (error) {
    console.error('❌ CallMeBot failed:', error)
    return false
  }
}

/**
 * METHOD 3: UltraMsg API (free tier)
 *
 * Setup:
 * 1. Go to https://ultramsg.com
 * 2. Create account and get Instance ID + Token
 * 3. Add to .env:
 *    ULTRAMSG_INSTANCE_ID=your-instance-id
 *    ULTRAMSG_TOKEN=your-token
 */
async function sendViaUltraMsg(data: ContactData): Promise<boolean> {
  const instanceId = process.env.ULTRAMSG_INSTANCE_ID
  const token = process.env.ULTRAMSG_TOKEN
  if (!instanceId || !token) return false

  try {
    const phone = process.env.BUSINESS_PHONE || '918560074448'
    const message = formatMessage(data)

    const response = await fetch(`https://api.ultramsg.com/${instanceId}/messages/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        token: token,
        to: phone,
        body: message,
      }),
      signal: AbortSignal.timeout(15000),
    })

    const result = await response.json()

    if (result.sent === 'true' || result.sent === true) {
      console.log('✅ WhatsApp sent via UltraMsg')
      return true
    }

    console.log('⚠️ UltraMsg response:', JSON.stringify(result))
    return false
  } catch (error) {
    console.error('❌ UltraMsg failed:', error)
    return false
  }
}

/**
 * Fallback: Generate WhatsApp Click-to-Chat URL
 */
export function generateWhatsAppNotification(data: ContactData): string {
  const businessPhone = process.env.BUSINESS_PHONE || '918560074448'
  const text = formatMessage(data)
  return `https://wa.me/${businessPhone}?text=${encodeURIComponent(text)}`
}

/**
 * Main send function - tries all methods in order
 */
export async function sendWhatsAppNotification(data: ContactData): Promise<{
  success: boolean
  method: string
  error?: string
  waLink?: string
}> {
  // Try Fonnte first (RECOMMENDED - free & reliable)
  const fonnteResult = await sendViaFonnte(data)
  if (fonnteResult) {
    return { success: true, method: 'fonnte' }
  }

  // Try CallMeBot
  const callMeBotResult = await sendViaCallMeBot(data)
  if (callMeBotResult) {
    return { success: true, method: 'callmebot' }
  }

  // Try UltraMsg
  const ultraMsgResult = await sendViaUltraMsg(data)
  if (ultraMsgResult) {
    return { success: true, method: 'ultramsg' }
  }

  // Fallback: return WhatsApp link
  const waLink = generateWhatsAppNotification(data)
  return {
    success: false,
    method: 'fallback_link',
    waLink,
    error: 'No WhatsApp API configured. Set up Fonnte (recommended), CallMeBot, or UltraMsg.',
  }
}
