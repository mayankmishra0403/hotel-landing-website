'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

export default function PaymentDebugPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)

  const testPaymentOrder = async () => {
    setIsLoading(true)
    setResponse(null)

    try {
      const testData = {
        bookingId: 'test-booking-' + Date.now(),
        userId: 'test-user-456',
        guestName: 'John Doe',
        email: 'john.doe@example.com',
        phone: '9876543210',
        checkInDate: '2025-10-10',
        checkOutDate: '2025-10-12',
        roomType: 'Deluxe Room',
        guests: 2,
        totalAmount: 100,
        selectedServices: [
          { name: 'Spa Service', price: 50 }
        ],
        specialRequests: 'Late checkout'
      }

      console.log('📤 Testing Cashfree API with data:', testData)

  const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      })

      const result = await response.json()
      
      setResponse({
        status: response.status,
        statusText: response.statusText,
        ...result
      })

      if (!response.ok) {
        throw new Error(result.message || result.error || 'API call failed')
      }

      toast.success('Payment order created successfully!')
      
    } catch (error: any) {
      console.error('❌ Error:', error)
      toast.error(error.message || 'Failed to create payment order')
      setResponse((prev: any) => ({
        ...prev,
        clientError: error.message
      }))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Payment Debug Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Cashfree Payment API</h2>
          <p className="text-gray-600 mb-4">
            Test your updated Cashfree credentials with the payment order creation API.
          </p>
          
          <Button
            onClick={testPaymentOrder}
            disabled={isLoading}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Testing Cashfree API...
              </div>
            ) : (
              'Test Payment Order Creation'
            )}
          </Button>
        </div>

        {response && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">API Response</h3>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
