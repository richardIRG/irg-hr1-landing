'use client'

import Link from 'next/link'
import { trackEvent, GA_EVENTS } from '@/lib/analytics'

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-gradient -z-10" />
      {/* Hero image - California network visualization */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img 
          src="/images/california-network.png" 
          alt="California healthcare network" 
          className="absolute right-[-50px] md:right-0 lg:right-10 xl:right-20 top-1/2 -translate-y-1/2 w-[280px] sm:w-[350px] md:w-[450px] lg:w-[500px] xl:w-[550px] h-auto opacity-40 sm:opacity-60 md:opacity-70 lg:opacity-90"
        />
      </div>
      <div className="container-wide py-16 sm:py-24 lg:py-28 text-white relative">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight">
            H.R. 1 + CalAIM: Your 2025-2028 Operational Whitepaper
          </h1>
          <p className="mt-6 text-base sm:text-lg text-white/90">
            What changes, what doesn't, and five moves to protect outcomes and revenue.
          </p>
          {/* Primary CTA - Download Whitepaper */}
          <div className="mt-8">
            <a 
              href="#download" 
              onClick={() => trackEvent(GA_EVENTS.HERO_CTA_WHITEPAPER, { source: 'hero' })}
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 font-semibold text-brand-primary shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all text-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Your Free HR1 Whitepaper →
            </a>
            <p className="mt-3 text-sm text-white/70">Instant access to actionable insights and strategies.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
