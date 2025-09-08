import { env } from './env'
import { Resend } from 'resend'

export async function sendWhitepaperEmail(to: string, downloadUrl: string, firstName?: string) {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) {
    return { sent: false, reason: 'email_not_configured' as const }
  }

  const resend = new Resend(env.RESEND_API_KEY)
  const subject = 'Your H.R. 1 + CalAIM Operational Whitepaper'
  const greeting = firstName ? `Hi ${firstName},` : 'Hi there,'
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
      <![endif]-->
    </head>
    <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;background-color:#f8fafc;">
      <div style="background-color:#f8fafc;padding:40px 0;">
        <!-- Container -->
        <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.07);">
          
          <!-- Header -->
          <div style="background:linear-gradient(135deg, #1C4B92 0%, #1F5FA9 100%);padding:32px 24px;text-align:center;">
            <img src="${env.SITE_URL}/brand/logo-white.png" alt="Insight Research Group" style="height:32px;width:auto;margin:0 auto;" />
          </div>
          
          <!-- Content -->
          <div style="padding:40px 32px;">
            <h1 style="color:#0f172a;font-size:24px;font-weight:700;margin:0 0 24px 0;line-height:1.2;">
              Your H.R. 1 + CalAIM Whitepaper is Ready
            </h1>
            
            <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 20px 0;">
              ${greeting}
            </p>
            
            <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 28px 0;">
              Thank you for downloading our comprehensive whitepaper on navigating H.R. 1's impact through 2028. This operational guide provides clarity on what's actually changing (and what's not) in the CalAIM landscape:
            </p>
            
            <!-- Key Points -->
            <div style="background-color:#f8fafc;border-left:4px solid #1C4B92;padding:20px 24px;margin:0 0 32px 0;border-radius:4px;">
              <ul style="color:#475569;font-size:15px;line-height:1.8;margin:0;padding-left:20px;">
                <li style="margin:0 0 8px 0;">Five actionable moves to protect your revenue now</li>
                <li style="margin:0 0 8px 0;">Myth-busting: Why ECM & Community Supports are NOT ending</li>
                <li style="margin:0 0 8px 0;">Clear timeline through 2028 implementation</li>
                <li style="margin:0;">Official resource links and guidance</li>
              </ul>
            </div>
            
            <!-- CTA Button -->
            <div style="text-align:center;margin:0 0 32px 0;">
              <a href="${downloadUrl}" style="display:inline-block;background:linear-gradient(135deg, #1C4B92 0%, #1F5FA9 100%);color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px;box-shadow:0 4px 14px rgba(28,75,146,0.25);">
                Download Your Whitepaper →
              </a>
            </div>
            
            <p style="color:#64748b;font-size:14px;line-height:1.6;margin:0 0 28px 0;text-align:center;">
              If the button doesn't work, copy and paste this link:<br/>
              <a href="${downloadUrl}" style="color:#1C4B92;text-decoration:underline;word-break:break-all;">${downloadUrl}</a>
            </p>
            
            <!-- Next Steps -->
            <div style="border-top:1px solid #e2e8f0;padding-top:24px;margin-top:32px;">
              <h3 style="color:#0f172a;font-size:16px;font-weight:600;margin:0 0 16px 0;">
                What happens next?
              </h3>
              <ol style="color:#475569;font-size:14px;line-height:1.8;margin:0;padding-left:20px;">
                <li style="margin:0 0 8px 0;">Review the five actionable moves to protect your revenue</li>
                <li style="margin:0 0 8px 0;">Share with your leadership and finance teams</li>
                <li style="margin:0 0 8px 0;">Use the timeline to plan your 2025-2028 strategy</li>
                <li style="margin:0;">Reach out if you need implementation support</li>
              </ol>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color:#f8fafc;padding:32px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0 0 12px 0;">
              <strong style="color:#475569;">Insight Research Group</strong><br/>
              CalAIM Implementation Experts Since 2023
            </p>
            <p style="color:#94a3b8;font-size:12px;line-height:1.6;margin:0;">
              <a href="${env.SITE_URL}" style="color:#64748b;text-decoration:underline;">Visit our website</a> • 
              <a href="mailto:info@insightresearchgroup.com" style="color:#64748b;text-decoration:underline;">Contact us</a>
            </p>
            <p style="color:#94a3b8;font-size:11px;line-height:1.6;margin:16px 0 0 0;">
              You received this email because you requested our whitepaper. We respect your privacy and will only send relevant CalAIM updates.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  await resend.emails.send({
    from: `Insight Research Group <${env.EMAIL_FROM}>`,
    to,
    subject,
    html,
    reply_to: 'info@insightresearchgroup.com'
  })

  return { sent: true as const }
}

