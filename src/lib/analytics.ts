// GA4 Event Tracking Utilities

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

/**
 * Track events to Google Analytics 4
 * Only sends events if GA4 is configured
 */
export function trackEvent(
  eventName: string,
  parameters?: Record<string, any>
) {
  if (typeof window !== 'undefined') {
    // Always log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 GA4 Event:', eventName, parameters)
      console.log('   gtag available:', typeof window.gtag === 'function')
    }
    
    // Send to GA4 if available
    if (window.gtag) {
      window.gtag('event', eventName, parameters)
    }
  }
}

// Predefined conversion events
export const GA_EVENTS = {
  // Page Views
  PAGE_VIEW: 'page_view',
  LANDING_PAGE_VIEW: 'landing_page_view',
  THANK_YOU_PAGE: 'thank_you_page_view',
  
  // CTA Clicks
  HERO_CTA_WHITEPAPER: 'hero_cta_whitepaper_click',
  NAV_WHITEPAPER: 'nav_whitepaper_click',
  
  // Whitepaper Journey
  WHITEPAPER_FORM_VIEW: 'whitepaper_form_view',
  WHITEPAPER_FORM_START: 'whitepaper_form_start',
  WHITEPAPER_FORM_SUBMIT: 'whitepaper_form_submit',
  WHITEPAPER_DOWNLOAD: 'whitepaper_download',
  WHITEPAPER_EMAIL_SENT: 'whitepaper_email_sent',
  
  // Page Engagement
  SCROLL_25: 'scroll_25_percent',
  SCROLL_50: 'scroll_50_percent',
  SCROLL_75: 'scroll_75_percent',
  SCROLL_90: 'scroll_90_percent',
  SCROLL_TO_FORM: 'scroll_to_form',
  TIME_ON_PAGE_10: 'time_on_page_10s',
  TIME_ON_PAGE_30: 'time_on_page_30s',
  TIME_ON_PAGE_60: 'time_on_page_60s',
  
  // UTM Campaign Tracking
  CAMPAIGN_LANDING: 'campaign_landing',
} as const

/**
 * Track scroll depth to important sections
 */
export function trackScrollToSection(section: 'download') {
  trackEvent(GA_EVENTS.SCROLL_TO_FORM, {
    section,
    source: 'scroll'
  })
}


/**
 * Track time on page at multiple intervals
 */
export function trackEngagement() {
  if (typeof window === 'undefined') return
  
  // Track 10 seconds
  setTimeout(() => {
    trackEvent(GA_EVENTS.TIME_ON_PAGE_10, {
      seconds: 10,
      engaged: true
    })
  }, 10000)
  
  // Track 30 seconds
  setTimeout(() => {
    trackEvent(GA_EVENTS.TIME_ON_PAGE_30, {
      seconds: 30,
      engaged: true
    })
  }, 30000)
  
  // Track 60 seconds
  setTimeout(() => {
    trackEvent(GA_EVENTS.TIME_ON_PAGE_60, {
      seconds: 60,
      highly_engaged: true
    })
  }, 60000)
}

/**
 * Track scroll depth
 */
export function trackScrollDepth() {
  if (typeof window === 'undefined') return
  
  const depths = { 25: false, 50: false, 75: false, 90: false }
  
  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrolled = window.scrollY
    const scrollPercent = Math.round((scrolled / scrollHeight) * 100)
    
    if (scrollPercent >= 25 && !depths[25]) {
      depths[25] = true
      trackEvent(GA_EVENTS.SCROLL_25, { depth: 25 })
    }
    if (scrollPercent >= 50 && !depths[50]) {
      depths[50] = true
      trackEvent(GA_EVENTS.SCROLL_50, { depth: 50 })
    }
    if (scrollPercent >= 75 && !depths[75]) {
      depths[75] = true
      trackEvent(GA_EVENTS.SCROLL_75, { depth: 75 })
    }
    if (scrollPercent >= 90 && !depths[90]) {
      depths[90] = true
      trackEvent(GA_EVENTS.SCROLL_90, { depth: 90 })
    }
  }
  
  // Debounce scroll tracking
  let scrollTimer: NodeJS.Timeout
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimer)
    scrollTimer = setTimeout(handleScroll, 100)
  })
}

/**
 * Track UTM parameters and source
 */
export function trackCampaignLanding() {
  if (typeof window === 'undefined') return
  
  const params = new URLSearchParams(window.location.search)
  const utm_source = params.get('utm_source')
  const utm_medium = params.get('utm_medium')
  const utm_campaign = params.get('utm_campaign')
  const utm_content = params.get('utm_content')
  const utm_term = params.get('utm_term')
  
  if (utm_source || utm_medium || utm_campaign) {
    trackEvent(GA_EVENTS.CAMPAIGN_LANDING, {
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      referrer: document.referrer || 'direct',
      landing_page: window.location.pathname
    })
  }
}