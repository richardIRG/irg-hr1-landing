export function buildCSP(nonce?: string) {
  // Allow self, inline styles, GA, Cal.com, Cloudflare Turnstile
  const directives = [
    `default-src 'self'`,
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://app.cal.com https://cal.com https://challenges.cloudflare.com ${nonce ? `'nonce-${nonce}'` : ''}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: https://www.google-analytics.com`,
    `connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://challenges.cloudflare.com https://cal.com https://app.cal.com`,
    `frame-src https://app.cal.com https://cal.com`,
    `font-src 'self' data:`
  ]
  return directives.join('; ')
}
