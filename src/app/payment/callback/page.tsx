'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Clock, AlertCircle, ArrowLeft, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PaymentStatus } from '@/lib/cashfree-config'

interface PaymentResult {
  success: boolean
  paymentStatus: PaymentStatus
  orderId: string
  bookingId: string
  transactionId?: string
  amount?: number
  paymentTime?: string
  paymentMethod?: string
  message: string
}

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const bookingId = searchParams.get('bookingId')
  // Handle both order_id (Cashfree) and orderId (mock payment) parameter formats
  const orderId = searchParams.get('order_id') || searchParams.get('orderId')
  const orderToken = searchParams.get('order_token')
  const paymentStatus = searchParams.get('status') // For mock payments

  useEffect(() => {
    const verifyPayment = async () => {
      if (!bookingId || !orderId) {
        setError('Missing payment parameters')
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            orderId,
            bookingId
          })
        })

        const result = await response.json()

        if (response.ok) {
          setPaymentResult(result)
        } else {
          setError(result.message || 'Payment verification failed')
        }

      } catch (err) {
        console.error('Error verifying payment:', err)
        setError('Failed to verify payment status')
      } finally {
        setLoading(false)
      }
    }

    verifyPayment()
  }, [bookingId, orderId])

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.SUCCESS:
        return <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
      case PaymentStatus.FAILED:
        return <XCircle className="w-16 h-16 text-red-500 mx-auto" />
      case PaymentStatus.PENDING:
        return <Clock className="w-16 h-16 text-yellow-500 mx-auto animate-pulse" />
      default:
        return <AlertCircle className="w-16 h-16 text-orange-500 mx-auto" />
    }
  }

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.SUCCESS:
        return 'from-green-400 to-green-600'
      case PaymentStatus.FAILED:
        return 'from-red-400 to-red-600'
      case PaymentStatus.PENDING:
        return 'from-yellow-400 to-yellow-600'
      default:
        return 'from-orange-400 to-orange-600'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md mx-4"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifying Payment</h2>
          <p className="text-gray-600">Please wait while we confirm your payment...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md mx-4"
        >
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Button>
            <Button
              onClick={() => router.push('/bookings')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              View Bookings
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  if (!paymentResult) {
    return null
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${
      paymentResult.success ? 'from-green-50 to-green-100' : 'from-red-50 to-red-100'
    } flex items-center justify-center`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-lg mx-4"
      >
        {/* Status Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-6"
        >
          {getStatusIcon(paymentResult.paymentStatus)}
        </motion.div>

        {/* Status Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`text-3xl font-bold mb-4 bg-gradient-to-r ${getStatusColor(paymentResult.paymentStatus)} bg-clip-text text-transparent`}
        >
          {paymentResult.success ? 'Payment Successful!' : 'Payment Failed'}
        </motion.h1>

        {/* Status Message */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-6 text-lg"
        >
          {paymentResult.message}
        </motion.p>

        {/* Payment Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-50 rounded-xl p-6 mb-6 text-left"
        >
          <h3 className="font-semibold text-gray-800 mb-4">Payment Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Booking ID:</span>
              <span className="font-medium text-gray-800">{paymentResult.bookingId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium text-gray-800">{paymentResult.orderId}</span>
            </div>
            {paymentResult.transactionId && (
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-medium text-gray-800">{paymentResult.transactionId}</span>
              </div>
            )}
            {paymentResult.amount && (
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-medium text-gray-800">₹{paymentResult.amount}</span>
              </div>
            )}
            {paymentResult.paymentMethod && (
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium text-gray-800 capitalize">{paymentResult.paymentMethod}</span>
              </div>
            )}
            {paymentResult.paymentTime && (
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Time:</span>
                <span className="font-medium text-gray-800">
                  {new Date(paymentResult.paymentTime).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Button>
          <Button
            onClick={() => router.push('/bookings')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            View My Bookings
          </Button>
        </motion.div>

        {/* Success-specific actions */}
        {paymentResult.success && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-6 p-4 bg-green-50 rounded-xl"
          >
            <p className="text-green-800 text-sm mb-2">
              🎉 Your booking is confirmed! You will receive a confirmation email shortly.
            </p>
            <p className="text-green-700 text-xs">
              Please save this page or take a screenshot for your records.
            </p>
          </motion.div>
        )}

        {/* Failed payment options */}
        {!paymentResult.success && paymentResult.paymentStatus !== PaymentStatus.PENDING && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-6"
          >
            <Button
              onClick={() => router.push(`/payment/retry?bookingId=${paymentResult.bookingId}`)}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Try Payment Again
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
