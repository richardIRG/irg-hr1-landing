import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { saveLeadToNotion } from '@/lib/notion'
import { env } from '@/lib/env'
import { sendWhitepaperEmail } from '@/lib/email'

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  organization: z.string().min(1),
  role: z.string().optional(),
  challenge: z.string().optional(),
  consent: z.boolean(),
  company: z.string().max(0).optional(), // honeypot
  source: z.string().optional(),
  referrer: z.string().optional(),
  path: z.string().optional(),
  utm: z
    .object({
      source: z.string().optional(),
      medium: z.string().optional(),
      campaign: z.string().optional(),
      term: z.string().optional(),
      content: z.string().optional(),
    })
    .optional(),
  turnstileToken: z.string().optional(),
})

// naive limiter: 10 requests per IP per minute (per server instance)
const rateLimit = (() => {
  const hits = new Map<string, { count: number; window: number }>()
  const limit = 10
  const interval = 60_000
  return {
    isRateLimited(key: string) {
      const now = Date.now()
      const item = hits.get(key)
      if (!item || now - item.window > interval) {
        hits.set(key, { count: 1, window: now })
        return false
      }
      item.count += 1
      hits.set(key, item)
      return item.count > limit
    },
  }
})()

async function verifyTurnstile(token: string | undefined, req: NextRequest) {
  if (!env.TURNSTILE_SECRET_KEY || !env.TURNSTILE_SITE_KEY) return { success: true }
  if (!token) return { success: false, code: 'missing_token' }

  const ip = req.headers.get('x-forwarded-for') || req.ip || ''
  const form = new URLSearchParams()
  form.append('secret', env.TURNSTILE_SECRET_KEY)
  form.append('response', token)
  if (ip) form.append('remoteip', ip)

  const resp = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: form,
  })
  const data = (await resp.json()) as { success: boolean; 'error-codes'?: string[] }
  return data
}

export async function POST(req: NextRequest) {
  try {
    // Simple in-memory rate limit (per server instance)
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown'
    if (rateLimit.isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'Retry-After': '60' } })
    }
    const raw = await req.json()
    const input = schema.parse(raw)

    // Honeypot
    if (input.company) return NextResponse.json({ ok: true }, { status: 200 })

    // Turnstile verification
    const turn = await verifyTurnstile(input.turnstileToken, req)
    if (!turn.success) {
      return NextResponse.json({ error: 'Bot verification failed' }, { status: 400 })
    }

    const submittedAt = new Date().toISOString()
    // Ensure whitepaper URL is absolute
    let whitepaperUrl = env.NEXT_PUBLIC_WHITEPAPER_URL || '/whitepaper/whitepaper.pdf'
    if (whitepaperUrl.startsWith('/')) {
      whitepaperUrl = `${env.SITE_URL}${whitepaperUrl}`
    }
    
    // Add UTM parameters for email tracking
    const emailWhitepaperUrl = `${whitepaperUrl}?utm_source=email&utm_medium=whitepaper&utm_campaign=post_download&utm_content=download_button`

    // Save to Notion (best-effort)
    await saveLeadToNotion({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      organization: input.organization,
      role: input.role,
      challenge: input.challenge,
      consent: input.consent,
      source: input.source ?? 'HR1',
      utm: input.utm,
      referrer: input.referrer,
      path: input.path,
      submittedAt,
    }).catch((err) => {
      console.error('Failed to save to Notion:', err)
      return null
    })

    // Email the whitepaper link (best-effort)
    await sendWhitepaperEmail(input.email, emailWhitepaperUrl, input.firstName).catch((err) => {
      console.error('Failed to send email:', err)
      return null
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Invalid request' }, { status: 400 })
  }
}
