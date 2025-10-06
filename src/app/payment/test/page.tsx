'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Shield, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function PaymentTestPage() {
  const [paymentData, setPaymentData] = useState({
    guestName: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210',
    amount: 2500
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleTestPayment = async () => {
    setLoading(true)
    setResult(null)

    try {
      // Create a test booking first
      const bookingResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'test-user-123',
          guestName: paymentData.guestName,
          guestEmail: paymentData.email,
          guestPhone: paymentData.phone,
          roomId: 'luxury-suite',
          roomName: 'Luxury Suite',
          roomPrice: 2000,
          checkIn: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          checkOut: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          guests: 2,
          nights: 1,
          totalAmount: paymentData.amount,
          taxes: 300,
          finalTotal: paymentData.amount + 300,
          specialRequests: 'Test booking for payment integration',
          status: 'pending',
          paymentStatus: 'pending',
          paymentMethod: 'cashfree'
        })
      })

      const booking = await bookingResponse.json()
      
      if (!bookingResponse.ok) {
        throw new Error(booking.message || 'Failed to create test booking')
      }

      // Create payment order
    const paymentResponse = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.bookingId || booking.$id,
          userId: 'test-user-123',
          guestName: paymentData.guestName,
          email: paymentData.email,
          phone: paymentData.phone,
          checkInDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          checkOutDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          roomType: 'Luxury Suite',
          guests: 2,
          totalAmount: paymentData.amount,
          selectedServices: [
            { name: 'Airport Transfer', price: 45 },
            { name: 'Spa Package', price: 120 }
          ],
          specialRequests: 'Test payment integration'
        })
      })

      const paymentResult = await paymentResponse.json()
      
      if (paymentResponse.ok && paymentResult.success) {
        setResult({
          success: true,
          paymentOrder: paymentResult.paymentOrder,
          paymentUrl: `${paymentResult.redirectUrl}?token=${paymentResult.paymentOrder.cftoken}`,
          summary: paymentResult.paymentSummary
        })
      } else {
        setResult({
          success: false,
          error: paymentResult.message || 'Payment order creation failed'
        })
      }

    } catch (error: any) {
      console.error('Test payment error:', error)
      setResult({
        success: false,
        error: error.message || 'Test failed'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Cashfree Payment Test
          </h1>
          <p className="text-gray-600">
            Test your Cashfree payment gateway integration
          </p>
        </motion.div>

        {/* Test Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-6"
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Test Payment Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Guest Name
              </label>
              <Input
                value={paymentData.guestName}
                onChange={(e) => setPaymentData(prev => ({ ...prev, guestName: e.target.value }))}
                placeholder="Enter guest name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <Input
                type="email"
                value={paymentData.email}
                onChange={(e) => setPaymentData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <Input
                value={paymentData.phone}
                onChange={(e) => setPaymentData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter 10-digit phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (₹)
              </label>
              <Input
                type="number"
                value={paymentData.amount}
                onChange={(e) => setPaymentData(prev => ({ ...prev, amount: parseInt(e.target.value) }))}
                placeholder="Enter amount in rupees"
              />
            </div>
          </div>

          <Button
            onClick={handleTestPayment}
            disabled={loading}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating Payment Order...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Test Cashfree Payment
              </div>
            )}
          </Button>
        </motion.div>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl shadow-xl p-6 ${
              result.success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              {result.success ? (
                <Check className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-600" />
              )}
              <h3 className={`text-lg font-semibold ${
                result.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {result.success ? 'Payment Order Created!' : 'Test Failed'}
              </h3>
            </div>

            {result.success ? (
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-2">Payment Details:</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>Order ID: <span className="font-mono">{result.paymentOrder.orderId}</span></div>
                    <div>Amount: ₹{result.paymentOrder.orderAmount}</div>
                    <div>Currency: {result.paymentOrder.orderCurrency}</div>
                    <div>Session ID: <span className="font-mono">{result.paymentOrder.paymentSessionId}</span></div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Next Steps:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
                    <li>Click the button below to open Cashfree payment page</li>
                    <li>Use test card: 4111 1111 1111 1111</li>
                    <li>Use any CVV and future expiry date</li>
                    <li>Use OTP: 123456 for successful payment</li>
                  </ol>
                </div>

                <Button
                  onClick={() => window.open(result.paymentUrl, '_blank')}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Open Cashfree Payment Page
                </Button>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-medium text-red-800 mb-2">Error Details:</h4>
                <p className="text-sm text-red-600">{result.error}</p>
                
                <div className="mt-4 p-3 bg-red-100 rounded-lg">
                  <h5 className="font-medium text-red-800 mb-1">Troubleshooting:</h5>
                  <ul className="text-xs text-red-700 space-y-1">
                    <li>• Check if Cashfree credentials are set in .env.local</li>
                    <li>• Verify CASHFREE_APP_ID and CASHFREE_SECRET_KEY</li>
                    <li>• Ensure NEXT_PUBLIC_CASHFREE_MODE is set to 'sandbox'</li>
                    <li>• Check browser console for detailed errors</li>
                  </ul>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-6 mt-6"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Testing Instructions
          </h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-blue-600">1</span>
              </div>
              <div>
                <strong>Environment Setup:</strong> Ensure you have added your Cashfree sandbox credentials to .env.local
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-blue-600">2</span>
              </div>
              <div>
                <strong>Test Data:</strong> Use the pre-filled test data or modify as needed
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-blue-600">3</span>
              </div>
              <div>
                <strong>Payment Testing:</strong> Use test card 4111 1111 1111 1111 with any CVV and future date
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-blue-600">4</span>
              </div>
              <div>
                <strong>Callback Testing:</strong> After payment, you'll be redirected to /payment/callback
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
