import { NextRequest, NextResponse } from 'next/server'
import {
  createCashfreeOrder,
  generateOrderId,
  formatPhoneNumber
} from '@/lib/payment/cashfree'

/**
 * POST /api/payment/create
 * Create a new payment order - SIMPLIFIED VERSION
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📥 Payment request received')

    // Validate required fields
    const { bookingId, guestName, email, phone, totalAmount } = body

    if (!bookingId || !guestName || !email || !phone || !totalAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate order ID
    const orderId = generateOrderId(bookingId)

    // Format phone number
    const formattedPhone = formatPhoneNumber(phone)

    // Generate return URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const returnUrl = `${baseUrl}/payment/callback?bookingId=${bookingId}&orderId=${orderId}`

    console.log('💰 Creating payment order:', {
      orderId,
      amount: totalAmount,
      customer: guestName,
      returnUrl
    })

    // Create Cashfree order
    const paymentOrder = await createCashfreeOrder({
      orderId,
      amount: totalAmount,
      customerName: guestName,
      customerEmail: email,
      customerPhone: formattedPhone,
      returnUrl
    })

    console.log('✅ Payment order created successfully')

    return NextResponse.json({
      success: true,
      orderId: paymentOrder.orderId,
      paymentSessionId: paymentOrder.paymentSessionId,
      paymentUrl: paymentOrder.paymentUrl
    })

  } catch (error: any) {
    console.error('❌ Payment order creation failed:', error.message)
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create payment order'
      },
      { status: 500 }
    )
  }
}
