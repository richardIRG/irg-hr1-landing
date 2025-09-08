import './globals.css'
import type { Metadata } from 'next'
import { buildCSP } from '@/lib/csp'
import { env } from '@/lib/env'

export const metadata: Metadata = {
  title: 'Insight Research Group | PATH Marketplace',
  description: 'H.R. 1 + CalAIM operational whitepaper and free office hours for ECM & Community Supports providers in California.',
  openGraph: {
    title: 'H.R. 1 + CalAIM: 2025–2028 Operational Whitepaper',
    description: 'Download the whitepaper and book free office hours.',
    type: 'website',
  },
  metadataBase: new URL(env.SITE_URL),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const csp = buildCSP()
  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link rel="icon" type="image/png" href="/favicon.png" sizes="32x32" />
        <link rel="icon" type="image/png" href="/favicon-16.png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* CSP */}
        <meta httpEquiv="Content-Security-Policy" content={csp} />
        {/* GA4 */}
        {env.NEXT_PUBLIC_GA4_MEASUREMENT_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${env.NEXT_PUBLIC_GA4_MEASUREMENT_ID}`}></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);} gtag('js', new Date());
                gtag('config', '${env.NEXT_PUBLIC_GA4_MEASUREMENT_ID}', { anonymize_ip: true });
              `,
              }}
            />
          </>
        )}
        {/* Turnstile */}
        {(env.TURNSTILE_SITE_KEY || env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) && (
          <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
        )}
      </head>
      <body>
        <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-20">
          <div className="container-wide py-3 flex items-center justify-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <img src="/brand/logo.png" alt="Insight Research Group" className="h-7 sm:h-8 w-auto" />
              <span className="sr-only">Insight Research Group</span>
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}
