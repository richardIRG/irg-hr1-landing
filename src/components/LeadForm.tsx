"use client"

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useState } from 'react'
import { trackEvent, GA_EVENTS } from '@/lib/analytics'

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Enter a valid email'),
  organization: z.string().min(1, 'Required'),
  role: z.string().optional(),
  challenge: z.string().optional(),
  consent: z.boolean().refine((v) => v === true, { message: 'Consent required' }),
  // honeypot
  company: z.string().max(0).optional(),
})

type FormValues = z.infer<typeof schema>

export default function LeadForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { consent: false },
  })

  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Capture UTM + referrer at mount
  const meta = useMemo(() => {
    if (typeof window === 'undefined') return {}
    const params = new URLSearchParams(window.location.search)
    return {
      utm: {
        source: params.get('utm_source') ?? undefined,
        medium: params.get('utm_medium') ?? undefined,
        campaign: params.get('utm_campaign') ?? undefined,
        term: params.get('utm_term') ?? undefined,
        content: params.get('utm_content') ?? undefined,
      },
      referrer: document.referrer || undefined,
      path: window.location.pathname,
      source: 'PATH Marketplace',
    }
  }, [])

  useEffect(() => { 
    setMounted(true)
    trackEvent(GA_EVENTS.WHITEPAPER_FORM_VIEW)
  }, [])

  const onSubmit = async (data: FormValues) => {
    setServerError(null)
    trackEvent(GA_EVENTS.WHITEPAPER_FORM_SUBMIT, {
      organization: data.organization,
      role: data.role,
      challenge: data.challenge
    })
    try {
      // Grab Turnstile token from auto-inserted input name
      const tokenEl = document.querySelector<HTMLInputElement>('input[name="cf-turnstile-response"]')
      const token = tokenEl?.value
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, ...meta, turnstileToken: token }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || 'Something went wrong')
      }
      setSuccess(true)
      trackEvent(GA_EVENTS.WHITEPAPER_EMAIL_SENT)
      // Redirect to thank-you (instant download)
      window.location.href = '/thank-you'
    } catch (err: any) {
      setServerError(err.message || 'Submission failed')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">First name</label>
          <input {...register('firstName')} 
            onFocus={() => trackEvent(GA_EVENTS.WHITEPAPER_FORM_START, { field: 'firstName' })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-secondary" />
          {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Last name</label>
          <input {...register('lastName')} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-secondary" />
          {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName.message}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input type="email" {...register('email')} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-secondary" />
        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Organization</label>
        <input {...register('organization')} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-secondary" />
        {errors.organization && <p className="text-sm text-red-600 mt-1">{errors.organization.message}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Role (optional)</label>
          <input {...register('role')} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-secondary" />
        </div>
        <div>
          <label className="block text-sm font-medium">Biggest CalAIM Challenge (optional)</label>
          <select {...register('challenge')} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-secondary">
            <option value="">Select...</option>
            <option value="Getting started">Getting started with CalAIM</option>
            <option value="MCP contracting">MCP contracting</option>
            <option value="Billing/payments">Billing & payment issues</option>
            <option value="Systems/workflows">Systems & workflows</option>
            <option value="H.R. 1 impact">Understanding H.R. 1 impact</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Honeypot */}
      <div className="hidden">
        <label>Company</label>
        <input {...register('company')} tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex items-start gap-3">
        <input id="consent" type="checkbox" {...register('consent')} className="mt-1 h-4 w-4" />
        <label htmlFor="consent" className="text-sm text-slate-700">
          I agree to receive the whitepaper and occasional updates from Insight Research Group. I can unsubscribe anytime.
        </label>
      </div>
      {errors.consent && <p className="text-sm text-red-600">{errors.consent.message}</p>}

      {/* Turnstile widget - render only on client to avoid hydration mismatch */}
      {mounted && (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? (
        <div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}></div>
      ) : null)}

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}
      <button type="submit" disabled={isSubmitting} className="w-full inline-flex items-center justify-center rounded-lg bg-brand-primary px-5 py-4 font-semibold text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:transform-none">
        {isSubmitting ? 'Sending...' : (
          <>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Get Instant Access →
          </>
        )}
      </button>
      <p className="text-xs text-center text-slate-500 mt-3">Downloads instantly. No spam, unsubscribe anytime.</p>
    </form>
  )
}
