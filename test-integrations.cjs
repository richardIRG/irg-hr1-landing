#!/usr/bin/env node

const https = require('https');

console.log('🧪 Testing Integrations...\n');

// Test 1: Check Resend Domain
function testResend() {
  console.log('📧 Testing Resend Configuration:');
  
  const envPath = require('path').join(__dirname, '.env.local');
  const envContent = require('fs').readFileSync(envPath, 'utf-8');
  
  const resendKey = envContent.match(/RESEND_API_KEY=(.*)/)?.[1];
  const emailFrom = envContent.match(/EMAIL_FROM=(.*)/)?.[1];
  
  if (!resendKey || !emailFrom) {
    console.log('❌ Resend not configured - missing API key or sender email');
    return;
  }
  
  console.log(`✅ Email sender configured: ${emailFrom}`);
  
  // Test Resend API
  const options = {
    hostname: 'api.resend.com',
    path: '/domains',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${resendKey}`,
      'Content-Type': 'application/json'
    }
  };
  
  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      try {
        const domains = JSON.parse(data);
        if (domains.data && domains.data.length > 0) {
          console.log('✅ Resend domains found:');
          domains.data.forEach(d => {
            const status = d.status === 'verified' ? '✅' : '⚠️';
            console.log(`   ${status} ${d.name} - ${d.status}`);
            if (d.status !== 'verified') {
              console.log(`      → Verify DNS records at resend.com/domains`);
            }
          });
        } else {
          console.log('⚠️  No domains configured in Resend');
          console.log('   → Add and verify your domain at resend.com/domains');
        }
      } catch (e) {
        console.log('❌ Failed to fetch Resend domains:', e.message);
      }
    });
  });
  
  req.on('error', (e) => {
    console.log('❌ Resend API error:', e.message);
  });
  
  req.end();
}

// Test 2: Check Notion Connection
function testNotion() {
  console.log('\n📝 Testing Notion Configuration:');
  
  const envPath = require('path').join(__dirname, '.env.local');
  const envContent = require('fs').readFileSync(envPath, 'utf-8');
  
  const notionToken = envContent.match(/NOTION_TOKEN=(.*)/)?.[1];
  const databaseId = envContent.match(/NOTION_DATABASE_ID=(.*)/)?.[1];
  
  if (!notionToken || !databaseId) {
    console.log('❌ Notion not configured - missing token or database ID');
    return;
  }
  
  console.log(`✅ Notion database ID: ${databaseId.substring(0, 8)}...`);
  
  // Test Notion API
  const options = {
    hostname: 'api.notion.com',
    path: `/v1/databases/${databaseId}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${notionToken}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    }
  };
  
  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      try {
        const db = JSON.parse(data);
        if (db.properties) {
          console.log('✅ Notion database connected!');
          console.log('   Database columns found:');
          Object.keys(db.properties).forEach(key => {
            console.log(`   - ${key}`);
          });
        } else if (db.object === 'error') {
          console.log('❌ Notion error:', db.message);
          if (db.code === 'object_not_found') {
            console.log('   → Make sure the integration has access to the database');
          }
        }
      } catch (e) {
        console.log('❌ Failed to parse Notion response');
      }
    });
  });
  
  req.on('error', (e) => {
    console.log('❌ Notion API error:', e.message);
  });
  
  req.end();
}

// Test 3: Form Submission Test
function testFormSubmission() {
  console.log('\n🧪 Form Submission Test Instructions:');
  console.log('1. Open http://localhost:3000');
  console.log('2. Fill out the form with test data:');
  console.log('   - First: Test');
  console.log('   - Last: User');
  console.log('   - Email: test@example.com');
  console.log('   - Organization: Test Org');
  console.log('3. Submit the form');
  console.log('4. Check:');
  console.log('   - Notion database for new entry');
  console.log('   - Email inbox (if using real email)');
  console.log('   - Browser console for any errors');
}

// Run tests
testResend();
setTimeout(() => {
  testNotion();
  setTimeout(() => {
    testFormSubmission();
  }, 2000);
}, 2000);