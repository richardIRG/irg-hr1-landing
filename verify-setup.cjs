#!/usr/bin/env node

// Quick verification script for launch readiness
const fs = require('fs');
const path = require('path');

console.log('🚀 Verifying Launch Setup...\n');

// Check for .env.local
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found');
  process.exit(1);
}

// Read env file
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

// Required environment variables
const required = [
  'NEXT_PUBLIC_CAL_LINK',
  'NEXT_PUBLIC_TURNSTILE_SITE_KEY',
  'TURNSTILE_SECRET_KEY',
  'NOTION_TOKEN',
  'NOTION_DATABASE_ID',
];

const optional = [
  'NEXT_PUBLIC_GA4_MEASUREMENT_ID',
  'RESEND_API_KEY',
  'EMAIL_FROM',
  'SITE_URL',
];

console.log('Required Environment Variables:');
required.forEach(key => {
  if (envVars[key]) {
    console.log(`✅ ${key} is set`);
  } else {
    console.log(`❌ ${key} is MISSING`);
  }
});

console.log('\nOptional Environment Variables:');
optional.forEach(key => {
  if (envVars[key]) {
    console.log(`✅ ${key} is set`);
  } else {
    console.log(`⚠️  ${key} is not set (optional)`);
  }
});

// Check for whitepaper
const whitepaperPath = path.join(__dirname, 'public/whitepaper/whitepaper.pdf');
console.log('\nAssets:');
if (fs.existsSync(whitepaperPath)) {
  const stats = fs.statSync(whitepaperPath);
  console.log(`✅ Whitepaper uploaded (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
} else {
  console.log('❌ Whitepaper not found at public/whitepaper/whitepaper.pdf');
}

// Check for images
const images = [
  'public/images/california-network.png',
  'public/images/whitepaper-mockup.png',
  'public/brand/logo.png',
  'public/brand/ayano-ogawa.png'
];

images.forEach(img => {
  if (fs.existsSync(path.join(__dirname, img))) {
    console.log(`✅ ${img} exists`);
  } else {
    console.log(`⚠️  ${img} is missing`);
  }
});

console.log('\n📊 Google Analytics 4:');
if (envVars['NEXT_PUBLIC_GA4_MEASUREMENT_ID']) {
  console.log(`✅ GA4 is configured with ID: ${envVars['NEXT_PUBLIC_GA4_MEASUREMENT_ID']}`);
  console.log('   Make sure to add your domain to GA4 data streams');
} else {
  console.log('⚠️  GA4 is not configured (optional)');
  console.log('   To enable: Add NEXT_PUBLIC_GA4_MEASUREMENT_ID to .env.local');
}

console.log('\n📧 Email Setup (Resend):');
if (envVars['RESEND_API_KEY'] && envVars['EMAIL_FROM']) {
  console.log('✅ Resend is configured');
  console.log(`   Sending from: ${envVars['EMAIL_FROM']}`);
} else {
  console.log('⚠️  Resend is not fully configured');
  console.log('   You need to:');
  console.log('   1. Verify your domain at resend.com');
  console.log('   2. Add RESEND_API_KEY and EMAIL_FROM to .env.local');
}

console.log('\n🚀 Summary:');
const criticalMissing = required.filter(key => !envVars[key]);
if (criticalMissing.length === 0 && fs.existsSync(whitepaperPath)) {
  console.log('✅ All critical components are configured!');
  if (!envVars['RESEND_API_KEY']) {
    console.log('⚠️  Email delivery needs configuration (forms will save to Notion but no emails will be sent)');
  }
  console.log('\nNext steps:');
  console.log('1. Run: npm run dev (to test locally)');
  console.log('2. Deploy to Vercel with these environment variables');
} else {
  console.log('❌ Some critical components are missing. Please configure them first.');
}