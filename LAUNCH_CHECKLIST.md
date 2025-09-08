# Launch Checklist

## Pre-Launch Testing

### Environment Variables
Copy `.env.example` to `.env.local` and fill in:

```bash
# Required
NEXT_PUBLIC_CAL_LINK=your-cal-username/meeting-type
NEXT_PUBLIC_TURNSTILE_SITE_KEY=xxx
TURNSTILE_SECRET_KEY=xxx
NOTION_TOKEN=xxx
NOTION_DATABASE_ID=xxx
RESEND_API_KEY=xxx
EMAIL_FROM="Your Name <noreply@yourdomain.com>"
SITE_URL=https://yourdomain.com

# Optional
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXX
NEXT_PUBLIC_WHITEPAPER_URL=/whitepaper/whitepaper.pdf
```

### Assets to Upload
- [ ] `/public/whitepaper/whitepaper.pdf` - Your actual whitepaper
- [x] `/public/images/california-network.png` - Already uploaded
- [x] `/public/images/whitepaper-mockup.png` - Already uploaded
- [x] `/public/brand/logo.png` - Already uploaded
- [x] `/public/brand/ayano-ogawa.png` - Already uploaded

### Test Locally
```bash
npm run dev
```

1. Test form submission (will fail without Notion/Resend setup)
2. Test Cal.com embed loads
3. Test all navigation links
4. Test mobile responsiveness
5. Check whitepaper download link

## Deployment Options

### Option 1: Vercel (Recommended)
1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Option 2: Netlify
1. Push to GitHub
2. Connect repo to Netlify
3. Add environment variables
4. Deploy

### Option 3: Self-hosted
```bash
npm run build
npm start
```

## Post-Launch

### Monitor
- Check Notion database for leads
- Test email delivery
- Monitor Turnstile dashboard for bot activity
- Check Google Analytics (if configured)

### Security
- Keep API keys secret
- Use HTTPS only
- Regular dependency updates: `npm audit fix`

## Quick Start Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check for issues
npm run lint
npm run typecheck
```