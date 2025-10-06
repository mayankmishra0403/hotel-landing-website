#!/usr/bin/env node

/**
 * Test the NEW simplified Cashfree integration
 */

const fs = require('fs')
const path = require('path')

// Read .env.local
const envPath = path.join(__dirname, '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')

const envVars = {}
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.+)$/)
  if (match) {
    envVars[match[1].trim()] = match[2].trim()
  }
})

const CASHFREE_APP_ID = envVars.CASHFREE_APP_ID
const CASHFREE_SECRET_KEY = envVars.CASHFREE_SECRET_KEY
const CASHFREE_MODE = envVars.NEXT_PUBLIC_CASHFREE_MODE
const BASE_URL = envVars.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

console.log('🧪 Testing NEW Simplified Cashfree Integration\n')
console.log('=' .repeat(60))
console.log('Environment:')
console.log('- Mode:', CASHFREE_MODE || 'sandbox')
console.log('- App ID:', CASHFREE_APP_ID ? '✅ Set' : '❌ Missing')
console.log('- Secret Key:', CASHFREE_SECRET_KEY ? '✅ Set' : '❌ Missing')
console.log('- Base URL:', BASE_URL)
console.log('=' .repeat(60))
console.log()

if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
  console.error('❌ Missing credentials!')
  process.exit(1)
}

const apiUrl = CASHFREE_MODE === 'production'
  ? 'https://api.cashfree.com/pg'
  : 'https://sandbox.cashfree.com/pg'

console.log('🌐 API URL:', apiUrl)
console.log()

async function testNewIntegration() {
  try {
    console.log('📝 Step 1: Creating test order...\n')

    const orderId = `TEST_NEW_${Date.now()}`
    const orderData = {
      order_id: orderId,
      order_amount: 100,
      order_currency: 'INR',
      customer_details: {
        customer_id: 'test_customer_new',
        customer_name: 'Test Customer',
        customer_email: 'test@example.com',
        customer_phone: '+919999999999'
      },
      order_meta: {
        return_url: `${BASE_URL}/payment/callback?bookingId=test`,
        notify_url: `${BASE_URL}/api/payment/webhook`
      }
    }

    console.log('Order Data:')
    console.log(JSON.stringify(orderData, null, 2))
    console.log()

    const headers = {
      'Content-Type': 'application/json',
      'x-api-version': '2023-08-01',
      'x-client-id': CASHFREE_APP_ID,
      'x-client-secret': CASHFREE_SECRET_KEY
    }

    console.log('📤 Sending request...')
    const response = await fetch(`${apiUrl}/orders`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(orderData)
    })

    console.log('📥 Response:', response.status, response.statusText)
    console.log()

    const result = await response.json()

    if (!response.ok) {
      console.error('❌ FAILED!\n')
      console.error('Error:', JSON.stringify(result, null, 2))
      console.log()
      console.log('💡 Common Issues:')
      console.log('  - Wrong App ID or Secret Key')
      console.log('  - IP whitelisting required')
      console.log('  - Account not activated')
      process.exit(1)
    }

    console.log('✅ SUCCESS!\n')
    console.log('Order Created:')
    console.log('- Order ID:', result.order_id)
    console.log('- CF Order ID:', result.cf_order_id)
    console.log('- Status:', result.order_status)
    console.log('- Amount:', result.order_amount, result.order_currency)
    console.log('- Payment Session ID:', result.payment_session_id)
    console.log()

    const paymentMode = CASHFREE_MODE === 'production' ? '' : '.sandbox'
    const paymentUrl = `https://payments${paymentMode}.cashfree.com/pay/${result.payment_session_id}`
    
    console.log('🔗 Payment URL:')
    console.log(paymentUrl)
    console.log()

    console.log('=' .repeat(60))
    console.log('🎉 NEW CASHFREE INTEGRATION IS WORKING!')
    console.log('=' .repeat(60))
    console.log()
    console.log('Next Steps:')
    console.log('1. ✅ Integration tested successfully')
    console.log('2. 📋 Copy environment variables to Vercel')
    console.log('3. 🚀 Deploy to production')
    console.log('4. 🧪 Test booking flow on live site')
    console.log()

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.error(error)
    process.exit(1)
  }
}

testNewIntegration()
