/**
 * Cashfree Payment Service
 * 
 * This service handles all Cashfree payment operations including
 * order creation, payment verification, and webhook handling.
 */

import crypto from 'crypto'
import {
  CashfreeConfig,
  PaymentOrderRequest,
  PaymentOrderResponse,
  BookingPaymentData,
  PaymentStatus,
  getCashfreeConfig,
  getCashfreeApiUrl,
  generateOrderId,
  generateReturnUrl,
  generateWebhookUrl,
  validatePaymentAmount,
  formatCurrency,
  calculatePaymentFees
} from './cashfree-config'

export class CashfreeService {
  private config: CashfreeConfig
  private apiUrl: string

  constructor() {
    this.config = getCashfreeConfig()
    this.apiUrl = getCashfreeApiUrl(this.config.environment)
  }

  /**
   * Create payment order with Cashfree
   */
  async createPaymentOrder(bookingData: BookingPaymentData): Promise<PaymentOrderResponse> {
    try {
      console.log('🚀 Creating payment order for booking:', bookingData.bookingId)
      console.log('📊 Booking data:', JSON.stringify(bookingData, null, 2))
      
      // Validate payment amount
      if (!validatePaymentAmount(bookingData.totalAmount)) {
        throw new Error('Invalid payment amount. Amount must be between ₹1 and ₹1,00,00,000')
      }

      // Calculate total with fees
      const feeCalculation = calculatePaymentFees(bookingData.totalAmount)
      const orderId = generateOrderId(bookingData.bookingId)

      console.log('💰 Fee calculation:', feeCalculation)
      console.log('🆔 Generated order ID:', orderId)

      // Prepare order request
      const cleanPhone = bookingData.phone.replace(/[^0-9]/g, '').slice(-10)
      const formattedPhone = `+91${cleanPhone}`
      
      const orderRequest: PaymentOrderRequest = {
        orderId,
        orderAmount: feeCalculation.total,
        orderCurrency: 'INR',
        customerDetails: {
          customerId: bookingData.userId,
          customerName: bookingData.guestName,
          customerEmail: bookingData.email,
          customerPhone: formattedPhone
        },
        orderMeta: {
          returnUrl: generateReturnUrl(bookingData.bookingId),
          notifyUrl: generateWebhookUrl(),
          paymentMethods: 'cc,dc,nb,upi,paylater,wallet'
        }
      }

      console.log('📋 Order request:', JSON.stringify(orderRequest, null, 2))
      console.log('🌐 API URL:', this.apiUrl)

      // Create authorization header
      const requestBody = JSON.stringify(orderRequest)
      const headers = this.createAuthHeaders('POST', '/orders', requestBody)
      
      console.log('📤 Request headers:', headers)

      // Make API call to Cashfree
      const response = await fetch(`${this.apiUrl}/orders`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderRequest)
      })

      console.log('📥 Response status:', response.status, response.statusText)

      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch (parseError) {
          errorData = { message: 'Unable to parse error response', status: response.status }
        }
        
        console.error('❌ Cashfree API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          errorData: errorData,
          requestData: orderRequest
        })
        
        throw new Error(`Cashfree API Error (${response.status}): ${errorData.message || errorData.error || response.statusText}`)
      }

      const orderData = await response.json()
      console.log('✅ Order created successfully:', orderData)
      
      return {
        cftoken: orderData.cftoken || orderData.payment_session_id,
        orderId: orderData.order_id,
        orderAmount: orderData.order_amount,
        orderCurrency: orderData.order_currency,
        paymentSessionId: orderData.payment_session_id
      }

    } catch (error) {
      console.error('❌ Error creating Cashfree payment order:', error)
      throw error
    }
  }

  /**
   * Verify payment status
   */
  async verifyPayment(orderId: string): Promise<{
    status: PaymentStatus
    transactionId?: string
    amount?: number
    paymentTime?: string
    paymentMethod?: string
  }> {
    try {
      // Create authorization header
      const headers = this.createAuthHeaders('GET', `/orders/${orderId}`)

      // Make API call to get order status
      const response = await fetch(`${this.apiUrl}/orders/${orderId}`, {
        method: 'GET',
        headers
      })

      if (!response.ok) {
        throw new Error(`Failed to verify payment: ${response.statusText}`)
      }

      const orderData = await response.json()
      
      return {
        status: this.mapPaymentStatus(orderData.order_status),
        transactionId: orderData.cf_order_id,
        amount: orderData.order_amount,
        paymentTime: orderData.settled_at,
        paymentMethod: orderData.payment_method
      }

    } catch (error) {
      console.error('Error verifying payment:', error)
      throw error
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(rawBody: string, signature: string, timestamp: string): boolean {
    try {
      const payload = timestamp + rawBody
      const expectedSignature = crypto
        .createHmac('sha256', this.config.secretKey)
        .update(payload)
        .digest('base64')

      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      )
    } catch (error) {
      console.error('Error verifying webhook signature:', error)
      return false
    }
  }

  /**
   * Process refund
   */
  async processRefund(orderId: string, refundAmount?: number): Promise<{
    refundId: string
    status: string
    processedAt: string
  }> {
    try {
      const refundRequest = {
        refund_amount: refundAmount,
        refund_id: `REFUND_${orderId}_${Date.now()}`,
        refund_note: 'Hotel booking cancellation refund'
      }

      const headers = this.createAuthHeaders('POST', `/orders/${orderId}/refunds`, JSON.stringify(refundRequest))

      const response = await fetch(`${this.apiUrl}/orders/${orderId}/refunds`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(refundRequest)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Refund failed: ${errorData.message || response.statusText}`)
      }

      const refundData = await response.json()
      
      return {
        refundId: refundData.cf_refund_id,
        status: refundData.refund_status,
        processedAt: refundData.processed_at
      }

    } catch (error) {
      console.error('Error processing refund:', error)
      throw error
    }
  }

  /**
   * Create authorization headers for Cashfree API
   */
  private createAuthHeaders(method: string, url: string, body?: string): Record<string, string> {
    const timestamp = Math.floor(Date.now() / 1000).toString()
    
    // Create signature according to Cashfree specification
    // Format: METHOD + URL + BODY + TIMESTAMP
    const signatureBody = body || ''
    const signatureData = `${method}${url}${signatureBody}${timestamp}`
    
    console.log('🔐 Creating signature with data:', {
      method,
      url,
      bodyLength: signatureBody.length,
      timestamp,
      signatureString: `${method}${url}[${signatureBody.length} chars]${timestamp}`,
      appId: this.config.appId.substring(0, 10) + '...',
      secretKeyLength: this.config.secretKey.length
    })
    
    const signature = crypto
      .createHmac('sha256', this.config.secretKey)
      .update(signatureData, 'utf8')
      .digest('base64')
    
    console.log('🔐 Generated signature:', signature.substring(0, 10) + '...')

    return {
      'x-api-version': this.config.apiVersion,
      'x-client-id': this.config.appId,
      'x-client-signature': signature,
      'x-client-timestamp': timestamp
    }
  }

  /**
   * Map Cashfree payment status to our enum
   */
  private mapPaymentStatus(cashfreeStatus: string): PaymentStatus {
    switch (cashfreeStatus?.toUpperCase()) {
      case 'PAID':
      case 'SUCCESS':
        return PaymentStatus.SUCCESS
      case 'FAILED':
      case 'CANCELLED':
        return PaymentStatus.FAILED
      case 'PENDING':
      case 'ACTIVE':
        return PaymentStatus.PENDING
      case 'USER_DROPPED':
        return PaymentStatus.USER_DROPPED
      default:
        return PaymentStatus.PENDING
    }
  }

  /**
   * Get payment methods configuration
   */
  getPaymentMethods() {
    return {
      creditCard: { enabled: true, fee: '2.5%' },
      debitCard: { enabled: true, fee: '1.5%' },
      netBanking: { enabled: true, fee: '1.5%' },
      upi: { enabled: true, fee: '1.0%' },
      wallet: { enabled: true, fee: '2.0%' },
      payLater: { enabled: true, fee: '3.0%' }
    }
  }

  /**
   * Generate payment summary
   */
  generatePaymentSummary(bookingData: BookingPaymentData) {
    const fees = calculatePaymentFees(bookingData.totalAmount)
    
    return {
      bookingDetails: {
        bookingId: bookingData.bookingId,
        guestName: bookingData.guestName,
        checkIn: bookingData.checkInDate,
        checkOut: bookingData.checkOutDate,
        roomType: bookingData.roomType,
        guests: bookingData.guests
      },
      serviceDetails: bookingData.selectedServices,
      amountBreakdown: {
        roomCharges: bookingData.totalAmount - bookingData.selectedServices.reduce((sum, service) => sum + service.price, 0),
        serviceCharges: bookingData.selectedServices.reduce((sum, service) => sum + service.price, 0),
        subtotal: fees.subtotal,
        serviceFee: fees.serviceFee,
        gst: fees.gst,
        totalAmount: fees.total
      },
      paymentMethods: this.getPaymentMethods()
    }
  }
}
