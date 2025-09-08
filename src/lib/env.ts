export const env = {
  // Public
  NEXT_PUBLIC_CAL_LINK: process.env.NEXT_PUBLIC_CAL_LINK ?? '',
  NEXT_PUBLIC_GA4_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID ?? '',
  NEXT_PUBLIC_WHITEPAPER_URL: process.env.NEXT_PUBLIC_WHITEPAPER_URL ?? '/whitepaper/whitepaper.pdf',
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '',

  // Private
  TURNSTILE_SITE_KEY: process.env.TURNSTILE_SITE_KEY ?? '',
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY ?? '',
  NOTION_TOKEN: process.env.NOTION_TOKEN ?? '',
  NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID ?? '',
  RESEND_API_KEY: process.env.RESEND_API_KEY ?? '',
  EMAIL_FROM: process.env.EMAIL_FROM ?? '',
  SITE_URL: process.env.SITE_URL ?? 'http://localhost:3000',
  PRIVACY_URL: process.env.PRIVACY_URL ?? '',
  TERMS_URL: process.env.TERMS_URL ?? '',
};

export function required(name: keyof typeof env) {
  const value = env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}
