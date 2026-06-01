import nodemailer from 'nodemailer'

// Create reusable transporter
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

interface ContactFormData {
  name: string
  email: string
  phone?: string
  message: string
}

/**
 * Send email notification to the business owner when a new contact form is submitted
 */
export async function sendContactNotification(data: ContactFormData) {
  const businessEmail = process.env.BUSINESS_EMAIL || 'astarinfotech.dev@gmail.com'

  const transporter = createTransporter()

  const mailOptions = {
    from: `"A-Star Infotech Website" <${process.env.EMAIL_USER || 'astarinfotech.dev@gmail.com'}>`,
    to: businessEmail,
    subject: `New Contact Form Submission from ${data.name}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; border-radius: 12px; overflow: hidden;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #059669, #047857); padding: 24px 32px;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px;">📩 New Contact Form Submission</h1>
          <p style="color: #d1fae5; margin: 8px 0 0; font-size: 14px;">A-Star Infotech Website</p>
        </div>

        <!-- Body -->
        <div style="padding: 28px 32px;">
          <p style="font-size: 16px; color: #374151; margin: 0 0 20px;">
            You have received a new inquiry from your website. Here are the details:
          </p>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 16px; background: #ecfdf5; border-radius: 8px 0 0 8px; font-weight: 600; color: #065f46; width: 130px;">Name</td>
              <td style="padding: 12px 16px; background: #f0fdf4; border-radius: 0 8px 8px 0; color: #1f2937;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; background: #ecfdf5; border-radius: 8px 0 0 8px; font-weight: 600; color: #065f46;">Email</td>
              <td style="padding: 12px 16px; background: #f0fdf4; border-radius: 0 8px 8px 0; color: #1f2937;">
                <a href="mailto:${data.email}" style="color: #059669; text-decoration: underline;">${data.email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; background: #ecfdf5; border-radius: 8px 0 0 8px; font-weight: 600; color: #065f46;">Phone</td>
              <td style="padding: 12px 16px; background: #f0fdf4; border-radius: 0 8px 8px 0; color: #1f2937;">
                ${data.phone || 'Not provided'}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; background: #ecfdf5; border-radius: 8px 0 0 8px; font-weight: 600; color: #065f46; vertical-align: top;">Message</td>
              <td style="padding: 12px 16px; background: #f0fdf4; border-radius: 0 8px 8px 0; color: #1f2937; line-height: 1.6;">${data.message}</td>
            </tr>
          </table>

          <div style="margin-top: 24px; padding: 16px; background: #fffbeb; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; font-size: 13px; color: #92400e;">
              ⏰ <strong>Quick Tip:</strong> Respond within 24 hours for the best client experience. You can also reach out on WhatsApp: 
              <a href="https://wa.me/${data.phone?.replace(/[^0-9]/g, '') || ''}" style="color: #059669;">Chat on WhatsApp</a>
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="padding: 16px 32px; background: #f3f4f6; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #9ca3af;">
            This email was sent from the A-Star Infotech website contact form.<br/>
            Received on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
          </p>
        </div>
      </div>
    `,
  }

  const result = await transporter.sendMail(mailOptions)
  return result
}

/**
 * Send a confirmation auto-reply to the person who submitted the form
 */
export async function sendAutoReply(data: ContactFormData) {
  const transporter = createTransporter()

  const mailOptions = {
    from: `"A-Star Infotech" <${process.env.EMAIL_USER || 'astarinfotech.dev@gmail.com'}>`,
    to: data.email,
    subject: 'Thank you for contacting A-Star Infotech!',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; border-radius: 12px; overflow: hidden;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #059669, #047857); padding: 28px 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">A-Star Infotech</h1>
          <p style="color: #d1fae5; margin: 6px 0 0; font-size: 14px;">Building Smart Websites for Growing Businesses</p>
        </div>

        <!-- Body -->
        <div style="padding: 28px 32px;">
          <h2 style="color: #1f2937; font-size: 20px; margin: 0 0 12px;">Hi ${data.name},</h2>
          <p style="font-size: 15px; color: #4b5563; line-height: 1.7; margin: 0 0 16px;">
            Thank you for reaching out to us! We've received your message and our team will get back to you within <strong>24 hours</strong>.
          </p>

          <div style="background: #ecfdf5; padding: 16px 20px; border-radius: 8px; border-left: 4px solid #059669; margin: 20px 0;">
            <p style="margin: 0 0 8px; font-size: 14px; color: #065f46;"><strong>Your message summary:</strong></p>
            <p style="margin: 0; font-size: 13px; color: #374151; font-style: italic;">"${data.message}"</p>
          </div>

          <p style="font-size: 15px; color: #4b5563; line-height: 1.7; margin: 20px 0 0;">
            In the meantime, feel free to reach us directly:
          </p>

          <table style="margin-top: 12px;">
            <tr>
              <td style="padding: 4px 0; color: #6b7280; font-size: 14px; width: 30px;">📞</td>
              <td style="padding: 4px 0; color: #374151; font-size: 14px;">+91 8560074448</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #6b7280; font-size: 14px;">💬</td>
              <td style="padding: 4px 0;"><a href="https://wa.me/918560074448" style="color: #059669; font-size: 14px;">Chat on WhatsApp</a></td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #6b7280; font-size: 14px;">📧</td>
              <td style="padding: 4px 0;"><a href="mailto:karansinghmeertiya@gmail.com" style="color: #059669; font-size: 14px;">karansinghmeertiya@gmail.com</a></td>
            </tr>
          </table>
        </div>

        <!-- Footer -->
        <div style="padding: 16px 32px; background: #f3f4f6; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #9ca3af;">
            © ${new Date().getFullYear()} A-Star Infotech. All rights reserved.<br/>
            D-49, Shiv Marg, Balaji Sagar-15, Jaipur, Rajasthan
          </p>
        </div>
      </div>
    `,
  }

  const result = await transporter.sendMail(mailOptions)
  return result
}
