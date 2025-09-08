'use client'

import Link from 'next/link'
import { env } from '@/lib/env'
import { trackEvent, GA_EVENTS } from '@/lib/analytics'
import { useEffect } from 'react'

export default function ThankYou() {
  useEffect(() => {
    // Track thank you page view (funnel completion)
    trackEvent(GA_EVENTS.THANK_YOU_PAGE, { 
      source: 'whitepaper_form',
      conversion_type: 'lead_capture'
    })
    
    // Track whitepaper download conversion
    trackEvent(GA_EVENTS.WHITEPAPER_DOWNLOAD, { 
      source: 'thank_you_page',
      value: 100,
      currency: 'USD'
    })
  }, [])
  const downloadUrl = env.NEXT_PUBLIC_WHITEPAPER_URL || '/whitepaper/whitepaper.pdf'
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container-narrow py-20">
        <div className="rounded-2xl bg-white shadow-card p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold">Thank you!</h1>
          <p className="mt-4 text-slate-700">Your whitepaper is ready to download. We've also sent a copy to your email.</p>
          <div className="mt-8">
            <a 
              href={downloadUrl} 
              onClick={() => trackEvent(GA_EVENTS.WHITEPAPER_DOWNLOAD, { source: 'download_button', value: 100, currency: 'USD' })}
              className="inline-flex items-center justify-center rounded-lg bg-brand-primary px-6 py-3 font-semibold text-white shadow hover:opacity-95"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Whitepaper
            </a>
          </div>
          <div className="mt-10 pt-6 border-t border-slate-200">
            <Link href="/" className="text-brand-primary hover:text-brand-primary/80 font-medium">
              ← Back to homepage
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
