## PATH Landing Page (Insight Research Group)

This repo contains a Next.js 14 landing page for the PATH TA Vendor Marketplace campaign. It offers two CTAs:
- Book free 30‑minute office hours (Cal.com inline embed)
- Download the H.R. 1 + CalAIM playbook (instant link + email)

Stack: Next.js (App Router, TypeScript) + Tailwind CSS, `react-hook-form` + `zod`, Notion API (lead storage), Resend (email), Cloudflare Turnstile (bot check), GA4 (analytics). Deploys best on Vercel.

### Quick Start
1. Copy `.env.example` to `.env.local` and fill values (you can leave blanks to start).
2. Install deps and run dev server:
   - `npm install`
   - `npm run dev`
3. Add your PDF to `public/whitepaper/whitepaper.pdf` or set `NEXT_PUBLIC_WHITEPAPER_URL` to an external URL.
4. Drop logos into `public/brand/` and replace placeholders in components as desired.

### Environment Variables

Public
- `NEXT_PUBLIC_CAL_LINK` — Cal.com event URL (inline embed)
- `NEXT_PUBLIC_GA4_MEASUREMENT_ID` — GA4 ID, e.g., `G-XXXXXX`
- `NEXT_PUBLIC_WHITEPAPER_URL` — Download URL (defaults to `/whitepaper/whitepaper.pdf`)
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` — Cloudflare Turnstile site key

Private (server)
- `TURNSTILE_SECRET_KEY` — Cloudflare Turnstile secret key (server‑side verify)
- `NOTION_TOKEN` / `NOTION_DATABASE_ID` — Notion lead capture
- `RESEND_API_KEY` / `EMAIL_FROM` — Transactional email sender (for sending the link)
- `SITE_URL` — e.g., `https://path.insightresearch.group`
- `PRIVACY_URL` / `TERMS_URL` — Optional canonical pages; otherwise placeholders render

### Notion Database (suggested properties)
- `Name` (title), `First Name`, `Last Name`, `Email` (email), `Organization`, `Role`, `State`, `Consent` (checkbox)
- `Source` (select), `UTM Source/Medium/Campaign/Term/Content` (text), `Referrer` (url), `Path` (text), `Submitted At` (date), `Status` (select: Submitted, Emailed, Downloaded)

### Where Things Live
- `src/app/page.tsx` — Main landing page (hero, form, Cal.com)
- `src/components/LeadForm.tsx` — Validated form with Turnstile + honeypot
- `src/app/api/lead/route.ts` — Handles Turnstile verify, writes to Notion, emails link via Resend
- `src/app/thank-you/page.tsx` — Shows instant download link
- `src/app/privacy/page.tsx`, `src/app/terms/page.tsx` — Placeholder or links to env URLs
- `tailwind.config.ts` — Brand color tokens (tweak `brand.primary`/`secondary`)
- `public/brand/` — Drop your logos
- Upload your logo to `public/brand/logo.svg` (or PNG) and a testimonial headshot to `public/brand/ayano-ogawa.jpg`.
- `public/whitepaper/whitepaper.pdf` — Add the PDF here (or set URL env)

### Cal.com
Inline embed uses `NEXT_PUBLIC_CAL_LINK`. UTM parameters are preserved via the page URL; Cal.com also supports query parameters for attribution.

### Cloudflare Turnstile
Free. Create a site in Cloudflare → Copy the Site Key (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`) and Secret Key (`TURNSTILE_SECRET_KEY`). The widget is rendered in the form and verified server‑side in `/api/lead`.

### Resend Email
Verify a sending domain in Resend and add `RESEND_API_KEY` and `EMAIL_FROM` (e.g., `path@insightresearch.group`). The API route sends a friendly email with the same download link shown on the thank‑you page.

### Vercel Deployment & Subdomain
1. Push this repo to GitHub and import into Vercel.
2. Add domain in Project → Settings → Domains: `path.insightresearch.group`.
3. In your DNS, create `CNAME path → cname.vercel-dns.com.` (Vercel shows exact target.)
4. Vercel auto‑provisions SSL (Let’s Encrypt) once DNS resolves.

### Security Defaults
- Strict headers via `next.config.mjs` (HSTS, X-Frame-Options, etc.)
- CSP to allow GA, Cal.com, Turnstile and self.
- Server-side validation + spam checks (Turnstile + honeypot).

### Tweaks To Make It Yours
- Colors: `tailwind.config.ts` → `theme.extend.colors.brand.*`
- Fonts: currently using system/Inter; swap via `next/font` in `layout.tsx` if desired.
- Copy: edit hero text in `src/components/Hero.tsx`; FAQ in `src/components/FAQ.tsx`.

---

If you want me to wire a specific CRM later, we can swap the Notion integration behind the same API route with no UI changes.
