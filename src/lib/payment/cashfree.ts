/**
 * Cashfree Payment Gateway Integration - Simplified & Clean
 * 
 * This is a fresh, simple implementation of Cashfree payments
 * Tested and working with production credentials
 */

// ============================================
// 1. CONFIGURATION
// ============================================

export interface CashfreeCredentials {
  appId: string
  secretKey: string
  mode: 'sandbox' | 'production'
}

export interface PaymentOrderData {
  orderId: string
  amount: number
  customerName: string
  customerEmail: string
  customerPhone: string
  returnUrl: string
}

export interface PaymentOrderResponse {
  orderId: string
  paymentSessionId: string
  paymentUrl: string
}

// Get credentials from environment
export function getCashfreeCredentials(): CashfreeCredentials {
  const appId = process.env.CASHFREE_APP_ID
  const secretKey = process.env.CASHFREE_SECRET_KEY
  const mode = (process.env.NEXT_PUBLIC_CASHFREE_MODE as 'sandbox' | 'production') || 'sandbox'

  if (!appId || !secretKey) {
    throw new Error('Cashfree credentials missing. Add CASHFREE_APP_ID and CASHFREE_SECRET_KEY to .env.local')
  }

  return { appId, secretKey, mode }
}

// Get API URL based on mode
export function getCashfreeApiUrl(mode: 'sandbox' | 'production'): string {
  return mode === 'production'
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg'
}

// ============================================
// 2. CREATE PAYMENT ORDER
// ============================================

export async function createCashfreeOrder(data: PaymentOrderData): Promise<PaymentOrderResponse> {
  const credentials = getCashfreeCredentials()
  const apiUrl = getCashfreeApiUrl(credentials.mode)

  // Prepare order request
  const orderRequest = {
    order_id: data.orderId,
    order_amount: data.amount,
    order_currency: 'INR',
    customer_details: {
      customer_id: `customer_${Date.now()}`,
      customer_name: data.customerName,
      customer_email: data.customerEmail,
      customer_phone: data.customerPhone
    },
    order_meta: {
      return_url: data.returnUrl,
      notify_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/payment/webhook`
    }
  }

  console.log('🚀 Creating Cashfree order:', {
    orderId: data.orderId,
    amount: data.amount,
    mode: credentials.mode,
    apiUrl
  })

  // Make API request
  const response = await fetch(`${apiUrl}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-version': '2023-08-01',
      'x-client-id': credentials.appId,
      'x-client-secret': credentials.secretKey
    },
    body: JSON.stringify(orderRequest)
  })

  if (!response.ok) {
    const error = await response.json()
    console.error('❌ Cashfree API error:', error)
    throw new Error(`Cashfree API error: ${error.message || response.statusText}`)
  }

  const result = await response.json()
  console.log('✅ Cashfree order created successfully')

  return {
    orderId: result.order_id,
    paymentSessionId: result.payment_session_id,
    paymentUrl: `https://payments${credentials.mode === 'sandbox' ? '.sandbox' : ''}.cashfree.com/pay/${result.payment_session_id}`
  }
}

// ============================================
// 3. VERIFY PAYMENT
// ============================================

export async function verifyCashfreePayment(orderId: string): Promise<{
  status: 'SUCCESS' | 'FAILED' | 'PENDING'
  amount?: number
  paymentTime?: string
}> {
  const credentials = getCashfreeCredentials()
  const apiUrl = getCashfreeApiUrl(credentials.mode)

  console.log('🔍 Verifying payment:', orderId)

  const response = await fetch(`${apiUrl}/orders/${orderId}`, {
    method: 'GET',
    headers: {
      'x-api-version': '2023-08-01',
      'x-client-id': credentials.appId,
      'x-client-secret': credentials.secretKey
    }
  })

  if (!response.ok) {
    const error = await response.json()
    console.error('❌ Payment verification failed:', error)
    throw new Error(`Payment verification failed: ${error.message || response.statusText}`)
  }

  const result = await response.json()
  console.log('✅ Payment verified:', result.order_status)

  // Map Cashfree status to our status
  let status: 'SUCCESS' | 'FAILED' | 'PENDING' = 'PENDING'
  if (result.order_status === 'PAID') status = 'SUCCESS'
  else if (result.order_status === 'ACTIVE') status = 'PENDING'
  else status = 'FAILED'

  return {
    status,
    amount: result.order_amount,
    paymentTime: result.payment_time
  }
}

// ============================================
// 4. GENERATE ORDER ID
// ============================================

export function generateOrderId(bookingId: string): string {
  return `ORDER_${bookingId}_${Date.now()}`
}

// ============================================
// 5. FORMAT PHONE NUMBER
// ============================================

export function formatPhoneNumber(phone: string): string {
  // Clean phone number and add +91 prefix
  const cleaned = phone.replace(/\D/g, '').slice(-10)
  return `+91${cleaned}`
}
