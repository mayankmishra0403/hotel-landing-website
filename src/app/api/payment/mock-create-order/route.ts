import { NextRequest, NextResponse } from 'next/server'

/**
 * Mock Payment API for Development
 * This endpoint simulates Cashfree payment order creation for testing
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
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

    // Mock successful payment order creation
    const mockPaymentOrder = {
      cftoken: `mock_token_${Date.now()}`,
      orderId: `MOCK_ORDER_${body.bookingId}_${Date.now()}`,
      orderAmount: body.totalAmount,
      orderCurrency: 'INR',
      paymentSessionId: `mock_session_${Date.now()}`
    }

    console.log('🎭 Mock payment order created:', mockPaymentOrder)

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      paymentOrder: mockPaymentOrder,
      paymentSummary: {
        subtotal: body.totalAmount,
        taxes: Math.round(body.totalAmount * 0.18),
        total: Math.round(body.totalAmount * 1.18),
        currency: 'INR'
      },
      redirectUrl: `http://localhost:3002/payment/callback?order_id=${mockPaymentOrder.orderId}&status=SUCCESS&mock=true`
    })

  } catch (error: any) {
    console.error('❌ Mock payment error:', error)
    
    return NextResponse.json(
      { 
        error: 'Mock payment failed',
        message: error.message
      },
      { status: 500 }
    )
  }
}
