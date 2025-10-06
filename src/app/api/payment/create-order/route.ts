import { NextRequest, NextResponse } from 'next/server'
import { createCashfreeOrder, formatPhoneNumber, generateOrderId } from '@/lib/payment/cashfree'

/**
 * POST /api/payment/create-order
 * Legacy endpoint: Creates a Cashfree payment order (now proxies to new integration)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
   console.log('📥 [legacy] Received payment order request:', JSON.stringify(body, null, 2))
    
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

  // Use simplified fee = totalAmount (any fees should be baked into total already)
  const totalWithTaxes = Math.round(body.totalAmount)

  // Generate unique order ID via new util
  const orderId = generateOrderId(body.bookingId)
  console.log('🆔 [legacy] Generated order ID:', orderId)

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

    // Create order via new integration so old callers continue to work
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      const payment = await createCashfreeOrder({
        orderId,
        amount: totalWithTaxes,
        customerName: bookingData.guestName,
        customerEmail: bookingData.email,
        customerPhone: formatPhoneNumber(bookingData.phone),
        returnUrl: `${baseUrl}/payment/callback?bookingId=${bookingData.bookingId}&orderId=${orderId}`
      })

      console.log('✅ [legacy] Order created via new integration')
      return NextResponse.json({
        success: true,
        orderId: payment.orderId,
        amount: totalWithTaxes,
        currency: 'INR',
        paymentSessionId: payment.paymentSessionId,
        paymentUrl: payment.paymentUrl
      })
    } catch (err: any) {
      console.error('❌ [legacy] Order creation failed:', err?.message || err)
      return NextResponse.json(
        { success: false, error: 'payment_order_failed', message: 'Unable to create payment order' },
        { status: 502 }
      )
    }

  } catch (error: any) {
  console.error('❌ [legacy] Error creating payment order:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create payment order',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
