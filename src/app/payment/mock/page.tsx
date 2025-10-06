'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, CreditCard, Clock } from 'lucide-react'

export default function MockPaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isProduction = process.env.NEXT_PUBLIC_CASHFREE_MODE === 'production'
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending')
  const [countdown, setCountdown] = useState(3)

  const orderId = searchParams.get('orderId')
  const amount = searchParams.get('amount')
  const bookingId = searchParams.get('bookingId')

  useEffect(() => {
    // Simulate payment processing
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          // Simulate successful payment (90% success rate for demo)
          const isSuccess = Math.random() > 0.1
          setPaymentStatus(isSuccess ? 'success' : 'failed')
          
          if (isSuccess) {
            // Redirect to success page after showing success message
            setTimeout(() => {
              router.push(`/payment/callback?bookingId=${bookingId}&status=success&orderId=${orderId}`)
            }, 2000)
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router, bookingId, orderId])

  const handleRetry = () => {
    setPaymentStatus('pending')
    setCountdown(3)
  }

  const handleCancel = () => {
    router.push('/rooms')
  }

  if (isProduction) {
    // Block mock gateway in production
    if (typeof window !== 'undefined') {
      router.replace('/rooms')
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <CreditCard className="h-6 w-6 text-blue-600" />
            Mock Payment Gateway
          </CardTitle>
          <CardDescription>
            Development Payment Simulation
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Order ID:</span>
              <span className="text-sm font-mono">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Amount:</span>
              <span className="text-sm font-semibold">₹{amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Booking ID:</span>
              <span className="text-sm font-mono">{bookingId}</span>
            </div>
          </div>

          {/* Payment Status */}
          <div className="text-center">
            {paymentStatus === 'pending' && (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <Clock className="h-8 w-8 text-blue-600 animate-spin" />
                </div>
                <div>
                  <p className="text-lg font-semibold">Processing Payment...</p>
                  <p className="text-sm text-gray-600">Please wait {countdown} seconds</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${((3 - countdown) / 3) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {paymentStatus === 'success' && (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <CheckCircle className="h-16 w-16 text-green-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-green-600">Payment Successful!</p>
                  <p className="text-sm text-gray-600">Redirecting to confirmation...</p>
                </div>
              </div>
            )}

            {paymentStatus === 'failed' && (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <XCircle className="h-16 w-16 text-red-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-red-600">Payment Failed</p>
                  <p className="text-sm text-gray-600">Please try again or contact support</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleRetry} className="flex-1">
                    Retry Payment
                  </Button>
                  <Button onClick={handleCancel} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Development Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-700 text-center">
              🚧 This is a development mock payment system. 
              No real transactions are processed.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
