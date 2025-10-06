/**
 * Test Cashfree API Connection
 * Run this to test if Cashfree credentials are working
 */

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

// Read .env.local file manually
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
const BASE_URL = envVars.NEXT_PUBLIC_BASE_URL

console.log('🔧 Testing Cashfree Configuration...\n')

console.log('Environment Variables:')
console.log('- CASHFREE_APP_ID:', CASHFREE_APP_ID ? `${CASHFREE_APP_ID.substring(0, 10)}...` : '❌ NOT SET')
console.log('- CASHFREE_SECRET_KEY:', CASHFREE_SECRET_KEY ? `${CASHFREE_SECRET_KEY.substring(0, 15)}...` : '❌ NOT SET')
console.log('- CASHFREE_MODE:', CASHFREE_MODE || 'sandbox')
console.log('- BASE_URL:', BASE_URL || 'http://localhost:3000')
console.log()

if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
  console.error('❌ Missing Cashfree credentials!')
  process.exit(1)
}

const apiUrl = CASHFREE_MODE === 'production' 
  ? 'https://api.cashfree.com/pg'
  : 'https://sandbox.cashfree.com/pg'

console.log('🌐 API URL:', apiUrl)
console.log()

// Test API connection
async function testCashfreeConnection() {
  try {
    console.log('📡 Testing Cashfree API connection...\n')

    // Create a test order
    const orderId = `TEST_${Date.now()}`
    const orderData = {
      order_id: orderId,
      order_amount: 100,
      order_currency: 'INR',
      customer_details: {
        customer_id: 'test_customer',
        customer_name: 'Test Customer',
        customer_email: 'test@example.com',
        customer_phone: '+919999999999'
      },
      order_meta: {
        return_url: `${BASE_URL || 'http://localhost:3000'}/payment/callback?bookingId=test`,
        notify_url: `${BASE_URL || 'http://localhost:3000'}/api/payment/webhook`
      }
    }

    console.log('📋 Test Order Data:')
    console.log(JSON.stringify(orderData, null, 2))
    console.log()

    const headers = {
      'x-api-version': '2023-08-01',
      'x-client-id': CASHFREE_APP_ID,
      'x-client-secret': CASHFREE_SECRET_KEY,
      'Content-Type': 'application/json'
    }

    console.log('📤 Request Headers:')
    console.log({
      'x-api-version': headers['x-api-version'],
      'x-client-id': headers['x-client-id'].substring(0, 10) + '...',
      'x-client-secret': headers['x-client-secret'].substring(0, 15) + '...',
      'Content-Type': headers['Content-Type']
    })
    console.log()

    console.log('🚀 Sending request to Cashfree...')
    const response = await fetch(`${apiUrl}/orders`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(orderData)
    })

    console.log('📥 Response Status:', response.status, response.statusText)
    console.log()

    const responseText = await response.text()
    let responseData
    
    try {
      responseData = JSON.parse(responseText)
    } catch (e) {
      console.error('❌ Failed to parse response as JSON')
      console.log('Raw response:', responseText)
      process.exit(1)
    }

    if (!response.ok) {
      console.error('❌ Cashfree API Error:\n')
      console.error(JSON.stringify(responseData, null, 2))
      console.log()
      
      // Common error explanations
      if (responseData.message?.includes('Invalid credentials')) {
        console.log('💡 Possible Issue: App ID or Secret Key is incorrect')
        console.log('   Check Cashfree Dashboard → Developers → Credentials')
      } else if (responseData.message?.includes('IP')) {
        console.log('💡 Possible Issue: IP Whitelisting required')
        console.log('   Check Cashfree Dashboard → Settings → IP Whitelist')
      } else if (responseData.message?.includes('customer_phone')) {
        console.log('💡 Possible Issue: Phone number format')
        console.log('   Ensure phone is in format: +919999999999')
      }
      
      process.exit(1)
    }

    console.log('✅ SUCCESS! Cashfree API is working!\n')
    console.log('Response Data:')
    console.log(JSON.stringify(responseData, null, 2))
    console.log()
    console.log('🎉 Your Cashfree integration is properly configured!')
    console.log()
    console.log('Next steps:')
    console.log('1. Make sure these same credentials are in Vercel')
    console.log('2. Test a real booking on your production site')
    console.log('3. Configure webhook URL in Cashfree dashboard')

  } catch (error) {
    console.error('❌ Error testing Cashfree:', error.message)
    console.error(error)
    process.exit(1)
  }
}

testCashfreeConnection()
