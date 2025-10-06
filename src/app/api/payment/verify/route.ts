import { NextRequest, NextResponse } from 'next/server'
import { CashfreeService } from '@/lib/cashfree-service'
import { PaymentStatus } from '@/lib/cashfree-config'
import { serverDatabases, SERVER_CONFIG, isServerConfigured } from '@/lib/appwrite-server'
import { Query } from 'appwrite'

/**
 * POST /api/payment/verify
 * Verifies payment status with Cashfree and updates booking
 * Supports both real Cashfree payments and mock payments for development
 */
export async function POST(request: NextRequest) {
  try {
    const { orderId, bookingId } = await request.json()

    console.log('🔍 Payment verification request:', { orderId, bookingId })

    if (!orderId || !bookingId) {
      console.log('❌ Missing required parameters:', { orderId: !!orderId, bookingId: !!bookingId })
      return NextResponse.json(
        { error: 'Order ID and Booking ID are required' },
        { status: 400 }
      )
    }

    // Check if this is a mock payment
    const isMockPayment = orderId.startsWith('MOCK_')
    
    let paymentResult
    
    if (isMockPayment) {
      // Handle mock payment verification
      console.log('🎭 Mock payment verification for:', orderId)
      paymentResult = {
        status: PaymentStatus.SUCCESS,
        transactionId: `mock_txn_${Date.now()}`,
        amount: 0, // Will be updated from booking if needed
        paymentTime: new Date().toISOString(),
        paymentMethod: 'mock_payment',
        orderId
      }
    } else {
      // Initialize Cashfree service for real payments
      const cashfreeService = new CashfreeService()
      
      try {
        // Verify payment with Cashfree
        console.log('💳 Verifying real payment with Cashfree:', orderId)
        paymentResult = await cashfreeService.verifyPayment(orderId)
      } catch (cashfreeError: any) {
        console.log('❌ Cashfree verification failed:', cashfreeError.message)
        // In production, do not allow fallback to mock success
        const isProduction = process.env.NEXT_PUBLIC_CASHFREE_MODE === 'production'
        if (isProduction) {
          throw cashfreeError
        }
        // Development fallback only
        console.log('🎭 Falling back to mock verification due to Cashfree error (development only)')
        paymentResult = {
          status: PaymentStatus.SUCCESS,
          transactionId: `fallback_txn_${Date.now()}`,
          amount: 0,
          paymentTime: new Date().toISOString(),
          paymentMethod: 'mock_fallback',
          orderId
        }
      }
    }
    
    console.log('💳 Payment verification result:', {
      orderId,
      bookingId,
      status: paymentResult.status,
      transactionId: paymentResult.transactionId,
      isMockPayment
    })

    // Update booking status in database if server is configured
    if (isServerConfigured()) {
      try {
        // Get the booking document  
        const bookings = await serverDatabases.listDocuments(
          SERVER_CONFIG.databaseId,
          SERVER_CONFIG.collections.bookings,
          [Query.equal('$id', bookingId)]
        )

        if (bookings.documents.length > 0) {
          const booking = bookings.documents[0]
          
          // Update booking with payment information
          await serverDatabases.updateDocument(
            SERVER_CONFIG.databaseId,
            SERVER_CONFIG.collections.bookings,
            bookingId,
            {
              paymentStatus: paymentResult.status,
              paymentOrderId: orderId,
              paymentTransactionId: paymentResult.transactionId,
              paymentAmount: paymentResult.amount || booking.totalAmount,
              paymentTime: paymentResult.paymentTime,
              paymentMethod: paymentResult.paymentMethod,
              updatedAt: new Date().toISOString()
            }
          )
          
          console.log('✅ Updated booking with payment status:', bookingId)
        } else {
          console.log('⚠️ Booking not found in database:', bookingId)
        }
      } catch (dbError) {
        console.error('❌ Failed to update booking in database:', dbError)
        // Continue with the response even if DB update fails
      }
    } else {
      console.log('⚠️ Database not configured, skipping booking update')
    }

    // Determine message based on payment status
    let message: string
    switch (paymentResult.status) {
      case PaymentStatus.SUCCESS:
        message = isMockPayment ? 
          'Mock payment successful! Your booking is confirmed. (Development mode)' :
          'Payment successful! Your booking is confirmed.'
        break
      case PaymentStatus.FAILED:
        message = 'Payment failed. Please try again.'
        break
      case PaymentStatus.PENDING:
        message = 'Payment is being processed. Please wait.'
        break
      case PaymentStatus.USER_DROPPED:
        message = 'Payment was cancelled by user.'
        break
      default:
        message = 'Payment status unknown. Please contact support.'
    }

    // Prepare response
    const response = {
      success: paymentResult.status === PaymentStatus.SUCCESS,
      paymentStatus: paymentResult.status,
      orderId,
      bookingId,
      transactionId: paymentResult.transactionId,
      amount: paymentResult.amount,
      paymentTime: paymentResult.paymentTime,
      paymentMethod: paymentResult.paymentMethod,
      message,
      isMockPayment
    }

    console.log('✅ Payment verification response:', response)

    return NextResponse.json(response)

  } catch (error: any) {
    console.error('❌ Error verifying payment:', error)
    return NextResponse.json(
      { 
        error: 'Failed to verify payment',
        message: error.message,
        details: 'Payment verification service encountered an error'
      },
      { status: 500 }
    )
  }
}
