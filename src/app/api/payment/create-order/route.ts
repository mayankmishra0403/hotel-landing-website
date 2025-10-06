import { NextRequest, NextResponse } from 'next/server'
import { CashfreeService } from '@/lib/cashfree-service'

/**
 * POST /api/payment/create-order
 * Creates a Cashfree payment order for hotel booking with mock fallback
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('📥 Received payment order request:', JSON.stringify(body, null, 2))
    
    // Validate required fields
    const requiredFields = [
      'bookingId', 'userId', 'guestName', 'email', 'phone',
      'checkInDate', 'checkOutDate', 'roomType', 'guests', 'totalAmount'
    ]
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate and clean phone number (Indian format: 10 digits, starting with 6-9)
    const cleanPhone = body.phone.replace(/\D/g, '')
    const phoneRegex = /^[6-9]\d{9}$/
    const isValidPhone = phoneRegex.test(cleanPhone)
    
    console.log('📞 Phone validation:', { 
      original: body.phone, 
      cleaned: cleanPhone, 
      isValid: isValidPhone 
    })
    
    if (!isValidPhone) {
      return NextResponse.json(
        { 
          error: 'Invalid phone number format',
          details: `Phone number must be a 10-digit Indian mobile number starting with 6-9. Received: ${body.phone} (cleaned: ${cleanPhone})`
        },
        { status: 400 }
      )
    }

    // Calculate fees and total
    const serviceFee = Math.floor(body.totalAmount * 0.025) // 2.5% service fee
    const gst = Math.floor((body.totalAmount + serviceFee) * 0.0025) // 0.25% GST
    const totalWithTaxes = body.totalAmount + serviceFee + gst

    console.log('💰 Fee calculation:', { 
      subtotal: body.totalAmount, 
      serviceFee, 
      gst, 
      total: totalWithTaxes 
    })

    // Generate unique order ID
    const orderId = `HOTEL_${body.bookingId}_${Date.now()}`
    console.log('🆔 Generated order ID:', orderId)

    // Prepare booking data for Cashfree service
    const bookingData = {
      bookingId: body.bookingId,
      userId: body.userId,
      guestName: body.guestName,
      email: body.email,
      phone: cleanPhone, // Use cleaned phone number
      checkInDate: body.checkInDate,
      checkOutDate: body.checkOutDate,
      roomType: body.roomType,
      guests: body.guests,
      totalAmount: body.totalAmount,
      selectedServices: body.selectedServices || [],
      specialRequests: body.specialRequests || ''
    }

    // Initialize Cashfree service and try to create payment order
    const cashfreeService = new CashfreeService()
    
    try {
      // Try to create payment order using Cashfree
      const paymentOrder = await cashfreeService.createPaymentOrder(bookingData)

      console.log('✅ Real Cashfree payment order created successfully')

      return NextResponse.json({
        success: true,
        orderId: paymentOrder.orderId,
        amount: paymentOrder.orderAmount,
        currency: paymentOrder.orderCurrency,
        paymentSessionId: paymentOrder.paymentSessionId,
        paymentUrl: `https://payments.cashfree.com/order/${paymentOrder.orderId}`
      })

    } catch (cashfreeError: any) {
      const isProduction = process.env.NEXT_PUBLIC_CASHFREE_MODE === 'production'
      if (isProduction) {
        console.error('❌ Cashfree order creation failed in production:', cashfreeError?.message || cashfreeError)
        return NextResponse.json(
          {
            success: false,
            error: 'payment_order_failed',
            message: 'Unable to create payment order. Please try again or use a different payment method.'
          },
          { status: 502 }
        )
      }

      console.log('⚠️  Cashfree payment failed, falling back to mock payment system...')
      console.log('💻 Development mode: Creating mock payment order')
      
      // Generate mock payment order for development
      const mockOrderId = `MOCK_${orderId}`
      const mockPaymentUrl = `http://localhost:3000/payment/mock?orderId=${mockOrderId}&amount=${totalWithTaxes}&bookingId=${body.bookingId}`

      console.log('🎭 Mock payment order created:', {
        orderId: mockOrderId,
        amount: totalWithTaxes,
        paymentUrl: mockPaymentUrl
      })

      return NextResponse.json({
        success: true,
        orderId: mockOrderId,
        amount: totalWithTaxes,
        currency: 'INR',
        paymentSessionId: `mock_session_${Date.now()}`,
        paymentUrl: mockPaymentUrl,
        isMockPayment: true
      })
    }

  } catch (error: any) {
    console.error('❌ Error creating payment order:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create payment order',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
