'use client'

import { Hero } from '@/components/Hero'
import LeadForm from '@/components/LeadForm'
import { Footer } from '@/components/Footer'
import { useEffect } from 'react'
import { trackEngagement, trackScrollToSection, trackScrollDepth, trackCampaignLanding, trackEvent, GA_EVENTS } from '@/lib/analytics'

export default function Page() {
  useEffect(() => {
    // Track landing page view
    trackEvent(GA_EVENTS.LANDING_PAGE_VIEW, {
      page_location: window.location.href,
      page_title: document.title
    })
    
    // Track UTM parameters if present
    trackCampaignLanding()
    
    // Track user engagement at multiple intervals
    trackEngagement()
    
    // Track scroll depth
    trackScrollDepth()
    
    // Track scroll to download section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id
            if (id === 'download') {
              trackScrollToSection('download')
              // Mark as viewed only once
              observer.unobserve(entry.target)
            }
          }
        })
      },
      { threshold: 0.5 }
    )
    
    const downloadSection = document.getElementById('download')
    
    if (downloadSection) observer.observe(downloadSection)
    
    return () => observer.disconnect()
  }, [])
  return (
    <main>
      <Hero />

      {/* Whitepaper Download Section */}
      <section id="download" className="py-16 sm:py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container-narrow">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              H.R. 1 + CalAIM: Your 2025-2028 Operational Whitepaper
            </h2>
            <p className="text-lg text-slate-700 max-w-2xl mx-auto">
              What changes, what doesn't, and five moves to protect outcomes and revenue.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
              <div className="flex justify-center">
                <img 
                  src="/images/whitepaper-mockup.png" 
                  alt="H.R. 1 Implementation Whitepaper" 
                  className="w-64 sm:w-72 h-auto drop-shadow-xl hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-xl">What's Inside:</h3>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Five actionable moves to protect revenue now</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Myth-busting: ECM & CS are NOT ending</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Clear timeline & official resource links</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>How H.R. 1 impacts CalAIM through 2028</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="rounded-2xl bg-white shadow-lg border border-slate-200 p-8">
              <LeadForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
