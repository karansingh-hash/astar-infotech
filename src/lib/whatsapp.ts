/**
 * Generate a WhatsApp notification URL that sends a message to the business owner
 * when someone submits the contact form.
 *
 * This opens WhatsApp Web/App with a pre-filled message containing the form details.
 */
export function generateWhatsAppNotification(data: {
  name: string
  email: string
  phone?: string
  message: string
}): string {
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
 * Send a WhatsApp notification via the CallMeBot API (free service)
 * This sends a WhatsApp message directly to the business phone without user interaction.
 *
 * Setup: Visit https://www.callmebot.com/blog/free-api-whatsapp-messages/
 * and follow the steps to activate your phone number.
 */
export async function sendWhatsAppNotification(data: {
  name: string
  email: string
  phone?: string
  message: string
}): Promise<{ success: boolean; method: string; error?: string }> {
  const businessPhone = process.env.BUSINESS_PHONE || '918560074448'

  const text = [
    `🔔 New Website Inquiry`,
    `👤 ${data.name}`,
    `📧 ${data.email}`,
    data.phone ? `📞 ${data.phone}` : '',
    `💬 ${data.message}`,
  ]
    .filter(Boolean)
    .join('\n')

  try {
    // Try CallMeBot WhatsApp API (free, requires one-time setup)
    const callMeBotApiKey = process.env.CALLMEBOT_API_KEY

    if (callMeBotApiKey) {
      const url = `https://api.callmebot.com/whatsapp.php?phone=${businessPhone}&text=${encodeURIComponent(text)}&apikey=${callMeBotApiKey}`

      const response = await fetch(url)

      if (response.ok) {
        return { success: true, method: 'callmebot' }
      }
    }

    // Fallback: Return the WhatsApp URL for manual notification
    const waUrl = generateWhatsAppNotification(data)
    return {
      success: true,
      method: 'whatsapp_link',
      error: 'WhatsApp API key not configured. Using link method. Set CALLMEBOT_API_KEY in .env for automatic WhatsApp notifications.',
    }
  } catch (error) {
    const waUrl = generateWhatsAppNotification(data)
    return {
      success: false,
      method: 'fallback_link',
      error: `WhatsApp notification failed: ${error instanceof Error ? error.message : 'Unknown error'}. Manual link: ${waUrl}`,
    }
  }
}
