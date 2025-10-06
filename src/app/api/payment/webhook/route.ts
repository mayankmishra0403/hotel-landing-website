import { NextRequest, NextResponse } from 'next/server'
import { CashfreeService } from '@/lib/cashfree-service'
import { PaymentStatus } from '@/lib/cashfree-config'
import { serverDatabases, SERVER_CONFIG, isServerConfigured } from '@/lib/appwrite-server'
import { Query } from 'appwrite'

/**
 * POST /api/payment/webhook
 * Handles Cashfree payment webhooks for real-time payment status updates
 */
export async function POST(request: NextRequest) {
  try {
    // Get webhook headers
    const signature = request.headers.get('x-webhook-signature') || ''
    const timestamp = request.headers.get('x-webhook-timestamp') || ''
    
    // Get raw body for signature verification
    const rawBody = await request.text()
    
  if (!signature || !timestamp) {
      console.log('❌ Missing webhook signature or timestamp')
      return NextResponse.json(
        { error: 'Missing webhook signature or timestamp' },
        { status: 400 }
      )
    }

    // Initialize Cashfree service
    const cashfreeService = new CashfreeService()
    
    // Verify webhook signature
    const isValidSignature = cashfreeService.verifyWebhookSignature(rawBody, signature, timestamp)
    
    if (!isValidSignature) {
      console.log('❌ Invalid webhook signature')
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      )
    }

    // Parse webhook data
    const webhookData = JSON.parse(rawBody)
    console.log('🔔 Received Cashfree webhook:', {
      type: webhookData.type,
      orderId: webhookData.data?.order?.order_id,
      status: webhookData.data?.payment?.payment_status
    })

    // Handle different webhook types
    switch (webhookData.type) {
      case 'PAYMENT_SUCCESS_WEBHOOK':
        await handlePaymentSuccess(webhookData.data)
        break
      case 'PAYMENT_FAILED_WEBHOOK':
        await handlePaymentFailure(webhookData.data)
        break
      case 'PAYMENT_USER_DROPPED_WEBHOOK':
        await handlePaymentDropped(webhookData.data)
        break
      default:
        console.log('⚠️ Unhandled webhook type:', webhookData.type)
    }

    return NextResponse.json({ success: true, message: 'Webhook processed successfully' })

  } catch (error: any) {
    console.error('❌ Error processing webhook:', error)
    
    return NextResponse.json(
      { 
        error: 'Webhook processing failed',
        message: error.message 
      },
      { status: 500 }
    )
  }
}

/**
 * Handle successful payment webhook
 */
async function handlePaymentSuccess(data: any) {
  try {
    const orderId = data.order?.order_id
    const paymentData = data.payment
    
    if (!orderId) {
      console.log('❌ No order ID in success webhook')
      return
    }

    // Extract booking ID from order ID (format: HOTEL_bookingId_timestamp)
    const bookingId = orderId.split('_')[1]
    
    if (!bookingId) {
      console.log('❌ Could not extract booking ID from order ID:', orderId)
      return
    }

    console.log('✅ Processing payment success:', { orderId, bookingId })

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
          // Update booking with payment success information
          await serverDatabases.updateDocument(
            SERVER_CONFIG.databaseId,
            SERVER_CONFIG.collections.bookings,
            bookingId,
            {
              paymentStatus: PaymentStatus.SUCCESS,
              paymentOrderId: orderId,
              paymentTransactionId: paymentData.cf_payment_id,
              paymentAmount: paymentData.payment_amount,
              paymentTime: paymentData.payment_time,
              paymentMethod: paymentData.payment_method?.toLowerCase(),
              bookingStatus: 'confirmed',
              updatedAt: new Date().toISOString()
            }
          )
          
          console.log('✅ Updated booking with payment success:', bookingId)

          // TODO: Send confirmation email to guest
          // TODO: Send notification to hotel staff
          // TODO: Update user preferences with loyalty points
          
        } else {
          console.log('❌ Booking not found for payment success:', bookingId)
        }
      } catch (dbError) {
        console.error('❌ Failed to update booking after payment success:', dbError)
      }
    }

  } catch (error) {
    console.error('❌ Error handling payment success webhook:', error)
  }
}

/**
 * Handle failed payment webhook
 */
async function handlePaymentFailure(data: any) {
  try {
    const orderId = data.order?.order_id
    const paymentData = data.payment
    
    if (!orderId) {
      console.log('❌ No order ID in failure webhook')
      return
    }

    // Extract booking ID from order ID
    const bookingId = orderId.split('_')[1]
    
    if (!bookingId) {
      console.log('❌ Could not extract booking ID from order ID:', orderId)
      return
    }

    console.log('❌ Processing payment failure:', { orderId, bookingId })

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
          // Update booking with payment failure information
          await serverDatabases.updateDocument(
            SERVER_CONFIG.databaseId,
            SERVER_CONFIG.collections.bookings,
            bookingId,
            {
              paymentStatus: PaymentStatus.FAILED,
              paymentOrderId: orderId,
              paymentFailureReason: paymentData.payment_message || 'Payment failed',
              bookingStatus: 'payment_failed',
              updatedAt: new Date().toISOString()
            }
          )
          
          console.log('✅ Updated booking with payment failure:', bookingId)

          // TODO: Send payment failure notification to guest
          // TODO: Suggest alternative payment methods
          
        } else {
          console.log('❌ Booking not found for payment failure:', bookingId)
        }
      } catch (dbError) {
        console.error('❌ Failed to update booking after payment failure:', dbError)
      }
    }

  } catch (error) {
    console.error('❌ Error handling payment failure webhook:', error)
  }
}

/**
 * Handle user dropped payment webhook
 */
async function handlePaymentDropped(data: any) {
  try {
    const orderId = data.order?.order_id
    
    if (!orderId) {
      console.log('❌ No order ID in dropped webhook')
      return
    }

    // Extract booking ID from order ID
    const bookingId = orderId.split('_')[1]
    
    if (!bookingId) {
      console.log('❌ Could not extract booking ID from order ID:', orderId)
      return
    }

    console.log('⚠️ Processing payment dropped:', { orderId, bookingId })

    // Update booking status in database if server is configured
    if (isServerConfigured()) {
      try {
        // Get the booking document
        const bookings = await serverDatabases.listDocuments(
          SERVER_CONFIG.databaseId,
          SERVER_CONFIG.collections.bookings,
          [`equal("$id", "${bookingId}")`]
        )

        if (bookings.documents.length > 0) {
          // Update booking with payment dropped information
          await serverDatabases.updateDocument(
            SERVER_CONFIG.databaseId,
            SERVER_CONFIG.collections.bookings,
            bookingId,
            {
              paymentStatus: PaymentStatus.USER_DROPPED,
              paymentOrderId: orderId,
              bookingStatus: 'payment_cancelled',
              updatedAt: new Date().toISOString()
            }
          )
          
          console.log('✅ Updated booking with payment dropped:', bookingId)

          // TODO: Send reminder email with payment link
          // TODO: Keep booking on hold for limited time
          
        } else {
          console.log('❌ Booking not found for payment dropped:', bookingId)
        }
      } catch (dbError) {
        console.error('❌ Failed to update booking after payment dropped:', dbError)
      }
    }

  } catch (error) {
    console.error('❌ Error handling payment dropped webhook:', error)
  }
}

/**
 * GET /api/payment/webhook
 * Returns webhook endpoint information
 */
export async function GET() {
  return NextResponse.json({
    message: 'Cashfree Payment Webhook Endpoint',
    supportedEvents: [
      'PAYMENT_SUCCESS_WEBHOOK',
      'PAYMENT_FAILED_WEBHOOK', 
      'PAYMENT_USER_DROPPED_WEBHOOK'
    ],
    headers: {
      required: ['x-webhook-signature', 'x-webhook-timestamp'],
      contentType: 'application/json'
    }
  })
}
