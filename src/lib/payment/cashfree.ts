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

  // Make API request (try with latest API version, then fallback once if auth fails)
  const doCreate = async (apiVersion: '2023-08-01' | '2022-01-01') => {
    const res = await fetch(`${apiUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': apiVersion,
        'x-client-id': credentials.appId,
        'x-client-secret': credentials.secretKey
      },
      body: JSON.stringify(orderRequest)
    })
    return { res, apiVersion }
  }

  let { res: response, apiVersion } = await doCreate('2023-08-01')

  // If authentication failed, retry with older API version once
  if (!response.ok) {
    let errorBody: any = undefined
    try { errorBody = await response.json() } catch {}
    const isAuthFail = response.status === 401 || (errorBody?.code || '').toString().toLowerCase().includes('auth')
    if (isAuthFail) {
      console.warn('🔁 Cashfree auth failed with API version 2023-08-01, retrying with 2022-01-01')
      const retry = await doCreate('2022-01-01')
      response = retry.res
      apiVersion = retry.apiVersion
      try { errorBody = await response.clone().json() } catch {}
    }

    if (!response.ok) {
      const status = response.status
      const statusText = response.statusText
      console.error('❌ Cashfree API error:', {
        status,
        statusText,
        apiUrl,
        mode: credentials.mode,
        apiVersion,
        cfError: errorBody
      })
      const cfMsg = errorBody?.message || errorBody?.message_text || errorBody?.error || 'Unknown error'
      const hint = (status === 401)
        ? 'Authentication failed. Verify CASHFREE_APP_ID/CASHFREE_SECRET_KEY match your NEXT_PUBLIC_CASHFREE_MODE (sandbox vs production) and are PG (Payment Gateway) keys.'
        : ''
      throw new Error(`Cashfree API error (${status} ${statusText}): ${cfMsg}. ${hint}`.trim())
    }
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

  // Try verify with primary API version, then fallback if necessary
  const doVerify = async (apiVersion: '2023-08-01' | '2022-01-01') => {
    const res = await fetch(`${apiUrl}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'x-api-version': apiVersion,
        'x-client-id': credentials.appId,
        'x-client-secret': credentials.secretKey
      }
    })
    return { res, apiVersion }
  }

  let { res: response, apiVersion: vApiVersion } = await doVerify('2023-08-01')
  if (!response.ok) {
    let errorBody: any = undefined
    try { errorBody = await response.json() } catch {}
    const isAuthFail = response.status === 401 || (errorBody?.code || '').toString().toLowerCase().includes('auth')
    if (isAuthFail) {
      console.warn('🔁 Cashfree verify auth failed with API version 2023-08-01, retrying with 2022-01-01')
      const retry = await doVerify('2022-01-01')
      response = retry.res
      vApiVersion = retry.apiVersion
      try { errorBody = await response.clone().json() } catch {}
    }

    if (!response.ok) {
      console.error('❌ Payment verification failed:', {
        status: response.status,
        statusText: response.statusText,
        apiUrl,
        mode: credentials.mode,
        apiVersion: vApiVersion,
        cfError: errorBody
      })
      const cfMsg = errorBody?.message || errorBody?.message_text || errorBody?.error || 'Unknown error'
      throw new Error(`Payment verification failed (${response.status} ${response.statusText}): ${cfMsg}`)
    }
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
