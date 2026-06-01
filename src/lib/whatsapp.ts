/**
 * WhatsApp notification utilities for A-Star Infotech
 *
 * Supports multiple methods:
 * 1. CallMeBot API (free, requires setup)
 * 2. Fallback: WhatsApp Click-to-Chat link generation
 */

interface ContactData {
  name: string
  email: string
  phone?: string
  message: string
}

/**
 * Generate a WhatsApp Click-to-Chat URL with pre-filled message
 */
export function generateWhatsAppNotification(data: ContactData): string {
  const businessPhone = process.env.BUSINESS_PHONE || '918560074448'

  const text = [
    `🔔 *New Website Inquiry*`,
    ``,
    `👤 *Name:* ${data.name}`,
    `📧 *Email:* ${data.email}`,
    data.phone ? `📞 *Phone:* ${data.phone}` : '',
    ``,
    `💬 *Message:*`,
    `${data.message}`,
    ``,
    `_Received from A-Star Infotech Website_`,
  ]
    .filter(Boolean)
    .join('\n')

  return `https://wa.me/${businessPhone}?text=${encodeURIComponent(text)}`
}

/**
 * Send WhatsApp notification via CallMeBot API
 *
 * Setup Instructions:
 * 1. Add +34 644 52 74 88 to your WhatsApp contacts
 * 2. Send "I allow callmebot to send me messages" to that number
 * 3. You'll receive a 6-digit API key (e.g., "470123")
 * 4. Add the key to .env as CALLMEBOT_API_KEY
 */
export async function sendWhatsAppNotification(data: ContactData): Promise<{
  success: boolean
  method: string
  error?: string
  waLink?: string
}> {
  const businessPhone = process.env.BUSINESS_PHONE || '918560074448'
  const callMeBotApiKey = process.env.CALLMEBOT_API_KEY

  const text = [
    `🔔 New Website Inquiry`,
    `👤 ${data.name}`,
    `📧 ${data.email}`,
    data.phone ? `📞 ${data.phone}` : '',
    `💬 ${data.message}`,
    ``,
    `From: A-Star Infotech Website`,
  ]
    .filter(Boolean)
    .join('\n')

  // Method 1: Try CallMeBot API (if API key is configured and valid format)
  if (callMeBotApiKey && callMeBotApiKey !== 'your-callmebot-api-key') {
    try {
      const url = `https://api.callmebot.com/whatsapp.php?phone=${businessPhone}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(callMeBotApiKey)}`

      const response = await fetch(url, {
        signal: AbortSignal.timeout(10000), // 10 second timeout
      })

      const responseText = await response.text()

      // CallMeBot returns the message ID on success
      if (response.ok && !responseText.toLowerCase().includes('error')) {
        console.log('✅ WhatsApp notification sent via CallMeBot')
        return { success: true, method: 'callmebot' }
      }

      console.log('⚠️ CallMeBot response:', responseText)
    } catch (error) {
      console.error('❌ CallMeBot request failed:', error)
    }
  }

  // Method 2: Try WhatsApp Cloud API (if configured)
  const whatsappToken = process.env.WHATSAPP_CLOUD_TOKEN
  const whatsappPhoneId = process.env.WHATSAPP_PHONE_ID

  if (whatsappToken && whatsappPhoneId) {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v17.0/${whatsappPhoneId}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${whatsappToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: businessPhone,
            type: 'text',
            text: { body: text },
          }),
          signal: AbortSignal.timeout(10000),
        }
      )

      if (response.ok) {
        console.log('✅ WhatsApp notification sent via Cloud API')
        return { success: true, method: 'whatsapp_cloud' }
      }
    } catch (error) {
      console.error('❌ WhatsApp Cloud API request failed:', error)
    }
  }

  // Fallback: Return WhatsApp link for manual notification
  const waLink = generateWhatsAppNotification(data)
  console.log('⚠️ No working WhatsApp API configured. Generated link for manual use.')

  return {
    success: false,
    method: 'fallback_link',
    waLink,
    error: 'WhatsApp API not configured. Please set up CallMeBot (see instructions in whatsapp.ts) or provide a valid API key.',
  }
}
