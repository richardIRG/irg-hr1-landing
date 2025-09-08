# GA4 Tracking Implementation Guide

## Overview
This landing page has comprehensive Google Analytics 4 tracking implemented to measure the complete user journey and conversion funnel for your webinar presentation.

## Key Metrics You Can Track

### 1. **Landing Page Performance**
- `landing_page_view` - Fires when users land on the page
- `campaign_landing` - Captures UTM parameters for campaign attribution
- Tracks: page_location, utm_source, utm_medium, utm_campaign, referrer

### 2. **User Engagement Metrics**
- `time_on_page_10s` - Users who stay 10+ seconds
- `time_on_page_30s` - Users who stay 30+ seconds (engaged)
- `time_on_page_60s` - Users who stay 60+ seconds (highly engaged)
- `scroll_25_percent` - Users who scroll 25% of page
- `scroll_50_percent` - Users who scroll 50% of page
- `scroll_75_percent` - Users who scroll 75% of page
- `scroll_90_percent` - Users who scroll 90% of page (fully engaged)

### 3. **Section Discovery**
- `scroll_to_booking` - Users who reach the Cal.com booking section
- `scroll_to_form` - Users who reach the whitepaper download section

### 4. **CTA Click Tracking**
- `hero_cta_whitepaper_click` - Hero whitepaper button clicks
- `hero_cta_booking_click` - Hero booking button clicks

### 5. **Whitepaper Conversion Funnel**
1. `whitepaper_form_view` - Form viewed
2. `whitepaper_form_start` - User starts filling form (focuses first field)
3. `whitepaper_form_submit` - Form submitted
4. `whitepaper_email_sent` - Email successfully sent
5. `thank_you_page_view` - Thank you page reached
6. `whitepaper_download` - Whitepaper downloaded (value: $100)

### 6. **Booking Conversion Funnel**
1. `booking_view` - Cal.com section viewed
2. `booking_open_modal` - User clicks "View Available Times"
3. `booking_calendar_loaded` - Calendar successfully loads
4. `booking_date_selected` - User selects a date
5. `booking_time_selected` - User selects a time
6. `booking_form_started` - User begins filling booking form
7. `booking_confirmed` - Booking completed (value: $500)
8. `booking_modal_closed` - User closes modal (drop-off tracking)

## Setting Up GA4 Dashboard for Your Webinar

### Recommended Custom Reports

1. **Funnel Exploration Report**
   - Start: `landing_page_view`
   - Whitepaper Path: `whitepaper_form_view` → `whitepaper_form_submit` → `thank_you_page_view`
   - Booking Path: `booking_view` → `booking_open_modal` → `booking_confirmed`

2. **Engagement Report**
   - Filter by `time_on_page_30s` to see engaged users
   - Cross-reference with `scroll_75_percent` for quality visitors
   - Track conversion rate of engaged vs non-engaged users

3. **Campaign Performance**
   - Use `campaign_landing` event
   - Group by utm_source/utm_medium
   - Compare conversion rates across traffic sources

### Key Metrics to Present

1. **Top of Funnel**
   - Total landing page views
   - Traffic sources (UTM breakdown)
   - Engagement rate (30s+ on page)

2. **Middle of Funnel**
   - % who scroll to booking section
   - % who scroll to download section
   - % who click CTAs

3. **Bottom of Funnel**
   - Whitepaper form submission rate
   - Booking modal open rate
   - Booking completion rate
   - Total conversion value

## Real-Time Monitoring During Webinar

1. **GA4 Real-Time Reports**
   - Monitor active users on site
   - Track events as they happen
   - See immediate conversion activity

2. **Key Events to Watch**
   - `booking_open_modal` - Shows immediate interest
   - `whitepaper_form_submit` - Lead captured
   - `booking_confirmed` - High-value conversion

## Testing Events in Development

1. Open browser console (F12)
2. Look for messages starting with "📊 GA4 Event:"
3. Each event will show name and parameters
4. Verify events fire at appropriate times

## URL Parameters for Campaign Tracking

Add these to your URLs shared during webinar:
```
?utm_source=webinar&utm_medium=presentation&utm_campaign=wednesday_demo
```

These will be automatically tracked in the `campaign_landing` event.

## Notes for Presentation

- Events have monetary values assigned:
  - Whitepaper download: $100
  - Booking confirmation: $500
- Social proof counter (1-3 calls) is randomized per session
- All sensitive data is anonymized (anonymize_ip: true)
- Scroll and time tracking only fires once per threshold

## Troubleshooting

If events aren't showing in GA4:
1. Check that NEXT_PUBLIC_GA4_MEASUREMENT_ID is set in .env.local
2. Verify GA4 property is receiving data (may take 24-48 hours initially)
3. Check browser console for "📊 GA4 Event:" logs in development
4. Ensure ad blockers aren't preventing GA4 script from loading